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
const BRAND = {
  bg:          '#0A2010',
  bgGlow:      '#0D2A15',
  accent:      '#22C55E',
  accentLight: '#4ADE80',
  text:        '#FFFFFF',
  muted:       '#A0C0A8',
  mutedDark:   '#4A7A58',
};

const TRANSITION_FRAMES = 18; // 0.6s at 30fps
const FPS = 30;

// ─── Timing builder ───────────────────────────────────────────────────────────
function buildTimings(screens) {
  const timings = [];
  let start = 0;
  for (const screen of screens) {
    const dur = screen.duration * FPS;
    timings.push({ start, end: start + dur });
    start += dur - TRANSITION_FRAMES;
  }
  return timings;
}

export function getTotalFrames(screens) {
  const timings = buildTimings(screens);
  return timings[timings.length - 1].end;
}

// ─── Transition helpers ───────────────────────────────────────────────────────
function getScreenTransform(localFrame, totalDuration, fps) {
  const T = TRANSITION_FRAMES;

  if (localFrame < T) {
    const p = spring({ frame: localFrame, fps, config: { damping: 22, stiffness: 200 }, durationInFrames: T });
    return `translateX(${interpolate(p, [0, 1], [1080, 0])}px)`;
  }

  const exitStart = totalDuration - T;
  if (localFrame >= exitStart) {
    const p = interpolate(localFrame, [exitStart, totalDuration], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    return `translateX(${interpolate(p, [0, 1], [0, -1080])}px)`;
  }

  return 'translateX(0px)';
}

// ─── Background ───────────────────────────────────────────────────────────────
const Background = ({ frame }) => {
  const gridOpacity = interpolate(frame, [0, 40], [0, 0.035], { extrapolateRight: 'clamp' });
  return (
    <>
      <AbsoluteFill style={{
        background: `radial-gradient(ellipse at 50% 25%, ${BRAND.bgGlow} 0%, ${BRAND.bg} 65%)`,
      }} />
      <AbsoluteFill style={{
        opacity: gridOpacity,
        backgroundImage: `
          repeating-linear-gradient(0deg, ${BRAND.accent} 0, ${BRAND.accent} 1px, transparent 1px, transparent 80px),
          repeating-linear-gradient(90deg, ${BRAND.accent} 0, ${BRAND.accent} 1px, transparent 1px, transparent 80px)
        `,
      }} />
    </>
  );
};

// ─── Progress Dots ────────────────────────────────────────────────────────────
const ProgressDots = ({ screens, timings, frame }) => {
  const currentIndex = timings.findIndex((t, i) => {
    const next = timings[i + 1];
    return frame >= t.start && (next ? frame < next.start + TRANSITION_FRAMES : true);
  });

  return (
    <div style={{
      position: 'absolute',
      bottom: 48,
      left: 0,
      right: 0,
      display: 'flex',
      justifyContent: 'center',
      gap: 10,
      zIndex: 100,
    }}>
      {screens.map((_, i) => {
        const active = i === currentIndex;
        return (
          <div key={i} style={{
            width: active ? 28 : 8,
            height: 8,
            borderRadius: 4,
            background: active ? BRAND.accent : BRAND.mutedDark,
            transition: 'width 0.3s',
            boxShadow: active ? `0 0 8px ${BRAND.accent}` : 'none',
          }} />
        );
      })}
    </div>
  );
};

// ─── Logo Bar ─────────────────────────────────────────────────────────────────
const LogoBar = ({ opacity = 1 }) => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    opacity,
    padding: '0 80px',
    marginBottom: 8,
  }}>
    <Img
      src={staticFile('app-logo.png')}
      style={{ width: 48, height: 48, objectFit: 'cover' }}
    />
    <span style={{
      fontSize: 26,
      fontWeight: 700,
      color: BRAND.text,
      letterSpacing: -0.3,
      opacity: 0.9,
    }}>Checkpoint: Store Scanner</span>
  </div>
);

// ─── Screen: Hook ─────────────────────────────────────────────────────────────
const HookScreen = ({ text, subtext, localFrame, fps }) => {
  const opacity = interpolate(localFrame, [0, 12], [0, 1], { extrapolateRight: 'clamp' });
  const scale = interpolate(localFrame, [0, 20], [0.96, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '80px 80px',
      textAlign: 'center',
      gap: 28,
    }}>
      <div style={{ opacity, transform: `scale(${scale})` }}>
        <div style={{
          fontSize: 76,
          fontWeight: 900,
          color: BRAND.text,
          lineHeight: 1.08,
          letterSpacing: -2,
        }}>{text}</div>
        {subtext && (
          <div style={{
            fontSize: 42,
            fontWeight: 500,
            color: BRAND.accent,
            marginTop: 28,
            lineHeight: 1.3,
            letterSpacing: -0.5,
          }}>{subtext}</div>
        )}
      </div>
    </AbsoluteFill>
  );
};

// ─── Screen: Content ─────────────────────────────────────────────────────────
const ContentScreen = ({ headline, body, accent, localFrame, fps }) => {
  const headlineOpacity = interpolate(localFrame, [3, 18], [0, 1], { extrapolateRight: 'clamp' });
  const headlineY = interpolate(localFrame, [3, 22], [30, 0], { extrapolateRight: 'clamp' });
  const bodyOpacity = interpolate(localFrame, [18, 36], [0, 1], { extrapolateRight: 'clamp' });
  const bodyY = interpolate(localFrame, [18, 38], [20, 0], { extrapolateRight: 'clamp' });

  const lineWidth = interpolate(localFrame, [12, 40], [0, 160], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: '80px 80px',
      gap: 24,
    }}>
      <div style={{
        opacity: headlineOpacity,
        transform: `translateY(${headlineY}px)`,
        fontSize: 58,
        fontWeight: 800,
        color: accent ? BRAND.accentLight : BRAND.text,
        lineHeight: 1.12,
        letterSpacing: -1.2,
      }}>{headline}</div>

      <div style={{
        height: 4,
        width: lineWidth,
        background: `linear-gradient(90deg, ${BRAND.accent}, ${BRAND.accentLight})`,
        borderRadius: 2,
        boxShadow: `0 0 12px ${BRAND.accent}88`,
      }} />

      <div style={{
        opacity: bodyOpacity,
        transform: `translateY(${bodyY}px)`,
        fontSize: 38,
        fontWeight: 400,
        color: BRAND.muted,
        lineHeight: 1.5,
      }}>{body}</div>
    </AbsoluteFill>
  );
};

// ─── Screen: Stat ─────────────────────────────────────────────────────────────
const StatScreen = ({ stat, label, context, localFrame, fps }) => {
  const statSpring = spring({
    frame: localFrame - 5,
    fps,
    config: { damping: 14, stiffness: 100 },
    durationInFrames: 35,
  });
  const statScale = interpolate(statSpring, [0, 1], [0.4, 1]);
  const statOpacity = interpolate(localFrame, [3, 18], [0, 1], { extrapolateRight: 'clamp' });
  const labelOpacity = interpolate(localFrame, [20, 36], [0, 1], { extrapolateRight: 'clamp' });
  const labelY = interpolate(localFrame, [20, 36], [16, 0], { extrapolateRight: 'clamp' });

  // Pulse glow on stat
  const glow = 20 + 10 * Math.sin(localFrame * 0.15);

  return (
    <AbsoluteFill style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '80px 80px',
      textAlign: 'center',
      gap: 16,
    }}>
      <div style={{
        fontSize: 148,
        fontWeight: 900,
        color: BRAND.accent,
        letterSpacing: -4,
        lineHeight: 1,
        opacity: statOpacity,
        transform: `scale(${statScale})`,
        textShadow: `0 0 ${glow}px ${BRAND.accent}88`,
      }}>{stat}</div>

      <div style={{
        opacity: labelOpacity,
        transform: `translateY(${labelY}px)`,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}>
        <div style={{
          fontSize: 44,
          fontWeight: 700,
          color: BRAND.text,
          lineHeight: 1.2,
        }}>{label}</div>
        {context && (
          <div style={{
            fontSize: 30,
            color: BRAND.muted,
            lineHeight: 1.4,
          }}>{context}</div>
        )}
      </div>
    </AbsoluteFill>
  );
};

// ─── Screen: List Item ────────────────────────────────────────────────────────
const ListItemScreen = ({ number, headline, body, localFrame, fps }) => {
  const numOpacity = interpolate(localFrame, [0, 12], [0, 1], { extrapolateRight: 'clamp' });
  const numScale = spring({ frame: localFrame, fps, config: { damping: 18, stiffness: 160 }, durationInFrames: 20 });
  const contentOpacity = interpolate(localFrame, [12, 28], [0, 1], { extrapolateRight: 'clamp' });
  const contentY = interpolate(localFrame, [12, 28], [20, 0], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: '80px 80px',
      gap: 20,
    }}>
      <div style={{
        fontSize: 100,
        fontWeight: 900,
        color: BRAND.accent,
        letterSpacing: -3,
        lineHeight: 1,
        opacity: numOpacity,
        transform: `scale(${interpolate(numScale, [0, 1], [0.8, 1])})`,
        textShadow: `0 0 30px ${BRAND.accent}55`,
      }}>{number}</div>

      <div style={{
        opacity: contentOpacity,
        transform: `translateY(${contentY}px)`,
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
      }}>
        <div style={{
          fontSize: 54,
          fontWeight: 800,
          color: BRAND.text,
          lineHeight: 1.15,
          letterSpacing: -1,
        }}>{headline}</div>
        <div style={{
          fontSize: 34,
          color: BRAND.muted,
          lineHeight: 1.45,
        }}>{body}</div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Screen: CTA ──────────────────────────────────────────────────────────────
const CTAScreen = ({ localFrame, fps }) => {
  const bgGlow = interpolate(localFrame, [0, 30], [0, 1], { extrapolateRight: 'clamp' });
  const contentOpacity = interpolate(localFrame, [8, 28], [0, 1], { extrapolateRight: 'clamp' });
  const contentScale = spring({ frame: localFrame - 8, fps, config: { damping: 20, stiffness: 150 }, durationInFrames: 25 });
  const scaledVal = interpolate(contentScale, [0, 1], [0.9, 1]);

  const buttonGlow = 28 + 14 * Math.sin(localFrame * 0.13);

  return (
    <AbsoluteFill style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '80px 80px',
      gap: 36,
      background: `radial-gradient(ellipse at 50% 50%, ${BRAND.bgGlow}${Math.round(bgGlow * 60).toString(16).padStart(2, '0')} 0%, transparent 70%)`,
    }}>
      <div style={{
        opacity: contentOpacity,
        transform: `scale(${scaledVal})`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 28,
        width: '100%',
      }}>
        <Img
          src={staticFile('app-logo.png')}
          style={{ width: 96, height: 96, borderRadius: 24, objectFit: 'cover', boxShadow: `0 0 32px ${BRAND.accent}55` }}
        />
        <div style={{
          fontSize: 44,
          fontWeight: 900,
          color: BRAND.text,
          textAlign: 'center',
          lineHeight: 1.2,
          letterSpacing: -0.8,
        }}>{CTA_DEFAULTS.appName}</div>

        <div style={{
          background: BRAND.accent,
          borderRadius: 20,
          padding: '28px 52px',
          fontSize: 40,
          fontWeight: 800,
          color: '#fff',
          textAlign: 'center',
          width: '100%',
          boxShadow: `0 0 ${buttonGlow}px ${BRAND.accent}99`,
        }}>Try it free</div>

        <div style={{
          fontSize: 28,
          color: BRAND.muted,
          textAlign: 'center',
          letterSpacing: 0.2,
        }}>{CTA_DEFAULTS.url}</div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Screen Dispatcher ────────────────────────────────────────────────────────
const ScreenContent = ({ screen, localFrame, fps }) => {
  switch (screen.type) {
    case 'hook':
      return <HookScreen {...screen} localFrame={localFrame} fps={fps} />;
    case 'content':
      return <ContentScreen {...screen} localFrame={localFrame} fps={fps} />;
    case 'stat':
      return <StatScreen {...screen} localFrame={localFrame} fps={fps} />;
    case 'list-item':
      return <ListItemScreen {...screen} localFrame={localFrame} fps={fps} />;
    case 'cta':
      return <CTAScreen localFrame={localFrame} fps={fps} />;
    default:
      return null;
  }
};

// ─── Main Template ────────────────────────────────────────────────────────────
export const VideoTemplate = ({
  screens,
  music,
  sfxWhoosh = 'sfx/dragon-studio-simple-whoosh-382724.mp3',
  sfxChime  = 'sfx/universfield-clear-bell-chime-487898.mp3',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const timings = useMemo(() => buildTimings(screens), [screens]);

  // Which screens are currently visible (max 2 during transition)
  const visibleScreens = timings
    .map((t, i) => ({ index: i, localFrame: frame - t.start, duration: t.end - t.start }))
    .filter(s => s.localFrame >= 0 && s.localFrame < s.duration);

  // Frames where transitions happen (for SFX)
  const transitionStartFrames = timings.slice(1).map(t => t.start);

  // CTA screen start (for chime)
  const ctaIndex = screens.findIndex(s => s.type === 'cta');
  const ctaStartFrame = ctaIndex >= 0 ? timings[ctaIndex]?.start : null;

  return (
    <AbsoluteFill style={{ overflow: 'hidden', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      <Background frame={frame} />

      {/* Logo bar — always visible */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        paddingTop: 96,
        paddingLeft: 24,
        paddingRight: 24,
        zIndex: 50,
      }}>
        <LogoBar opacity={interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' })} />
      </div>

      {/* Screens with slide transitions */}
      {visibleScreens.map(({ index, localFrame, duration }) => (
        <AbsoluteFill
          key={index}
          style={{
            transform: getScreenTransform(localFrame, duration, fps),
            paddingTop: 200,
            paddingBottom: 100,
            paddingLeft: 24,
            paddingRight: 24,
          }}
        >
          <ScreenContent screen={screens[index]} localFrame={localFrame} fps={fps} />
        </AbsoluteFill>
      ))}

      {/* Progress dots */}
      <ProgressDots screens={screens} timings={timings} frame={frame} />

      {/* Background music */}
      {music && (
        <Audio src={staticFile(music)} volume={0.2} loop />
      )}

      {/* Whoosh SFX at each screen transition */}
      {transitionStartFrames.map((transFrame, i) => (
        <Sequence key={`whoosh-${i}`} from={transFrame} durationInFrames={20}>
          <Audio src={staticFile(sfxWhoosh)} volume={0.55} />
        </Sequence>
      ))}

      {/* Chime SFX on CTA */}
      {ctaStartFrame !== null && (
        <Sequence from={ctaStartFrame} durationInFrames={40}>
          <Audio src={staticFile(sfxChime)} volume={0.5} />
        </Sequence>
      )}
    </AbsoluteFill>
  );
};
