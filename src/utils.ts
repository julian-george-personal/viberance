import { MIDINote } from "@react-midi/hooks/dist/types";
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
const OCTAVE_DIMINISHING = 0.6;

export const intervalsToColor = (
  currentBass: string | null,
  intervals: string[]
): string | null => {
  const usedIntervals = new Set<string>();
  if (!currentBass) return null;
  let hue = keyHues[currentBass];
  let saturation = 30;
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
    brightness = Math.min(brightness, 80);
  }
  return `hsl(${hue}, ${Math.round(saturation)}%, ${Math.round(brightness)}%)`;
};

const midiNoteFromNum =  (noteNum:number):MIDINote => {
  return {
    note: noteNum,
    velocity: 255,
    channel: -1,
    on: true
  }
}

// From 48 (C2) to 66 (F#3)
const keyToMidiScale = ["a","w","s","e","d","f","t","g","y","h","u","j","k","o","l","p",";","'","]"]

export const pressedKeyToMidiNote = (pressedKey:string):MIDINote | null=>{
  const noteIndex = keyToMidiScale.indexOf(pressedKey)
  if (noteIndex == -1) return null;
  return midiNoteFromNum(noteIndex+48);
}