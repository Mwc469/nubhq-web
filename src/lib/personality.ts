/**
 * NubHQ Personality System
 * The voice of NUB - weird, sarcastic, silly, delightful
 *
 * "Taking weird seriously since 2019"
 */

// ============================================================
// LOADING MESSAGES
// Because waiting should be fun
// ============================================================

export const LOADING_MESSAGES = {
  default: [
    "Teaching walruses to type...",
    "Warming up the weird machine...",
    "Consulting the chaos gods...",
    "Caffeinating the algorithms...",
    "Asking nicely for your data...",
    "Doing walrus things...",
    "Hold tight, we're being weird...",
    "Loading... but make it chaotic...",
    "Summoning content from the void...",
    "The walrus is thinking...",
    "Preparing maximum silliness...",
    "Untangling the internet spaghetti...",
  ],

  video: [
    "Teaching pixels to dance...",
    "Convincing frames to cooperate...",
    "The video is being dramatic, one sec...",
    "Extracting pure chaos from footage...",
    "Making your clips chef's kiss...",
    "Finding the bangers in your footage...",
    "The walrus is watching your video... judgingly...",
  ],

  ai: [
    "The AI is doing its thing...",
    "Consulting our robot overlords...",
    "Generating certified weirdness...",
    "The machine is feeling creative...",
    "AI go brrrrr...",
    "Asking Claude to be weird (it's good at that)...",
  ],

  upload: [
    "Yoinking your file...",
    "Your file is on its way to walrus headquarters...",
    "Uploading... the walrus is hungry for data...",
    "Sending bytes through the tubes...",
    "File go zoom...",
  ],

  save: [
    "Saving your masterpiece...",
    "Committing to the chaos...",
    "The database is accepting your offering...",
    "Preserving this moment forever (or until you delete it)...",
  ],
};

export function getLoadingMessage(category: keyof typeof LOADING_MESSAGES = 'default'): string {
  const messages = LOADING_MESSAGES[category] || LOADING_MESSAGES.default;
  return messages[Math.floor(Math.random() * messages.length)];
}

// ============================================================
// EMPTY STATE MESSAGES
// When there's nothing, make nothing fun
// ============================================================

export const EMPTY_STATES = {
  content: {
    title: "It's quiet... too quiet 🦭",
    subtitle: "No posts yet. The void awaits your creativity.",
    action: "Create something weird",
  },

  drafts: {
    title: "No drafts? Living dangerously.",
    subtitle: "All your ideas posted immediately. We respect that chaos.",
    action: "Start a new draft",
  },

  approvals: {
    title: "Nothing to approve!",
    subtitle: "Either you're super efficient or everyone's slacking. 🤷",
    action: "Go make some trouble",
  },

  media: {
    title: "The media library is lonely",
    subtitle: "Drop some pics, vids, or interpretive dance recordings.",
    action: "Upload something",
  },

  templates: {
    title: "Template-less and thriving",
    subtitle: "You either don't need templates or enjoy typing the same thing repeatedly. No judgment.",
    action: "Create a template",
  },

  clips: {
    title: "No highlights yet",
    subtitle: "Upload a video and let the walrus find the bangers.",
    action: "Upload video",
  },

  search: {
    title: "Nothing found 👀",
    subtitle: "Either it doesn't exist or the search is drunk. Try different words?",
    action: "Clear search",
  },

  calendar: {
    title: "Calendar looking empty",
    subtitle: "No shows? Book some gigs! The stage misses you.",
    action: "Add an event",
  },

  activity: {
    title: "No activity yet",
    subtitle: "This is your first time here? Welcome to the chaos! 🎉",
    action: "Do something",
  },
};

// ============================================================
// ERROR MESSAGES
// When things break, at least make them laugh
// ============================================================

export const ERROR_MESSAGES: Record<number | string, string[]> = {
  // HTTP Errors
  400: [
    "The server didn't understand that. Honestly, neither did we.",
    "That request was... creative. Too creative. Try again?",
    "Something's not quite right with that. The walrus is confused.",
  ],

  401: [
    "Who goes there?! Oh wait, we don't have auth yet. Weird.",
    "Unauthorized? In this economy? Refresh and try again.",
  ],

  403: [
    "You can't do that. Sorry, we don't make the rules. (Actually we do, but still.)",
    "Access denied. The walrus says no. 🦭❌",
  ],

  404: [
    "That doesn't exist. Maybe it never did. Maybe it's a ghost.",
    "404: Content not found. It's probably vibing somewhere else.",
    "We looked everywhere. Under the couch. Behind the fridge. Nothing.",
    "This page is doing a disappearing act. 🎩✨",
  ],

  408: [
    "Request timed out. The server got distracted. Relatable.",
    "That took too long. Even walruses have patience limits.",
  ],

  413: [
    "That file is too CHONKY. Put it on a diet and try again.",
    "Woah there, that's a big boi. Try something smaller.",
  ],

  422: [
    "That data is... sus. Double-check and try again.",
    "The server is being picky about your input. Rude, but fair.",
  ],

  429: [
    "Slow down speedster! You're making requests too fast.",
    "Whoa whoa whoa. Chill. Take a breath. Try again in a sec.",
    "Rate limited. The server needs a coffee break.",
  ],

  500: [
    "Something exploded on our end. We're looking into it. 🔥",
    "The server is having a moment. A bad moment.",
    "Internal server error. It's not you, it's us. (It's definitely us.)",
    "🦭💥 The walrus broke something. Sending apologies.",
  ],

  502: [
    "Bad gateway. The internet gremlins are at it again.",
    "Something between you and us is being difficult.",
  ],

  503: [
    "Service unavailable. We're probably doing maintenance. Or panicking. Hard to tell.",
    "The server is taking a nap. It's been a long day.",
  ],

  network: [
    "No internet? Have you tried yelling at the router?",
    "Can't reach the server. Either you're offline or we're down. Coin flip?",
    "Network error. The WiFi hamster stopped running.",
  ],

  timeout: [
    "That took forever. We gave up. Sorry not sorry.",
    "Request timed out. The walrus got bored waiting.",
  ],

  unknown: [
    "Something weird happened. Weirder than usual.",
    "Error: ¯\\_(ツ)_/¯",
    "Oops. That wasn't supposed to happen.",
  ],
};

export function getErrorMessage(status: number | string): string {
  const messages = ERROR_MESSAGES[status] || ERROR_MESSAGES.unknown;
  return messages[Math.floor(Math.random() * messages.length)];
}

// ============================================================
// SUCCESS MESSAGES
// Celebrate the wins, big and small
// ============================================================

export const SUCCESS_MESSAGES = {
  save: [
    "Saved! 🎉",
    "Done and done!",
    "Saved successfully. You're killing it.",
    "The walrus approves. ✓",
  ],

  create: [
    "Created! Look at you go!",
    "New thing made! How exciting!",
    "Boom! Created.",
  ],

  update: [
    "Updated! Fresh and new.",
    "Changes saved. Nice work.",
    "All updated! ✨",
  ],

  delete: [
    "Deleted. Gone. Poof. 💨",
    "It's been yeeted into the void.",
    "Deleted successfully. No regrets, right?",
  ],

  upload: [
    "Uploaded! That file is home now.",
    "Upload complete! 📤",
    "Your file made it safely.",
  ],

  approve: [
    "Approved! 🎊",
    "Stamp of approval given!",
    "Green light! Let's gooo!",
  ],

  post: [
    "POSTED! It's out there now!",
    "Content deployed. No turning back!",
    "Post successful! The internet welcomes your chaos.",
  ],

  copy: [
    "Copied! 📋",
    "On your clipboard, ready to paste.",
    "Copied to clipboard. Paste away!",
  ],

  export: [
    "Export complete! 🎬",
    "Your clips are ready for chaos!",
    "Exported! Go spread the weird.",
  ],
};

export function getSuccessMessage(action: keyof typeof SUCCESS_MESSAGES): string {
  const messages = SUCCESS_MESSAGES[action] || SUCCESS_MESSAGES.save;
  return messages[Math.floor(Math.random() * messages.length)];
}

// ============================================================
// CONFIRMATION DIALOGS
// When we need to double-check they really meant that
// ============================================================

export const CONFIRMATIONS = {
  delete: {
    title: "Delete this forever?",
    description: "This is permanent. Like, really permanent. Even the walrus can't bring it back.",
    confirm: "Yeet it",
    cancel: "Nope, keep it",
  },

  discard: {
    title: "Throw away your changes?",
    description: "You have unsaved changes. They will be lost, like tears in rain. 🌧️",
    confirm: "Yeah, discard",
    cancel: "Wait, no!",
  },

  post: {
    title: "Ready to post?",
    description: "This will go live. The world will see it. No pressure.",
    confirm: "Send it! 🚀",
    cancel: "Let me reconsider",
  },

  approve: {
    title: "Approve this content?",
    description: "Once approved, it can be scheduled or posted.",
    confirm: "Looks good! ✓",
    cancel: "Not yet",
  },

  reject: {
    title: "Reject this content?",
    description: "The creator will be notified. Be gentle, they tried their best.",
    confirm: "Reject it",
    cancel: "Give it another look",
  },

  logout: {
    title: "Leaving so soon?",
    description: "The walrus will miss you. 🦭💔",
    confirm: "Goodbye!",
    cancel: "I'll stay",
  },

  bulkDelete: {
    title: "Delete ALL of these?",
    description: (count: number) => `You're about to delete ${count} items. This is a lot. Are you sure?`,
    confirm: "Yes, all of them",
    cancel: "That's too many",
  },
};

// ============================================================
// PLACEHOLDER TEXT
// For inputs, textareas, and other empty fields
// ============================================================

export const PLACEHOLDERS = {
  caption: [
    "What's on your mind? (Keep it weird)",
    "Type something legendary...",
    "Your words here. Make them count.",
    "Caption goes brrr...",
  ],

  search: [
    "Search for stuff...",
    "Find things...",
    "Looking for something?",
  ],

  title: [
    "Give it a name...",
    "Title this masterpiece...",
  ],

  notes: [
    "Add some notes (or don't, you rebel)",
    "Notes, thoughts, random musings...",
  ],

  feedback: [
    "Tell us what you really think...",
    "Speak your truth...",
  ],
};

export function getPlaceholder(type: keyof typeof PLACEHOLDERS): string {
  const options = PLACEHOLDERS[type];
  return options[Math.floor(Math.random() * options.length)];
}

// ============================================================
// TOOLTIPS & HINTS
// Little helpful messages throughout
// ============================================================

export const TIPS = {
  voiceScore: {
    10: "Perfect NUB voice! The walrus sheds a tear of joy. 🦭✨",
    9: "Amazing! This is peak NUB energy.",
    8: "Great job! Very on-brand.",
    7: "Solid! Definitely sounds like us.",
    6: "Good! A few tweaks could make it even better.",
    5: "Okay-ish. Could use more weird.",
    4: "Getting there, but needs more NUB sauce.",
    3: "Hmm, this doesn't quite sound like us.",
    2: "Pretty off-brand. The walrus is concerned.",
    1: "This ain't it, chief. Try again?",
    0: "Did you even try? 😅",
  },

  platformLimits: {
    instagram_feed: "Instagram loves 2,200 characters max. Use that caption real estate!",
    instagram_story: "Stories are quick! Keep it punchy.",
    instagram_reel: "Reels! Make the first second count.",
    tiktok: "TikTok allows 4,000 chars now. Go wild (but maybe don't).",
    twitter: "280 chars. Every. Word. Counts.",
    threads: "Threads is chill with length. Express yourself.",
    youtube: "YouTube descriptions can be essays. But should they be? 🤔",
  },

  shortcuts: {
    search: "⌘K to search. You're welcome.",
    save: "⌘S saves. Like every other app ever.",
    newPost: "⌘N for a new post. Speed!",
    help: "Press ? for all shortcuts. You found one already!",
  },
};

// ============================================================
// OTTER REACTIONS
// The walrus comments on things
// ============================================================

export const OTTER_SAYS = {
  approve: [
    "🦭 *happy walrus noises*",
    "🦭 This pleases the walrus.",
    "🦭 *chef's kiss*",
  ],

  reject: [
    "🦭 *sad walrus noises*",
    "🦭 The walrus is disappointed but supportive.",
    "🦭 Back to the drawing board!",
  ],

  waiting: [
    "🦭 *patient walrus stare*",
    "🦭 Still here. Still waiting.",
    "🦭 Take your time. I'm just an walrus.",
  ],

  excited: [
    "🦭 !!!!",
    "🦭 *vibrating with excitement*",
    "🦭 OH HECK YEAH",
  ],

  thinking: [
    "🦭 *thoughtful walrus noises*",
    "🦭 Hmm...",
    "🦭 Let me ponder this...",
  ],

  celebrate: [
    "🦭 🎉🎊🎉",
    "🦭 *throws confetti*",
    "🦭 WE DID IT!",
  ],
};

export function getWalrusReaction(mood: keyof typeof OTTER_SAYS): string {
  const reactions = OTTER_SAYS[mood];
  return reactions[Math.floor(Math.random() * reactions.length)];
}

// ============================================================
// TIME-BASED GREETINGS
// ============================================================

export function getGreeting(): string {
  const hour = new Date().getHours();

  if (hour < 5) {
    return "Still up? The walrus respects the grind. 🦭🌙";
  } else if (hour < 9) {
    return "Good morning, early bird! ☀️";
  } else if (hour < 12) {
    return "Morning! Ready to make some chaos?";
  } else if (hour < 14) {
    return "Lunchtime vibes. Post something tasty. 🍕";
  } else if (hour < 17) {
    return "Afternoon! Peak posting hours incoming.";
  } else if (hour < 20) {
    return "Evening! The content never sleeps.";
  } else if (hour < 23) {
    return "Late night posting? Bold move. 🌙";
  } else {
    return "Midnight content creation. We love to see it.";
  }
}

// ============================================================
// ACHIEVEMENT/MILESTONE MESSAGES
// ============================================================

export const ACHIEVEMENTS = {
  firstPost: {
    title: "First Post! 🎉",
    message: "You did it! Your first post is out there. The journey begins!",
  },
  tenPosts: {
    title: "10 Posts Deep",
    message: "Double digits! You're on a roll.",
  },
  fiftyPosts: {
    title: "Content Machine",
    message: "50 posts! You're basically a content factory now.",
  },
  hundredPosts: {
    title: "Century Club 💯",
    message: "100 posts! The walrus bows to your dedication.",
  },
  speedRunner: {
    title: "Speed Runner",
    message: "Posted 5 times in one day. Slow down? Never heard of her.",
  },
  nightOwl: {
    title: "Night Owl 🦉",
    message: "Posting at 3am. The walrus is concerned but impressed.",
  },
  templateMaster: {
    title: "Template Master",
    message: "Created 10 templates. Efficiency is your middle name.",
  },
  clipLord: {
    title: "Clip Lord",
    message: "Exported 50 clips. You're a video editing legend.",
  },
};

// ============================================================
// BUTTON LABELS (context-aware)
// ============================================================

export const BUTTONS = {
  save: {
    idle: "Save",
    loading: "Saving...",
    success: "Saved!",
    error: "Failed to save",
  },

  post: {
    idle: "Post",
    loading: "Posting...",
    success: "Posted!",
    error: "Oops, try again",
  },

  submit: {
    idle: "Submit",
    loading: "Submitting...",
    success: "Done!",
    error: "Something went wrong",
  },

  upload: {
    idle: "Upload",
    loading: "Uploading...",
    success: "Uploaded!",
    error: "Upload failed",
  },

  generate: {
    idle: "✨ Generate",
    loading: "Generating...",
    success: "Generated!",
    error: "Generation failed",
  },

  analyze: {
    idle: "🔍 Analyze",
    loading: "Analyzing...",
    success: "Analysis complete!",
    error: "Analysis failed",
  },

  export: {
    idle: "🎬 Export",
    loading: "Exporting...",
    success: "Exported!",
    error: "Export failed",
  },
};

export type ButtonState = 'idle' | 'loading' | 'success' | 'error';

export function getButtonLabel(action: keyof typeof BUTTONS, state: ButtonState): string {
  return BUTTONS[action][state];
}
