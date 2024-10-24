import { useEffect, useState } from "react";
import { getListModel, getModelDetail } from "../../services/modelService";
import { Card, Checkbox, Button, Modal, Row, Col, Divider } from "antd";
import "./ModelList.scss";

const models = [
  {
    id_model: 1,
    model_name: "aikizuna",
    model_path: "D:/DATN/model/Ai_kizuna/Ai_Kizuna_G_6400.pth",
    config_path:
      "D:/DATN/model/Ai_kizuna/So-VITS_4.0_Public_Models_Ai_Kizuna_config.json",
    cluster_model_path: "None",
  },
  {
    id_model: 2,
    model_name: "applebloom",
    model_path: "D:/DATN/model/applebloom/G_28800.pth",
    config_path: "D:/DATN/model/applebloom/Applebloom (singing)_config.json",
    cluster_model_path: "D:/DATN/model/applebloom/kmeans_1000.pt",
  },
  {
    id_model: 3,
    model_name: "ladygaga",
    model_path: "D:/DATN/model/ladygaga/G_14400.pth",
    config_path: "D:/DATN/model/ladygaga/LadyGaga_config.json",
    cluster_model_path: "None",
  },
  {
    id_model: 4,
    model_name: "obama",
    model_path: "D:/DATN/model/obama/G_50000.pth",
    config_path: "D:/DATN/model/obama/Obama50k_config.json",
    cluster_model_path: "None",
  },
  {
    id_model: 5,
    model_name: "Trump",
    model_path: "D:/DATN/model/Trump/G_18500.pth",
    config_path: "D:/DATN/model/Trump/Trump18.5k_config.json",
    cluster_model_path: "None",
  },
  {
    id_model: 6,
    model_name: "Vegeta",
    model_path: "D:/DATN/model/vegeta/G_1500.pth",
    config_path: "D:/DATN/model/vegeta/vegeta_config.json",
    cluster_model_path: "None",
  },
];

function ModelList({ onSelectModel }) {
  const [data, setData] = useState([]);
  const [selectedModels, setSelectedModels] = useState(null);

  useEffect(() => {
    const fetchApi = async () => {
      const response = await getListModel();
      if (response) {
        setData(response);
      }
    };
    fetchApi();
  }, []);

  useEffect(() => {
    console.log(selectedModels);
  }, [selectedModels]);

  const handleSelectModel = (id) => {
    setSelectedModels(id);
    onSelectModel(id);
  };

  return (
    <>
      <h2 style={{color: "#FFF"}}>Select voice type</h2>
      <Divider
        style={{
          borderColor: "rgba(158,154,154,.2)",
        }}
      />
      <Row gutter={[16, 24]}>
        {data.map((model) => (
          <Col span={12} key={model.id_model} >
            <button
              onClick={() => handleSelectModel(model.id_model)}
              className={"btn__choose-models " + (selectedModels === model.id_model ? "selected" : "")}
            >
              <div>{model.model_name}</div>
            </button>
          </Col>
        ))}
      </Row>
    </>
  );
}

export default ModelList;
