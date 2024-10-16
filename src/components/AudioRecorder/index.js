import React, { useState } from "react";
import { ReactMic } from "react-mic";

const AudioRecorder = ({onRecordComplete}) => {
  const [recording, setRecording] = useState(false);
  const [blobURL, setBlobURL] = useState("");

  const startRecording = () => {
    setRecording(true);
  };

  const stopRecording = () => {
    setRecording(false);
  };

  const onStop = (recordedBlob) => {
    setBlobURL(recordedBlob.blobURL);
    onRecordComplete(recordedBlob.blobURL, "recorded_audio.mp3");
    console.log("recordedBlob is: ", recordedBlob);
  };

  return (
    <div>
      <h1>Audio Recorder</h1>
      <ReactMic
        visualSetting ="frequencyBars"
        record={recording}
        className="sound-wave"
        onStop={onStop}
        strokeColor="#FFF"
        backgroundColor="#FF4081"
      />
      <div>
        <button onClick={startRecording} type="button">
          Start Recording
        </button>
        <button onClick={stopRecording} type="button">
          Stop Recording
        </button>
      </div>
      {blobURL && (
        <div>
          <h3>Recording Playback:</h3>
          <audio src={blobURL} controls="controls" />
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;
