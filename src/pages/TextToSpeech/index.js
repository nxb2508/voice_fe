import { UploadOutlined } from "@ant-design/icons";
import AudioPlayer from "../../components/AudioPlayer";
import AudioRecorder from "../../components/AudioRecorder";
import UploadAudio from "../../components/UploadAudio";
import ModelList from "../../components/ModelList";
import {
  textToSpeechWithFileInput,
  textToSpeechWithTextPlainInput,
} from "../../services/textToSpeechService";
import { Modal, Tag, Button, Divider, Row, Col, message, Slider } from "antd";
import { Input, Upload } from "antd";
import { useState, useCallback, useEffect } from "react";
import { DeleteOutlined } from "@ant-design/icons";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";
import * as mammoth from "mammoth";

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

const ffmpeg = new FFmpeg();

function TextToSpeech() {
  const [inputText, setInputText] = useState("");
  const [inputFile, setInputFile] = useState(null);
  const [selectedModels, setSelectedModels] = useState(null);
  const [outputAudioUrl, setOutputAudioUrl] = useState("");
  const [loading, setLoading] = useState(false); // Thêm trạng thái loading
  const [clearSelected, setClearSelected] = useState(false);
  const [inputSpeed, setInputSpeed] = useState(1);
  const [inputVolume, setInputVolume] = useState(1);
  const [outputAudioEditedUrl, setOutputAudioEditedUrl] = useState("");
  const [inputTextFromFile, setInputTextFromFile] = useState("");

  const loadFFmpeg = async () => {
    if (!ffmpeg.loaded) {
      await ffmpeg.load();
    }
  };

  useEffect(() => {
    if (inputFile) {
      console.log(inputFile.name.split(".").pop());
      if (inputFile.name.split(".").pop() === "txt") {
        const reader = new FileReader();
        reader.onload = (e) => {
          setInputTextFromFile(e.target.result);
        };
        reader.readAsText(inputFile);
      } else if (inputFile.name.split(".").pop() === "docx") {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const arrayBuffer = e.target.result;
          const result = await mammoth.extractRawText({ arrayBuffer });
          setInputTextFromFile(result.value);
        };
        reader.readAsArrayBuffer(inputFile);
      } else {
        message.error("Chỉ chấp nhận file .txt và .docx!");
      }
    }
  }, [inputFile]);

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

  const handleChangeVoice = async () => {
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
        formData.append("locate", "en");
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
  };
  const onChangeSpeed = (newValue) => {
    setInputSpeed(newValue);
  };

  const onChangeVolume = (newValue) => {
    setInputVolume(newValue);
  };

  const editAudio = async () => {
    setLoading(true);
    await loadFFmpeg();
    try {
      const audioData = await fetchFile(outputAudioUrl);
    } catch (error) {
      console.error("Error during voice change:", error);
    }
    // Tải file âm thanh vào bộ nhớ FFmpeg
    ffmpeg.writeFile("input_edit.wav", await fetchFile(outputAudioUrl));
    console.log("ok");
    var changeTxt = "volume=" + inputVolume + ", atempo=" + inputSpeed;
    console.log(changeTxt);
    await ffmpeg.exec([
      "-i",
      "input_edit.wav",
      "-af",
      changeTxt,
      "output_edited.wav",
    ]);
    console.log("ok2");

    // Lấy file âm thanh đã xử lý từ bộ nhớ của FFmpeg
    const data = await ffmpeg.readFile("output_edited.wav");
    console.log("ok3");

    // Tạo URL để phát lại âm thanh
    const url = URL.createObjectURL(
      new Blob([data.buffer], { type: "audio/wav" })
    );
    setOutputAudioEditedUrl(url);
    setLoading(false);
  };
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
                  setOutputAudioEditedUrl("");
                  setInputTextFromFile("");
                  setInputSpeed(1);
                  setInputVolume(1);
                  handleClearModelSelection();
                }}
              ></Button>
            </div>
            <div>
              {!inputFile ? (
                <TextArea
                  value={inputText}
                  placeholder="Puts your text here"
                  autoSize={{ minRows: 2, maxRows: 6 }}
                  size="large"
                  onChange={(e) => setInputText(e.target.value)}
                />
              ) : (
                <TextArea
                  value={inputTextFromFile}
                  autoSize={{ minRows: 2, maxRows: 6 }}
                  size="large"
                  readOnly
                />
              )}
            </div>
            <Divider
              style={{
                borderColor: "rgba(158,154,154,.2)",
              }}
            />
            {outputAudioUrl && (
              <div className="audio__output">
                <h2 style={{ color: "#FFF" }}>Output</h2>
                <div className="form-edit-audio">
                  <div className="speed">
                    <Tag className="speed__title" color="#108ee9">
                      Speed: {inputSpeed}
                    </Tag>
                    <Slider
                      className="speed__slider"
                      min={0.5}
                      max={2}
                      step={0.1}
                      defaultValue={1}
                      onChange={onChangeSpeed}
                      styles={{
                        track: {
                          background: "rgb(125, 78, 217)",
                        },
                        rail: {
                          background: "#f5f5f5",
                        },
                      }}
                      // onChangeComplete={onChangeSpeedComplete}
                    />
                  </div>
                  <div className="volume">
                    <Tag className="volume__title" color="#108ee9">
                      Volume: {inputVolume}
                    </Tag>
                    <Slider
                      className="volume__slider"
                      min={0.5}
                      max={5}
                      step={0.5}
                      defaultValue={1}
                      onChange={onChangeVolume}
                      styles={{
                        track: {
                          background: "rgb(125, 78, 217)",
                        },
                        rail: {
                          background: "#f5f5f5",
                        },
                      }}
                      // onChangeComplete={onChangeSpeedComplete}
                    />
                  </div>
                  <Button
                    type="primary"
                    onClick={editAudio}
                    loading={loading} // Trạng thái loading
                    style={{ width: "20%", backgroundColor: "#D0B4FD" }}
                  >
                    Edit
                  </Button>
                </div>
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
                <Divider
                  style={{
                    borderColor: "rgba(158,154,154,.2)",
                  }}
                />
                {outputAudioEditedUrl && (
                  <AudioPlayer
                    audioUrl={outputAudioEditedUrl}
                    fileName={"edited-" + "output.mp3"}
                    tagLabel={"Edit Audio"}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default TextToSpeech;
