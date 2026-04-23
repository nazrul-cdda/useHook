import { useState, useRef } from "react";

export const useMic = () => {
  const [status, setStatus] = useState("idle");
  const [stream, setStream] = useState(null);
  const [error,  setError]  = useState(null);
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

  function startRecording() {
    chunksRef.current = [];
    const mr = new MediaRecorder(stream);
    mediaRecorderRef.current = mr;

    mr.ondataavailable = (e) => chunksRef.current.push(e.data);
    mr.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "audio/webm" });
      const url = URL.createObjectURL(blob);
      setRecordings((prev) => [...prev, url]);
      setIsRecording(false);
    };

    mr.start();
    setIsRecording(true);
  }

  function stopRecording() {
    mediaRecorderRef.current?.stop();
  }

  function stopMic() {
    stream?.getTracks().forEach(t => t.stop());
    setStream(null);
    setStatus("idle");
  }

  return {
    status,
    stream,
    error,
    isRecording,
    recordings,
    requestMic,
    startRecording,
    stopRecording,
    stopMic,
  };
};
