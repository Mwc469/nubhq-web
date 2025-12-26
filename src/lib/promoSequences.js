// NubHQ Show Promo Sequences
// Automated content sequences for show promotion
// The key to filling shows: multiple touchpoints over time

// ============================================================
// PROMO SEQUENCE TIMELINE
// ============================================================
// T-14: Early announcement (build anticipation)
// T-7:  Week-out reminder (FOMO starts)
// T-3:  Midweek push (planning time)
// T-1:  Day before (urgency)
// T-0:  Day of (FINAL CALL)
// T+1:  Thank you / recap (social proof for next show)

export const PROMO_SEQUENCE = {
  // === T-14: TWO WEEKS OUT ===
  t14: {
    label: "T-14 (2 weeks out)",
    timing: -14,
    purpose: "Build anticipation, early bird crowd",
    contentType: "announcement",
    templates: [
      {
        platform: "instagram",
        format: "feed",
        caption: `Ahoy Nublets! 🦦 We have a steamy announcement that will surely tantalize your britches!

We're playing {{venue}} on {{date}} with {{other_bands}}!

Mark your calendars, tell your friends, and prepare for chaos. This one's gonna be juicy! 🔥

Tix link in bio!
#livemusic #coloradomusic #{{city}}music`,
        notes: "Use high-quality show poster or band photo",
      },
      {
        platform: "instagram",
        format: "story",
        caption: "🚨 SHOW ANNOUNCEMENT 🚨\n{{date}} @ {{venue}}\nSave the date ya filthy animals!",
        notes: "Add countdown sticker",
      },
    ],
    aiPrompt: "Write an excited, NUB-style announcement for an upcoming show. Make it feel like a big deal. Include venue, date, and other bands. Use NUB vocabulary like 'Nublets', 'steamy', 'tantalize'.",
  },

  // === T-7: ONE WEEK OUT ===
  t7: {
    label: "T-7 (1 week out)",
    timing: -7,
    purpose: "FOMO building, ticket push",
    contentType: "reminder",
    templates: [
      {
        platform: "instagram",
        format: "feed",
        caption: `ONE WEEK until we bring the chaos to {{venue}}! 🔥

{{date}} with {{other_bands}}

Tickets are moving, ya hooligans. Don't be the one friend who missed it!

Link in bio to secure your spot. LET'S GOOOO! 🦦`,
        notes: "Consider carousel with multiple show photos",
      },
      {
        platform: "instagram",
        format: "reel",
        caption: "1 WEEK OUT! Who's coming to {{venue}}?! 🔥 {{date}}",
        notes: "Quick 15-30s hype video with live footage",
      },
      {
        platform: "instagram",
        format: "story",
        caption: "1 WEEK! 📅\n{{venue}}\nWho's in?! 🙋",
        notes: "Add poll: 'Coming to the show?' Yes/Duh",
      },
    ],
    aiPrompt: "Write a one-week-out reminder that creates urgency without being pushy. Mention it's getting close, encourage ticket buying. Use NUB energy.",
  },

  // === T-3: MIDWEEK PUSH ===
  t3: {
    label: "T-3 (3 days out)",
    timing: -3,
    purpose: "Catch the planners, build excitement",
    contentType: "hype",
    templates: [
      {
        platform: "instagram",
        format: "story",
        caption: "THIS WEEK! 🔥\n{{day}} @ {{venue}}\nWho's ready to get weird?!",
        notes: "Add question sticker: 'What song should we play?'",
      },
      {
        platform: "instagram",
        format: "feed",
        caption: `{{day}} is gonna hit different. 🦦

We're bringing the full chaos to {{venue}} and you need to be there.

Playing with the absolute legends {{other_bands}} - this lineup is STACKED.

See you there, ya filthy animals! 🔥`,
        notes: "Behind-the-scenes rehearsal shot works well",
      },
    ],
    aiPrompt: "Write a 3-days-out hype post. Build excitement, mention the other bands, make people feel like they'll miss something special if they don't come.",
  },

  // === T-1: DAY BEFORE ===
  t1: {
    label: "T-1 (day before)",
    timing: -1,
    purpose: "Final reminder, urgency",
    contentType: "urgency",
    templates: [
      {
        platform: "instagram",
        format: "story",
        caption: "TOMORROW! 🚨\n{{venue}}\nDoors @ {{time}}\nLast chance for cheap tix!",
        notes: "Multiple stories throughout the day",
      },
      {
        platform: "instagram",
        format: "feed",
        caption: `TOMORROW! The chaos arrives at {{venue}}. 🔥

Doors: {{time}}
Tix: Link in bio (or at the door if you're feeling dangerous)

This is your final warning, Nublets. Don't say we didn't tell you! 🦦

See you there! 💀🎸`,
        notes: "High energy photo, maybe from previous show",
      },
    ],
    aiPrompt: "Write a day-before post with urgency. It's happening TOMORROW. Make people feel like this is their last chance to get tickets. NUB energy at maximum.",
  },

  // === T-0: DAY OF ===
  t0: {
    label: "T-0 (day of)",
    timing: 0,
    purpose: "FINAL CALL, directions, hype",
    contentType: "dayOf",
    templates: [
      {
        platform: "instagram",
        format: "story",
        sequence: [
          { time: "morning", caption: "TODAY IS THE DAY! 🔥 {{venue}} tonight!" },
          { time: "afternoon", caption: "Getting ready to bring the weird! See you tonight at {{venue}}!" },
          { time: "before", caption: "Doors in 2 hours! {{venue}} - {{address}}\nLET'S GOOOO!" },
          { time: "doors", caption: "DOORS ARE OPEN! Get in here, Nublets! 🦦🔥" },
        ],
        notes: "Post stories throughout the day building momentum",
      },
      {
        platform: "instagram",
        format: "feed",
        caption: `TONIGHT! 🔥🔥🔥

{{venue}}
Doors: {{time}}
With: {{other_bands}}

Last chance to see us before [whatever's next]. Get your ass down to {{venue}} or else! 🦦

See you there, ya filthy animals!`,
        notes: "Post early-mid day for visibility",
      },
    ],
    aiPrompt: "Write a day-of-show post with maximum energy. THIS IS HAPPENING TONIGHT. Include venue, time, address. Make it feel like the can't-miss event of the week.",
  },

  // === T+1: DAY AFTER ===
  t1_after: {
    label: "T+1 (day after)",
    timing: 1,
    purpose: "Thank you, social proof, recap",
    contentType: "recap",
    templates: [
      {
        platform: "instagram",
        format: "feed",
        caption: `Last night was UNREAL. 🔥

{{venue}} absolutely brought it. You Nublets showed up and showed OUT!

Massive shoutout to {{other_bands}} for an incredible night.

If you missed it... well, there's always next time. But seriously, you missed something special. 🦦

More shows coming soon. Stay tuned, ya filthy animals! 

📸: @photographer (if applicable)`,
        notes: "Best photo from the show, crowd shots work great",
      },
      {
        platform: "instagram",
        format: "carousel",
        caption: `Photo dump from last night at {{venue}}! 🔥

What a night! Thanks to everyone who came out. You Nublets are the best fans in the game. 🦦

Catch us next at [next show date/venue]!`,
        notes: "5-10 best photos from the night",
      },
      {
        platform: "instagram",
        format: "reel",
        caption: "Last night was chaos in the best way 🔥 {{venue}} thank you!",
        notes: "Quick 30-60s highlight reel from the show",
      },
    ],
    aiPrompt: "Write a thank-you/recap post for the day after a show. Express genuine gratitude, highlight memorable moments, shout out the other bands and venue. Build social proof for future shows.",
  },
};

// ============================================================
// CONTENT MIX RECOMMENDATIONS
// ============================================================

export const PROMO_MIX = {
  recommended: {
    t14: { feed: 1, story: 1, reel: 0 },
    t7: { feed: 1, story: 2, reel: 1 },
    t3: { feed: 0, story: 2, reel: 0 },
    t1: { feed: 1, story: 3, reel: 0 },
    t0: { feed: 1, story: 5, reel: 1 },
    t1_after: { feed: 1, story: 2, reel: 1 },
  },
  totalPosts: 21, // Minimum for full show promotion
};

// ============================================================
// HELPER FUNCTIONS
// ============================================================

// Generate a promo sequence for a show
export function generatePromoSequence(showData) {
  const { venue, date, time, otherBands, city, address } = showData;
  const showDate = new Date(date);
  
  const sequence = [];
  
  Object.entries(PROMO_SEQUENCE).forEach(([key, phase]) => {
    const contentDate = new Date(showDate);
    contentDate.setDate(contentDate.getDate() + phase.timing);
    
    phase.templates.forEach((template, idx) => {
      sequence.push({
        id: `${key}_${idx}`,
        phase: key,
        label: phase.label,
        scheduledDate: contentDate.toISOString().split('T')[0],
        scheduledTime: key === 't0' ? '12:00' : '17:00', // Noon for day-of, 5pm otherwise
        platform: template.platform,
        format: template.format,
        caption: fillTemplate(template.caption, showData),
        notes: template.notes,
        aiPrompt: phase.aiPrompt,
        purpose: phase.purpose,
        status: 'pending',
      });
    });
  });
  
  return sequence.sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate));
}

// Fill in template placeholders
function fillTemplate(template, data) {
  return template
    .replace(/\{\{venue\}\}/g, data.venue || '[Venue]')
    .replace(/\{\{date\}\}/g, formatDate(data.date))
    .replace(/\{\{day\}\}/g, formatDay(data.date))
    .replace(/\{\{time\}\}/g, data.time || '[Time TBD]')
    .replace(/\{\{other_bands\}\}/g, formatBands(data.otherBands))
    .replace(/\{\{city\}\}/g, data.city || 'Denver')
    .replace(/\{\{address\}\}/g, data.address || '');
}

function formatDate(dateStr) {
  if (!dateStr) return '[Date TBD]';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric' 
  });
}

function formatDay(dateStr) {
  if (!dateStr) return '[Day]';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { weekday: 'long' });
}

function formatBands(bands) {
  if (!bands || bands.length === 0) return 'some incredible bands';
  if (typeof bands === 'string') return bands;
  if (bands.length === 1) return bands[0];
  if (bands.length === 2) return `${bands[0]} and ${bands[1]}`;
  return `${bands.slice(0, -1).join(', ')}, and ${bands[bands.length - 1]}`;
}

// Get content due for a specific date
export function getContentDueToday(sequences, today = new Date()) {
  const todayStr = today.toISOString().split('T')[0];
  return sequences.filter(item => item.scheduledDate === todayStr);
}

// Get upcoming content for next N days
export function getUpcomingContent(sequences, days = 7) {
  const today = new Date();
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + days);
  
  return sequences.filter(item => {
    const itemDate = new Date(item.scheduledDate);
    return itemDate >= today && itemDate <= futureDate;
  });
}

// Calculate promo coverage score
export function calculatePromoCoverage(sequences, showDate) {
  const phases = Object.keys(PROMO_SEQUENCE);
  const coveredPhases = new Set(sequences.map(s => s.phase));
  
  return {
    score: (coveredPhases.size / phases.length) * 100,
    covered: Array.from(coveredPhases),
    missing: phases.filter(p => !coveredPhases.has(p)),
    recommendation: coveredPhases.size < phases.length 
      ? `Missing ${phases.filter(p => !coveredPhases.has(p)).join(', ')} content`
      : 'Full coverage! 🔥',
  };
}

export default {
  PROMO_SEQUENCE,
  PROMO_MIX,
  generatePromoSequence,
  getContentDueToday,
  getUpcomingContent,
  calculatePromoCoverage,
};
