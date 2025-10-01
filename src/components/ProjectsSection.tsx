'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { Briefcase, Clock, CheckCircle, AlertCircle, Play, Users, DollarSign, TrendingUp } from 'lucide-react'
import { formatCurrency } from '@/lib/currency'
import { toast } from '@/hooks/use-toast'

interface ProjectsSectionProps {
  companyId: string
  company: any
  employees: any[]
  onProjectStarted: () => void
  onProjectCompleted: () => void
}

interface Project {
  id: string
  name: string
  description: string
  type: string
  requiredSkills: Record<string, number>
  requiredEmployees: number
  baseReward: number
  estimatedMinutes: number
  difficulty: string
}

interface ActiveProject {
  id: string
  name: string
  type: string
  baseReward: number
  bonus: number
  status: string
  progress: number
  startTime: string
  endTime: string
  deadline: string
  employees: any[]
  timeRemaining: number
  isOverdue: boolean
}

export function ProjectsSection({ companyId, company, employees, onProjectStarted, onProjectCompleted }: ProjectsSectionProps) {
  const [availableProjects, setAvailableProjects] = useState<Project[]>([])
  const [activeProjects, setActiveProjects] = useState<ActiveProject[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([])
  const [isStartDialogOpen, setIsStartDialogOpen] = useState(false)

  useEffect(() => {
    fetchAvailableProjects()
    fetchActiveProjects()
    
    const interval = setInterval(() => {
      if (activeProjects.length > 0) {
        fetchActiveProjects()
      }
    }, 5000)
    
    return () => clearInterval(interval)
  }, [companyId])

  const fetchAvailableProjects = async () => {
    try {
      const response = await fetch(`/api/projects/available?companyId=${companyId}`)
      const data = await response.json()
      if (response.ok) {
        setAvailableProjects(data.projects)
      }
    } catch (error) {
      console.error('Failed to fetch available projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchActiveProjects = async () => {
    try {
      const response = await fetch(`/api/projects/active?companyId=${companyId}`)
      const data = await response.json()
      if (response.ok) {
        setActiveProjects(data.projects)
        // Check for completed projects
        const completedProjects = data.projects.filter((p: ActiveProject) => p.status === 'completed' && p.progress === 100)
        if (completedProjects.length > 0) {
          onProjectCompleted()
        }
      }
    } catch (error) {
      console.error('Failed to fetch active projects:', error)
    }
  }

  const handleStartProject = (project: Project) => {
    setSelectedProject(project)
    setSelectedEmployees([])
    setIsStartDialogOpen(true)
  }

  const handleEmployeeSelection = (employeeId: string, checked: boolean) => {
    if (checked) {
      setSelectedEmployees(prev => [...prev, employeeId])
    } else {
      setSelectedEmployees(prev => prev.filter(id => id !== employeeId))
    }
  }

  const canStartProject = () => {
    if (!selectedProject || selectedEmployees.length !== selectedProject.requiredEmployees) {
      return false
    }

    // Check skill requirements
    const selectedEmployeeData = employees.filter(emp => selectedEmployees.includes(emp.id))
    const employeeSkills = selectedEmployeeData.reduce((acc, emp) => {
      if (!acc[emp.role]) acc[emp.role] = []
      acc[emp.role].push(emp.skill)
      return acc
    }, {} as Record<string, number[]>)

    return Object.entries(selectedProject.requiredSkills).every(([role, requiredSkill]) => {
      const roleSkills = employeeSkills[role] || []
      const maxSkill = Math.max(...roleSkills, 0)
      return maxSkill >= requiredSkill
    })
  }

  const confirmStartProject = async () => {
    if (!selectedProject || !canStartProject()) return

    try {
      const response = await fetch('/api/projects/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyId,
          projectId: selectedProject.id,
          projectData: selectedProject,
          employeeIds: selectedEmployees
        })
      })

      const data = await response.json()
      if (response.ok) {
        toast({
          title: "Project Started!",
          description: `${selectedProject.name} is now in progress`,
        })
        setIsStartDialogOpen(false)
        setSelectedProject(null)
        setSelectedEmployees([])
        fetchAvailableProjects()
        fetchActiveProjects()
        onProjectStarted()
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
          companyId
        })
      })

      const data = await response.json()
      if (response.ok) {
        toast({
          title: "Project Completed!",
          description: data.message,
        })
        fetchActiveProjects()
        onProjectCompleted()
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
    const hours = Math.floor(milliseconds / (1000 * 60 * 60))
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60))
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}h ${mins}m`
    }
    return `${mins}m`
  }

  const getDifficultyBadge = (difficulty: string) => {
    const colors = {
      Easy: "bg-green-100 text-green-800",
      Medium: "bg-yellow-100 text-yellow-800",
      Hard: "bg-red-100 text-red-800",
      Expert: "bg-purple-100 text-purple-800"
    }
    return (
      <Badge className={colors[difficulty as keyof typeof colors] || "bg-gray-100 text-gray-800"}>
        {difficulty}
      </Badge>
    )
  }

  const availableEmployees = employees.filter(emp => !emp.projectId)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-primary">Projects</h2>
          <p className="text-muted-foreground">Manage and complete business projects</p>
        </div>
      </div>

      {/* Active Projects */}
      {activeProjects.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Active Projects</h3>
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
                        +{formatCurrency(project.bonus, company.country).replace(/[0-9.,]/g, '').trim()} Bonus
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
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      <span>{formatCurrency(project.baseReward, company.country)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-blue-600" />
                      <span>{formatTimeRemaining(project.timeRemaining)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-purple-600" />
                      <span>{project.employees.length} employees</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-4 w-4 text-orange-600" />
                      <span>{project.progress}% complete</span>
                    </div>
                  </div>

                  {project.status === 'completed' && project.progress === 100 && (
                    <Button 
                      onClick={() => completeProject(project.id)}
                      className="w-full font-mono"
                    >
                      Collect Reward ({formatCurrency(project.baseReward + project.bonus, company.country)})
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Available Projects */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Available Projects</h3>
        {availableProjects.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Briefcase className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">No available projects at the moment. Check back later!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {availableProjects.map((project) => (
              <Card key={project.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{project.name}</CardTitle>
                      <CardDescription>{project.description}</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      {getDifficultyBadge(project.difficulty)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2 text-sm">
                      <span className="text-muted-foreground">Required Skills:</span>
                      {Object.entries(project.requiredSkills).map(([role, skill]) => (
                        <Badge key={role} variant="outline">
                          {role} {skill}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <span>{formatCurrency(project.baseReward, company.country)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-blue-600" />
                        <span>{formatDuration(project.estimatedMinutes)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-purple-600" />
                        <span>{project.requiredEmployees} employees</span>
                      </div>
                    </div>

                    <Button 
                      onClick={() => handleStartProject(project)}
                      disabled={availableEmployees.length < project.requiredEmployees}
                      className="w-full font-mono"
                    >
                      {availableEmployees.length < project.requiredEmployees 
                        ? `Need ${project.requiredEmployees} employees` 
                        : 'Start Project'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Start Project Dialog */}
      <Dialog open={isStartDialogOpen} onOpenChange={setIsStartDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Start Project: {selectedProject?.name}</DialogTitle>
          </DialogHeader>
          
          {selectedProject && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">Project Details</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Reward:</span>
                    <div className="font-medium">{formatCurrency(selectedProject.baseReward, company.country)}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Duration:</span>
                    <div className="font-medium">{formatDuration(selectedProject.estimatedMinutes)}</div>
                  </div>
                </div>
                
                <div className="mt-3">
                  <span className="text-muted-foreground text-sm">Required Skills:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {Object.entries(selectedProject.requiredSkills).map(([role, skill]) => (
                      <Badge key={role} variant="outline">
                        {role} {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Select Employees ({selectedEmployees.length}/{selectedProject.requiredEmployees})</h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {availableEmployees.map((employee) => (
                    <div key={employee.id} className="flex items-center space-x-2 p-2 border rounded">
                      <Checkbox
                        id={employee.id}
                        checked={selectedEmployees.includes(employee.id)}
                        onCheckedChange={(checked) => handleEmployeeSelection(employee.id, checked as boolean)}
                        disabled={selectedEmployees.length >= selectedProject.requiredEmployees && !selectedEmployees.includes(employee.id)}
                      />
                      <label htmlFor={employee.id} className="flex-1 flex items-center justify-between cursor-pointer">
                        <div>
                          <span className="font-medium">{employee.name}</span>
                          <span className="text-muted-foreground ml-2">{employee.role}</span>
                        </div>
                        <Badge variant="outline">Skill: {employee.skill}</Badge>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsStartDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={confirmStartProject}
                  disabled={!canStartProject()}
                >
                  Start Project
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}