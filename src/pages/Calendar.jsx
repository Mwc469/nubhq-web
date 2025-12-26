import { useState, useMemo } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  isToday,
} from 'date-fns';
import { ChevronLeft, ChevronRight, Plus, Clock, X, Loader2 } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useScheduledPosts, useCreateScheduledPost, useDeleteScheduledPost } from '../hooks/useApi';
import { useToast } from '../contexts/ToastContext';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const CalendarDay = ({ date, currentMonth, posts, onDayClick, isSelected }) => {
  const dayPosts = posts?.filter((p) => isSameDay(new Date(p.scheduled_at), date)) || [];
  const inMonth = isSameMonth(date, currentMonth);
  const today = isToday(date);

  return (
    <button
      onClick={() => onDayClick(date)}
      className={`min-h-[80px] md:min-h-[100px] p-1 md:p-2 border border-white/10 text-left transition-colors ${
        inMonth ? 'bg-white/5' : 'bg-transparent'
      } ${isSelected ? 'ring-2 ring-brand-orange' : ''} ${today ? 'bg-brand-orange/10' : ''} hover:bg-white/10`}
    >
      <span
        className={`text-sm font-medium ${
          today
            ? 'bg-brand-orange text-white w-6 h-6 rounded-full flex items-center justify-center'
            : inMonth
            ? 'text-white'
            : 'text-white/30'
        }`}
      >
        {format(date, 'd')}
      </span>
      <div className="mt-1 space-y-1">
        {dayPosts.slice(0, 2).map((post) => (
          <div
            key={post.id}
            className="text-xs px-1 py-0.5 bg-brand-orange/80 text-white truncate rounded"
          >
            {post.title}
          </div>
        ))}
        {dayPosts.length > 2 && (
          <div className="text-xs text-white/50">+{dayPosts.length - 2} more</div>
        )}
      </div>
    </button>
  );
};

const NewPostModal = ({ date, onClose, onCreate, isCreating }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [time, setTime] = useState('12:00');

  const handleSubmit = (e) => {
    e.preventDefault();
    const [hours, minutes] = time.split(':');
    const scheduledAt = new Date(date);
    scheduledAt.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    onCreate({
      title,
      content,
      scheduled_at: scheduledAt.toISOString(),
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white">Schedule Post</h3>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded">
            <X size={20} className="text-white/60" />
          </button>
        </div>
        <p className="text-sm text-white/60 mb-4">{format(date, 'EEEE, MMMM d, yyyy')}</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-white/60 mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full bg-white/5 border-3 border-black p-2 text-white focus:outline-none focus:ring-2 focus:ring-brand-orange"
              placeholder="Post title"
            />
          </div>
          <div>
            <label className="block text-sm text-white/60 mb-1">Time</label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full bg-white/5 border-3 border-black p-2 text-white focus:outline-none focus:ring-2 focus:ring-brand-orange"
            />
          </div>
          <div>
            <label className="block text-sm text-white/60 mb-1">Content (optional)</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={3}
              className="w-full bg-white/5 border-3 border-black p-2 text-white resize-none focus:outline-none focus:ring-2 focus:ring-brand-orange"
              placeholder="Post content..."
            />
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="submit" variant="primary" disabled={isCreating || !title}>
              {isCreating ? <Loader2 size={16} className="animate-spin" /> : 'Schedule'}
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

const DayDetail = ({ date, posts, onClose, onDelete, isDeleting }) => {
  const dayPosts = posts?.filter((p) => isSameDay(new Date(p.scheduled_at), date)) || [];

  return (
    <Card className="mt-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white">{format(date, 'EEEE, MMMM d')}</h3>
        <button onClick={onClose} className="p-1 hover:bg-white/10 rounded">
          <X size={20} className="text-white/60" />
        </button>
      </div>
      {dayPosts.length === 0 ? (
        <p className="text-white/50 text-center py-4">No posts scheduled</p>
      ) : (
        <div className="space-y-3">
          {dayPosts.map((post) => (
            <div
              key={post.id}
              className="flex items-start justify-between p-3 bg-white/5 border border-white/10 rounded"
            >
              <div>
                <p className="font-medium text-white">{post.title}</p>
                <div className="flex items-center gap-1 text-xs text-white/50 mt-1">
                  <Clock size={12} />
                  {format(new Date(post.scheduled_at), 'h:mm a')}
                </div>
                {post.content && (
                  <p className="text-sm text-white/60 mt-2">{post.content}</p>
                )}
              </div>
              <button
                onClick={() => onDelete(post.id)}
                disabled={isDeleting}
                className="p-1 hover:bg-red-500/20 rounded text-red-400"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

const Calendar = () => {
  const toast = useToast();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showNewPost, setShowNewPost] = useState(false);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const { data: posts, isLoading } = useScheduledPosts(calendarStart, calendarEnd);
  const createMutation = useCreateScheduledPost();
  const deleteMutation = useDeleteScheduledPost();

  const calendarDays = useMemo(() => {
    const days = [];
    let day = calendarStart;
    while (day <= calendarEnd) {
      days.push(day);
      day = addDays(day, 1);
    }
    return days;
  }, [calendarStart, calendarEnd]);

  const handleDayClick = (date) => {
    setSelectedDate(date);
  };

  const handleCreatePost = (data) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        setShowNewPost(false);
        toast.success('Post scheduled');
      },
      onError: () => toast.error('Failed to schedule post'),
    });
  };

  const handleDeletePost = (id) => {
    deleteMutation.mutate(id, {
      onSuccess: () => toast.success('Post deleted'),
      onError: () => toast.error('Failed to delete post'),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Calendar</h1>
          <p className="text-white/60 mt-1">Schedule and manage your content</p>
        </div>
        <Button
          variant="primary"
          onClick={() => {
            setSelectedDate(selectedDate || new Date());
            setShowNewPost(true);
          }}
          className="flex items-center gap-2"
        >
          <Plus size={18} />
          <span className="hidden sm:inline">Schedule Post</span>
        </Button>
      </div>

      <Card padding={false}>
        {/* Month Navigation */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="p-2 hover:bg-white/10 rounded transition-colors"
          >
            <ChevronLeft size={20} className="text-white" />
          </button>
          <h2 className="text-xl font-bold text-white">
            {format(currentMonth, 'MMMM yyyy')}
          </h2>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="p-2 hover:bg-white/10 rounded transition-colors"
          >
            <ChevronRight size={20} className="text-white" />
          </button>
        </div>

        {/* Weekday Headers */}
        <div className="grid grid-cols-7 border-b border-white/10">
          {WEEKDAYS.map((day) => (
            <div
              key={day}
              className="p-2 text-center text-sm font-medium text-white/60"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={32} className="text-brand-orange animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-7">
            {calendarDays.map((day) => (
              <CalendarDay
                key={day.toISOString()}
                date={day}
                currentMonth={currentMonth}
                posts={posts}
                onDayClick={handleDayClick}
                isSelected={selectedDate && isSameDay(day, selectedDate)}
              />
            ))}
          </div>
        )}
      </Card>

      {/* Day Detail */}
      {selectedDate && !showNewPost && (
        <DayDetail
          date={selectedDate}
          posts={posts}
          onClose={() => setSelectedDate(null)}
          onDelete={handleDeletePost}
          isDeleting={deleteMutation.isPending}
        />
      )}

      {/* New Post Modal */}
      {showNewPost && selectedDate && (
        <NewPostModal
          date={selectedDate}
          onClose={() => setShowNewPost(false)}
          onCreate={handleCreatePost}
          isCreating={createMutation.isPending}
        />
      )}
    </div>
  );
};

export default Calendar;
