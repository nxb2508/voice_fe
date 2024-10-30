import { Button, Col, Divider, Modal, Row } from "antd";
import UploadAudio from "../../components/UploadAudio";
import { useCallback, useState } from "react";
import AudioPlayer from "../../components/AudioPlayer";
import { DeleteOutlined } from "@ant-design/icons";
import TypeList from "../../components/TypeList";
function base64ToBlob(base64, mimeType) {
  const byteString = atob(base64.split(",")[1]);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);

  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  return new Blob([ab], { type: mimeType });
}
function VoiceType() {
  const [inputAudioBlob, setInputAudioBlob] = useState(null);
  const [inputAudioUrl, setInputAudioUrl] = useState("");
  const [inputFileName, setInputFileName] = useState("");
  const [inputType, setInputType] = useState("");
  const [selectedType, setSelectedType] = useState(null);
  const [outputAudioUrl, setOutputAudioUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const handleChangeAudioUrlInput = (url, name, inputType) => {
    setInputAudioUrl(url);
    setInputAudioBlob(base64ToBlob(url, "audio/wav"));
    setInputFileName(name);
    setInputType(inputType);
  };
  const handleSelectType = useCallback((id) => {
    setSelectedType(id);
  }, []);
  const handleChangeVoice = () => {
    setLoading(true);
    switch (selectedType) {
      case 1:
        setOutputAudioUrl('');
        break;
      case 2:
        break;
      case 3:
        break;
      case 4:
        break;
      default:
        break;
    }
  };
  return (
    <>
      <Modal
        title="Processing"
        open={loading}
        footer={null}
        closable={false}
        centered
      >
        <p>Please wait, the audio is being processed...</p>
      </Modal>
      <h1 className="voice-changer__title">Voice Type</h1>
      <div className="voice-changer__container">
        <div className="voice-changer__content">
          {inputAudioUrl || inputAudioBlob ? (
            <>
              <div className="voice-changer__models">
                <TypeList onSelectType={handleSelectType} />
                {selectedType && (
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
                      setSelectedType(null);
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
                <Col className="gutter-row" offset={4} span={16}>
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
export default VoiceType;
