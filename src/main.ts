import { mountStarfield } from '@/modules/starfield/ui/starfield.view';

const canvas = document.querySelector<HTMLCanvasElement>('#starfield');

if (!canvas) {
  throw new Error('Missing #starfield canvas element');
}

mountStarfield(canvas);
