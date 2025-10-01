'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, DollarSign, Users, Target, Clock } from 'lucide-react'
import { formatCurrency } from '@/lib/currency'

interface DashboardTabProps {
  user: any
  company: any
  refreshCompanyData: () => void
}

export function DashboardTab({ user, company, refreshCompanyData }: DashboardTabProps) {
  const [employees, setEmployees] = useState<any[]>([])
  const [activeProjects, setActiveProjects] = useState<any[]>([])

  useEffect(() => {
    fetchEmployees()
    fetchActiveProjects()
    refreshCompanyData()
  }, [company.id])

  const fetchEmployees = async () => {
    try {
      const response = await fetch(`/api/employees/hire?companyId=${company.id}`)
      const data = await response.json()
      if (response.ok) {
        setEmployees(data.employees || [])
      }
    } catch (error) {
      console.error('Failed to fetch employees:', error)
    }
  }

  const fetchActiveProjects = async () => {
    try {
      const response = await fetch(`/api/projects/active?companyId=${company.id}`)
      const data = await response.json()
      if (response.ok) {
        setActiveProjects(data.projects || [])
      }
    } catch (error) {
      console.error('Failed to fetch active projects:', error)
    }
  }

  const availableEmployees = employees.filter(emp => !emp.projectId)
  const busyEmployees = employees.filter(emp => emp.projectId)

  // Calculate costs
  const hourlyCost = employees.reduce((total, emp) => total + (emp.salary / 730), 0)
  const monthlyCost = employees.reduce((total, emp) => total + emp.salary, 0)

  return (
    <div className="space-y-8">
      {/* Company Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-2 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Balance</CardTitle>
            <DollarSign className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{formatCurrency(company.money, company.country)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Available funds
            </p>
            <div className="mt-2 pt-2 border-t">
              <p className="text-xs text-orange-600">
                Monthly payroll: {formatCurrency(monthlyCost, company.country)}
              </p>
              <p className="text-xs text-muted-foreground">
                (Deducted hourly: {formatCurrency(hourlyCost, company.country)}/hr)
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Employees</CardTitle>
            <Users className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{employees.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {availableEmployees.length} available, {busyEmployees.length} busy
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Projects</CardTitle>
            <Target className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{activeProjects.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Currently in progress
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Reputation</CardTitle>
            <TrendingUp className="h-5 w-5 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{company.reputation}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Company reputation score
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-2 shadow-md">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Recent Projects</CardTitle>
          </CardHeader>
          <CardContent>
            {activeProjects.length === 0 ? (
              <div className="text-center py-8">
                <Target className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">No active projects</p>
              </div>
            ) : (
              <div className="space-y-3">
                {activeProjects.slice(0, 5).map((project) => (
                  <div key={project.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border">
                    <div>
                      <h4 className="font-semibold text-foreground">{project.name}</h4>
                      <p className="text-sm text-muted-foreground">{project.type}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant={project.status === 'completed' ? 'default' : 'secondary'}>
                        {project.status}
                      </Badge>
                      <p className="text-sm text-muted-foreground mt-1">{project.progress}%</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-2 shadow-md">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Team Overview</CardTitle>
          </CardHeader>
          <CardContent>
            {employees.length === 0 ? (
              <div className="text-center py-8">
                <Users className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">No employees hired yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {['Developer', 'Designer', 'Manager', 'QA'].map((role) => {
                  const roleEmployees = employees.filter(emp => emp.role === role)
                  if (roleEmployees.length === 0) return null
                  
                  return (
                    <div key={role} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border">
                      <div>
                        <h4 className="font-semibold text-foreground">{role}s</h4>
                        <p className="text-sm text-muted-foreground">
                          {roleEmployees.filter(emp => !emp.projectId).length} available
                        </p>
                      </div>
                      <Badge variant="outline" className="text-base px-3 py-1">
                        {roleEmployees.length}
                      </Badge>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}