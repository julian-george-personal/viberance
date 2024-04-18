import { noteBases } from "./enums";

export const midiToNote = (
  midiNote: number
): [noteName: string, octave: number] => {
  const noteOffset = midiNote % 12;
  const octave = (midiNote - noteOffset) / 12 - 2;
  return [noteBases[noteOffset], octave];
};
