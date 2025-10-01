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

    // Get available projects (not yet started by this company)
    const availableProjects = [
      {
        id: "proj_001",
        name: "Simple Landing Page",
        description: "Build a basic landing page for a small business",
        type: "Development",
        requiredSkills: { Developer: 20, Designer: 10 },
        requiredEmployees: 2,
        baseReward: 30000,
        estimatedMinutes: 30, // 30 minutes
        difficulty: "Easy"
      },
      {
        id: "proj_002", 
        name: "Mobile App UI",
        description: "Design user interface for a mobile application",
        type: "Design",
        requiredSkills: { Designer: 15, Developer: 10 },
        requiredEmployees: 2,
        baseReward: 45000,
        estimatedMinutes: 45, // 45 minutes
        difficulty: "Easy"
      },
      {
        id: "proj_003",
        name: "E-commerce Website",
        description: "Build a modern e-commerce platform with payment integration",
        type: "Development", 
        requiredSkills: { Developer: 35, Designer: 20, QA: 15 },
        requiredEmployees: 3,
        baseReward: 150000,
        estimatedMinutes: 120, // 2 hours
        difficulty: "Medium"
      },
      {
        id: "proj_004",
        name: "SaaS Dashboard",
        description: "Create a comprehensive SaaS analytics dashboard",
        type: "Development",
        requiredSkills: { Developer: 50, Designer: 25, Manager: 20 },
        requiredEmployees: 4,
        baseReward: 500000,
        estimatedMinutes: 240, // 4 hours
        difficulty: "Medium"
      },
      {
        id: "proj_005",
        name: "Enterprise CRM",
        description: "Build a full-featured customer relationship management system",
        type: "Development",
        requiredSkills: { Developer: 70, Designer: 30, Manager: 35, QA: 25 },
        requiredEmployees: 5,
        baseReward: 1500000,
        estimatedMinutes: 480, // 8 hours
        difficulty: "Hard"
      },
      {
        id: "proj_006",
        name: "FinTech Platform",
        description: "Develop a complete financial technology platform with trading features",
        type: "Development",
        requiredSkills: { Developer: 85, Designer: 40, Manager: 45, QA: 35 },
        requiredEmployees: 6,
        baseReward: 5000000,
        estimatedMinutes: 720, // 12 hours
        difficulty: "Hard"
      },
      {
        id: "proj_007",
        name: "AI-Powered Analytics",
        description: "Create an advanced AI-powered business analytics platform",
        type: "Development",
        requiredSkills: { Developer: 95, Designer: 50, Manager: 55, QA: 45 },
        requiredEmployees: 7,
        baseReward: 15000000,
        estimatedMinutes: 900, // 15 hours
        difficulty: "Expert"
      },
      {
        id: "proj_008",
        name: "Global Marketplace",
        description: "Build a large-scale global marketplace with multi-vendor support",
        type: "Development",
        requiredSkills: { Developer: 100, Designer: 60, Manager: 70, QA: 50 },
        requiredEmployees: 8,
        baseReward: 50000000,
        estimatedMinutes: 1080, // 18 hours
        difficulty: "Expert"
      }
    ];

    // Filter out projects that are already in progress
    const inProgressProjects = await db.project.findMany({
      where: { 
        companyId,
        status: { in: ['in_progress', 'completed'] }
      },
      select: { name: true }
    });

    const inProgressNames = new Set(inProgressProjects.map(p => p.name));
    const filteredProjects = availableProjects.filter(p => !inProgressNames.has(p.name));

    return NextResponse.json({
      projects: filteredProjects
    });
  } catch (error) {
    console.error('Get available projects error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}