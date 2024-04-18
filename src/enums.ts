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
