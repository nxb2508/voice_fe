import AudioPlayer from "../../components/AudioPlayer";
import AudioRecorder from "../../components/AudioRecorder";
import UploadAudio from "../../components/UploadAudio";
import ModelList from "../../components/ModelList";
import { trainModel } from "../../services/trainService";
import { Modal, Tag, Button, Divider, Row, Col, message, Input } from "antd";
import { useState, useCallback, useEffect } from "react";
import { DeleteOutlined, CloseCircleOutlined, WarningOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { getCookie } from "../../helper/cookie";
import { getMyModelsIsTrainning } from "../../services/modelService";
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
  const [modalTrainError, setModalTrainError] = useState(false);
  const [inputEpochs, setInputEpochs] = useState(0);
  const [isShowUI, setIsShowUI] = useState(false);
  const navigate = useNavigate();
  const fetchApi = async () => {
    try {
      const token = getCookie("token");
      if (token) {
        const responseIsTrainning = await getMyModelsIsTrainning();
        if (responseIsTrainning) {
          console.log(responseIsTrainning);
          setIsShowUI(responseIsTrainning.length === 0);
        }
      }
    } catch (error) {
      message.error("Failed to load models. Please try again later."); // Hiển thị thông báo lỗi
      console.error("Error fetching models:", error);
    }
  };
  useEffect(() => {
    fetchApi();
  }, []);
  const handleChangeAudioUrlInput = (url, name, inputType) => {
    setInputAudioUrl(url);
    setInputAudioBlob(base64ToBlob(url, "audio/wav"));
    setInputFileName(name);
  };

  const handleOk = () => {
    setModalTrain(false);
    navigate("/manage-model");
  };

  const handleCancel = () => {
    setModalTrain(false);
  };

  const handleOkError = () => {
    setModalTrainError(false);
  };

  // useEffect(() => {
  //   console.log(inputNameModel);
  // }, [inputNameModel]);

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
        setModalTrainError(true);
        console.error("Failed to train model");
        // message.error("Failed to train model");
      }
    } catch (error) {
      setModalTrainError(true);
      console.error("Error during training model", error);
      // message.error(
      //   "An error occurred while processing. Please try again later."
      // );
    } finally {
      setLoading(false); // Tắt trạng thái loading sau khi hoàn thành API call
    }
  };

  return (
    <>
      {/* <GoBack /> */}
      {isShowUI ? (
        <>
          <Modal
            title="Processing"
            open={loading} // Modal hiện khi loading = true
            footer={null} // Không có footer để tránh người dùng bấm đóng
            centered // Canh giữa màn hình
            // closable={false} // Không thể đóng modal khi đang loading
            onCancel={() => navigate("/voice-changer")} // Không thể đóng modal khi đang loading
            footer={[
              <Button
                key="primary"
                type="primary"
                onClick={() => navigate("/voice-changer")}
              >
                OK
              </Button>,
            ]}
          >
            <p>
              While waiting for the model to finish training, you can use other
              features.
            </p>
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
          <Modal
            open={modalTrainError} // Modal hiện khi loading = true
            centered
            onOk={handleOkError}
            onCancel={handleOkError}
            footer={[
              <Button
                key="primary"
                color="danger"
                variant="solid"
                onClick={handleOkError}
              >
                OK
              </Button>,
            ]}
          >
            <div style={{ display: "flex", justifyContent: "center" }}>
              <CloseCircleOutlined
                style={{ color: "red", fontSize: "100px" }}
              />
            </div>
            <p
              style={{
                textAlign: "center",
                fontSize: "18px",
                marginTop: "40px",
              }}
            >
              An error occurred while processing. Please try again later.
            </p>
          </Modal>
          <h1 className="create-model__title">Create Your Own Model</h1>
          <div className="create-model__container">
            <div className="create-model__content">
              {inputAudioUrl || inputAudioBlob ? (
                <>
                  <div className="create-model__models">
                    {
                      <>
                        <div
                          style={{ display: "flex", justifyContent: "center" }}
                        >
                          <h2
                            className="create-model__input--title"
                            style={{ color: "#FFF" }}
                          >
                            Config Your Model
                          </h2>
                        </div>

                        <Divider
                          style={{
                            borderColor: "rgba(158,154,154,.2)",
                          }}
                          className="create-model__divider"
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
                          className="create-model__divider"
                        />
                        <Input
                          placeholder="Enter epochs"
                          onChange={handleChangeEpochs}
                          style={{ marginBottom: "20px" }}
                        />

                        {inputNameModel.length > 0 &&
                          parseInt(inputEpochs) > 0 && (
                            <Button
                              type="primary"
                              onClick={handleChangeVoice}
                              loading={loading} // Trạng thái loading
                              style={{
                                width: "100%",
                                backgroundColor: "#D0B4FD",
                              }}
                            >
                              Train Now
                            </Button>
                          )}
                      </>
                    }
                  </div>
                  <div className="create-model__audio">
                    <div className="create-model__input">
                      <h2
                        className="create-model__input--title"
                        style={{ color: "#FFF" }}
                      >
                        Input
                      </h2>
                      <Button
                        className="create-model__input--btnDelete"
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
      ) : (
        <div className="create-model__warning-train">
          <div className="create-model__warning-train-icon">
            <WarningOutlined />
          </div>
          <div className="create-model__warning-train-text">
            Attention: You can only create one model at a time. Please wait...
          </div>
        </div>
      )}
    </>
  );
}

export default CreateModel;
