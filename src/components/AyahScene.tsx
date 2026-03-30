import { AbsoluteFill, interpolate, useCurrentFrame, Sequence } from 'remotion';
import type { SelectedAyah, AnimationStyle, Language } from '../types';
import { TextDisplay } from './TextDisplay';
import { getAnimationStyle } from '../utils/animations';
import { splitArabicIntoChunks } from '../utils/textChunks';

interface Props {
  ayah: SelectedAyah;
  animationStyle: AnimationStyle;
  language: Language;
  enterFrames: number;
  displayFrames: number;
  exitFrames: number;
}

// Short cross-fade between chunks — kept minimal to stay in sync with audio
const CHUNK_ENTER = 6;
const CHUNK_EXIT  = 6;

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

  // ── Split Arabic text into chunks of ≤ 50 chars ───────────────────────────
  const arChunks = splitArabicIntoChunks(ayah.text_ar, 50);

  // ── SINGLE CHUNK — original behaviour, untouched ──────────────────────────
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
  // AUDIO SYNC STRATEGY:
  //   • Outer enter/exit still animate the full scene (fade in/out).
  //   • Chunks are spread across displayFrames starting at frame 0,
  //     NOT at enterFrames — so audio and text align from the first word.
  //   • Each chunk gets an equal slice of displayFrames.
  //   • CHUNK_ENTER / CHUNK_EXIT are very short (6f) to minimise drift.
  //
  // TRANSLATION STRATEGY:
  //   • Chunks 0…N-2 → Arabic only (no translation shown).
  //     This keeps each scene clean and avoids mismatched translations.
  //   • Chunk N-1 (last) → Arabic chunk + full translation of the ayah.
  //     Font size auto-reduces for long translations.
  //
  const chunkTransition  = CHUNK_ENTER + CHUNK_EXIT;
  const displayPerChunk  = Math.max(
    Math.floor((displayFrames - chunkTransition * arChunks.length) / arChunks.length),
    12
  );
  const chunkTotalFrames = CHUNK_ENTER + displayPerChunk + CHUNK_EXIT;
  const lastIndex        = arChunks.length - 1;

  // Outer enter/exit (whole ayah fade in/out)
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
        const isLast = i === lastIndex;

        // Build per-chunk ayah:
        //   - text_ar  → current chunk only
        //   - text_en/fr → full translation on last chunk, empty otherwise
        const chunkAyah: SelectedAyah = {
          ...ayah,
          text_ar: arChunk,
          text_en: isLast ? ayah.text_en : "",
          text_fr: isLast ? ayah.text_fr : "",
        };

        // AUDIO SYNC: chunks start from frame 0, not enterFrames
        const chunkFrom = i * chunkTotalFrames;

        return (
          <Sequence
            key={`chunk-${i}`}
            from={chunkFrom}
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
      <TextDisplay ayah={ayah} language={language} />
    </AbsoluteFill>
  );
};