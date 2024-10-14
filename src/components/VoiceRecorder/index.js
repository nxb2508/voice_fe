import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'antd';
import { FaMicrophone } from 'react-icons/fa';
import Wavesurfer from 'wavesurfer.js';

const VoiceRecorder = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState(null);
    const [wavesurfer, setWavesurfer] = useState(null);
    const [volume, setVolume] = useState(0);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const analyserRef = useRef(null);
    const recordingTimeoutRef = useRef(null);

    useEffect(() => {
        const ws = Wavesurfer.create({
            container: '#waveform',
            waveColor: 'blue',
            progressColor: 'purple',
            cursorColor: 'navy',
            height: 128,
        });
        setWavesurfer(ws);

        return () => ws.destroy();
    }, []);

    const startRecording = async () => {
        setIsRecording(true);
        audioChunksRef.current = [];
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream);

        // Create an analyser node
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const source = audioContext.createMediaStreamSource(stream);
        analyserRef.current = audioContext.createAnalyser();
        source.connect(analyserRef.current);
        analyserRef.current.fftSize = 2048;

        // Create a data array to hold the frequency data
        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);

        // Function to get the volume level
        const getVolume = () => {
            analyserRef.current.getByteFrequencyData(dataArray);
            const sum = dataArray.reduce((a, b) => a + b, 0);
            const average = sum / dataArray.length;
            setVolume(average);
            requestAnimationFrame(getVolume);
        };

        // Start the volume detection
        getVolume();

        mediaRecorderRef.current.ondataavailable = (event) => {
            audioChunksRef.current.push(event.data);
        };

        mediaRecorderRef.current.onstop = () => {
            const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
            setAudioBlob(audioBlob);
            const audioUrl = URL.createObjectURL(audioBlob);
            wavesurfer.load(audioUrl);
            setVolume(0); // Reset volume when recording stops
        };

        mediaRecorderRef.current.start();

        // Set a timeout to stop recording after 15 seconds
        recordingTimeoutRef.current = setTimeout(() => {
            stopRecording();
        }, 15000); // 15 seconds
    };

    const stopRecording = () => {
        setIsRecording(false);
        mediaRecorderRef.current.stop();
        clearTimeout(recordingTimeoutRef.current); // Clear the timeout if stopped manually
    };

    const deleteRecording = () => {
        setAudioBlob(null);
        wavesurfer.empty();
        setVolume(0);
    };

    const downloadRecording = () => {
        if (!audioBlob) return;
        const url = URL.createObjectURL(audioBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'recording.wav';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Style for microphone icon based on volume
    const micStyle = {
        fontSize: `${20 + volume / 5}px`, // Adjust size based on volume
        color: volume > 200 ? 'red' : 'black', // Change color based on volume
        transition: 'font-size 0.1s ease',
    };

    return (
        <div>
            <div id="waveform" style={{ marginBottom: '20px' }}></div>
            <FaMicrophone style={micStyle} />
            <Button onClick={isRecording ? stopRecording : startRecording} disabled={isRecording && audioBlob}>
                {isRecording ? 'Stop Recording' : 'Start Recording'}
            </Button>
            <Button onClick={deleteRecording} disabled={!audioBlob}>
                Delete
            </Button>
            <Button onClick={downloadRecording} disabled={!audioBlob}>
                Download
            </Button>
        </div>
    );
};

export default VoiceRecorder;
