import { Composition } from 'remotion';
import { VideoTemplate, getTotalFrames } from './compositions/VideoTemplate.jsx';
import { TipTemplate, getTipTotalFrames } from './compositions/TipTemplate.jsx';
import { VIDEOS } from './data/videos.js';
import { TIPS } from './data/tips.js';

export const RemotionRoot = () => {
  return (
    <>
      {/* Dynamic composition for weekly-generated scripts */}
      <Composition
        id="DynamicVideo"
        component={VideoTemplate}
        durationInFrames={1800}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          screens: [],
          music: null,
          sfxWhoosh: 'sfx/dragon-studio-simple-whoosh-382724.mp3',
          sfxChime: 'sfx/universfield-clear-bell-chime-487898.mp3',
        }}
        calculateMetadata={({ props }) => {
          if (!props.screens || props.screens.length === 0) {
            return { durationInFrames: 1800 };
          }
          return { durationInFrames: getTotalFrames(props.screens) };
        }}
      />

      {/* Dynamic tip composition for daily-generate.mjs */}
      <Composition
        id="DynamicTip"
        component={TipTemplate}
        durationInFrames={630}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          tip: TIPS[0],
          music: 'musics/snoozy beats - Climbing Higher.mp3',
        }}
        calculateMetadata={({ props }) => ({
          durationInFrames: getTipTotalFrames([
            { duration: props.tip?.hookDuration ?? 6 },
            { duration: props.tip?.bodyDuration ?? 9 },
            { duration: props.tip?.ctaDuration  ?? 6 },
          ]),
        })}
      />

      {/* Tip series — preview first 3 */}
      {TIPS.slice(0, 3).map((tip) => (
        <Composition
          key={`tip-${tip.id}`}
          id={`tip-${String(tip.id).padStart(3, '0')}`}
          component={TipTemplate}
          durationInFrames={getTipTotalFrames([
            { duration: tip.hookDuration ?? 6 },
            { duration: tip.bodyDuration ?? 9 },
            { duration: tip.ctaDuration  ?? 6 },
          ])}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{ tip, music: 'musics/snoozy beats - Climbing Higher.mp3' }}
        />
      ))}

      {/* Static preview compositions */}
      {VIDEOS.map((video) => (
        <Composition
          key={video.id}
          id={video.id}
          component={VideoTemplate}
          durationInFrames={getTotalFrames(video.screens)}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{
            screens: video.screens,
            music: video.music,
          }}
        />
      ))}
    </>
  );
};
