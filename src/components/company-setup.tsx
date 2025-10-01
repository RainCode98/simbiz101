"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { getCurrencySymbol } from '@/lib/currency';

const COUNTRIES = [
  "United States",
  "United Kingdom",
  "Germany",
  "France",
  "Japan",
  "China",
  "India",
  "Canada",
  "Australia",
  "Brazil",
  "South Korea",
  "Italy",
  "Spain",
  "Netherlands",
  "Switzerland",
  "Sweden",
  "Norway",
  "Denmark",
  "Finland",
  "Singapore"
];

interface CompanySetupProps {
  user: any;
  onCompanyCreated: (companyData: any) => void;
}

export function CompanySetup({ user, onCompanyCreated }: CompanySetupProps) {
  const [companyName, setCompanyName] = useState('');
  const [country, setCountry] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!companyName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a company name",
        variant: "destructive",
      });
      return;
    }

    if (!country) {
      toast({
        title: "Error",
        description: "Please select a country",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/company/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          companyName: companyName.trim(),
          country,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Company creation failed');
      }

      // Update user data in localStorage
      const updatedUser = { ...user, company: data.company, hasCompany: true };
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
      
      toast({
        title: "Company Created!",
        description: `${data.company.name} is now ready for business`,
      });

      onCompanyCreated(data.company);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Company creation failed',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md border-2 shadow-lg">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl font-bold text-primary-foreground">🏢</span>
          </div>
          <CardTitle className="text-3xl font-bold text-primary">
            Setup Your Company
          </CardTitle>
          <CardDescription className="text-lg">
            Welcome, {user.username}! Let's create your company
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="companyName" className="text-base font-medium">Company Name</Label>
              <Input
                id="companyName"
                type="text"
                placeholder="Enter your company name"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                disabled={isLoading}
                required
                minLength={2}
                className="text-base py-3"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country" className="text-base font-medium">Country</Label>
              <Select value={country} onValueChange={setCountry} disabled={isLoading}>
                <SelectTrigger className="text-base py-3">
                  <SelectValue placeholder="Select your country" />
                </SelectTrigger>
                <SelectContent>
                  {COUNTRIES.map((countryName) => (
                    <SelectItem key={countryName} value={countryName}>
                      {countryName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button 
              type="submit" 
              className="w-full text-base py-3 font-semibold" 
              disabled={isLoading}
            >
              {isLoading ? 'Creating...' : 'Create Company'}
            </Button>
          </form>
          <div className="p-4 bg-muted/50 rounded-lg border">
            <h4 className="font-semibold text-sm mb-3 text-foreground">Starting Resources:</h4>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li className="flex items-center gap-2">
                <span className="text-green-600">💰</span>
                {getCurrencySymbol(country)}15,000 starting capital
              </li>
              <li className="flex items-center gap-2">
                <span className="text-blue-600">👤</span>
                1 employee (you)
              </li>
              <li className="flex items-center gap-2">
                <span className="text-yellow-600">😊</span>
                50% happiness & reputation
              </li>
              <li className="flex items-center gap-2">
                <span className="text-purple-600">🏢</span>
                Office in {country || 'selected country'}
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}