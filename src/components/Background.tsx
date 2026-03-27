import { AbsoluteFill, Video, Img, useCurrentFrame, useVideoConfig } from 'remotion';
import type { Background as BgType } from '../types';

interface Props {
  background: BgType;
}

export const Background: React.FC<Props> = ({ background }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // ─── GRADIENT ────────────────────────────────────────────────────────────────
  if (background.type === 'gradient') {
    return (
      <AbsoluteFill style={{ background: background.style }} />
    );
  }

  // ─── IMAGE (Ken Burns) ────────────────────────────────────────────────────────
  if (background.type === 'image') {
    const progress = frame / durationInFrames;
    const scale = 1 + progress * 0.05;
    const translateX = Math.sin(progress * Math.PI) * 2;

    return (
      <AbsoluteFill>
        <Img
          src={background.url || ''}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: `scale(${scale}) translateX(${translateX}%)`,
            // blur() removed — very expensive at 1080×1920
            filter: 'brightness(0.65)',
          }}
        />
      </AbsoluteFill>
    );
  }

  // ─── VIDEO ────────────────────────────────────────────────────────────────────
  if (background.type === 'video') {

    // ✅ FAST PATH: pre-extracted JPEG frames read via file:// URL.
    //    file:// bypasses HTTP entirely — Chromium reads straight from disk.
    //    framesBaseUrl is set to a file:// URL by the server (e.g. file:///G:/uploads/frames-xxx)
    //    --allow-file-access-from-files must be set in chromiumOptions on the server.
    if (background.framesBaseUrl && background.totalFrames && background.totalFrames > 0) {
      const videoFrame = (frame % background.totalFrames) + 1;
      const framePad = String(videoFrame).padStart(5, '0');
      const src = `${background.framesBaseUrl}/frame_${framePad}.jpg`;

      return (
        <AbsoluteFill>
          <Img
            src={src}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              // blur() removed — expensive and barely visible
              filter: 'brightness(0.6)',
            }}
          />
        </AbsoluteFill>
      );
    }

    // ⚠️ FALLBACK: <Video> if frames were not pre-extracted (slow)
    return (
      <AbsoluteFill>
        <Video
          src={background.url || ''}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'brightness(0.6)',
          }}
          loop
          muted
        />
      </AbsoluteFill>
    );
  }

  return null;
};