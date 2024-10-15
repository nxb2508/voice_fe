import React, { useState, useEffect, useRef, useCallback } from "react";
import { ReactMediaRecorder } from "react-media-recorder";
import { Button, message } from "antd";
import { 
  AudioOutlined, 
  StopOutlined, 
  PlayCircleOutlined 
} from "@ant-design/icons";

const AudioRecorder = ({ onRecordComplete }) => {
  const [audioUrl, setAudioUrl] = useState("");
  const [recording, setRecording] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15); // 15 giây đếm ngược
  const countdownIntervalRef = useRef(null); // Ref để lưu interval
  const stopRecordingRef = useRef(null); // Ref để lưu hàm stopRecording

  const MAX_RECORDING_TIME = 15; // Giới hạn 15 giây

  // Hàm khởi động ghi âm và đếm ngược
  const startRecordingWithCountdown = useCallback(
    (startRecording, stopRecording) => {
      setRecording(true);
      setTimeLeft(MAX_RECORDING_TIME);
      startRecording();
      stopRecordingRef.current = stopRecording; // Lưu hàm stopRecording vào ref

      // Khởi tạo đếm ngược
      countdownIntervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleStopRecording(); // Dừng ghi âm khi hết thời gian
            message.info("Đã đạt giới hạn 15 giây.");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    },
    []
  );

  // Hàm dừng ghi âm và dọn dẹp
  const handleStopRecording = useCallback(() => {
    setRecording(false);
    clearInterval(countdownIntervalRef.current); // Hủy interval

    if (stopRecordingRef.current) {
      stopRecordingRef.current(); // Gọi hàm stopRecording đã lưu trong ref
    }
  }, []);

  // Xử lý khi URL âm thanh thay đổi
  useEffect(() => {
    if (audioUrl) {
      const fileName = `recording_${new Date().toISOString()}.mp3`;
      onRecordComplete(audioUrl, fileName);
      message.success("Ghi âm thành công!");
    }
  }, [audioUrl, onRecordComplete]);

  return (
    <ReactMediaRecorder
      audio
      render={({ status, startRecording, stopRecording, mediaBlobUrl }) => (
        <div style={{ marginBottom: "20px" }}>
          <p>Trạng thái: {status}</p>
          {recording && <p>Thời gian còn lại: {timeLeft} giây</p>}
          <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
            {!recording ? (
              <Button
                type="primary"
                icon={<AudioOutlined />}
                onClick={() =>
                  startRecordingWithCountdown(startRecording, stopRecording)
                }
              >
                Bắt đầu ghi âm
              </Button>
            ) : (
              <Button
                type="primary"
                danger
                icon={<StopOutlined />}
                onClick={handleStopRecording}
              >
                Dừng ghi âm
              </Button>
            )}
            {mediaBlobUrl && (
              <Button
                type="default"
                icon={<PlayCircleOutlined />}
                onClick={() => new Audio(mediaBlobUrl).play()}
              >
                Nghe lại
              </Button>
            )}
          </div>
        </div>
      )}
    />
  );
};

export default AudioRecorder;
