import { useState } from 'react';
import { Bot, Plus, MessageSquare, ArrowRight, X, Loader2, Sparkles, Tag, Brain, Zap } from 'lucide-react';
import { cn } from '../lib/utils';
import NeoBrutalCard from '../components/ui/NeoBrutalCard';
import NeoBrutalButton from '../components/ui/NeoBrutalButton';
import PageHeader from '../components/ui/PageHeader';
import EmptyState from '../components/ui/EmptyState';
import {
  useTrainingStats,
  useTrainingExamples,
  useCreateTrainingExample,
  useDeleteTrainingExample,
} from '../hooks/useApi';
import { useToast } from '../contexts/ToastContext';
import { useTheme } from '../contexts/ThemeContext';

const CATEGORIES = [
  { value: 'greeting', label: 'Greetings', color: 'cyan' },
  { value: 'thanks', label: 'Thank You', color: 'green' },
  { value: 'question', label: 'Questions', color: 'purple' },
  { value: 'promo', label: 'Promos', color: 'yellow' },
  { value: 'compliment', label: 'Compliments', color: 'pink' },
  { value: 'general', label: 'General', color: 'orange' },
];

const colorClasses = {
  pink: { bg: 'bg-neon-pink', text: 'text-neon-pink', bgLight: 'bg-neon-pink/20' },
  cyan: { bg: 'bg-neon-cyan', text: 'text-neon-cyan', bgLight: 'bg-neon-cyan/20' },
  yellow: { bg: 'bg-neon-yellow', text: 'text-neon-yellow', bgLight: 'bg-neon-yellow/20' },
  green: { bg: 'bg-neon-green', text: 'text-neon-green', bgLight: 'bg-neon-green/20' },
  purple: { bg: 'bg-neon-purple', text: 'text-neon-purple', bgLight: 'bg-neon-purple/20' },
  orange: { bg: 'bg-neon-orange', text: 'text-neon-orange', bgLight: 'bg-neon-orange/20' },
};

const CategoryBadge = ({ category }) => {
  const cat = CATEGORIES.find((c) => c.value === category) || CATEGORIES[5];
  const colors = colorClasses[cat.color];
  return (
    <span className={cn('text-xs px-3 py-1 font-bold rounded-lg', colors.bg, 'text-black')}>
      {cat.label}
    </span>
  );
};

const ExampleCard = ({ example, onDelete, isDeleting, isLight }) => {
  const cat = CATEGORIES.find((c) => c.value === example.category) || CATEGORIES[5];

  return (
    <NeoBrutalCard accentColor={cat.color} className="space-y-3">
      <div className="flex items-start justify-between">
        <CategoryBadge category={example.category} />
        <button
          onClick={() => onDelete(example.id)}
          disabled={isDeleting}
          className={cn(
            'p-2 rounded-xl transition-colors',
            isLight ? 'hover:bg-red-100 text-red-400' : 'hover:bg-red-500/20 text-red-400'
          )}
        >
          <X size={16} />
        </button>
      </div>
      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
            <MessageSquare size={14} className={isLight ? 'text-gray-400' : 'text-white/40'} />
          </div>
          <p className={cn('text-sm', isLight ? 'text-gray-600' : 'text-white/70')}>
            {example.input_message}
          </p>
        </div>
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-neon-pink/20 flex items-center justify-center flex-shrink-0">
            <ArrowRight size={14} className="text-neon-pink" />
          </div>
          <p className={cn('text-sm font-medium', isLight ? 'text-gray-900' : 'text-white')}>
            {example.response}
          </p>
        </div>
      </div>
    </NeoBrutalCard>
  );
};

const NewExampleModal = ({ onClose, onCreate, isCreating, isLight }) => {
  const [category, setCategory] = useState('general');
  const [inputMessage, setInputMessage] = useState('');
  const [response, setResponse] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate({
      category,
      input_message: inputMessage,
      response,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <NeoBrutalCard accentColor="pink" className="w-full max-w-lg">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-neon-pink/20 flex items-center justify-center">
              <Brain size={20} className="text-neon-pink" />
            </div>
            <h3 className={cn('text-lg font-black', isLight ? 'text-gray-900' : 'text-white')}>
              Add Training Example
            </h3>
          </div>
          <button
            onClick={onClose}
            className={cn(
              'p-2 rounded-xl transition-colors',
              isLight ? 'hover:bg-gray-100 text-gray-500' : 'hover:bg-white/10 text-white/60'
            )}
          >
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={cn('block text-sm font-bold mb-2', isLight ? 'text-gray-600' : 'text-white/60')}>
              Category
            </label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => {
                const colors = colorClasses[cat.color];
                return (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setCategory(cat.value)}
                    className={cn(
                      'px-4 py-2 text-sm font-bold rounded-xl border-2 transition-all',
                      category === cat.value
                        ? cn(colors.bg, 'text-black border-transparent')
                        : isLight
                        ? 'border-gray-200 text-gray-600 hover:border-gray-300'
                        : 'border-white/20 text-white/60 hover:border-white/40'
                    )}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <label className={cn('block text-sm font-bold mb-2', isLight ? 'text-gray-600' : 'text-white/60')}>
              Fan Message
            </label>
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              required
              rows={2}
              className={cn(
                'w-full p-3 rounded-xl border-3 resize-none focus:outline-none focus:ring-2 focus:ring-neon-pink',
                isLight
                  ? 'bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400'
                  : 'bg-white/5 border-white/20 text-white placeholder:text-white/40'
              )}
              placeholder="What the fan might say..."
            />
          </div>
          <div>
            <label className={cn('block text-sm font-bold mb-2', isLight ? 'text-gray-600' : 'text-white/60')}>
              Your Response
            </label>
            <textarea
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              required
              rows={3}
              className={cn(
                'w-full p-3 rounded-xl border-3 resize-none focus:outline-none focus:ring-2 focus:ring-neon-pink',
                isLight
                  ? 'bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400'
                  : 'bg-white/5 border-white/20 text-white placeholder:text-white/40'
              )}
              placeholder="How you would respond..."
            />
          </div>
          <div className="flex gap-3 pt-2">
            <NeoBrutalButton
              type="submit"
              accentColor="pink"
              disabled={isCreating || !inputMessage || !response}
            >
              {isCreating ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
              Add Example
            </NeoBrutalButton>
            <NeoBrutalButton type="button" variant="ghost" onClick={onClose}>
              Cancel
            </NeoBrutalButton>
          </div>
        </form>
      </NeoBrutalCard>
    </div>
  );
};

const AITrainer = () => {
  const toast = useToast();
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const [showNewExample, setShowNewExample] = useState(false);
  const [filterCategory, setFilterCategory] = useState(null);

  const { data: stats, isLoading: statsLoading } = useTrainingStats();
  const { data: examples, isLoading: examplesLoading } = useTrainingExamples(filterCategory);
  const createMutation = useCreateTrainingExample();
  const deleteMutation = useDeleteTrainingExample();

  const handleCreate = (data) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        setShowNewExample(false);
        toast.success('Training example added');
      },
      onError: () => toast.error('Failed to add example'),
    });
  };

  const handleDelete = (id) => {
    deleteMutation.mutate(id, {
      onSuccess: () => toast.success('Example deleted'),
      onError: () => toast.error('Failed to delete example'),
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        tagline="Voice Cloning"
        title="AI Trainer"
        subtitle="Teach your AI to respond like you"
        actions={
          <NeoBrutalButton accentColor="pink" onClick={() => setShowNewExample(true)}>
            <Plus size={18} />
            <span className="hidden sm:inline">Add Example</span>
          </NeoBrutalButton>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <NeoBrutalCard accentColor="pink" hover={false}>
          <div className="text-center">
            <div className="w-12 h-12 rounded-xl bg-neon-pink/20 flex items-center justify-center mx-auto mb-3">
              <Bot size={24} className="text-neon-pink" />
            </div>
            <p className={cn('text-3xl font-black', isLight ? 'text-gray-900' : 'text-white')}>
              {statsLoading ? '...' : stats?.total_examples ?? 0}
            </p>
            <p className={cn('text-xs font-bold uppercase tracking-wider', isLight ? 'text-gray-500' : 'text-white/50')}>
              Total Examples
            </p>
          </div>
        </NeoBrutalCard>
        {CATEGORIES.slice(0, 3).map((cat) => {
          const colors = colorClasses[cat.color];
          return (
            <NeoBrutalCard key={cat.value} accentColor={cat.color} hover={false}>
              <div className="text-center">
                <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3', colors.bgLight)}>
                  <Zap size={24} className={colors.text} />
                </div>
                <p className={cn('text-3xl font-black', isLight ? 'text-gray-900' : 'text-white')}>
                  {statsLoading ? '...' : stats?.by_category?.[cat.value] ?? 0}
                </p>
                <p className={cn('text-xs font-bold uppercase tracking-wider', isLight ? 'text-gray-500' : 'text-white/50')}>
                  {cat.label}
                </p>
              </div>
            </NeoBrutalCard>
          );
        })}
      </div>

      {/* Info Card */}
      <NeoBrutalCard accentColor="yellow">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-neon-yellow/20 flex items-center justify-center flex-shrink-0">
            <Sparkles size={24} className="text-neon-yellow" />
          </div>
          <div>
            <h3 className={cn('font-black mb-1', isLight ? 'text-gray-900' : 'text-white')}>
              How it works
            </h3>
            <p className={cn('text-sm', isLight ? 'text-gray-600' : 'text-white/70')}>
              Add examples of fan messages and how you'd respond. The more examples you add,
              the better your AI will learn your unique voice and personality. Aim for at least
              20-30 examples across different categories.
            </p>
          </div>
        </div>
      </NeoBrutalCard>

      {/* Filter */}
      <div className="flex items-center gap-2 flex-wrap">
        <Tag size={16} className={isLight ? 'text-gray-400' : 'text-white/40'} />
        <button
          onClick={() => setFilterCategory(null)}
          className={cn(
            'px-4 py-2 text-sm font-bold rounded-xl transition-colors',
            filterCategory === null
              ? 'bg-neon-pink text-white'
              : isLight
              ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              : 'bg-white/10 text-white/60 hover:bg-white/20'
          )}
        >
          All
        </button>
        {CATEGORIES.map((cat) => {
          const colors = colorClasses[cat.color];
          return (
            <button
              key={cat.value}
              onClick={() => setFilterCategory(cat.value)}
              className={cn(
                'px-4 py-2 text-sm font-bold rounded-xl transition-colors',
                filterCategory === cat.value
                  ? cn(colors.bg, 'text-black')
                  : isLight
                  ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  : 'bg-white/10 text-white/60 hover:bg-white/20'
              )}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Examples List */}
      {examplesLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 size={32} className="text-neon-pink animate-spin" />
        </div>
      ) : examples?.length === 0 ? (
        <NeoBrutalCard accentColor="purple">
          <EmptyState
            icon={Bot}
            title="No examples yet"
            description="Start training your AI by adding some examples of how you respond to fans"
            action={{
              label: 'Add Your First Example',
              onClick: () => setShowNewExample(true),
            }}
            accentColor="purple"
          />
        </NeoBrutalCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {examples?.map((example) => (
            <ExampleCard
              key={example.id}
              example={example}
              onDelete={handleDelete}
              isDeleting={deleteMutation.isPending && deleteMutation.variables === example.id}
              isLight={isLight}
            />
          ))}
        </div>
      )}

      {/* New Example Modal */}
      {showNewExample && (
        <NewExampleModal
          onClose={() => setShowNewExample(false)}
          onCreate={handleCreate}
          isCreating={createMutation.isPending}
          isLight={isLight}
        />
      )}
    </div>
  );
};

export default AITrainer;
