"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, Star, Crown, Gem, Lock, Gift } from 'lucide-react';

interface CollectiblesTabProps {
  company: any;
  user: any;
}

export function CollectiblesTab({ company, user }: CollectiblesTabProps) {
  const [collectibles] = useState([
    {
      id: 1,
      name: "First Dollar",
      description: "Commemorate your first dollar earned",
      category: "Achievement",
      rarity: "Common",
      obtained: true,
      obtainedAt: "2024-01-08",
      value: 100,
      icon: <Trophy className="h-6 w-6" />,
      bonus: "+1% to all revenue"
    },
    {
      id: 2,
      name: "Golden Office",
      description: "Upgrade your office to premium status",
      category: "Upgrade",
      rarity: "Rare",
      obtained: true,
      obtainedAt: "2024-01-10",
      value: 500,
      icon: <Crown className="h-6 w-6" />,
      bonus: "+5% employee happiness"
    },
    {
      id: 3,
      name: "Diamond Contract",
      description: "Sign a landmark business deal",
      category: "Achievement",
      rarity: "Epic",
      obtained: false,
      progress: 75,
      required: 100,
      value: 2000,
      icon: <Gem className="h-6 w-6" />,
      bonus: "+10% to deal values"
    },
    {
      id: 4,
      name: "Platinum Investor",
      description: "Reach $100K in total investments",
      category: "Milestone",
      rarity: "Legendary",
      obtained: false,
      progress: 25000,
      required: 100000,
      value: 5000,
      icon: <Star className="h-6 w-6" />,
      bonus: "+15% investment returns"
    }
  ]);

  const [packs] = useState([
    {
      id: 101,
      name: "Starter Pack",
      description: "Perfect for new players",
      price: 500,
      items: 3,
      guaranteedRarity: "Common",
      chanceRare: 20,
      chanceEpic: 5,
      chanceLegendary: 1,
      icon: <Gift className="h-6 w-6" />
    },
    {
      id: 102,
      name: "Business Pack",
      description: "For growing companies",
      price: 2000,
      items: 5,
      guaranteedRarity: "Rare",
      chanceRare: 40,
      chanceEpic: 15,
      chanceLegendary: 5,
      icon: <Trophy className="h-6 w-6" />
    },
    {
      id: 103,
      name: "Executive Pack",
      description: "Premium collectibles for elite players",
      price: 10000,
      items: 7,
      guaranteedRarity: "Epic",
      chanceRare: 20,
      chanceEpic: 40,
      chanceLegendary: 20,
      icon: <Crown className="h-6 w-6" />
    }
  ]);

  const [trades] = useState([
    {
      id: 201,
      offeredBy: "Player123",
      offered: "First Dollar",
      requested: "Golden Office",
      status: "pending",
      timeLeft: "2 hours"
    },
    {
      id: 202,
      offeredBy: "CompanyX",
      offered: "Diamond Contract",
      requested: "2 Rare Collectibles",
      status: "pending",
      timeLeft: "5 hours"
    }
  ]);

  const totalValue = collectibles.filter(c => c.obtained).reduce((sum, c) => sum + c.value, 0);
  const completionRate = (collectibles.filter(c => c.obtained).length / collectibles.length) * 100;

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "Common": return "bg-gray-100 text-gray-800 border-gray-300";
      case "Rare": return "bg-blue-100 text-blue-800 border-blue-300";
      case "Epic": return "bg-purple-100 text-purple-800 border-purple-300";
      case "Legendary": return "bg-orange-100 text-orange-800 border-orange-300";
      default: return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getRarityBorder = (rarity: string) => {
    switch (rarity) {
      case "Common": return "border-gray-300";
      case "Rare": return "border-blue-400";
      case "Epic": return "border-purple-400";
      case "Legendary": return "border-orange-400";
      default: return "border-gray-300";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-primary">Collectibles</h2>
          <p className="text-muted-foreground">Collect rare items and unlock powerful bonuses</p>
        </div>
        <Button className="font-mono">
          <Gift className="h-4 w-4 mr-2" />
          Open Pack
        </Button>
      </div>

      {/* Collection Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Collection Value</CardTitle>
            <Gem className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total value</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Collection</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{collectibles.filter(c => c.obtained).length}/{collectibles.length}</div>
            <p className="text-xs text-muted-foreground">{completionRate.toFixed(0)}% complete</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rarest Item</CardTitle>
            <Crown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">Epic</div>
            <p className="text-xs text-muted-foreground">Golden Office</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Bonuses</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">2</div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="collection" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="collection">Collection</TabsTrigger>
          <TabsTrigger value="packs">Packs</TabsTrigger>
          <TabsTrigger value="trades">Trades</TabsTrigger>
          <TabsTrigger value="market">Market</TabsTrigger>
        </TabsList>

        <TabsContent value="collection" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {collectibles.map(collectible => (
              <Card key={collectible.id} className={`relative ${getRarityBorder(collectible.rarity)} border-2`}>
                <CardHeader className="text-center">
                  <div className={`mx-auto p-3 rounded-lg ${collectible.obtained ? 'bg-primary/10' : 'bg-gray-100'}`}>
                    {collectible.obtained ? collectible.icon : <Lock className="h-6 w-6" />}
                  </div>
                  <CardTitle className="text-lg">{collectible.name}</CardTitle>
                  <CardDescription>{collectible.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <Badge className={getRarityColor(collectible.rarity)}>{collectible.rarity}</Badge>
                      <span className="text-sm font-semibold">${collectible.value}</span>
                    </div>
                    
                    {collectible.obtained ? (
                      <div className="space-y-2">
                        <div className="text-xs text-green-600 bg-green-50 p-2 rounded">
                          <strong>Active Bonus:</strong> {collectible.bonus}
                        </div>
                        <p className="text-xs text-muted-foreground text-center">
                          Obtained: {collectible.obtainedAt}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Progress</span>
                            <span>{collectible.progress}/{collectible.required}</span>
                          </div>
                          <Progress value={(collectible.progress / collectible.required) * 100} className="h-2" />
                        </div>
                        <p className="text-xs text-muted-foreground text-center">
                          Keep playing to unlock!
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="packs" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {packs.map(pack => (
              <Card key={pack.id}>
                <CardHeader className="text-center">
                  <div className="mx-auto p-3 bg-blue-100 rounded-lg">
                    {pack.icon}
                  </div>
                  <CardTitle className="text-lg">{pack.name}</CardTitle>
                  <CardDescription>{pack.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary">${pack.price}</p>
                      <p className="text-sm text-muted-foreground">{pack.items} items</p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Guaranteed:</span>
                        <Badge variant="outline" className="text-xs">{pack.guaranteedRarity}</Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Rare chance:</span>
                        <span>{pack.chanceRare}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Epic chance:</span>
                        <span>{pack.chanceEpic}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Legendary chance:</span>
                        <span>{pack.chanceLegendary}%</span>
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full font-mono"
                      disabled={company.money < pack.price}
                    >
                      {company.money < pack.price ? "Insufficient Funds" : "Buy Pack"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="trades" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Trade Offers</CardTitle>
              <CardDescription>Current trade proposals from other players</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trades.map(trade => (
                  <div key={trade.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Offered</p>
                        <p className="font-semibold">{trade.offered}</p>
                      </div>
                      <div className="text-xl text-muted-foreground">↔</div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Requested</p>
                        <p className="font-semibold">{trade.requested}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">From {trade.offeredBy}</p>
                      <p className="text-xs text-muted-foreground">{trade.timeLeft} left</p>
                      <div className="flex gap-2 mt-2">
                        <Button size="sm" variant="outline">Accept</Button>
                        <Button size="sm" variant="outline">Decline</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="market" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Collectible Market</CardTitle>
              <CardDescription>Buy and sell collectibles with other players</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Trophy className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Market feature coming soon!</p>
                <p className="text-sm text-muted-foreground">Trade collectibles with players worldwide</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}