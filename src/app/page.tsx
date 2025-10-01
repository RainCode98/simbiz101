"use client";

import { useState, useEffect } from 'react';
import { SigninForm } from '@/components/signin-form';
import { CompanySetup } from '@/components/company-setup';
import { TabbedDashboard } from '@/components/TabbedDashboard';

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [company, setCompany] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing user session on mount
  useEffect(() => {
    // Clear any existing data for fresh build
    if (typeof window !== 'undefined') {
      localStorage.clear();
    }
    setLoading(false);
  }, []);

  const handleSignin = (userData: any) => {
    setUser(userData);
    if (userData.hasCompany && userData.company) {
      setCompany(userData.company);
    }
  };

  const handleCompanyCreated = (companyData: any) => {
    setCompany(companyData);
  };

  const refreshCompanyData = async () => {
    if (!company) return;
    
    try {
      const response = await fetch('/api/company/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyId: company.id })
      });
      
      const data = await response.json();
      if (response.ok) {
        setCompany(data.company);
        // Update localStorage with fresh company data
        const updatedUser = { ...user, company: data.company, hasCompany: true };
        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(updatedUser));
        }
      }
    } catch (error) {
      console.error('Failed to refresh company data:', error);
    }
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
    }
    setUser(null);
    setCompany(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading Business Tycoon...</p>
        </div>
      </div>
    );
  }

  // Show dashboard if user has company
  if (user && company) {
    return <TabbedDashboard user={user} company={company} onLogout={handleLogout} refreshCompanyData={refreshCompanyData} />;
  }

  // Show company setup if user exists but no company
  if (user && !company) {
    return <CompanySetup user={user} onCompanyCreated={handleCompanyCreated} />;
  }

  // Show signin form by default
  return <SigninForm onSignin={handleSignin} />;
}