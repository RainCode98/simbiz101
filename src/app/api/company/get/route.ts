import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const company = await db.company.findUnique({
      where: { userId },
      include: { user: true }
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
        createdAt: company.createdAt,
        updatedAt: company.updatedAt
      }
    });
  } catch (error) {
    console.error('Get company error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}