import { Navbar } from '@/components/Navbar';
import { StatCard } from '@/components/StatCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useBanking } from '@/lib/bankingContext';
import { Wallet, TrendingUp, TrendingDown, PiggyBank, Shield, AlertTriangle, BarChart3, PieChart, Target, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PieChart as RechartsPie, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useState } from 'react';

export default function Dashboard() {
  const { user, transactions, cards } = useBanking();
  const [viewMode, setViewMode] = useState<'bar' | 'pie'>('pie');

  const totalCredit = transactions
    .filter(t => t.type === 'credit')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalDebit = transactions
    .filter(t => t.type === 'debit')
    .reduce((sum, t) => sum + t.amount, 0);

  const categorySpending = transactions
    .filter(t => t.type === 'debit')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const topCategories = Object.entries(categorySpending)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const recentTransactions = transactions.slice(0, 5);
  const activeCards = cards.filter(c => !c.blocked).length;

  const pieChartData = topCategories.map(([category, amount]) => ({
    name: category,
    value: amount,
  }));

  const COLORS = ['hsl(var(--primary))', 'hsl(var(--success))', 'hsl(var(--warning))', 'hsl(var(--danger))', 'hsl(var(--accent))'];

  const savingsGoals = [
    { name: 'Emergency Fund', current: 45000, target: 100000, icon: Shield },
    { name: 'Dream Vacation', current: 25000, target: 150000, icon: Target },
    { name: 'New Car', current: 180000, target: 500000, icon: TrendingUp },
  ];

  const investmentOptions = [
    { name: 'Fixed Deposit', rate: '7.2%', risk: 'Low', recommended: true, icon: Shield },
    { name: 'Mutual Funds', rate: '12-15%', risk: 'Medium', recommended: true, icon: TrendingUp },
    { name: 'Stock Market', rate: '15-25%', risk: 'High', recommended: false, icon: Briefcase },
    { name: 'Gold', rate: '8-10%', risk: 'Low', recommended: true, icon: PiggyBank },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto p-4 md:p-6 space-y-6">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-effect rounded-lg p-6 relative overflow-hidden"
        >
          <div className="absolute inset-0 gradient-primary opacity-50" />
          <div className="relative z-10">
            <h1 className="text-3xl font-bold mb-2">Welcome back! 👋</h1>
            <p className="text-muted-foreground">Here's your financial overview</p>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Balance"
            value={`₹${user?.balance.toLocaleString('en-IN')}`}
            icon={Wallet}
            trend="+5.2% from last month"
            trendUp={true}
            gradient="gradient-success"
            delay={0}
          />
          <StatCard
            title="Total Income"
            value={`₹${totalCredit.toLocaleString('en-IN')}`}
            icon={TrendingUp}
            trend="+12.5%"
            trendUp={true}
            gradient="gradient-success"
            delay={0.1}
          />
          <StatCard
            title="Total Expenses"
            value={`₹${totalDebit.toLocaleString('en-IN')}`}
            icon={TrendingDown}
            trend="-3.2%"
            trendUp={false}
            gradient="gradient-danger"
            delay={0.2}
          />
          <StatCard
            title="Active Cards"
            value={`${activeCards}/${cards.length}`}
            icon={PiggyBank}
            trend="All secured"
            trendUp={true}
            gradient="gradient-primary"
            delay={0.3}
          />
        </div>

        {/* Charts and Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Spending by Category */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="glass-effect">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Spending by Category</CardTitle>
                    <CardDescription>Top 5 spending categories this month</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant={viewMode === 'pie' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setViewMode('pie')}
                    >
                      <PieChart className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'bar' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setViewMode('bar')}
                    >
                      <BarChart3 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {viewMode === 'pie' ? (
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPie>
                        <Pie
                          data={pieChartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {pieChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: number) => `₹${value.toLocaleString('en-IN')}`} />
                        <Legend />
                      </RechartsPie>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {topCategories.map(([category, amount], index) => {
                      const percentage = (amount / totalDebit) * 100;
                      return (
                        <div key={category} className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-medium">{category}</span>
                            <span className="text-muted-foreground">
                              ₹{amount.toLocaleString('en-IN')} ({percentage.toFixed(1)}%)
                            </span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${percentage}%` }}
                              transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                              className="bg-primary h-2 rounded-full"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Security Status */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="glass-effect">
              <CardHeader>
                <CardTitle>Security Status</CardTitle>
                <CardDescription>Your account security overview</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-success" />
                    <div>
                      <p className="font-medium text-sm">2FA Enabled</p>
                      <p className="text-xs text-muted-foreground">Two-factor authentication active</p>
                    </div>
                  </div>
                  <Badge variant="default" className="bg-success">Active</Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-success" />
                    <div>
                      <p className="font-medium text-sm">Biometric Auth</p>
                      <p className="text-xs text-muted-foreground">Fingerprint verification enabled</p>
                    </div>
                  </div>
                  <Badge variant="default" className="bg-success">Active</Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium text-sm">Login Attempts</p>
                      <p className="text-xs text-muted-foreground">No suspicious activity detected</p>
                    </div>
                  </div>
                  <Badge variant="outline">0 Failed</Badge>
                </div>

                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm font-medium mb-1">Security Score</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-muted rounded-full h-2">
                      <div className="bg-success h-2 rounded-full w-[95%]" />
                    </div>
                    <span className="text-sm font-bold text-success">95/100</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Savings Goals & Investment */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Savings Goals */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.45 }}
          >
            <Card className="glass-effect">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Savings Goals
                </CardTitle>
                <CardDescription>Track your financial milestones</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {savingsGoals.map((goal, index) => {
                  const percentage = (goal.current / goal.target) * 100;
                  const Icon = goal.icon;
                  return (
                    <motion.div
                      key={goal.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="space-y-2 p-3 rounded-lg bg-muted/30"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4 text-primary" />
                          <span className="font-medium text-sm">{goal.name}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {percentage.toFixed(0)}%
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                          className="bg-success h-2 rounded-full"
                        />
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>₹{goal.current.toLocaleString('en-IN')}</span>
                        <span>₹{goal.target.toLocaleString('en-IN')}</span>
                      </div>
                    </motion.div>
                  );
                })}
              </CardContent>
            </Card>
          </motion.div>

          {/* Investment Recommendations */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.45 }}
          >
            <Card className="glass-effect">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Investment Options
                </CardTitle>
                <CardDescription>Where to grow your wealth</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {investmentOptions.map((option, index) => {
                  const Icon = option.icon;
                  return (
                    <motion.div
                      key={option.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className={`p-3 rounded-lg ${
                        option.recommended
                          ? 'bg-primary/10 border border-primary/20'
                          : 'bg-muted/30'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4 text-primary" />
                          <span className="font-medium text-sm">{option.name}</span>
                        </div>
                        {option.recommended && (
                          <Badge variant="default" className="text-xs">Recommended</Badge>
                        )}
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex gap-3">
                          <span className="text-success font-semibold">Returns: {option.rate}</span>
                          <span className={`${
                            option.risk === 'Low' ? 'text-success' :
                            option.risk === 'Medium' ? 'text-warning' :
                            'text-danger'
                          }`}>
                            Risk: {option.risk}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Recent Transactions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Your latest financial activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentTransactions.map((transaction, index) => (
                  <motion.div
                    key={transaction.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.05 }}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        transaction.type === 'credit' 
                          ? 'bg-success/10 text-success' 
                          : 'bg-destructive/10 text-destructive'
                      }`}>
                        {transaction.type === 'credit' ? (
                          <TrendingUp className="h-5 w-5" />
                        ) : (
                          <TrendingDown className="h-5 w-5" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{transaction.recipient}</p>
                        <p className="text-xs text-muted-foreground">
                          {transaction.date.toLocaleDateString()} • {transaction.category}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${
                        transaction.type === 'credit' ? 'text-success' : 'text-foreground'
                      }`}>
                        {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount.toLocaleString('en-IN')}
                      </p>
                      {transaction.safetyScore && (
                        <p className="text-xs text-muted-foreground">
                          Safety: {transaction.safetyScore}/100
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
