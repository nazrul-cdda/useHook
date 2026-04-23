import { useEffect, useRef, useState } from "react";

export const Video = () => {
    const [status, setStatus] = useState("idle");
    const [stream, setStream] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const [recordings, setRecordings] = useState([]);

    const mediaRecorderRef = useRef(null);
    const chunksRef = useRef([]);
    const videoRef = useRef(null);

    const constraints = {
        video: { width: 1280, height: 720 },
    };

    async function openCam() {
        try {
            const s = await navigator.mediaDevices.getUserMedia(constraints);
            setStream(s);
            setStatus("granted");
        } catch (error) {
            console.log(error.message);
            setStatus("denied");
        }
    }

    const offCam = () => {
        stream?.getTracks().forEach(t => t.stop());
        setStream(null);
        setStatus("idle");
    };

    useEffect(() => {
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;
        }
    }, [stream]);

    const startRecording = () => {
        chunksRef.current = [];
        const recorder = new MediaRecorder(stream);
        mediaRecorderRef.current = recorder;

        recorder.ondataavailable = (e) => {
            if (e.data.size > 0) chunksRef.current.push(e.data);
        };

        recorder.onstop = () => {
            const blob = new Blob(chunksRef.current, { type: "video/webm" });
            const url = URL.createObjectURL(blob);
            setRecordings(prev => [
                ...prev,
                { url, name: `recording-${prev.length + 1}.webm` },
            ]);
        };

        recorder.start();
        setIsRecording(true);
    };

    function stopRecording() {
        mediaRecorderRef.current.stop();
        setIsRecording(false);
    }

    return (
        <div>
            {status === "idle" && (
                <button onClick={openCam}>Turn on camera</button>
            )}

            {status === "granted" && (
                <>
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        style={{ width: "500px", marginLeft: "50px" }}
                    />
                    <div>
                        {!isRecording
                            ? <button onClick={startRecording}>⏺ Record</button>
                            : <button onClick={stopRecording}>⏹ Stop</button>}
                        <button onClick={offCam}>Release Cam</button>
                    </div>
                </>
            )}

            {status === "denied" && (
                <>
                    <p>Blocked: Permission Denied</p>
                    <button onClick={openCam}>Try again</button>
                </>
            )}

            {recordings.map((r, i) => (
                <div key={i}>
                    <video controls src={r.url} style={{ width: "300px" }} />
                    <a href={r.url} download={r.name}>
                        <button>⬇ Save</button>
                    </a>
                </div>
            ))}
        </div>
    );
};
