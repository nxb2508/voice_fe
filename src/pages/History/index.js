import "./History.scss";
import { useState, useEffect } from "react";
import { List, Avatar, Space, Button } from "antd";
import AudioPlayer from "../../components/AudioPlayer";
const data = [
  {
    id: 1,
    name: "The first title",
    url: "https://cdn.hoclieuthongminh.com/bt-games/number_cards/audio/win.mp3",
    length: "5:00",
    createdAt: "2021-01-01 12:00:00",
  },
  {
    id: 1,
    name: "The first title",
    url: "https://cdn.hoclieuthongminh.com/bt-games/number_cards/audio/win.mp3",
    length: "5:00",
    createdAt: "2021-01-01 12:00:00",
  },
  {
    id: 1,
    name: "The first title",
    url: "https://cdn.hoclieuthongminh.com/bt-games/number_cards/audio/win.mp3",
    length: "5:00",
    createdAt: "2021-01-01 12:00:00",
  },
  {
    id: 1,
    name: "The first title",
    url: "https://cdn.hoclieuthongminh.com/bt-games/number_cards/audio/win.mp3",
    length: "5:00",
    createdAt: "2021-01-01 12:00:00",
  },
  {
    id: 1,
    name: "The first title",
    url: "https://cdn.hoclieuthongminh.com/bt-games/number_cards/audio/win.mp3",
    length: "5:00",
    createdAt: "2021-01-01 12:00:00",
  },
  {
    id: 1,
    name: "The first title",
    url: "https://cdn.hoclieuthongminh.com/bt-games/number_cards/audio/win.mp3",
    length: "5:00",
    createdAt: "2021-01-01 12:00:00",
  },
  {
    id: 1,
    name: "The first title",
    url: "https://cdn.hoclieuthongminh.com/bt-games/number_cards/audio/win.mp3",
    length: "5:00",
    createdAt: "2021-01-01 12:00:00",
  },
];

function History() {
  const [dataHistory, setDataHistory] = useState(data);

  useEffect(() => {
    // fetch data from API
  }, []);

  return (
    <>
      <div className="history">
        <h1 className="history-title">History</h1>
        <div className="history-list">
          <List
            itemLayout="vertical"
            size="large"
            style={{
              width: "100%",
              backgroundColor: "#26252e",
              padding: "20px",
              borderRadius: "10px",
              border: "1px solid #7D4ED9",
            }}
            pagination={{
              onChange: (page) => {
                console.log(page);
              },
              pageSize: 5,
            }}
            dataSource={data}
            renderItem={(item, index) => (
              <List.Item
                key={index}
                style={{
                  borderBottom: "1px solid #7D4ED9",
                }}
                actions={[
                  <Button
                    type="primary"
                    onClick={() => {
                      console.log("click");
                    }}
                  >
                    Edit
                  </Button>,
                  <Button
                    type="primary"
                    onClick={() => {
                      console.log("click");
                    }}
                  >
                    Delete
                  </Button>,
                ]}
              >
                {/* <List.Item.Meta title={<a href={item.href}>{item.name}</a>} /> */}
                <AudioPlayer audioUrl={item.url} fileName={item.name} />
              </List.Item>
            )}
          />
        </div>
      </div>
    </>
  );
}

export default History;
