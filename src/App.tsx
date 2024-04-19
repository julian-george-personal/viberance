import { Canvas } from "@react-three/fiber";
import "./App.css";
import ContainerBox from "./meshes/ContainerBox";
import { useMIDIInputs, useMIDINotes } from "@react-midi/hooks";
import { useEffect, useState } from "react";
import LightOrb from "./meshes/LightOrb";
import { getIntervalName, intervalsToColor, midiToNote } from "./utils";
import { intervalDistances, keyHues } from "./enums";
import { useSpring, animated } from "@react-spring/three";
import { MIDINote } from "@react-midi/hooks/dist/types";
// import { Stats, OrbitControls } from "@react-three/drei";

const SCENE_SCALE = 150;
// how long it takes for notes to go away in ms
const MAX_NOTE_TIMEOUT = 75;

const DEFAULT_COLOR = "hsl(0,0,100%)";

const App = () => {
  const activeMIDI = useMIDINotes({ channel: 1 });
  const [currentBass, setCurrentBass] = useState<string | null>(null);
  const [currentIntervals, setCurrentIntervals] = useState<string[]>([]);
  const [currentNotes, setCurrentNotes] = useState<[MIDINote, number][]>([]);
  const [currentColor, setCurrentColor] = useState<string>(DEFAULT_COLOR);
  const animatedColor = useSpring({ color: DEFAULT_COLOR });
  useEffect(() => {
    const decayInterval = setInterval(() => {
      const midiSet = new Set(activeMIDI.map((note) => note.note));
      const newCurrentNotes: [MIDINote, number][] = activeMIDI.map((note) => [
        note,
        0,
      ]);
      const currTime = new Date().getTime();
      for (const [note, timestamp] of currentNotes) {
        if (!midiSet.has(note.note)) {
          if (timestamp == 0) newCurrentNotes.push([note, currTime]);
          else if (
            currTime - (note.velocity / 256 + 0.5) * MAX_NOTE_TIMEOUT <
            timestamp
          )
            newCurrentNotes.push([note, timestamp]);
        }
      }
      setCurrentNotes(newCurrentNotes);
    }, 40);
    return () => clearInterval(decayInterval);
  }, [activeMIDI, currentNotes]);
  useEffect(() => {
    const activeNotes = currentNotes.map(([note, timestamp]) => note.note);
    activeNotes.sort();
    const currIntervals = [];
    let currentBass = null;
    for (let i = 0; i < activeNotes.length; i++) {
      const activeNote = activeNotes[i];
      if (i == 0) currentBass = activeNote;
      else {
        //If it gets to this point there will always be a currentBass
        //@ts-expect-error
        currIntervals.push(activeNote - currentBass);
      }
    }
    setCurrentBass(currentBass ? midiToNote(currentBass)[0] : null);
    setCurrentIntervals(
      currIntervals.map((interval) => getIntervalName(interval))
    );
  }, [currentNotes]);
  useEffect(() => {
    setCurrentColor(intervalsToColor(currentBass, currentIntervals));
  }, [currentBass, currentIntervals]);

  return (
    <Canvas camera={{ position: [SCENE_SCALE, 0, 0] }}>
      <animated.ambientLight intensity={2} color={"white"} />
      <LightOrb
        position={[0, 0, 0]}
        color={currentColor}
        radius={SCENE_SCALE * 0.25}
      />
      {/* <animated.pointLight
        position={[SCENE_SCALE - 1, SCENE_SCALE - 1, SCENE_SCALE - 1]}
        color={animatedColor.color}
      /> */}
      <ContainerBox scale={SCENE_SCALE * 2} />
      {/* <OrbitControls /> */}
    </Canvas>
  );
};

export default App;
