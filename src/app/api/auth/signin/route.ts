import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { username } = await request.json();

    if (!username || username.trim().length < 3) {
      return NextResponse.json(
        { error: 'Username must be at least 3 characters long' },
        { status: 400 }
      );
    }

    // Check if user already exists
    let user = await db.user.findUnique({
      where: { username: username.trim() },
      include: { company: true }
    });

    // Create user if doesn't exist
    if (!user) {
      user = await db.user.create({
        data: {
          username: username.trim(),
        },
        include: { company: true }
      });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        username: user.username,
        hasCompany: !!user.company,
        company: user.company
      }
    });
  } catch (error) {
    console.error('Signin error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}