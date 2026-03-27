export type Language = "ar" | "en" | "fr";

export interface SelectedAyah {
  surahNumber: number;
  ayahNumber: number;
  surahName: string;
  text_ar: string;
  text_en: string;
  text_fr: string;
  audioUrl?: string;
  duration: number; // in seconds
}

export interface AnimationStyle {
  id: string;
  name: string;
}

export interface Background {
  id: string;
  name: string;
  type: "gradient" | "image" | "video";
  style?: string;
  url?: string;
  // ✅ NEW: pre-extracted frame data for video backgrounds (avoids <Video> Chromium decoding)
  // framesBaseUrl: full URL to frames directory e.g. "http://localhost:3000/uploads/frames-xxx"
  // totalFrames: total number of extracted frames (used to loop correctly)
  framesBaseUrl?: string;
  totalFrames?: number;
}

export type LogoPositionId = "top-left" | "top-right" | "bottom-left" | "bottom-right" | "center";

export interface LogoPosition {
  id: LogoPositionId;
  name: string;
}

export interface VideoSettings {
  selectedAyahs: SelectedAyah[];
  background: Background;
  animationStyle: AnimationStyle;
  watermark: string | null;
  logo: string | null;
  logoPosition: LogoPosition;
  logoSize: number;
  language: Language;
  includeAudio: boolean;
}

export interface TimelineSegment {
  ayah: SelectedAyah;
  startFrame: number;
  enterFrames: number;
  displayFrames: number;
  exitFrames: number;
  totalFrames: number;
  audioStartFrame: number;
}