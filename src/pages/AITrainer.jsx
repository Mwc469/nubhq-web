import { useState } from 'react';
import { Bot, Plus, MessageSquare, ArrowRight, X, Loader2, Sparkles, Tag } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import {
  useTrainingStats,
  useTrainingExamples,
  useCreateTrainingExample,
  useDeleteTrainingExample,
} from '../hooks/useApi';
import { useToast } from '../contexts/ToastContext';

const CATEGORIES = [
  { value: 'greeting', label: 'Greetings', color: 'bg-blue-500' },
  { value: 'thanks', label: 'Thank You', color: 'bg-green-500' },
  { value: 'question', label: 'Questions', color: 'bg-purple-500' },
  { value: 'promo', label: 'Promos', color: 'bg-yellow-500' },
  { value: 'compliment', label: 'Compliments', color: 'bg-pink-500' },
  { value: 'general', label: 'General', color: 'bg-gray-500' },
];

const CategoryBadge = ({ category }) => {
  const cat = CATEGORIES.find((c) => c.value === category) || CATEGORIES[5];
  return (
    <span className={`text-xs px-2 py-0.5 ${cat.color} text-white rounded`}>
      {cat.label}
    </span>
  );
};

const ExampleCard = ({ example, onDelete, isDeleting }) => (
  <Card className="space-y-3">
    <div className="flex items-start justify-between">
      <CategoryBadge category={example.category} />
      <button
        onClick={() => onDelete(example.id)}
        disabled={isDeleting}
        className="p-1 hover:bg-red-500/20 rounded text-red-400"
      >
        <X size={16} />
      </button>
    </div>
    <div className="space-y-2">
      <div className="flex items-start gap-2">
        <MessageSquare size={16} className="text-white/40 mt-1 flex-shrink-0" />
        <p className="text-white/70 text-sm">{example.input_message}</p>
      </div>
      <div className="flex items-start gap-2">
        <ArrowRight size={16} className="text-brand-orange mt-1 flex-shrink-0" />
        <p className="text-white text-sm">{example.response}</p>
      </div>
    </div>
  </Card>
);

const NewExampleModal = ({ onClose, onCreate, isCreating }) => {
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
      <Card className="w-full max-w-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white">Add Training Example</h3>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded">
            <X size={20} className="text-white/60" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-white/60 mb-2">Category</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setCategory(cat.value)}
                  className={`px-3 py-1.5 text-sm border-2 transition-colors ${
                    category === cat.value
                      ? 'border-brand-orange bg-brand-orange/20 text-white'
                      : 'border-white/20 text-white/60 hover:border-white/40'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm text-white/60 mb-1">Fan Message</label>
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              required
              rows={2}
              className="w-full bg-white/5 border-3 border-black p-2 text-white resize-none focus:outline-none focus:ring-2 focus:ring-brand-orange"
              placeholder="What the fan might say..."
            />
          </div>
          <div>
            <label className="block text-sm text-white/60 mb-1">Your Response</label>
            <textarea
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              required
              rows={3}
              className="w-full bg-white/5 border-3 border-black p-2 text-white resize-none focus:outline-none focus:ring-2 focus:ring-brand-orange"
              placeholder="How you would respond..."
            />
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="submit" variant="primary" disabled={isCreating || !inputMessage || !response}>
              {isCreating ? <Loader2 size={16} className="animate-spin" /> : 'Add Example'}
            </Button>
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

const AITrainer = () => {
  const toast = useToast();
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">AI Trainer</h1>
          <p className="text-white/60 mt-1">Teach your AI to respond like you</p>
        </div>
        <Button
          variant="primary"
          onClick={() => setShowNewExample(true)}
          className="flex items-center gap-2"
        >
          <Plus size={18} />
          <span className="hidden sm:inline">Add Example</span>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <Bot size={24} className="mx-auto text-brand-orange mb-2" />
          <p className="text-2xl font-bold text-white">
            {statsLoading ? '...' : stats?.total_examples ?? 0}
          </p>
          <p className="text-sm text-white/60">Total Examples</p>
        </Card>
        {CATEGORIES.slice(0, 3).map((cat) => (
          <Card key={cat.value} className="text-center">
            <div className={`w-6 h-6 ${cat.color} rounded mx-auto mb-2`} />
            <p className="text-2xl font-bold text-white">
              {statsLoading ? '...' : stats?.by_category?.[cat.value] ?? 0}
            </p>
            <p className="text-sm text-white/60">{cat.label}</p>
          </Card>
        ))}
      </div>

      {/* Info Card */}
      <Card className="bg-brand-orange/10 border-brand-orange/30">
        <div className="flex items-start gap-4">
          <Sparkles size={24} className="text-brand-orange flex-shrink-0" />
          <div>
            <h3 className="font-bold text-white mb-1">How it works</h3>
            <p className="text-sm text-white/70">
              Add examples of fan messages and how you'd respond. The more examples you add,
              the better your AI will learn your unique voice and personality. Aim for at least
              20-30 examples across different categories.
            </p>
          </div>
        </div>
      </Card>

      {/* Filter */}
      <div className="flex items-center gap-2 flex-wrap">
        <Tag size={16} className="text-white/60" />
        <button
          onClick={() => setFilterCategory(null)}
          className={`px-3 py-1 text-sm rounded transition-colors ${
            filterCategory === null
              ? 'bg-brand-orange text-white'
              : 'bg-white/10 text-white/60 hover:text-white'
          }`}
        >
          All
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setFilterCategory(cat.value)}
            className={`px-3 py-1 text-sm rounded transition-colors ${
              filterCategory === cat.value
                ? 'bg-brand-orange text-white'
                : 'bg-white/10 text-white/60 hover:text-white'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Examples List */}
      {examplesLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 size={32} className="text-brand-orange animate-spin" />
        </div>
      ) : examples?.length === 0 ? (
        <Card className="text-center py-12">
          <Bot size={48} className="mx-auto text-brand-orange mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">No examples yet</h2>
          <p className="text-white/60 mb-4">Start training your AI by adding some examples</p>
          <Button variant="primary" onClick={() => setShowNewExample(true)}>
            Add Your First Example
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {examples?.map((example) => (
            <ExampleCard
              key={example.id}
              example={example}
              onDelete={handleDelete}
              isDeleting={deleteMutation.isPending && deleteMutation.variables === example.id}
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
        />
      )}
    </div>
  );
};

export default AITrainer;
