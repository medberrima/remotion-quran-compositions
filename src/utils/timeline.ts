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
