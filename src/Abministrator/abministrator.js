import React from "react";
import {
  Input,
  Modal,
  Layout,
  PageHeader,
  Button,
  Table,
  Tag,
  Divider,
  Space,
  message,
  Form,
  Upload,
} from "antd";
import { ExclamationCircleOutlined, InboxOutlined } from "@ant-design/icons";
import cookie from "react-cookies";
import getRequest from "../_util/request";
import imgurl from "./xy.png";
import "./abministrator.css";

const { Dragger } = Upload;
const { Header, Footer, Content } = Layout;
const { confirm } = Modal;
const { Search } = Input;

const layout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};

class abmin extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      collapsed: false,
      tdstate: false,
      imgW: true,
      width: 1145,
      data: [],
      visible: false,
      fileList: [],
      reqflag:100,
    };
  }
  formRef = React.createRef();


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
    if (req.data.code ===true) {
      this.setState({
        tdstate: req.data.state,
      });
    }else if(req.data.code === 500){
      message.error('登录失效，请重新登录',2)
      this.props.history.push("/Signin");
    }else if(req.data.code === false){
      message.error('网络错误请刷新页面重新操作',3)

    }
  }

  showConfirm(flag) {
    confirm({
      title: flag ? "你是想要开启投票通道吗" : "你想要关闭投票通道吗",
      icon: <ExclamationCircleOutlined />,
      onOk:()=> {
        const token = cookie.load("token");
        const url = {
          method: "post",
          url: "/api/open",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: token,
          },
          data: {
            state: flag,
          },
        };
        getRequest(url, this.open.bind(this));
      },
      onCancel:()=> {
       
      },
    });
  }

 
  open = (req) => {
    if (req.data.code === 1) {
      this.setState({
        tdstate: true,
      });
      
      message.success(req.data.msg, 3);
    } else if (req.data.code === 2) {
      this.setState({
        tdstate: false,
      });
      message.success(req.data.msg, 3);
    } else {
      message.error(req.data.msg, 3);
    }
  };

  handleClientW = (width) => {
    if (width > 1145) {
      this.setState({
        collapsed: true,
        imgW: false,
      });
    } else if (width < 1145 && width > 445) {
      this.setState({
        collapsed: false,
        imgW: false,
        width,
      });
    } else if (width < 445) {
      this.setState({
        imgW: true,
        width,
      });
    }
  };
  componentDidMount() {
    window.addEventListener("resize", this.handleResize.bind(this));
    let clientW = document.documentElement.clientWidth;
    this.handleClientW(clientW);
  }
  handleResize = (e) => {
    let e_width = e.target.innerWidth;
    this.handleClientW(e_width);
  };
  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize.bind(this));
  }

  onChange(info) {
    const { status } = info.file;
    let fileList = [...info.fileList];
    fileList = [...info.fileList].slice(-1);
    if (status === "done") {
      const { code, imgurl } = info.file.response;
      if (code) {
        message.success(`${info.file.name} 文件上传成功.`);

        this.setState({
          fileList,
          imgurl,
        });
      } else {
        message.error(`${info.file.name} 文件上传失败.`);
      }
    } else if (status === "error") {
      message.error(`${info.file.name} 文件上传失败.`);
    }
    this.setState({ fileList });
  }
  config = {
    name: "file",
    action: "/api/info",
    onChange: this.onChange.bind(this),
  };

  showModal = () => {
    this.setState({
      reqflag:100,
      visible: true,
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
      fileList: [],
    });
    this.formRef.current.resetFields();
  };
  columns = [
    {
      title: "名称",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "所在学院",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "图片是否存在",
      dataIndex: "img",
      key: "img",
      render: (a) => {
        return a ? "存在" : "不存在";
      },
    },
    {
      title: "描述是否存在",
      dataIndex: "desc",
      key: "desc",
      render: (a) => {
        return a ? "存在" : "不存在";
      },
    },
    {
      title: "投票人数",
      dataIndex: "support",
      key: "support",
      defaultSortOrder: "descend",
      sorter: (a, b) => a.age - b.age,
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
          <Button type="link" onClick={this.Listupdate.bind(this, record)}>
            编辑信息
          </Button>
          <Button type="link" onClick={this.Listdelete.bind(this, record)}>
            删除
          </Button>
        </Space>
      ),
    },
  ];
  onFinish = async (flag) => {
    const values = await this.formRef.current.validateFields();
    if (this.state.fileList.length === 0) {
      message.error("没上传图片", 3);
      return;
    }
    const token = cookie.load("token");

    if (token) {
      if (this.state.fileList[0].uid==='-1'||this.state.fileList[0].response !== undefined) {
        if (this.state.fileList[0].uid==='-1' ||this.state.fileList[0].response.code !== false) {

          let newdata = {}
          if(flag===100){
            newdata={
              ...values,
              imgurl: this.state.fileList[0].response.imgurl,
              imgname:this.state.fileList[0].name,
            }
          }else{
            newdata={
              ...values,
              imgurl: this.state.fileList[0].imgurl,
              imgname:this.state.fileList[0].name,
              _id:this.state.fileList[0]._id
            }
          }
          const requrl = {
            method: "post",
            url: flag ===100?"/api/save":"/api/update",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              Authorization: token,
            },
            data: newdata,
          };

          getRequest(requrl, flag===100?this.listsave.bind(this):this.listupdateafter.bind(this));

        } else {
          message.error("图片上传错误", 3);
        }
      } else {
        message.error("网络错误", 3);
      }
    } else {
      message.error("token失效请重新登录", 3);
      this.props.history.push("/Signin");
    }
  };
  listsave = (req, res) => {
    const { code } = req.data;
    if (code === true) {
      this.setState({
        visible: false,
        data: [req.data.user, ...this.state.data],
        fileList: [],
        
      });
      this.formRef.current.resetFields();
    } else {
      message.error(req.data.msg, 3);
      if(code !== 502){
        this.props.history.push("/Signin");
      }
    }
  };
  Listfind = (code, values) => {
    const token = cookie.load("token");
    if (token) {
      let newdata;
      if (code === 100) {
        newdata = { code: 100, name: values };
      } else if (code === 101) {
        newdata = { code: 101 };
      }
      const url = {
        method: "post",
        url: "/api/find",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: token,
        },
        data: newdata,
      };
      getRequest(url, this.listfindafter.bind(this));
    } else {
      message.error("未登录请先登录", 3);
      this.props.history.push("/Signin");
    }
  };
  listfindafter = (req) => {
    const { code } = req.data;
    if (code === true) {
      this.setState({
        data: req.data.user,
      });
    } else  {
      message.error(req.data.msg, 3);
      if(code !== 502){
        this.props.history.push("/Signin");
      }
    }
  };
  Listdelete = (record) => {
    const token = cookie.load("token");
    if (token) {
      const url = {
        method: "post",
        url: "/api/delete",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: token,
        },
        data: {
          _id: record._id,
        },
      };
      getRequest(url, this.listdeleteafter.bind(this, record.name));
    } else {
      message.error("未登录请先登录", 3);
      this.props.history.push("/Signin");
    }
  };
  listdeleteafter = (name, req) => {
    const { code } = req.data;
    if (code === true) {
      this.setState({
        data: this.state.data.filter((item, index, array) => {
          return array[index].name !== name;
        }),
      });
    } else  {
      message.error(req.data.msg, 3);
      if(code !== 502){
        this.props.history.push("/Signin");
      }
    }
  };
  Listupdate = (record) => {
    this.setState({
      fileList:[{
        uid: '-1',
        name: record.imgname,
        status: record.img?'done':'error',
        imgurl:record.img,
        _id:record._id,
      }],
      visible:true,
      reqflag:200
    });
    setTimeout(() => {
      this.formRef.current.setFieldsValue({
        'name': record.name,
        'address':record.address,
        'desc':record.desc
      });
      }, 100);
    

  };
  listupdateafter=(req,res)=>{
    const {code} =req.data; 
    
    if(code===true){
      const newdata = this.state.data.map((value,index,ary)=>{
          return value._id===req.data.user._id?req.data.user:ary[index]
      })
      this.setState({
        visible:false,
        data:newdata
      })
      message.success("修改成功",2)
    }else{
      message.success(req.data.msg,2)
    }

  }
 
  render() {
    const content = (
      <div className="flex input ">
        <Search
          placeholder="精准查询 请输入名称查询"
          style={{ width: "300px" }}
          onSearch={this.Listfind.bind(this, 100)}
          enterButton
        />
        <Button type="link" onClick={this.Listfind.bind(this, 101)}>
          查询所有评比人员信息
        </Button>
        <Button type="link" onClick={this.showModal.bind(this)}>
          添加评比老师信息
        </Button>
      </div>
    );
    
    return (
      <>
        <Layout>
          <div className="top"></div>

          <Header className={this.state.imgW ? "flex" : "flex wh"}>
            <div className="logo">
              <img
                alt="西安邮电大学"
                src={imgurl}
                style={{ width: this.state.imgW ? "70vw" : "" }}
              />
            </div>
            {this.state.collapsed ? (
              <div className="logo-name">
                <p>西安邮电大学 “最美教师评选” 管理端</p>
              </div>
            ) : (
              ""
            )}
          </Header>
          <div className="line "></div>
          <Content
            className="contion"
            style={{
              width: this.state.width + "px",
              left: -this.state.width / 2 + "px",
            }}
          >
            <PageHeader
              className="site-page-header-responsive a "
              title="投票通道状态:"
              tags={
                this.state.tdstate ? (
                  <Tag color="blue">投票通道已经开启</Tag>
                ) : (
                  <Tag color="red">通票通道关闭中</Tag>
                )
              }
              extra={[
                <Button
                  key="2"
                  type="primary"
                  onClick={this.showConfirm.bind(this, true)}
                >
                  开启投票通道
                </Button>,

                <Button
                  key="1"
                  danger
                  onClick={this.showConfirm.bind(this, false)}
                >
                  关闭投票通道
                </Button>,
              ]}
            >
             
              <Content>{content}</Content>
            </PageHeader>

            <Divider style={{ margin: "0" }} />
            <Table columns={this.columns} dataSource={this.state.data} />
          </Content>
          <Footer style={{ borderTop: "1px solid #ccc", textAlign: "center" }}>
            版权所有 ©2020 西安邮电大学信息中心{" "}
            <span style={{ color: "rgb(59, 126, 189)" }}>智邮普创工作室</span>
          </Footer>
        </Layout>
        <Modal
          title="添加成员信息"
          visible={this.state.visible}
          onCancel={this.handleCancel.bind(this)}
          footer={[
            <Button
              key="cancel"
              htmlType="button"
              onClick={this.handleCancel.bind(this)}
            >
              离开
            </Button>,
            <Button
              key="submit"
              type="primary"
              htmlType="submit"
              onClick={this.onFinish.bind(this,this.state.reqflag)}
              style={{ marginLeft: "10px" }}
            >
              确定
            </Button>,
          ]}
        >
          <Form {...layout} ref={this.formRef} name="nest-messages" >
            <Form.Item
              name="name"
              label="Name"
              rules={[
                {
                  required: true,
                  message: "请输入老师名称",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="address"
              label="学院"
              rules={[
                {
                  required: true,
                  message: "请输入老师所在学院",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="desc"
              label="介绍"
              rules={[{ required: true, message: "请输入老师简介" }]}
            >
              <Input.TextArea rows={4} />
            </Form.Item>
            <Form.Item label="Dragger">
              <Dragger {...this.config} fileList={this.state.fileList}>
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">点击 或 拖拽上传文件</p>
                <p className="ant-upload-hint">
                  一次仅支持上传一个图片文件，重复上传会覆盖上一个图片文件。支持
                  .jpg .png等常用图片格式
                </p>
              </Dragger>
            </Form.Item>
          </Form>
        </Modal>
      </>
    );
  }
}

export default abmin;
