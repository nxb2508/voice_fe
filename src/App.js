import AllRoute from "./components/AllRoute";
import "./App.css";

const App = () => {
  

  // const handleChangeVoice = useCallback(async () => {
  //   setLoading(true); // Bật trạng thái loading trước khi gọi API
  //   try {
  //     const audioBlob = await fetch(inputAudioUrl).then((r) => r.blob());

  //     // Tạo một đối tượng File từ Blob (tùy chọn)
  //     const audioFile = new File([audioBlob], inputFileName || "audio.wav", {
  //       type: audioBlob.type,
  //     });

  //     const result = await changeVoiceWithSelectedModel({
  //       options: {
  //         audio: audioFile,
  //         modelId: selectedModels,
  //       },
  //     });

  //     if (result) {
  //       setOutputAudioUrl(result);
  //     } else {
  //       console.error("Failed to change voice");
  //     }
  //   } catch (error) {
  //     console.error("Error during voice change:", error);
  //   } finally {
  //     setLoading(false); // Tắt trạng thái loading sau khi hoàn thành API call
  //   }
  // }, [selectedModels, inputAudioUrl, inputFileName]);

  return <> 
    <AllRoute />
  </>;
};

{
  /* <Modal
        title="Processing"
        open={loading} // Modal hiện khi loading = true
        footer={null} // Không có footer để tránh người dùng bấm đóng
        closable={false} // Không thể đóng modal khi đang loading
        centered // Canh giữa màn hình
      >
        <p>Please wait, the audio is being processed...</p>
      </Modal> */
}


export default App;
