// NubHQ Hashtag Library
// Curated hashtag sets optimized for reach and relevance

// ============================================================
// HASHTAG STRATEGY
// ============================================================
// Mix of sizes: 30% large (1M+), 40% medium (100K-1M), 30% niche (<100K)
// This balances discoverability with competition

export const HASHTAG_SETS = {
  // === SHOW ANNOUNCEMENTS ===
  showAnnouncement: {
    name: "Show Announcement",
    description: "For promoting upcoming shows",
    tags: [
      // Large (reach)
      "livemusic", "concert", "tour", "rocknroll",
      // Medium (balance)
      "localmusic", "liveshows", "concertlife", "rockshow",
      // Niche (targeted)
      "coloradomusic", "comusic", "fortcollinsmusic", "denvermusic",
      "punkrock", "comedyrock", "garagerock"
    ],
    platforms: ["instagram", "tiktok"],
    maxTags: 15,
  },

  // === SHOW RECAP / AFTER SHOW ===
  showRecap: {
    name: "Show Recap",
    description: "For post-show content and thank yous",
    tags: [
      "lastnight", "livemusicphotography", "concertphotos", "showtime",
      "bandlife", "tourlife", "onstage", "crowdshot",
      "thanksforcomingoutttt", "bestsupporters", "amazingcrowd",
      "coloradobands", "localshows", "supportlocalmusic"
    ],
    platforms: ["instagram"],
    maxTags: 15,
  },

  // === BEHIND THE SCENES ===
  behindTheScenes: {
    name: "Behind the Scenes",
    description: "Rehearsals, studio, hangouts",
    tags: [
      "bandpractice", "rehearsal", "studiolife", "recordingstudio",
      "behindthescenes", "bts", "bandlife", "musicianlife",
      "greenroom", "backstage", "loadingin", "soundcheck",
      "indiebandlife", "diymusic", "bandmembers"
    ],
    platforms: ["instagram", "tiktok"],
    maxTags: 12,
  },

  // === NEW MUSIC / RELEASES ===
  newRelease: {
    name: "New Release",
    description: "Singles, albums, music videos",
    tags: [
      "newmusic", "newsingle", "newalbum", "outnow", "musicvideo",
      "indiemusic", "indierock", "alternativerock", "newmusicfriday",
      "streamingmusic", "spotifyplaylist", "musicrelease",
      "originalmusic", "unsigned", "emergingartist"
    ],
    platforms: ["instagram", "tiktok", "twitter"],
    maxTags: 15,
  },

  // === MERCHANDISE ===
  merch: {
    name: "Merchandise",
    description: "T-shirts, stickers, vinyl",
    tags: [
      "bandmerch", "merch", "bandtee", "bandsshirts", "supportlocalbands",
      "vinylrecords", "vinyladdict", "recordcollection",
      "shopsmall", "indiemerch", "musicmerch", "merchlife"
    ],
    platforms: ["instagram"],
    maxTags: 10,
  },

  // === FUNNY / MEME CONTENT ===
  funny: {
    name: "Funny Content",
    description: "Memes, jokes, comedy content",
    tags: [
      "bandmemes", "musicmemes", "musichumor", "bandhumor",
      "rockhumor", "musicianproblems", "bandproblems",
      "funnymusic", "comedyband", "weirdmusic", "strangemusic"
    ],
    platforms: ["instagram", "tiktok"],
    maxTags: 10,
  },

  // === REELS / SHORT VIDEO ===
  reels: {
    name: "Reels/Shorts",
    description: "For vertical video content",
    tags: [
      "reels", "reelsinstagram", "reelsvideo", "reelsviral",
      "musicreels", "bandreels", "livemusicreels",
      "viralreels", "explorepage", "trending", "fyp"
    ],
    platforms: ["instagram", "tiktok"],
    maxTags: 10,
  },

  // === COLORADO LOCAL ===
  coloradoLocal: {
    name: "Colorado Local",
    description: "Colorado-specific tags for local reach",
    tags: [
      "coloradomusic", "coloradoband", "coloradolivemusic",
      "denvermusic", "denvermusicscene", "denverbands",
      "fortcollinsmusic", "fortcollinsbands", "focomusic",
      "bouldermusic", "coloradospringsmusic",
      "303music", "5280music", "milehighmusic"
    ],
    platforms: ["instagram"],
    maxTags: 10,
  },

  // === PUNK / ROCK SCENE ===
  punkRock: {
    name: "Punk/Rock Scene",
    description: "Genre-specific punk and rock tags",
    tags: [
      "punkrock", "punk", "punkband", "punkmusic",
      "garagerock", "garagepunk", "rocknroll", "rockmusic",
      "alternativerock", "indierock", "surfrock", "psychobilly",
      "diypunk", "undergroundmusic", "undergroundrock"
    ],
    platforms: ["instagram", "tiktok"],
    maxTags: 12,
  },

  // === ENGAGEMENT / COMMUNITY ===
  engagement: {
    name: "Community Engagement",
    description: "For posts asking for interaction",
    tags: [
      "supportlocalmusic", "supportlocalbands", "supportindiemusic",
      "musiccommunity", "musicfamily", "bandcommunity",
      "indiecommunity", "followforfollow", "likeforlike",
      "commentbelow", "shareyourmusic"
    ],
    platforms: ["instagram"],
    maxTags: 8,
  },

  // === VENUE-SPECIFIC ===
  venues: {
    name: "Colorado Venues",
    description: "Tag venues for cross-promotion",
    venueTags: {
      "The Coast": ["thecoastfoco", "focomusic"],
      "Tennyson's Tap": ["tennysonstap", "denverbars"],
      "Blast N Bowl": ["blastnbowl", "bowlingalley"],
      "Herman's Hideaway": ["hermanshideaway", "denvervenue"],
      "The Aggie Theatre": ["aggietheatre", "fortcollins"],
      "Globe Hall": ["globehall", "denvermusic"],
      "Lost Lake": ["lostlakedenver", "denvershows"],
    },
    platforms: ["instagram"],
  },
};

// ============================================================
// BANNED / SHADOWBANNED HASHTAGS
// ============================================================
// These tags are known to cause reduced reach

export const BANNED_HASHTAGS = [
  "adulting", "alone", "armparty", "beautyblogger", "besties",
  "bikinibody", "boho", "brain", "costumes", "curvy", "date",
  "dating", "desk", "direct", "dm", "domination", "elvis",
  "elevator", "eggplant", "edm", "easter", "fitnessgirl",
  "followforfollow", "f4f", "gloves", "graffiti", "happythanksgiving",
  "hardworkpaysoff", "humpday", "hustler", "ice", "instababy",
  "italiano", "kansas", "killingit", "kissing", "likeforlike",
  "l4l", "lulu", "master", "mileycyrus", "milf", "models",
  "mustfollow", "nasty", "newyears", "newyearsday", "nudity",
  "overnight", "parties", "photography", "popular", "prettygirl",
  "pushups", "rate", "ravens", "saltwater", "selfharm", "single",
  "singlelife", "skateboarding", "skype", "snap", "snapchat",
  "snowstorm", "sopretty", "stranger", "streetphoto", "stud",
  "swole", "tag4like", "tanlines", "teen", "teens", "thought",
  "todayimwearing", "treasureyourself", "underage", "valentinesday",
  "workflow", "wtf", "woman", "women"
];

// ============================================================
// HELPER FUNCTIONS
// ============================================================

// Get hashtags for a content type
export function getHashtags(setName, options = {}) {
  const set = HASHTAG_SETS[setName];
  if (!set) return [];
  
  let tags = [...set.tags];
  
  // Add venue-specific tags if provided
  if (options.venue && HASHTAG_SETS.venues.venueTags[options.venue]) {
    tags = [...tags, ...HASHTAG_SETS.venues.venueTags[options.venue]];
  }
  
  // Add Colorado local tags if specified
  if (options.includeLocal) {
    tags = [...tags, ...HASHTAG_SETS.coloradoLocal.tags.slice(0, 5)];
  }
  
  // Filter out any banned hashtags
  tags = tags.filter(tag => !BANNED_HASHTAGS.includes(tag.toLowerCase()));
  
  // Limit to max
  const max = options.max || set.maxTags || 15;
  tags = tags.slice(0, max);
  
  // Format for platform
  if (options.format === 'string') {
    return tags.map(t => `#${t}`).join(' ');
  }
  
  return tags;
}

// Check if a hashtag is banned
export function isBannedHashtag(tag) {
  const cleanTag = tag.replace('#', '').toLowerCase();
  return BANNED_HASHTAGS.includes(cleanTag);
}

// Analyze hashtags in a caption
export function analyzeHashtags(caption) {
  const hashtagRegex = /#(\w+)/g;
  const found = [...caption.matchAll(hashtagRegex)].map(m => m[1].toLowerCase());
  
  const banned = found.filter(t => BANNED_HASHTAGS.includes(t));
  const valid = found.filter(t => !BANNED_HASHTAGS.includes(t));
  
  return {
    total: found.length,
    valid: valid.length,
    banned: banned,
    hasBanned: banned.length > 0,
    recommendation: found.length > 30 
      ? "Too many hashtags (max 30 for IG)" 
      : found.length < 5 
        ? "Add more hashtags for reach" 
        : "Good hashtag count",
  };
}

// Suggest hashtags based on caption content
export function suggestHashtags(caption, options = {}) {
  const lowerCaption = caption.toLowerCase();
  const suggestions = [];
  
  // Detect content type from keywords
  if (lowerCaption.includes('show') || lowerCaption.includes('playing') || lowerCaption.includes('tonight')) {
    suggestions.push(...getHashtags('showAnnouncement', { max: 8 }));
  }
  if (lowerCaption.includes('last night') || lowerCaption.includes('thank') || lowerCaption.includes('amazing crowd')) {
    suggestions.push(...getHashtags('showRecap', { max: 8 }));
  }
  if (lowerCaption.includes('new') && (lowerCaption.includes('single') || lowerCaption.includes('song') || lowerCaption.includes('album'))) {
    suggestions.push(...getHashtags('newRelease', { max: 8 }));
  }
  if (lowerCaption.includes('practice') || lowerCaption.includes('rehearsal') || lowerCaption.includes('studio')) {
    suggestions.push(...getHashtags('behindTheScenes', { max: 8 }));
  }
  if (lowerCaption.includes('merch') || lowerCaption.includes('shirt') || lowerCaption.includes('vinyl')) {
    suggestions.push(...getHashtags('merch', { max: 8 }));
  }
  
  // Always add some genre tags
  suggestions.push(...getHashtags('punkRock', { max: 5 }));
  
  // Always add Colorado local
  if (options.includeLocal !== false) {
    suggestions.push(...getHashtags('coloradoLocal', { max: 5 }));
  }
  
  // Dedupe and limit
  const unique = [...new Set(suggestions)];
  return unique.slice(0, options.max || 20);
}

// Format hashtags for first comment (IG best practice)
export function formatForFirstComment(tags) {
  return `.\n.\n.\n${tags.map(t => `#${t}`).join(' ')}`;
}

export default {
  HASHTAG_SETS,
  BANNED_HASHTAGS,
  getHashtags,
  isBannedHashtag,
  analyzeHashtags,
  suggestHashtags,
  formatForFirstComment,
};
