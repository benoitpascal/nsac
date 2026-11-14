/** Lays out the bar (clock, list, hint) above the scene. */
export const layoutBoard = (barParts: readonly Element[], scene: Element) => {
  const bar = document.createElement('div');
  bar.className = 'mg-hidden-objects-bar';
  bar.append(...barParts);
  const root = document.createElement('div');
  root.className = 'mg-hidden-objects';
  root.append(bar, scene);
  return root;
};
