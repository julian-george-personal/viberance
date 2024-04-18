import { Canvas } from "@react-three/fiber";
import "./App.css";
import ContainerBox from "./meshes/ContainerBox";
import { useMIDIInputs, useMIDINotes } from "@react-midi/hooks";
import { useEffect } from "react";
import LightOrb from "./meshes/LightOrb";
import { midiToNote } from "./utils";

const App = () => {
  const activeMIDI = useMIDINotes({ channel: 1 });
  useEffect(() => {
    const activeNotes = activeMIDI.map((note) => note.note);
    activeNotes.sort();
    console.log(activeNotes.map((noteNum) => midiToNote(noteNum)));
  }, [activeMIDI]);
  return (
    <Canvas>
      <pointLight
        position={[1, 1, 3]}
        decay={0}
        intensity={Math.PI}
        color="white"
      />
      <LightOrb position={[0, 0, 1]} color="blue" />
      <ContainerBox />
    </Canvas>
  );
};

export default App;
