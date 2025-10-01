'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Users, DollarSign, TrendingUp, Clock } from 'lucide-react'
import { formatCurrency } from '@/lib/currency'

interface Employee {
  id: string
  name: string
  role: string
  skill: number
  salary: number
  efficiency: number
}

interface HiringModalProps {
  isOpen: boolean
  onClose: () => void
  onHire: (employee: Employee) => void
  currentBalance: number
  currentEmployees: Employee[]
  country: string
  refreshCompanyData: () => void
}

export default function HiringModal({ isOpen, onClose, onHire, currentBalance, currentEmployees, country, refreshCompanyData }: HiringModalProps) {
  const [availableEmployees, setAvailableEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(false)
  const [filterRole, setFilterRole] = useState<string>('all')
  const [filterSkill, setFilterSkill] = useState<string>('all')

  const roleColors = {
    Developer: 'bg-blue-100 text-blue-800',
    Designer: 'bg-purple-100 text-purple-800',
    Manager: 'bg-green-100 text-green-800',
    QA: 'bg-orange-100 text-orange-800'
  }

  const skillLevelColors = {
    expert: 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-2 border-yellow-600',
    senior: 'bg-gradient-to-r from-purple-400 to-blue-500 text-white border-2 border-purple-600',
    mid: 'bg-gradient-to-r from-green-400 to-teal-500 text-white border-2 border-green-600',
    junior: 'bg-gradient-to-r from-gray-400 to-gray-500 text-white border-2 border-gray-600'
  }

  const getSkillLevel = (skill: number) => {
    if (skill >= 71) return { level: 'Expert', color: skillLevelColors.expert }
    if (skill >= 51) return { level: 'Senior', color: skillLevelColors.senior }
    if (skill >= 31) return { level: 'Mid', color: skillLevelColors.mid }
    return { level: 'Junior', color: skillLevelColors.junior }
  }

  const roleIcons = {
    Developer: '💻',
    Designer: '🎨',
    Manager: '📊',
    QA: '🔍'
  }

  const generateAvailableEmployees = () => {
    const roles = ['Developer', 'Designer', 'Manager', 'QA']
    
    // Expanded name pools for more variety
    const firstNames = [
      'Alex', 'Sam', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Avery', 'Quinn', 'Blake',
      'Phoenix', 'River', 'Skyler', 'Dakota', 'Sage', 'Rowan', 'Kai', 'Nova', 'Orion', 'Luna'
    ]
    const lastNames = [
      'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
      'Anderson', 'Taylor', 'Thomas', 'Moore', 'Jackson', 'Martin', 'Lee', 'Thompson', 'White', 'Harris'
    ]
    
    const employees: Employee[] = []
    
    // Generate 15 available employees (increased from 12)
    for (let i = 0; i < 15; i++) {
      const role = roles[Math.floor(Math.random() * roles.length)]
      
      // Enhanced skill distribution with more high-level options
      let skill: number
      const skillRoll = Math.random()
      
      if (skillRoll < 0.15) {
        // 15% chance for expert level (71-90)
        skill = Math.floor(Math.random() * 20) + 71
      } else if (skillRoll < 0.35) {
        // 20% chance for senior level (51-70)
        skill = Math.floor(Math.random() * 20) + 51
      } else if (skillRoll < 0.65) {
        // 30% chance for mid level (31-50)
        skill = Math.floor(Math.random() * 20) + 31
      } else {
        // 35% chance for junior level (10-30)
        skill = Math.floor(Math.random() * 21) + 10
      }
      
      // Enhanced base salaries with role-based scaling
      let baseSalary: number
      if (role === 'Developer') {
        baseSalary = skill > 70 ? 5000 : skill > 50 ? 4000 : 3000
      } else if (role === 'Designer') {
        baseSalary = skill > 70 ? 4500 : skill > 50 ? 3500 : 2500
      } else if (role === 'Manager') {
        baseSalary = skill > 70 ? 6000 : skill > 50 ? 5000 : 4000
      } else { // QA
        baseSalary = skill > 70 ? 3500 : skill > 50 ? 2800 : 2000
      }
      
      // Salary calculation with skill premium for high-level talent
      const skillMultiplier = skill > 70 ? 1.5 : skill > 50 ? 1.3 : 1.0
      const salary = Math.floor(baseSalary * (1 + skill / 100) * skillMultiplier)
      
      // Enhanced efficiency calculation
      const efficiency = Math.floor(skill * (skill > 70 ? 1.5 : skill > 50 ? 1.3 : 1.2))
      
      employees.push({
        id: `emp_${Date.now()}_${i}`,
        name: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
        role,
        skill,
        salary,
        efficiency
      })
    }
    
    // Sort by skill level (highest first) for better visibility
    return employees.sort((a, b) => b.skill - a.skill)
  }

  useEffect(() => {
    if (isOpen) {
      setLoading(true)
      // Simulate API call
      setTimeout(() => {
        setAvailableEmployees(generateAvailableEmployees())
        setLoading(false)
      }, 500)
    }
  }, [isOpen])

  const handleHire = async (employee: Employee) => {
    // No upfront cost required - salary will be deducted hourly
    onHire(employee)
    setAvailableEmployees(prev => prev.filter(emp => emp.id !== employee.id))
    // Refresh company data after hiring
    setTimeout(() => {
      refreshCompanyData()
    }, 500)
  }

  const filteredEmployees = filterRole === 'all' && filterSkill === 'all'
    ? availableEmployees 
    : availableEmployees.filter(emp => {
        const roleMatch = filterRole === 'all' || emp.role === filterRole
        const skillMatch = filterSkill === 'all' || 
          (filterSkill === 'expert' && emp.skill >= 71) ||
          (filterSkill === 'senior' && emp.skill >= 51 && emp.skill <= 70) ||
          (filterSkill === 'mid' && emp.skill >= 31 && emp.skill <= 50) ||
          (filterSkill === 'junior' && emp.skill <= 30)
        return roleMatch && skillMatch
      })

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="min-w-[800px] w-[80vw] h-[90vh] max-h-screen overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Users className="w-8 h-8" />
            Hire Employees
          </DialogTitle>
        </DialogHeader>
        
        <div className="mb-6 p-6 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-lg font-medium text-blue-800">Current Balance:</span>
            <span className="text-2xl font-bold text-blue-900">{formatCurrency(currentBalance, country)}</span>
          </div>
          <div className="flex items-center justify-between mt-3">
            <span className="text-lg font-medium text-blue-800">Current Employees:</span>
            <span className="text-xl font-bold text-blue-900">{currentEmployees.length} hired</span>
          </div>
          <div className="mt-4 p-3 bg-green-100 rounded-lg">
            <p className="text-sm font-medium text-green-800">
              💡 New: Hiring is now FREE! Monthly salaries are deducted automatically every hour.
            </p>
          </div>
          <div className="mt-3 p-3 bg-yellow-100 rounded-lg">
            <p className="text-sm font-medium text-yellow-800">
              ⭐ NEW: Expert developers (71-90 skill) now available! Look for the golden cards and TOP badges.
            </p>
          </div>
        </div>

        {/* Filter Section */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-4 mb-3">
            <label className="text-sm font-medium text-gray-700">Filter by Role:</label>
            <select 
              value={filterRole} 
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Roles</option>
              <option value="Developer">Developers</option>
              <option value="Designer">Designers</option>
              <option value="Manager">Managers</option>
              <option value="QA">QA Engineers</option>
            </select>
          </div>
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700">Filter by Skill:</label>
            <select 
              value={filterSkill} 
              onChange={(e) => setFilterSkill(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Levels</option>
              <option value="expert">Expert (71-90)</option>
              <option value="senior">Senior (51-70)</option>
              <option value="mid">Mid (31-50)</option>
              <option value="junior">Junior (10-30)</option>
            </select>
            <span className="text-sm text-gray-500">
              {filteredEmployees.length} candidate{filteredEmployees.length !== 1 ? 's' : ''} available
            </span>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredEmployees.map((employee) => {
              const skillInfo = getSkillLevel(employee.skill)
              const isHighLevel = employee.skill >= 51
              
              return (
                <Card key={employee.id} className={`hover:shadow-lg transition-all duration-300 ${isHighLevel ? 'ring-2 ring-yellow-400 ring-opacity-50 hover:ring-yellow-500' : ''}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Avatar className={`w-14 h-14 ${isHighLevel ? 'ring-2 ring-yellow-400' : ''}`}>
                          <AvatarFallback className={`text-xl ${isHighLevel ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white' : ''}`}>
                            {roleIcons[employee.role as keyof typeof roleIcons]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className={`font-semibold text-lg ${isHighLevel ? 'text-gray-900' : 'text-gray-900'}`}>
                            {employee.name}
                            {employee.skill >= 71 && <span className="ml-1">⭐</span>}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={`${roleColors[employee.role as keyof typeof roleColors]}`}>
                              {employee.role}
                            </Badge>
                            <Badge className={`${skillInfo.color} text-xs font-bold`}>
                              {skillInfo.level}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 flex items-center gap-2">
                          <TrendingUp className="w-5 h-5" />
                          Skill Level
                        </span>
                        <div className="flex items-center gap-2">
                          <span className={`font-bold text-lg ${isHighLevel ? 'text-orange-600' : 'text-gray-900'}`}>
                            {employee.skill}
                          </span>
                          {employee.skill >= 71 && <span className="text-xs bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full font-bold">TOP</span>}
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 flex items-center gap-2">
                          <DollarSign className="w-5 h-5" />
                          Monthly Salary
                        </span>
                        <span className={`font-bold text-lg ${isHighLevel ? 'text-green-600' : 'text-green-600'}`}>
                          {formatCurrency(employee.salary, country)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 flex items-center gap-2">
                          <Clock className="w-5 h-5" />
                          Efficiency
                        </span>
                        <span className={`font-bold text-lg ${isHighLevel ? 'text-blue-600' : 'text-gray-900'}`}>
                          {employee.efficiency}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm p-2 bg-green-50 rounded">
                        <span className="text-green-800 font-medium">Hourly Deduction:</span>
                        <span className="font-bold text-green-900">{formatCurrency(employee.salary / 730, country)}/hr</span>
                      </div>
                      <div className="flex items-center justify-between text-sm p-2 bg-blue-50 rounded">
                        <span className="text-blue-800 font-medium">Hiring Cost:</span>
                        <span className="font-bold text-blue-900">FREE</span>
                      </div>
                    </div>
                    
                    <Button 
                      onClick={() => handleHire(employee)}
                      disabled={currentBalance < 0}
                      className={`w-full text-base py-3 ${isHighLevel ? 'bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold' : ''}`}
                      variant={currentBalance < 0 ? "outline" : isHighLevel ? "default" : "default"}
                    >
                      {currentBalance < 0 ? 'Balance Negative' : isHighLevel ? `Hire Elite ${employee.role}!` : 'Hire Employee (Free)'}
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
        
        {filteredEmployees.length === 0 && !loading && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">
              {filterRole === 'all' 
                ? 'No available employees at the moment. Check back later!' 
                : `No available ${filterRole}s at the moment. Try a different filter or check back later!`
              }
            </p>
          </div>
        )}
        
        <div className="flex justify-end mt-8">
          <Button onClick={onClose} variant="outline" size="lg" className="text-base px-6 py-3">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}