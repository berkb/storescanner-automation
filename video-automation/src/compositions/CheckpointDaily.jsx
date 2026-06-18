import {
  AbsoluteFill,
  Audio,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  staticFile,
  Img,
} from 'remotion';

// ─── Timing (frames at 30fps, total 45s = 1350 frames) ───────────────────────
const INTRO_START    = 0;    // Logo fade in
const HEADLINE_START = 30;   // Headline slides in at 1s
const POINTS_START   = 180;  // First bullet at 6s
const POINT_DURATION = 180;  // Each bullet: 6s before next appears
const CTA_START      = 1080; // CTA at 36s
const TOTAL          = 1350; // 45s

const BRAND = {
  bg:          '#0A2010',
  bgGlow:      '#0D2A15',
  accent:      '#22C55E',
  accentLight: '#4ADE80',
  text:        '#FFFFFF',
  muted:       '#A0C0A8',
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
function useFadeIn(startFrame, durationFrames = 15) {
  const frame = useCurrentFrame();
  return interpolate(frame, [startFrame, startFrame + durationFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
}

function useSlideUp(startFrame, fps) {
  const frame = useCurrentFrame();
  const progress = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 18, stiffness: 150 },
  });
  return interpolate(progress, [0, 1], [40, 0]);
}

// ─── Progress bar ─────────────────────────────────────────────────────────────
const ProgressBar = () => {
  const frame = useCurrentFrame();
  const width = interpolate(frame, [0, TOTAL], [0, 100], {
    extrapolateRight: 'clamp',
  });
  return (
    <div style={{
      position: 'absolute',
      bottom: 0,
      left: 0,
      height: 5,
      width: `${width}%`,
      background: `linear-gradient(90deg, ${BRAND.accent}, ${BRAND.accentLight})`,
      boxShadow: `0 0 14px ${BRAND.accent}`,
    }} />
  );
};

// ─── Logo bar ─────────────────────────────────────────────────────────────────
const LogoBar = () => {
  const opacity = useFadeIn(INTRO_START, 20);
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 18,
      opacity,
      padding: '0 60px',
    }}>
      <Img
        src={staticFile('app-logo.png')}
        style={{ width: 56, height: 56, borderRadius: 14, objectFit: 'cover' }}
      />
      <span style={{
        fontSize: 32,
        fontWeight: 700,
        color: BRAND.text,
        letterSpacing: -0.5,
      }}>Store Health: Audit & Scan</span>
    </div>
  );
};

// ─── Headline ─────────────────────────────────────────────────────────────────
const Headline = ({ text, fps }) => {
  const opacity = useFadeIn(HEADLINE_START, 15);
  const translateY = useSlideUp(HEADLINE_START, fps);
  return (
    <div style={{ opacity, transform: `translateY(${translateY}px)`, padding: '0 60px' }}>
      <div style={{
        fontSize: 68,
        fontWeight: 800,
        color: BRAND.text,
        lineHeight: 1.13,
        letterSpacing: -1.5,
      }}>{text}</div>
    </div>
  );
};

// ─── Accent line ──────────────────────────────────────────────────────────────
const AccentLine = () => {
  const frame = useCurrentFrame();
  const width = interpolate(
    frame,
    [HEADLINE_START, HEADLINE_START + 30],
    [0, 200],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  return (
    <div style={{
      height: 5,
      width,
      background: `linear-gradient(90deg, ${BRAND.accent}, ${BRAND.accentLight})`,
      borderRadius: 3,
      marginLeft: 60,
      boxShadow: `0 0 16px ${BRAND.accent}88`,
    }} />
  );
};

// ─── Bullet point ─────────────────────────────────────────────────────────────
const BulletPoint = ({ text, index, fps }) => {
  const frame = useCurrentFrame();
  const startFrame = POINTS_START + index * POINT_DURATION;
  const opacity = useFadeIn(startFrame, 12);
  const translateY = useSlideUp(startFrame, fps);

  // Continuous pulse on the dot after it has appeared
  const dotAge = frame - startFrame - 20;
  const pulse = dotAge > 0 ? 1 + 0.18 * Math.sin(dotAge * 0.18) : 1;

  return (
    <div style={{
      opacity,
      transform: `translateY(${translateY}px)`,
      display: 'flex',
      alignItems: 'flex-start',
      gap: 22,
      padding: '0 60px',
    }}>
      <div style={{
        width: 12,
        height: 12,
        borderRadius: '50%',
        background: BRAND.accent,
        marginTop: 16,
        flexShrink: 0,
        transform: `scale(${pulse})`,
        boxShadow: `0 0 ${10 + 6 * Math.sin((frame - startFrame) * 0.18)}px ${BRAND.accent}`,
      }} />
      <span style={{
        fontSize: 48,
        fontWeight: 600,
        color: BRAND.text,
        lineHeight: 1.28,
      }}>{text}</span>
    </div>
  );
};

// ─── CTA bar ──────────────────────────────────────────────────────────────────
const CTABar = ({ cta, url }) => {
  const opacity = useFadeIn(CTA_START, 25);
  const frame = useCurrentFrame();
  const glow = frame > CTA_START
    ? 0.4 + 0.25 * Math.sin((frame - CTA_START) * 0.12)
    : 0.4;
  return (
    <div style={{
      opacity,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 16,
      padding: '0 60px',
    }}>
      <div style={{
        background: BRAND.accent,
        borderRadius: 20,
        padding: '26px 48px',
        fontSize: 38,
        fontWeight: 800,
        color: '#fff',
        textAlign: 'center',
        width: '100%',
        boxShadow: `0 0 ${32 + 16 * glow}px ${BRAND.accent}${Math.round(glow * 255).toString(16).padStart(2, '0')}`,
      }}>{cta}</div>
      <span style={{
        fontSize: 26,
        color: BRAND.muted,
        letterSpacing: 0.3,
      }}>{url}</span>
    </div>
  );
};

// ─── Main Composition ─────────────────────────────────────────────────────────
export const CheckpointDaily = ({ headline, points, cta, ctaUrl, musicFile }) => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();

  const gridOpacity = interpolate(frame, [0, 40], [0, 0.04], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{
      background: `radial-gradient(ellipse at 50% 30%, ${BRAND.bgGlow} 0%, ${BRAND.bg} 70%)`,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }}>
      {/* Optional background music */}
      {musicFile ? (
        <Audio src={staticFile(musicFile)} volume={0.25} loop />
      ) : null}

      {/* Subtle grid overlay */}
      <AbsoluteFill style={{
        opacity: gridOpacity,
        backgroundImage: `repeating-linear-gradient(0deg, ${BRAND.accent} 0, ${BRAND.accent} 1px, transparent 1px, transparent 80px),
                          repeating-linear-gradient(90deg, ${BRAND.accent} 0, ${BRAND.accent} 1px, transparent 1px, transparent 80px)`,
      }} />

      {/* Content */}
      <AbsoluteFill style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '80px 0',
      }}>
        <LogoBar />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
          <Headline text={headline} fps={fps} />
          <AccentLine />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            {points.map((point, i) => (
              <BulletPoint key={i} text={point} index={i} fps={fps} />
            ))}
          </div>
        </div>

        <CTABar cta={cta} url={ctaUrl} />
      </AbsoluteFill>

      {/* Progress bar */}
      <ProgressBar />
    </AbsoluteFill>
  );
};
