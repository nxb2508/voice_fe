import { UploadOutlined } from "@ant-design/icons";
import AudioPlayer from "../../components/AudioPlayer";
import AudioRecorder from "../../components/AudioRecorder";
import UploadAudio from "../../components/UploadAudio";
import ModelList from "../../components/ModelList";
import {
  textToSpeechWithFileInput,
  textToSpeechWithTextPlainInput,
} from "../../services/textToSpeechService";
import { Modal, Tag, Button, Divider, Row, Col, message } from "antd";
import { Input, Upload } from "antd";
import { useState, useCallback, useEffect } from "react";
import { DeleteOutlined } from "@ant-design/icons";
import "./TextToSpeech.scss";

const { TextArea } = Input;

const allowedFormats = [
  "text/plain",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

function shortenFileName(fileName, maxLength) {
  // Kiểm tra nếu fileName dài hơn giới hạn đã đặt
  if (fileName.length <= maxLength) {
    return fileName;
  }

  // Tách phần tên file và phần mở rộng
  const extension = fileName.substring(fileName.lastIndexOf("."));
  const nameWithoutExt = fileName.substring(0, fileName.lastIndexOf("."));

  // Độ dài tối đa của tên khi rút gọn (trừ đi độ dài của phần mở rộng và 3 ký tự '...')
  const charsToShow = maxLength - extension.length - 3;

  // Rút gọn tên file và thêm dấu "..."
  const shortenedName =
    nameWithoutExt.substring(0, charsToShow) + "..." + extension;

  return shortenedName;
}

function TextToSpeech() {
  const [inputText, setInputText] = useState("");
  const [inputFile, setInputFile] = useState(null);
  const [selectedModels, setSelectedModels] = useState(null);
  const [outputAudioUrl, setOutputAudioUrl] = useState("");
  const [loading, setLoading] = useState(false); // Thêm trạng thái loading
  const [clearSelected, setClearSelected] = useState(false);
  const handleSelectModel = useCallback((id) => {
    setSelectedModels(id);
  }, []); // Không có dependency để đảm bảo chỉ được tạo một lần

  const handleUpload = useCallback(async (file) => {
    // Chỉ chấp nhận các file .txt và .docx
    if (!allowedFormats.includes(file.type)) {
      message.error("Chỉ chấp nhận file .txt và .docx!");
      return false;
    }

    setInputFile(file); // Set file vào state

    return false; // Ngăn chặn hành vi upload mặc định của trình duyệt
  }, []);

  const handleClearModelSelection = () => {
    // Đặt clearSelected thành true để kích hoạt useEffect trong ModelList
    setClearSelected(true);
    // Reset lại clearSelected về false để có thể gọi lại sau
    setTimeout(() => setClearSelected(false), 0);
  };

  const handleChangeVoice = useCallback(async () => {
    setLoading(true); // Bật trạng thái loading trước khi gọi API
    try {
      let result = null;
      const modelId = String(selectedModels);
      if (inputText) {
        result = await textToSpeechWithTextPlainInput({
          text: inputText,
          model_id: modelId,
          locate: "en",
        });
      } else if (inputFile) {
        const formData = new FormData();
        formData.append("file", inputFile);
        formData.append("model_id", modelId);
        formData.append("locate", "vi");
        result = await textToSpeechWithFileInput(formData);
      }

      if (result) {
        setOutputAudioUrl(result); // Set URL của audio kết quả
      } else {
        console.error("Failed to change voice");
        message.error("Failed to change voice. Please try again.");
      }
    } catch (error) {
      console.error("Error during voice change:", error);
      message.error(
        "An error occurred while processing. Please try again later."
      );
    } finally {
      setLoading(false); // Tắt trạng thái loading sau khi hoàn thành API call
    }
  }, [selectedModels, inputText, inputFile]);

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
      <h1 className="text-to-speech__title">Text To Speech</h1>
      <div className="text-to-speech__container">
        <div className="text-to-speech__content">
          <div className="text-to-speech__models">
            <div className="model-list">
              <ModelList
                onSelectModel={handleSelectModel}
                clearSelectedModel={clearSelected}
                filter={"t2s"}
              />
            </div>
            {selectedModels && (inputFile || inputText) && (
              <>
                <Divider
                  style={{
                    borderColor: "rgba(158,154,154,.2)",
                  }}
                />

                <Button
                  type="primary"
                  loading={loading} // Trạng thái loading
                  style={{ width: "100%", backgroundColor: "#D0B4FD" }}
                  onClick={handleChangeVoice}
                >
                  Change Voice Now
                </Button>
              </>
            )}
          </div>
          <div className="text-to-speech__audio">
            <div className="text-to-speech__input">
              <div className="text-to-speech__input--title">
                <p>Input</p>
                {!inputText &&
                  (!inputFile ? (
                    <Upload
                      accept=".doc,.docx,.txt"
                      showUploadList={false}
                      beforeUpload={handleUpload}
                    >
                      <Button
                        className="upload__button"
                        icon={<UploadOutlined />}
                        loading={loading}
                      >
                        Upload
                      </Button>
                    </Upload>
                  ) : (
                    <Tag>{shortenFileName(inputFile.name, 50)}</Tag>
                  ))}
              </div>
              <Button
                className="text-to-speech__input--btnDelete"
                type="primary"
                danger
                icon={<DeleteOutlined />}
                onClick={() => {
                  setInputText("");
                  setInputFile(null);
                  setOutputAudioUrl("");
                  setSelectedModels(null);
                  handleClearModelSelection();
                }}
              ></Button>
            </div>
            <div>
              {!inputFile && (
                <TextArea
                  value={inputText}
                  placeholder="Puts your text here"
                  autoSize={{ minRows: 2, maxRows: 6 }}
                  size="large"
                  onChange={(e) => setInputText(e.target.value)}
                />
              )}
            </div>
            <Divider
              style={{
                borderColor: "rgba(158,154,154,.2)",
              }}
            />
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
                  fileName={"output.mp3"}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default TextToSpeech;
