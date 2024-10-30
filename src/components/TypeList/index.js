import { useEffect, useState } from "react";
import { Row, Col, Divider } from "antd";
import "./TypeList.scss";

const types = [
    {
        id: 1,
        name: 'Robot'
    },
    {
        id: 2,
        name: 'Kid'
    },
    {
        id: 3,
        name: 'Male'
    },
    {
        id: 4,
        name: 'Female'
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
          <Col span={12} key={item.id}>
            <button
              onClick={() => handleSelectType(item.id)}
              className={
                "btn__choose-models " +
                (selectedType === item.id ? "selected" : "")
              }
            >
              <div>{item.name}</div>
            </button>
          </Col>
        ))}
      </Row>
    </>
  );
}

export default TypeList;
