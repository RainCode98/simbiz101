import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { companyId } = await request.json();

    if (!companyId) {
      return NextResponse.json(
        { error: 'Company ID is required' },
        { status: 400 }
      );
    }

    // Get company with all employees
    const company = await db.company.findUnique({
      where: { id: companyId },
      include: {
        employees: true
      }
    });

    if (!company) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      );
    }

    // Calculate hourly salary deduction (monthly salary / 730 hours ≈ hourly rate)
    const totalHourlyDeduction = company.employees.reduce((total, employee) => {
      const hourlyRate = employee.salary / 730; // Approximate hours in a month
      return total + hourlyRate;
    }, 0);

    // Deduct salary from company balance (allow negative balance)
    const updatedCompany = await db.company.update({
      where: { id: companyId },
      data: {
        money: {
          decrement: totalHourlyDeduction
        },
        expenses: {
          increment: totalHourlyDeduction
        }
      }
    });

    return NextResponse.json({
      success: true,
      deductedAmount: totalHourlyDeduction,
      newBalance: updatedCompany.money,
      employeeCount: company.employees.length,
      message: `Deducted ${totalHourlyDeduction.toFixed(2)} for ${company.employees.length} employee(s)`
    });
  } catch (error) {
    console.error('Salary deduction error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Global function to deduct salaries for all companies
export async function deductAllSalaries() {
  try {
    const companies = await db.company.findMany({
      include: {
        employees: true
      }
    });

    const results = [];

    for (const company of companies) {
      if (company.employees.length === 0) continue;

      // Calculate hourly salary deduction
      const totalHourlyDeduction = company.employees.reduce((total, employee) => {
        const hourlyRate = employee.salary / 730; // Approximate hours in a month
        return total + hourlyRate;
      }, 0);

      // Deduct salary from company balance
      const updatedCompany = await db.company.update({
        where: { id: company.id },
        data: {
          money: {
            decrement: totalHourlyDeduction
          },
          expenses: {
            increment: totalHourlyDeduction
          }
        }
      });

      results.push({
        companyId: company.id,
        companyName: company.name,
        deductedAmount: totalHourlyDeduction,
        newBalance: updatedCompany.money,
        employeeCount: company.employees.length
      });
    }

    return {
      success: true,
      processedCompanies: results.length,
      totalDeducted: results.reduce((sum, r) => sum + r.deductedAmount, 0),
      results
    };
  } catch (error) {
    console.error('Mass salary deduction error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}