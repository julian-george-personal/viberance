import { Canvas } from "@react-three/fiber";
import { useMIDINotes } from "@react-midi/hooks";
import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useSpring, animated } from "@react-spring/three";
import { MIDINote } from "@react-midi/hooks/dist/types";
import * as Tone from 'tone';
import LightOrb from "./meshes/LightOrb";
import { getIntervalName, intervalsToColor, midiToNote, pressedKeyToMidiNote } from "./utils";
import ContainerBox from "./meshes/ContainerBox";
import "./Viberance.css";
import LoadingScreen from "./LoadingScreen";

const SCENE_SCALE = 150;
// how long it takes for notes to go away in ms
const MAX_NOTE_TIMEOUT = 400;
const LIGHT_DECAY_PACE = 2;

const DEFAULT_COLOR = "hsl(0, 0%, 0%)";
const DEFAULT_INTENSITY = 10;

const Handle: React.FC<{ load: (loading: boolean) => void }> = ({ load }) => {
  useEffect(() => {
    load(true);
    return () => load(false);
  }, [load]);
  return <></>;
};

interface IAppProps {
  withMidiDevice: boolean
}

const Viberance = ({ withMidiDevice }: IAppProps) => {
  const midiDeviceNotes = useMIDINotes({ channel: 1 });
  const [midiKeyboardNotes, setMidiKeyboardNotes] = useState<Set<MIDINote>>(new Set())
  const midiNotes = useMemo(() => ([...midiDeviceNotes, ...Array.from(midiKeyboardNotes)]), [midiDeviceNotes, midiKeyboardNotes])
  const [playingSynthNotes, setPlayingSynthNotes] = useState(() => new Set<number>());
  const [isAudioReady, setIsAudioReady] = useState<boolean>(false);
  const [isLoading, load] = useState(true);
  const [currentBass, setCurrentBass] = useState<string | null>(null);
  const [currentIntervals, setCurrentIntervals] = useState<string[]>([]);
  const [currentNotes, setCurrentNotes] = useState<[MIDINote, number][]>([]);
  const [currentColor, setCurrentColor] = useState<string>(DEFAULT_COLOR);
  const [lightIntensity, setLightIntensity] =
    useState<number>(DEFAULT_INTENSITY);

  const onKeyDown = useCallback((event: KeyboardEvent) => {
    const newMidiNote = pressedKeyToMidiNote(event.key);
    if (newMidiNote) setMidiKeyboardNotes((prev) => new Set([...Array.from(prev), newMidiNote]))
  }, [setMidiKeyboardNotes])

  const onKeyUp = useCallback((event: KeyboardEvent) => {
    const midiNoteToRemove = pressedKeyToMidiNote(event.key);
    if (midiNoteToRemove) {
      setMidiKeyboardNotes((prev) => {
        const newSet = new Set(Array.from(prev).filter(note => note.note !== midiNoteToRemove.note));
        return newSet;
      })
    }
  }, [setMidiKeyboardNotes])

  useEffect(() => {
    if (!withMidiDevice) {
      document.addEventListener("keydown", onKeyDown)
      return () => document.removeEventListener("keydown", onKeyDown);
    }
  }, [onKeyDown, withMidiDevice])

  useEffect(() => {
    if (!withMidiDevice) {
      document.addEventListener("keyup", onKeyUp)
      return () => document.removeEventListener("keyup", onKeyUp);
    }
  }, [onKeyUp, withMidiDevice])

  const [synth] = useState(() => new Tone.PolySynth(Tone.Synth, {
    oscillator: {
      type: "triangle8"
    },
    envelope: {
      attack: 0,
      decay: 0.3,
      sustain: 0.4,
      release: 0.8
    }
  }).toDestination());

  useEffect(() => {
    Tone.start();
    setIsAudioReady(true);
  }, []);

  useEffect(() => {
    if (!isAudioReady) return;
    // Start new notes
    midiNotes.forEach(note => {
      if (!playingSynthNotes.has(note.note)) {
        //@ts-ignore
        const freq = Tone.Frequency(note.note, "midi").toFrequency();
        synth.triggerAttack(freq);
        setPlayingSynthNotes((prev) => {
          const curr = new Set(prev);
          curr.add(note.note)
          return curr;
        })
      }
    });

    // Stop notes that are no longer in midiNotes
    Array.from(playingSynthNotes).forEach(note => {
      if (!midiNotes.some(n => n.note === note)) {
        //@ts-ignore
        const freq = Tone.Frequency(note, "midi").toFrequency();
        synth.triggerRelease(freq);
        setPlayingSynthNotes((prev) => {
          const curr = new Set(prev);
          curr.delete(note)
          return curr;
        })
      }
    });
  }, [midiNotes, synth, playingSynthNotes, isAudioReady]);

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
      duration: currentColor !== DEFAULT_COLOR ? 100 : 1100,
    },
  });
  // Handles continual decay of light intensity
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
  // Maintains notes with the time they were played in order to keep notes from disappearing immediately after being played
  useEffect(() => {
    const decayInterval = setInterval(() => {
      const midiSet = new Set(midiNotes.map((note) => note.note));
      const newCurrentNotes: [MIDINote, number][] = midiNotes.map((note) => [
        note,
        0,
      ]);
      const currTime = new Date().getTime();
      for (const [note, timestamp] of currentNotes) {
        if (!midiSet.has(note.note)) {
          if (timestamp === 0) {
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
  }, [midiNotes, currentNotes, setLightIntensity]);
  // Updates state with played notes
  useEffect(() => {
    const activeNotes = currentNotes.map(([note, timestamp]) => note.note);
    activeNotes.sort();
    const currIntervals = [];
    let currentBass = null;
    for (let i = 0; i < activeNotes.length; i++) {
      const activeNote = activeNotes[i];
      if (i === 0) currentBass = activeNote;
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

  // Calculates color based on played notes
  useEffect(() => {
    const newColor =
      intervalsToColor(currentBass, currentIntervals) || DEFAULT_COLOR;
    setCurrentColor(newColor);
  }, [currentBass, currentIntervals, setCurrentColor]);

  return (
    <>
      {isLoading && <LoadingScreen>
        <div>{withMidiDevice ? "Your MIDI device is connected." : "No MIDI device detected, using computer keyboard..."}</div>
      </LoadingScreen>}
      {isAudioReady && <Canvas shadows camera={{ position: [0, 0, 100], fov: 60 }}>
        <Suspense fallback={<Handle load={load} />}>
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
          <ContainerBox scale={SCENE_SCALE} />
        </Suspense>
      </Canvas>}
    </>
  );
};

export default Viberance;
