"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Briefcase, Clock, CheckCircle, AlertCircle, Play } from 'lucide-react';

interface ProjectsTabProps {
  company: any;
  user: any;
}

export function ProjectsTab({ company, user }: ProjectsTabProps) {
  const [projects] = useState([
    {
      id: 1,
      name: "Website Development",
      description: "Build a professional website for your company",
      status: "active",
      progress: 65,
      reward: 5000,
      deadline: "3 days",
      difficulty: "Medium"
    },
    {
      id: 2,
      name: "Marketing Campaign",
      description: "Launch a digital marketing campaign",
      status: "completed",
      progress: 100,
      reward: 3000,
      deadline: "Completed",
      difficulty: "Easy"
    },
    {
      id: 3,
      name: "Product Research",
      description: "Research new product opportunities",
      status: "locked",
      progress: 0,
      reward: 8000,
      deadline: "7 days",
      difficulty: "Hard"
    },
    {
      id: 4,
      name: "Partnership Deal",
      description: "Secure a partnership with another company",
      status: "available",
      progress: 0,
      reward: 12000,
      deadline: "5 days",
      difficulty: "Medium"
    }
  ]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Play className="h-4 w-4 text-blue-500" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'locked':
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default">Active</Badge>;
      case 'completed':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Completed</Badge>;
      case 'locked':
        return <Badge variant="outline">Locked</Badge>;
      default:
        return <Badge variant="secondary">Available</Badge>;
    }
  };

  const getDifficultyBadge = (difficulty: string) => {
    const colors = {
      Easy: "bg-green-100 text-green-800",
      Medium: "bg-yellow-100 text-yellow-800",
      Hard: "bg-red-100 text-red-800"
    };
    return (
      <Badge className={colors[difficulty as keyof typeof colors] || "bg-gray-100 text-gray-800"}>
        {difficulty}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-primary">Projects</h2>
          <p className="text-muted-foreground">Manage and complete business projects</p>
        </div>
        <Button className="font-mono">
          <Briefcase className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="available">Available</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="locked">Locked</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {projects.filter(p => p.status === 'active').map(project => (
            <Card key={project.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(project.status)}
                    <CardTitle className="text-lg">{project.name}</CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(project.status)}
                    {getDifficultyBadge(project.difficulty)}
                  </div>
                </div>
                <CardDescription>{project.description}</CardDescription>
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
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Reward: ${project.reward.toLocaleString()}</span>
                    <span className="text-muted-foreground">Deadline: {project.deadline}</span>
                  </div>
                  <Button className="w-full font-mono">Continue Project</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="available" className="space-y-4">
          {projects.filter(p => p.status === 'available').map(project => (
            <Card key={project.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(project.status)}
                    <CardTitle className="text-lg">{project.name}</CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(project.status)}
                    {getDifficultyBadge(project.difficulty)}
                  </div>
                </div>
                <CardDescription>{project.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Reward: ${project.reward.toLocaleString()}</span>
                    <span className="text-muted-foreground">Deadline: {project.deadline}</span>
                  </div>
                  <Button className="w-full font-mono">Start Project</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {projects.filter(p => p.status === 'completed').map(project => (
            <Card key={project.id} className="opacity-75">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(project.status)}
                    <CardTitle className="text-lg">{project.name}</CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(project.status)}
                    {getDifficultyBadge(project.difficulty)}
                  </div>
                </div>
                <CardDescription>{project.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-green-600 font-medium">Reward: +${project.reward.toLocaleString()}</span>
                  <span className="text-muted-foreground">Completed</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="locked" className="space-y-4">
          {projects.filter(p => p.status === 'locked').map(project => (
            <Card key={project.id} className="opacity-50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(project.status)}
                    <CardTitle className="text-lg">{project.name}</CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(project.status)}
                    {getDifficultyBadge(project.difficulty)}
                  </div>
                </div>
                <CardDescription>{project.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Reward: ${project.reward.toLocaleString()}</span>
                    <span className="text-muted-foreground">Requires: Level 5</span>
                  </div>
                  <Button disabled className="w-full font-mono">Locked</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}