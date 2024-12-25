import React from "react";
import { useEffect, useState } from "react";
import {
  getMyModels,
  getMyModelsIsTrainning,
} from "../../services/modelService";
import EditModel from "./EditModel";
import DeleteModel from "./DeleteModel";
import { Link } from "react-router-dom";
import { Button, Divider, message, Table, Tag } from "antd";
import { getCookie } from "../../helper/cookie";
import {
  SyncOutlined,
  PlusOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import "./UserModelList.scss";

function UserModelList() {
  const [data, setData] = useState([]);
  const [modelsIsTrainning, setModelsIsTrainning] = useState([]);
  const [isShowBtnCreate, setIsShowBtnCreate] = useState(false);
  const fetchApi = async () => {
    try {
      const token = getCookie("token");
      if (token) {
        const responseIsTrainning = await getMyModelsIsTrainning();
        if (responseIsTrainning) {
          console.log(responseIsTrainning);
          setModelsIsTrainning(responseIsTrainning);
          setIsShowBtnCreate(responseIsTrainning.length === 0);
        }
        const response = await getMyModels();
        if (response) {
          const myModels = response.filter((item) => item.category == 1);
          setData(myModels);
          console.log(myModels);
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

  function formatDateByString(isoString) {
    // Chuyển chuỗi ISO thành đối tượng Date
    const date = new Date(isoString);

    // Lấy thông tin ngày, tháng, năm, giờ, phút, giây
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Tháng bắt đầu từ 0
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    // Định dạng ngày và giờ
    const formattedDate = `${day}/${month}/${year}`;
    const formattedTime = `${hours}:${minutes}`;

    return {
      date: formattedDate,
      time: formattedTime,
    };
  }

  function formatDateByTimestamp(seconds, nanoseconds) {
    // Chuyển đổi giây thành milliseconds
    const milliseconds = seconds * 1000 + Math.floor(nanoseconds / 1e6);
  
    // Tạo đối tượng Date
    const date = new Date(milliseconds);
  
    // Lấy thông tin ngày, tháng, năm, giờ, phút, giây
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const secondsFormatted = String(date.getSeconds()).padStart(2, '0');
  
    // Định dạng ngày và giờ
    const formattedDate = `${day}/${month}/${year}`;
    const formattedTime = `${hours}:${minutes}`;
  
    return {
      date: formattedDate,
      time: formattedTime,
    };
  }

  const modelsColumns = [
    {
      title: "Name",
      dataIndex: "name_model",
      key: "id",
    },
    {
      title: "Created At",
      key: "created_at",
      render: (_, record) => {
        const { date, time } = formatDateByString(record.createdAt);
        return time + " " + date;
      },
    },
    {
      title: "Action",
      key: "actions",
      render: (_, record) => (
        <div
          style={{
            width: "100%",
            display: "flex",
          }}
        >
          <EditModel record={record} onReload={handleReload} />
          <DeleteModel record={record} onReload={handleReload} />
        </div>
      ),
    },
  ];

  const modelsIsTrainningColumns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "id",
    },
    {
      title: "Train At",
      render: (_, record) => {
        const { date, time } = formatDateByTimestamp(
          record.trainAt._seconds,
          record.trainAt._nanoseconds
        );
        return time + " " + date;
      },
    },
    {
      title: "Status",
      render: (_, record) => (
        <Tag icon={<SyncOutlined spin />} color="processing">
          Trainning
        </Tag>
      ),
    },
  ];

  return (
    <>
      {isShowBtnCreate ? (
        <Link to="/create-model">
          <Button icon={<PlusOutlined />}>Create New Model</Button>
        </Link>
      ) : (
        <div className="text-warning-train">
          Attention: You can only create one model at a time. Please wait...
        </div>
      )}
      <Divider
        style={{
          borderColor: "rgba(158,154,154,.2)",
        }}
      >
        <div className="models-is-trainning">Models Is Trainning</div>
      </Divider>
      <Table
        className="user-model-table-cus"
        columns={modelsIsTrainningColumns}
        dataSource={modelsIsTrainning}
        rowKey={"id"}
      />
      <Divider
        style={{
          borderColor: "rgba(158,154,154,.2)",
        }}
      >
        <div className="models-can-use-title">Models Can Use</div>
      </Divider>
      <Table
        className="user-model-table-cus"
        columns={modelsColumns}
        dataSource={data}
        rowKey={"id"}
      />
    </>
  );
}

export default UserModelList;
