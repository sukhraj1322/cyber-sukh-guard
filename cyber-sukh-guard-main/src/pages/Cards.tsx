import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { BankCard } from '@/components/BankCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useBanking } from '@/lib/bankingContext';
import { useToast } from '@/hooks/use-toast';
import { Plus, Wallet } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Cards() {
  const { user, cards, addCard, toggleCardBlock } = useBanking();
  const { toast } = useToast();
  
  const [open, setOpen] = useState(false);
  const [cardName, setCardName] = useState('Sukh Card');
  const [cardType, setCardType] = useState<'Visa' | 'Master' | 'RuPay'>('Visa');
  
  const handleAddCard = () => {
    const newCard = {
      name: cardName,
      number: `${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)}`,
      expiry: '12/28',
      cvv: Math.floor(100 + Math.random() * 900).toString(),
      type: cardType,
      blocked: false
    };
    
    addCard(newCard);
    setOpen(false);
    setCardName('Sukh Card');
    
    toast({
      title: "Card Added Successfully",
      description: `${cardName} has been added to your wallet`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto p-4 md:p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">My Cards</h1>
              <p className="text-muted-foreground">Manage your payment cards</p>
            </div>
            
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Card
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Card</DialogTitle>
                  <DialogDescription>
                    Create a new virtual card for your wallet
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardName">Card Name</Label>
                    <Input
                      id="cardName"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      placeholder="Sukh Card"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cardType">Card Type</Label>
                    <Select value={cardType} onValueChange={(v) => setCardType(v as any)}>
                      <SelectTrigger id="cardType">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Visa">Visa</SelectItem>
                        <SelectItem value="Master">MasterCard</SelectItem>
                        <SelectItem value="RuPay">RuPay</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button onClick={handleAddCard} className="w-full">
                    Generate Card
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Wallet Info */}
          <Card className="glass-effect glow-effect">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Wallet Name</p>
                  <p className="text-2xl font-bold">{user?.walletName}</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {cards.length} cards • {cards.filter(c => !c.blocked).length} active
                  </p>
                </div>
                <div className="bg-primary/10 p-4 rounded-full">
                  <Wallet className="h-8 w-8 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cards.map((card, index) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <BankCard card={card} onToggleBlock={toggleCardBlock} />
              </motion.div>
            ))}
          </div>

          {/* Security Info */}
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle>Security Features</CardTitle>
              <CardDescription>Your cards are protected with advanced security</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                <div className="bg-success/10 p-2 rounded-lg">
                  <span className="text-success font-bold">✓</span>
                </div>
                <div>
                  <p className="font-medium text-sm">256-bit Encryption</p>
                  <p className="text-xs text-muted-foreground">All card data is encrypted</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                <div className="bg-success/10 p-2 rounded-lg">
                  <span className="text-success font-bold">✓</span>
                </div>
                <div>
                  <p className="font-medium text-sm">Real-time Fraud Detection</p>
                  <p className="text-xs text-muted-foreground">AI-powered transaction monitoring</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                <div className="bg-success/10 p-2 rounded-lg">
                  <span className="text-success font-bold">✓</span>
                </div>
                <div>
                  <p className="font-medium text-sm">Instant Block/Unblock</p>
                  <p className="text-xs text-muted-foreground">Control your cards anytime</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
