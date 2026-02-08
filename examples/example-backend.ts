// example-backend.ts
// Exemple d'utilisation dans ton backend Node.js/Express

import express from 'express';
import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';
import path from 'path';
import type { VideoSettings } from '@yaqeen/remotion-compositions';
import { calculateTimeline } from '@yaqeen/remotion-compositions';

const app = express();
app.use(express.json());

// Route pour générer une vidéo
app.post('/api/generate-video', async (req, res) => {
  try {
    const settings: VideoSettings = req.body;

    console.log('Starting video generation...');

    // 1. Bundle le code Remotion
    const bundled = await bundle({
      entryPoint: path.resolve(
        __dirname,
        '../node_modules/@yaqeen/remotion-compositions/dist/index.js'
      ),
      webpackOverride: (config) => config,
    });

    console.log('Bundling complete');

    // 2. Calculer la timeline et la durée
    const fps = 30;
    const timeline = calculateTimeline(settings.selectedAyahs, fps);
    const durationInFrames =
      timeline.length > 0
        ? timeline[timeline.length - 1].startFrame +
          timeline[timeline.length - 1].totalFrames
        : 300;

    console.log(`Duration: ${durationInFrames} frames`);

    // 3. Sélectionner la composition
    const composition = await selectComposition({
      serveUrl: bundled,
      id: 'QuranVideo',
      inputProps: settings,
    });

    console.log('Composition selected');

    // 4. Définir le chemin de sortie
    const outputPath = path.join(
      __dirname,
      '../output',
      `video-${Date.now()}.mp4`
    );

    // 5. Render la vidéo
    await renderMedia({
      composition: {
        ...composition,
        durationInFrames,
        fps,
        width: 1080,
        height: 1920,
      },
      serveUrl: bundled,
      codec: 'h264',
      outputLocation: outputPath,
      inputProps: settings,
      onProgress: ({ progress }) => {
        console.log(`Rendering progress: ${(progress * 100).toFixed(2)}%`);
      },
    });

    console.log('Video generated successfully');

    res.json({
      success: true,
      videoPath: outputPath,
      duration: durationInFrames / fps,
    });
  } catch (error) {
    console.error('Error generating video:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Route de test pour vérifier la configuration
app.get('/api/test', (req, res) => {
  res.json({
    message: 'Backend is running',
    compositionsPackage: '@yaqeen/remotion-compositions',
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Exemple de données pour tester
const exampleVideoSettings: VideoSettings = {
  selectedAyahs: [
    {
      surahNumber: 1,
      ayahNumber: 1,
      surahName: 'Al-Fatiha',
      text_ar: 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ',
      text_en: 'In the name of Allah, the Entirely Merciful, the Especially Merciful',
      text_fr: 'Au nom d\'Allah, le Tout Miséricordieux, le Très Miséricordieux',
      audioUrl: 'https://example.com/audio/1-1.mp3',
      audioDuration: 4.5,
    },
    {
      surahNumber: 1,
      ayahNumber: 2,
      surahName: 'Al-Fatiha',
      text_ar: 'ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَٰلَمِينَ',
      text_en: 'All praise is due to Allah, Lord of the worlds',
      text_fr: 'Louange à Allah, Seigneur de l\'univers',
      audioUrl: 'https://example.com/audio/1-2.mp3',
      audioDuration: 3.8,
    },
  ],
  background: {
    id: 'gradient-blue',
    name: 'Blue Gradient',
    type: 'gradient',
    style: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  animationStyle: {
    id: 'fade',
    name: 'Fade In',
  },
  watermark: '@yaqeenapp',
  logo: null,
  logoPosition: {
    id: 'top-right',
    name: 'Top Right',
  },
  logoSize: 80,
  language: 'en',
  includeAudio: true,
};

export { exampleVideoSettings };
