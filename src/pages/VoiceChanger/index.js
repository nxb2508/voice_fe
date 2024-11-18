import AudioPlayer from "../../components/AudioPlayer";
import AudioRecorder from "../../components/AudioRecorder";
import UploadAudio from "../../components/UploadAudio";
import ModelList from "../../components/ModelList";
import { changeVoiceWithSelectedModel } from "../../services/audioService";
import { Modal, Tag, Button, Divider, Row, Col, message } from "antd";
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
    if (selectedModels.toString().startsWith("ffmpeg")) {
      await processAudio();
      return;
    }
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

  const processAudio = async () => {
    setLoading(true);
    await loadFFmpeg();
    // Tải file âm thanh vào bộ nhớ FFmpeg
    ffmpeg.writeFile("input.wav", await fetchFile(inputAudioUrl));

    switch (selectedModels) {
      case "ffmpeg_1":
        // Giọng robot
        await ffmpeg.exec([
          "-i",
          "input.wav",
          "-af",
          "asetrate=43000, atempo=1.0, apulsator=mode=sine:hz=3:width=0.1:offset_r=0, aecho=0.8:0.88:60:0.4",
          "output_robot.wav",
        ]);
        break;
      case "ffmpeg_2":
        // Giọng kid
        await ffmpeg.exec([
          "-i",
          "input.wav",
          "-af",
          "asetrate=48000*1.6, atempo=0.85",
          "output_robot.wav",
        ]);
        break;
      case "ffmpeg_3":
        // Giọng nam
        await ffmpeg.exec([
          "-i",
          "input.wav",
          "-af",
          "aecho=0.8:0.88:20:0.5, asetrate=44100*0.8, atempo=1.25, acrusher=8:0.5",
          "output_robot.wav",
        ]);
        break;
      case "ffmpeg_4":
        // Giọng nữ
        await ffmpeg.exec([
          "-i",
          "input.wav",
          "-af",
          "asetrate=44100*1.4, atempo=0.8",
          "output_robot.wav",
        ]);
        break;
      case "ffmpeg_5":
        // Giọng sonic
        await ffmpeg.exec([
          "-i",
          "input.wav",
          "-af",
          "asetrate=48000*1.6, atempo=3.0",
          "output_robot.wav",
        ]);
        break;
      case "ffmpeg_6":
        // Giọng fast speed
        await ffmpeg.exec([
          "-i",
          "input.wav",
          "-af",
          "asetrate=44100*1.4, atempo=2.0",
          "output_robot.wav",
        ]);
        break;
      case "ffmpeg_7":
        // Giọng turtle speed
        await ffmpeg.exec([
          "-i",
          "input.wav",
          "-af",
          "asetrate=44100*0.6, atempo=0.7",
          "output_robot.wav",
        ]);
        break;
      case "ffmpeg_8":
        // Giọng snail speed
        await ffmpeg.exec([
          "-i",
          "input.wav",
          "-af",
          "asetrate=44100*0.5, atempo=0.5",
          "output_robot.wav",
        ]);
        break;
      case "ffmpeg_9":
        // Giọng library
        await ffmpeg.exec([
          "-i",
          "input.wav",
          "-af",
          "aecho=0.5:0.5:500:0.1, lowpass=f=2000, volume=1.5",
          "output_robot.wav",
        ]);
        break;
      case "ffmpeg_10":
        // Giọng wardrobe
        await ffmpeg.exec([
          "-i",
          "input.wav",
          "-af",
          "[0:a]lowpass=f=1200, highpass=f=300, volume=2.0",
          "output_robot.wav",
        ]);
        break;
      case "ffmpeg_11":
        // Giọng bathroom
        await ffmpeg.exec([
          "-i",
          "input.wav",
          "-af",
          "anoisesrc=color=white:amplitude=0.02 [noise]; [0:a][noise]amix=inputs=2:duration=first:dropout_transition=2, volume=1.5",
          "output_robot.wav",
        ]);
        break;
      case "ffmpeg_12":
        // Giọng diving voice
        await ffmpeg.exec([
          "-i",
          "input.wav",
          "-af",
          "[0:a]lowpass=f=400, highpass=f=100, atempo=0.9, volume=1.5",
          "output_robot.wav",
        ]);
        break;
      default:
        break;
    }

    // Lấy file âm thanh đã xử lý từ bộ nhớ của FFmpeg
    const data = await ffmpeg.readFile("output_robot.wav");

    // Tạo URL để phát lại âm thanh
    const url = URL.createObjectURL(
      new Blob([data.buffer], { type: "audio/wav" })
    );
    setOutputAudioUrl(url);
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
                      fileName={"converted-" + inputFileName}
                      tagLabel={"Change Audio"}
                    />
                  )}
                </div>
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
