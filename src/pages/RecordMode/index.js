import * as React from "react";
import { useWavesurfer } from "@wavesurfer/react";
import Timeline from "wavesurfer.js/dist/plugins/timeline.esm.js";
const { useMemo, useState, useCallback, useRef, useEffect } = React;

const audioUrls = [
  "https://cdn.hoclieuthongminh.com/bt-games/number_cards/audio/win.mp3",
  "https://cdn.hoclieuthongminh.com/bt-games/number_cards/audio/lose.mp3",
  "https://cdn.hoclieuthongminh.com/bt-games/drag_ices/audio/move.mp3",
  "https://cdn.hoclieuthongminh.com/bt-games/number_cards/audio/shuffle.mp3",
];

const formatTime = (seconds) =>
  [seconds / 60, seconds % 60]
    .map((v) => `0${Math.floor(v)}`.slice(-2))
    .join(":");

const RecordMode = () => {
  const containerRef = useRef(null);
  const [urlIndex, setUrlIndex] = useState(0);

  const { wavesurfer, isPlaying, currentTime } = useWavesurfer({
    container: containerRef,
    height: 100,
    waveColor: "rgb(200, 0, 200)",
    progressColor: "rgb(100, 0, 100)",
    url: audioUrls[urlIndex],
    plugins: useMemo(() => [Timeline.create()], []),
  });

  const onClick = useCallback(() => {
    if (wavesurfer) {
      wavesurfer.play();
    }
  }, [wavesurfer]);

  const onUrlChange = useCallback(() => {
    setUrlIndex((index) => (index + 1) % audioUrls.length);
  }, []);

  const onPlayPause = useCallback(() => {
    wavesurfer && wavesurfer.playPause();
  }, [wavesurfer]);

  useEffect(() => {
    if (wavesurfer) {
      // Lắng nghe sự kiện click trên waveform
      wavesurfer.on('interaction', onClick);

      // Cleanup event listener khi component unmount
      return () => {
        wavesurfer.un('interaction', onClick);
      };
    }
  }, [wavesurfer, onClick]);

  return (
    <>
      <div ref={containerRef} />

      <p>Current audio: {audioUrls[urlIndex]}</p>

      <p>Current time: {formatTime(currentTime)}</p>

      <div style={{ margin: "1em 0", display: "flex", gap: "1em" }}>
        <button onClick={onUrlChange}>Change audio</button>

        <button onClick={onPlayPause} style={{ minWidth: "5em" }}>
          {isPlaying ? "Pause" : "Play"}
        </button>
      </div>
    </>
  );
};

export default RecordMode;
