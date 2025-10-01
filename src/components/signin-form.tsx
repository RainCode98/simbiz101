"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';

interface SigninFormProps {
  onSignin: (userData: any) => void;
}

export function SigninForm({ onSignin }: SigninFormProps) {
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim()) {
      toast({
        title: "Error",
        description: "Please enter a username",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: username.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Signin failed');
      }

      // Store user data in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      
      toast({
        title: "Welcome!",
        description: `Signed in as ${data.user.username}`,
      });

      onSignin(data.user);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Signin failed',
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
            <span className="text-2xl font-bold text-primary-foreground">BT</span>
          </div>
          <CardTitle className="text-3xl font-bold text-primary">
            Business Tycoon
          </CardTitle>
          <CardDescription className="text-lg">
            Build your corporate empire from scratch
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-base font-medium">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
                required
                minLength={3}
                className="text-base py-3"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full text-base py-3 font-semibold" 
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Start Building'}
            </Button>
          </form>
          <div className="text-center space-y-2 pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              Enter any username to begin your journey
            </p>
            <p className="text-sm text-muted-foreground">
              Your progress will be saved automatically
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}