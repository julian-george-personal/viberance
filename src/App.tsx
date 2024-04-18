import { Canvas } from "@react-three/fiber";
import "./App.css";
import ContainerBox from "./meshes/ContainerBox";
import { useMIDIInputs, useMIDINotes } from "@react-midi/hooks";
import { useEffect, useState } from "react";
import LightOrb from "./meshes/LightOrb";
import { midiToNote } from "./utils";
import { keyHues } from "./enums";
import { useSpring, animated } from "@react-spring/three";

const SCENE_SCALE = 150;

const App = () => {
  const activeMIDI = useMIDINotes({ channel: 1 });
  const [currentBass, setCurrentBass] = useState<string | null>(null);
  const [currentColor, setCurrentColor] = useState<string>("white");
  const animatedColor = useSpring({ to: { color: currentColor } });
  useEffect(() => {
    const activeNotes = activeMIDI.map((note) => note.note);
    activeNotes.sort();
    setCurrentBass(midiToNote(activeNotes[0])[0]);
  }, [activeMIDI]);
  useEffect(() => {
    if (currentBass != null)
      setCurrentColor(`hsl(${keyHues[currentBass]}, 100%, 60%)`);
  }, [currentBass]);
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
