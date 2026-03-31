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
          <AyahScene
            ayah={segment.ayah}
            animationStyle={animationStyle}
            language={language}
            enterFrames={segment.enterFrames}
            displayFrames={segment.displayFrames}
            exitFrames={segment.exitFrames}
            isChunk={segment.isChunk}  // ← passed down
          />

          {includeAudio && segment.playAudio && segment.ayah.audioUrl && (
            <Audio
              src={segment.ayah.audioUrl}
              startFrom={0}
              volume={1}
            />
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