import React, { useState } from 'react';
import { 
  CheckCircle2, Circle, ClipboardCheck, Navigation, PenTool, 
  CheckSquare, Calendar, Image, Inbox, BarChart3, Mail, Video,
  Settings, Shield, AlertTriangle, Zap
} from 'lucide-react';
import NeoBrutalCard from '@/components/ui/NeoBrutalCard';
import PageHeader from '@/components/ui/PageHeader';
import { cn } from '@/lib/utils';

const QA_SECTIONS = [
  {
    id: 'nav',
    title: 'Navigation Tests',
    icon: Navigation,
    color: 'cyan',
    tests: [
      { id: 'nav-1', label: 'Click each sidebar link → page loads without error' },
      { id: 'nav-2', label: 'Mobile: Hamburger opens/closes drawer' },
      { id: 'nav-3', label: 'Mobile: Tap nav item → drawer closes, page loads' },
      { id: 'nav-4', label: 'Quick Create dropdown opens → all 3 options work' },
      { id: 'nav-5', label: 'Global search → type query → results appear → click result → navigates' },
      { id: 'nav-6', label: 'Dark/light mode toggle works in header and sidebar' },
    ],
  },
  {
    id: 'post',
    title: 'Post Studio Tests',
    icon: PenTool,
    color: 'pink',
    tests: [
      { id: 'post-1', label: 'Click "New Post" → editor opens' },
      { id: 'post-2', label: 'Fill title + caption → character count updates' },
      { id: 'post-3', label: 'Add hashtag via input + Enter → appears as chip' },
      { id: 'post-4', label: 'Remove hashtag chip → chip disappears' },
      { id: 'post-5', label: 'Select platforms → checkboxes toggle correctly' },
      { id: 'post-6', label: 'Set schedule date/time → value persists' },
      { id: 'post-7', label: 'Click "AI Magic" → caption generates (or loading shows)' },
      { id: 'post-8', label: 'Save Draft → toast appears, post in Drafts tab' },
      { id: 'post-9', label: 'Submit for Approval → status changes to pending_approval' },
      { id: 'post-10', label: 'Edit existing post → form pre-fills correctly' },
      { id: 'post-11', label: 'Voice Check shows warnings for "dont_say" terms' },
    ],
  },
  {
    id: 'approval',
    title: 'Approval Queue Tests',
    icon: CheckSquare,
    color: 'yellow',
    tests: [
      { id: 'appr-1', label: 'Pending tab shows items with status=pending' },
      { id: 'appr-2', label: 'Filter dropdown changes visible items' },
      { id: 'appr-3', label: 'Click Review → modal opens with content preview' },
      { id: 'appr-4', label: 'Approve (with schedule) → modal asks for date → confirms' },
      { id: 'appr-5', label: 'Reject → modal requires reason → confirms → status=rejected' },
      { id: 'appr-6', label: 'Request Revision → status updates accordingly' },
      { id: 'appr-7', label: 'Reviewed tab shows historical approvals' },
      { id: 'appr-8', label: 'Past-scheduled approve creates ActivityLog with [DRY RUN]' },
    ],
  },
  {
    id: 'calendar',
    title: 'Content Calendar Tests',
    icon: Calendar,
    color: 'purple',
    tests: [
      { id: 'cal-1', label: 'Calendar grid renders current month' },
      { id: 'cal-2', label: 'Prev/Next arrows change month' },
      { id: 'cal-3', label: 'Scheduled posts show as platform icons on dates' },
      { id: 'cal-4', label: 'Events show as purple calendar icons' },
      { id: 'cal-5', label: 'Click date → modal shows posts/events for that day' },
      { id: 'cal-6', label: 'Click post in modal → navigates to Post Studio edit' },
      { id: 'cal-7', label: 'New Event button → form modal → create event' },
      { id: 'cal-8', label: 'Show/hide toggles filter Events and Posts' },
    ],
  },
  {
    id: 'media',
    title: 'Media Library Tests',
    icon: Image,
    color: 'green',
    tests: [
      { id: 'med-1', label: 'Grid/List view toggle works' },
      { id: 'med-2', label: 'Search filters assets by name/tag' },
      { id: 'med-3', label: 'File type dropdown filters correctly' },
      { id: 'med-4', label: 'Tag dropdown filters correctly' },
      { id: 'med-5', label: 'Clear filters resets all' },
      { id: 'med-6', label: 'Click asset → drawer opens with details' },
      { id: 'med-7', label: 'Add/remove tags in drawer → updates asset' },
      { id: 'med-8', label: 'Favorite toggle works' },
      { id: 'med-9', label: 'Upload button triggers file picker' },
      { id: 'med-10', label: 'Folder sidebar filters by folder' },
    ],
  },
  {
    id: 'inbox',
    title: 'Inbox & Analytics Tests',
    icon: Inbox,
    color: 'purple',
    tests: [
      { id: 'inb-1', label: 'Inbox tab shows thread list' },
      { id: 'inb-2', label: 'Click thread → messages load in right pane' },
      { id: 'inb-3', label: 'Type reply + Send → message appears in thread' },
      { id: 'inb-4', label: 'Close/Reopen/Mark Waiting buttons update status' },
      { id: 'inb-5', label: 'Analytics tab shows charts and stats' },
      { id: 'inb-6', label: 'Metrics table filters work (platform, type, post, date)' },
      { id: 'inb-7', label: 'Clear filters resets table' },
      { id: 'inb-8', label: 'Date range dropdown changes displayed period' },
    ],
  },
  {
    id: 'email',
    title: 'Email Campaigns Tests',
    icon: Mail,
    color: 'green',
    tests: [
      { id: 'eml-1', label: 'New Campaign → editor modal opens' },
      { id: 'eml-2', label: 'Fill name, subject, content → preview updates' },
      { id: 'eml-3', label: 'Select segments via checkboxes' },
      { id: 'eml-4', label: 'Save Draft → campaign in Drafts tab' },
      { id: 'eml-5', label: 'Edit existing → form pre-fills' },
      { id: 'eml-6', label: 'Schedule Send (dry run) → status=scheduled, ActivityLog entry' },
      { id: 'eml-7', label: 'Send Now (dry run) → status=sent, ActivityLog entry' },
      { id: 'eml-8', label: 'View Stats on sent campaign → modal shows metrics' },
    ],
  },
  {
    id: 'video',
    title: 'Video Studio Tests',
    icon: Video,
    color: 'cyan',
    tests: [
      { id: 'vid-1', label: 'New Project → modal opens' },
      { id: 'vid-2', label: 'Select project type + aspect ratio → visual feedback' },
      { id: 'vid-3', label: 'Create Project → appears in In Progress list' },
      { id: 'vid-4', label: 'Click project card → detail modal opens' },
      { id: 'vid-5', label: 'Advance status (chevron button) → status updates' },
      { id: 'vid-6', label: 'Create Render Job (dry run) → job appears in list' },
      { id: 'vid-7', label: 'Delete project → removed from list' },
    ],
  },
  {
    id: 'templates',
    title: 'Templates Tests',
    icon: ClipboardCheck,
    color: 'orange',
    tests: [
      { id: 'tpl-1', label: 'New Template → editor modal opens' },
      { id: 'tpl-2', label: 'Type {{variable}} → detected variables display' },
      { id: 'tpl-3', label: 'Save Template → appears in list' },
      { id: 'tpl-4', label: 'Use Template (post type) → creates draft, opens Post Studio' },
      { id: 'tpl-5', label: 'Copy button → content copied to clipboard' },
      { id: 'tpl-6', label: 'Favorite toggle works' },
      { id: 'tpl-7', label: 'Search/filter by type works' },
    ],
  },
  {
    id: 'settings',
    title: 'Settings & Safety Tests',
    icon: Settings,
    color: 'yellow',
    tests: [
      { id: 'set-1', label: 'Brand Voice tab → lexicon CRUD works' },
      { id: 'set-2', label: 'Add lexicon term → appears in list grouped by category' },
      { id: 'set-3', label: 'Delete lexicon term → removed from list' },
      { id: 'set-4', label: 'Integrations tab → Connect buttons show OAuth modal' },
      { id: 'set-5', label: 'OAuth modal explains dry run, no real auth triggered' },
      { id: 'set-6', label: 'Notifications tab → switches toggle' },
      { id: 'set-7', label: 'Roles & Automations tabs show "Coming Soon" states' },
    ],
  },
  {
    id: 'safety',
    title: '🛡️ CRITICAL: Safety Checks',
    icon: Shield,
    color: 'pink',
    tests: [
      { id: 'saf-1', label: 'DRY RUN badge visible in header at all times' },
      { id: 'saf-2', label: 'No "Publish Now" button exists anywhere' },
      { id: 'saf-3', label: 'All "Send" actions log [DRY RUN] in ActivityLog' },
      { id: 'saf-4', label: 'liveMode cannot be toggled in UI' },
      { id: 'saf-5', label: 'No OAuth actually connects (modal explains this)' },
      { id: 'saf-6', label: 'Settings entity defaults: liveMode=false, dryRun=true' },
    ],
  },
];

export default function QAChecklist() {
  const [checked, setChecked] = useState(() => {
    const saved = localStorage.getItem('nubhq-qa-checklist');
    return saved ? JSON.parse(saved) : {};
  });

  const toggleCheck = (id) => {
    const updated = { ...checked, [id]: !checked[id] };
    setChecked(updated);
    localStorage.setItem('nubhq-qa-checklist', JSON.stringify(updated));
  };

  const resetAll = () => {
    setChecked({});
    localStorage.removeItem('nubhq-qa-checklist');
  };

  const totalTests = QA_SECTIONS.reduce((acc, s) => acc + s.tests.length, 0);
  const passedTests = Object.values(checked).filter(Boolean).length;
  const progress = Math.round((passedTests / totalTests) * 100);

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto">
      <PageHeader 
        tagline="Done Means Done"
        title="QA Checklist"
        subtitle="Click-path torture test. No shortcuts. Take weird seriously."
      />

      {/* Progress Bar */}
      <NeoBrutalCard accentColor="green" className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <Zap className="w-6 h-6 text-[var(--neon-green)]" />
            <div>
              <p className="font-black text-2xl">{passedTests} / {totalTests}</p>
              <p className="text-xs uppercase tracking-wider opacity-60">Tests Passed</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-black text-3xl text-[var(--neon-green)]">{progress}%</p>
            <button 
              onClick={resetAll}
              className="text-xs underline opacity-60 hover:opacity-100"
            >
              Reset All
            </button>
          </div>
        </div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-[var(--neon-green)] to-[var(--neon-cyan)] transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        {progress === 100 && (
          <p className="text-center mt-4 font-bold text-[var(--neon-green)]">
            🎉 ALL TESTS PASSED. Ship it (when Mattimus says so).
          </p>
        )}
      </NeoBrutalCard>

      {/* Warning Banner */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border-3 border-yellow-400 dark:border-yellow-600 rounded-xl p-4 mb-8 flex items-start gap-3">
        <AlertTriangle className="w-6 h-6 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-bold text-yellow-800 dark:text-yellow-200">DRY RUN MODE ACTIVE</p>
          <p className="text-sm text-yellow-700 dark:text-yellow-300">
            No real posts, emails, or integrations. All actions are simulated. liveMode=false, dryRun=true.
          </p>
        </div>
      </div>

      {/* Checklist Sections */}
      <div className="space-y-6">
        {QA_SECTIONS.map((section) => {
          const Icon = section.icon;
          const sectionPassed = section.tests.filter(t => checked[t.id]).length;
          const sectionTotal = section.tests.length;
          const allPassed = sectionPassed === sectionTotal;

          return (
            <NeoBrutalCard 
              key={section.id} 
              accentColor={allPassed ? 'green' : section.color}
              className={allPassed ? 'opacity-80' : ''}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-lg flex items-center gap-2">
                  <Icon className={`w-5 h-5 text-[var(--neon-${section.color})]`} />
                  {section.title}
                </h2>
                <span className={cn(
                  "text-sm font-bold px-3 py-1 rounded-lg",
                  allPassed 
                    ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300" 
                    : "bg-gray-100 dark:bg-gray-800"
                )}>
                  {sectionPassed}/{sectionTotal}
                </span>
              </div>

              <div className="space-y-2">
                {section.tests.map((test) => (
                  <button
                    key={test.id}
                    onClick={() => toggleCheck(test.id)}
                    className={cn(
                      "w-full flex items-start gap-3 p-3 rounded-xl text-left transition-all",
                      checked[test.id]
                        ? "bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800"
                        : "bg-gray-50 dark:bg-gray-800 border-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600"
                    )}
                  >
                    {checked[test.id] ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    ) : (
                      <Circle className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    )}
                    <span className={cn(
                      "text-sm",
                      checked[test.id] && "line-through opacity-60"
                    )}>
                      {test.label}
                    </span>
                  </button>
                ))}
              </div>
            </NeoBrutalCard>
          );
        })}
      </div>
    </div>
  );
}