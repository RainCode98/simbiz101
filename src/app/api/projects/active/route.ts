import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

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
      include: {
        employees: {
          select: {
            id: true,
            name: true,
            role: true,
            skill: true,
          }
        }
      }
    });

    // Fetch the current company data to get accurate balance
    const company = await db.company.findUnique({
      where: { id: companyId }
    });

    // Calculate real-time progress for each project
    const projectsWithProgress = projects.map(project => {
      const now = new Date();
      const startTime = new Date(project.startTime);
      const endTime = new Date(project.endTime);
      
      // Calculate progress based on time elapsed
      const totalTime = endTime.getTime() - startTime.getTime();
      const elapsed = now.getTime() - startTime.getTime();
      const progress = Math.min(100, Math.max(0, (elapsed / totalTime) * 100));

      // Check if project should be completed
      const shouldBeCompleted = now >= endTime;
      
      return {
        id: project.id,
        name: project.name,
        type: project.type,
        requiredSkills: project.requiredSkills ? JSON.parse(project.requiredSkills) : {},
        baseReward: project.baseReward,
        amountPaid: project.amountPaid,
        bonus: project.bonus,
        status: shouldBeCompleted ? 'completed' : project.status,
        progress: shouldBeCompleted ? 100 : Math.round(progress),
        startTime: project.startTime,
        endTime: project.endTime,
        deadline: project.deadline,
        lastPaymentTime: project.lastPaymentTime,
        employees: project.employees,
        timeRemaining: shouldBeCompleted ? 0 : Math.max(0, endTime.getTime() - now.getTime()),
        isOverdue: now > new Date(project.deadline) && !shouldBeCompleted
      };
    });

    // Auto-complete projects that should be finished
    for (const project of projectsWithProgress) {
      if (project.status === 'completed' && project.progress === 100) {
        await db.project.update({
          where: { id: project.id },
          data: { 
            status: 'completed',
            progress: 100,
            updatedAt: new Date()
          }
        });

        // Free up employees
        await db.employee.updateMany({
          where: { projectId: project.id },
          data: { projectId: null }
        });
      } else if (project.status === 'in_progress') {
        // Update the progress in the database for active projects
        await db.project.update({
          where: { id: project.id },
          data: { 
            progress: project.progress,
            updatedAt: new Date()
          }
        });
      }
    }

    return NextResponse.json({
      projects: projectsWithProgress,
      company: company
    });
  } catch (error) {
    console.error('Get active projects error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}