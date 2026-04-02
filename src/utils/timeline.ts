import type { Chunk, SelectedAyah, TimelineSegment } from "../types";

const ENTER_SECONDS = 0.5;
const EXIT_SECONDS  = 0.3;

export function calculateTimeline(
  ayahs: SelectedAyah[],
  fps: number,
  chunks: Chunk[] = [],
): TimelineSegment[] {
  const segments: TimelineSegment[] = [];
  let cursor = 0;

  for (const ayah of ayahs) {
    const ayahChunks = chunks.filter((c) => c.ayahNumber === ayah.ayahNumber);

    if (ayahChunks.length === 0) {
      // ── Full ayah — no chunks ────────────────────────────────────────────
      const enterFrames   = Math.round(ENTER_SECONDS * fps);
      const exitFrames    = Math.round(EXIT_SECONDS  * fps);
      const displayFrames = Math.max(
        fps,
        Math.round(ayah.duration * fps) - enterFrames - exitFrames,
      );
      const totalFrames = enterFrames + displayFrames + exitFrames;

      segments.push({
        ayah,
        startFrame:      cursor,
        enterFrames,
        displayFrames,
        exitFrames,
        totalFrames,
        audioStartFrame: cursor,
        playAudio:       true,
        isChunk:         false,
        isLastChunk:     false, // not a chunk — TextDisplay uses !isChunk to show ornament
      });

      cursor += totalFrames;

    } else {
      // ── Chunked ayah — one segment per chunk ────────────────────────────
      const audioStartFrame = cursor;
      const lastIdx         = ayahChunks.length - 1;

      ayahChunks.forEach((chunk, idx) => {
        const enterFrames   = Math.round(ENTER_SECONDS * fps);
        const exitFrames    = Math.round(EXIT_SECONDS  * fps);
        const displayFrames = Math.max(
          Math.round(fps * 0.5),
          Math.round(chunk.duration * fps) - enterFrames - exitFrames,
        );
        const totalFrames = enterFrames + displayFrames + exitFrames;

        const chunkAyah: SelectedAyah = {
          ...ayah,
          text_ar: chunk.text_ar,
          text_en: chunk.text_en,
          text_fr: chunk.text_fr,
        };

        segments.push({
          ayah:            chunkAyah,
          startFrame:      cursor,
          enterFrames,
          displayFrames,
          exitFrames,
          totalFrames,
          audioStartFrame,
          playAudio:       idx === 0,
          isChunk:         true,
          isLastChunk:     idx === lastIdx, // ← ornament only on the last chunk
        });

        cursor += totalFrames;
      });
    }
  }

  return segments;
}

export function calculateTotalDuration(
  ayahs: SelectedAyah[],
  fps: number,
  chunks: Chunk[] = [],
): number {
  const timeline = calculateTimeline(ayahs, fps, chunks);
  if (timeline.length === 0) return fps * 10;
  const last = timeline[timeline.length - 1];
  return last.startFrame + last.totalFrames;
}