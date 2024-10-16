import AllRoute from "./components/AllRoute";
import "./App.css";
import AudioPlayer from "./components/AudioPlayer";
import UploadAudio from "./components/UploadAudio";
import AudioRecorder from "./components/AudioRecorder";
import { useState, useCallback } from "react";

const App = () => {
  const [uploadedAudioUrl, setUploadedAudioUrl] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState("");
  const handleAudioInput = useCallback((url, name) => {
    setUploadedAudioUrl(url);
    setUploadedFileName(name);
  }, []); // Không có dependency để đảm bảo chỉ được tạo một lần

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