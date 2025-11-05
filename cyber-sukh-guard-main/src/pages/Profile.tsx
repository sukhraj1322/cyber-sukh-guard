import { Navbar } from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useBanking } from '@/lib/bankingContext';
import { Shield, Fingerprint, Mail, Phone, User, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

export default function Profile() {
  const { user, twoFactorEnabled, biometricEnabled, enableTwoFactor, enableBiometric } = useBanking();
  const { toast } = useToast();

  const handleEnable2FA = () => {
    enableTwoFactor();
    toast({
      title: "2FA Enabled",
      description: "Two-factor authentication has been activated",
    });
  };

  const handleEnableBiometric = () => {
    enableBiometric();
    toast({
      title: "Biometric Enabled",
      description: "Biometric authentication has been activated",
    });
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
            <h1 className="text-3xl font-bold mb-2">Profile & Security</h1>
            <p className="text-muted-foreground">
              Manage your account settings and security preferences
            </p>
          </div>

          {/* Profile Card */}
          <Card className="glass-effect glow-effect">
            <CardContent className="p-6">
              <div className="flex items-center gap-6">
                <div className="bg-gradient-to-br from-primary to-accent p-6 rounded-full">
                  <User className="h-12 w-12 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-1">{user?.name}</h2>
                  <p className="text-muted-foreground">{user?.email}</p>
                  <Badge className="mt-2" variant="default">Premium Account</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Information */}
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Your personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Full Name</p>
                  <p className="font-medium">{user?.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Email Address</p>
                  <p className="font-medium">{user?.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Mobile Number</p>
                  <p className="font-medium">{user?.mobile}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Shield className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Account ID</p>
                  <p className="font-medium font-mono">{user?.id}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage your account security features</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-lg ${
                    twoFactorEnabled ? 'bg-success/10' : 'bg-muted/50'
                  }`}>
                    <Mail className={`h-5 w-5 ${
                      twoFactorEnabled ? 'text-success' : 'text-muted-foreground'
                    }`} />
                  </div>
                  <div>
                    <p className="font-medium">Two-Factor Authentication</p>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security with OTP
                    </p>
                  </div>
                </div>
                {twoFactorEnabled ? (
                  <Badge variant="default" className="bg-success gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Enabled
                  </Badge>
                ) : (
                  <Button size="sm" onClick={handleEnable2FA}>
                    Enable
                  </Button>
                )}
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-lg ${
                    biometricEnabled ? 'bg-success/10' : 'bg-muted/50'
                  }`}>
                    <Fingerprint className={`h-5 w-5 ${
                      biometricEnabled ? 'text-success' : 'text-muted-foreground'
                    }`} />
                  </div>
                  <div>
                    <p className="font-medium">Biometric Authentication</p>
                    <p className="text-sm text-muted-foreground">
                      Use fingerprint or face ID for login
                    </p>
                  </div>
                </div>
                {biometricEnabled ? (
                  <Badge variant="default" className="bg-success gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Enabled
                  </Badge>
                ) : (
                  <Button size="sm" onClick={handleEnableBiometric}>
                    Enable
                  </Button>
                )}
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-success/10">
                    <Shield className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <p className="font-medium">Password Protection</p>
                    <p className="text-sm text-muted-foreground">
                      Your password is encrypted and secure
                    </p>
                  </div>
                </div>
                <Badge variant="default" className="bg-success gap-1">
                  <CheckCircle className="h-3 w-3" />
                  Active
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Security Score */}
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle>Security Score</CardTitle>
              <CardDescription>Your overall account security rating</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">
                    {(twoFactorEnabled && biometricEnabled) ? '95' : twoFactorEnabled || biometricEnabled ? '75' : '60'}/100
                  </span>
                  <Badge variant={(twoFactorEnabled && biometricEnabled) ? "default" : "outline"} className="bg-success">
                    {(twoFactorEnabled && biometricEnabled) ? 'Excellent' : twoFactorEnabled || biometricEnabled ? 'Good' : 'Fair'}
                  </Badge>
                </div>
                <div className="w-full bg-muted rounded-full h-3">
                  <div 
                    className="bg-success h-3 rounded-full transition-all"
                    style={{ 
                      width: `${(twoFactorEnabled && biometricEnabled) ? '95' : twoFactorEnabled || biometricEnabled ? '75' : '60'}%` 
                    }}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  {!(twoFactorEnabled && biometricEnabled) && 
                    'Enable all security features to maximize your protection'
                  }
                  {(twoFactorEnabled && biometricEnabled) && 
                    'Your account has maximum security protection'
                  }
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
