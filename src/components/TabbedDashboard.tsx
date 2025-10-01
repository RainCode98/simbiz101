'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DashboardTab } from './tabs/DashboardTab'
import { ProjectsTab } from './tabs/ProjectsTab'
import { EmployeesTab } from './tabs/EmployeesTab'

interface TabbedDashboardProps {
  user: any
  company: any
  onLogout: () => void
  refreshCompanyData: () => void
}

export function TabbedDashboard({ user, company, onLogout, refreshCompanyData }: TabbedDashboardProps) {
  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-card rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">{company.name}</h1>
              <p className="text-muted-foreground mt-1">Business Tycoon Dashboard</p>
            </div>
            <Button onClick={onLogout} variant="outline">
              Logout
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="employees">Employees</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <DashboardTab user={user} company={company} refreshCompanyData={refreshCompanyData} />
          </TabsContent>

          <TabsContent value="projects">
            <ProjectsTab user={user} company={company} refreshCompanyData={refreshCompanyData} />
          </TabsContent>

          <TabsContent value="employees">
            <EmployeesTab user={user} company={company} refreshCompanyData={refreshCompanyData} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}