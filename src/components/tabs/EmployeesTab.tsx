'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import HiringModal from '@/components/HiringModal'
import { toast } from '@/hooks/use-toast'
import { Users, DollarSign, TrendingUp, Briefcase, Trash2, UserPlus } from 'lucide-react'
import { formatCurrency } from '@/lib/currency'

interface EmployeesTabProps {
  user: any
  company: any
  refreshCompanyData: () => void
}

export function EmployeesTab({ user, company, refreshCompanyData }: EmployeesTabProps) {
  const [employees, setEmployees] = useState<any[]>([])
  const [isHiringModalOpen, setIsHiringModalOpen] = useState(false)
  const [filterRole, setFilterRole] = useState<string>('all')

  useEffect(() => {
    fetchEmployees()
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

  const handleHire = async (employee: any) => {
    try {
      const response = await fetch('/api/employees/hire', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyId: company.id,
          name: employee.name,
          role: employee.role,
          skill: employee.skill,
          salary: employee.salary
        })
      })

      const data = await response.json()
      if (response.ok) {
        await fetchEmployees()
        await refreshCompanyData() // Refresh company data to update balance
        toast({
          title: "Employee Hired!",
          description: `${employee.name} has joined your team as a ${employee.role}`,
        })
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to hire employee',
        variant: "destructive",
      })
    }
  }

  const handleFire = async (employeeId: string, employeeName: string) => {
    if (!confirm(`Are you sure you want to fire ${employeeName}?`)) {
      return
    }

    try {
      const response = await fetch('/api/employees/fire', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employeeId,
          companyId: company.id
        })
      })

      const data = await response.json()
      if (response.ok) {
        await fetchEmployees()
        await refreshCompanyData() // Refresh company data to update balance
        toast({
          title: "Employee Fired",
          description: `${employeeName} has been removed from your team`,
        })
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to fire employee',
        variant: "destructive",
      })
    }
  }

  const filteredEmployees = filterRole === 'all' 
    ? employees 
    : employees.filter(emp => emp.role === filterRole)

  const roleColors = {
    Developer: 'bg-blue-100 text-blue-800',
    Designer: 'bg-purple-100 text-purple-800',
    Manager: 'bg-green-100 text-green-800',
    QA: 'bg-orange-100 text-orange-800'
  }

  const roleIcons = {
    Developer: '💻',
    Designer: '🎨',
    Manager: '📊',
    QA: '🔍'
  }

  const availableEmployees = filteredEmployees.filter(emp => !emp.projectId)
  const busyEmployees = filteredEmployees.filter(emp => emp.projectId)

  const totalSalary = employees.reduce((sum, emp) => sum + emp.salary, 0)

  return (
    <div className="space-y-8">
      {/* Employee Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
            <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Payroll</CardTitle>
            <DollarSign className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{formatCurrency(totalSalary, company.country)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Total monthly salary
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg Skill Level</CardTitle>
            <TrendingUp className="h-5 w-5 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {employees.length > 0 ? Math.round(employees.reduce((sum, emp) => sum + emp.skill, 0) / employees.length) : 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Average team skill
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Team Happiness</CardTitle>
            <Briefcase className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {employees.length > 0 ? Math.round(employees.reduce((sum, emp) => sum + emp.happiness, 0) / employees.length) : 0}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Average happiness
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Hire Button and Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <h2 className="text-3xl font-bold text-foreground">Team Members</h2>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-muted-foreground">Filter by Role:</label>
            <select 
              value={filterRole} 
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-3 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="all">All Roles</option>
              <option value="Developer">Developers</option>
              <option value="Designer">Designers</option>
              <option value="Manager">Managers</option>
              <option value="QA">QA Engineers</option>
            </select>
          </div>
        </div>
        <Button onClick={() => setIsHiringModalOpen(true)} className="text-base px-4 py-2">
          <UserPlus className="w-4 h-4 mr-2" />
          Hire Employee
        </Button>
      </div>

      {/* Employee List */}
      {filteredEmployees.length === 0 ? (
        <Card className="border-2 shadow-md">
          <CardContent className="p-12 text-center">
            <Users className="w-20 h-20 mx-auto text-muted-foreground mb-6" />
            <h3 className="text-2xl font-bold text-foreground mb-3">No employees found</h3>
            <p className="text-muted-foreground mb-6 text-lg">
              {filterRole === 'all' ? 'Start building your team by hiring your first employee' : `No ${filterRole}s found`}
            </p>
            {filterRole === 'all' && (
              <Button onClick={() => setIsHiringModalOpen(true)} size="lg" className="text-base px-6 py-3">
                <UserPlus className="w-5 h-5 mr-2" />
                Hire Your First Employee
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEmployees.map((employee) => (
            <Card key={employee.id} className="border-2 shadow-md hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-14 h-14 border-2 border-muted">
                      <AvatarFallback className="text-xl bg-primary/10 text-primary">
                        {roleIcons[employee.role as keyof typeof roleIcons]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-bold text-lg text-foreground">{employee.name}</h3>
                      <Badge className={`${roleColors[employee.role as keyof typeof roleColors]}`}>
                        {employee.role}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleFire(employee.id, employee.name)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground font-medium">Skill Level</span>
                    <span className="font-bold text-foreground">{employee.skill}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground font-medium">Salary</span>
                    <span className="font-bold text-green-600">{formatCurrency(employee.salary, company.country)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground font-medium">Happiness</span>
                    <span className="font-bold text-foreground">{employee.happiness}%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground font-medium">Status</span>
                    <Badge variant={employee.projectId ? "secondary" : "default"} className="text-xs">
                      {employee.projectId ? 'On Project' : 'Available'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Hiring Modal */}
      <HiringModal
        isOpen={isHiringModalOpen}
        onClose={() => setIsHiringModalOpen(false)}
        onHire={handleHire}
        currentBalance={company.money}
        currentEmployees={employees}
        country={company.country}
        refreshCompanyData={refreshCompanyData}
      />
    </div>
  )
}