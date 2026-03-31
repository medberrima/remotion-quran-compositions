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

  // ── Audio map: one entry per ayah ────────────────────────────────────────
  // Find the startFrame of the first segment for each ayah, use original
  // selectedAyahs for audioUrl + full duration — chunks never affect audio.
  const ayahAudioSegments = useMemo(() => {
    return selectedAyahs
      .filter((ayah) => ayah.audioUrl)
      .map((ayah) => {
        // First timeline segment that belongs to this ayah
        const firstSeg = timeline.find(
          (s) => s.ayah.ayahNumber === ayah.ayahNumber,
        );
        return {
          ayah,
          startFrame:      firstSeg?.startFrame ?? 0,
          durationInFrames: Math.max(1, Math.round(ayah.duration * fps)),
        };
      });
  }, [selectedAyahs, timeline, fps]);

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <Background background={background} />

      {/* ── VISUALS — one Sequence per timeline segment (chunks or full) ── */}
      {timeline.map((segment, index) => (
        <Sequence
          key={`vis-${segment.ayah.ayahNumber}-${index}`}
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
            isChunk={segment.isChunk}
          />
        </Sequence>
      ))}

      {/* ── AUDIO — one Sequence per full ayah, unaffected by chunks ─────── */}
      {includeAudio &&
        ayahAudioSegments.map(({ ayah, startFrame, durationInFrames }) => (
          <Sequence
            key={`audio-${ayah.ayahNumber}`}
            from={startFrame}
            durationInFrames={durationInFrames}
          >
            <Audio
              src={ayah.audioUrl!}
              startFrom={0}
              volume={1}
            />
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