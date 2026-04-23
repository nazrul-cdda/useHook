import { useMic } from "./hooks/useMic";

export const App = () => {
  const { error, requestMic, stopMic, status, isRecording, recordings, startRecording, stopRecording } = useMic();

  return (
    <div>
      {status === "idle" &&
        <button onClick={requestMic}>🎤 Enable Mic</button>}

      {status === "loading" &&
        <p>Waiting for permission…</p>}

      {status === "granted" && <>
        <p>✅ Mic is live!</p>

        {!isRecording
          ? <button onClick={startRecording}>⏺ Record</button>
          : <button onClick={stopRecording}>⏹ Stop</button>}

        <button onClick={stopMic}>Stop Mic</button>

        {recordings.map((url, i) => (
          <div key={i}>
            <audio controls src={url} />
            <a href={url} download={`recording-${i + 1}.webm`}>
              <button>⬇ Save</button>
            </a>
          </div>
        ))}
      </>}

      {status === "denied" && <>
        <p>❌ Blocked: {error}</p>
        <button onClick={requestMic}>Try again</button>
      </>}
    </div>
  );
};
