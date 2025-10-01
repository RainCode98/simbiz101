"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building, Car, Smartphone, Laptop, Gem, TrendingUp, Plus } from 'lucide-react';

interface AssetsTabProps {
  company: any;
  user: any;
}

export function AssetsTab({ company, user }: AssetsTabProps) {
  const [assets] = useState([
    {
      id: 1,
      name: "Office Building",
      category: "Real Estate",
      value: 250000,
      purchasePrice: 200000,
      appreciation: 25.0,
      condition: 95,
      status: "owned",
      icon: <Building className="h-4 w-4" />,
      description: "Main company headquarters"
    },
    {
      id: 2,
      name: "Company Car",
      category: "Vehicles",
      value: 45000,
      purchasePrice: 50000,
      appreciation: -10.0,
      condition: 78,
      status: "owned",
      icon: <Car className="h-4 w-4" />,
      description: "Executive vehicle"
    },
    {
      id: 3,
      name: "Server Equipment",
      category: "Technology",
      value: 15000,
      purchasePrice: 20000,
      appreciation: -25.0,
      condition: 65,
      status: "owned",
      icon: <Laptop className="h-4 w-4" />,
      description: "IT infrastructure"
    }
  ]);

  const [marketplace] = useState([
    {
      id: 101,
      name: "Downtown Office Space",
      category: "Real Estate",
      price: 350000,
      monthlyIncome: 2500,
      appreciation: 8.5,
      rarity: "Rare",
      icon: <Building className="h-4 w-4" />,
      description: "Prime location with high rental potential"
    },
    {
      id: 102,
      name: "Luxury Vehicle Fleet",
      category: "Vehicles",
      price: 120000,
      monthlyIncome: 0,
      appreciation: -12.0,
      rarity: "Epic",
      icon: <Car className="h-4 w-4" />,
      description: "3 premium company vehicles"
    },
    {
      id: 103,
      name: "Advanced AI System",
      category: "Technology",
      price: 75000,
      monthlyIncome: 500,
      appreciation: 15.0,
      rarity: "Legendary",
      icon: <Smartphone className="h-4 w-4" />,
      description: "Cutting-edge AI for business automation"
    },
    {
      id: 104,
      name: "Gold Bullion",
      category: "Commodities",
      price: 50000,
      monthlyIncome: 0,
      appreciation: 5.0,
      rarity: "Rare",
      icon: <Gem className="h-4 w-4" />,
      description: "Safe haven investment"
    }
  ]);

  const totalAssetValue = assets.reduce((sum, asset) => sum + asset.value, 0);
  const totalPurchaseValue = assets.reduce((sum, asset) => sum + asset.purchasePrice, 0);
  const totalAppreciation = ((totalAssetValue - totalPurchaseValue) / totalPurchaseValue) * 100;

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "Common": return "bg-gray-100 text-gray-800";
      case "Rare": return "bg-blue-100 text-blue-800";
      case "Epic": return "bg-purple-100 text-purple-800";
      case "Legendary": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getConditionColor = (condition: number) => {
    if (condition >= 90) return "text-green-600";
    if (condition >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const getAppreciationColor = (appreciation: number) => {
    return appreciation >= 0 ? "text-green-600" : "text-red-600";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-primary">Assets</h2>
          <p className="text-muted-foreground">Manage your company's valuable assets</p>
        </div>
        <Button className="font-mono">
          <Plus className="h-4 w-4 mr-2" />
          Buy Asset
        </Button>
      </div>

      {/* Asset Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalAssetValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">All assets combined</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Return</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getAppreciationColor(totalAppreciation)}`}>
              {totalAppreciation >= 0 ? "+" : ""}{totalAppreciation.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              ${totalAssetValue >= totalPurchaseValue ? "+" : ""}${(totalAssetValue - totalPurchaseValue).toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Income</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">$2,500</div>
            <p className="text-xs text-muted-foreground">From assets</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Asset Count</CardTitle>
            <Gem className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{assets.length}</div>
            <p className="text-xs text-muted-foreground">Owned assets</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="owned" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="owned">Owned Assets</TabsTrigger>
          <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="owned" className="space-y-4">
          {assets.map(asset => (
            <Card key={asset.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      {asset.icon}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{asset.name}</CardTitle>
                      <CardDescription>{asset.category} • {asset.description}</CardDescription>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary" className="mb-1">Owned</Badge>
                    <p className="text-sm text-muted-foreground">{asset.category}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Current Value</p>
                      <p className="font-semibold">${asset.value.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Purchase Price</p>
                      <p className="font-semibold">${asset.purchasePrice.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Return</p>
                      <p className={`font-semibold ${getAppreciationColor(asset.appreciation)}`}>
                        {asset.appreciation >= 0 ? "+" : ""}{asset.appreciation}%
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Condition</p>
                      <p className={`font-semibold ${getConditionColor(asset.condition)}`}>
                        {asset.condition}%
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Upgrade</Button>
                    <Button variant="outline" size="sm">Maintain</Button>
                    <Button variant="outline" size="sm">Sell</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="marketplace" className="space-y-4">
          {marketplace.map(item => (
            <Card key={item.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      {item.icon}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{item.name}</CardTitle>
                      <CardDescription>{item.category} • {item.description}</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getRarityColor(item.rarity)}>{item.rarity}</Badge>
                    <Badge variant="secondary">${item.price.toLocaleString()}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Expected Return</p>
                      <p className={`font-semibold ${getAppreciationColor(item.appreciation)}`}>
                        {item.appreciation >= 0 ? "+" : ""}{item.appreciation}%
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Monthly Income</p>
                      <p className="font-semibold text-green-600">
                        {item.monthlyIncome > 0 ? `+$${item.monthlyIncome.toLocaleString()}` : "None"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Category</p>
                      <p className="font-semibold">{item.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      {item.monthlyIncome > 0 ? `Generates $${item.monthlyIncome.toLocaleString()}/month` : "No passive income"}
                    </p>
                    <Button 
                      size="sm"
                      disabled={company.money < item.price}
                    >
                      {company.money < item.price ? "Insufficient Funds" : "Purchase"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Asset Distribution</CardTitle>
                <CardDescription>Your assets by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {["Real Estate", "Vehicles", "Technology"].map((category, index) => {
                    const value = assets.filter(a => a.category === category).reduce((sum, a) => sum + a.value, 0);
                    const percentage = totalAssetValue > 0 ? (value / totalAssetValue) * 100 : 0;
                    return (
                      <div key={category}>
                        <div className="flex justify-between text-sm mb-2">
                          <span>{category}</span>
                          <span>{percentage.toFixed(1)}%</span>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Summary</CardTitle>
                <CardDescription>How your assets are performing</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Best Performer</span>
                    <span className="font-semibold text-green-600">Office Building (+25%)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Worst Performer</span>
                    <span className="font-semibold text-red-600">Server Equipment (-25%)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average Condition</span>
                    <span className="font-semibold">79%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Monthly Passive Income</span>
                    <span className="font-semibold text-green-600">$2,500</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}