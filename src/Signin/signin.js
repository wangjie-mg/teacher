import React from "react";
import "./signin.css";
import Img from "./favicon.png";
import getRequest from "../_util/request";
import cookie from "react-cookies";
import { Form, Input, Button, Checkbox, Layout, message } from "antd";
import {LockOutlined,UserOutlined }from '@ant-design/icons';
import md5 from 'js-md5';
var { Footer } = Layout;

class NormalLoginForm extends React.Component {
  componentWillMount() {
    const token = cookie.load("token");
    if (token) {
      const url = {
        method: "post",
        url: "/api/token",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: token,
        },
      };
      getRequest(url, this.funca.bind(this));
    }
  }
  funca(req) {
    if (req.data.code===true) {
      this.props.history.push("/Abministrator");
    }
  }
  func(req) {
    if (req.data.code) {
      cookie.save("token", req.data.token, { path: "/" });
      this.props.history.push("/Abministrator");
      message.success("登陆成功", 4);
    } else {
      message.error(req.data.msg, 4);
    }
  }
  handleSubmit = (values) => {

    values.password = md5(values.password)
    const url = {
      method: "post",
      url: "/api/signin",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      data: values,
    };
    getRequest(url, this.func.bind(this));
  };

  render() {
    return (
      <div className="main">
      
        <div className="head">
          <div className="head-left">
            <img
                alt="西安邮电大学"
                src={Img}
                style={{ width: "80px"}}
            />
          </div>
          <div className="head-right">
            <p style={{fontSize:"24px"}}> 西 安 邮 电 大 学</p>
            <p style={{fontSize:"1.2em"}}> "最美教师"管理端登录</p>
            
          </div>
        </div>
        
        <Form onFinish={this.handleSubmit} className="login-form">
    

        <Form.Item
            name="username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input 
                prefix={<UserOutlined style={{color:"rgba(0,0,0,0.25)"}}/>}
                className="login-form-button" 
                placeholder="Username" 
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              { required: true, message: "Please input your Password!" },
              { min: 8, message: "密码最少8位！" },
            ]}
          >
            <Input
              prefix={<LockOutlined style={{color:"rgba(0,0,0,0.25)"}}/>}
              type="password"
              className="login-form-button"
              placeholder="Password"
            />
          </Form.Item>

          <Form.Item name="remember" valuePropName="checked">
            <Checkbox>Remember me</Checkbox>
            <button
              className="login-form-forgot"
              onClick={() => {
                message.info(
                  "暂时没有此功能，若忘记密码请联系站长。QQ：1477497597"
                );
              }}
            >
              Forgot password
            </button>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button but-top"
            >
              Login
            </Button>
          </Form.Item>


        </Form>
        <Footer
          style={{
            background: "rgb(250,250,250)",
            textAlign: "center",
            marginTop: "20px",
          }}
        >
          
          ©2020 西安邮电大学信息中心 <span style={{color:"rgb(59, 126, 189)"}}>智邮普创工作室</span>
        </Footer>
      </div>
    );
  }
}

export default NormalLoginForm;