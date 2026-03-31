import { Composition } from 'remotion';
import { QuranVideo } from './components/QuranVideo';
import { calculateTotalDuration } from './utils/timeline';
import type { Chunk, SelectedAyah } from './types';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="QuranVideo"
        component={QuranVideo as React.FC}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          selectedAyahs: [],
          chunks: [],            // ← added
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
          watermark: '@YaqeenMuslimApp',
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
          const totalDuration = calculateTotalDuration(
            props.selectedAyahs as SelectedAyah[],
            fps,
            props.chunks as Chunk[],
          );
          return { durationInFrames: totalDuration, fps };
        }}
      />
    </>
  );
};