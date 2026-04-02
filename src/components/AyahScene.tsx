import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import type { SelectedAyah, AnimationStyle, Language } from '../types';
import { TextDisplay } from './TextDisplay';
import { getAnimationStyle } from '../utils/animations';
import { CSSProperties } from 'react';

interface Props {
  ayah: SelectedAyah;
  animationStyle: AnimationStyle;
  language: Language;
  enterFrames: number;
  displayFrames: number;
  exitFrames: number;
  isChunk: boolean;
}

export const AyahScene: React.FC<Props> = ({
  ayah,
  animationStyle,
  language,
  enterFrames,
  displayFrames,
  exitFrames,
  isChunk,
}) => {
  const frame = useCurrentFrame();
  const totalFrames = enterFrames + displayFrames + exitFrames;

  const enterProgress = interpolate(frame, [0, enterFrames], [0, 1], { extrapolateRight: 'clamp' });
  const exitProgress = interpolate(frame, [enterFrames + displayFrames, totalFrames], [0, 1], { extrapolateLeft: 'clamp' });

  const style = getAnimationStyle(animationStyle.id, enterProgress, exitProgress);

  // Surah banner fades with the scene
  const surahOpacity = interpolate(
    frame,
    [0, enterFrames, enterFrames + displayFrames * 0.75, totalFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  // e.g. surahNumber=1 → "surah001"
  const surahCode = `surah${String(ayah.surahNumber).padStart(3, '0')}`;

  const surahFont: CSSProperties = {
    fontFamily: '"surah-names"',
    lineHeight: 1,
    color: '#FFFFFF',
    textShadow: '0 4px 20px rgba(0,0,0,0.5)',
    direction: 'rtl',
  };

  return (
    <AbsoluteFill style={{ ...style, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>

      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: '72px',
        gap: '6px',
        opacity: surahOpacity,
        zIndex: 10,
      }}>
        {/* "سورة" icon */}
        <span style={{ ...surahFont, fontSize: '52px' }}>
          surah-icon
        </span>

        {/* Surah name ligature e.g. surah001 → Al-Fatiha */}
        <span style={{ ...surahFont, fontSize: '88px' }}>
          {surahCode}
        </span>

        {/* Decorative line */}
        <div style={{
          width: '100px',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)',
          marginTop: '4px',
        }} />
      </div>
      
      <TextDisplay
        ayah={ayah}
        language={language}
        isChunk={isChunk}
      />

    </AbsoluteFill>
  );
};