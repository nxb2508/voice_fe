import AllRoute from "./components/AllRoute";
import "./App.css";
import AudioPlayer from "./components/AudioPlayer";
import AudioRecorder from "./components/AudioRecorder";
import UploadAudio from "./components/UploadAudio";
import ModelList from "./components/ModelList";
import { changeVoiceWithSelectedModel } from "./services/audioService";
import { Modal, Tag, Button } from "antd";
import { useState, useCallback, useEffect } from "react";
function base64ToBlob(base64, mimeType) {
  const byteString = atob(base64.split(",")[1]);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);

  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  return new Blob([ab], { type: mimeType });
}
const App = () => {
  const [inputAudioUrl, setInputAudioUrl] = useState("");
  const [inputFileName, setInputFileName] = useState("");
  const [inputType, setInputType] = useState("");
  const [selectedModels, setSelectedModels] = useState(null);
  const [outputAudioUrl, setOutputAudioUrl] = useState("");
  const [loading, setLoading] = useState(false); // Thêm trạng thái loading

  const handleSelectModel = useCallback((id) => {
    setSelectedModels(id);
  }, []); // Không có dependency để đảm bảo chỉ được tạo một lần

  const handleChangeAudioInput = useCallback((url, name, inputType) => {
    setInputAudioUrl(url);
    setInputFileName(name);
    setInputType(inputType);
  }, []); // Không có dependency để đảm bảo chỉ được tạo một lần

  // useEffect(() => {
  //   console.log("inputAudioUrl", inputAudioUrl);
  // }, [inputAudioUrl]);

  const handleChangeVoice = useCallback(async () => {
    setLoading(true); // Bật trạng thái loading trước khi gọi API
    try {
      // inputAudioUrl lúc này là Blob, không cần fetch từ URL nữa
      // const audioBlob = inputAudioUrl;

      // // Tạo một đối tượng File từ Blob (nếu cần)
      // const audioFile = new File([audioBlob], inputFileName || "audio.wav", {
      //   type: audioBlob.type || "audio/wav", // Cung cấp kiểu MIME
      // });

      console.log(inputType);

      let audioBlob = null;

      if (inputType === "record") {
        console.log("record");
        await fetch(inputAudioUrl)
          .then((response) => response.blob()) // Lấy dữ liệu dưới dạng Blob
          .then((blob) => {
            audioBlob = blob;
          })
          .catch((error) => console.error("Error fetching Blob:", error));
      } else {
        audioBlob = base64ToBlob(inputAudioUrl, "audio/wav");
      }

      console.log(audioBlob);
      const result = await changeVoiceWithSelectedModel({
        options: {
          audio: audioBlob,
          modelId: selectedModels,
        },
      });

      if (result) {
        setOutputAudioUrl(result); // Set URL của audio kết quả
      } else {
        console.error("Failed to change voice");
      }
    } catch (error) {
      console.error("Error during voice change:", error);
    } finally {
      setLoading(false); // Tắt trạng thái loading sau khi hoàn thành API call
    }
  }, [selectedModels, inputAudioUrl, inputType]);

  // const handleChangeVoice = useCallback(async () => {
  //   setLoading(true); // Bật trạng thái loading trước khi gọi API
  //   try {
  //     const audioBlob = await fetch(inputAudioUrl).then((r) => r.blob());

  //     // Tạo một đối tượng File từ Blob (tùy chọn)
  //     const audioFile = new File([audioBlob], inputFileName || "audio.wav", {
  //       type: audioBlob.type,
  //     });

  //     const result = await changeVoiceWithSelectedModel({
  //       options: {
  //         audio: audioFile,
  //         modelId: selectedModels,
  //       },
  //     });

  //     if (result) {
  //       setOutputAudioUrl(result);
  //     } else {
  //       console.error("Failed to change voice");
  //     }
  //   } catch (error) {
  //     console.error("Error during voice change:", error);
  //   } finally {
  //     setLoading(false); // Tắt trạng thái loading sau khi hoàn thành API call
  //   }
  // }, [selectedModels, inputAudioUrl, inputFileName]);

  return (
    <>
      <Modal
        title="Processing"
        open={loading} // Modal hiện khi loading = true
        footer={null} // Không có footer để tránh người dùng bấm đóng
        closable={false} // Không thể đóng modal khi đang loading
        centered // Canh giữa màn hình
      >
        <p>Please wait, the audio is being processed...</p>
      </Modal>
      {inputAudioUrl && <ModelList onSelectModel={handleSelectModel} />}
      <AudioRecorder onRecordComplete={handleChangeAudioInput} />
      <UploadAudio onUpload={handleChangeAudioInput} /> {/* Component upload */}
      {selectedModels && (
        <div>
          <Tag color="magenta">{selectedModels}</Tag>
        </div>
      )}
      {inputAudioUrl && (
        <AudioPlayer
          audioUrl={inputAudioUrl}
          fileName={inputFileName || "win.mp3"}
          tagLabel={"Original Audio"}
        />
      )}
      {selectedModels && inputAudioUrl && (
        <Button type="primary" danger onClick={handleChangeVoice}>
          Change Voice Now
        </Button>
      )}
      {outputAudioUrl && (
        <AudioPlayer
          audioUrl={outputAudioUrl}
          fileName={inputFileName || "win.mp3"}
          tagLabel={"Change Audio"}
        />
      )}
    </>
  );
};

export default App;
