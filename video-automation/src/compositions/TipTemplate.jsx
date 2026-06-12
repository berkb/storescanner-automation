import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { useMemo } from 'react';
import { CTA_DEFAULTS } from '../data/videos.js';

// ─── Brand ────────────────────────────────────────────────────────────────────
const B = {
  bg:          '#060A14',
  bgCard:      '#0D1526',
  accent:      '#3B82F6',
  accentLight: '#60A5FA',
  accentGlow:  '#3B82F633',
  text:        '#F8FAFC',
  muted:       '#94A3B8',
  mutedDark:   '#1E3A5F',
  border:      '#1E3A5F',
};

const FPS = 30;
const FADE = 18; // 0.6s transition

// ─── Total frame calculator ───────────────────────────────────────────────────
export function getTipTotalFrames(screens) {
  return screens.reduce((sum, s) => sum + s.duration * FPS, 0);
}

// ─── Background ───────────────────────────────────────────────────────────────
const Background = ({ frame }) => {
  const gridOpacity = interpolate(frame, [0, 30], [0, 0.04], { extrapolateRight: 'clamp' });
  const glowOpacity = interpolate(frame, [0, 40], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <>
      <AbsoluteFill style={{ background: B.bg }} />
      {/* Subtle top-left glow */}
      <AbsoluteFill style={{
        opacity: glowOpacity,
        background: `radial-gradient(ellipse at 20% 15%, ${B.accentGlow} 0%, transparent 60%)`,
      }} />
      {/* Dot grid */}
      <AbsoluteFill style={{
        opacity: gridOpacity,
        backgroundImage: `radial-gradient(circle, ${B.accent} 1px, transparent 1px)`,
        backgroundSize: '60px 60px',
      }} />
    </>
  );
};

// ─── Top bar ──────────────────────────────────────────────────────────────────
const TopBar = ({ tipNumber, category, frame }) => {
  const opacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });
  const y = interpolate(frame, [0, 20], [-20, 0], { extrapolateRight: 'clamp' });

  return (
    <div style={{
      position: 'absolute',
      top: 96,
      left: 110,
      right: 110,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      opacity,
      transform: `translateY(${y}px)`,
    }}>
      {/* Logo + app name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <Img
          src={staticFile('app-logo.png')}
          style={{ width: 48, height: 48, objectFit: 'cover' }}
        />
        <span style={{
          fontSize: 26,
          fontWeight: 700,
          color: B.muted,
          letterSpacing: -0.3,
        }}>Checkpoint: Store Scanner</span>
      </div>

      {/* Tip badge */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
      }}>
        <div style={{
          background: B.mutedDark,
          borderRadius: 20,
          padding: '10px 24px',
          fontSize: 26,
          fontWeight: 700,
          color: B.accentLight,
          letterSpacing: 0.5,
          textTransform: 'uppercase',
        }}>fact</div>
        <div style={{
          background: B.accent,
          borderRadius: 20,
          padding: '10px 26px',
          fontSize: 26,
          fontWeight: 800,
          color: '#fff',
          letterSpacing: 0.5,
        }}>#{String(tipNumber).padStart(3, '0')}</div>
      </div>
    </div>
  );
};

// ─── Screen: Hook ─────────────────────────────────────────────────────────────
const HookScreen = ({ hook, tipNumber, category, localFrame, fps }) => {
  const lineWidth = interpolate(localFrame, [8, 35], [0, 140], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const textOpacity = interpolate(localFrame, [5, 22], [0, 1], { extrapolateRight: 'clamp' });
  const textY = interpolate(localFrame, [5, 22], [40, 0], { extrapolateRight: 'clamp' });
  const labelOpacity = interpolate(localFrame, [22, 36], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: '200px 80px 100px',
    }}>
      {/* Accent line */}
      <div style={{
        width: lineWidth,
        height: 5,
        background: `linear-gradient(90deg, ${B.accent}, ${B.accentLight})`,
        borderRadius: 3,
        marginBottom: 36,
        boxShadow: `0 0 16px ${B.accent}88`,
      }} />

      {/* Hook text */}
      <div style={{
        opacity: textOpacity,
        transform: `translateY(${textY}px)`,
        fontSize: 72,
        fontWeight: 900,
        color: B.text,
        lineHeight: 1.1,
        letterSpacing: -2,
      }}>{hook}</div>

      {/* "Did you know?" label */}
      <div style={{
        opacity: labelOpacity,
        marginTop: 40,
        fontSize: 30,
        fontWeight: 500,
        color: B.muted,
        letterSpacing: 0.3,
      }}>Did you know?</div>
    </AbsoluteFill>
  );
};

// ─── Screen: Body ─────────────────────────────────────────────────────────────
const BodyScreen = ({ body, localFrame, fps }) => {
  const cardScale = spring({
    frame: localFrame,
    fps,
    config: { damping: 22, stiffness: 180 },
    durationInFrames: 22,
  });
  const cardOpacity = interpolate(localFrame, [0, 14], [0, 1], { extrapolateRight: 'clamp' });
  const cardY = interpolate(
    spring({ frame: localFrame, fps, config: { damping: 22, stiffness: 160 }, durationInFrames: 22 }),
    [0, 1], [50, 0]
  );

  return (
    <AbsoluteFill style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: '200px 80px 100px',
    }}>
      {/* Card */}
      <div style={{
        opacity: cardOpacity,
        transform: `translateY(${cardY}px)`,
        background: B.bgCard,
        border: `1.5px solid ${B.border}`,
        borderRadius: 28,
        padding: '60px 64px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Card glow */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: `linear-gradient(90deg, ${B.accent}, ${B.accentLight})`,
        }} />

        <div style={{
          fontSize: 42,
          fontWeight: 400,
          color: B.text,
          lineHeight: 1.55,
          letterSpacing: -0.4,
        }}>{body}</div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Screen: CTA ──────────────────────────────────────────────────────────────
const CTAScreen = ({ localFrame, fps }) => {
  const bgOpacity = interpolate(localFrame, [0, 25], [0, 1], { extrapolateRight: 'clamp' });
  const contentSpring = spring({
    frame: localFrame - 6,
    fps,
    config: { damping: 20, stiffness: 140 },
    durationInFrames: 28,
  });
  const contentY = interpolate(contentSpring, [0, 1], [60, 0]);
  const contentOpacity = interpolate(localFrame, [4, 20], [0, 1], { extrapolateRight: 'clamp' });
  const buttonGlow = 24 + 12 * Math.sin(localFrame * 0.14);

  return (
    <AbsoluteFill style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '80px 120px',
    }}>
      {/* Background glow */}
      <AbsoluteFill style={{
        opacity: bgOpacity,
        background: `radial-gradient(ellipse at 50% 50%, ${B.accentGlow} 0%, transparent 65%)`,
      }} />

      <div style={{
        opacity: contentOpacity,
        transform: `translateY(${contentY}px)`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 32,
        width: '100%',
        position: 'relative',
      }}>
        {/* Logo */}
        <Img
          src={staticFile('app-logo.png')}
          style={{
            width: 100,
            height: 100,
            borderRadius: 26,
            objectFit: 'cover',
            boxShadow: `0 0 40px ${B.accent}55`,
          }}
        />

        {/* App name */}
        <div style={{
          fontSize: 40,
          fontWeight: 800,
          color: B.text,
          textAlign: 'center',
          lineHeight: 1.2,
          letterSpacing: -0.6,
        }}>{CTA_DEFAULTS.appName}</div>

        {/* Divider */}
        <div style={{
          width: 60,
          height: 3,
          background: `linear-gradient(90deg, ${B.accent}, ${B.accentLight})`,
          borderRadius: 2,
        }} />

        {/* Tagline */}
        <div style={{
          fontSize: 32,
          color: B.muted,
          textAlign: 'center',
          lineHeight: 1.4,
          letterSpacing: -0.2,
        }}>Scan your Shopify store for free.</div>

        {/* Button */}
        <div style={{
          background: B.accent,
          borderRadius: 20,
          padding: '28px 0',
          width: '100%',
          fontSize: 38,
          fontWeight: 800,
          color: '#fff',
          textAlign: 'center',
          boxShadow: `0 0 ${buttonGlow}px ${B.accent}99`,
          letterSpacing: -0.3,
        }}>Install free →</div>

        {/* URL */}
        <div style={{
          fontSize: 24,
          color: B.muted,
          letterSpacing: 0.2,
          opacity: 0.7,
        }}>{CTA_DEFAULTS.url}</div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Main Template ────────────────────────────────────────────────────────────
export const TipTemplate = ({ tip, music }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Build screen sequence with absolute start frames
  const screens = useMemo(() => {
    const list = [
      { type: 'hook', duration: tip.hookDuration ?? 6 },
      { type: 'body', duration: tip.bodyDuration ?? 9 },
      { type: 'cta',  duration: tip.ctaDuration  ?? 6 },
    ];
    let start = 0;
    return list.map(s => {
      const item = { ...s, start, frames: s.duration * FPS };
      start += item.frames;
      return item;
    });
  }, [tip]);

  const currentScreen = screens.findLast?.(s => frame >= s.start) ?? screens[0];
  const localFrame = frame - currentScreen.start;

  // Transition: fade between screens
  const isTransitioning = localFrame < FADE && currentScreen !== screens[0];
  const screenOpacity = isTransitioning
    ? interpolate(localFrame, [0, FADE], [0, 1], { extrapolateRight: 'clamp' })
    : 1;

  return (
    <AbsoluteFill style={{
      overflow: 'hidden',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", sans-serif',
    }}>
      <Background frame={frame} />

      <TopBar tipNumber={tip.id} category={tip.category} frame={frame} />

      <AbsoluteFill style={{ opacity: screenOpacity }}>
        {currentScreen.type === 'hook' && (
          <HookScreen hook={tip.hook} tipNumber={tip.id} category={tip.category} localFrame={localFrame} fps={fps} />
        )}
        {currentScreen.type === 'body' && (
          <BodyScreen body={tip.body} localFrame={localFrame} fps={fps} />
        )}
        {currentScreen.type === 'cta' && (
          <CTAScreen localFrame={localFrame} fps={fps} />
        )}
      </AbsoluteFill>

      {music && <Audio src={staticFile(music)} volume={0.18} loop />}
    </AbsoluteFill>
  );
};
