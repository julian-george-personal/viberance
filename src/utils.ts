import {
  noteBases,
  intervalDistances,
  keyHues,
  intervalToColorVector,
} from "./enums";

export const midiToNote = (
  midiNote: number
): [noteName: string, octave: number] => {
  const noteOffset = midiNote % 12;
  const octave = (midiNote - noteOffset) / 12 - 2;
  return [noteBases[noteOffset], octave];
};

export const getIntervalName = (intervalDistance: number): string => {
  return (
    intervalDistances?.[intervalDistance] ||
    intervalDistances[intervalDistance % 12]
  );
};

// determines how much color vectors are diminished upon repeated octaves
const OCTAVE_DIMINISHING = 0.4;

export const intervalsToColor = (
  currentBass: string,
  intervals: string[]
): string => {
  const usedIntervals = new Set<string>();
  let hue = keyHues[currentBass];
  let saturation = 60;
  let brightness = 60;
  for (const interval of intervals) {
    const colorVector = intervalToColorVector[interval];
    if (!usedIntervals.has(interval)) {
      hue += colorVector[0];
      saturation *= colorVector[1];
      brightness *= colorVector[2];
    } else {
      saturation *= (colorVector[1] - 1) * OCTAVE_DIMINISHING + 1;
      brightness *= (colorVector[2] - 1) * OCTAVE_DIMINISHING + 1;
    }
    hue %= 360;
    saturation = Math.min(saturation, 100);
    brightness = Math.min(brightness, 100);
  }
  return `hsl(${keyHues[currentBass]}, ${saturation}%, ${brightness}%)`;
};
