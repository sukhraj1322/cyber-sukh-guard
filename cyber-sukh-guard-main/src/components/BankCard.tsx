import { Card as BankCardType } from '@/lib/bankingContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, Unlock, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';

interface BankCardProps {
  card: BankCardType;
  onToggleBlock: (id: string) => void;
}

export function BankCard({ card, onToggleBlock }: BankCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  const cardGradients = {
    Visa: 'from-blue-600 to-blue-400',
    Master: 'from-orange-600 to-red-500',
    RuPay: 'from-purple-600 to-pink-500'
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <Card className={`relative overflow-hidden h-full ${card.blocked ? 'opacity-50' : ''}`}>
        <div className={`absolute inset-0 bg-gradient-to-br ${cardGradients[card.type]} opacity-90`} />
        
        <div className="relative z-10 p-6 h-full flex flex-col justify-between text-white">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm opacity-80">Card Name</p>
              <p className="font-bold text-lg">{card.name}</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
              <p className="text-xs font-semibold">{card.type}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-sm opacity-80 mb-2">Card Number</p>
              <p className="text-xl font-mono tracking-wider">
                {showDetails ? card.number : card.number.replace(/\d(?=\d{4})/g, '*')}
              </p>
            </div>

            <div className="flex gap-6">
              <div>
                <p className="text-xs opacity-80">Expiry</p>
                <p className="font-mono">{showDetails ? card.expiry : '**/**'}</p>
              </div>
              <div>
                <p className="text-xs opacity-80">CVV</p>
                <p className="font-mono">{showDetails ? card.cvv : '***'}</p>
              </div>
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowDetails(!showDetails)}
              className="flex-1 bg-white/20 hover:bg-white/30 text-white border-0"
            >
              {showDetails ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
              {showDetails ? 'Hide' : 'Show'}
            </Button>
            <Button
              variant={card.blocked ? 'default' : 'destructive'}
              size="sm"
              onClick={() => onToggleBlock(card.id)}
              className="flex-1"
            >
              {card.blocked ? <Unlock className="h-4 w-4 mr-2" /> : <Lock className="h-4 w-4 mr-2" />}
              {card.blocked ? 'Unblock' : 'Block'}
            </Button>
          </div>
        </div>

        {card.blocked && (
          // Place overlay visually behind interactive content so unblock button remains clickable
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-0 pointer-events-none">
            <div className="text-center text-white">
              <Lock className="h-12 w-12 mx-auto mb-2" />
              <p className="font-bold">Card Blocked</p>
            </div>
          </div>
        )}
      </Card>
    </motion.div>
  );
}
