import { Canvas } from "@react-three/fiber";
import "./App.css";
import ContainerBox from "./meshes/ContainerBox";
import { useMIDIInputs, useMIDINotes } from "@react-midi/hooks";
import { useEffect, useState } from "react";
import { Color } from "three";
import LightOrb from "./meshes/LightOrb";
import { getIntervalName, intervalsToColor, midiToNote } from "./utils";
import { intervalDistances, keyHues } from "./enums";
import { useSpring, animated } from "@react-spring/three";
import { MIDINote } from "@react-midi/hooks/dist/types";

const SCENE_SCALE = 150;
// how long it takes for notes to go away in ms
const MAX_NOTE_TIMEOUT = 400;
const LIGHT_DECAY_PACE = 2;

const DEFAULT_COLOR = "hsl(0, 0%, 0%)";
const DEFAULT_INTENSITY = 10;

const App = () => {
  const activeMIDI = useMIDINotes({ channel: 1 });
  const [currentBass, setCurrentBass] = useState<string | null>(null);
  const [currentIntervals, setCurrentIntervals] = useState<string[]>([]);
  const [currentNotes, setCurrentNotes] = useState<[MIDINote, number][]>([]);
  const [currentColor, setCurrentColor] = useState<string>(DEFAULT_COLOR);
  const [lightIntensity, setLightIntensity] =
    useState<number>(DEFAULT_INTENSITY);
  const animatedIntensityProps = useSpring({
    intensity: lightIntensity,
    config: { tension: 280, friction: 60 },
  });
  const accentIntensityProps = useSpring({
    intensity: lightIntensity * 1.5,
    config: { tension: 280, friction: 60 },
  });
  const animatedColorProps = useSpring({
    color: currentColor,
    config: {
      tension: 120,
      friction: 14,
      duration: currentColor != DEFAULT_COLOR ? 100 : 1100,
    },
  });
  useEffect(() => {
    if (currentNotes.length > 0) {
      const lightDecayInterval = setInterval(() => {
        setLightIntensity((prev) =>
          Math.max(prev - LIGHT_DECAY_PACE, DEFAULT_INTENSITY)
        );
      }, 25);
      return () => clearInterval(lightDecayInterval);
    } else {
      setLightIntensity(DEFAULT_INTENSITY);
    }
  }, [currentNotes, setLightIntensity]);
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
          if (timestamp == 0) {
            newCurrentNotes.push([note, currTime]);
            setLightIntensity((prev) => prev + note.velocity);
          } else if (
            currTime - (note.velocity / 256 + 0.5) * MAX_NOTE_TIMEOUT <
            timestamp
          )
            newCurrentNotes.push([note, timestamp]);
        }
      }
      setCurrentNotes(newCurrentNotes);
    }, 40);
    return () => clearInterval(decayInterval);
  }, [activeMIDI, currentNotes, setLightIntensity]);
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
    const newColor =
      intervalsToColor(currentBass, currentIntervals) || DEFAULT_COLOR;
    setCurrentColor(newColor);
  }, [currentBass, currentIntervals, setCurrentColor]);

  return (
    <Canvas shadows camera={{ position: [0, 0, 100], fov: 60 }}>
      <animated.ambientLight intensity={0.5} {...animatedColorProps} />
      <animated.pointLight
        position={[0, 0, 0]}
        distance={SCENE_SCALE * 2}
        // castShadow
        {...animatedColorProps}
        intensity={animatedIntensityProps.intensity}
      />
      <animated.pointLight
        position={[SCENE_SCALE / 8, SCENE_SCALE / 8, SCENE_SCALE / 8]}
        distance={SCENE_SCALE * 2}
        // castShadow
        {...animatedColorProps}
        intensity={accentIntensityProps.intensity}
      />
      <LightOrb
        position={[0, 0, 0]}
        radius={SCENE_SCALE / 8}
        animatedColorProps={animatedColorProps}
      />
      <ContainerBox
        scale={SCENE_SCALE}
        animatedColorProps={animatedColorProps}
      />
    </Canvas>
  );
};

export default App;
