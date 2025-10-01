import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { userId, companyName, country } = await request.json();

    if (!userId || !companyName || !country) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    if (companyName.trim().length < 2) {
      return NextResponse.json(
        { error: 'Company name must be at least 2 characters long' },
        { status: 400 }
      );
    }

    // Check if user already has a company
    const existingCompany = await db.company.findUnique({
      where: { userId }
    });

    if (existingCompany) {
      return NextResponse.json(
        { error: 'User already has a company' },
        { status: 400 }
      );
    }

    // Create company
    const company = await db.company.create({
      data: {
        name: companyName.trim(),
        country: country.trim(),
        userId,
      },
      include: { user: true }
    });

    return NextResponse.json({
      company: {
        id: company.id,
        name: company.name,
        country: company.country,
        money: company.money,
        revenue: company.revenue,
        expenses: company.expenses,
        employees: company.employees,
        happiness: company.happiness,
        reputation: company.reputation,
        createdAt: company.createdAt
      }
    });
  } catch (error) {
    console.error('Company creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}