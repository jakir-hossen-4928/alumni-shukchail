
import { Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { PaymentStatusChip as PaymentStatusChipProps } from '@/lib/types';

const PaymentStatusChip = ({ status, className }: PaymentStatusChipProps) => {
  switch (status) {
    case 'verified':
      return (
        <Badge className={cn("bg-green-500 text-white", className)}>
          <CheckCircle2 className="h-3 w-3 mr-1" />
          যাচাই হয়েছে
        </Badge>
      );
    case 'pending':
      return (
        <Badge variant="outline" className={cn("border-yellow-500 text-yellow-600", className)}>
          <Clock className="h-3 w-3 mr-1" />
          অপেক্ষমান
        </Badge>
      );
    case 'failed':
      return (
        <Badge variant="destructive" className={cn(className)}>
          <AlertCircle className="h-3 w-3 mr-1" />
          ব্যর্থ হয়েছে
        </Badge>
      );
    default:
      return <Badge>{status}</Badge>;
  }
};

export default PaymentStatusChip;
