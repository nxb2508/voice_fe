import AllRoute from "./components/AllRoute";
import "./App.css";
import AudioPlayer from "./components/AudioPlayer";
import UploadAudio from "./components/UploadAudio";
import { useState } from "react";

const App = () => {
  const [uploadedAudioUrl, setUploadedAudioUrl] = useState("");
  const handleAudioUpload = (url) => {
    setUploadedAudioUrl(url); // Cập nhật URL của audio khi upload
  };

  return (
    <div>
      <UploadAudio onUpload={handleAudioUpload} /> {/* Component upload */}
      <AudioPlayer
        audioUrl={
          uploadedAudioUrl ||
          "https://cdn.hoclieuthongminh.com/bt-games/number_cards/audio/win.mp3"
        }
        tagLabel={uploadedAudioUrl ? "Uploaded Audio" : "Original Audio"}
      />
    </div>
  );
};

export default App;

// import React, { useState, useRef } from "react";
// import { Upload, Button, Space, message, Row, Col } from "antd";
// import {
//   UploadOutlined,
//   PlayCircleOutlined,
//   DownloadOutlined,
//   StopOutlined,
// } from "@ant-design/icons";
// import WaveSurfer from "wavesurfer.js";

// const App = () => {
//   const [waveform, setWaveform] = useState(null);
//   const [recording, setRecording] = useState(false);
//   const [audioBlob, setAudioBlob] = useState(null);
//   const audioRef = useRef(null);
//   const mediaRecorderRef = useRef(null);
//   const wavesurferRef = useRef(null);

//   // Khởi tạo WaveSurfer
//   const initWaveSurfer = () => {
//     const ws = WaveSurfer.create({
//       container: "#waveform",
//       waveColor: "#ddd",
//       progressColor: "#3b82f6",
//       cursorColor: "#ff4d4f",
//       height: 100,
//     });
//     setWaveform(ws);
//     wavesurferRef.current = ws;
//   };

//   // Bắt đầu thu âm
//   const startRecording = async () => {
//     const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//     mediaRecorderRef.current = new MediaRecorder(stream);
//     mediaRecorderRef.current.start();
//     setRecording(true);

//     const chunks = [];
//     mediaRecorderRef.current.ondataavailable = (e) => chunks.push(e.data);
//     mediaRecorderRef.current.onstop = () => {
//       const blob = new Blob(chunks, { type: "audio/wav" });
//       setAudioBlob(blob);
//       const url = URL.createObjectURL(blob);
//       waveform.load(url);
//     };
//   };

//   // Dừng thu âm
//   const stopRecording = () => {
//     mediaRecorderRef.current.stop();
//     setRecording(false);
//   };

//   // Xử lý khi tải file lên
//   const handleUpload = (file) => {
//     const url = URL.createObjectURL(file);
//     waveform.load(url);
//     return false;
//   };

//   // Tải file xuống
//   const downloadAudio = () => {
//     const url = URL.createObjectURL(audioBlob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = "recording.wav";
//     a.click();
//   };

//   // Khởi tạo WaveSurfer khi component được mount
//   React.useEffect(() => {
//     initWaveSurfer();
//     return () => waveform && waveform.destroy();
//   }, []);

//   return (
//     <div style={{ padding: "20px" }}>
//       <Row gutter={16}>
//         <Col span={12}>
//           <h2>Audio Recorder & Player</h2>
//           <Space direction="vertical" size="middle">
//             <Button
//               icon={recording ? <StopOutlined /> : <PlayCircleOutlined />}
//               onClick={recording ? stopRecording : startRecording}
//               type="primary"
//             >
//               {recording ? "Stop Recording" : "Start Recording"}
//             </Button>

//             <Upload beforeUpload={handleUpload} showUploadList={false}>
//               <Button icon={<UploadOutlined />}>Upload Audio</Button>
//             </Upload>

//             {audioBlob && (
//               <Button icon={<DownloadOutlined />} onClick={downloadAudio}>
//                 Download Recording
//               </Button>
//             )}
//           </Space>
//         </Col>
//         <Col span={12}>
//           {wavesurferRef.current && (
//             <div id="waveform" style={{ border: "1px solid #ddd" }}></div>
//           )}
//         </Col>
//       </Row>
//     </div>
//   );
// };

// export default App;
