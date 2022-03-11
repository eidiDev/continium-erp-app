import React from 'react';
import { Col, Modal, Row, Input, Icon, Button } from 'antd';

class LoginApontamento extends React.Component {
  constructor(props) {
    super(props);


    this.state = {

    };
  }

  render() {


    return (
      <>
        <Modal
          title="Digite sua Matrícula"
          visible={this.props.visibleLogin}
          onOk={this.props.handleOkLogin}
          onCancel={this.props.handleCancelLogin}
        >
          <Row gutter={[8, 30]}>
            <Col span={24}>
              <Input
                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                type="password"
                value={this.props.passwordInput}
                onChange={this.props.handleChange}
                placeholder="Matrícula"
              />
            </Col>
          </Row>

        </Modal>
      </>
    )
  }
}

export default LoginApontamento;