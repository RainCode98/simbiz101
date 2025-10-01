import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get('companyId');

    if (!companyId) {
      return NextResponse.json(
        { error: 'Company ID is required' },
        { status: 400 }
      );
    }

    // Get all in-progress projects for this company
    const projects = await db.project.findMany({
      where: { 
        companyId,
        status: 'in_progress'
      },
      include: {
        company: true
      }
    });

    const now = new Date();
    const paymentResults = [];

    console.log(`Processing payments for company ${companyId}, found ${projects.length} active projects`);

    for (const project of projects) {
      if (!project.startTime || !project.endTime) {
        console.log(`Project ${project.name} missing start/end time, skipping`);
        continue;
      }

      const startTime = new Date(project.startTime);
      const endTime = new Date(project.endTime);
      
      // Calculate total project duration in minutes
      const totalMinutes = (endTime.getTime() - startTime.getTime()) / (1000 * 60);
      
      // Calculate payment rate per minute
      const paymentRate = project.baseReward / totalMinutes;
      
      // Determine last payment time (or project start time if no payments yet)
      const lastPaymentTime = project.lastPaymentTime ? new Date(project.lastPaymentTime) : startTime;
      
      // Calculate minutes elapsed since last payment
      const minutesSinceLastPayment = (now.getTime() - lastPaymentTime.getTime()) / (1000 * 60);
      
      console.log(`Project ${project.name}: Total minutes: ${totalMinutes}, Payment rate: ${paymentRate}, Minutes since last payment: ${minutesSinceLastPayment}`);
      
      // Only process if at least 1 minute has passed
      if (minutesSinceLastPayment >= 1) {
        // Calculate payment for this period
        const paymentAmount = Math.min(
          paymentRate * Math.floor(minutesSinceLastPayment),
          project.baseReward - project.amountPaid // Don't exceed total reward
        );

        console.log(`Project ${project.name}: Payment amount: ${paymentAmount}, Already paid: ${project.amountPaid}`);

        if (paymentAmount > 0) {
          // Update project payment
          const updatedProject = await db.project.update({
            where: { id: project.id },
            data: {
              amountPaid: project.amountPaid + paymentAmount,
              lastPaymentTime: new Date(now.getTime() - (minutesSinceLastPayment % 1) * 1000 * 60), // Round down to last minute
              updatedAt: now
            }
          });

          // Update company money
          await db.company.update({
            where: { id: companyId },
            data: {
              money: project.company.money + paymentAmount,
              revenue: project.company.revenue + paymentAmount,
              updatedAt: now
            }
          });

          paymentResults.push({
            projectId: project.id,
            projectName: project.name,
            paymentAmount,
            totalPaid: updatedProject.amountPaid,
            minutesProcessed: Math.floor(minutesSinceLastPayment)
          });

          console.log(`Project ${project.name}: Payment processed successfully`);
        }
      } else {
        console.log(`Project ${project.name}: Not enough time elapsed for payment (${minutesSinceLastPayment} minutes)`);
      }
    }

    return NextResponse.json({
      success: true,
      paymentsProcessed: paymentResults.length,
      paymentResults,
      timestamp: now
    });
  } catch (error) {
    console.error('Payment processing error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET endpoint to check payment status
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

    const projects = await db.project.findMany({
      where: { 
        companyId,
        status: 'in_progress'
      },
      select: {
        id: true,
        name: true,
        baseReward: true,
        amountPaid: true,
        startTime: true,
        endTime: true,
        lastPaymentTime: true
      }
    });

    const paymentStatus = projects.map(project => {
      if (!project.startTime || !project.endTime) {
        return {
          projectId: project.id,
          projectName: project.name,
          totalReward: project.baseReward,
          amountPaid: project.amountPaid,
          remainingAmount: project.baseReward - project.amountPaid,
          paymentProgress: (project.amountPaid / project.baseReward) * 100,
          nextPaymentIn: null
        };
      }

      const now = new Date();
      const startTime = new Date(project.startTime);
      const endTime = new Date(project.endTime);
      const lastPayment = project.lastPaymentTime ? new Date(project.lastPaymentTime) : startTime;
      
      const totalMinutes = (endTime.getTime() - startTime.getTime()) / (1000 * 60);
      const paymentRate = project.baseReward / totalMinutes;
      
      // Time until next payment (next minute boundary)
      const timeSinceLastPayment = now.getTime() - lastPayment.getTime();
      const nextPaymentIn = Math.max(0, 60000 - (timeSinceLastPayment % 60000)); // 60 seconds = 1 minute

      return {
        projectId: project.id,
        projectName: project.name,
        totalReward: project.baseReward,
        amountPaid: project.amountPaid,
        remainingAmount: project.baseReward - project.amountPaid,
        paymentProgress: (project.amountPaid / project.baseReward) * 100,
        paymentRate,
        nextPaymentIn: Math.round(nextPaymentIn / 1000), // Convert to seconds
        lastPaymentTime: project.lastPaymentTime
      };
    });

    return NextResponse.json({
      paymentStatus,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Payment status error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}