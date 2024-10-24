import AudioPlayer from "../../components/AudioPlayer";
import AudioRecorder from "../../components/AudioRecorder";
import UploadAudio from "../../components/UploadAudio";
import ModelList from "../../components/ModelList";
import { changeVoiceWithSelectedModel } from "../../services/audioService";
import { Modal, Tag, Button, Divider, Row, Col } from "antd";
import { useState, useCallback, useEffect } from "react";
import { DeleteOutlined } from "@ant-design/icons";
import "./VoiceChanger.scss";
function base64ToBlob(base64, mimeType) {
  const byteString = atob(base64.split(",")[1]);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);

  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  return new Blob([ab], { type: mimeType });
}

function VoiceChanger() {
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
      <h1 className="voice-changer__title">AI Voice Changer</h1>
      <div className="voice-changer__container">
        <div className="voice-changer__content">
          {inputAudioUrl ? (
            <>
              <div className="voice-changer__models">
                <ModelList onSelectModel={handleSelectModel} />
                {selectedModels && (
                  <>
                    <Divider
                      style={{
                        borderColor: "rgba(158,154,154,.2)",
                      }}
                    />

                    <Button
                      type="primary"
                      onClick={handleChangeVoice}
                      loading={loading} // Trạng thái loading
                      style={{ width: "100%", backgroundColor: "#D0B4FD" }}
                    >
                      Change Voice Now
                    </Button>
                  </>
                )}
              </div>
              <div className="voice-changer__audio">
                <div className="voice-changer__input">
                  <h2
                    className="voice-changer__input--title"
                    style={{ color: "#FFF" }}
                  >
                    Input
                  </h2>
                  <Button
                    className="voice-changer__input--btnDelete"
                    type="primary"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => {
                      setInputAudioUrl("");
                      setInputFileName("");
                      setSelectedModels(null);
                      setOutputAudioUrl("");
                    }}
                  ></Button>
                </div>
                <Divider
                  style={{
                    borderColor: "rgba(158,154,154,.2)",
                  }}
                />
                <div className="audio__input">
                  <AudioPlayer
                    audioUrl={inputAudioUrl}
                    fileName={inputFileName}
                    tagLabel={"Original Audio"}
                  />
                </div>
                <div className="audio__output">
                  <h2 style={{ color: "#FFF" }}>Output</h2>
                  <Divider
                    style={{
                      borderColor: "rgba(158,154,154,.2)",
                    }}
                  />
                  {outputAudioUrl && (
                    <AudioPlayer
                      audioUrl={outputAudioUrl}
                      fileName={inputFileName || "win.mp3"}
                      tagLabel={"Change Audio"}
                    />
                  )}
                </div>
              </div>
            </>
          ) : (
            <UploadAudio onUpload={handleChangeAudioInput} />
          )}
        </div>
      </div>

      {/* {inputAudioUrl && <ModelList onSelectModel={handleSelectModel} />}
      {selectedModels && (
        <div>
          <Tag color="magenta">{selectedModels}</Tag>
        </div>
      )}
      {inputAudioUrl && (
        <AudioPlayer
          audioUrl={inputAudioUrl}
          fileName={inputFileName}
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
      )} */}
    </>
  );
}

export default VoiceChanger;
