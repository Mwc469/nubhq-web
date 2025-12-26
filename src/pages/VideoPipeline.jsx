/**
 * VideoPipeline - Dashboard for video processing visibility
 * Shows processing status, review queue, learning stats
 */
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Video,
  CheckCircle,
  XCircle,
  Clock,
  Brain,
  Zap,
  TrendingUp,
  Film,
  Loader2,
  Play,
  RefreshCw,
  Sparkles,
  Activity,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '../lib/utils';
import NeoBrutalCard from '../components/ui/NeoBrutalCard';
import NeoBrutalButton from '../components/ui/NeoBrutalButton';
import PageHeader from '../components/ui/PageHeader';
import EmptyState from '../components/ui/EmptyState';
import { Skeleton } from '../components/ui/Skeleton';
import { useTheme } from '../contexts/ThemeContext';
import { useToast } from '../contexts/ToastContext';
import { playSound } from '../lib/soundSystem';
import { logger } from '../lib/logger';

const API_BASE = (import.meta?.env?.VITE_API_BASE_URL || 'http://localhost:8000').replace(/\/$/, '');

// Fetch helper with auth
async function fetchWithAuth(url, options = {}) {
  const token = localStorage.getItem('nubhq_access_token');
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

// Pipeline Status Card
const PipelineStatus = ({ health, isLoading }) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  if (isLoading) {
    return (
      <NeoBrutalCard accentColor="cyan" className="space-y-4">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-20 w-full" />
      </NeoBrutalCard>
    );
  }

  const isHealthy = health?.status === 'ok' && health?.workers_available;

  return (
    <NeoBrutalCard accentColor={isHealthy ? 'green' : 'pink'} className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={cn(
            'w-10 h-10 rounded-xl flex items-center justify-center',
            isHealthy ? 'bg-neon-green/20' : 'bg-neon-pink/20'
          )}>
            <Activity size={20} className={isHealthy ? 'text-neon-green' : 'text-neon-pink'} />
          </div>
          <div>
            <h3 className={cn('font-bold', isLight ? 'text-gray-900' : 'text-white')}>
              Pipeline Status
            </h3>
            <p className={cn('text-xs', isLight ? 'text-gray-500' : 'text-white/50')}>
              Video processing engine
            </p>
          </div>
        </div>
        <div className={cn(
          'px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-2',
          isHealthy
            ? 'bg-neon-green/20 text-neon-green'
            : 'bg-neon-pink/20 text-neon-pink'
        )}>
          <span className={cn(
            'w-2 h-2 rounded-full',
            isHealthy ? 'bg-neon-green animate-pulse' : 'bg-neon-pink'
          )} />
          {isHealthy ? 'Online' : 'Offline'}
        </div>
      </div>

      <div className={cn(
        'grid grid-cols-2 gap-4 p-4 rounded-xl',
        isLight ? 'bg-gray-50' : 'bg-white/5'
      )}>
        <div className="text-center">
          <div className={cn('text-2xl font-black', isLight ? 'text-gray-900' : 'text-white')}>
            {health?.workers_available ? '1' : '0'}
          </div>
          <div className={cn('text-xs', isLight ? 'text-gray-500' : 'text-white/50')}>
            Workers Active
          </div>
        </div>
        <div className="text-center">
          <div className={cn('text-2xl font-black text-neon-cyan')}>
            Ready
          </div>
          <div className={cn('text-xs', isLight ? 'text-gray-500' : 'text-white/50')}>
            Queue Status
          </div>
        </div>
      </div>
    </NeoBrutalCard>
  );
};

// Learning Stats Card
const LearningStats = ({ stats, isLoading }) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  if (isLoading) {
    return (
      <NeoBrutalCard accentColor="purple" className="space-y-4">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-32 w-full" />
      </NeoBrutalCard>
    );
  }

  const totalDecisions = stats?.total_decisions || 0;
  const preferences = stats?.preferences || {};
  const prefCount = Object.keys(preferences).length;

  return (
    <NeoBrutalCard accentColor="purple" className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-neon-purple/20 flex items-center justify-center">
          <Brain size={20} className="text-neon-purple" />
        </div>
        <div>
          <h3 className={cn('font-bold', isLight ? 'text-gray-900' : 'text-white')}>
            AI Learning
          </h3>
          <p className={cn('text-xs', isLight ? 'text-gray-500' : 'text-white/50')}>
            The walrus gets smarter
          </p>
        </div>
      </div>

      <div className={cn(
        'grid grid-cols-2 gap-4 p-4 rounded-xl',
        isLight ? 'bg-gray-50' : 'bg-white/5'
      )}>
        <div className="text-center">
          <div className={cn('text-2xl font-black text-neon-purple')}>
            {totalDecisions}
          </div>
          <div className={cn('text-xs', isLight ? 'text-gray-500' : 'text-white/50')}>
            Decisions Learned
          </div>
        </div>
        <div className="text-center">
          <div className={cn('text-2xl font-black text-neon-cyan')}>
            {prefCount}
          </div>
          <div className={cn('text-xs', isLight ? 'text-gray-500' : 'text-white/50')}>
            Preferences Set
          </div>
        </div>
      </div>

      {prefCount > 0 && (
        <div className="space-y-2">
          <p className={cn('text-xs font-bold', isLight ? 'text-gray-600' : 'text-white/70')}>
            Learned Preferences:
          </p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(preferences).slice(0, 5).map(([key, value]) => (
              <span
                key={key}
                className={cn(
                  'px-2 py-1 rounded-lg text-xs',
                  isLight ? 'bg-purple-100 text-purple-700' : 'bg-neon-purple/20 text-neon-purple'
                )}
              >
                {key.replace(/_/g, ' ')}: {value}
              </span>
            ))}
          </div>
        </div>
      )}
    </NeoBrutalCard>
  );
};

// Review Queue Card
const ReviewQueue = ({ videos, isLoading, onApprove, onReject }) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const { showToast } = useToast();
  const [processingId, setProcessingId] = useState(null);

  const handleApprove = async (filename) => {
    setProcessingId(filename);
    try {
      await onApprove(filename);
      playSound('approve');
      showToast('Video approved and queued!', 'success');
    } catch (error) {
      showToast('Failed to approve video', 'error');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (filename) => {
    setProcessingId(filename);
    try {
      await onReject(filename);
      playSound('reject');
      showToast('Video rejected', 'info');
    } catch (error) {
      showToast('Failed to reject video', 'error');
    } finally {
      setProcessingId(null);
    }
  };

  if (isLoading) {
    return (
      <NeoBrutalCard accentColor="yellow" className="space-y-4">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </NeoBrutalCard>
    );
  }

  const videoList = videos?.videos || [];

  return (
    <NeoBrutalCard accentColor="yellow" className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-neon-yellow/20 flex items-center justify-center">
            <Film size={20} className="text-neon-yellow" />
          </div>
          <div>
            <h3 className={cn('font-bold', isLight ? 'text-gray-900' : 'text-white')}>
              Review Queue
            </h3>
            <p className={cn('text-xs', isLight ? 'text-gray-500' : 'text-white/50')}>
              Videos awaiting your approval
            </p>
          </div>
        </div>
        <span className={cn(
          'px-3 py-1.5 rounded-full text-xs font-bold',
          videoList.length > 0
            ? 'bg-neon-yellow/20 text-neon-yellow'
            : isLight ? 'bg-gray-100 text-gray-500' : 'bg-white/10 text-white/50'
        )}>
          {videoList.length} pending
        </span>
      </div>

      {videoList.length === 0 ? (
        <div className={cn(
          'p-6 rounded-xl text-center',
          isLight ? 'bg-gray-50' : 'bg-white/5'
        )}>
          <Sparkles className={cn('w-8 h-8 mx-auto mb-2', isLight ? 'text-gray-300' : 'text-white/20')} />
          <p className={cn('text-sm', isLight ? 'text-gray-500' : 'text-white/50')}>
            No videos waiting for review
          </p>
          <p className={cn('text-xs mt-1', isLight ? 'text-gray-400' : 'text-white/30')}>
            Drop videos in the input folder to get started
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {videoList.map((video) => (
              <motion.div
                key={video.filename}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className={cn(
                  'p-4 rounded-xl border-2',
                  isLight
                    ? 'bg-white border-gray-200'
                    : 'bg-white/5 border-white/10'
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-neon-pink to-neon-purple flex items-center justify-center flex-shrink-0">
                      <Video size={20} className="text-white" />
                    </div>
                    <div className="min-w-0">
                      <p className={cn(
                        'font-bold truncate',
                        isLight ? 'text-gray-900' : 'text-white'
                      )}>
                        {video.filename}
                      </p>
                      <p className={cn('text-xs', isLight ? 'text-gray-500' : 'text-white/50')}>
                        {(video.size / 1024 / 1024).toFixed(1)} MB
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 flex-shrink-0">
                    <NeoBrutalButton
                      accentColor="green"
                      size="sm"
                      onClick={() => handleApprove(video.filename)}
                      disabled={processingId === video.filename}
                    >
                      {processingId === video.filename ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <CheckCircle size={14} />
                      )}
                    </NeoBrutalButton>
                    <NeoBrutalButton
                      variant="outline"
                      accentColor="pink"
                      size="sm"
                      onClick={() => handleReject(video.filename)}
                      disabled={processingId === video.filename}
                      className="text-red-400 border-red-400 hover:bg-red-400/10"
                    >
                      <XCircle size={14} />
                    </NeoBrutalButton>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </NeoBrutalCard>
  );
};

// Templates Card
const TemplatesCard = ({ templates, isLoading }) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  if (isLoading) {
    return (
      <NeoBrutalCard accentColor="orange" className="space-y-4">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-24 w-full" />
      </NeoBrutalCard>
    );
  }

  return (
    <NeoBrutalCard accentColor="orange" className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-neon-orange/20 flex items-center justify-center">
          <Play size={20} className="text-neon-orange" />
        </div>
        <div>
          <h3 className={cn('font-bold', isLight ? 'text-gray-900' : 'text-white')}>
            Video Templates
          </h3>
          <p className={cn('text-xs', isLight ? 'text-gray-500' : 'text-white/50')}>
            Ready-to-use formats
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {templates?.map((template) => (
          <div
            key={template.id}
            className={cn(
              'p-3 rounded-xl text-center',
              isLight ? 'bg-gray-50 hover:bg-gray-100' : 'bg-white/5 hover:bg-white/10',
              'transition-colors cursor-pointer'
            )}
          >
            <div className={cn('font-bold text-sm', isLight ? 'text-gray-900' : 'text-white')}>
              {template.name}
            </div>
            <div className={cn('text-xs', isLight ? 'text-gray-500' : 'text-white/50')}>
              {template.duration}s • {template.aspect}
            </div>
          </div>
        ))}
      </div>
    </NeoBrutalCard>
  );
};

// Main Component
const VideoPipeline = () => {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const [health, setHealth] = useState(null);
  const [stats, setStats] = useState(null);
  const [reviewVideos, setReviewVideos] = useState(null);
  const [templates, setTemplates] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const [healthData, statsData, reviewData, templatesData] = await Promise.all([
        fetchWithAuth(`${API_BASE}/api/video-pipeline/health`).catch(() => ({ status: 'error' })),
        fetchWithAuth(`${API_BASE}/api/video-pipeline/stats`).catch(() => ({ total_decisions: 0, preferences: {} })),
        fetchWithAuth(`${API_BASE}/api/video-pipeline/review`).catch(() => ({ videos: [] })),
        fetchWithAuth(`${API_BASE}/api/video-pipeline/templates`).catch(() => []),
      ]);

      setHealth(healthData);
      setStats(statsData);
      setReviewVideos(reviewData);
      setTemplates(templatesData);
    } catch (error) {
      logger.error('Failed to fetch pipeline data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Refresh every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    playSound('tap');
    fetchData();
  };

  const handleApprove = async (filename) => {
    await fetchWithAuth(`${API_BASE}/api/video-pipeline/review/${filename}/approve`, {
      method: 'POST',
    });
    fetchData();
  };

  const handleReject = async (filename) => {
    await fetchWithAuth(`${API_BASE}/api/video-pipeline/review/${filename}`, {
      method: 'DELETE',
    });
    fetchData();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader
          title="Video Pipeline"
          subtitle="Your content factory at a glance"
          icon={Video}
          accentColor="cyan"
        />
        <NeoBrutalButton
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={refreshing}
        >
          <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
          Refresh
        </NeoBrutalButton>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          <PipelineStatus health={health} isLoading={loading} />
          <LearningStats stats={stats} isLoading={loading} />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <ReviewQueue
            videos={reviewVideos}
            isLoading={loading}
            onApprove={handleApprove}
            onReject={handleReject}
          />
          <TemplatesCard templates={templates} isLoading={loading} />
        </div>
      </div>
    </div>
  );
};

export default VideoPipeline;
