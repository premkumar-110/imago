import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../admindashboard/admindashboard.css"
import logo from "../logo.svg";
import { IoMail } from "react-icons/io5";
import { MdPassword } from "react-icons/md";
import axios from "axios";
import ToasterUi from "toaster-ui";
import { BsEyeSlashFill, BsEyeFill } from "react-icons/bs";
import AOS from "aos";
import "aos/dist/aos.css";
import { AiOutlineMenu } from "react-icons/ai";
import Cookies from "js-cookie";
import { HiOutlineChevronDoubleRight } from "react-icons/hi";
import {
  MenuFoldOutlined, MenuUnfoldOutlined, UnorderedListOutlined, DashboardOutlined, DropboxOutlined, TeamOutlined, DownOutlined, SmileOutlined,HomeOutlined,UserOutlined
  ,LogoutOutlined,LinkOutlined,GiftOutlined
} from '@ant-design/icons';
import { Layout, Menu, Button, theme, MenuProps } from 'antd'; // Import MenuProps directly from 'antd'
import { Dropdown, Space } from 'antd';
import Customers from "../admin/customers/customers";
import Products from "../admin/products/products";
import Categories from "../admin/Categories/Categories";
import Dashboard from "../admin/Dashboard/Dashboard";
import Orders from "../admin/Orders/Orders";

const { Header, Sider, Content } = Layout;

const AdminDashboard = () => {
  const [selectedMenuItem, setSelectedMenuItem] = useState("orders");
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false);
  const handleMenuClick = (key) => {
    setSelectedMenuItem(key);
  };
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const items = [ // Use MenuProps['items'] to define items
     {
      key: '1',
      label: (
        <a className="AdminDropDownButton" onClick={()=>{navigate('/admindashboard')}}><HomeOutlined />HOME</a>
      ),
      // icon: <HomeOutlined />,
    },
     {
      key: '2',
      label: (
        <a className="AdminDropDownButton" onClick={() => { window.open('/login', '_blank'); }}><LinkOutlined />VIEW SITE</a>
      ),
      // icon: <HomeOutlined />,
    },
     {
      key: '3',
      label: (
        <a className="AdminDropDownButton" onClick={()=>{navigate('/adminlogin')}}><LogoutOutlined />LOGOUT</a>
      ),
      // icon: <HomeOutlined />,
    },
    
  ];

  return (
    <>
      <Layout className="Layout">
        <Sider trigger={null} collapsible collapsed={collapsed} className="Sider">
          <div className="demo-logo-vertical" ><img src={logo} className="AdminLogo"/><div style={{display: collapsed ? "none" : "block"}}>IMAGO</div></div>
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[selectedMenuItem]}
            onClick={({ key }) => handleMenuClick(key)}
          >
            <Menu.Item key="orders" className="MenuItems"><GiftOutlined /> <div style={{display: collapsed ? "none" : "contents"}}>ORDERS</div></Menu.Item>
            {/* <Menu.Item key="dashboard" className="MenuItems"><DashboardOutlined/> <div style={{display: collapsed ? "none" : "contents"}}>DASHBOARD</div></Menu.Item> */}
            <Menu.Item key="categories" className="MenuItems"><UnorderedListOutlined/> <div style={{display: collapsed ? "none" : "contents"}}>CATEGORIES</div></Menu.Item>
            <Menu.Item key="products" className="MenuItems"><DropboxOutlined/> <div style={{display: collapsed ? "none" : "contents"}}>PRODUCTS</div></Menu.Item>
            <Menu.Item key="customers" className="MenuItems"><TeamOutlined/> <div style={{display: collapsed ? "none" : "contents"}}>CUSTOMERS</div></Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <Header style={{ paddingLeft: 0, background: colorBgContainer, display:"flex", justifyContent:"space-between" }}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: '16px',
                width: 64,
                height: 64,
              }}
            />
            <Dropdown className="AdminDropdown" menu={{ items }}  >
              <a onClick={(e) => e.preventDefault()}>
                <Space>
                <UserOutlined /> WELCOME
                  <DownOutlined />
                </Space>
              </a>
            </Dropdown>
          </Header>
          <Content
            style={{
              margin: '24px 16px',
              padding: 24,
              minHeight: 280,
              background: colorBgContainer,
              overflowY:"scroll",
              overflowX:"hidden"
            }}
          >
           {selectedMenuItem === "dashboard" && <Dashboard />}
           {selectedMenuItem === "orders" && <Orders />}
            {selectedMenuItem === "categories" && <Categories />}
            {selectedMenuItem === "products" && <Products />}
            {selectedMenuItem === "customers" && <Customers />}
          </Content>
        </Layout>
      </Layout>
    </>
  )
}

export default AdminDashboard;
