import { Calendar as CalendarIcon } from 'lucide-react';
import Card from '../components/ui/Card';

const Calendar = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Calendar</h1>
        <p className="text-white/60 mt-1">Schedule and manage your content</p>
      </div>

      <Card className="text-center py-16">
        <CalendarIcon size={64} className="mx-auto text-brand-orange mb-6" />
        <h2 className="text-2xl font-bold text-white mb-2">Coming Soon</h2>
        <p className="text-white/60 max-w-md mx-auto">
          Schedule posts, set reminders, and manage your content calendar all in one place.
        </p>
      </Card>
    </div>
  );
};

export default Calendar;
