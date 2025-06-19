import { ReactNode } from "react";

interface LoadingScreenProps {
    children?: ReactNode
}

const LoadingScreen = ({ children }: LoadingScreenProps) => <div
    style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "2rem"
    }}
>
    <h1>Loading...</h1>

    <div style={{ textAlign: "left", width: 512 }}>
        <h2>To Use:</h2>
        <div>Plug in a MIDI device</div>
        <div>Or use your computer keyboard - keys A thru '</div>
        <div>Play some chords!</div>
    </div>

    {children}
</div>

export default LoadingScreen;