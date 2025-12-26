/**
 * CosmicBackground - Animated cosmic/nebula background
 * Used throughout the portal experience for brand immersion
 */
import { useMemo } from 'react';
import { COSMIC_GRADIENTS } from '../../lib/brandAssets';

const STAR_COUNT = 50;

function generateStars(count) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    size: Math.random() * 3 + 1,
    delay: Math.random() * 2,
    duration: Math.random() * 2 + 1,
  }));
}

export default function CosmicBackground({
  variant = 'subtle',
  animated = true,
  overlay = true,
  children,
  className = '',
}) {
  const stars = useMemo(() => generateStars(variant === 'portal' ? STAR_COUNT : 20), [variant]);

  const gradientStyle = {
    portal: {
      background: COSMIC_GRADIENTS.intense,
    },
    subtle: {
      background: COSMIC_GRADIENTS.subtle,
    },
    intense: {
      background: COSMIC_GRADIENTS.portal,
    },
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Base gradient layer */}
      <div
        className={`absolute inset-0 ${animated ? 'animate-cosmic-gradient' : ''}`}
        style={gradientStyle[variant]}
      />

      {/* Nebula clouds - only for portal/intense */}
      {(variant === 'portal' || variant === 'intense') && (
        <>
          <div
            className="absolute inset-0 opacity-30 animate-nebula-pulse"
            style={{
              background: 'radial-gradient(ellipse at 20% 30%, rgba(155, 48, 255, 0.4) 0%, transparent 50%)',
            }}
          />
          <div
            className="absolute inset-0 opacity-30 animate-nebula-pulse"
            style={{
              background: 'radial-gradient(ellipse at 80% 70%, rgba(233, 30, 140, 0.4) 0%, transparent 50%)',
              animationDelay: '4s',
            }}
          />
          <div
            className="absolute inset-0 opacity-20 animate-nebula-pulse"
            style={{
              background: 'radial-gradient(ellipse at 50% 50%, rgba(0, 212, 212, 0.3) 0%, transparent 40%)',
              animationDelay: '2s',
            }}
          />
        </>
      )}

      {/* Stars */}
      <div className="absolute inset-0 pointer-events-none">
        {stars.map((star) => (
          <div
            key={star.id}
            className={`absolute rounded-full bg-white ${animated ? 'animate-star-twinkle' : ''}`}
            style={{
              left: star.left,
              top: star.top,
              width: `${star.size}px`,
              height: `${star.size}px`,
              animationDelay: `${star.delay}s`,
              animationDuration: `${star.duration}s`,
              boxShadow: variant === 'portal'
                ? `0 0 ${star.size * 2}px ${star.size}px rgba(255, 255, 255, 0.3)`
                : 'none',
            }}
          />
        ))}
      </div>

      {/* Floating particles - only for portal */}
      {variant === 'portal' && animated && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-float-particle opacity-60"
              style={{
                left: `${(i * 12.5) + Math.random() * 10}%`,
                animationDelay: `${i * 2.5}s`,
                animationDuration: `${15 + Math.random() * 10}s`,
              }}
            >
              <div
                className="w-1 h-1 rounded-full"
                style={{
                  background: i % 2 === 0 ? '#E91E8C' : '#9B30FF',
                  boxShadow: `0 0 6px 2px ${i % 2 === 0 ? '#E91E8C' : '#9B30FF'}`,
                }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Dark overlay for readability */}
      {overlay && (
        <div
          className="absolute inset-0"
          style={{
            background: variant === 'portal'
              ? 'radial-gradient(ellipse at center, transparent 0%, rgba(0, 0, 0, 0.3) 100%)'
              : 'transparent',
          }}
        />
      )}

      {/* Content */}
      {children && (
        <div className="relative z-10">
          {children}
        </div>
      )}
    </div>
  );
}

// Smaller, lighter version for use as page backgrounds
export function CosmicGlow({ className = '' }) {
  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      <div
        className="absolute -top-1/2 -left-1/4 w-full h-full opacity-10 animate-nebula-pulse"
        style={{
          background: 'radial-gradient(ellipse, rgba(155, 48, 255, 0.5) 0%, transparent 70%)',
        }}
      />
      <div
        className="absolute -bottom-1/2 -right-1/4 w-full h-full opacity-10 animate-nebula-pulse"
        style={{
          background: 'radial-gradient(ellipse, rgba(233, 30, 140, 0.5) 0%, transparent 70%)',
          animationDelay: '4s',
        }}
      />
    </div>
  );
}
