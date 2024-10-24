/* eslint-disable no-unused-vars */
import { Layout } from "antd";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import "./Layout.scss";
import { useSelector } from "react-redux";
const { Sider, Content } = Layout;

function LayoutDefault() {
  return (
    <>
      <Layout className="layout">
        <Header />
          <Content className="layout__content">
            <Outlet />
          </Content>
        </Layout>
    </>
  );
}

export default LayoutDefault;
