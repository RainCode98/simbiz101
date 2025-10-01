import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { employeeId, companyId } = await request.json();

    if (!employeeId || !companyId) {
      return NextResponse.json(
        { error: 'Employee ID and Company ID are required' },
        { status: 400 }
      );
    }

    // Get the employee to verify they belong to the company
    const employee = await db.employee.findUnique({
      where: { id: employeeId }
    });

    if (!employee) {
      return NextResponse.json(
        { error: 'Employee not found' },
        { status: 404 }
      );
    }

    if (employee.companyId !== companyId) {
      return NextResponse.json(
        { error: 'Employee does not belong to this company' },
        { status: 403 }
      );
    }

    // Check if employee is currently on a project
    if (employee.projectId) {
      return NextResponse.json(
        { error: 'Cannot fire employee who is currently working on a project' },
        { status: 400 }
      );
    }

    // Delete the employee
    await db.employee.delete({
      where: { id: employeeId }
    });

    return NextResponse.json({
      message: 'Employee fired successfully'
    });
  } catch (error) {
    console.error('Fire employee error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}