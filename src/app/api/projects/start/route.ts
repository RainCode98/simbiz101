import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { companyId, projectId, projectData, employeeIds } = await request.json();

    if (!companyId || !projectId || !projectData || !employeeIds) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Calculate project duration based on employee skills
    const employees = await db.employee.findMany({
      where: { 
        id: { in: employeeIds },
        companyId 
      }
    });

    if (employees.length === 0) {
      return NextResponse.json(
        { error: 'No valid employees found' },
        { status: 400 }
      );
    }

    // Check if employees meet skill requirements
    const employeeSkills = employees.reduce((acc, emp) => {
      if (!acc[emp.role]) acc[emp.role] = [];
      acc[emp.role].push(emp.skill);
      return acc;
    }, {} as Record<string, number[]>);

    const meetsRequirements = Object.entries(projectData.requiredSkills).every(([role, requiredSkill]) => {
      const roleSkills = employeeSkills[role] || [];
      const maxSkill = Math.max(...roleSkills, 0);
      return maxSkill >= requiredSkill;
    });

    if (!meetsRequirements) {
      return NextResponse.json(
        { error: 'Team does not meet skill requirements for this project' },
        { status: 400 }
      );
    }

    // Calculate average skill for the project
    const avgSkill = employees.reduce((sum, emp) => sum + emp.skill, 0) / employees.length;
    
    // Calculate duration (in minutes) - lower skill = longer duration
    const baseDuration = projectData.estimatedMinutes; // Already in minutes
    const skillFactor = Math.max(0.5, Math.min(2.0, 50 / avgSkill)); // Skill between 1-100 affects duration
    const actualDuration = baseDuration * skillFactor;

    // Calculate deadline and bonus
    const startTime = new Date();
    const deadline = new Date(startTime.getTime() + (baseDuration * 60 * 1000)); // Base deadline
    const endTime = new Date(startTime.getTime() + (actualDuration * 60 * 1000)); // Actual end time
    const bonusAmount = endTime <= deadline ? projectData.baseReward * 0.2 : 0; // 20% bonus if on time

    // Create project
    const project = await db.project.create({
      data: {
        name: projectData.name,
        description: projectData.description,
        type: projectData.type,
        requiredSkills: JSON.stringify(projectData.requiredSkills), // Store as JSON string
        baseReward: projectData.baseReward,
        bonus: bonusAmount,
        status: 'in_progress',
        progress: 0,
        startTime,
        endTime,
        deadline,
        lastPaymentTime: startTime, // Set initial payment time
        companyId,
      },
    });

    // Assign employees to project
    await Promise.all(
      employees.map(employee =>
        db.employee.update({
          where: { id: employee.id },
          data: { projectId: project.id }
        })
      )
    );

    return NextResponse.json({
      project: {
        id: project.id,
        name: project.name,
        type: project.type,
        requiredSkills: projectData.requiredSkills,
        baseReward: project.baseReward,
        bonus: project.bonus,
        status: project.status,
        progress: project.progress,
        startTime: project.startTime,
        endTime: project.endTime,
        deadline: project.deadline,
        actualDuration: Math.round(actualDuration),
        employees: employees.map(emp => ({
          id: emp.id,
          name: emp.name,
          role: emp.role,
          skill: emp.skill,
        }))
      }
    });
  } catch (error) {
    console.error('Start project error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}