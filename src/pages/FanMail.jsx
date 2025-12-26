import { Mail, Inbox } from 'lucide-react';
import Card from '../components/ui/Card';

const FanMail = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Fan Mail</h1>
        <p className="text-white/60 mt-1">Messages from your fans</p>
      </div>

      <Card className="text-center py-16">
        <Inbox size={64} className="mx-auto text-brand-orange mb-6" />
        <h2 className="text-2xl font-bold text-white mb-2">Coming Soon</h2>
        <p className="text-white/60 max-w-md mx-auto">
          Read and respond to fan messages. Organize conversations and track engagement.
        </p>
      </Card>
    </div>
  );
};

export default FanMail;
