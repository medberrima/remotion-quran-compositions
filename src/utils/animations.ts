import { CSSProperties } from "react";

export function getAnimationStyle(
  animationId: string,
  enterProgress: number,
  exitProgress: number
): CSSProperties {
  const isEntering = enterProgress < 1;
  const isExiting = exitProgress > 0;

  switch (animationId) {
    case "fade":
      return {
        opacity: isEntering
          ? enterProgress
          : isExiting
            ? 1 - exitProgress
            : 1,
      };

    case "slide-up":
      return {
        opacity: isEntering
          ? enterProgress
          : isExiting
            ? 1 - exitProgress
            : 1,
        transform: isEntering
          ? `translateY(${(1 - enterProgress) * 100}px)`
          : isExiting
            ? `translateY(${-exitProgress * 100}px)`
            : "translateY(0)",
      };

    case "slide-down":
      return {
        opacity: isEntering
          ? enterProgress
          : isExiting
            ? 1 - exitProgress
            : 1,
        transform: isEntering
          ? `translateY(${-(1 - enterProgress) * 100}px)`
          : isExiting
            ? `translateY(${exitProgress * 100}px)`
            : "translateY(0)",
      };

    case "zoom":
      return {
        opacity: isEntering
          ? enterProgress
          : isExiting
            ? 1 - exitProgress
            : 1,
        transform: isEntering
          ? `scale(${0.8 + enterProgress * 0.2})`
          : isExiting
            ? `scale(${1 - exitProgress * 0.2})`
            : "scale(1)",
      };

    default:
      return {
        opacity: 1,
      };
  }
}
