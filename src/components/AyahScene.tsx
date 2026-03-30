import { AbsoluteFill, interpolate, useCurrentFrame, Sequence } from 'remotion';
import type { SelectedAyah, AnimationStyle, Language } from '../types';
import { TextDisplay } from './TextDisplay';
import { getAnimationStyle } from '../utils/animations';
import { splitIntoChunks } from '../utils/textChunks';

interface Props {
  ayah: SelectedAyah;
  animationStyle: AnimationStyle;
  language: Language;
  enterFrames: number;
  displayFrames: number;
  exitFrames: number;
}

// Frames reserved for enter/exit animation per chunk
const CHUNK_ENTER_FRAMES = 15;
const CHUNK_EXIT_FRAMES  = 10;

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

  // ── Split the Arabic text into chunks ─────────────────────────────────────
  const chunks = splitIntoChunks(ayah.text_ar, 100);

  // ── SINGLE CHUNK — original behaviour ─────────────────────────────────────
  if (chunks.length === 1) {
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
      <AbsoluteFill style={{ ...style, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <TextDisplay ayah={ayah} language={language} />
      </AbsoluteFill>
    );
  }

  // ── MULTIPLE CHUNKS — split displayFrames equally among chunks ────────────
  //
  // Each chunk owns: CHUNK_ENTER_FRAMES + chunkDisplay + CHUNK_EXIT_FRAMES
  // The outer enter/exit animate the whole scene; chunk transitions are internal.
  //
  // Timeline inside displayFrames:
  //   [chunk 0: enter(15) + display + exit(10)] [chunk 1: ...] ...

  const chunkTransitionFrames = CHUNK_ENTER_FRAMES + CHUNK_EXIT_FRAMES;
  const totalTransitionFrames = chunkTransitionFrames * chunks.length;

  // Remaining frames split equally as display time per chunk
  const displayPerChunk = Math.floor(
    (displayFrames - totalTransitionFrames) / chunks.length
  );
  const chunkTotalFrames = CHUNK_ENTER_FRAMES + Math.max(displayPerChunk, 10) + CHUNK_EXIT_FRAMES;

  // Outer scene fade (enter / exit of the whole ayah)
  const outerEnterProgress = interpolate(frame, [0, enterFrames], [0, 1], {
    extrapolateRight: 'clamp',
  });
  const outerExitProgress = interpolate(
    frame,
    [enterFrames + displayFrames, totalFrames],
    [0, 1],
    { extrapolateLeft: 'clamp' }
  );
  const outerStyle = getAnimationStyle(animationStyle.id, outerEnterProgress, outerExitProgress);

  return (
    <AbsoluteFill style={{ ...outerStyle, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      {chunks.map((chunkText, i) => {
        // Each chunk starts after the previous chunk inside the displayFrames window
        const chunkStart = enterFrames + i * chunkTotalFrames;

        return (
          <Sequence
            key={`chunk-${i}`}
            from={chunkStart}
            durationInFrames={chunkTotalFrames}
            layout="none"
          >
            <ChunkScene
              ayah={ayah}
              chunkText={chunkText}
              animationStyle={animationStyle}
              language={language}
              enterFrames={CHUNK_ENTER_FRAMES}
              displayFrames={Math.max(displayPerChunk, 10)}
              exitFrames={CHUNK_EXIT_FRAMES}
            />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

// ── Internal component — animates a single chunk ──────────────────────────────
interface ChunkProps {
  ayah: SelectedAyah;
  chunkText: string;
  animationStyle: AnimationStyle;
  language: Language;
  enterFrames: number;
  displayFrames: number;
  exitFrames: number;
}

const ChunkScene: React.FC<ChunkProps> = ({
  ayah,
  chunkText,
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

  // Pass a modified ayah with only the chunk text for display
  const chunkAyah: SelectedAyah = { ...ayah, text_ar: chunkText };

  return (
    <AbsoluteFill style={{ ...style, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <TextDisplay ayah={chunkAyah} language={language} />
    </AbsoluteFill>
  );
};