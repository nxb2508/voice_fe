import { useEffect, useState } from "react";
import { Row, Col, Divider } from "antd";
import "./TypeList.scss";

const types = [
    {
        id_model: "ffmpeg_1",
        model_name: 'Robot',
        category: "base"
    },
    {
        id_model: "ffmpeg_2",
        model_name: 'Kid',
        category: "base"
    },
    {
        id_model: "ffmpeg_3",
        model_name: 'Male',
        category: "base"
    },
    {
        id_model: "ffmpeg_4",
        model_name: 'Female',
        category: "base"
    },
    {
        id_model: "ffmpeg_5",
        model_name: 'Sonic',
        category: "speed"
    },
    {
        id_model: "ffmpeg_6",
        model_name: 'Fast speed',
        category: "speed"
    },
    {
        id_model: "ffmpeg_7",
        model_name: 'Turtle speed',
        category: "speed"
    },
    {
        id_model: "ffmpeg_8",
        model_name: 'Snails speed',
        category: "speed"
    },
    {
        id_model: "ffmpeg_9",
        model_name: 'Library',
        category: "ambient"
    },
    {
        id_model: "ffmpeg_10",
        model_name: 'Wardrobe',
        category: "ambient"
    },
    {
        id_model: "ffmpeg_11",
        model_name: 'Bathroom',
        category: "ambient"
    },
    {
        id_model: "ffmpeg_12",
        model_name: 'Diving voice',
        category: "ambient"
    }
];

function TypeList({ onSelectType }) {
  const [selectedType, setSelectedType] = useState(null);

  const handleSelectType = (id) => {
    setSelectedType(id);
    onSelectType(id);
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
        {types.map((item) => (
          <Col span={12} key={item.id_model}>
            <button
              onClick={() => handleSelectType(item.id_model)}
              className={
                "btn__choose-models " +
                (selectedType === item.id_model ? "selected" : "")
              }
            >
              <div>{item.model_name}</div>
            </button>
          </Col>
        ))}
      </Row>
    </>
  );
}

export default TypeList;
