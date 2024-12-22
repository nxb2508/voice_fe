import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import UserModelList from "./UserModelList";
import "./ModelManage.scss";
function ModelManage() {
  return (
    <>
      <h1 className="model-manage-title">Manage Model</h1>
      <Link to="/create-model">
        <Button icon={<PlusOutlined />}>Create New Model</Button>
      </Link>
      <UserModelList className="mt-20" />
    </>
  );
}

export default ModelManage;
