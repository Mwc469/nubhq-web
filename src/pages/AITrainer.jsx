import { Bot, Sparkles } from 'lucide-react';
import Card from '../components/ui/Card';

const AITrainer = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">AI Trainer</h1>
        <p className="text-white/60 mt-1">Train your AI assistant</p>
      </div>

      <Card className="text-center py-16">
        <div className="relative inline-block">
          <Bot size={64} className="mx-auto text-brand-orange mb-6" />
          <Sparkles size={24} className="absolute -top-2 -right-2 text-yellow-400" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Coming Soon</h2>
        <p className="text-white/60 max-w-md mx-auto">
          Train your AI to respond just like you. Upload examples, set personality traits, and fine-tune responses.
        </p>
      </Card>
    </div>
  );
};

export default AITrainer;
