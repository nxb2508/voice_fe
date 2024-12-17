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

const effects = [
  {
    id_model: "ffmpeg_1",
    model_name: "Robot",
    category: "base",
  },
  {
    id_model: "ffmpeg_2",
    model_name: "Kid",
    category: "base",
  },
  {
    id_model: "ffmpeg_3",
    model_name: "Male",
    category: "base",
  },
  {
    id_model: "ffmpeg_4",
    model_name: "Female",
    category: "base",
  },
  {
    id_model: "ffmpeg_5",
    model_name: "Sonic",
    category: "speed",
  },
  {
    id_model: "ffmpeg_6",
    model_name: "Fast speed",
    category: "speed",
  },
  {
    id_model: "ffmpeg_7",
    model_name: "Turtle speed",
    category: "speed",
  },
  {
    id_model: "ffmpeg_8",
    model_name: "Snails speed",
    category: "speed",
  },
  {
    id_model: "ffmpeg_9",
    model_name: "Library",
    category: "ambient",
  },
  {
    id_model: "ffmpeg_10",
    model_name: "Wardrobe",
    category: "ambient",
  },
  {
    id_model: "ffmpeg_11",
    model_name: "Bathroom",
    category: "ambient",
  },
  {
    id_model: "ffmpeg_12",
    model_name: "Diving voice",
    category: "ambient",
  },
];

let groupedByCategory = effects.reduce((acc, model) => {
  if (!acc[model.category]) {
    acc[model.category] = [];
  }
  acc[model.category].push(model);
  return acc;
}, {});

function ModelList({ onSelectModel, clearSelectedModel, filter }) {
  const [data, setData] = useState(groupedByCategory);
  const [selectedModels, setSelectedModels] = useState(null);

  useEffect(() => {
    const fetchApi = async () => {
      try {
        const response = await getListModel();
        let result;
        if (response) {
          let temp = [];
          if (filter == "t2s") {
            temp = [...response];
          } else {
            temp = [...effects, ...response];
          }
          groupedByCategory = temp.reduce((acc, model) => {
            if (!acc[model.category]) {
              acc[model.category] = [];
            }
            acc[model.category].push(model);
            return acc;
          }, {});
          result = groupedByCategory;
        }
        const token = getCookie("token");
        if (token) {
          const response = await getMyModels();
          if (response) {
            groupedByCategory = response.reduce((acc, model) => {
              if (!acc[model.category]) {
                acc[model.category] = [];
              }
              acc[model.category].push(model);
              return acc;
            }, {});
            result = {
              ...result,
              ...groupedByCategory,
            };
          }
        }
        setData(result)
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
        <>
          {Object.entries(data).map(([category, models]) => (
            <React.Fragment key={category}>
              <Col span={24}>
                <p style={{ color: "#FFF" }}>{category}</p>
              </Col>
              {models.map((model) => (
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
            </React.Fragment>
          ))}
        </>
      </Row>
    </>
  );
}

export default ModelList;
