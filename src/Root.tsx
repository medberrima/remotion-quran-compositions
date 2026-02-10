import { Composition } from 'remotion';
import { QuranVideo } from './components/QuranVideo';
import { calculateTimeline } from './utils/timeline';
import type { SelectedAyah } from './types';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="QuranVideo"
        component={QuranVideo}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          selectedAyahs: [],
          background: {
            id: 'gradient-blue',
            name: 'Blue Gradient',
            type: 'gradient' as const,
            style: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          },
          animationStyle: {
            id: 'fade',
            name: 'Fade In',
          },
          watermark: '@yaqeenapp',
          logo: null,
          logoPosition: {
            id: 'top-right' as const,
            name: 'Top Right',
          },
          logoSize: 80,
          language: 'en' as const,
          includeAudio: true,
        }}
        calculateMetadata={({ props }) => {
          const fps = 30;
          const timeline = calculateTimeline(props.selectedAyahs as SelectedAyah[], fps);
          
          const totalDuration = timeline.length > 0
            ? timeline[timeline.length - 1].startFrame + timeline[timeline.length - 1].totalFrames
            : 300;
          
          return {
            durationInFrames: totalDuration,
            fps,
          };
        }}
      />
    </>
  );
};
