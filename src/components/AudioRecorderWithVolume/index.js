import React, { useState, useRef, useEffect } from "react";
import { ReactMic } from "react-mic";

const AudioRecorderWithVolume = () => {
  const [recording, setRecording] = useState(false);
  const [volume, setVolume] = useState(0); // Độ lớn âm thanh
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const mediaStreamRef = useRef(null);

  useEffect(() => {
    if (recording) {
      // Khởi tạo AudioContext khi bắt đầu thu âm
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
        mediaStreamRef.current = stream;
        const source = audioContextRef.current.createMediaStreamSource(stream);
        analyserRef.current = audioContextRef.current.createAnalyser();
        source.connect(analyserRef.current);
        analyserRef.current.fftSize = 256; // Thiết lập fftSize để phân tích chi tiết hơn

        // Tạo mảng dữ liệu để lưu kết quả phân tích âm thanh
        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);

        // Cập nhật độ lớn âm thanh
        const updateVolume = () => {
          analyserRef.current.getByteFrequencyData(dataArray);
          const maxVolume = Math.max(...dataArray);
          setVolume((maxVolume / 255) * 100); // Quy đổi giá trị volume từ 0 đến 100
          if (recording) {
            requestAnimationFrame(updateVolume);
          }
        };
        updateVolume();
      });
    } else {
      // Dừng AudioContext và giải phóng stream khi ngừng thu âm
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    }
  }, [recording]);

  const startRecording = () => {
    setRecording(true);
  };

  const stopRecording = () => {
    setRecording(false);
  };

  const onStop = (recordedBlob) => {
    console.log("Recorded Blob:", recordedBlob);
  };

  return (
    <div>
      <h1>Audio Recorder with Volume Progress</h1>
      <ReactMic
        record={recording}
        className="sound-wave"
        onStop={onStop}
        strokeColor="#000000"
        backgroundColor="#FF4081"
        mimeType="audio/wav"
      />
      <div style={{ margin: "20px 0" }}>
        <h3>Volume Level:</h3>
        <div
          style={{
            width: "100%",
            height: "25px",
            backgroundColor: "#e0e0df",
            borderRadius: "5px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${volume}%`,
              height: "100%",
              backgroundColor: "#3b5998",
              transition: "width 0.1s ease",
            }}
          />
        </div>
      </div>
      <div>
        <button onClick={startRecording} type="button">
          Start Recording
        </button>
        <button onClick={stopRecording} type="button">
          Stop Recording
        </button>
      </div>
    </div>
  );
};

export default AudioRecorderWithVolume;
