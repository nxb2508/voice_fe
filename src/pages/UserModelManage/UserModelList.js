import React from "react";
import { useEffect, useState } from "react";
import {
  getMyModels,
  getMyModelsIsTrainning,
} from "../../services/modelService";
import EditModel from "./EditModel";
import DeleteModel from "./DeleteModel";

import { Divider, message, Table, Tag } from "antd";
import { getCookie } from "../../helper/cookie";
import { SyncOutlined } from "@ant-design/icons";
import "./UserModelList.scss";

function UserModelList() {
  const [data, setData] = useState([]);
  const [modelsIsTrainning, setModelsIsTrainning] = useState([]);
  const fetchApi = async () => {
    try {
      const token = getCookie("token");
      if (token) {
        const response = await getMyModels();
        if (response) {
          const myModels = response.filter((item) => item.category == 1);
          setData(myModels);
          console.log(myModels);
        }
        const responseIsTrainning = await getMyModelsIsTrainning();
        if (responseIsTrainning) {
          console.log(responseIsTrainning);
          setModelsIsTrainning(responseIsTrainning);
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
        <>
          <EditModel record={record} onReload={handleReload} />
          <DeleteModel record={record} onReload={handleReload} />
        </>
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
