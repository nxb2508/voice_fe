import AudioPlayer from "../../components/AudioPlayer";
import AudioRecorder from "../../components/AudioRecorder";
import UploadAudio from "../../components/UploadAudio";
import ModelList from "../../components/ModelList";
import { trainModel } from "../../services/trainService";
import { Modal, Tag, Button, Divider, Row, Col, message, Input } from "antd";
import { useState, useCallback, useEffect } from "react";
import { DeleteOutlined } from "@ant-design/icons";
import { useNavigate } from 'react-router-dom';
import "./CreateModel.scss";
import GoBack from "../../components/GoBack";
function base64ToBlob(base64, mimeType) {
  const byteString = atob(base64.split(",")[1]);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);

  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  return new Blob([ab], { type: mimeType });
}

function CreateModel() {
  const [inputAudioBlob, setInputAudioBlob] = useState(null);
  const [inputAudioUrl, setInputAudioUrl] = useState("");
  const [inputFileName, setInputFileName] = useState("");
  const [inputNameModel, setInputNameModel] = useState("");
  const [loading, setLoading] = useState(false); // Thêm trạng thái loading
  const [messageTrain, setMessageTrain] = useState("");
  const [modalTrain, setModalTrain] = useState(false);
  const [inputEpochs, setInputEpochs] = useState(0);
  const navigate = useNavigate();

  const handleChangeAudioUrlInput = (url, name, inputType) => {
    setInputAudioUrl(url);
    setInputAudioBlob(base64ToBlob(url, "audio/wav"));
    setInputFileName(name);
  };

  const handleOk = () => {
    setModalTrain(false);
    navigate('/voice-changer');
  };

  const handleCancel = () => {
    setModalTrain(false);
  };

  useEffect(() => {
    console.log(inputNameModel);
  }, [inputNameModel]);

  const handleChangeNameModel = (e) => {
    setInputNameModel(e.target.value);
  };

  const handleChangeEpochs = (e) => {
    setInputEpochs(e.target.value);
    
  };

  const handleChangeVoice = async () => {
    setLoading(true); // Bật trạng thái loading trước khi gọi API
    try {
      console.log("inputAudioBlob", inputAudioBlob);
      console.log("inputNameModel", inputNameModel);
      const result = await trainModel({
        options: {
          file: inputAudioBlob,
          name: inputNameModel,
          epochs: inputEpochs,
        },
      });

      if (result) {
        setMessageTrain(result.message);
        setModalTrain(true);
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

  return (
    <>
      <GoBack />
      <Modal
        title="Processing"
        open={loading} // Modal hiện khi loading = true
        footer={null} // Không có footer để tránh người dùng bấm đóng
        closable={false} // Không thể đóng modal khi đang loading
        centered // Canh giữa màn hình
      >
        <p>Please wait, the audio is being processed...</p>
      </Modal>
      <Modal
        title="Train Model"
        open={modalTrain} // Modal hiện khi loading = true
        centered // Canh giữa màn hình
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>{messageTrain}</p>
      </Modal>
      <h1 className="voice-changer__title">Create Your Own Model</h1>
      <div className="voice-changer__container">
        <div className="voice-changer__content">
          {inputAudioUrl || inputAudioBlob ? (
            <>
              <div className="voice-changer__models">
                {
                  <>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <h2
                        className="voice-changer__input--title"
                        style={{ color: "#FFF" }}
                      >
                        Config Your Model
                      </h2>
                    </div>

                    <Divider
                      style={{
                        borderColor: "rgba(158,154,154,.2)",
                      }}
                    />
                    <Input
                      placeholder="Enter model name"
                      onChange={handleChangeNameModel}
                      style={{ marginBottom: "20px" }}
                    />
                    <Divider
                      style={{
                        borderColor: "rgba(158,154,154,.2)",
                      }}
                    />
                    <Input
                      placeholder="Enter epochs"
                      onChange={handleChangeEpochs}
                      style={{ marginBottom: "20px" }}
                    />

                    {(inputNameModel.length > 0 && parseInt(inputEpochs) > 0) && (
                      <Button
                        type="primary"
                        onClick={handleChangeVoice}
                        loading={loading} // Trạng thái loading
                        style={{ width: "100%", backgroundColor: "#D0B4FD" }}
                      >
                        Train Now
                      </Button>
                    )}
                  </>
                }
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
                      setInputNameModel("");
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
                {/* <div className="audio__output">
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
                </div> */}
              </div>
            </>
          ) : (
            <>
              <Row
                gutter={16}
                justify="space-between"
                style={{ width: "100%", height: "500px" }}
              >
                {/* <Col className="gutter-row" span={12}>
                  <AudioRecorder
                    onRecordComplete={handleChangeAudioBlobInput}
                  />
                </Col> */}
                <Col className="gutter-row" span={24}>
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

export default CreateModel;
