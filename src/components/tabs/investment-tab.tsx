"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, TrendingDown, DollarSign, AlertTriangle, CheckCircle } from 'lucide-react';

interface InvestmentTabProps {
  company: any;
  user: any;
}

export function InvestmentTab({ company, user }: InvestmentTabProps) {
  const [portfolio] = useState([
    {
      id: 1,
      name: "Tech Growth Fund",
      type: "Mutual Fund",
      invested: 5000,
      currentValue: 5850,
      return: 17.0,
      risk: "Medium",
      status: "active"
    },
    {
      id: 2,
      name: "Government Bonds",
      type: "Bonds",
      invested: 3000,
      currentValue: 3150,
      return: 5.0,
      risk: "Low",
      status: "active"
    },
    {
      id: 3,
      name: "Startup Equity",
      type: "Equity",
      invested: 2000,
      currentValue: 1800,
      return: -10.0,
      risk: "High",
      status: "active"
    }
  ]);

  const [opportunities] = useState([
    {
      id: 101,
      name: "Real Estate Fund",
      type: "REIT",
      minimumInvestment: 1000,
      expectedReturn: 8.5,
      risk: "Medium",
      description: "Diversified real estate investment portfolio",
      term: "5 years"
    },
    {
      id: 102,
      name: "Crypto Index",
      type: "Cryptocurrency",
      minimumInvestment: 500,
      expectedReturn: 25.0,
      risk: "High",
      description: "Index fund of major cryptocurrencies",
      term: "Flexible"
    },
    {
      id: 103,
      name: "Green Energy Stocks",
      type: "Stocks",
      minimumInvestment: 1500,
      expectedReturn: 12.0,
      risk: "Medium",
      description: "Portfolio of renewable energy companies",
      term: "3+ years"
    }
  ]);

  const totalInvested = portfolio.reduce((sum, item) => sum + item.invested, 0);
  const totalValue = portfolio.reduce((sum, item) => sum + item.currentValue, 0);
  const totalReturn = ((totalValue - totalInvested) / totalInvested) * 100;

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Low": return "text-green-600";
      case "Medium": return "text-yellow-600";
      case "High": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  const getReturnColor = (returnRate: number) => {
    return returnRate >= 0 ? "text-green-600" : "text-red-600";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-primary">Investments</h2>
          <p className="text-muted-foreground">Grow your capital through strategic investments</p>
        </div>
        <Button className="font-mono">
          <DollarSign className="h-4 w-4 mr-2" />
          New Investment
        </Button>
      </div>

      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Invested</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalInvested.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Initial investment</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Portfolio value</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Return</CardTitle>
            {totalReturn >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-600" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-600" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getReturnColor(totalReturn)}`}>
              {totalReturn >= 0 ? "+" : ""}{totalReturn.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              ${totalValue >= totalInvested ? "+" : ""}${(totalValue - totalInvested).toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Cash</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${company.money.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Ready to invest</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="portfolio" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="portfolio" className="space-y-4">
          {portfolio.map(investment => (
            <Card key={investment.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{investment.name}</CardTitle>
                    <CardDescription>{investment.type}</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={getRiskColor(investment.risk)}>
                      {investment.risk} Risk
                    </Badge>
                    <Badge variant="secondary">Active</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Invested</p>
                      <p className="font-semibold">${investment.invested.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Current Value</p>
                      <p className="font-semibold">${investment.currentValue.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Return</p>
                      <p className={`font-semibold ${getReturnColor(investment.return)}`}>
                        {investment.return >= 0 ? "+" : ""}{investment.return}%
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Add More</Button>
                    <Button variant="outline" size="sm">Withdraw</Button>
                    <Button variant="outline" size="sm">Details</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="opportunities" className="space-y-4">
          {opportunities.map(opportunity => (
            <Card key={opportunity.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{opportunity.name}</CardTitle>
                    <CardDescription>{opportunity.type} • {opportunity.term}</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={getRiskColor(opportunity.risk)}>
                      {opportunity.risk} Risk
                    </Badge>
                    <Badge variant="secondary">
                      {opportunity.expectedReturn}% expected
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">{opportunity.description}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Minimum Investment</p>
                      <p className="font-semibold">${opportunity.minimumInvestment.toLocaleString()}</p>
                    </div>
                    <Button 
                      size="sm"
                      disabled={company.money < opportunity.minimumInvestment}
                    >
                      {company.money < opportunity.minimumInvestment ? "Insufficient Funds" : "Invest Now"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Investment History</CardTitle>
              <CardDescription>Your past investment activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { date: "2024-01-15", action: "Invested", amount: 5000, name: "Tech Growth Fund", status: "completed" },
                  { date: "2024-01-10", action: "Withdrew", amount: 1200, name: "Crypto Index", status: "completed" },
                  { date: "2024-01-05", action: "Received Dividend", amount: 150, name: "Government Bonds", status: "completed" },
                ].map((transaction, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {transaction.status === "completed" ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                      )}
                      <div>
                        <p className="font-medium">{transaction.action}: {transaction.name}</p>
                        <p className="text-sm text-muted-foreground">{transaction.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${transaction.action === "Invested" ? "text-red-600" : "text-green-600"}`}>
                        {transaction.action === "Invested" ? "-" : "+"}${transaction.amount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}