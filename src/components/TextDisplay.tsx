import { CSSProperties } from "react";
import { FacebookIcon, InstagramIcon, TiktokIcon, GooglePlayIcon } from "../assets/icons";
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
    padding: "60px 30px",
    maxWidth: "95%",
    textAlign: "center",
    gap: "0px",
  };

  const arabicTextStyle: CSSProperties = {
    fontFamily: '"Amiri", "Traditional Arabic", serif',
    fontSize: "52px",
    lineHeight: 1.9,
    color: "#FFFFFF",
    textShadow: "0 4px 20px rgba(0,0,0,0.6)",
    marginBottom: "0px",
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
    fontSize: "22px",
    color: "rgba(255,255,255,0.85)",
    marginTop: "40px",
    textShadow: "0 2px 12px rgba(0,0,0,0.5)",
    fontWeight: 500,
    letterSpacing: "0.5px",
  };

  // ── MINIMALIST ONE-LINE BAR ──────────────────────────────
  const barStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
    padding: "10px 25px",
    margin: "28px 0 10px",
    background: "rgba(0, 0, 0, 0.35)",
    borderRadius: "50px",
    flexWrap: "nowrap",
    whiteSpace: "nowrap",
    fontFamily: '"Cairo", sans-serif',
    fontSize: "18px",
    fontWeight: 700,
    color: "#FFFFFF",
    textAlign: "center",
  };

  const storeIconStyle: CSSProperties = { display: "flex", alignItems: "center", gap: "5px" };

  // ── SOCIAL ROW ──────────────────────────────────────────
  const socialRowStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    opacity: 0.7,
    marginTop: "8px",
  };

  const handleStyle: CSSProperties = { fontFamily: '"Cairo", sans-serif', fontSize: "13px", fontWeight: 500, color: "#FFFFFF" };

  return (
    <div style={containerStyle}>

      {/* Arabic Text */}
      <div style={arabicTextStyle}>{getAyahTextWithoutBasmala(ayah.text_ar)}</div>

      {/* Translation */}
      {language !== "ar" && <div style={translationStyle}>{translationText}</div>}

      {/* Surah & Ayah */}
      <div style={metaStyle}>{ayah.surahName} • Ayah {ayah.ayahNumber}</div>

      {/* ── MINIMALIST DOWNLOAD BAR ── */}
      <div style={barStyle}>
        <div style={storeIconStyle}>
          <GooglePlayIcon size={17} color="#FFFFFF" />
          Google Play
        </div>
        <span style={{ marginLeft: "8px" }}>•</span>
        Yaqeen Muslim | يقين المسلم – حمّل الآن
      </div>

      {/* ── SOCIAL ICONS ── */}
      <div style={socialRowStyle}>
        <InstagramIcon size={16} color="#FFFFFF" />
        <TiktokIcon size={16} color="#FFFFFF" />
        <FacebookIcon size={16} color="#FFFFFF" />
        <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)" }}>·</span>
        <span style={handleStyle}>@YaqeenMuslimApp</span>
      </div>

    </div>
  );
};