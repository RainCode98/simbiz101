'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent } from '@/components/ui/card'
import { Users, DollarSign, Clock, Briefcase } from 'lucide-react'
import { formatCurrency } from '@/lib/currency'

interface SelectProjectModalProps {
  isOpen: boolean
  onClose: () => void
  onProjectSelected: (project: any, selectedEmployeeIds: string[]) => void
  availableProjects: any[]
  employees: any[]
  company: any
}

export function SelectProjectModal({ 
  isOpen, 
  onClose, 
  onProjectSelected, 
  availableProjects, 
  employees, 
  company 
}: SelectProjectModalProps) {
  const [selectedProject, setSelectedProject] = useState<any>(null)
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([])

  const availableEmployees = employees.filter(emp => !emp.projectId)

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
      return maxSkill >= (requiredSkill as number)
    })
  }

  const handleStartProject = () => {
    if (selectedProject && canStartProject()) {
      onProjectSelected(selectedProject, selectedEmployees)
      onClose()
      setSelectedProject(null)
      setSelectedEmployees([])
    }
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

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}h ${mins}m`
    }
    return `${mins}m`
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white text-gray-900">
        <DialogHeader>
          <DialogTitle className="text-gray-900">Select Project to Start</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Project Selection */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Choose a Project</h3>
            <div className="grid grid-cols-1 gap-4 max-h-60 overflow-y-auto">
              {availableProjects.map((project) => (
                <Card 
                  key={project.id} 
                  className={`cursor-pointer transition-all ${
                    selectedProject?.id === project.id 
                      ? 'ring-2 ring-blue-500 bg-blue-50 border-blue-200' 
                      : 'hover:shadow-md hover:border-gray-300 bg-white'
                  }`}
                  onClick={() => {
                    setSelectedProject(project)
                    setSelectedEmployees([])
                  }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg text-gray-900">{project.name}</h4>
                        <p className="text-sm text-gray-700 mt-1">{project.description}</p>
                        
                        <div className="flex items-center gap-2 mt-2">
                          <Badge className={getDifficultyColor(project.difficulty)}>
                            {project.difficulty}
                          </Badge>
                          <Badge variant="outline" className="text-gray-700 border-gray-300">{project.type}</Badge>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mt-3 text-sm">
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4 text-green-600" />
                            <span className="text-gray-900 font-medium">{formatCurrency(project.baseReward, company.country)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4 text-blue-600" />
                            <span className="text-gray-900">{formatDuration(project.estimatedMinutes)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4 text-purple-600" />
                            <span className="text-gray-900">{project.requiredEmployees} employees</span>
                          </div>
                        </div>

                        <div className="mt-3">
                          <p className="text-xs font-medium text-gray-800 mb-1">Required Skills:</p>
                          <div className="flex flex-wrap gap-1">
                            {Object.entries(project.requiredSkills).map(([role, skill]) => (
                              <Badge key={role} variant="outline" className="text-xs text-gray-700 border-gray-300">
                                {role} {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Employee Selection */}
          {selectedProject && (
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-900">
                Select Employees ({selectedEmployees.length}/{selectedProject.requiredEmployees})
              </h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {availableEmployees.length === 0 ? (
                  <p className="text-gray-600 text-center py-4 bg-gray-50 rounded-lg">
                    No available employees. All employees are currently on projects.
                  </p>
                ) : (
                  <>
                    {selectedEmployees.length < selectedProject.requiredEmployees && (
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                        <p className="text-sm text-amber-800">
                          <strong>Need {selectedProject.requiredEmployees - selectedEmployees.length} more employee{selectedProject.requiredEmployees - selectedEmployees.length > 1 ? 's' : ''}</strong> to start this project.
                          {availableEmployees.filter(emp => !selectedEmployees.includes(emp.id)).length === 0 && 
                            " All available employees are already selected."}
                        </p>
                      </div>
                    )}
                    {availableEmployees.map((employee) => (
                    <div key={employee.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 bg-white">
                      <Checkbox
                        id={employee.id}
                        checked={selectedEmployees.includes(employee.id)}
                        onCheckedChange={(checked) => 
                          handleEmployeeSelection(employee.id, checked as boolean)
                        }
                        disabled={selectedEmployees.length >= selectedProject.requiredEmployees && 
                                  !selectedEmployees.includes(employee.id)}
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <label htmlFor={employee.id} className="font-medium cursor-pointer text-gray-900">
                            {employee.name}
                          </label>
                          <Badge variant="outline" className="text-gray-700 border-gray-300">{employee.role}</Badge>
                        </div>
                        <div className="text-sm text-gray-700">
                          Skill: {employee.skill} • Salary: {formatCurrency(employee.salary, company.country)}
                        </div>
                      </div>
                    </div>
                  ))}
                  </>
                )}
              </div>
            </div>
          )}

          {/* Requirements Check */}
          {selectedProject && (
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="font-medium mb-2 text-gray-900">Requirements Check</h4>
              <div className="space-y-2 text-sm">
                {Object.entries(selectedProject.requiredSkills).map(([role, requiredSkill]) => {
                  const selectedEmployeeData = employees.filter(emp => 
                    selectedEmployees.includes(emp.id) && emp.role === role
                  )
                  const maxSkill = Math.max(...selectedEmployeeData.map(emp => emp.skill), 0)
                  const meetsRequirement = maxSkill >= (requiredSkill as number)
                  
                  return (
                    <div key={role} className="flex items-center justify-between">
                      <span className="text-gray-800">{role} (Required: {requiredSkill})</span>
                      <span className={`font-medium ${meetsRequirement ? 'text-green-600' : 'text-red-600'}`}>
                        {maxSkill > 0 ? `Best: ${maxSkill}` : 'None assigned'}
                        {meetsRequirement ? ' ✓' : ' ✗'}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose} className="text-gray-700 border-gray-300 hover:bg-gray-50">
              Cancel
            </Button>
            <Button 
              onClick={handleStartProject}
              disabled={!selectedProject || !canStartProject()}
            >
              Start Project
            </Button>
          </div>
          
          {/* Status Message */}
          {selectedProject && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              {selectedEmployees.length !== selectedProject.requiredEmployees && (
                <p className="text-sm text-amber-700">
                  <strong>Need {selectedProject.requiredEmployees - selectedEmployees.length} more employee{selectedProject.requiredEmployees - selectedEmployees.length > 1 ? 's' : ''}</strong> to start this project.
                </p>
              )}
              {selectedEmployees.length === selectedProject.requiredEmployees && !canStartProject() && (
                <p className="text-sm text-red-700">
                  <strong>Skill requirements not met.</strong> Please check the Requirements Check section above.
                </p>
              )}
              {canStartProject() && (
                <p className="text-sm text-green-700">
                  <strong>Ready to start!</strong> All requirements are met.
                </p>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}