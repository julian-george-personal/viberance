import { MIDIProvider } from "@react-midi/hooks";
import { useEffect, useState } from "react";
import Viberance from "./Viberance";
import LoadingScreen from "./LoadingScreen";

const checkMIDIAvailability = async (verbose: boolean = false): Promise<boolean> => {
    try {
        if (!('requestMIDIAccess' in navigator)) {
            if (verbose) console.log('Web MIDI API not supported');
            return false;
        }
        // @ts-ignore
        await navigator.requestMIDIAccess();
        if (verbose) console.log('MIDI access granted');
        return true;
    } catch (error) {
        if (verbose) console.error('MIDI access denied or failed:', error);
        return false;
    }
};

const App = () => {
    const [midiAvailable, setMidiAvailable] = useState<boolean | null>(null);
    useEffect(() => {
        const checkMidi = () => {
            checkMIDIAvailability().then(setMidiAvailable);
        };

        checkMidi();

        const interval = setInterval(checkMidi, 2500);

        return () => clearInterval(interval);
    }, [setMidiAvailable]);

    useEffect(() => {
        console.log(`MidiAvailable updated to ${midiAvailable}`)
        checkMIDIAvailability(true);
    }, [midiAvailable])

    switch (midiAvailable) {
        case null:
            return <LoadingScreen />;
        case false:
            return <Viberance withMidiDevice={false} />
        case true:
            return <MIDIProvider>
                <Viberance withMidiDevice={true} />
            </MIDIProvider>
    }
}

export default App;