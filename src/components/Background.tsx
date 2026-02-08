import { AbsoluteFill, Video, Img, useCurrentFrame, useVideoConfig } from 'remotion';
import type { Background as BgType } from '../types';

interface Props {
  background: BgType;
}

export const Background: React.FC<Props> = ({ background }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  
  if (background.type === 'gradient') {
    return (
      <AbsoluteFill
        style={{
          background: background.style,
        }}
      />
    );
  }
  
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
            filter: 'brightness(0.65) blur(1px)',
          }}
        />
      </AbsoluteFill>
    );
  }
  
  if (background.type === 'video') {
    return (
      <AbsoluteFill>
        <Video
          src={background.url || ''}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'brightness(0.6) blur(1px)',
          }}
          loop
          muted
        />
      </AbsoluteFill>
    );
  }
  
  return null;
};
