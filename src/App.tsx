import { Canvas } from "@react-three/fiber";
import "./App.css";
import ContainerBox from "./meshes/ContainerBox";
import { useMIDIInputs, useMIDINotes } from "@react-midi/hooks";
import { useEffect, useState } from "react";
import LightOrb from "./meshes/LightOrb";
import { getIntervalName, intervalsToColor, midiToNote } from "./utils";
import { intervalDistances, keyHues } from "./enums";
import { useSpring, animated } from "@react-spring/three";

const SCENE_SCALE = 150;

const App = () => {
  const activeMIDI = useMIDINotes({ channel: 1 });
  const [currentBass, setCurrentBass] = useState<string | null>(null);
  const [currentIntervals, setCurrentIntervals] = useState<string[]>([]);
  const [currentColor, setCurrentColor] = useState<string>("white");
  const animatedColor = useSpring({ to: { color: currentColor } });
  useEffect(() => {
    const activeNotes = activeMIDI.map((note) => note.note);
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
  }, [activeMIDI]);
  useEffect(() => {
    if (currentBass != null)
      setCurrentColor(intervalsToColor(currentBass, currentIntervals));
  }, [currentBass, currentIntervals]);
  return (
    <Canvas camera={{ position: [SCENE_SCALE, 0, 0] }}>
      <animated.pointLight
        position={[SCENE_SCALE * 0.9, SCENE_SCALE * 0.3, SCENE_SCALE * -0.3]}
        decay={0}
        intensity={Math.PI}
        color={animatedColor.color || "white"}
      />
      <LightOrb
        position={[0, 0, 0]}
        color={animatedColor.color || "white"}
        radius={SCENE_SCALE * 0.25}
      />
      <ContainerBox scale={SCENE_SCALE * 2} />
    </Canvas>
  );
};

export default App;
