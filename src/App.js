import AllRoute from "./components/AllRoute";
import "./App.css";
import AudioPlayer from "./components/AudioPlayer";
import UploadAudio from "./components/UploadAudio";
import AudioRecorder from "./components/AudioRecorder";
import { useState } from "react";

const App = () => {
  const [uploadedAudioUrl, setUploadedAudioUrl] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState("");
  const handleAudioInput = (url, name) => {
    setUploadedAudioUrl(url); // Cập nhật URL của audio khi
    setUploadedFileName(name); // Cập nhật tên file audio
  };

  return (
    <div>
      <AudioRecorder onRecordComplete={handleAudioInput} />
      <UploadAudio onUpload={handleAudioInput} /> {/* Component upload */}
      {uploadedAudioUrl && (
        <AudioPlayer
          audioUrl={
            uploadedAudioUrl ||
            "https://cdn.hoclieuthongminh.com/bt-games/number_cards/audio/win.mp3"
          }
          fileName={uploadedFileName || "win.mp3"}
          tagLabel={uploadedAudioUrl ? "Uploaded Audio" : "Original Audio"}
        />
      )}
    </div>
  );
};

export default App;