import { AbsoluteFill, Audio, Sequence, useVideoConfig } from "remotion";
import { useMemo } from "react";
import type { VideoSettings } from "../types";
import { AyahScene } from "./AyahScene";
import { Background } from "./Background";
import { Watermark } from "./Watermark";
import { calculateTimeline } from "../utils/timeline";

export const QuranVideo: React.FC<VideoSettings> = ({
  selectedAyahs,
  chunks,
  background,
  animationStyle,
  watermark,
  logo,
  logoPosition,
  logoSize,
  language,
  includeAudio,
}) => {
  const { fps } = useVideoConfig();

  const timeline = useMemo(
    () => calculateTimeline(selectedAyahs, fps, chunks),
    [selectedAyahs, fps, chunks],
  );

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <Background background={background} />

      {timeline.map((segment, index) => (
        <Sequence
          key={`seg-${segment.ayah.ayahNumber}-${index}`}
          from={segment.startFrame}
          durationInFrames={segment.totalFrames}
        >
          {/* ── VISUAL — scoped to this chunk / ayah duration ── */}
          <AyahScene
            ayah={segment.ayah}
            animationStyle={animationStyle}
            language={language}
            enterFrames={segment.enterFrames}
            displayFrames={segment.displayFrames}
            exitFrames={segment.exitFrames}
            isChunk={segment.isChunk}
          />

          {/*
           * ── AUDIO — full ayah, not cut by chunk boundaries ──
           *
           * We wrap Audio in its own Sequence that starts at the same frame
           * but lasts audioTotalFrames (= sum of all chunks for this ayah).
           * This means the audio plays uninterrupted across all chunk visuals.
           * Only the first segment of each ayah (playAudio=true) fires it.
           */}
          {includeAudio && segment.playAudio && segment.ayah.audioUrl && (
            <Sequence
              from={0}
              durationInFrames={segment.audioTotalFrames}
              layout="none"
            >
              <Audio
                src={segment.ayah.audioUrl}
                startFrom={0}
                volume={1}
              />
            </Sequence>
          )}
        </Sequence>
      ))}

      <Watermark
        text={watermark}
        logoUrl={logo}
        position={logoPosition}
        size={logoSize}
      />
    </AbsoluteFill>
  );
};