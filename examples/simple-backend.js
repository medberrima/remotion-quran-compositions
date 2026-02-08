// examples/simple-backend.js
// Exemple simple d'utilisation dans Node.js/Express

const express = require('express');
const { bundle } = require('@remotion/bundler');
const { renderMedia, selectComposition } = require('@remotion/renderer');
const path = require('path');

const app = express();
app.use(express.json());

// Configuration
const COMPOSITION_ID = 'QuranVideo';
const OUTPUT_DIR = path.join(__dirname, '../output');

// Route pour générer une vidéo
app.post('/api/video/generate', async (req, res) => {
  try {
    const videoSettings = req.body;

    console.log('📦 Bundling Remotion...');
    
    // 1. Bundle le package
    const bundled = await bundle({
      entryPoint: path.join(
        __dirname,
        '../node_modules/@yaqeen/remotion-compositions/dist/index.js'
      ),
      webpackOverride: (config) => config,
    });

    console.log('✅ Bundle complete');

    // 2. Sélectionner la composition
    const composition = await selectComposition({
      serveUrl: bundled,
      id: COMPOSITION_ID,
      inputProps: videoSettings,
    });

    console.log('🎬 Rendering video...');

    // 3. Nom du fichier de sortie
    const outputPath = path.join(OUTPUT_DIR, `video-${Date.now()}.mp4`);

    // 4. Render la vidéo
    const { outputFile } = await renderMedia({
      composition,
      serveUrl: bundled,
      codec: 'h264',
      outputLocation: outputPath,
      inputProps: videoSettings,
      onProgress: ({ progress }) => {
        console.log(`Progress: ${Math.round(progress * 100)}%`);
      },
    });

    console.log('✅ Video generated:', outputFile);

    res.json({
      success: true,
      videoUrl: `/videos/${path.basename(outputFile)}`,
      path: outputFile,
    });
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Servir les vidéos générées
app.use('/videos', express.static(OUTPUT_DIR));

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({
    message: 'Server is running',
    package: '@yaqeen/remotion-compositions',
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// Exemple de requête pour tester:
/*
POST http://localhost:3001/api/video/generate
Content-Type: application/json

{
  "selectedAyahs": [
    {
      "surahNumber": 1,
      "ayahNumber": 1,
      "surahName": "Al-Fatiha",
      "text_ar": "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ",
      "text_en": "In the name of Allah, the Entirely Merciful",
      "text_fr": "Au nom d'Allah, le Tout Miséricordieux",
      "audioUrl": "https://example.com/audio.mp3",
      "audioDuration": 4.5
    }
  ],
  "background": {
    "id": "gradient-blue",
    "name": "Blue Gradient",
    "type": "gradient",
    "style": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
  },
  "animationStyle": {
    "id": "fade",
    "name": "Fade In"
  },
  "watermark": "@yaqeenapp",
  "logo": null,
  "logoPosition": {
    "id": "top-right",
    "name": "Top Right"
  },
  "logoSize": 80,
  "language": "en",
  "includeAudio": true
}
*/
