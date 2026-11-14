/** Builds a titled facts section, one paragraph per line, with an optional drawing. */
export const section = (title: string, lines: string[], drawing?: SVGElement) => {
  const element = document.createElement('section');
  const heading = document.createElement('h3');
  heading.textContent = title;
  element.append(heading);
  for (const line of lines) {
    const paragraph = document.createElement('p');
    paragraph.textContent = line;
    element.append(paragraph);
  }
  if (drawing) element.append(drawing);
  return element;
};
