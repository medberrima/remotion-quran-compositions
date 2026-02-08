# Guide d'Installation Complet

## Étape 1: Créer le projet partagé sur GitHub

1. **Créer un nouveau dépôt GitHub**
   - Va sur github.com
   - Clique sur "New repository"
   - Nom: `remotion-quran-compositions`
   - Privé ou Public (selon tes besoins)
   - Ne pas initialiser avec README (on l'a déjà)

2. **Initialiser Git et pusher**

```bash
cd remotion-quran-compositions
git init
git add .
git commit -m "Initial commit: Remotion compositions package"
git branch -M main
git remote add origin https://github.com/TON_USERNAME/remotion-quran-compositions.git
git push -u origin main
```

## Étape 2: Installer dans ton Frontend

Dans ton projet React/Frontend:

```bash
# Installer depuis GitHub
npm install git+https://github.com/TON_USERNAME/remotion-quran-compositions.git

# Ou si le repo est privé:
npm install git+ssh://git@github.com:TON_USERNAME/remotion-quran-compositions.git
```

**Modifier ton Root.tsx:**

```tsx
// Avant
import { QuranVideo } from './compositions/QuranVideo';
import { calculateTimeline } from './utils/timeline';

// Après
import { QuranVideo, calculateTimeline } from '@yaqeen/remotion-compositions';
import type { SelectedAyah } from '@yaqeen/remotion-compositions';

// Le reste reste identique!
```

**Supprimer les anciens fichiers:**

```bash
# Tu peux maintenant supprimer ces dossiers/fichiers:
rm -rf src/compositions
rm -rf src/utils/timeline.ts
rm -rf src/utils/animations.ts
# etc...
```

## Étape 3: Installer dans ton Backend

Dans ton projet Express/Backend:

```bash
# Installer le package
npm install git+https://github.com/TON_USERNAME/remotion-quran-compositions.git

# Installer les dépendances Remotion pour le rendu
npm install @remotion/bundler @remotion/renderer
```

**Créer ton endpoint de rendu:**

```typescript
// routes/video.routes.ts
import express from 'express';
import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';
import { calculateTimeline } from '@yaqeen/remotion-compositions';
import type { VideoSettings } from '@yaqeen/remotion-compositions';

const router = express.Router();

router.post('/generate', async (req, res) => {
  try {
    const settings: VideoSettings = req.body;
    
    // Bundle
    const bundled = await bundle({
      entryPoint: require.resolve('@yaqeen/remotion-compositions'),
    });
    
    // Calculate duration
    const fps = 30;
    const timeline = calculateTimeline(settings.selectedAyahs, fps);
    const durationInFrames = timeline[timeline.length - 1]?.startFrame 
      + timeline[timeline.length - 1]?.totalFrames || 300;
    
    // Render
    const outputPath = `./output/video-${Date.now()}.mp4`;
    await renderMedia({
      composition: {
        id: 'QuranVideo',
        durationInFrames,
        fps: 30,
        width: 1080,
        height: 1920,
      },
      serveUrl: bundled,
      codec: 'h264',
      outputLocation: outputPath,
      inputProps: settings,
    });
    
    res.json({ success: true, videoPath: outputPath });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
```

## Étape 4: Mettre à jour le package

Quand tu modifies les compositions:

1. **Dans le projet `remotion-quran-compositions`:**

```bash
git add .
git commit -m "Update: amélioration des animations"
git push
```

2. **Dans ton Frontend:**

```bash
npm update @yaqeen/remotion-compositions
# ou
npm install git+https://github.com/TON_USERNAME/remotion-quran-compositions.git --force
```

3. **Dans ton Backend:**

```bash
npm update @yaqeen/remotion-compositions
# ou
npm install git+https://github.com/TON_USERNAME/remotion-quran-compositions.git --force
```

## Étape 5: Utiliser des versions (Optionnel mais recommandé)

Pour un meilleur contrôle des versions:

**Dans `remotion-quran-compositions/package.json`:**

```json
{
  "version": "1.0.0"  // Change ça à chaque modification
}
```

**Créer des tags Git:**

```bash
git tag v1.0.0
git push --tags
```

**Dans tes projets, installer une version spécifique:**

```bash
npm install git+https://github.com/TON_USERNAME/remotion-quran-compositions.git#v1.0.0
```

## Structure finale de tes projets

```
📁 remotion-quran-compositions/     (Nouveau repo Git séparé)
   ├── src/
   ├── package.json
   └── README.md

📁 frontend-project/
   ├── src/
   │   ├── Root.tsx                  (Utilise le package)
   │   └── ...
   ├── package.json                  (Dépendance: @yaqeen/remotion-compositions)
   └── ...

📁 backend-project/
   ├── src/
   │   ├── routes/
   │   │   └── video.routes.ts       (Utilise le package)
   │   └── ...
   ├── package.json                  (Dépendance: @yaqeen/remotion-compositions)
   └── ...
```

## Dépannage

**Problème: Module non trouvé**

```bash
# Vérifier que le package est installé
npm list @yaqeen/remotion-compositions

# Réinstaller
npm install git+https://github.com/TON_USERNAME/remotion-quran-compositions.git --force
```

**Problème: Types TypeScript**

Assure-toi d'avoir compilé le package:

```bash
cd remotion-quran-compositions
npm run build
git add dist/
git commit -m "Add compiled files"
git push
```

**Problème: Changements non reflétés**

```bash
# Forcer la réinstallation
npm uninstall @yaqeen/remotion-compositions
npm install git+https://github.com/TON_USERNAME/remotion-quran-compositions.git
```

## Bon à savoir

- ✅ Un seul endroit pour modifier les compositions
- ✅ Pas de duplication de code
- ✅ Versioning facile avec Git
- ✅ Tes projets frontend et backend restent séparés
- ✅ Mise à jour simple avec `npm update`

Besoin d'aide? Consulte le README.md du package! 🚀
