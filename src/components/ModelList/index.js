import { useEffect, useState } from "react";
import { getListModel, getModelDetail } from "../../services/modelService";
import { Card, Checkbox, Button, Modal, Row, Col, Divider, message } from "antd";
import "./ModelList.scss";

const models = [];

function ModelList({ onSelectModel, clearSelectedModel }) {
  const [data, setData] = useState(models);
  const [selectedModels, setSelectedModels] = useState(null);

  useEffect(() => {
    const fetchApi = async () => {
      try {
        const response = await getListModel();
        if (response) {
          setData(response);
        }
      } catch (error) {
        message.error("Failed to load models. Please try again later."); // Hiển thị thông báo lỗi
        console.error("Error fetching models:", error);
      }
    };
    fetchApi();
  }, []);

  // useEffect(() => {
  //   console.log(selectedModels);
  // }, [selectedModels]);

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
        {data.map((model) => (
          <Col span={12} key={model.id_model}>
            <button
              onClick={() => handleSelectModel(model.id_model)}
              className={
                "btn__choose-models " +
                (selectedModels === model.id_model ? "selected" : "")
              }
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
