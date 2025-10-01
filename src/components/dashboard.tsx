"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, TrendingDown, Users, DollarSign, Heart, Award, Building2, UserPlus, Play, Clock } from 'lucide-react';
import { formatCurrency } from '@/lib/currency';
import { ProjectsTab } from '@/components/tabs/projects-tab';
import { EmployeesTab } from '@/components/tabs/employees-tab';
import { InvestmentTab } from '@/components/tabs/investment-tab';
import { EarnTab } from '@/components/tabs/earn-tab';
import { AssetsTab } from '@/components/tabs/assets-tab';
import { CollectiblesTab } from '@/components/tabs/collectibles-tab';
import { toast } from '@/hooks/use-toast';
import HiringModal from '@/components/HiringModal';
import { ProjectsSection } from '@/components/ProjectsSection';

interface DashboardProps {
  user: any;
  company: any;
  onLogout: () => void;
}

export function Dashboard({ user, company, onLogout }: DashboardProps) {
  const [companyData, setCompanyData] = useState(company);
  const [employees, setEmployees] = useState<any[]>([]);
  const [availableProjects, setAvailableProjects] = useState<any[]>([]);
  const [activeProjects, setActiveProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isHiringModalOpen, setIsHiringModalOpen] = useState(false);

  // Fetch initial data
  useEffect(() => {
    fetchEmployees();
    fetchAvailableProjects();
    fetchActiveProjects();
    setLoading(false);
  }, [companyData.id]);

  // Real-time updates for active projects
  useEffect(() => {
    const interval = setInterval(() => {
      if (activeProjects.length > 0) {
        fetchActiveProjects();
      }
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [activeProjects.length, companyData.id]);

  const fetchEmployees = async () => {
    try {
      const response = await fetch(`/api/employees/hire?companyId=${companyData.id}`);
      const data = await response.json();
      if (response.ok) {
        setEmployees(data.employees);
      }
    } catch (error) {
      console.error('Failed to fetch employees:', error);
    }
  };

  const fetchAvailableProjects = async () => {
    try {
      const response = await fetch(`/api/projects/available?companyId=${companyData.id}`);
      const data = await response.json();
      if (response.ok) {
        setAvailableProjects(data.projects);
      }
    } catch (error) {
      console.error('Failed to fetch available projects:', error);
    }
  };

  const fetchActiveProjects = async () => {
    try {
      const response = await fetch(`/api/projects/active?companyId=${companyData.id}`);
      const data = await response.json();
      if (response.ok) {
        setActiveProjects(data.projects);
        // Check for completed projects and update company money
        const completedProjects = data.projects.filter((p: any) => p.status === 'completed' && p.progress === 100);
        if (completedProjects.length > 0) {
          // Refresh company data to get updated money
          refreshCompanyData();
        }
      }
    } catch (error) {
      console.error('Failed to fetch active projects:', error);
    }
  };

  const refreshCompanyData = async () => {
    try {
      const response = await fetch(`/api/company/get?userId=${user.id}`);
      const data = await response.json();
      if (response.ok) {
        setCompanyData(data.company);
      }
    } catch (error) {
      console.error('Failed to refresh company data:', error);
    }
  };

  const hireEmployee = async (name: string, role: string, skill: number) => {
    try {
      const response = await fetch('/api/employees/hire', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyId: companyData.id,
          name,
          role,
          skill
        })
      });

      const data = await response.json();
      if (response.ok) {
        await fetchEmployees();
        await refreshCompanyData(); // Update balance after hiring
        toast({
          title: "Employee Hired!",
          description: `${name} has joined your team as a ${role}`,
        });
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to hire employee',
        variant: "destructive",
      });
    }
  };

  const handleHireEmployee = async (employee: any) => {
    try {
      const response = await fetch('/api/employees/hire', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyId: companyData.id,
          name: employee.name,
          role: employee.role,
          skill: employee.skill,
          salary: employee.salary
        })
      });

      const data = await response.json();
      if (response.ok) {
        await fetchEmployees();
        await refreshCompanyData(); // Update balance after hiring
        toast({
          title: "Employee Hired!",
          description: `${employee.name} has joined your team as a ${employee.role}`,
        });
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to hire employee',
        variant: "destructive",
      });
    }
  };

  const startProject = async (projectData: any, selectedEmployeeIds: string[]) => {
    try {
      const response = await fetch('/api/projects/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyId: companyData.id,
          projectId: projectData.id,
          projectData,
          employeeIds: selectedEmployeeIds
        })
      });

      const data = await response.json();
      if (response.ok) {
        await fetchActiveProjects();
        await fetchAvailableProjects();
        await fetchEmployees();
        toast({
          title: "Project Started!",
          description: `${projectData.name} is now in progress`,
        });
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to start project',
        variant: "destructive",
      });
    }
  };

  const completeProject = async (projectId: string) => {
    try {
      const response = await fetch('/api/projects/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          companyId: companyData.id
        })
      });

      const data = await response.json();
      if (response.ok) {
        await refreshCompanyData();
        await fetchActiveProjects();
        await fetchEmployees();
        toast({
          title: "Project Completed!",
          description: data.message,
        });
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to complete project',
        variant: "destructive",
      });
    }
  };

  // Calculate metrics
  const totalEmployees = employees.length;
  const availableEmployees = employees.filter(emp => !emp.projectId);
  const developers = employees.filter(emp => emp.role === 'Developer');
  const designers = employees.filter(emp => emp.role === 'Designer');

  const hasRequiredEmployees = developers.length >= 2 && designers.length >= 1;
  const canStartProject = hasRequiredEmployees && availableEmployees.length >= 3;

  const formatTimeRemaining = (milliseconds: number) => {
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-primary">{companyData.name}</h1>
            <p className="text-muted-foreground">
              {companyData.country} • CEO: {user.username} • Level {companyData.level}
            </p>
          </div>
          <Button variant="outline" onClick={onLogout} className="font-mono">
            Logout
          </Button>
        </div>

        {/* Main Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cash</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {formatCurrency(companyData.money, companyData.country)}
              </div>
              <p className="text-xs text-muted-foreground">
                Balance
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Employees</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalEmployees}</div>
              <p className="text-xs text-muted-foreground">
                {availableEmployees.length} available
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
              <Play className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeProjects.length}</div>
              <p className="text-xs text-muted-foreground">
                In progress
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Team Status</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {hasRequiredEmployees ? "✓" : "✗"}
              </div>
              <p className="text-xs text-muted-foreground">
                {hasRequiredEmployees ? "Ready for projects" : "Need more staff"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Getting Started Guide */}
        {!hasRequiredEmployees && (
          <Card className="border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="text-orange-800">🚀 Getting Started</CardTitle>
              <CardDescription className="text-orange-600">
                Follow these steps to build your business empire
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    developers.length >= 2 ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
                  }`}>
                    {developers.length >= 2 ? '✓' : '1'}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Hire 2 Developers (Skill: 20)</p>
                    <p className="text-sm text-muted-foreground">
                      Current: {developers.length}/2 Developers
                    </p>
                  </div>
                  {developers.length < 2 && (
                    <Button 
                      size="sm" 
                      onClick={() => setIsHiringModalOpen(true)}
                      className="font-mono"
                    >
                      <UserPlus className="h-4 w-4 mr-1" />
                      Hire Developer
                    </Button>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    designers.length >= 1 ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
                  }`}>
                    {designers.length >= 1 ? '✓' : '2'}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Hire 1 Designer (Skill: 15)</p>
                    <p className="text-sm text-muted-foreground">
                      Current: {designers.length}/1 Designer
                    </p>
                  </div>
                  {designers.length < 1 && (
                    <Button 
                      size="sm" 
                      onClick={() => setIsHiringModalOpen(true)}
                      className="font-mono"
                    >
                      <UserPlus className="h-4 w-4 mr-1" />
                      Hire Designer
                    </Button>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    canStartProject ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
                  }`}>
                    {canStartProject ? '✓' : '3'}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Start Your First Project</p>
                    <p className="text-sm text-muted-foreground">
                      {canStartProject ? 'Ready to start projects!' : 'Complete hiring first'}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Projects Section */}
        <ProjectsSection
          companyId={companyData.id}
          company={companyData}
          employees={employees}
          onProjectStarted={() => {
            fetchActiveProjects();
            fetchEmployees();
          }}
          onProjectCompleted={() => {
            refreshCompanyData();
            fetchActiveProjects();
            fetchEmployees();
          }}
        />

        {/* Old Active Projects - Commented Out */}
        {/* {activeProjects.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Active Projects</h3>
            <div className="grid gap-4">
              {activeProjects.map((project) => (
                <Card key={project.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{project.name}</CardTitle>
                        <CardDescription>
                          {project.type} • {project.employees.length} employees assigned
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={project.isOverdue ? "destructive" : "default"}>
                          {project.status === 'completed' ? 'Completed' : 'In Progress'}
                        </Badge>
                        {project.bonus > 0 && (
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            +{formatCurrency(project.bonus, companyData.country).replace(/[0-9.,]/g, '').trim()} Bonus
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Progress</span>
                          <span>{project.progress}%</span>
                        </div>
                        <Progress value={project.progress} className="h-2" />
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Reward</p>
                          <p className="font-semibold">
                            {formatCurrency(project.baseReward, companyData.country)}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Time Remaining</p>
                          <p className="font-semibold">
                            {project.timeRemaining > 0 ? formatTimeRemaining(project.timeRemaining) : 'Completed'}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Team</p>
                          <p className="font-semibold">
                            {project.employees.map((emp: any) => emp.name).join(', ')}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Avg Skill</p>
                          <p className="font-semibold">
                            {Math.round(project.employees.reduce((sum: number, emp: any) => sum + emp.skill, 0) / project.employees.length)}
                          </p>
                        </div>
                      </div>

                      {project.status === 'completed' && project.progress === 100 && (
                        <Button 
                          onClick={() => completeProject(project.id)}
                          className="w-full font-mono"
                        >
                          Collect Reward
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )} */}

        {/* Old Available Projects - Commented Out */}
        {/* {canStartProject && availableProjects.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Available Projects</h3>
            <div className="grid gap-4">
              {availableProjects.map((project) => {
                const canAssign = 
                  (project.type === 'Development' && availableEmployees.filter(e => e.role === 'Developer').length >= 1) ||
                  (project.type === 'Design' && availableEmployees.filter(e => e.role === 'Designer').length >= 1);

                return (
                  <Card key={project.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">{project.name}</CardTitle>
                          <CardDescription>
                            {project.description} • {project.type} • Skill Required: {project.requiredSkill}
                          </CardDescription>
                        </div>
                        <div className="text-right">
                          <Badge variant="secondary" className="mb-1">
                            {formatCurrency(project.baseReward, companyData.country)}
                          </Badge>
                          <p className="text-xs text-muted-foreground">
                            +20% bonus if on time
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                          Estimated: {project.estimatedDays} days • 
                          Difficulty: {project.difficulty}
                        </p>
                        <Button 
                          size="sm"
                          disabled={!canAssign}
                          onClick={() => {
                            // For now, auto-assign suitable employees
                            const suitableEmployees = availableEmployees.filter(emp => 
                              project.type === 'Development' ? emp.role === 'Developer' : emp.role === 'Designer'
                            ).slice(0, project.type === 'Development' ? 2 : 1);
                            
                            if (suitableEmployees.length > 0) {
                              startProject(project, suitableEmployees.map(emp => emp.id));
                            }
                          }}
                          className="font-mono"
                        >
                          {canAssign ? 'Start Project' : 'Need Available Staff'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )} */}

        {/* Employee Overview */}
        {employees.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Your Team
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {employees.map((employee) => (
                  <div key={employee.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold">
                          {employee.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{employee.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {employee.role} • Skill: {employee.skill} • 
                          Salary: {formatCurrency(employee.salary, companyData.country)}/month
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={employee.projectId ? "default" : "secondary"}>
                        {employee.projectId ? 'Working' : 'Available'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Hiring Modal */}
        <HiringModal
          isOpen={isHiringModalOpen}
          onClose={() => setIsHiringModalOpen(false)}
          onHire={handleHireEmployee}
          currentBalance={companyData.money}
          currentEmployees={employees}
          country={companyData.country}
        />
      </div>
    </div>
  );
}