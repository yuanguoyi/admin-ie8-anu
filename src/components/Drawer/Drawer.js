import React, { Component, PropTypes } from "react";
import { Button, Icon, Popconfirm } from "antd";
import "./Drawer.less";
class Drawer extends Component {

  constructor(props) {
    super(props);
    const { visible } = this.props;
    this.state = {
      visible: (visible !== "" && visible !== null) ? visible : false
    };
  }

  componentWillReceiveProps({ visible }) {
    if (visible !== "" && visible !== null) {
      this.setState({ visible });
      setTimeout(() => {
        $(".custom_modal").animate({ right: 0 }, 300);
        var mainH = $(".custom_modal").height();
        var headerH = $(".custom_modal_header").height();
        var footerH = $(".custom_modal_footer").height();
        $(".custom_modal_content").height(mainH - headerH - footerH - 50);
      }, 300);
    }
  }

  componentDidMount() {

  }

  hiddenModal = () => {
    $(".custom_modal").animate({ right: "-750px" }, 300);
    setTimeout(() => {
      this.setState({ visible: false });
    }, 300);
  };

  onOk = () => {
    const { onOk } = this.props;
    if (onOk) {
      onOk();
    }
    this.hiddenModal();
  };

  onCancel = () => {
    const { onCancel } = this.props;
    if (onCancel) {
      onCancel();
    }
    this.hiddenModal();
  };

  onMouseDown = (e) => {
    const { maskClosable } = this.props;
    if (maskClosable) {
      this.onCancel();
    }
  };

  render() {
    const { okText, onOk, cancelText, children, title, closeToast, footer, showCloseToast, contentStyle } = this.props;
    const { visible } = this.state;
    const modal = (
      <div className="custom_modal_mask">
        {/*用于处理蒙版点击事件*/}
        <div style={{ width: "100%", height: "100%" }} onMouseDown={this.onMouseDown}></div>
        <div
          id="modal"
          className="custom_modal">
          <div className="custom_modal_header">
            {title ? title : null}
            {showCloseToast ? <Popconfirm title={closeToast ? closeToast : "请传入二次提醒的文案"} placement="leftTop"
                                          arrowPointAtCenter={true} onConfirm={() => {
              this.onCancel();
            }
            } onCancel={() => {
            }
            }>
              <div className="custom_modal_header_close">
                <Icon type="cross-circle-o"/>
              </div>
            </Popconfirm> : <div className="custom_modal_header_close" onClick={this.onCancel}>
              <Icon type="cross-circle-o"/>
              </div>}
          </div>
          <div className="custom_modal_content" style={contentStyle}>
            {children}
          </div>
          <div className="custom_modal_footer">
            <div className="custom_modal_footer_inner">
              {footer ? footer : <div>
                <Popconfirm title={closeToast ? closeToast : "请传入二次提醒的文案"} placement="topRight"
                            arrowPointAtCenter={true} onConfirm={() => {
                  this.onCancel();
                }
                } onCancel={() => {
                }
                }>
                  <Button>
                    {cancelText ? cancelText : "取消"}
                  </Button>
                </Popconfirm>

                <Button type="primary" onClick={this.onOk} style={{ marginLeft: "10px" }}>
                  {okText ? okText : "确定"}
                </Button>
              </div>}
            </div>
          </div>
        </div>
      </div>
    );
    return <div>{!visible ? null : modal}</div>;
  }
}

Drawer.propTypes = {
  visible: PropTypes.bool,
  title: PropTypes.string,
  maskClosable: PropTypes.bool,
  okText: PropTypes.string,
  cancelText: PropTypes.string,
  onCancel: PropTypes.func,
  onOk: PropTypes.func,
  onOkLoading: PropTypes.bool,
  showCloseToast: PropTypes.bool,
  closeToast: PropTypes.string,
  footer: PropTypes.node,
  children: PropTypes.element.isRequired,
  contentStyle: PropTypes.object
};

export default Drawer;
