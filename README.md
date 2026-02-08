# @yaqeen/remotion-compositions

Compositions Remotion partagées pour la génération de vidéos Quran.

## Installation

### Option 1: Depuis Git (Recommandé)

```bash
npm install git+https://github.com/YOUR_USERNAME/remotion-quran-compositions.git
```

### Option 2: Localement (pour développement)

```bash
cd remotion-quran-compositions
npm install
npm run build
```

Puis dans ton projet frontend ou backend:

```bash
npm install ../remotion-quran-compositions
```

## Utilisation

### Dans ton Frontend (React/Remotion)

```tsx
import { Composition } from 'remotion';
import { QuranVideo, calculateTimeline } from '@yaqeen/remotion-compositions';
import type { SelectedAyah } from '@yaqeen/remotion-compositions';

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="QuranVideo"
      component={QuranVideo}
      durationInFrames={300}
      fps={30}
      width={1080}
      height={1920}
      defaultProps={{
        selectedAyahs: [],
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
      }}
      calculateMetadata={({ props }) => {
        const fps = 30;
        const timeline = calculateTimeline(props.selectedAyahs, fps);
        
        const totalDuration = timeline.length > 0
          ? timeline[timeline.length - 1].startFrame + timeline[timeline.length - 1].totalFrames
          : 300;
        
        return {
          durationInFrames: totalDuration,
          fps,
        };
      }}
    />
  );
};
```

### Dans ton Backend (Node.js/Express)

```typescript
import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';
import { QuranVideo, calculateTimeline } from '@yaqeen/remotion-compositions';
import type { VideoSettings } from '@yaqeen/remotion-compositions';

async function renderQuranVideo(settings: VideoSettings) {
  // Bundle le code Remotion
  const bundled = await bundle({
    entryPoint: require.resolve('@yaqeen/remotion-compositions'),
    webpackOverride: (config) => config,
  });

  // Calculer la durée
  const fps = 30;
  const timeline = calculateTimeline(settings.selectedAyahs, fps);
  const durationInFrames = timeline.length > 0
    ? timeline[timeline.length - 1].startFrame + timeline[timeline.length - 1].totalFrames
    : 300;

  // Sélectionner la composition
  const composition = await selectComposition({
    serveUrl: bundled,
    id: 'QuranVideo',
    inputProps: settings,
  });

  // Render la vidéo
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
    outputLocation: `out/video-${Date.now()}.mp4`,
    inputProps: settings,
  });
}
```

## Types disponibles

```typescript
import type {
  Language,
  SelectedAyah,
  AnimationStyle,
  BackgroundType,
  LogoPosition,
  VideoSettings,
  TimelineSegment,
} from '@yaqeen/remotion-compositions';
```

## Développement

```bash
# Compiler
npm run build

# Compiler en mode watch
npm run watch

# Nettoyer
npm run clean
```

## Structure

```
src/
├── components/          # Composants Remotion
│   ├── QuranVideo.tsx
│   ├── AyahScene.tsx
│   ├── Background.tsx
│   ├── TextDisplay.tsx
│   └── Watermark.tsx
├── utils/              # Fonctions utilitaires
│   ├── timeline.ts
│   ├── animations.ts
│   └── textUtils.ts
├── assets/             # Icônes et assets
│   └── icons.tsx
├── types.ts            # Définitions TypeScript
└── index.ts            # Exports principaux
```

## Mise à jour

Quand tu modifies ce package:

1. Commit et push les changements
2. Dans tes projets frontend/backend:

```bash
npm update @yaqeen/remotion-compositions
```

## License

MIT
