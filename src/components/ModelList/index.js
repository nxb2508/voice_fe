import { useEffect, useState } from "react";
import { getListModel, getModelDetail } from "../../services/modelService";
import { Card, Checkbox, Button, Modal, Row, Col } from "antd";
import './styles.css';

function ModelList({onSelectModel}) {
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
      <Row gutter={16}>
        {data.map((model) => (
          <Col span={12} key={model.id_model}>
            <Button
              type="primary"
              size="large"
              onClick={() => handleSelectModel(model.id_model)}
              className={selectedModels === model.id_model ? "selected" : ""}
            >
              {model.model_name}
            </Button>
          </Col>
        ))}
      </Row>
    </>
  );
}

export default ModelList;
