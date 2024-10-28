import { useState, useCallback } from "react";
import { Upload, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import "./UploadAudio.scss";
const UploadAudio = ({ onUpload }) => {
  const [loading, setLoading] = useState(false);
  const allowedFormats = ["audio/mp3", "audio/mpeg", "audio/wav"];
  const handleUpload = useCallback(
    (file) => {
      const fileName = file.name;
      if (!allowedFormats.includes(file.type)) {
        message.error("Chỉ chấp nhận các file .mp3 và .wav!");
        return false;
      }
      setLoading(true);
      const reader = new FileReader();
      reader.onload = (e) => {
        onUpload(e.target.result, fileName, "upload"); // Truyền file audio đã load vào AudioPlayer
        message.success("Tải file lên thành công!");
        setLoading(false);
      };
      reader.onerror = () => {
        message.error("Lỗi khi tải file!");
        setLoading(false);
      };
      reader.readAsDataURL(file); // Đọc file dưới dạng URL
      return false; // Ngăn chặn hành vi upload mặc định của trình duyệt
    },
    [onUpload]
  );

  return (
    <div className="upload-container" style={{ display: "flex", justifyContent: "center", width: "100%" }}>
      <Upload
        accept="audio/*"
        showUploadList={false}
        beforeUpload={handleUpload}
        style={{ cursor: "pointer", width: "100%", display: "block" }} // Đảm bảo width 100%
      >
        <div className="upload">
          <img
            className="upload__image"
            src="https://img.freepik.com/free-vector/illustration-uploading-icon_53876-6323.jpg?t=st=1729781666~exp=1729785266~hmac=419e31b7bb232a97c02110a57d53cb0b5e62a2221f8198df642b537e40cc2321&w=740"
            alt="Upload"
          />
          <div className="upload__title">Upload file audio to change voice</div>
          <Button
            className="upload__button"
            icon={<UploadOutlined />}
            loading={loading}
            style={{ width: "40%" }}
          >
            Upload
          </Button>
        </div>
      </Upload>
    </div>
  );
};

export default UploadAudio;
