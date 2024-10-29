import React, { useState } from "react";
import { Input, Button, message } from "antd";
import { setApiDomain, getApiDomain } from "../../constants/variables";

function ApiDomainSetter() {
  const [domain, setDomain] = useState(getApiDomain());

  const handleSave = () => {
    try {
      new URL(domain); // Validate URL
      setApiDomain(domain); // Cập nhật API_DOMAIN và lưu vào localStorage
      message.success("API domain updated successfully");
    } catch (e) {
      message.error("Please enter a valid URL");
    }
  };

  return (
    <div style={{ margin: "20px 0" }}>
      <Input
        placeholder="Enter API domain"
        value={domain}
        onChange={(e) => setDomain(e.target.value)}
        style={{ width: "300px", marginRight: "10px" }}
      />
      <Button type="primary" onClick={handleSave}>
        Change Domain
      </Button>
    </div>
  );
}

export default ApiDomainSetter;