export const noteList = [
  "C",
  "Db",
  "D",
  "Eb",
  "E",
  "F",
  "Gb",
  "G",
  "Ab",
  "A",
  "Bb",
  "B",
];

export const intervalList: string[] = [
  "u",
  "m2",
  "M2",
  "m3",
  "M3",
  "4",
  "m5",
  "M5",
  "m6",
  "M6",
  "m7",
  "M7",
  "o",
  "m9",
  "M9",
];

export const keyHues: { [key: string]: number } = {
  F: 30,
  C: 60,
  G: 90,
  D: 120,
  A: 150,
  E: 180,
  B: 210,
  Gb: 240,
  Db: 270,
  Ab: 300,
  Eb: 330,
  Bb: 360,
};

export const noteBases: { [midiNote: number]: string } = noteList.reduce(
  (prev, curr, i) => ({ ...prev, [i]: curr }),
  {}
);

export const intervalDistances: { [midiDistance: number]: string } =
  intervalList.reduce((prev, curr, i) => ({ ...prev, [i]: curr }), {});

/* For a color vector, 
the first element is the amount to be added to the hue, 
the second is the multiplier to the saturation, 
the third is the multiplier to the brightness
*/
export const intervalToColorVector: {
  [interval: string]: [number, number, number];
} = {
  u: [0, 1, 1],
  m2: [0, 0.7, 0.6],
  M2: [0, 1.1, 1],
  // halfway to minor triad's relative major
  m3: [315, 0.9, 1],
  M3: [0, 1.9, 1.075],
  // halfway to fifth down
  "4": [345, 1, 1.1],
  m5: [0, 0.7, 0.7],
  M5: [0, 1.05, 1.1],
  // halfway to the major key of the m6 tone
  m6: [300, 0.9, 0.9],
  M6: [0, 1.25, 1.05],
  m7: [345, 1.1, 1],
  M7: [0, 1.4, 1.05],
  o: [0, 1, 1.075],
  // halfway to the major key of the m9 tone
  m9: [105, 0.8, 0.8],
  M9: [0, 1.3, 1.025],
};
