export type Box = { left: number; top: number; width: number; height: number };

/**
 * CSS transform (with `transform-origin: center`) that puts box `from` exactly onto box `to`:
 * moves its centre there and scales it to the same width.
 */
export function flightTransform(from: Box, to: Box): string {
  const dx = to.left + to.width / 2 - (from.left + from.width / 2);
  const dy = to.top + to.height / 2 - (from.top + from.height / 2);
  const scale = to.width / from.width;
  return `translate(${dx}px, ${dy}px) scale(${scale})`;
}
