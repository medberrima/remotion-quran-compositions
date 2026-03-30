import { CSSProperties } from "react";
import { FacebookIcon, InstagramIcon, TiktokIcon, XIcon, GooglePlayIcon } from "../assets/icons";
import type { Language, SelectedAyah } from "../types";
import { getAyahTextWithoutBasmala } from "../utils/textUtils";

interface Props {
  ayah: SelectedAyah;
  language: Language;
}

export const TextDisplay: React.FC<Props> = ({ ayah, language }) => {
  const isArabic = language === "ar";

  const translationText =
    language === "ar"
      ? ayah.text_ar
      : language === "en"
        ? ayah.text_en
        : ayah.text_fr;

  const containerStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "60px 50px",
    maxWidth: "95%",
    textAlign: "center",
    gap: "0px",
  };

  const arabicTextStyle: CSSProperties = {
    fontFamily: '"Amiri", "Traditional Arabic", serif',
    fontSize: "52px",
    lineHeight: 1.9,
    color: "#FFFFFF",
    textShadow: "0 4px 20px rgba(0,0,0,0.6), 0 2px 8px rgba(0,0,0,0.4)",
    marginBottom: "0px",
    direction: "rtl",
    fontWeight: 400,
    WebkitFontSmoothing: "antialiased",
    MozOsxFontSmoothing: "grayscale",
  };

  const translationStyle: CSSProperties = {
    fontFamily: '"Cairo", "Inter", sans-serif',
    fontSize: isArabic ? "52px" : "34px",
    lineHeight: isArabic ? 1.9 : 1.6,
    color: isArabic ? "#FFFFFF" : "rgba(255,255,255,0.95)",
    textShadow: "0 3px 16px rgba(0,0,0,0.5), 0 2px 6px rgba(0,0,0,0.3)",
    direction: isArabic ? "rtl" : "ltr",
    fontWeight: isArabic ? 400 : 500,
    WebkitFontSmoothing: "antialiased",
    MozOsxFontSmoothing: "grayscale",
    marginBottom: isArabic ? "40px" : "0",
  };

  const metaStyle: CSSProperties = {
    fontFamily: '"Cairo", sans-serif',
    fontSize: "22px",
    color: "rgba(255,255,255,0.85)",
    marginTop: "40px",
    textShadow: "0 2px 12px rgba(0,0,0,0.5)",
    fontWeight: 500,
    letterSpacing: "0.5px",
  };

  // ── ONE LINE BAR ───────────────────────────────────────────────────────────
  const barStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0px",
    padding: "11px 30px",
    margin: "28px 0 10px",
    background: "rgba(0, 0, 0, 0.4)",
    border: "1.5px solid rgba(255, 255, 255, 0.15)",
    borderRadius: "100px",
    flexWrap: "nowrap",
    whiteSpace: "nowrap",
  };

  // Shared text base
  const baseText: CSSProperties = {
    fontFamily: '"Cairo", sans-serif',
    fontWeight: 700,
    color: "#FFFFFF",
    lineHeight: 1,
    whiteSpace: "nowrap",
    WebkitFontSmoothing: "antialiased",
  };

  const appNameArStyle: CSSProperties = {
    ...baseText,
    fontSize: "20px",
    direction: "rtl",
  };

  const dividerStyle: CSSProperties = {
    width: "1.5px",
    height: "20px",
    background: "rgba(255,255,255,0.22)",
    margin: "0 14px",
    flexShrink: 0,
  };

  const googlePlayStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "7px",
  };

  const storeNameStyle: CSSProperties = {
    ...baseText,
    fontSize: "15px",
    fontWeight: 600,
    color: "rgba(255,255,255,0.88)",
  };

  const dividerDotStyle: CSSProperties = {
    fontSize: "15px",
    color: "rgba(255,255,255,0.3)",
    margin: "0 12px",
    lineHeight: 1,
  };

  const appNameEnStyle: CSSProperties = {
    ...baseText,
    fontSize: "20px",
    fontWeight: 700,
  };

  const ctaArStyle: CSSProperties = {
    ...baseText,
    fontSize: "20px",
    direction: "rtl",
    color: "rgba(255,255,255,0.92)",
    fontWeight: 600,
  };

  // ── SOCIAL ROW — tiny, below ───────────────────────────────────────────────
  const socialRowStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "9px",
    opacity: 0.55,
  };

  const handleStyle: CSSProperties = {
    fontFamily: '"Cairo", sans-serif',
    fontSize: "13px",
    fontWeight: 500,
    color: "#FFFFFF",
    whiteSpace: "nowrap",
  };

  const iconsDotStyle: CSSProperties = {
    fontSize: "11px",
    color: "rgba(255,255,255,0.4)",
  };

  return (
    <div style={containerStyle}>

      {/* Arabic Text */}
      <div style={arabicTextStyle}>
        {getAyahTextWithoutBasmala(ayah.text_ar)}
      </div>

      {/* Translation (if not Arabic) */}
      {language !== "ar" && (
        <div style={translationStyle}>{translationText}</div>
      )}

      {/* Surah and Ayah reference */}
      <div style={metaStyle}>
        {ayah.surahName} • Ayah {ayah.ayahNumber}
      </div>

      {/* ── ONE LINE ─────────────────────────────────────────────────────────
          يقين المسلم  |  🎮 Google Play  ·  Yaqeen Muslim  |  حمّل مجاناً
      ─────────────────────────────────────────────────────────────────────── */}
      <div style={barStyle}>

        {/* يقين المسلم */}
        <span style={appNameArStyle}>يقين المسلم</span>

        <div style={dividerStyle} />

        {/* Google Play icon + name */}
        <div style={googlePlayStyle}>
          <GooglePlayIcon size={17} color="rgba(255,255,255,0.88)" />
          <span style={storeNameStyle}>Google Play</span>
        </div>

        <span style={dividerDotStyle}>—</span>

        {/* Yaqeen Muslim */}
        <span style={appNameEnStyle}>Yaqeen Muslim</span>

        <div style={dividerStyle} />

        {/* حمّل مجاناً */}
        <span style={ctaArStyle}>حمّل مجاناً</span>

      </div>

      {/* ── SOCIAL — tiny, subtle ─────────────────────────────────────────── */}
      <div style={socialRowStyle}>
        <InstagramIcon size={16} color="#FFFFFF" />
        <TiktokIcon    size={16} color="#FFFFFF" />
        <FacebookIcon  size={16} color="#FFFFFF" />
        {/* <XIcon         size={16} color="#FFFFFF" /> */}
        <span style={iconsDotStyle}>·</span>
        <span style={handleStyle}>@YaqeenMuslimApp</span>
      </div>

    </div>
  );
};