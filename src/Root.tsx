import { Composition, staticFile } from 'remotion';
import { loadFont as loadAmiri } from '@remotion/google-fonts/Amiri';
import { loadFont as loadCairo } from '@remotion/google-fonts/Cairo';
import { QuranVideo } from './components/QuranVideo';
import { calculateTotalDuration } from './utils/timeline';
import type { Chunk, SelectedAyah } from './types';

// ── Load Google Fonts (Remotion handles bundling automatically)
loadAmiri();
loadCairo();

// ── Custom icon font via staticFile
const surahIconFontFace = `
  @font-face {
    font-family: 'surah-name-v4-icon';
    src: url('${staticFile('fonts/surah-name-v4-icon.woff2')}') format('woff2');
    font-display: block;
  }
`;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <style>{surahIconFontFace}</style>

      <Composition
        id="QuranVideo"
        component={QuranVideo as React.FC}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          selectedAyahs: [],
          chunks: [],
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