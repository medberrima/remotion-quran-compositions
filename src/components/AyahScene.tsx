import { AbsoluteFill, Audio, interpolate, useCurrentFrame, Sequence } from 'remotion';
import type { SelectedAyah, AnimationStyle, Language } from '../types';
import { TextDisplay } from './TextDisplay';
import { getAnimationStyle } from '../utils/animations';
import {
  splitArabicIntoChunks,
  splitTranslationIntoNChunks,
  distributeFrames,
} from '../utils/textChunks';

interface Props {
  ayah: SelectedAyah;
  animationStyle: AnimationStyle;
  language: Language;
  enterFrames: number;
  displayFrames: number;
  exitFrames: number;
}

// Frames for each chunk's own enter / exit transition
const CHUNK_ENTER = 12;
const CHUNK_EXIT  = 8;

export const AyahScene: React.FC<Props> = ({
  ayah,
  animationStyle,
  language,
  enterFrames,
  displayFrames,
  exitFrames,
}) => {
  const frame       = useCurrentFrame();
  const totalFrames = enterFrames + displayFrames + exitFrames;

  // ── 1. Split Arabic into chunks ≤ 50 chars ──────────────────────────────
  const arabicChunks = splitArabicIntoChunks(ayah.text_ar, 50);
  const n            = arabicChunks.length;

  // ── 2. Split translations into the same N chunks (smart, punctuation-aware)
  const enChunks = splitTranslationIntoNChunks(ayah.text_en ?? "", n);
  const frChunks = splitTranslationIntoNChunks(ayah.text_fr ?? "", n);

  // ── SINGLE CHUNK — original behaviour, no extra overhead ────────────────
  if (n === 1) {
    const enterProgress = interpolate(frame, [0, enterFrames], [0, 1], {
      extrapolateRight: 'clamp',
    });
    const exitProgress = interpolate(
      frame,
      [enterFrames + displayFrames, totalFrames],
      [0, 1],
      { extrapolateLeft: 'clamp' }
    );
    const style = getAnimationStyle(animationStyle.id, enterProgress, exitProgress);

    return (
      <AbsoluteFill
        style={{ ...style, display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <TextDisplay ayah={ayah} language={language} />
      </AbsoluteFill>
    );
  }

  // ── MULTIPLE CHUNKS ──────────────────────────────────────────────────────

  // 3. Distribute display frames proportionally to Arabic chunk char count
  //    (reliable proxy for recitation time when audio is present)
  const displayFramesPerChunk = distributeFrames(
    arabicChunks,
    displayFrames,
    CHUNK_ENTER,
    CHUNK_EXIT
  );

  // 4. Compute start frame for each chunk inside the displayFrames window
  const chunkStartFrames: number[] = [];
  let cursor = enterFrames; // chunks live inside the display window
  for (let i = 0; i < n; i++) {
    chunkStartFrames.push(cursor);
    cursor += CHUNK_ENTER + displayFramesPerChunk[i] + CHUNK_EXIT;
  }

  // 5. Outer scene animation (whole ayah enter / exit)
  const outerEnterProgress = interpolate(frame, [0, enterFrames], [0, 1], {
    extrapolateRight: 'clamp',
  });
  const outerExitProgress = interpolate(
    frame,
    [enterFrames + displayFrames, totalFrames],
    [0, 1],
    { extrapolateLeft: 'clamp' }
  );
  const outerStyle = getAnimationStyle(
    animationStyle.id,
    outerEnterProgress,
    outerExitProgress
  );

  return (
    <AbsoluteFill
      style={{ ...outerStyle, display: 'flex', justifyContent: 'center', alignItems: 'center' }}
    >
      {arabicChunks.map((arChunk, i) => {
        const chunkTotalFrames = CHUNK_ENTER + displayFramesPerChunk[i] + CHUNK_EXIT;

        // Build a per-chunk ayah with the matching translation chunk
        const chunkAyah: SelectedAyah = {
          ...ayah,
          text_ar: arChunk,
          text_en: enChunks[i] ?? "",
          text_fr: frChunks[i] ?? "",
        };

        return (
          <Sequence
            key={`chunk-${i}`}
            from={chunkStartFrames[i]}
            durationInFrames={chunkTotalFrames}
            layout="none"
          >
            <ChunkScene
              ayah={chunkAyah}
              animationStyle={animationStyle}
              language={language}
              enterFrames={CHUNK_ENTER}
              displayFrames={displayFramesPerChunk[i]}
              exitFrames={CHUNK_EXIT}
            />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

// ── Internal: animates a single chunk ────────────────────────────────────────
interface ChunkProps {
  ayah: SelectedAyah;
  animationStyle: AnimationStyle;
  language: Language;
  enterFrames: number;
  displayFrames: number;
  exitFrames: number;
}

const ChunkScene: React.FC<ChunkProps> = ({
  ayah,
  animationStyle,
  language,
  enterFrames,
  displayFrames,
  exitFrames,
}) => {
  const frame       = useCurrentFrame();
  const totalFrames = enterFrames + displayFrames + exitFrames;

  const enterProgress = interpolate(frame, [0, enterFrames], [0, 1], {
    extrapolateRight: 'clamp',
  });
  const exitProgress = interpolate(
    frame,
    [enterFrames + displayFrames, totalFrames],
    [0, 1],
    { extrapolateLeft: 'clamp' }
  );

  const style = getAnimationStyle(animationStyle.id, enterProgress, exitProgress);

  return (
    <AbsoluteFill
      style={{ ...style, display: 'flex', justifyContent: 'center', alignItems: 'center' }}
    >
      <TextDisplay ayah={ayah} language={language} />
    </AbsoluteFill>
  );
};