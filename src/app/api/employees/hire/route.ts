import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { companyId, name, role, skill, salary } = await request.json();

    if (!companyId || !name || !role || skill === undefined) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Get company to check balance
    const company = await db.company.findUnique({
      where: { id: companyId }
    });

    if (!company) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      );
    }

    // Use the provided salary directly (frontend already calculated it correctly)
    const baseSalaries = {
      Developer: 3000,
      Designer: 2500,
      Manager: 4000,
      QA: 2000
    };
    const finalSalary = salary || baseSalaries[role as keyof typeof baseSalaries] || 3000;

    // Check if company has enough balance (no upfront cost required)
    // Salary will be deducted hourly
    if (company.money < 0) {
      return NextResponse.json(
        { error: `Company balance is negative. Cannot hire new employees.` },
        { status: 400 }
      );
    }

    // Create employee (no upfront cost)
    const result = await db.$transaction(async (tx) => {
      // Create employee
      const employee = await tx.employee.create({
        data: {
          name: name.trim(),
          role,
          skill,
          salary: finalSalary,
          companyId,
        },
      });

      return employee;
    });

    return NextResponse.json({
      employee: {
        id: result.id,
        name: result.name,
        role: result.role,
        skill: result.skill,
        salary: result.salary,
        happiness: result.happiness,
      },
      message: `Employee hired successfully! Salary will be deducted hourly.`
    });
  } catch (error) {
    console.error('Hire employee error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get('companyId');

    if (!companyId) {
      return NextResponse.json(
        { error: 'Company ID is required' },
        { status: 400 }
      );
    }

    const employees = await db.employee.findMany({
      where: { companyId },
      orderBy: { createdAt: 'asc' }
    });

    return NextResponse.json({
      employees: employees.map(emp => ({
        id: emp.id,
        name: emp.name,
        role: emp.role,
        skill: emp.skill,
        salary: emp.salary,
        happiness: emp.happiness,
        projectId: emp.projectId,
      }))
    });
  } catch (error) {
    console.error('Get employees error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}