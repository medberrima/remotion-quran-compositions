import { CSSProperties } from "react";
import { GooglePlayIcon } from "../assets/icons";
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
    padding: "60px 50px 40px",
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
    direction: "rtl",
    fontWeight: 400,
    WebkitFontSmoothing: "antialiased",
  };

  const translationStyle: CSSProperties = {
    fontFamily: '"Inter", "Segoe UI", sans-serif',
    fontSize: isArabic ? "52px" : "34px",
    lineHeight: isArabic ? 1.9 : 1.6,
    color: isArabic ? "#FFFFFF" : "rgba(255,255,255,0.95)",
    textShadow: "0 3px 16px rgba(0,0,0,0.5)",
    direction: isArabic ? "rtl" : "ltr",
    fontWeight: isArabic ? 400 : 500,
    WebkitFontSmoothing: "antialiased",
  };

  const metaStyle: CSSProperties = {
    fontFamily: '"Amiri", "Traditional Arabic", serif',
    fontSize: "22px",
    color: "rgba(255,255,255,0.75)",
    marginTop: "32px",
    textShadow: "0 2px 12px rgba(0,0,0,0.5)",
    fontWeight: 500,
    direction: "rtl",
  };

  // ── CTA ──────────────────────────────────────────────────────────────────

  const ctaWrapStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "10px",
    marginTop: "36px",
  };

  const ctaLabelStyle: CSSProperties = {
    fontFamily: '"Amiri", "Traditional Arabic", serif',
    fontSize: "26px",
    fontWeight: 700,
    color: "rgba(255,255,255,0.90)",
    direction: "rtl",
    textShadow: "0 2px 10px rgba(0,0,0,0.5)",
    lineHeight: 1.4,
  };

  const btnStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "12px 28px",
    background: "#FFFFFF",
    borderRadius: "100px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.35)",
  };

  const btnTextWrapStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    lineHeight: 1,
    gap: "2px",
  };

  const btnSubStyle: CSSProperties = {
    fontFamily: '"Inter", sans-serif',
    fontSize: "10px",
    fontWeight: 500,
    color: "rgba(0,0,0,0.55)",
    letterSpacing: "0.8px",
    textTransform: "uppercase",
  };

  const btnMainStyle: CSSProperties = {
    fontFamily: '"Inter", sans-serif',
    fontSize: "17px",
    fontWeight: 700,
    color: "#000000",
  };

  const handleStyle: CSSProperties = {
    fontFamily: '"Inter", sans-serif',
    fontSize: "15px",
    fontWeight: 600,
    color: "rgba(255,255,255,0.45)",
    letterSpacing: "0.4px",
    marginTop: "4px",
  };

  return (
    <div style={containerStyle}>

      {/* Quran Arabic text */}
      <div style={arabicTextStyle}>
        {getAyahTextWithoutBasmala(ayah.text_ar)}
      </div>

      {/* Translation */}
      {language !== "ar" && (
        <div style={translationStyle}>{translationText}</div>
      )}

      {/* Surah reference */}
      <div style={metaStyle}>
        {ayah.surahName} · الآية {ayah.ayahNumber}
      </div>

      {/* CTA */}
      <div style={ctaWrapStyle}>
        <div style={ctaLabelStyle}>حمِّل تطبيق يقين مجانًا</div>
        <div style={btnStyle}>
          <GooglePlayIcon size={26} color="#000000" />
          <div style={btnTextWrapStyle}>
            <span style={btnSubStyle}>تنزيل من</span>
            <span style={btnMainStyle}>Google Play</span>
          </div>
        </div>
        <div style={handleStyle}>@yaqeenapp</div>
      </div>

    </div>
  );
};