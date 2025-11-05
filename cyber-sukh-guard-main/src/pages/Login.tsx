import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Fingerprint, Mail, Lock as LockIcon } from 'lucide-react';
import { useBanking } from '@/lib/bankingContext';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [showBiometric, setShowBiometric] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { login } = useBanking();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please enter email and password",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    setShowOtp(true);
    
    toast({
      title: "OTP Sent",
      description: "Enter the OTP sent to your email (use any 6 digits for demo)",
    });
    
    setLoading(false);
  };

  const verifyOtp = () => {
    if (otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a 6-digit OTP",
        variant: "destructive"
      });
      return;
    }

    setShowOtp(false);
    setShowBiometric(true);
    
    toast({
      title: "OTP Verified",
      description: "Please complete biometric verification",
    });
  };

  const verifyBiometric = async () => {
    setLoading(true);
    
    // Simulate biometric verification
    setTimeout(async () => {
      const success = await login(email, password);
      
      if (success) {
        toast({
          title: "Login Successful",
          description: "Welcome to Sukh Secure Bank",
        });
        navigate('/dashboard');
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid credentials",
          variant: "destructive"
        });
      }
      
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
      <div className="absolute top-20 left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-4 glow-effect">
            <Shield className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Sukh Secure Bank
          </h1>
          <p className="text-muted-foreground">Next-gen secure banking platform</p>
        </div>

        <Card className="glass-effect">
          <CardHeader>
            <CardTitle>Secure Login</CardTitle>
            <CardDescription>
              Protected with 2FA & Biometric Authentication
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!showOtp && !showBiometric && (
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <LockIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Processing...' : 'Continue to 2FA'}
                </Button>
              </form>
            )}

            {showOtp && !showBiometric && (
              <div className="space-y-4">
                <div className="text-center space-y-2">
                  <div className="inline-flex items-center justify-center p-3 bg-accent/10 rounded-full mb-2">
                    <Mail className="h-8 w-8 text-accent" />
                  </div>
                  <h3 className="font-semibold">Enter OTP</h3>
                  <p className="text-sm text-muted-foreground">
                    We've sent a code to {email}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="otp">6-Digit OTP</Label>
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

                <Button onClick={verifyOtp} className="w-full">
                  Verify OTP
                </Button>
                <Button variant="ghost" onClick={() => setShowOtp(false)} className="w-full">
                  Back
                </Button>
              </div>
            )}

            {showBiometric && (
              <div className="space-y-4">
                <div className="text-center space-y-2">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="inline-flex items-center justify-center p-3 bg-success/10 rounded-full mb-2"
                  >
                    <Fingerprint className="h-12 w-12 text-success" />
                  </motion.div>
                  <h3 className="font-semibold">Biometric Verification</h3>
                  <p className="text-sm text-muted-foreground">
                    Place your finger on the sensor or use Face ID
                  </p>
                </div>

                <Button 
                  onClick={verifyBiometric} 
                  className="w-full gap-2"
                  disabled={loading}
                >
                  <Fingerprint className="h-4 w-4" />
                  {loading ? 'Verifying...' : 'Verify Biometric'}
                </Button>
                <Button variant="ghost" onClick={() => setShowBiometric(false)} className="w-full">
                  Back
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-6 text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            🔒 Secured with 256-bit encryption
          </p>
          <p className="text-xs text-muted-foreground">
            For demo: Use any email/password combination
          </p>
        </div>
      </motion.div>
    </div>
  );
}
