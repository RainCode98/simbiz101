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

    // Get fresh company data
    const company = await db.company.findUnique({
      where: { id: companyId },
      include: {
        employees: {
          select: {
            id: true,
            name: true,
            role: true,
            skill: true,
            salary: true,
            happiness: true,
            projectId: true,
          }
        }
      }
    });

    if (!company) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      company: {
        id: company.id,
        name: company.name,
        country: company.country,
        money: company.money,
        revenue: company.revenue,
        expenses: company.expenses,
        happiness: company.happiness,
        reputation: company.reputation,
        level: company.level,
        employees: company.employees,
        createdAt: company.createdAt,
        updatedAt: company.updatedAt
      }
    });
  } catch (error) {
    console.error('Refresh company data error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}