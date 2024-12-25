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
import { SyncOutlined, PlusOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
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
          // console.log(responseIsTrainning);
          setModelsIsTrainning(responseIsTrainning);
          setIsShowBtnCreate(responseIsTrainning.length === 0);
        }
        const response = await getMyModels();
        if (response) {
          const myModels = response.filter((item) => item.category == 1);
          setData(myModels);
          // console.log(myModels);
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

  const modelsColumns = [
    {
      title: "Name",
      dataIndex: "name_model",
      key: "id",
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
