import type { SelectedAyah, Chunk } from '../types';

export interface TimelineSegment {
  ayah: SelectedAyah;
  startFrame: number;
  enterFrames: number;
  displayFrames: number;
  exitFrames: number;
  totalFrames: number;
  audioStartFrame: number;
  chunks?: Chunk[];
}

export function calculateTimeline(
  ayahs: SelectedAyah[],
  fps: number,
  chunks?: Chunk[]
): TimelineSegment[] {
  let currentFrame = 0;
  
  return ayahs.map((ayah) => {
    // Animations overlap with audio - don't add extra time
    const enterFrames = Math.floor(0.6 * fps);
    const exitFrames = Math.floor(0.6 * fps);
    
    // EXACT audio duration in frames
    const displayFrames = Math.floor(ayah.duration * fps);
    
    // Get chunks for this ayah
    const ayahChunks = chunks?.filter(c => c.ayahNumber === ayah.ayahNumber) || [];
    
    const segment: TimelineSegment = {
      ayah,
      startFrame: currentFrame,
      enterFrames,
      displayFrames,
      exitFrames,
      totalFrames: displayFrames, // Audio duration only
      audioStartFrame: currentFrame,
      chunks: ayahChunks,
    };
    
    // Next starts exactly when this audio ends
    currentFrame += displayFrames;
    
    return segment;
  });
}

/**
 * Calculate total video duration in frames
 * Returns EXACT sum of audio durations, no extra milliseconds
 */
export function calculateTotalDuration(ayahs: SelectedAyah[], fps: number): number {
  // Sum all audio durations in seconds, then convert to frames
  const totalSeconds = ayahs.reduce((sum, ayah) => sum + ayah.duration, 0);
  return Math.floor(totalSeconds * fps);
}

/**
 * Calculate frame timing for a specific chunk
 * Useful for word-by-word highlighting
 */
export function getChunkFrameTiming(
  chunk: Chunk,
  ayahDuration: number,
  fps: number
): { startFrame: number; endFrame: number } {
  const chunkStartTime = (chunk.duration * chunk.wordIndices[0]) / chunk.wordIndices.length;
  const chunkEndTime = chunkStartTime + chunk.duration;
  
  return {
    startFrame: Math.floor(chunkStartTime * fps),
    endFrame: Math.floor(chunkEndTime * fps),
  };
}