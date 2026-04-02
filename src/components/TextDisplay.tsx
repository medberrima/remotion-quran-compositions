import { CSSProperties } from "react";
import {
  FacebookIcon,
  InstagramIcon,
  TiktokIcon,
  GooglePlayIcon,
  XIcon,
} from "../assets/icons";
import type { Language, SelectedAyah } from "../types";
import { getAyahTextWithoutBasmala } from "../utils/textUtils";

// ── Surah Name V4 font ─────────────────────────────────────────────────────
const SURAH_FONT_URL =
  "https://static-cdn.tarteel.ai/qul/fonts/surah-names/v4/surah-name-v4.ttf";

const FONT_FACE = `
  @font-face {
    font-family: 'surah-name-v4-icon';
    src: url('${SURAH_FONT_URL}') format('truetype');
    font-display: swap;
  }
`;

if (typeof document !== "undefined") {
  const STYLE_ID = "__surah-name-v4-style__";
  if (!document.getElementById(STYLE_ID)) {
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = FONT_FACE;
    document.head.appendChild(style);
  }
}

const surahLigature = (surahNumber: number): string =>
  `surah${String(surahNumber).padStart(3, "0")}`;

// ─────────────────────────────────────────────────────────────────────────────

interface Props {
  ayah: SelectedAyah;
  language: Language;
  isChunk?: boolean;
}

export const TextDisplay: React.FC<Props> = ({
  ayah,
  language,
  isChunk = false,
}) => {
  const isArabic = language === "ar";

  const translationText =
    language === "ar"
      ? ayah.text_ar
      : language === "en"
        ? ayah.text_en
        : ayah.text_fr;

  const arabicDisplayText = getAyahTextWithoutBasmala(ayah.text_ar);

  // ── Styles ────────────────────────────────────────────────────────────────

  const containerStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "30px 30px",
    maxWidth: "95%",
    textAlign: "center",
  };

  // Header row (icon + surah name inline)
  const surahHeaderRowStyle: CSSProperties = {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    marginBottom: "40px",
  };

  const surahIconStyle: CSSProperties = {
    fontFamily: "'surah-name-v4-icon'",
    fontSize: "64px",
    color: "rgba(255,255,255,0.92)",
    lineHeight: 1.1,
    userSelect: "none",
  };

  const surahNameStyle: CSSProperties = {
    fontFamily: "'surah-name-v4-icon'",
    fontSize: "64px",
    color: "rgba(255,255,255,0.92)",
    lineHeight: 1.1,
    textShadow: "0 2px 16px rgba(0,0,0,0.45)",
    userSelect: "none",
  };

  const separatorStyle: CSSProperties = {
    width: "60px",
    height: "1px",
    background: "rgba(255,255,255,0.25)",
    margin: "16px auto 0",
    borderRadius: "1px",
  };

  const arabicTextStyle: CSSProperties = {
    fontFamily: '"Amiri", "Traditional Arabic", serif',
    fontSize: "52px",
    lineHeight: 1.9,
    color: "#FFFFFF",
    textShadow: "0 4px 20px rgba(0,0,0,0.6)",
    direction: "rtl",
    fontWeight: 400,
  };

  const translationStyle: CSSProperties = {
    fontFamily: '"Cairo", "Inter", sans-serif',
    fontSize: isArabic ? "52px" : "34px",
    lineHeight: isArabic ? 1.9 : 1.6,
    color: isArabic ? "#FFFFFF" : "rgba(255,255,255,0.95)",
    textShadow: "0 2px 10px rgba(0,0,0,0.4)",
    direction: isArabic ? "rtl" : "ltr",
    fontWeight: isArabic ? 400 : 500,
    marginBottom: isArabic ? "40px" : "0",
  };

  const metaStyle: CSSProperties = {
    fontFamily: '"Cairo", sans-serif',
    fontSize: "20px",
    color: "rgba(255,255,255,0.75)",
    marginTop: "36px",
    textShadow: "0 2px 12px rgba(0,0,0,0.5)",
    fontWeight: 500,
  };

  const barStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
    padding: "10px 25px",
    margin: "28px 0 10px",
    background: "rgba(0, 0, 0, 0.23)",
    borderRadius: "50px",
    fontFamily: '"Cairo", sans-serif',
    fontSize: "18px",
    fontWeight: 700,
    color: "#FFFFFF",
    opacity: 0.9,
  };

  const storeIconStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "5px",
  };

  const socialRowStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    opacity: 0.7,
    marginTop: "8px",
  };

  const handleStyle: CSSProperties = {
    fontFamily: '"Cairo", sans-serif',
    fontSize: "13px",
    fontWeight: 500,
    color: "#FFFFFF",
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div style={containerStyle}>

      {/* ── SURAH HEADER (ICON + NAME INLINE) ── */}
      <div>
        <div style={surahHeaderRowStyle}>
          <span style={surahNameStyle}>
            {surahLigature(ayah.surahNumber)}
          </span>
          <span style={surahIconStyle}>surah-icon</span>
        </div>
        <div style={separatorStyle} />
      </div>

      {/* ── ARABIC VERSE ── */}
      <div style={arabicTextStyle}>{arabicDisplayText}</div>

      {/* ── TRANSLATION ── */}
      {language !== "ar" && (
        <div style={translationStyle}>{translationText}</div>
      )}

      {/* ── AYAH NUMBER ── */}
      <div style={metaStyle}>﴿ {ayah.ayahNumber} ﴾</div>

      {/* ── DOWNLOAD BAR ── */}
      <div style={barStyle}>
        <div style={storeIconStyle}>
          <GooglePlayIcon size={17} color="#FFFFFF" />
          Google Play
        </div>
        <span>•</span>
        Yaqeen Muslim - يقين المسلم
        <span>•</span>
        حمّل مجاناً
      </div>

      {/* ── SOCIAL ROW ── */}
      <div style={socialRowStyle}>
        <InstagramIcon size={16} color="#FFFFFF" />
        <FacebookIcon size={16} color="#FFFFFF" />
        <XIcon size={16} color="#FFFFFF" />
        <TiktokIcon size={16} color="#FFFFFF" />
        <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)" }}>
          ·
        </span>
        <span style={handleStyle}>@YaqeenMuslimApp</span>
      </div>

    </div>
  );
};