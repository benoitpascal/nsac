import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const fromRoot = (path: string) => fileURLToPath(new URL(path, import.meta.url));

export default defineConfig({
  resolve: {
    alias: { '@': fromRoot('./src') },
  },
  build: {
    rolldownOptions: {
      input: {
        main: fromRoot('./index.html'),
        solarSystem: fromRoot('./solar-system.html'),
        planetWalk: fromRoot('./planet-walk.html'),
        minigames: fromRoot('./minigames.html'),
        missions: fromRoot('./missions.html'),
        moonIntro: fromRoot('./moon-intro.html'),
        dayOne: fromRoot('./day-one.html'),
        briefing: fromRoot('./briefing.html'),
        information: fromRoot('./information.html'),
      },
    },
  },
});
