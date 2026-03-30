import { AbsoluteFill, interpolate, useCurrentFrame, Sequence } from 'remotion';
import type { SelectedAyah, AnimationStyle, Language } from '../types';
import { TextDisplay } from './TextDisplay';
import { getAnimationStyle } from '../utils/animations';
import { splitArabicIntoChunks, splitTranslationIntoNChunks } from '../utils/textChunks';

interface Props {
  ayah: SelectedAyah;
  animationStyle: AnimationStyle;
  language: Language;
  enterFrames: number;
  displayFrames: number;
  exitFrames: number;
}

const CHUNK_ENTER = 15;
const CHUNK_EXIT  = 10;

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

  // ── Split Arabic into chunks of ≤ 50 chars ────────────────────────────────
  const arChunks = splitArabicIntoChunks(ayah.text_ar, 50);

  // ── Split translation into the same N groups ──────────────────────────────
  const enChunks = splitTranslationIntoNChunks(ayah.text_en, arChunks.length);
  const frChunks = splitTranslationIntoNChunks(ayah.text_fr, arChunks.length);

  // ── SINGLE CHUNK — original behaviour ─────────────────────────────────────
  if (arChunks.length === 1) {
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

  // ── MULTIPLE CHUNKS ────────────────────────────────────────────────────────
  //
  // displayFrames is divided equally among chunks.
  // Each chunk: CHUNK_ENTER + chunkDisplay + CHUNK_EXIT
  //
  const chunkTransition  = CHUNK_ENTER + CHUNK_EXIT;
  const displayPerChunk  = Math.max(
    Math.floor((displayFrames - chunkTransition * arChunks.length) / arChunks.length),
    10
  );
  const chunkTotalFrames = CHUNK_ENTER + displayPerChunk + CHUNK_EXIT;

  // Outer enter/exit animates the whole ayah block
  const outerEnter = interpolate(frame, [0, enterFrames], [0, 1], {
    extrapolateRight: 'clamp',
  });
  const outerExit  = interpolate(
    frame,
    [enterFrames + displayFrames, totalFrames],
    [0, 1],
    { extrapolateLeft: 'clamp' }
  );
  const outerStyle = getAnimationStyle(animationStyle.id, outerEnter, outerExit);

  return (
    <AbsoluteFill
      style={{ ...outerStyle, display: 'flex', justifyContent: 'center', alignItems: 'center' }}
    >
      {arChunks.map((arChunk, i) => {
        // Build a per-chunk ayah with synced translations
        const chunkAyah: SelectedAyah = {
          ...ayah,
          text_ar: arChunk,
          text_en: enChunks[i] ?? enChunks[enChunks.length - 1],
          text_fr: frChunks[i] ?? frChunks[frChunks.length - 1],
        };

        return (
          <Sequence
            key={`chunk-${i}`}
            from={enterFrames + i * chunkTotalFrames}
            durationInFrames={chunkTotalFrames}
            layout="none"
          >
            <ChunkScene
              ayah={chunkAyah}
              animationStyle={animationStyle}
              language={language}
              enterFrames={CHUNK_ENTER}
              displayFrames={displayPerChunk}
              exitFrames={CHUNK_EXIT}
            />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

// ── Per-chunk sub-scene ───────────────────────────────────────────────────────
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
      {/* ayah already has chunked text_ar + synced text_en / text_fr */}
      <TextDisplay ayah={ayah} language={language} />
    </AbsoluteFill>
  );
};