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
        startFrame:       cursor,
        enterFrames,
        displayFrames,
        exitFrames,
        totalFrames,
        audioStartFrame:  cursor,
        audioTotalFrames: totalFrames, // audio = full segment
        playAudio:        true,
        isChunk:          false,
      });

      cursor += totalFrames;

    } else {
      // ── Chunked ayah ─────────────────────────────────────────────────────
      // 1. Pre-calculate total frames for all chunks combined → audio duration
      const chunkFrames = ayahChunks.map((chunk) => {
        const ef = Math.round(ENTER_SECONDS * fps);
        const xf = Math.round(EXIT_SECONDS  * fps);
        const df = Math.max(Math.round(fps * 0.5), Math.round(chunk.duration * fps) - ef - xf);
        return ef + df + xf;
      });
      const audioTotalFrames = chunkFrames.reduce((s, f) => s + f, 0);
      const audioStartFrame  = cursor; // audio starts at the first chunk

      // 2. Create one segment per chunk
      ayahChunks.forEach((chunk, idx) => {
        const totalFrames = chunkFrames[idx];
        const enterFrames = Math.round(ENTER_SECONDS * fps);
        const exitFrames  = Math.round(EXIT_SECONDS  * fps);
        const displayFrames = totalFrames - enterFrames - exitFrames;

        segments.push({
          ayah: { ...ayah, text_ar: chunk.text_ar, text_en: chunk.text_en, text_fr: chunk.text_fr },
          startFrame:       cursor,
          enterFrames,
          displayFrames,
          exitFrames,
          totalFrames,
          audioStartFrame,
          audioTotalFrames, // same for all chunks of this ayah
          playAudio:        idx === 0, // only first chunk triggers audio
          isChunk:          true,
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