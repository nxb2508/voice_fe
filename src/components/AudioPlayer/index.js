import {
  DownloadOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
} from "@ant-design/icons";
import { useWavesurfer } from "@wavesurfer/react";
import { Button, Col, Row, Tag } from "antd";
import { useCallback, useEffect, useRef } from "react";
import { saveAs } from "file-saver";

const styles = {
  flexCenter: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  audioPlayerContainer: {
    backgroundColor: "#201F22",
    padding: 10,
    borderRadius: 5,
  },
};
const AudioPlayer = ({ audioUrl = "", tagLabel = "Audio", fileName = "" }) => {
  const containerRef = useRef(null);
  
  const { wavesurfer, isPlaying } = useWavesurfer({
    container: containerRef,
    height: 100,
    waveColor: "#999999",
    progressColor: "#433F7C",
    cursorColor: "#433F7C",
    url: audioUrl,
  });

  const onPlayPause = useCallback(() => {
    wavesurfer && wavesurfer.playPause();
  }, [wavesurfer]);

  useEffect(() => {
    if (!wavesurfer) return;
    wavesurfer.on("interaction", () => {
      wavesurfer.play();
    });

    return () => {
      wavesurfer.unAll();
    };
  }, [wavesurfer]);

  const onDownload = useCallback(() => {
    saveAs(audioUrl, `converted_${fileName}`);
    
  }, [audioUrl]);

  // Ví dụ sử dụng
  return (
    <>
      <div style={styles.audioPlayerContainer}>
        <Row>
          <Col span={4} style={styles.flexCenter}>
            <Tag color="default">{tagLabel}</Tag>
          </Col>
          <Col span={20}>
            <p style={{ color: "#FFF" }}>{fileName}</p>
          </Col>
        </Row>
        <Row justify={"space-around"}>
          <Col span={4} style={styles.flexCenter}>
            <Button
              type="primary"
              icon={
                isPlaying ? <PauseCircleOutlined /> : <PlayCircleOutlined />
              }
              size="large"
              onClick={onPlayPause}
            ></Button>
          </Col>
          <Col span={16}>
            <div ref={containerRef} />
          </Col>
          <Col span={4} style={styles.flexCenter}>
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              size="large"
              onClick={onDownload}
            ></Button>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default AudioPlayer;
