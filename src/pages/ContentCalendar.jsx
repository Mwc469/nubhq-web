import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
  Instagram,
  Twitter,
  Youtube,
  Facebook,
  Video,
  Loader2,
  X,
} from 'lucide-react';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  isToday,
  parseISO,
} from 'date-fns';
import { cn } from '../lib/utils';
import NeoBrutalCard from '../components/ui/NeoBrutalCard';
import NeoBrutalButton from '../components/ui/NeoBrutalButton';
import PageHeader from '../components/ui/PageHeader';
import StatusBadge from '../components/ui/StatusBadge';
import { useTheme } from '../contexts/ThemeContext';

const PLATFORM_ICONS = {
  instagram: Instagram,
  twitter: Twitter,
  youtube: Youtube,
  facebook: Facebook,
  tiktok: Video,
  all: CalendarIcon,
};

const PLATFORM_COLORS = {
  instagram: 'bg-gradient-to-br from-purple-500 to-pink-500',
  twitter: 'bg-sky-500',
  youtube: 'bg-red-500',
  facebook: 'bg-blue-600',
  tiktok: 'bg-black',
  all: 'bg-gradient-to-br from-neon-pink to-neon-purple',
};

// Mock data
const mockPosts = [
  { id: '1', title: 'New single announcement', platform: 'instagram', scheduled_date: new Date().toISOString(), status: 'scheduled' },
  { id: '2', title: 'Behind the scenes', platform: 'twitter', scheduled_date: new Date().toISOString(), status: 'scheduled' },
  { id: '3', title: 'Music video teaser', platform: 'youtube', scheduled_date: new Date(Date.now() + 86400000).toISOString(), status: 'scheduled' },
];

const mockEvents = [
  { id: 'e1', title: 'Album Release', event_type: 'release', start_date: new Date(Date.now() + 172800000).toISOString(), location: 'Spotify/Apple Music' },
  { id: 'e2', title: 'Live Show', event_type: 'gig', start_date: new Date(Date.now() + 604800000).toISOString(), location: 'The Venue, NYC' },
];

export default function ContentCalendar() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showEvents, setShowEvents] = useState(true);
  const [showPosts, setShowPosts] = useState(true);

  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    event_type: 'gig',
    start_date: '',
    location: '',
  });

  const posts = mockPosts.filter((p) => p.status === 'scheduled');
  const events = mockEvents;
  const isLoading = false;

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startDay = monthStart.getDay();
  const paddedDays = [...Array(startDay).fill(null), ...days];

  const getPostsForDate = (date) => {
    if (!date || !showPosts) return [];
    return posts.filter((post) => {
      if (!post.scheduled_date) return false;
      return isSameDay(parseISO(post.scheduled_date), date);
    });
  };

  const getEventsForDate = (date) => {
    if (!date || !showEvents) return [];
    return events.filter((event) => {
      if (!event.start_date) return false;
      return isSameDay(parseISO(event.start_date), date);
    });
  };

  const selectedDatePosts = selectedDate ? getPostsForDate(selectedDate) : [];
  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  const handlePostClick = (post) => {
    navigate(`/post-studio?edit=${post.id}`);
  };

  const handleCreateEvent = () => {
    // Mock create
    setShowEventModal(false);
    setEventForm({ title: '', description: '', event_type: 'gig', start_date: '', location: '' });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-10 h-10 animate-spin text-neon-cyan mb-4" />
        <p className="font-bold text-lg">Loading the timeline...</p>
        <p className={cn('text-sm', isLight ? 'text-gray-500' : 'text-white/50')}>Plotting your chaos</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        tagline="Plot the Chaos"
        title="Content Calendar"
        subtitle="See all your scheduled weirdness at a glance"
        actions={
          <NeoBrutalButton accentColor="pink" onClick={() => setShowEventModal(true)}>
            <Plus size={18} /> New Event
          </NeoBrutalButton>
        }
      />

      {/* Filter Toggles */}
      <div className="flex items-center gap-3">
        <span className={cn('text-xs uppercase tracking-wider font-bold', isLight ? 'text-gray-500' : 'text-white/50')}>
          Show:
        </span>
        <button
          onClick={() => setShowEvents(!showEvents)}
          className={cn(
            'px-3 py-1.5 rounded-lg text-xs font-bold border-2 transition-all',
            showEvents
              ? 'bg-neon-purple/20 border-neon-purple text-neon-purple'
              : isLight
              ? 'border-gray-300 text-gray-400'
              : 'border-white/20 text-white/40'
          )}
        >
          Events
        </button>
        <button
          onClick={() => setShowPosts(!showPosts)}
          className={cn(
            'px-3 py-1.5 rounded-lg text-xs font-bold border-2 transition-all',
            showPosts
              ? 'bg-neon-cyan/20 border-neon-cyan text-neon-cyan'
              : isLight
              ? 'border-gray-300 text-gray-400'
              : 'border-white/20 text-white/40'
          )}
        >
          Scheduled Posts
        </button>
      </div>

      <NeoBrutalCard accentColor="cyan">
        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className={cn(
              'p-2 rounded-lg transition-colors',
              isLight ? 'hover:bg-gray-100' : 'hover:bg-white/10'
            )}
          >
            <ChevronLeft size={24} />
          </button>
          <h2 className={cn('text-2xl font-black', isLight ? 'text-gray-900' : 'text-white')}>
            {format(currentMonth, 'MMMM yyyy')}
          </h2>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className={cn(
              'p-2 rounded-lg transition-colors',
              isLight ? 'hover:bg-gray-100' : 'hover:bg-white/10'
            )}
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Day Headers */}
        <div className="grid grid-cols-7 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div
              key={day}
              className={cn(
                'text-center py-2 text-xs font-bold uppercase tracking-wider',
                isLight ? 'text-gray-500' : 'text-white/50'
              )}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {paddedDays.map((day, index) => {
            if (!day) {
              return <div key={`empty-${index}`} className="aspect-square" />;
            }

            const dayPosts = getPostsForDate(day);
            const dayEvents = getEventsForDate(day);
            const hasContent = dayPosts.length > 0 || dayEvents.length > 0;
            const isCurrentDay = isToday(day);
            const isCurrentMonth = isSameMonth(day, currentMonth);

            return (
              <button
                key={day.toISOString()}
                onClick={() => setSelectedDate(day)}
                className={cn(
                  'aspect-square p-1 rounded-xl border-2 transition-all',
                  isCurrentDay
                    ? 'border-neon-pink bg-neon-pink/10'
                    : 'border-transparent hover:border-gray-300 dark:hover:border-white/20',
                  !isCurrentMonth && 'opacity-30',
                  hasContent && (isLight ? 'bg-gray-50' : 'bg-white/5')
                )}
              >
                <div className="h-full flex flex-col">
                  <span
                    className={cn(
                      'text-sm font-bold',
                      isCurrentDay && 'text-neon-pink'
                    )}
                  >
                    {format(day, 'd')}
                  </span>
                  {hasContent && (
                    <div className="flex-1 flex flex-wrap gap-0.5 mt-1 overflow-hidden">
                      {dayEvents.slice(0, 2).map((event) => (
                        <div
                          key={event.id}
                          className="w-4 h-4 rounded-md bg-neon-purple flex items-center justify-center"
                          title={event.title}
                        >
                          <CalendarIcon className="w-2.5 h-2.5 text-white" />
                        </div>
                      ))}
                      {dayPosts.slice(0, 3 - Math.min(dayEvents.length, 2)).map((post) => {
                        const Icon = PLATFORM_ICONS[post.platform] || CalendarIcon;
                        return (
                          <div
                            key={post.id}
                            className={cn('w-4 h-4 rounded-md flex items-center justify-center', PLATFORM_COLORS[post.platform])}
                            title={post.title}
                          >
                            <Icon className="w-2.5 h-2.5 text-white" />
                          </div>
                        );
                      })}
                      {dayPosts.length + dayEvents.length > 3 && (
                        <span className={cn('text-[10px] font-bold', isLight ? 'text-gray-500' : 'text-white/50')}>
                          +{dayPosts.length + dayEvents.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </NeoBrutalCard>

      {/* Selected Date Modal */}
      {selectedDate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedDate(null)} />
          <div
            className={cn(
              'relative w-full max-w-lg rounded-2xl border-3 p-6',
              isLight
                ? 'bg-white border-neon-cyan shadow-[8px_8px_0_var(--neon-cyan)]'
                : 'bg-gray-900 border-neon-cyan shadow-[8px_8px_0_var(--neon-cyan)]'
            )}
          >
            <button
              onClick={() => setSelectedDate(null)}
              className={cn(
                'absolute top-4 right-4 p-1 rounded-lg',
                isLight ? 'hover:bg-gray-100' : 'hover:bg-white/10'
              )}
            >
              <X size={20} />
            </button>
            <h3 className={cn('text-xl font-black mb-4', isLight ? 'text-gray-900' : 'text-white')}>
              {format(selectedDate, 'EEEE, MMMM d, yyyy')}
            </h3>

            <div className="space-y-4">
              {selectedDateEvents.length > 0 && (
                <div>
                  <h4 className="text-xs uppercase tracking-wider font-bold text-neon-purple mb-2">Events</h4>
                  {selectedDateEvents.map((event) => (
                    <div
                      key={event.id}
                      className={cn(
                        'p-3 rounded-xl border-2 mb-2 cursor-pointer transition-colors',
                        isLight
                          ? 'bg-purple-50 border-purple-200 hover:border-neon-purple'
                          : 'bg-purple-900/20 border-purple-800 hover:border-neon-purple'
                      )}
                      onClick={() => setSelectedEvent(event)}
                    >
                      <p className={cn('font-bold', isLight ? 'text-gray-900' : 'text-white')}>{event.title}</p>
                      <p className={cn('text-xs capitalize', isLight ? 'text-gray-500' : 'text-white/50')}>
                        {event.event_type?.replace('_', ' ')}
                      </p>
                      {event.location && (
                        <p className={cn('text-xs mt-1', isLight ? 'text-gray-400' : 'text-white/40')}>{event.location}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {selectedDatePosts.length > 0 && (
                <div>
                  <h4 className="text-xs uppercase tracking-wider font-bold text-neon-cyan mb-2">Scheduled Posts</h4>
                  {selectedDatePosts.map((post) => {
                    const Icon = PLATFORM_ICONS[post.platform] || CalendarIcon;
                    return (
                      <div
                        key={post.id}
                        className={cn(
                          'p-3 rounded-xl border-2 mb-2 cursor-pointer transition-colors',
                          isLight
                            ? 'bg-gray-50 border-gray-200 hover:border-neon-cyan'
                            : 'bg-white/5 border-white/10 hover:border-neon-cyan'
                        )}
                        onClick={() => handlePostClick(post)}
                      >
                        <div className="flex items-start gap-3">
                          <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0', PLATFORM_COLORS[post.platform])}>
                            <Icon className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={cn('font-bold text-sm truncate', isLight ? 'text-gray-900' : 'text-white')}>
                              {post.title}
                            </p>
                            <p className={cn('text-xs capitalize', isLight ? 'text-gray-500' : 'text-white/50')}>
                              {post.platform}
                            </p>
                          </div>
                          <StatusBadge status={post.status} showIcon={false} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {selectedDatePosts.length === 0 && selectedDateEvents.length === 0 && (
                <div className={cn('text-center py-8', isLight ? 'text-gray-500' : 'text-white/50')}>
                  <CalendarIcon className="w-12 h-12 mx-auto mb-3 text-neon-cyan opacity-60" />
                  <p className="font-bold">Nothing scheduled</p>
                  <p className="text-sm">This day is wide open for weirdness</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* New Event Modal */}
      {showEventModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowEventModal(false)} />
          <div
            className={cn(
              'relative w-full max-w-md rounded-2xl border-3 p-6',
              isLight
                ? 'bg-white border-neon-purple shadow-[8px_8px_0_var(--neon-purple)]'
                : 'bg-gray-900 border-neon-purple shadow-[8px_8px_0_var(--neon-purple)]'
            )}
          >
            <button
              onClick={() => setShowEventModal(false)}
              className={cn(
                'absolute top-4 right-4 p-1 rounded-lg',
                isLight ? 'hover:bg-gray-100' : 'hover:bg-white/10'
              )}
            >
              <X size={20} />
            </button>
            <h3 className={cn('text-xl font-black mb-4', isLight ? 'text-gray-900' : 'text-white')}>
              Create Event
            </h3>

            <div className="space-y-4">
              <div>
                <label className={cn('text-xs uppercase tracking-wider font-bold mb-2 block', isLight ? 'text-gray-500' : 'text-white/50')}>
                  Title
                </label>
                <input
                  value={eventForm.title}
                  onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                  placeholder="Event name..."
                  className={cn(
                    'w-full px-4 py-2.5 rounded-xl border-2',
                    isLight ? 'bg-gray-50 border-gray-200' : 'bg-white/5 border-white/20',
                    'outline-none focus:border-neon-purple'
                  )}
                />
              </div>

              <div>
                <label className={cn('text-xs uppercase tracking-wider font-bold mb-2 block', isLight ? 'text-gray-500' : 'text-white/50')}>
                  Type
                </label>
                <select
                  value={eventForm.event_type}
                  onChange={(e) => setEventForm({ ...eventForm, event_type: e.target.value })}
                  className={cn(
                    'w-full px-4 py-2.5 rounded-xl border-2',
                    isLight ? 'bg-gray-50 border-gray-200' : 'bg-white/5 border-white/20',
                    'outline-none focus:border-neon-purple'
                  )}
                >
                  <option value="gig">Gig</option>
                  <option value="release">Release</option>
                  <option value="interview">Interview</option>
                  <option value="photoshoot">Photoshoot</option>
                  <option value="video_shoot">Video Shoot</option>
                  <option value="livestream">Livestream</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className={cn('text-xs uppercase tracking-wider font-bold mb-2 block', isLight ? 'text-gray-500' : 'text-white/50')}>
                  Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={eventForm.start_date}
                  onChange={(e) => setEventForm({ ...eventForm, start_date: e.target.value })}
                  className={cn(
                    'w-full px-4 py-2.5 rounded-xl border-2',
                    isLight ? 'bg-gray-50 border-gray-200' : 'bg-white/5 border-white/20',
                    'outline-none focus:border-neon-purple'
                  )}
                />
              </div>

              <div>
                <label className={cn('text-xs uppercase tracking-wider font-bold mb-2 block', isLight ? 'text-gray-500' : 'text-white/50')}>
                  Location
                </label>
                <input
                  value={eventForm.location}
                  onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                  placeholder="Venue or location..."
                  className={cn(
                    'w-full px-4 py-2.5 rounded-xl border-2',
                    isLight ? 'bg-gray-50 border-gray-200' : 'bg-white/5 border-white/20',
                    'outline-none focus:border-neon-purple'
                  )}
                />
              </div>

              <NeoBrutalButton
                accentColor="purple"
                onClick={handleCreateEvent}
                disabled={!eventForm.title || !eventForm.start_date}
                className="w-full"
              >
                <Plus size={18} /> Create Event
              </NeoBrutalButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
