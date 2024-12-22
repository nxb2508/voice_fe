import { Button, Col, Form, Input, Modal, Row, Tooltip, message } from "antd";
import { useState } from "react";
import { EditOutlined } from "@ant-design/icons";
import { updateModel } from "../../services/modelService";

function EditModel(props) {
  const { record, onReload } = props;
  const [form] = Form.useForm();
  const [mess, contextHolder] = message.useMessage();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    form.resetFields();
    setIsModalOpen(false);
  };

  const handleFinish = async (values) => {
    console.log(record);
    console.log(values);
    const response = await updateModel(record.id, {
      name_model: values.name_model,
    });
    if (response) {
      setIsModalOpen(false);
      onReload();
      mess.open({
        type: "success",
        content: "Update successfully!",
        duration: 5,
      });
    } else {
      mess.open({
        type: "error",
        content: "Update failed!",
        duration: 3,
      });
    }
  };

  return (
    <>
      {contextHolder}
      <Tooltip title="Update">
        <Button
          onClick={showModal}
          className="ml-5"
          icon={<EditOutlined />}
          type="primary"
          ghost
        ></Button>
      </Tooltip>

      <Modal
        title="Update"
        open={isModalOpen}
        onCancel={handleCancel}
        width={1000}
        footer={null}
      >
        <Form
          onFinish={handleFinish}
          initialValues={record}
          layout="vertical"
          form={form}
        >
          <Row gutter={20}>
            <Col span={24}>
              <Form.Item
                label="Name Model"
                name="name_model"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Update
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
}

export default EditModel;
