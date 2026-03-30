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

  // ONE LINE SOCIAL FOOTER - same structure as before, refined content
  const socialBarStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "16px",
    padding: "16px 40px",
    margin: "32px 0",
    background: "rgba(0, 0, 0, 0.4)",
    border: "2px solid rgba(255, 255, 255, 0.15)",
    borderRadius: "100px",
    flexWrap: "wrap",
  };

  const iconsContainerStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  };

  const separatorStyle: CSSProperties = {
    width: "2px",
    height: "28px",
    background: "rgba(255, 255, 255, 0.25)",
  };

  const handleStyle: CSSProperties = {
    fontFamily: '"Inter", sans-serif',
    fontSize: "22px",
    fontWeight: 700,
    color: "#FFFFFF",
    textShadow: "0 2px 8px rgba(0,0,0,0.5)",
    letterSpacing: "0.5px",
  };

  // Bilingual CTA block — AR primary, EN secondary
  const ctaBlockStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "3px",
  };

  const ctaArStyle: CSSProperties = {
    fontFamily: '"Amiri", "Traditional Arabic", serif',
    fontSize: "19px",
    fontWeight: 700,
    color: "#FFFFFF",
    textShadow: "0 2px 6px rgba(0,0,0,0.4)",
    direction: "rtl",
    lineHeight: 1.1,
  };

  const ctaEnStyle: CSSProperties = {
    fontFamily: '"Inter", sans-serif',
    fontSize: "13px",
    fontWeight: 500,
    color: "rgba(255, 255, 255, 0.7)",
    letterSpacing: "0.2px",
    lineHeight: 1.1,
    display: "flex",
    alignItems: "center",
    gap: "5px",
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

  return (
    <div style={containerStyle}>
      {/* Arabic Text */}
      <div style={arabicTextStyle}>
        {getAyahTextWithoutBasmala(ayah.text_ar)}
      </div>

      {/* ONE LINE FOOTER */}
      <div style={socialBarStyle}>

        {/* 1st — Google Play CTA (PRIMARY) — bilingual */}
        <div style={ctaBlockStyle}>
          <span style={ctaArStyle}>حمّل مجاناً</span>
          <div style={ctaEnStyle}>
            <GooglePlayIcon size={12} color="rgba(255,255,255,0.7)" />
            <span>Free on Google Play</span>
          </div>
        </div>

        <div style={separatorStyle} />

        {/* 2nd — Handle */}
        <div style={handleStyle}>@YaqeenMuslimApp</div>

        <div style={separatorStyle} />

        {/* 3rd — Social icons (SECONDARY) */}
        <div style={iconsContainerStyle}>
          <InstagramIcon size={28} color="#FFFFFF" />
          <TiktokIcon    size={28} color="#FFFFFF" />
          <FacebookIcon  size={28} color="#FFFFFF" />
          <XIcon         size={28} color="#FFFFFF" />
        </div>

      </div>

      {/* Translation (if not Arabic) */}
      {language !== "ar" && (
        <div style={translationStyle}>{translationText}</div>
      )}

      {/* Surah and Ayah reference */}
      <div style={metaStyle}>
        {ayah.surahName} • Ayah {ayah.ayahNumber}
      </div>
    </div>
  );
};