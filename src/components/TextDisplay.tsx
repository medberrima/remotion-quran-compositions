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
    fontSize: "24px",
    fontWeight: 700,
    color: "#FFFFFF",
    textShadow: "0 2px 8px rgba(0,0,0,0.5)",
    letterSpacing: "0.5px",
  };

  const playTextStyle: CSSProperties = {
    fontFamily: '"Inter", sans-serif',
    fontSize: "16px",
    fontWeight: 600,
    color: "rgba(255, 255, 255, 0.95)",
    textShadow: "0 2px 6px rgba(0,0,0,0.4)",
    display: "flex",
    alignItems: "center",
    gap: "6px",
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

      {/* Social Footer */}
      <div style={socialBarStyle}>
        {/* Social Icons */}
        <div style={iconsContainerStyle}>
          <InstagramIcon size={32} color="#FFFFFF" />
          <TiktokIcon size={32} color="#FFFFFF" />
          <FacebookIcon size={32} color="#FFFFFF" />
          <XIcon size={32} color="#FFFFFF" />
        </div>

        {/* Handle */}
        <div style={handleStyle}>@yaqeenapp</div>

        {/* Separator */}
        <div style={separatorStyle} />

        {/* Google Play */}
        <div style={playTextStyle}>
          <GooglePlayIcon size={20} color="#FFFFFF" />
          <span>Available on Google Play</span>
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
