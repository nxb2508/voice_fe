import UserModelList from "./UserModelList";
import "./ModelManage.scss";
function ModelManage() {
  return (
    <>
      <h1 className="model-manage-title">Manage Model</h1>
      <UserModelList className="mt-20" />
    </>
  );
}

export default ModelManage;
