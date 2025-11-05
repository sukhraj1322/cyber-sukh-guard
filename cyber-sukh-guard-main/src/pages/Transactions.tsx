import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useBanking } from '@/lib/bankingContext';
import { useToast } from '@/hooks/use-toast';
import { ArrowRight, Shield, AlertCircle, CheckCircle2, Fingerprint } from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { generateReceipt } from '@/lib/pdfGenerator';

export default function Transactions() {
  const { user, addTransaction } = useBanking();
  const { toast } = useToast();
  
  const [recipient, setRecipient] = useState('');
  const [account, setAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [showBiometric, setShowBiometric] = useState(false);
  const [safetyScore, setSafetyScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const calculateSafetyScore = (accountId: string): number => {
    // Simulate fraud detection
    const knownSafeAccounts = ['amazon@upi', 'swiggy@paytm', 'google@pay'];
    const isSafe = knownSafeAccounts.some(safe => accountId.toLowerCase().includes(safe));
    
    if (isSafe) return Math.floor(Math.random() * 6) + 95; // 95-100
    if (accountId.includes('@')) return Math.floor(Math.random() * 10) + 85; // 85-95
    return Math.floor(Math.random() * 15) + 70; // 70-85
  };

  const handleCheckSafety = () => {
    if (!account) {
      toast({
        title: "Error",
        description: "Please enter recipient account",
        variant: "destructive"
      });
      return;
    }

    const score = calculateSafetyScore(account);
    setSafetyScore(score);
    
    toast({
      title: "Safety Check Complete",
      description: `Safety Score: ${score}/100`,
      variant: score >= 90 ? "default" : "destructive"
    });
  };

  const handleSendMoney = () => {
    if (!recipient || !account || !amount || !category) {
      toast({
        title: "Error",
        description: "Please fill all fields",
        variant: "destructive"
      });
      return;
    }

    const numAmount = parseFloat(amount);
    if (numAmount <= 0 || numAmount > (user?.balance || 0)) {
      toast({
        title: "Error",
        description: "Invalid amount",
        variant: "destructive"
      });
      return;
    }

    setShowOtp(true);
    toast({
      title: "OTP Sent",
      description: "Enter OTP for transaction verification",
    });
  };

  const verifyOtp = () => {
    if (otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter 6-digit OTP",
        variant: "destructive"
      });
      return;
    }

    setShowOtp(false);
    setShowBiometric(true);
    toast({
      title: "OTP Verified",
      description: "Complete biometric verification",
    });
  };

  const completeBiometric = () => {
    setLoading(true);
    
    setTimeout(() => {
      const transaction = {
        type: 'debit' as const,
        amount: parseFloat(amount),
        recipient,
        recipientAccount: account,
        category,
        status: 'completed' as const,
        safetyScore: safetyScore || 100
      };

      addTransaction(transaction);
      
      toast({
        title: "Transaction Successful",
        description: `₹${amount} sent to ${recipient}`,
      });

      // Generate receipt
      setTimeout(() => {
        generateReceipt(
          {
            id: Date.now().toString(),
            date: new Date(),
            ...transaction
          },
          user?.name || 'Sukh'
        );
        
        toast({
          title: "Receipt Generated",
          description: "Transaction receipt has been downloaded",
        });
      }, 500);

      // Reset form
      setRecipient('');
      setAccount('');
      setAmount('');
      setCategory('');
      setOtp('');
      setSafetyScore(null);
      setShowBiometric(false);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto p-4 md:p-6 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold mb-2">Send Money</h1>
            <p className="text-muted-foreground">
              Secure money transfer with fraud detection
            </p>
          </div>

          {/* Balance Card */}
          <Card className="glass-effect glow-effect">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Available Balance</p>
                  <p className="text-3xl font-bold">₹{user?.balance.toLocaleString('en-IN')}</p>
                </div>
                <Shield className="h-12 w-12 text-primary animate-glow" />
              </div>
            </CardContent>
          </Card>

          {/* Transaction Form */}
          {!showOtp && !showBiometric && (
            <Card className="glass-effect">
              <CardHeader>
                <CardTitle>Transaction Details</CardTitle>
                <CardDescription>Enter recipient and amount information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="recipient">Recipient Name</Label>
                  <Input
                    id="recipient"
                    placeholder="Enter recipient name"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="account">Account / UPI ID</Label>
                  <div className="flex gap-2">
                    <Input
                      id="account"
                      placeholder="recipient@upi or account number"
                      value={account}
                      onChange={(e) => setAccount(e.target.value)}
                      className="flex-1"
                    />
                    <Button 
                      variant="outline" 
                      onClick={handleCheckSafety}
                      className="gap-2"
                    >
                      <Shield className="h-4 w-4" />
                      Check
                    </Button>
                  </div>
                  {safetyScore !== null && (
                    <div className={`flex items-center gap-2 p-3 rounded-lg ${
                      safetyScore >= 90 ? 'bg-success/10' : 'bg-warning/10'
                    }`}>
                      {safetyScore >= 90 ? (
                        <CheckCircle2 className="h-5 w-5 text-success" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-warning" />
                      )}
                      <div className="flex-1">
                        <p className="text-sm font-medium">Safety Score: {safetyScore}/100</p>
                        <p className="text-xs text-muted-foreground">
                          {safetyScore >= 90 ? 'Verified safe account' : 'Proceed with caution'}
                        </p>
                      </div>
                      <Badge variant={safetyScore >= 90 ? "default" : "outline"}>
                        {safetyScore >= 90 ? 'Safe' : 'Caution'}
                      </Badge>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (₹)</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Food">Food & Dining</SelectItem>
                      <SelectItem value="Shopping">Shopping</SelectItem>
                      <SelectItem value="Bills">Bills & Utilities</SelectItem>
                      <SelectItem value="Travel">Travel</SelectItem>
                      <SelectItem value="Entertainment">Entertainment</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={handleSendMoney} className="w-full gap-2" size="lg">
                  Continue to Verification
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          )}

          {/* OTP Verification */}
          {showOtp && !showBiometric && (
            <Card className="glass-effect">
              <CardHeader>
                <CardTitle>OTP Verification</CardTitle>
                <CardDescription>Enter the 6-digit code sent to your registered email</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otp">Enter OTP</Label>
                  <Input
                    id="otp"
                    type="text"
                    maxLength={6}
                    placeholder="000000"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    className="text-center text-2xl tracking-widest"
                  />
                </div>

                <Button onClick={verifyOtp} className="w-full" size="lg">
                  Verify OTP
                </Button>
                <Button variant="ghost" onClick={() => setShowOtp(false)} className="w-full">
                  Cancel
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Biometric Verification */}
          {showBiometric && (
            <Card className="glass-effect">
              <CardHeader>
                <CardTitle>Biometric Authentication</CardTitle>
                <CardDescription>Verify your identity to complete transaction</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center space-y-4">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="inline-flex items-center justify-center p-6 bg-success/10 rounded-full"
                  >
                    <Fingerprint className="h-16 w-16 text-success" />
                  </motion.div>
                  <div>
                    <p className="font-semibold text-lg mb-2">Place your finger</p>
                    <p className="text-sm text-muted-foreground">
                      Authenticating transaction for ₹{amount} to {recipient}
                    </p>
                  </div>
                </div>

                <Button 
                  onClick={completeBiometric} 
                  className="w-full gap-2" 
                  size="lg"
                  disabled={loading}
                >
                  <Fingerprint className="h-4 w-4" />
                  {loading ? 'Processing...' : 'Complete Transaction'}
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => setShowBiometric(false)} 
                  className="w-full"
                  disabled={loading}
                >
                  Cancel
                </Button>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
}
