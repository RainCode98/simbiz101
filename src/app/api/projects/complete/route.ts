import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { projectId, companyId } = await request.json();

    if (!projectId || !companyId) {
      return NextResponse.json(
        { error: 'Project ID and Company ID are required' },
        { status: 400 }
      );
    }

    // Get project details
    const project = await db.project.findUnique({
      where: { id: projectId },
      include: {
        employees: true
      }
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    if (project.status !== 'in_progress') {
      return NextResponse.json(
        { error: 'Project is not in progress' },
        { status: 400 }
      );
    }

    // Calculate final payment (remaining amount + bonus)
    const totalReward = project.baseReward + (project.bonus || 0);
    const remainingPayment = totalReward - project.amountPaid;
    const finalPayment = Math.max(0, remainingPayment);

    // Update project status and mark as fully paid
    await db.project.update({
      where: { id: projectId },
      data: {
        status: 'completed',
        progress: 100,
        amountPaid: totalReward,
        updatedAt: new Date()
      }
    });

    // Free up employees
    await db.employee.updateMany({
      where: { projectId },
      data: { projectId: null }
    });

    // Update company money with final payment only
    await db.company.update({
      where: { id: companyId },
      data: {
        money: {
          increment: finalPayment
        },
        revenue: {
          increment: finalPayment
        },
        updatedAt: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      totalReward,
      amountAlreadyPaid: project.amountPaid,
      finalPayment,
      baseReward: project.baseReward,
      bonus: project.bonus || 0,
      message: `Project completed! Final payment of ${finalPayment.toFixed(2)} received (Total: ${totalReward.toFixed(2)})`
    });
  } catch (error) {
    console.error('Complete project error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}