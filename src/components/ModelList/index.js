import React from "react";
import { useEffect, useState } from "react";
import {
  getListModel,
  getModelDetail,
  getMyModels,
} from "../../services/modelService";
import {
  Card,
  Checkbox,
  Button,
  Modal,
  Row,
  Col,
  Divider,
  message,
} from "antd";
import "./ModelList.scss";
import { getCookie } from "../../helper/cookie";

function ModelList({ onSelectModel, clearSelectedModel, filter }) {
  const [data, setData] = useState({});
  const [selectedModels, setSelectedModels] = useState(null);

  useEffect(() => {
    const fetchApi = async () => {
      try {
        const response = await getListModel();
        let result;
        if (response) {
          result = response.reduce((acc, model) => {
            if (!acc[model.category]) {
              acc[model.category] = [];
            }
            acc[model.category].push(model);
            return acc;
          }, {});
        }
        const token = getCookie("token");
        if (token) {
          const response = await getMyModels();
          console.log(response);
          if (response) {
            const temp = response.reduce((acc, model) => {
              if (!acc[model.category]) {
                acc[model.category] = [];
              }
              acc[model.category].push(model);
              return acc;
            }, {});
            for (let category in temp) {
              if (result[category]) {
                result[category] = result[category].concat(temp[category]);
              } else {
                result[category] = temp[category];
              }
            }
          }
        }
        setData(result);
        console.log(result);
      } catch (error) {
        message.error("Failed to load models. Please try again later."); // Hiển thị thông báo lỗi
        console.error("Error fetching models:", error);
      }
    };
    fetchApi();
  }, []);

  useEffect(() => {
    console.log(selectedModels);
  }, [selectedModels]);

  useEffect(() => {
    if (clearSelectedModel) {
      setSelectedModels(null);
    }
  }, [clearSelectedModel]);

  const handleSelectModel = (id) => {
    setSelectedModels(id);
    onSelectModel(id);
  };

  return (
    <>
      <h2 style={{ color: "#FFF" }}>Select voice type</h2>
      <Divider
        style={{
          borderColor: "rgba(158,154,154,.2)",
        }}
      />
      <Row gutter={[16, 24]}>
        <>
          {Object.entries(data).map(([category, models]) => (
            <React.Fragment key={category}>
              <Col span={24}>
                <p style={{ color: "#FFF" }}>{category}</p>
              </Col>
              {models.map((model) => (
                <Col span={12} key={model.id_model}>
                  <button
                    onClick={() => handleSelectModel(model.id)}
                    className={
                      "btn__choose-models " +
                      (selectedModels === model.id ? "selected" : "")
                    }
                  >
                    <div>{model.model_name}</div>
                  </button>
                </Col>
              ))}
            </React.Fragment>
          ))}
        </>
      </Row>
    </>
  );
}

export default ModelList;
