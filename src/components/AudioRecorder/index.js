import React, { useRef, useState, useEffect } from "react";
import WaveSurfer from "wavesurfer.js";
import RecordPlugin from "wavesurfer.js/dist/plugins/record.esm.js";
import { Button, Select, Card, Typography, Space } from "antd";
import { saveAs } from "file-saver";
import "./AudioRecorder.scss";
const { Option } = Select;
const { Title, Text } = Typography;
function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
const AudioRecorder = ({ onRecordComplete }) => {
  const waveformRef = useRef(null);
  const containerRecordingsRef = useRef(null);
  const [record, setRecord] = useState(null);
  const [wavesurfer, setWavesurfer] = useState(null);
  const [scrollingWaveform, setScrollingWaveform] = useState(false);
  const [progress, setProgress] = useState("00:00");
  const [devices, setDevices] = useState([]); // State để lưu danh sách micro
  const [selectedDevice, setSelectedDevice] = useState(null);
  const recButtonRef = useRef(null);

  useEffect(() => {
    createWaveSurfer();
  }, [scrollingWaveform]);

  const createWaveSurfer = () => {
    if (wavesurfer) wavesurfer.destroy();

    const ws = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: "rgb(200, 0, 200)",
      progressColor: "rgb(100, 0, 100)",
    });

    const rec = ws.registerPlugin(
      RecordPlugin.create({ scrollingWaveform, renderRecordedAudio: false })
    );

    rec.on("record-end", (blob) => {
      onRecordComplete(blob, "record.wav", "record");
    });

    rec.on("record-progress", (time) => {
      updateProgress(time);
    });

    setRecord(rec);
    setWavesurfer(ws);
  };

  const updateProgress = (time) => {
    const formattedTime = [
      Math.floor((time % 3600000) / 60000), // minutes
      Math.floor((time % 60000) / 1000), // seconds
    ]
      .map((v) => (v < 10 ? "0" + v : v))
      .join(":");
    setProgress(formattedTime);
  };

  const handleRecord = () => {
    if (record.isRecording() || record.isPaused()) {
      record.stopRecording();
      recButtonRef.current.textContent = "Record";
    } else {
      while (containerRecordingsRef.current.firstChild) {
        containerRecordingsRef.current.removeChild(
          containerRecordingsRef.current.firstChild
        );
      }
      const deviceId = selectedDevice;
      record.startRecording({ deviceId }).then(() => {
        recButtonRef.current.textContent = "Stop";
      });
    }
  };
  useEffect(() => {
    // Load available microphone devices
    RecordPlugin.getAvailableAudioDevices().then((devices) => {
      setDevices(devices);
    });
  }, []);
  return (
    <Card
      style={{
        width: "100%",
        height: "100%",
        margin: "0 auto",
        textAlign: "center",
        background: "#1e1d24",
      }}
    >
      <Title level={3} className="audio-recorder__title">
        Audio Recorder
      </Title>
      <Space direction="vertical" style={{ width: "100%" }}>
        <Button
          ref={recButtonRef}
          type="primary"
          onClick={handleRecord}
          className="audio-recorder__btn-record"
        >
          {record && record.isRecording() ? "Stop Recording" : "Record"}
        </Button>

        <Select
          value={selectedDevice}
          onChange={(value) => setSelectedDevice(value)}
          placeholder="Select mic"
          className="audio-recorder__select-mic"
        >
          {devices.map((device) => (
            <Option key={device.deviceId} value={device.deviceId}>
              {device.label || device.deviceId}
            </Option>
          ))}
        </Select>

        <Text strong className="audio-recorder__txt-progress">
          {progress}
        </Text>

        <div
          id="mic"
          ref={waveformRef}
          className="audio-recorder__waveform"
        ></div>
        <div ref={containerRecordingsRef} style={{ margin: "1rem 0" }}></div>
      </Space>
    </Card>
  );
};

export default AudioRecorder;
