// NUB Copy Library
// Snarky, self-deprecating, weird humor for the NubHQ UI
// "Take Weird Seriously" - but roast them first

// ============================================================
// RANDOM HELPER
// ============================================================

export const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

// ============================================================
// GREETINGS (Dashboard, etc.)
// ============================================================

export const GREETINGS = [
  "Let's make some noise 🔊",
  "Ready to break the algorithm?",
  "Time to feed the chaos machine",
  "The weird won't post itself",
  "Another day, another banger",
  "Let's get beautifully strange",
  "Ahoy ya Juicy Nublet!",
  "What's up you beautiful freak!",
  "Let's get saucy 🦦",
  "The internet isn't going to confuse itself",
  "Time to make some bad decisions",
  "Your fans miss you (probably)",
  "The void awaits your content",
  "Let's disappoint our parents together",
  "Ready to post something you'll regret?",
];

// ============================================================
// EMPTY STATES (No content to show)
// ============================================================

export const EMPTY_STATES = {
  drafts: [
    { title: "No drafts? Bold strategy.", message: "Either you're a genius who posts everything immediately, or... you haven't started yet. 🦦" },
    { title: "Tumbleweeds...", message: "Your drafts folder is emptier than our bank account after buying gear." },
    { title: "The void stares back", message: "No drafts found. The chaos won't create itself, ya know." },
    { title: "Ghost town 👻", message: "Not a single draft. Did you come here just to look at buttons?" },
    { title: "Echo... echo...", message: "Your drafts folder is so empty, my voice is bouncing off the walls." },
    { title: "Suspiciously empty", message: "Did you eat all your drafts? That's not how content works." },
  ],
  training: [
    { title: "No training data!", message: "Your AI is literally just guessing. Wild strategy." },
    { title: "Brain empty 🧠", message: "The AI has learned nothing. It's like us in school." },
    { title: "Untrained chaos", message: "Without training, your AI is just vibes. Pure, unhinged vibes." },
    { title: "The AI is confused", message: "It's just sitting there. Waiting. Wondering. Existentially." },
  ],
  posts: [
    { title: "Zero posts. Fascinating.", message: "Your content strategy of 'post nothing ever' is certainly... unique." },
    { title: "The quietest band ever", message: "If you post zero content, do you even exist? Philosophy time! 🤔" },
    { title: "A clean slate!", message: "No posts yet. Either you're new or you deleted everything in a panic. No judgment." },
  ],
  approvals: [
    { title: "All clear!", message: "Nothing needs approval. Go touch grass or write another banger." },
    { title: "Queue's empty!", message: "No one's waiting for your blessing. Time to create more chaos to approve." },
    { title: "Suspiciously empty", message: "Either everyone's slacking or you already approved everything. Either way, nice." },
  ],
  media: [
    { title: "No media? How?", message: "You're in a BAND. Upload literally anything. A blurry photo. Your cat. SOMETHING." },
    { title: "Empty media library", message: "Not even a single grainy concert photo? We're concerned about you." },
    { title: "Where are your pics?", message: "The media library is lonelier than our drummer at closing time." },
  ],
  templates: [
    { title: "No templates yet", message: "You could write everything from scratch every time. Or you could be smart about it. Your call." },
    { title: "Template-free zone", message: "Living dangerously without templates. We respect the chaos." },
  ],
  events: [
    { title: "No upcoming shows?!", message: "Book something! The fans need you! (Or at least your parents do.)" },
    { title: "Calendar's looking sad", message: "No events. The stage misses you. So does the merch table." },
  ],
  activity: [
    { title: "No activity yet", message: "It's quiet... too quiet. Someone do something!" },
    { title: "Nothing happening", message: "The activity log is empty. Did everyone take the day off?" },
  ],
  search: [
    { title: "Nothing found", message: "We searched everywhere. Under the couch cushions. In Matt's beard. Nada." },
    { title: "No results", message: "Your search found exactly zero things. Try different words, ya goof." },
    { title: "404: Content Not Found", message: "Either it doesn't exist or it's hiding. We're not great at hide and seek." },
  ],
};

// ============================================================
// LOADING STATES
// ============================================================

export const LOADING_MESSAGES = [
  "Summoning the chaos...",
  "Consulting the otter spirits...",
  "Teaching robots to rock...",
  "Warming up the weird...",
  "Asking the algorithm nicely...",
  "Tuning the content guitar...",
  "Loading... please don't refresh, we're fragile",
  "Convincing the server to cooperate...",
  "Brewing digital coffee...",
  "Untangling the internet cables...",
  "Negotiating with the cloud...",
  "Spinning up the chaos engines...",
  "Almost there... probably...",
  "Loading your weird. Please wait.",
  "Fetching data from the void...",
];

// ============================================================
// ERROR MESSAGES
// ============================================================

export const ERROR_MESSAGES = {
  generic: [
    { title: "Oops. That wasn't supposed to happen.", message: "Something broke. It's probably Matt's fault." },
    { title: "Well, this is awkward.", message: "We hit a snag. Try again? We promise we're usually better than this." },
    { title: "Error! 💀", message: "Something went wrong. The gremlins got in again." },
  ],
  network: [
    { title: "Can't reach the server", message: "Either your internet's down or our server's taking a nap. Both are valid." },
    { title: "Connection failed", message: "The internet tubes are clogged. Give it a sec." },
  ],
  save: [
    { title: "Couldn't save that", message: "Your brilliant content was too powerful for our database. Try again?" },
    { title: "Save failed", message: "The save button had a moment. Deep breaths. Try again." },
  ],
  upload: [
    { title: "Upload failed", message: "That file was too hot for our servers to handle. 🔥 Try a smaller one?" },
    { title: "Couldn't upload", message: "The file got lost somewhere between here and the cloud. Whoops." },
  ],
  auth: [
    { title: "Who are you again?", message: "Your session expired. We forget things too, don't worry." },
  ],
};

// ============================================================
// SUCCESS MESSAGES
// ============================================================

export const SUCCESS_MESSAGES = {
  saved: [
    "Saved! Your weird is preserved forever. 🦦",
    "Got it! Locked in the chaos vault.",
    "Saved successfully. Gold star for you! ⭐",
    "Done! That's some quality weird right there.",
  ],
  approved: [
    "Approved! Let the chaos flow! 🔥",
    "Blessed by the content gods. Ship it!",
    "YEAHHHHHH! Approved! 🎸",
    "Approved! This one's gonna slap.",
  ],
  rejected: [
    "Rejected. Back to the weird workshop!",
    "Not quite. But failure is just spicy learning!",
    "Sent back for more weird. You got this!",
  ],
  scheduled: [
    "Scheduled! Future you is gonna be so proud.",
    "Locked in! The algorithm awaits your chaos.",
    "Scheduled successfully. Set it and forget it!",
  ],
  posted: [
    "POSTED! Let the engagement flow! 🔥",
    "It's out there! No take-backs now!",
    "Posted! The internet will never be the same.",
  ],
  uploaded: [
    "Uploaded! Looking good, ya filthy animal.",
    "File received! Your media library just got juicier.",
    "Upload complete! 📸",
  ],
  deleted: [
    "Gone forever. Like our dignity at most shows.",
    "Deleted. Into the void it goes.",
    "Poof! Never existed. (We won't tell anyone.)",
  ],
};

// ============================================================
// VOICE SCORE ROASTS
// ============================================================

export const VOICE_SCORE_FEEDBACK = {
  perfect: [ // 9-10
    "Pure NUB energy! This is *chef's kiss* 🦦",
    "This is SO on brand it hurts. Ship it!",
    "Did a NUB member write this? Oh wait, you basically are one now.",
  ],
  good: [ // 7-8
    "Pretty solid! Just needs a tiny bit more chaos.",
    "Almost there! Maybe add something slightly unhinged?",
    "Good vibes! Could use 10% more weird though.",
  ],
  okay: [ // 5-6
    "It's fine... but where's the FIRE? 🔥",
    "This is acceptable. But NUB isn't about 'acceptable,' ya know?",
    "You're playing it safe. We don't do safe here.",
  ],
  weak: [ // 3-4
    "This sounds like a corporate email. We're worried about you.",
    "Did LinkedIn write this? Where's the chaos?",
    "This is the content equivalent of plain oatmeal. Spice it up!",
  ],
  bad: [ // 1-2
    "This is so off-brand it hurts. Did you hit your head?",
    "We showed this to the algorithm and it cried.",
    "This reads like it was written by someone who's never heard music.",
  ],
};

// ============================================================
// FORM VALIDATION ROASTS
// ============================================================

export const VALIDATION = {
  required: [
    "This field won't fill itself, chief.",
    "Empty? Really? Put SOMETHING here.",
    "Required. As in, you literally can't skip this.",
  ],
  tooShort: [
    "That's it? Come on, give us MORE.",
    "Too short! Your fans deserve better than this.",
    "This is a caption, not a haiku. Expand!",
  ],
  tooLong: [
    "Whoa there, Shakespeare. Maybe edit that down a bit?",
    "Even we don't have attention spans for this novel.",
    "Too long! This isn't your dissertation.",
  ],
  invalidUrl: [
    "That's not a valid URL. Did you type it with your elbows?",
    "Broken link alert! Try again, butterfingers.",
  ],
  invalidEmail: [
    "That email looks suspicious. Double-check it?",
    "Invalid email. Unless you're from the future and emails look different there?",
  ],
};

// ============================================================
// IDLE / INACTIVITY PROMPTS
// ============================================================

export const IDLE_PROMPTS = [
  "Hey. You still there? The content isn't gonna post itself.",
  "We see you lurking. Do something weird!",
  "The blank page is judging you. Just start typing!",
  "Writer's block? Just mash the keyboard. We've posted worse.",
  "Fun fact: staring at the screen doesn't count as content creation.",
  "You've been quiet. Everything okay, or are you just vibing?",
  "The algorithm waits for no one. Chop chop!",
];

// ============================================================
// TOOLTIPS & HINTS
// ============================================================

export const TOOLTIPS = {
  saveButton: "Save your weird before it escapes",
  approveButton: "Bless this content with your approval",
  rejectButton: "Send it back for more weird",
  deleteButton: "Yeet this into the void",
  uploadButton: "Feed the media machine",
  scheduleButton: "Set it and forget it (but don't actually forget it)",
  generateButton: "Let the AI cook",
  previewButton: "See how the sausage looks before serving",
  voiceCheck: "How NUB does this sound? (Be honest with yourself)",
};

// ============================================================
// BUTTON LABELS (More personality)
// ============================================================

export const BUTTON_LABELS = {
  create: "Make Something Weird",
  save: "Lock It In",
  saveDraft: "Save for Later (coward)",
  submit: "Ship It!",
  approve: "Bless This Mess",
  reject: "Needs More Weird",
  delete: "Yeet Forever",
  cancel: "Nevermind",
  upload: "Feed the Beast",
  generate: "AI, Do Your Thing",
  refresh: "Try Again",
  viewAll: "Show Me Everything",
  loadMore: "I Want More",
};

// ============================================================
// PLACEHOLDER TEXT
// ============================================================

export const PLACEHOLDERS = {
  caption: "Write something weird... or let AI do it, we don't judge",
  title: "Give this chaos a name",
  search: "Search for stuff...",
  tags: "Add some tags (comma separated, like your thoughts)",
  notes: "Notes for the approval queue (be nice... or don't)",
  rejectReason: "Why are you sending this back? Be constructive... or at least funny",
  eventName: "What's this show called?",
  venue: "Where's the party at?",
};

// ============================================================
// CONFETTI MESSAGES (for celebrations)
// ============================================================

export const CELEBRATIONS = [
  "YEAHHHHHH! 🎉",
  "LET'S GOOOOO! 🔥",
  "Ohhhh yeah! 🎸",
  "Kablow! 💥",
  "You absolute legend! 🦦",
  "Nailed it! 🎯",
  "That's what we're talking about!",
  "Pure majesty! ✨",
];

// ============================================================
// 404 / NOT FOUND
// ============================================================

export const NOT_FOUND = {
  titles: [
    "Lost in the Sauce",
    "404: Weird Not Found",
    "You've Gone Too Far",
    "This Page Doesn't Exist (Yet)",
  ],
  messages: [
    "Either this page doesn't exist or you've discovered a glitch in the matrix. Either way, head back home.",
    "We looked everywhere. Under the couch. In the van. Nothing. This page is gone.",
    "You found the one place in NubHQ that doesn't exist. Congratulations? Now go back.",
    "This page is as empty as our merch booth at the end of a good show.",
  ],
};

// ============================================================
// CONTEXTUAL ROASTS
// ============================================================

export const CONTEXTUAL_ROASTS = {
  noHashtags: "No hashtags? You must really trust the algorithm. Bold.",
  noMedia: "Posting without media? Very 2008 of you.",
  shortCaption: "That's the whole caption? You know you can use more words, right?",
  longCaption: "This caption is longer than our setlist. Maybe trim it?",
  scheduledPast: "You scheduled this for the past. We're good, but not time-travel good.",
  lowVoiceScore: "This sounds more like a press release than a NUB post. Let's fix that.",
  emptyTitle: "Untitled? Every piece of content deserves a name. Even the weird ones.",
  duplicateContent: "Didn't you already post something like this? The fans will notice.",
  weekendSchedule: "Scheduling for the weekend? Smart. That's when the chaos peaks.",
  mondaySchedule: "Monday morning? You're braver than us.",
};

// ============================================================
// ENCOURAGEMENT (for when they need a boost)
// ============================================================

export const ENCOURAGEMENT = [
  "You got this, ya beautiful weirdo!",
  "Even our worst content is better than most bands' best. Probably.",
  "Remember: done is better than perfect. Ship it!",
  "The fans don't expect perfection. They expect CHAOS.",
  "Every banger started as a weird idea. Keep going!",
  "You're doing great, ya filthy animal 🦦",
];

// ============================================================
// STATS ROASTS (for dashboard numbers)
// ============================================================

export const STATS_ROASTS = {
  zeroDrafts: [
    "Zero drafts? Either you're a perfectionist or just getting started. We're watching.",
    "No drafts = big energy. Or procrastination. Hard to tell.",
  ],
  manyDrafts: [
    "That's a lot of drafts. You a collector or a creator? 🤔",
    "Draft hoarding is a real condition. We should talk.",
  ],
  zeroPending: [
    "Nothing pending! The approval queue fears you.",
    "Queue's clear! Either you're efficient or nobody's working.",
  ],
  manyPending: [
    "That approval queue is STACKED. Someone's been busy!",
    "So many approvals... hope you brought snacks.",
  ],
  zeroScheduled: [
    "Nothing scheduled? Your calendar is looking lonely.",
    "Empty schedule = missed opportunities. Just saying.",
  ],
  zeroPosted: [
    "Zero posts? The internet doesn't know you exist yet.",
    "No posts yet. The world awaits your weird!",
  ],
  manyPosted: [
    "Look at you! Content MACHINE! 🔥",
    "Posting champion over here! The algorithm bows to you.",
  ],
};

// ============================================================
// ACHIEVEMENT ROASTS
// ============================================================

export const ACHIEVEMENTS = {
  firstPost: {
    title: "First Post! 🎉",
    message: "Your first post! The algorithm has no idea what's coming.",
  },
  tenPosts: {
    title: "Content Creator!",
    message: "10 posts! You're basically an influencer now. (Don't let it go to your head.)",
  },
  firstApproval: {
    title: "Quality Control!",
    message: "You approved your first piece of content. With great power comes great responsibility.",
  },
  speedApproval: {
    title: "Speed Demon!",
    message: "Approved in under a minute? Either it's amazing or you didn't read it. 👀",
  },
  draftHoarder: {
    title: "Draft Hoarder 📚",
    message: "10 drafts and nothing posted? You're a collector, not a creator. Time to ship!",
  },
  nightOwl: {
    title: "Night Owl 🦉",
    message: "Posting at 3am? Dedication. Or insomnia. We respect both.",
  },
  weekendWarrior: {
    title: "Weekend Warrior!",
    message: "Working on the weekend? The grind never stops!",
  },
};

// ============================================================
// SIDEBAR TAGLINES (rotating)
// ============================================================

// ============================================================
// SCHEDULING ROASTS (based on when they schedule)
// ============================================================

export const SCHEDULE_ROASTS = {
  mondayMorning: [
    "Monday 6am? Brutal. The fans will appreciate your suffering.",
    "Monday morning? You're braver than the whole band combined.",
  ],
  friday: [
    "Friday posting! Smart. That's when people actually look at their phones.",
    "Friday vibes! The algorithm respects the weekend warrior.",
  ],
  weekend: [
    "Weekend posting? The fans are scrolling. Good call.",
    "Saturday content! While everyone else touches grass, you're grinding.",
  ],
  lateNight: [
    "Scheduling for 2am? The insomniacs will appreciate you.",
    "Late night post? Bold. Let's see if the night owls are out.",
  ],
  farFuture: [
    "Scheduling for next month? Planning ahead like a responsible adult. Weird flex.",
    "That's weeks away! Either you're organized or this will be hilariously outdated by then.",
  ],
  sameDay: [
    "Same day scheduling? Living on the edge. We respect it.",
    "Posting today! No time like the present (or the very near future).",
  ],
};

// ============================================================
// DRAFT AGE ROASTS
// ============================================================

export const DRAFT_AGE_ROASTS = {
  fresh: [ // < 1 day
    "Fresh draft! Still warm from your brain.",
  ],
  stale: [ // 1-7 days
    "This draft is a few days old. Still good! Probably.",
    "Been sitting here a bit. No judgment. (Some judgment.)",
  ],
  old: [ // 1-4 weeks
    "This draft is collecting dust. Either finish it or put it out of its misery.",
    "Weeks old! At this point it's vintage content.",
  ],
  ancient: [ // > 1 month
    "This draft is older than some of our songs. Fish or cut bait, friend.",
    "A month?! This draft has seen things. Either post it or let it rest.",
    "Ancient artifact detected. Is this content still relevant? Be honest.",
  ],
};

// ============================================================
// PLATFORM-SPECIFIC ROASTS
// ============================================================

export const PLATFORM_ROASTS = {
  instagram: [
    "Instagram, huh? Time to make it aesthetic. ✨",
    "The 'gram demands your finest weird.",
  ],
  facebook: [
    "Facebook? That's where the parents are. Keep it PG-ish.",
    "Posting to Facebook! Your aunt will love this. (Maybe.)",
  ],
  twitter: [
    "Twitter/X/Whatever it's called now. Keep it punchy.",
    "The bird app! Or... the X app? Anyway, be brief.",
  ],
  tiktok: [
    "TikTok! The youths await your content.",
    "Time to go viral. (Or get 47 views. Both are valid.)",
  ],
  youtube: [
    "YouTube! The algorithm is hungry. Feed it.",
    "Video platform! Hope you remembered to edit out the mistakes.",
  ],
  all: [
    "Posting EVERYWHERE? Ambitious. We like it.",
    "All platforms at once! Maximum chaos deployed.",
  ],
};

// ============================================================
// CHARACTER COUNT ROASTS
// ============================================================

export const CHARACTER_COUNT = {
  tooShort: [
    "That's it? You can use more words, you know.",
    "Brevity is the soul of wit. But this might be TOO brief.",
    "A person of few words. Very few. Maybe too few.",
  ],
  perfect: [
    "Perfect length! Goldilocks would be proud.",
    "Just right. Not too long, not too short. *chef's kiss*",
  ],
  gettingLong: [
    "Getting wordy! Hope it's all good stuff.",
    "That's a lot of words. Are they all necessary? (Honest question.)",
  ],
  tooLong: [
    "Whoa there, Shakespeare. This is a caption, not a novel.",
    "TL;DR incoming. Maybe trim this bad boy?",
    "Even your biggest fans won't read all this. Trust us.",
  ],
  wayTooLong: [
    "This is longer than our setlist. MUCH longer.",
    "Sir/Ma'am, this is a social media post, not a dissertation.",
    "The 'Read More' button is crying. Have mercy.",
  ],
};

// ============================================================
// COPY/CLIPBOARD MESSAGES
// ============================================================

export const CLIPBOARD_MESSAGES = [
  "Copied! Now go paste it somewhere cool.",
  "On your clipboard! Use it wisely.",
  "Copied! The content is in your hands now.",
  "Snatched! It's in your clipboard.",
  "Got it! Ctrl+V away, friend.",
];

// ============================================================
// STREAK ROASTS (posting consistency)
// ============================================================

export const STREAK_ROASTS = {
  noStreak: [
    "No posting streak yet. The algorithm doesn't know you exist.",
    "Zero streak. The fans are wondering if you're okay.",
  ],
  shortStreak: [ // 2-4 days
    "Baby streak! Keep it going!",
    "You're on a roll! Don't stop now.",
  ],
  mediumStreak: [ // 5-14 days
    "Nice streak! You're basically an influencer now.",
    "Consistent king/queen! The algorithm bows to you.",
  ],
  longStreak: [ // 15+ days
    "LEGENDARY STREAK! Are you okay? Do you need rest?",
    "Two weeks straight?! Dedication. Or obsession. Either way, impressive.",
  ],
  brokeStreak: [
    "Streak broken. RIP. Time to start again.",
    "You broke your streak! The algorithm will forgive you. Eventually.",
  ],
};

// ============================================================
// MEDIA UPLOAD ROASTS
// ============================================================

export const MEDIA_UPLOAD_ROASTS = {
  image: [
    "Nice pic! (We assume. We're just code.)",
    "Image received! Looking good. (Probably.)",
    "Photo uploaded! Frame-worthy, surely.",
  ],
  video: [
    "Video uploaded! Did you remember to check the audio?",
    "Video received! Hope it's not sideways. (We've all been there.)",
    "Clip uploaded! Spielberg is shaking.",
  ],
  audio: [
    "Audio uploaded! Sounds great. (We can't actually hear it.)",
    "Sound file received! We're just gonna trust you on this one.",
  ],
  large: [
    "Big file! She thicc. Uploading...",
    "That's a chunky file! Give it a sec.",
  ],
  multiple: [
    "Multiple files! Someone's being productive.",
    "Batch upload! Efficiency. We love to see it.",
  ],
};

// ============================================================
// TEMPLATE USAGE ROASTS
// ============================================================

export const TEMPLATE_ROASTS = [
  "Using a template? Smart. Lazy. Smartly lazy. 🧠",
  "Template power! Work smarter, not harder.",
  "Ah, the template approach. A person of culture.",
  "Templates exist for a reason. That reason is you.",
  "Why reinvent the wheel? Good choice.",
];

// ============================================================
// APPROVAL FLOW QUIPS
// ============================================================

export const APPROVAL_QUIPS = {
  submitting: [
    "Sending for approval! May the odds be ever in your favor.",
    "Into the approval queue it goes! Fingers crossed.",
    "Submitted! Now we wait. And refresh. And wait more.",
  ],
  approved: [
    "APPROVED! Someone believes in you! 🎉",
    "Blessed by the approval gods! Ship it!",
    "Green light! This one's ready to rock.",
  ],
  rejected: [
    "Sent back for revisions. It happens to the best of us.",
    "Not quite. But hey, feedback is a gift! (Sometimes a weird gift.)",
    "Back to the workshop! You'll nail it next time.",
  ],
  waiting: [
    "Still waiting for approval... *taps foot*",
    "Pending... Someone check on the approvers.",
    "In the queue. The gatekeepers are... gatekeeping.",
  ],
};

// ============================================================
// SEARCH RESULTS COMMENTARY
// ============================================================

export const SEARCH_COMMENTARY = {
  manyResults: [
    "Found a bunch! You've been busy.",
    "Lots of results! Like finding money in old jeans.",
  ],
  fewResults: [
    "Found a few things. Better than nothing!",
    "Slim pickings, but we found something.",
  ],
  exactMatch: [
    "Found exactly what you wanted! We're basically psychic.",
    "Boom! Direct hit. That was easy.",
  ],
  noResults: [
    "Nada. Zero. The void. Try different words?",
    "We searched everywhere. Under the couch. In Matt's beard. Nothing.",
    "404: Content Not Found. (That's a computer joke.)",
  ],
};

// ============================================================
// SETTINGS PAGE DESCRIPTIONS
// ============================================================

export const SETTINGS_DESCRIPTIONS = {
  darkMode: "For when the sun is too bright or you're feeling edgy.",
  notifications: "Control how much we bug you. (We promise not to overdo it. Mostly.)",
  autoSave: "Saves your work automatically. Because we don't trust you to remember.",
  dryRun: "Test mode! Nothing actually posts. Perfect for chickens.",
  timezone: "Tell us where you are so we can schedule your chaos correctly.",
  language: "Change the words we use. The weird stays the same.",
  privacy: "Boring legal stuff. But important! Probably read it.",
};

// ============================================================
// FIRST-TIME USER MESSAGES
// ============================================================

export const ONBOARDING = {
  welcome: [
    "Ahoy, new Nublet! Welcome to the chaos. 🦦",
    "Fresh meat! I mean... welcome to NubHQ!",
    "A new challenger appears! Let's get weird.",
  ],
  firstPost: [
    "Your first post awaits! No pressure. (Some pressure.)",
    "The blank page stares back. Show it who's boss.",
  ],
  tips: [
    "Pro tip: The weirder, the better. Always.",
    "Hot tip: Emojis are your friends. Use them wisely. 🔥",
    "Remember: Done is better than perfect. Ship it!",
  ],
};

// ============================================================
// FOOTER QUIPS
// ============================================================

export const FOOTER_QUIPS = [
  "© NUB. Don't steal our weird.",
  "Made with chaos and questionable decisions.",
  "Taking Weird Seriously since whenever.",
  "0% juice. 100% weird.",
  "Built by otters. Probably. 🦦",
];

export const SIDEBAR_TAGLINES = {
  Dashboard: [
    "The Weird HQ",
    "Command Center",
    "Chaos Central",
    "Home Base",
  ],
  ContentCalendar: [
    "Plot the chaos",
    "Schedule the weird",
    "Time is fake anyway",
    "Future planning",
  ],
  PostStudio: [
    "Craft the strange",
    "Word workshop",
    "Caption lab",
    "Weird factory",
  ],
  ApprovalQueue: [
    "Bless or banish",
    "Quality control",
    "The gatekeepers",
    "Judge, jury, vibes",
  ],
  MediaLibrary: [
    "Asset asylum",
    "Pic pit",
    "Media dungeon",
    "Visual vault",
  ],
  Templates: [
    "Weird blueprints",
    "Lazy genius zone",
    "Copy/paste paradise",
    "Template treasure",
  ],
  VideoStudio: [
    "Motion madness",
    "Clip factory",
    "Reel workshop",
    "Frame by frame",
  ],
  Settings: [
    "Tune the machine",
    "Knobs and dials",
    "The boring stuff",
    "Config city",
  ],
};
