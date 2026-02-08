import React from "react";

export function getAnimationStyle(
  styleId: string,
  enterProgress: number,
  exitProgress: number
): React.CSSProperties {
  const isExiting = exitProgress > 0;
  const opacity = isExiting ? 1 - exitProgress : enterProgress;
  
  switch (styleId) {
    case 'fade':
      return { opacity };
      
    case 'slide':
      const translateY = isExiting
        ? exitProgress * -50
        : (1 - enterProgress) * 50;
      return {
        opacity,
        transform: `translateY(${translateY}px)`,
      };
      
    case 'zoom':
      const scale = isExiting
        ? 1 + exitProgress * 0.2
        : 0.85 + enterProgress * 0.15;
      return {
        opacity,
        transform: `scale(${scale})`,
      };
      
    case 'slide-up':
      const slideUp = isExiting
        ? exitProgress * -100
        : (1 - enterProgress) * 100;
      return {
        opacity,
        transform: `translateY(${slideUp}px)`,
      };
      
    default:
      return { opacity };
  }
}
