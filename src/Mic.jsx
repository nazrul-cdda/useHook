import { useState, useRef } from "react";

export const Mic = () => {
  const [status, setStatus] = useState("idle");
  const [stream, setStream] = useState(null);
  const [error, setError] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordings, setRecordings] = useState([]);

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  async function requestMic() {
    setStatus("loading");
    setError(null);
    try {
      const s = await navigator.mediaDevices.getUserMedia({ audio: true });
      setStream(s);
      setStatus("granted");
    } catch (err) {
      setStatus("denied");
      setError(err.message);
    }
  }

  function stopMic() {
    stream?.getTracks().forEach(t => t.stop());
    setStream(null);
    setStatus("idle");
  }

  function startRecording() {
    chunksRef.current = [];
    const recorder = new MediaRecorder(stream);
    mediaRecorderRef.current = recorder;

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "audio/webm" });
      const url = URL.createObjectURL(blob);
      setRecordings(prev => [...prev, { url, name: `recording-${prev.length + 1}.webm` }]);
    };

    recorder.start();
    setIsRecording(true);
  }

  function stopRecording() {
    mediaRecorderRef.current.stop();
    setIsRecording(false);
  }

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

        <button onClick={stopMic}>Release Mic</button>

        {recordings.map((r, i) => (
          <div key={i}>
            <audio controls src={r.url} />
            <a href={r.url} download={r.name}>
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
}
