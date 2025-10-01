"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, UserPlus, Star, TrendingUp, Briefcase } from 'lucide-react';

interface EmployeesTabProps {
  company: any;
  user: any;
}

export function EmployeesTab({ company, user }: EmployeesTabProps) {
  const [employees] = useState([
    {
      id: 1,
      name: "Alex Johnson",
      role: "Lead Developer",
      department: "Technology",
      salary: 85000,
      performance: 92,
      happiness: 88,
      avatar: "/avatars/alex.jpg",
      skills: ["JavaScript", "React", "Node.js"],
      status: "active"
    },
    {
      id: 2,
      name: "Sarah Chen",
      role: "Marketing Manager",
      department: "Marketing",
      salary: 75000,
      performance: 87,
      happiness: 91,
      avatar: "/avatars/sarah.jpg",
      skills: ["SEO", "Content", "Analytics"],
      status: "active"
    },
    {
      id: 3,
      name: "Mike Wilson",
      role: "Sales Representative",
      department: "Sales",
      salary: 65000,
      performance: 78,
      happiness: 73,
      avatar: "/avatars/mike.jpg",
      skills: ["Sales", "CRM", "Negotiation"],
      status: "active"
    }
  ]);

  const [candidates] = useState([
    {
      id: 101,
      name: "Emma Davis",
      role: "UX Designer",
      department: "Design",
      expectedSalary: 70000,
      experience: "5 years",
      skills: ["Figma", "Adobe XD", "Prototyping"],
      availability: "Immediate"
    },
    {
      id: 102,
      name: "James Lee",
      role: "Data Analyst",
      department: "Analytics",
      expectedSalary: 80000,
      experience: "3 years",
      skills: ["Python", "SQL", "Tableau"],
      availability: "2 weeks"
    }
  ]);

  const getPerformanceColor = (performance: number) => {
    if (performance >= 90) return "text-green-600";
    if (performance >= 75) return "text-yellow-600";
    return "text-red-600";
  };

  const getHappinessColor = (happiness: number) => {
    if (happiness >= 80) return "text-green-600";
    if (happiness >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-primary">Employees</h2>
          <p className="text-muted-foreground">Manage your team and hire new talent</p>
        </div>
        <Button className="font-mono">
          <UserPlus className="h-4 w-4 mr-2" />
          Hire Employee
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{company.employees}</div>
            <p className="text-xs text-muted-foreground">Active team members</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Performance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">85%</div>
            <p className="text-xs text-muted-foreground">Team performance</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Happiness</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">84%</div>
            <p className="text-xs text-muted-foreground">Team satisfaction</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Payroll</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$225K</div>
            <p className="text-xs text-muted-foreground">Total salaries</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="current" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="current">Current Employees</TabsTrigger>
          <TabsTrigger value="candidates">Candidates</TabsTrigger>
          <TabsTrigger value="departments">Departments</TabsTrigger>
        </TabsList>

        <TabsContent value="current" className="space-y-4">
          {employees.map(employee => (
            <Card key={employee.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src={employee.avatar} />
                      <AvatarFallback>{employee.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{employee.name}</CardTitle>
                      <CardDescription>{employee.role} • {employee.department}</CardDescription>
                    </div>
                  </div>
                  <Badge variant="outline">Active</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Performance</span>
                        <span className={getPerformanceColor(employee.performance)}>{employee.performance}%</span>
                      </div>
                      <Progress value={employee.performance} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Happiness</span>
                        <span className={getHappinessColor(employee.happiness)}>{employee.happiness}%</span>
                      </div>
                      <Progress value={employee.happiness} className="h-2" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Salary: ${employee.salary.toLocaleString()}/year</p>
                      <div className="flex gap-1 mt-1">
                        {employee.skills.map((skill, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Review</Button>
                      <Button variant="outline" size="sm">Train</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="candidates" className="space-y-4">
          {candidates.map(candidate => (
            <Card key={candidate.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{candidate.name}</CardTitle>
                    <CardDescription>{candidate.role} • {candidate.experience} experience</CardDescription>
                  </div>
                  <Badge variant="secondary">Available in {candidate.availability}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Expected Salary: ${candidate.expectedSalary.toLocaleString()}/year</p>
                    <div className="flex gap-1">
                      {candidate.skills.map((skill, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm">Interview</Button>
                    <Button variant="outline" size="sm">View Profile</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="departments" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {["Technology", "Marketing", "Sales", "Design", "HR", "Finance"].map((dept, index) => (
              <Card key={dept}>
                <CardHeader>
                  <CardTitle className="text-lg">{dept}</CardTitle>
                  <CardDescription>{Math.floor(Math.random() * 5) + 1} employees</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Avg Performance</span>
                      <span>{Math.floor(Math.random() * 20) + 80}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Department Budget</span>
                      <span>${(Math.floor(Math.random() * 50) + 30)}K</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}