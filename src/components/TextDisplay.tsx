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
    fontFamily: '"Inter", "Segoe UI", sans-serif',
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
    fontFamily: '"Inter", sans-serif',
    fontSize: "22px",
    color: "rgba(255,255,255,0.85)",
    marginTop: "40px",
    textShadow: "0 2px 12px rgba(0,0,0,0.5)",
    fontWeight: 500,
    letterSpacing: "0.5px",
  };

  // ── PRIMARY BAR — App name + Download CTA ──────────────────────────────────
  const primaryBarStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "14px",
    padding: "12px 32px",
    marginTop: "28px",
    marginBottom: "8px",
    background: "rgba(0, 0, 0, 0.4)",
    border: "1.5px solid rgba(255, 255, 255, 0.15)",
    borderRadius: "100px",
    flexWrap: "nowrap",
  };

  const separatorStyle: CSSProperties = {
    width: "1.5px",
    height: "24px",
    background: "rgba(255, 255, 255, 0.25)",
    flexShrink: 0,
  };

  // App name — Arabic + Latin stacked
  const appNameWrapStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "1px",
  };

  const appNameArStyle: CSSProperties = {
    fontFamily: '"Amiri", "Traditional Arabic", serif',
    fontSize: "19px",
    fontWeight: 700,
    color: "#FFFFFF",
    direction: "rtl",
    lineHeight: 1.1,
    whiteSpace: "nowrap",
  };

  const appNameEnStyle: CSSProperties = {
    fontFamily: '"Inter", sans-serif',
    fontSize: "12px",
    fontWeight: 500,
    color: "rgba(255,255,255,0.6)",
    letterSpacing: "0.3px",
    lineHeight: 1.1,
    whiteSpace: "nowrap",
  };

  // CTA — حمّل مجاناً + Google Play
  const ctaStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "7px",
    flexWrap: "nowrap",
  };

  const ctaArStyle: CSSProperties = {
    fontFamily: '"Amiri", "Traditional Arabic", serif',
    fontSize: "19px",
    fontWeight: 700,
    color: "#FFFFFF",
    direction: "rtl",
    lineHeight: 1,
    whiteSpace: "nowrap",
  };

  const ctaEnStyle: CSSProperties = {
    fontFamily: '"Inter", sans-serif',
    fontSize: "14px",
    fontWeight: 600,
    color: "rgba(255,255,255,0.9)",
    letterSpacing: "0.2px",
    whiteSpace: "nowrap",
    display: "flex",
    alignItems: "center",
    gap: "5px",
  };

  // ── SECONDARY ROW — Social icons + handle (tiny, below) ───────────────────
  const socialRowStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    marginBottom: "0px",
    opacity: 0.65,
  };

  const iconsStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  };

  const handleStyle: CSSProperties = {
    fontFamily: '"Inter", sans-serif',
    fontSize: "13px",
    fontWeight: 500,
    color: "#FFFFFF",
    letterSpacing: "0.2px",
    whiteSpace: "nowrap",
  };

  const dotStyle: CSSProperties = {
    color: "rgba(255,255,255,0.4)",
    fontSize: "12px",
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

      {/* ── PRIMARY BAR — App name + Download ── */}
      <div style={primaryBarStyle}>

        {/* App name: يقين المسلم / Yaqeen Muslim */}
        <div style={appNameWrapStyle}>
          <span style={appNameArStyle}>يقين المسلم</span>
          <span style={appNameEnStyle}>Yaqeen Muslim</span>
        </div>

        <div style={separatorStyle} />

        {/* CTA: حمّل مجاناً · Google Play icon + text */}
        <div style={ctaStyle}>
          <span style={ctaArStyle}>حمّل مجاناً</span>
          <span style={dotStyle}>·</span>
          <div style={ctaEnStyle}>
            <GooglePlayIcon size={15} color="rgba(255,255,255,0.9)" />
            <span>Google Play</span>
          </div>
        </div>

      </div>

      {/* ── SECONDARY — Social icons + handle (small, subtle) ── */}
      <div style={socialRowStyle}>
        <div style={iconsStyle}>
          <InstagramIcon size={18} color="#FFFFFF" />
          <TiktokIcon    size={18} color="#FFFFFF" />
          <FacebookIcon  size={18} color="#FFFFFF" />
          <XIcon         size={18} color="#FFFFFF" />
        </div>
        <span style={dotStyle}>·</span>
        <span style={handleStyle}>@YaqeenMuslimApp</span>
      </div>

    </div>
  );
};