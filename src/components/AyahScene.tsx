import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import type { SelectedAyah, AnimationStyle, Language } from '../types';
import { TextDisplay } from './TextDisplay';
import { getAnimationStyle } from '../utils/animations';

interface Props {
  ayah: SelectedAyah;
  animationStyle: AnimationStyle;
  language: Language;
  enterFrames: number;
  displayFrames: number;
  exitFrames: number;
  isChunk: boolean;
  isLastChunk: boolean; // ← new
}

export const AyahScene: React.FC<Props> = ({
  ayah,
  animationStyle,
  language,
  enterFrames,
  displayFrames,
  exitFrames,
  isChunk,
  isLastChunk,
}) => {
  const frame = useCurrentFrame();
  const totalFrames = enterFrames + displayFrames + exitFrames;

  const enterProgress = interpolate(
    frame, [0, enterFrames], [0, 1], { extrapolateRight: 'clamp' },
  );
  const exitProgress = interpolate(
    frame, [enterFrames + displayFrames, totalFrames], [0, 1], { extrapolateLeft: 'clamp' },
  );

  const style = getAnimationStyle(animationStyle.id, enterProgress, exitProgress);

  return (
    <AbsoluteFill style={{ ...style, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <TextDisplay
        ayah={ayah}
        language={language}
        isChunk={isChunk}
        isLastChunk={isLastChunk}
      />
    </AbsoluteFill>
  );
};