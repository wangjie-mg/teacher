import React from "react";
import getRequest from "../_util/request";
import { List, Card, Space, message, Layout, Modal, Button, Tag,Spin } from "antd";
import { BarChartOutlined, HeartOutlined } from "@ant-design/icons";
import shuffle from "lodash/shuffle";
import imgurl from "../Abministrator/xy.png";
import queryString from "query-string";
import "./main.css";
const { Meta } = Card;
const { Header, Footer, Content} = Layout;
const pulurl = "/pic/images/";
class main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading:true,
      userid:'',
      dataone: [],
      visible: false,
      tdstate: false,
      userpur: false,
      data: {
        _doc: {
          _id: "",
          name: "",
          img: "",
          docs: "",
          address: "",
        },
      },
    };
    this.waterfallDeviationHeight = [];
  }

  componentDidMount() {

    let params = queryString.parse(this.props.location.search);
      const url = {
        method: "post",
        url: "/api/wxid",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        data: {
          code: params.code,
        },
      };
      getRequest(url, this.data.bind(this));
    
    const findurl = {
      method: "post",
      url: "/api/find",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: 100,
      },
    };
    getRequest(findurl, this.dataadd.bind(this));
  }

   
  data = (req) => {
    const { code } = req.data;
    if (code === true) {
      this.setState({
        loading:false,
        userpur: req.data.userpur,
        userid:req.data.userid,
        tdstate: req.data.state,
      });
    } else {
      message.error("网络错误123", 2);
    }
  };

  dataadd = (req) => {
    const { code } = req.data;
    if (code === true) {
      const data = shuffle(req.data.user);
      this.setState({
        dataone: data,
      });
    } else {
      message.error("网络错误", 2);
    }
  };
  showModal = (item) => {
    this.setState({
      visible: true,
      data: item,
    });
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };
  handleOk = () => {
    if (this.state.tdstate && this.state.userpur) {
      const url = {
        method: "post",
        url: "/api/vote",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        data: {
          userid: this.state.userid,
          _id: this.state.data._doc._id,
        },
      };
      getRequest(url, this.okafter.bind(this));
    }
  };
  okafter = (req) => {
    if (req.data.code === true) {
      console.log(this.state.dataone);
      const newdata = this.state.dataone.map((value, index, ary) => {
        let { data } = this.state;

        if (value._doc._id === data._doc._id) {
          data._doc.support++;
        }
        return value._doc._id === data._doc._id ? data : ary[index];
      });
      message.success("投票成功", 2);

      this.setState({
        userpur: false,
        visible: false,
        dataone: newdata,
      });
    } else {
      message.error("网络错误，投票失败", 2);
    }
  };
  render() {
    const IconText = ({ icon, text }) => (
      <Space>
        {React.createElement(icon)}
        {text}
      </Space>
    );

    return (
      <Spin size="large" spinning={this.state.loading}>
      <Layout>
        <Header style={{ margin: "0", padding: "0" }}>
          <div className="header">
            <div className="header-main">
              <img alt="西安邮电大学" src={imgurl} />
            </div>
          </div>
          <div className="texture">
            <h1>“2020最美教师”评选</h1>
          </div>
        </Header>
        <Layout>
          <Content className="main-list" style={{ padding: "4vw" }}>
            <List
              style={{ columnCount: "2" }}
              dataSource={this.state.dataone}
              renderItem={(item) => (
                <List.Item style={{ breakInside: "avoid" }}>
                  <Card
                    cover={<img alt="img" src={pulurl + item._doc.img} />}
                    onClick={this.showModal.bind(this, item)}
                  >
                    <Meta
                      title={item._doc.name}
                      description={item._doc.address}
                    />
                    <div style={{ marginTop: "10px" }}>
                      <Space>
                        <IconText
                          icon={HeartOutlined}
                          text={item._doc.support}
                          key="list-vertical-star-o"
                        />
                        <IconText
                          icon={BarChartOutlined}
                          text={item.pm}
                          key="list-vertical-like-o"
                        />
                      </Space>
                    </div>
                  </Card>
                </List.Item>
              )}
            />
          </Content>
        </Layout>
        <Footer style={{ borderTop: "1px solid #ccc", textAlign: "center" }}>
          版权所有 ©2020 西安邮电大学信息中心{" "}
          <span style={{ color: "rgb(59, 126, 189)" }}>智邮普创工作室</span>
        </Footer>

        <Modal
          visible={this.state.visible}
          title="Title"
          onCancel={this.handleCancel.bind(this)}
          footer={[
            <div className="tar">
              {this.state.tdstate ? (
                this.state.userpur ? (
                  <Tag color="green">快来投上一票</Tag>
                ) : (
                  <Tag color="blue">你已经投过票了</Tag>
                )
              ) : (
                <Tag color="orange">稍等投票通道还没有开启</Tag>
              )}
            </div>,
            <Button key="back" onClick={this.handleCancel.bind(this)}>
              关闭
            </Button>,
            <Button
              key="submit"
              type="primary"
              onClick={this.handleOk.bind(this)}
              disabled={this.state.tdstate && this.state.userpur ? false : true}
            >
              投上一票
            </Button>,
          ]}
        >
          <div className="main-flex">
            <div style={{ width: "300px" }}>
              <img alt="img" src={pulurl + this.state.data._doc.img} />
            </div>
            <div style={{ width: "100%", marginTop: "10px" }}>
              <Meta
                title={this.state.data._doc.name}
                description={this.state.data._doc.address}
              />
              <div style={{ marginTop: "10px" }}>
                <pre style={{ height: "150px", overflowY: "scroll" }}>
                  {this.state.data._doc.desc}
                </pre>
              </div>
            </div>
          </div>
        </Modal>
      </Layout>
      </Spin>
    );
  }
}
export default main;
