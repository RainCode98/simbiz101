'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { SelectProjectModal } from '@/components/SelectProjectModal'
import { toast } from '@/hooks/use-toast'
import { Target, Clock, DollarSign, Users, Play, CheckCircle } from 'lucide-react'
import { formatCurrency } from '@/lib/currency'

interface ProjectsTabProps {
  user: any
  company: any
  refreshCompanyData: () => void
}

export function ProjectsTab({ user, company, refreshCompanyData }: ProjectsTabProps) {
  const [availableProjects, setAvailableProjects] = useState<any[]>([])
  const [activeProjects, setActiveProjects] = useState<any[]>([])
  const [employees, setEmployees] = useState<any[]>([])
  const [isSelectModalOpen, setIsSelectModalOpen] = useState(false)

  useEffect(() => {
    fetchAvailableProjects()
    fetchActiveProjects()
    fetchEmployees()
  }, [company.id])

  // Set up periodic refresh for active projects
  useEffect(() => {
    if (!company.id) return;

    const refreshInterval = setInterval(async () => {
      await fetchActiveProjects();
    }, 30000); // Refresh every 30 seconds to show updated payments

    return () => clearInterval(refreshInterval);
  }, [company.id])

  const fetchAvailableProjects = async () => {
    try {
      const response = await fetch(`/api/projects/available?companyId=${company.id}`)
      const data = await response.json()
      if (response.ok) {
        setAvailableProjects(data.projects || [])
      }
    } catch (error) {
      console.error('Failed to fetch available projects:', error)
    }
  }

  const fetchActiveProjects = async () => {
    try {
      const response = await fetch(`/api/projects/active?companyId=${company.id}`)
      const data = await response.json()
      if (response.ok) {
        setActiveProjects(data.projects || [])
        // Update company balance from the response
        if (data.company) {
          refreshCompanyData()
        }
      }
    } catch (error) {
      console.error('Failed to fetch active projects:', error)
    }
  }

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

  const startProject = async (projectData: any, selectedEmployeeIds: string[]) => {
    try {
      const response = await fetch('/api/projects/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyId: company.id,
          projectId: projectData.id,
          projectData,
          employeeIds: selectedEmployeeIds
        })
      })

      const data = await response.json()
      if (response.ok) {
        await fetchActiveProjects()
        await fetchAvailableProjects()
        await fetchEmployees()
        toast({
          title: "Project Started!",
          description: `${projectData.name} is now in progress`,
        })
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to start project',
        variant: "destructive",
      })
    }
  }

  const completeProject = async (projectId: string) => {
    try {
      const response = await fetch('/api/projects/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          companyId: company.id
        })
      })

      const data = await response.json()
      if (response.ok) {
        await fetchActiveProjects()
        await fetchAvailableProjects()
        await fetchEmployees()
        await refreshCompanyData() // Refresh company data to update balance
        toast({
          title: "Project Completed!",
          description: data.message,
        })
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to complete project',
        variant: "destructive",
      })
    }
  }

  const formatTimeRemaining = (milliseconds: number) => {
    const minutes = Math.floor(milliseconds / 60000)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)
    
    if (days > 0) return `${days}d ${hours % 24}h`
    if (hours > 0) return `${hours}h ${minutes % 60}m`
    return `${minutes}m`
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800'
      case 'Medium': return 'bg-yellow-100 text-yellow-800'
      case 'Hard': return 'bg-orange-100 text-orange-800'
      case 'Expert': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Active Projects - Now on top */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Active Projects</CardTitle>
            <Button onClick={() => setIsSelectModalOpen(true)}>
              <Play className="w-4 h-4 mr-2" />
              Start New Project
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {activeProjects.length === 0 ? (
            <p className="text-gray-500">No active projects</p>
          ) : (
            <div className="space-y-4">
              {activeProjects.map((project) => (
                <Card key={project.id}>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-lg">{project.name}</h3>
                          <p className="text-sm text-gray-600">{project.type}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={project.status === 'completed' ? 'default' : 'secondary'}>
                            {project.status === 'completed' ? (
                              <><CheckCircle className="w-3 h-3 mr-1" /> Completed</>
                            ) : (
                              'In Progress'
                            )}
                          </Badge>
                          {project.isOverdue && (
                            <Badge variant="destructive">Overdue</Badge>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Progress</span>
                          <span>{project.progress}%</span>
                        </div>
                        <Progress value={project.progress} className="h-2" />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Time Remaining: </span>
                          <span className="font-medium">
                            {project.timeRemaining > 0 ? formatTimeRemaining(project.timeRemaining) : 'Completed'}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Total Reward: </span>
                          <span className="font-medium">{formatCurrency(project.baseReward, company.country)}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Paid So Far: </span>
                          <span className="font-medium text-green-600">
                            {formatCurrency(project.amountPaid || 0, company.country)}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <p className="text-sm font-medium">Assigned Team:</p>
                        <div className="flex flex-wrap gap-2">
                          {project.employees.map((emp: any) => (
                            <Badge key={emp.id} variant="outline">
                              {emp.name} ({emp.role})
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {project.status === 'completed' && project.progress === 100 && (
                        <Button 
                          onClick={() => completeProject(project.id)}
                          className="w-full"
                        >
                          Complete Project & Collect Final Payment
                        </Button>
                      )}
                      
                      {/* Show payment progress for active projects */}
                      {project.status === 'in_progress' && project.amountPaid > 0 && (
                        <div className="mt-2 p-2 bg-green-50 rounded">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-green-800">Payment Progress:</span>
                            <span className="text-green-900 font-medium">
                              {formatCurrency(project.amountPaid || 0, company.country)} / {formatCurrency(project.baseReward, company.country)}
                            </span>
                          </div>
                          <div className="w-full bg-green-200 rounded-full h-1.5 mt-1">
                            <div 
                              className="bg-green-600 h-1.5 rounded-full transition-all duration-300" 
                              style={{ width: `${Math.min((project.amountPaid || 0) / project.baseReward * 100, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Available Projects - Now below */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Available Projects</CardTitle>
            <Button onClick={() => setIsSelectModalOpen(true)}>
              <Play className="w-4 h-4 mr-2" />
              Start New Project
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {availableProjects.length === 0 ? (
            <p className="text-gray-500">No available projects at the moment</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableProjects.map((project) => (
                <Card key={project.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-semibold text-lg">{project.name}</h3>
                        <p className="text-sm text-gray-600">{project.description}</p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge className={getDifficultyColor(project.difficulty)}>
                          {project.difficulty}
                        </Badge>
                        <Badge variant="outline">{project.type}</Badge>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            Total Reward
                          </span>
                          <span className="font-medium">{formatCurrency(project.baseReward, company.country)}</span>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            Duration
                          </span>
                          <span className="font-medium">{project.estimatedMinutes}m</span>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <span className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            Per Minute
                          </span>
                          <span className="font-medium text-green-600">
                            {formatCurrency(project.baseReward / project.estimatedMinutes, company.country)}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            Team Size
                          </span>
                          <span className="font-medium">{project.requiredEmployees}</span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <p className="text-xs font-medium text-gray-700">Required Skills:</p>
                        {Object.entries(project.requiredSkills).map(([role, skill]) => (
                          <div key={role} className="flex items-center justify-between text-xs">
                            <span>{role}:</span>
                            <span className="font-medium">Level {skill}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <SelectProjectModal
        isOpen={isSelectModalOpen}
        onClose={() => setIsSelectModalOpen(false)}
        onProjectSelected={startProject}
        availableProjects={availableProjects}
        employees={employees}
        company={company}
      />
    </div>
  )
}