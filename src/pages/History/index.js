import "./History.scss";
import { useState, useEffect } from "react";
import {
  List,
  Button,
  message,
  Popconfirm,
  Modal,
  Form,
  Input,
  Row,
  Col,
} from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import AudioPlayer from "../../components/AudioPlayer";
import { getCookie } from "../../helper/cookie";
import {
  getMyHistories,
  deleteHistory,
  updateHistory,
} from "../../services/historyService";

function formatDateByTimestamp(seconds, nanoseconds) {
  // Chuyển đổi giây thành milliseconds
  const milliseconds = seconds * 1000 + Math.floor(nanoseconds / 1e6);

  // Tạo đối tượng Date
  const date = new Date(milliseconds);

  // Lấy thông tin ngày, tháng, năm, giờ, phút, giây
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Tháng bắt đầu từ 0
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const secondsFormatted = String(date.getSeconds()).padStart(2, "0");

  // Định dạng ngày và giờ
  const formattedDate = `${day}/${month}/${year}`;
  const formattedTime = `${hours}:${minutes}`;

  return {
    date: formattedDate,
    time: formattedTime,
  };
}

function History() {
  const [dataHistory, setDataHistory] = useState([]);
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [record, setRecord] = useState({});

  const showModal = () => {
    setIsModalOpen(true);
  };

  useEffect(() => {
    form.setFieldsValue(record);
  }, [record]);

  const handleCancel = () => {
    form.resetFields();
    setIsModalOpen(false);
    setRecord({});
  };

  const handleUpdate = async (values) => {
    console.log(record);
    console.log(values);
    const response = await updateHistory(record.id, {
      name: values.name,
    });
    if (response) {
      setIsModalOpen(false);
      handleReload();
      message.success("Update successfully!");
    } else {
      message.error("Update failed!");
    }
  };

  const fetchApi = async () => {
    try {
      const token = getCookie("token");
      if (token) {
        const response = await getMyHistories();
        if (response) {
          setDataHistory(response);
          console.log(response);
        }
      }
    } catch (error) {
      message.error("Failed to load models. Please try again later."); // Hiển thị thông báo lỗi
      console.error("Error fetching models:", error);
    }
  };

  useEffect(() => {
    fetchApi();
  }, []);

  const handleReload = () => {
    fetchApi();
  };

  const handleDelete = async (id) => {
    const response = await deleteHistory(id);
    if (response) {
      message.success("Delete success");
      handleReload();
    } else {
      message.error("Delete failed");
    }
  };

  return (
    <>
      <Modal
        title="Update"
        open={isModalOpen}
        onCancel={handleCancel}
        width={500}
        footer={null}
      >
        <Form
          onFinish={handleUpdate}
          initialValues={record}
          layout="vertical"
          form={form}
        >
          <Row gutter={20}>
            <Col span={24}>
              <Form.Item
                label="Name Audio"
                name="name"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Update
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
      <div className="history">
        <h1 className="history-title">History</h1>
        <div className="history-list">
          <List
            itemLayout="vertical"
            size="large"
            style={{
              width: "100%",
              backgroundColor: "#26252e",
              padding: "20px",
              borderRadius: "10px",
              border: "1px solid #7D4ED9",
            }}
            pagination={{
              onChange: (page) => {
                console.log(page);
              },
              pageSize: 3,
            }}
            dataSource={dataHistory}
            renderItem={(item, index) => (
              <List.Item
                key={index}
                style={{
                  borderBottom: "1px solid #7D4ED9",
                }}
                actions={[
                  <Button
                    type="primary"
                    onClick={() => {
                      setRecord(item);
                      showModal();
                    }}
                    style={{ backgroundColor: "rgb(208, 180, 253)" }}
                    icon={<EditOutlined />}
                  >
                    Edit
                  </Button>,
                  <Popconfirm
                    title="Are you sure you want to delete this audio?"
                    onConfirm={() => handleDelete(item.id)}
                  >
                    <Button type="primary"
                      icon={<DeleteOutlined />}
                      style={{ backgroundColor: "rgb(208, 180, 253)" }}
                    >Delete</Button>,
                  </Popconfirm>,
                ]}
              >
                {/* <List.Item.Meta title={<a href={item.href}>{item.name}</a>} /> */}
                <AudioPlayer audioUrl={item.url_file} fileName={item.name} />
                <div style={{ color: "white", marginTop: "10px" }}>
                  <span>
                    Created At:{" "}
                    {formatDateByTimestamp(
                      item.createdAt._seconds,
                      item.createdAt._nanoseconds
                    ).time +
                      " " +
                      formatDateByTimestamp(
                        item.createdAt._seconds,
                        item.createdAt._nanoseconds
                      ).date}
                  </span>
                </div>
              </List.Item>
            )}
          />
        </div>
      </div>
    </>
  );
}

export default History;
