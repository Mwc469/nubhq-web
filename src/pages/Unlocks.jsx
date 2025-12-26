/**
 * Unlocks Gallery - View and equip your unlocked skins, themes, and sounds
 */
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Check, Sparkles, Volume2, Palette, Crown } from 'lucide-react';
import { cn } from '../lib/utils';
import { useTheme } from '../contexts/ThemeContext';
import { WALRUS_SKINS, getAllSkinsWithStatus, getEquippedSkin, equipSkin } from '../lib/walrusSkins';
import { UNLOCKABLE_THEMES, getAllThemesWithStatus, getEquippedTheme, equipTheme } from '../lib/themes';
import { SOUND_PACKS, getAllSoundPacksWithStatus, getEquippedSoundPack, equipSoundPack } from '../lib/soundSystem';
import { playSound } from '../lib/soundSystem';
import { LEVELS } from '../lib/gamification';

// Get player stats
function getPlayerStats() {
  try {
    const stored = localStorage.getItem('nub_player_stats');
    return stored ? JSON.parse(stored) : { xp: 0, level: 1 };
  } catch {
    return { xp: 0, level: 1 };
  }
}

function getLevelInfo(xp) {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].minXp) return LEVELS[i];
  }
  return LEVELS[0];
}

const RARITY_COLORS = {
  common: 'from-gray-400 to-gray-500',
  rare: 'from-blue-400 to-cyan-500',
  epic: 'from-purple-400 to-pink-500',
  legendary: 'from-yellow-400 to-orange-500',
};

const RARITY_GLOW = {
  common: '',
  rare: 'shadow-blue-500/30',
  epic: 'shadow-purple-500/30',
  legendary: 'shadow-yellow-500/50',
};

const TABS = [
  { id: 'skins', label: 'Walrus Skins', icon: Crown },
  { id: 'themes', label: 'Color Themes', icon: Palette },
  { id: 'sounds', label: 'Sound Packs', icon: Volume2 },
];

export default function Unlocks() {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const [activeTab, setActiveTab] = useState('skins');
  const [equippedSkin, setEquippedSkin] = useState(getEquippedSkin().id);
  const [equippedTheme, setEquippedTheme] = useState(getEquippedTheme().id);
  const [equippedSound, setEquippedSound] = useState(getEquippedSoundPack().id);

  const playerStats = useMemo(() => getPlayerStats(), []);
  const levelInfo = useMemo(() => getLevelInfo(playerStats.xp), [playerStats.xp]);
  const level = levelInfo.level;

  const skins = useMemo(() => getAllSkinsWithStatus(level), [level]);
  const themes = useMemo(() => getAllThemesWithStatus(level), [level]);
  const sounds = useMemo(() => getAllSoundPacksWithStatus(level), [level]);

  const handleEquipSkin = (skinId) => {
    if (equipSkin(skinId)) {
      setEquippedSkin(skinId);
      playSound('success');
    }
  };

  const handleEquipTheme = (themeId) => {
    if (equipTheme(themeId)) {
      setEquippedTheme(themeId);
      playSound('success');
    }
  };

  const handleEquipSound = (soundId) => {
    if (equipSoundPack(soundId)) {
      setEquippedSound(soundId);
      playSound('levelUp');
    }
  };

  const unlockedCounts = {
    skins: skins.filter(s => s.unlocked).length,
    themes: themes.filter(t => t.unlocked).length,
    sounds: sounds.filter(s => s.unlocked).length,
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className={cn(
          'text-3xl font-black mb-2',
          isLight ? 'text-gray-900' : 'text-white'
        )}>
          Unlocks Gallery
        </h1>
        <p className={cn(
          'text-sm',
          isLight ? 'text-gray-500' : 'text-white/60'
        )}>
          Level {level} - {unlockedCounts.skins + unlockedCounts.themes + unlockedCounts.sounds} items unlocked
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {TABS.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                playSound('tap');
              }}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 rounded-xl border-3 font-bold transition-all whitespace-nowrap',
                isActive
                  ? 'bg-neon-pink text-white border-black shadow-[4px_4px_0_#000]'
                  : isLight
                  ? 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                  : 'bg-white/5 text-white/70 border-white/10 hover:border-white/20'
              )}
            >
              <Icon size={18} />
              {tab.label}
              <span className={cn(
                'text-xs px-1.5 py-0.5 rounded-full',
                isActive ? 'bg-white/20' : 'bg-neon-pink/20 text-neon-pink'
              )}>
                {unlockedCounts[tab.id]}/{tab.id === 'skins' ? skins.length : tab.id === 'themes' ? themes.length : sounds.length}
              </span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {activeTab === 'skins' && skins.map(skin => (
            <UnlockCard
              key={skin.id}
              item={skin}
              isEquipped={equippedSkin === skin.id}
              onEquip={() => handleEquipSkin(skin.id)}
              isLight={isLight}
              type="skin"
            />
          ))}

          {activeTab === 'themes' && themes.map(theme => (
            <UnlockCard
              key={theme.id}
              item={theme}
              isEquipped={equippedTheme === theme.id}
              onEquip={() => handleEquipTheme(theme.id)}
              isLight={isLight}
              type="theme"
            />
          ))}

          {activeTab === 'sounds' && sounds.map(sound => (
            <UnlockCard
              key={sound.id}
              item={sound}
              isEquipped={equippedSound === sound.id}
              onEquip={() => handleEquipSound(sound.id)}
              isLight={isLight}
              type="sound"
            />
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Level Progress Hint */}
      <div className={cn(
        'mt-8 p-4 rounded-xl border-2',
        isLight ? 'bg-gray-50 border-gray-200' : 'bg-white/5 border-white/10'
      )}>
        <p className={cn(
          'text-sm text-center',
          isLight ? 'text-gray-500' : 'text-white/60'
        )}>
          Keep leveling up to unlock more! Current level: <span className="font-bold text-neon-pink">{level}</span>
        </p>
      </div>
    </div>
  );
}

function UnlockCard({ item, isEquipped, onEquip, isLight, type }) {
  const isLocked = !item.unlocked;

  // Get unlock requirement text
  const getUnlockText = () => {
    if (item.unlockLevel > 0) {
      return `Reach Level ${item.unlockLevel}`;
    }
    if (item.unlockCondition) {
      switch (item.unlockCondition) {
        case 'konami_code':
          return 'Enter the Konami Code';
        case 'lucky_event':
          return 'Trigger a Lucky Event';
        case 'night_grinder':
          return 'Complete 20 items after midnight';
        case 'walrus_10_taps':
          return 'Tap the walrus 10 times';
        default:
          return 'Hidden unlock condition';
      }
    }
    return 'Unknown';
  };

  return (
    <motion.div
      whileHover={!isLocked ? { scale: 1.02 } : {}}
      whileTap={!isLocked ? { scale: 0.98 } : {}}
      className={cn(
        'relative p-4 rounded-xl border-3 transition-all',
        isLocked
          ? isLight
            ? 'bg-gray-100 border-gray-200 opacity-60'
            : 'bg-white/5 border-white/10 opacity-50'
          : isEquipped
          ? `bg-gradient-to-br ${RARITY_COLORS[item.rarity]} border-black shadow-lg ${RARITY_GLOW[item.rarity]}`
          : isLight
          ? 'bg-white border-gray-200 hover:border-gray-300 cursor-pointer'
          : 'bg-white/10 border-white/20 hover:border-white/30 cursor-pointer'
      )}
      onClick={() => !isLocked && !isEquipped && onEquip()}
    >
      {/* Rarity Badge */}
      <div className={cn(
        'absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase',
        `bg-gradient-to-r ${RARITY_COLORS[item.rarity]} text-white`
      )}>
        {item.rarity}
      </div>

      {/* Lock Icon for Locked Items */}
      {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="p-3 rounded-full bg-black/50">
            <Lock className="w-6 h-6 text-white" />
          </div>
        </div>
      )}

      {/* Preview */}
      <div className="text-center mb-3">
        {type === 'skin' && (
          <div className="text-4xl">{item.preview}</div>
        )}
        {type === 'theme' && (
          <div className={cn(
            'w-16 h-16 mx-auto rounded-xl bg-gradient-to-br',
            item.preview
          )} />
        )}
        {type === 'sound' && (
          <div className="text-4xl">{item.preview}</div>
        )}
      </div>

      {/* Name & Description */}
      <h3 className={cn(
        'font-bold text-center mb-1',
        isEquipped ? 'text-white' : isLight ? 'text-gray-900' : 'text-white'
      )}>
        {item.name}
      </h3>
      <p className={cn(
        'text-xs text-center mb-3',
        isEquipped ? 'text-white/80' : isLight ? 'text-gray-500' : 'text-white/60'
      )}>
        {isLocked ? getUnlockText() : item.description}
      </p>

      {/* Equipped Badge or Equip Button */}
      {!isLocked && (
        <div className="text-center">
          {isEquipped ? (
            <div className="flex items-center justify-center gap-1 text-white text-sm font-bold">
              <Check size={16} />
              Equipped
            </div>
          ) : (
            <button
              className={cn(
                'px-4 py-1.5 rounded-lg text-sm font-bold transition-colors',
                isLight
                  ? 'bg-neon-pink text-white hover:bg-neon-pink/90'
                  : 'bg-white/20 text-white hover:bg-white/30'
              )}
            >
              Equip
            </button>
          )}
        </div>
      )}

      {/* Sparkle Effect for Legendary */}
      {item.rarity === 'legendary' && !isLocked && (
        <Sparkles className="absolute top-2 left-2 w-4 h-4 text-yellow-400 animate-pulse" />
      )}
    </motion.div>
  );
}
