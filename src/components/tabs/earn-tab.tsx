"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Coins, Gift, Target, Zap, Clock, CheckCircle } from 'lucide-react';

interface EarnTabProps {
  company: any;
  user: any;
}

export function EarnTab({ company, user }: EarnTabProps) {
  const [tasks] = useState([
    {
      id: 1,
      title: "Daily Login Bonus",
      description: "Log in to the game every day",
      reward: 100,
      type: "daily",
      progress: 1,
      maxProgress: 1,
      status: "completed",
      icon: <Gift className="h-4 w-4" />
    },
    {
      id: 2,
      title: "Complete 5 Projects",
      description: "Successfully complete 5 business projects",
      reward: 2000,
      type: "achievement",
      progress: 3,
      maxProgress: 5,
      status: "active",
      icon: <Target className="h-4 w-4" />
    },
    {
      id: 3,
      title: "Hire 3 Employees",
      description: "Expand your team by hiring 3 employees",
      reward: 1500,
      type: "achievement",
      progress: 1,
      maxProgress: 3,
      status: "active",
      icon: <Coins className="h-4 w-4" />
    },
    {
      id: 4,
      title: "Reach $50K Revenue",
      description: "Generate $50,000 in monthly revenue",
      reward: 5000,
      type: "milestone",
      progress: 25000,
      maxProgress: 50000,
      status: "active",
      icon: <Zap className="h-4 w-4" />
    }
  ]);

  const [offers] = useState([
    {
      id: 101,
      title: "Watch Advertisement",
      description: "Watch a 30-second advertisement",
      reward: 50,
      type: "video",
      timeRequired: "30 seconds",
      availability: "Unlimited",
      icon: <Zap className="h-4 w-4" />
    },
    {
      id: 102,
      title: "Complete Survey",
      description: "Share your opinion about business games",
      reward: 200,
      type: "survey",
      timeRequired: "5 minutes",
      availability: "3 per day",
      icon: <Target className="h-4 w-4" />
    },
    {
      id: 103,
      title: "Partner Offer",
      description: "Sign up for a business newsletter",
      reward: 300,
      type: "partner",
      timeRequired: "2 minutes",
      availability: "Once",
      icon: <Gift className="h-4 w-4" />
    }
  ]);

  const [milestones] = useState([
    {
      id: 201,
      title: "First Profit",
      description: "Make your first profitable month",
      reward: 1000,
      achieved: true,
      achievedAt: "2024-01-10"
    },
    {
      id: 202,
      title: "Team Leader",
      description: "Hire your first employee",
      reward: 500,
      achieved: true,
      achievedAt: "2024-01-08"
    },
    {
      id: 203,
      title: "Investment Master",
      description: "Earn 10% return on investments",
      reward: 2000,
      achieved: false,
      progress: 7,
      target: 10
    },
    {
      id: 204,
      title: "Empire Builder",
      description: "Reach $100K monthly revenue",
      reward: 10000,
      achieved: false,
      progress: 25000,
      target: 100000
    }
  ]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case "active":
        return <Badge variant="default">Active</Badge>;
      case "locked":
        return <Badge variant="outline">Locked</Badge>;
      default:
        return <Badge variant="secondary">Available</Badge>;
    }
  };

  const totalEarned = tasks.filter(t => t.status === "completed").reduce((sum, task) => sum + task.reward, 0);
  const potentialEarnings = tasks.filter(t => t.status === "active").reduce((sum, task) => sum + task.reward, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-primary">Earn Money</h2>
          <p className="text-muted-foreground">Complete tasks and offers to grow your capital</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Total Earned</p>
          <p className="text-2xl font-bold text-green-600">${totalEarned.toLocaleString()}</p>
        </div>
      </div>

      {/* Earnings Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earned</CardTitle>
            <Coins className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${totalEarned.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">From all sources</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Potential Earnings</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">${potentialEarnings.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">From active tasks</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasks Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tasks.filter(t => t.status === "completed").length}</div>
            <p className="text-xs text-muted-foreground">Out of {tasks.length} tasks</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Streak</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">7</div>
            <p className="text-xs text-muted-foreground">Days in a row</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="tasks" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="offers">Offers</TabsTrigger>
          <TabsTrigger value="milestones">Milestones</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="tasks" className="space-y-4">
          {tasks.map(task => (
            <Card key={task.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      {task.icon}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{task.title}</CardTitle>
                      <CardDescription>{task.description}</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(task.status)}
                    <Badge variant="secondary">${task.reward}</Badge>
                  </div>
                </div>
              </CardHeader>
              {task.status === "active" && (
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Progress</span>
                        <span>{task.progress}/{task.maxProgress}</span>
                      </div>
                      <Progress value={(task.progress / task.maxProgress) * 100} className="h-2" />
                    </div>
                    <Button 
                      className="w-full font-mono"
                      disabled={task.status === "completed"}
                    >
                      {task.status === "completed" ? "Completed" : "Continue Task"}
                    </Button>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="offers" className="space-y-4">
          {offers.map(offer => (
            <Card key={offer.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      {offer.icon}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{offer.title}</CardTitle>
                      <CardDescription>{offer.description}</CardDescription>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary" className="mb-1">${offer.reward}</Badge>
                    <p className="text-xs text-muted-foreground">{offer.timeRequired}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">Availability: {offer.availability}</p>
                  <Button size="sm" className="font-mono">Start</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="milestones" className="space-y-4">
          {milestones.map(milestone => (
            <Card key={milestone.id} className={milestone.achieved ? "opacity-75" : ""}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${milestone.achieved ? "bg-green-100" : "bg-gray-100"}`}>
                      <Target className="h-4 w-4" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{milestone.title}</CardTitle>
                      <CardDescription>{milestone.description}</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {milestone.achieved ? (
                      <Badge className="bg-green-100 text-green-800">Achieved</Badge>
                    ) : (
                      <Badge variant="outline">In Progress</Badge>
                    )}
                    <Badge variant="secondary">${milestone.reward}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {milestone.achieved ? (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-green-600">Achieved on {milestone.achievedAt}</span>
                    <span className="text-green-600 font-medium">+${milestone.reward} earned</span>
                  </div>
                ) : (
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Progress</span>
                      <span>{milestone.progress}/{milestone.target}</span>
                    </div>
                    <Progress value={(milestone.progress / milestone.target) * 100} className="h-2" />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Earning History</CardTitle>
              <CardDescription>Your recent earning activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { date: "2024-01-15", task: "Daily Login Bonus", amount: 100, status: "completed" },
                  { date: "2024-01-14", task: "Watch Advertisement", amount: 50, status: "completed" },
                  { date: "2024-01-14", task: "Complete Survey", amount: 200, status: "completed" },
                  { date: "2024-01-13", task: "Daily Login Bonus", amount: 100, status: "completed" },
                ].map((entry, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <div>
                        <p className="font-medium">{entry.task}</p>
                        <p className="text-sm text-muted-foreground">{entry.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">+${entry.amount}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}