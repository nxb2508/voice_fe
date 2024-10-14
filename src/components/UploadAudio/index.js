import { useState, useCallback } from "react";
import { Upload, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const UploadAudio = ({ onUpload }) => {
  const [loading, setLoading] = useState(false);

  const handleUpload = useCallback((file) => {
    setLoading(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      onUpload(e.target.result); // Truyền file audio đã load vào AudioPlayer
      message.success("Tải file lên thành công!");
      setLoading(false);
    };
    reader.onerror = () => {
      message.error("Lỗi khi tải file!");
      setLoading(false);
    };
    reader.readAsDataURL(file); // Đọc file dưới dạng URL
    return false; // Ngăn chặn hành vi upload mặc định của trình duyệt
  }, [onUpload]);

  return (
    <Upload 
      accept="audio/*"
      showUploadList={false}
      beforeUpload={handleUpload}
    >
      <Button 
        icon={<UploadOutlined />} 
        loading={loading} 
        disabled={loading}
      >
        Tải file audio lên
      </Button>
    </Upload>
  );
};

export default UploadAudio;
