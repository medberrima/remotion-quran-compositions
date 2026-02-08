import { AbsoluteFill, Img } from "remotion";
import type { LogoPosition } from "../types";

interface Props {
  text: string | null;
  logoUrl: string | null;
  position: LogoPosition;
  size: number;
}

export const Watermark: React.FC<Props> = ({
  text,
  logoUrl,
  position,
  size,
}) => {
  const positions: Record<string, any> = {
    "top-left": { top: 40, left: 40 },
    "top-right": { top: 40, right: 40 },
    "bottom-left": { bottom: 40, left: 40 },
    "bottom-right": { bottom: 40, right: 40 },
    center: {
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
    },
  };

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          ...positions[position.id],
          display: "flex",
          alignItems: "center",
          gap: "14px",
          padding: "12px 20px",
        }}
      >
        {/* Logo if provided */}
        {logoUrl && (
          <Img
            src={logoUrl}
            style={{
              width: `${size}px`,
              height: `${size}px`,
              objectFit: "contain",
              opacity: 0.95,
            }}
          />
        )}
        
        {/* Text watermark */}
        {text && (
          <div
            style={{
              color: "#FFFFFF",
              fontSize: "22px",
              fontWeight: 600,
              textShadow: "0 2px 8px rgba(0,0,0,0.6)",
              opacity: 0.9,
              fontFamily: '"Inter", sans-serif',
            }}
          >
            {text}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
