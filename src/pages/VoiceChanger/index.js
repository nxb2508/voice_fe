import AudioPlayer from "../../components/AudioPlayer";
import AudioRecorder from "../../components/AudioRecorder";
import UploadAudio from "../../components/UploadAudio";
import ModelList from "../../components/ModelList";
import { changeVoiceWithSelectedModel } from "../../services/audioService";
import { Modal, Tag, Button, Divider, Row, Col, Slider, message } from "antd";
import { useState, useCallback, useEffect } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";
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
const ffmpeg = new FFmpeg();

function VoiceChanger() {
  const [inputAudioBlob, setInputAudioBlob] = useState(null);
  const [inputAudioUrl, setInputAudioUrl] = useState("");
  const [inputFileName, setInputFileName] = useState("");
  const [inputType, setInputType] = useState("");
  const [selectedModels, setSelectedModels] = useState(null);
  const [outputAudioUrl, setOutputAudioUrl] = useState("");
  const [loading, setLoading] = useState(false); // Thêm trạng thái loading
  const [inputSpeed, setInputSpeed] = useState(1);
  const [inputVolume, setInputVolume] = useState(1);
  const [outputAudioEditedUrl, setOutputAudioEditedUrl] = useState("");

  const handleSelectModel = useCallback((id) => {
    setSelectedModels(id);
  }, []); // Không có dependency để đảm bảo chỉ được tạo một lần
  const loadFFmpeg = async () => {
    if (!ffmpeg.loaded) {
      await ffmpeg.load();
    }
  };
  const handleChangeAudioUrlInput = (url, name, inputType) => {
    setInputAudioUrl(url);
    setInputAudioBlob(base64ToBlob(url, "audio/wav"));
    setInputFileName(name);
    setInputType(inputType);
  };

  const handleChangeAudioBlobInput = (blob, name, inputType) => {
    setInputAudioBlob(blob);
    setInputAudioUrl(URL.createObjectURL(blob));
    setInputFileName(name);
    setInputType(inputType);
  };

  // useEffect(() => {
  //   console.log(inputAudioBlob);
  //   console.log(inputAudioUrl);
  // }, [inputAudioBlob, inputAudioUrl]);

  const handleChangeVoice = useCallback(async () => {
    console.log(selectedModels);
    setLoading(true); // Bật trạng thái loading trước khi gọi API
    try {
      const result = await changeVoiceWithSelectedModel({
        options: {
          audio: inputAudioBlob,
          modelId: selectedModels,
        },
      });

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
  }, [selectedModels, inputAudioBlob, inputAudioUrl, inputType]);

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
      <h1 className="voice-changer__title">AI Voice Changer</h1>
      <div className="voice-changer__container">
        <div className="voice-changer__content">
          {inputAudioUrl || inputAudioBlob ? (
            <>
              <div className="voice-changer__models">
                <div className="model-list">
                  <ModelList
                    onSelectModel={handleSelectModel}
                    filter={"voice-changer"}
                  />
                </div>
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
                      setInputAudioBlob(null);
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
                {outputAudioUrl && (
                  <>
                    <div className="audio__output">
                      <h2 style={{ color: "#FFF" }}>Output</h2>
                      {/* Speed */}
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

                      {/* End Speed */}
                      <Divider
                        style={{
                          borderColor: "rgba(158,154,154,.2)",
                        }}
                      />
                      {outputAudioUrl && (
                        <AudioPlayer
                          audioUrl={outputAudioUrl}
                          fileName={"converted-" + inputFileName}
                          tagLabel={"Change Audio"}
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
                          fileName={"edited-" + inputFileName}
                          tagLabel={"Edit Audio"}
                        />
                      )}
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <>
              <Row
                gutter={16}
                justify="space-between"
                style={{ width: "100%", height: "500px" }}
              >
                <Col className="gutter-row" span={12}>
                  <AudioRecorder
                    onRecordComplete={handleChangeAudioBlobInput}
                  />
                </Col>
                <Col className="gutter-row" span={12}>
                  <UploadAudio
                    onUpload={handleChangeAudioUrlInput}
                    style={{ height: "100%" }}
                  />
                </Col>
              </Row>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default VoiceChanger;
