import { Button, Popconfirm, Tooltip, message } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { deleteModel } from "../../services/modelService";

function DeleteModel(props) {
  const { record, onReload } = props;
  const handleDelete = async () => {
    const response = await deleteModel(record.id);
    if (response) {
      message.success("Delete successfully!");
      onReload();
    }
  };
  return (
    // bạn chắc chắn muốn xóa model này? là title của Popconfirm tiếng anh
    <>
      <Tooltip title="Delete">
        <Popconfirm
          title="Are you sure you want to delete this model?"
          onConfirm={handleDelete}
        >
          <Button
            className="ml-5"
            danger
            ghost
            icon={<DeleteOutlined />}
          ></Button>
        </Popconfirm>
      </Tooltip>
    </>
  );
}

export default DeleteModel;
