export type Box = { left: number; top: number; width: number; height: number };

export function flightTransform(from: Box, to: Box): string {
  const moveRight = centreX(to) - centreX(from);
  const moveDown = centreY(to) - centreY(from);
  const scale = to.width / from.width;
  return `translate(${moveRight}px, ${moveDown}px) scale(${scale})`;
}

function centreX(box: Box): number {
  return box.left + box.width / 2;
}

function centreY(box: Box): number {
  return box.top + box.height / 2;
}
