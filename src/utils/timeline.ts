import type { SelectedAyah, TimelineSegment } from "../types";

const ENTER_DURATION = 0.5; // seconds
const EXIT_DURATION = 0.5; // seconds
const MIN_DISPLAY_DURATION = 2; // seconds

export function calculateTimeline(
  ayahs: SelectedAyah[],
  fps: number
): TimelineSegment[] {
  const timeline: TimelineSegment[] = [];
  let currentFrame = 0;

  for (const ayah of ayahs) {
    const enterFrames = Math.round(ENTER_DURATION * fps);
    const exitFrames = Math.round(EXIT_DURATION * fps);
    
    // Calculate display duration based on audio duration
    const audioDurationFrames = Math.round(ayah.audioDuration * fps);
    const displayFrames = Math.max(
      Math.round(MIN_DISPLAY_DURATION * fps),
      audioDurationFrames - enterFrames
    );

    const totalFrames = enterFrames + displayFrames + exitFrames;

    timeline.push({
      ayah,
      startFrame: currentFrame,
      enterFrames,
      displayFrames,
      exitFrames,
      totalFrames,
    });

    currentFrame += totalFrames;
  }

  return timeline;
}

export function calculateTotalDuration(
  ayahs: SelectedAyah[],
  fps: number
): number {
  const timeline = calculateTimeline(ayahs, fps);
  
  if (timeline.length === 0) {
    return 300; // Default 10 seconds if no ayahs
  }
  
  const lastSegment = timeline[timeline.length - 1];
  const totalFrames = lastSegment.startFrame + lastSegment.totalFrames;
  
  return totalFrames;
}
