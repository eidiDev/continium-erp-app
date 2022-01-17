import React from 'react';
import {Modal, Card, Timeline, Button} from 'antd';

export default class LogView extends React.Component {
    render() {
        return(
            <Modal
                title="Logs"
                visible={this.props.showLog}
                onOk={this.props.onOkLog}
                onCancel={this.props.onOkLog}
                // onCancel={this.props.onCancel}
                bodyStyle={{padding: 0 }}
                // confirmLoading={this.props.confirmLoading}
                footer={[
                    <Button key="submit" type="primary" onClick={this.props.onOkLog}>
                      Ok
                    </Button>
                ]}
            >
                <Card title="" className="gx-card">
                    <Timeline>
                        {
                            this.props.logs.map(function(item) {
                                var x = item.toString();
                                return <Timeline.Item color={x.includes('não tem') ? "red": "green"}>{item}</Timeline.Item>        
                            })
                        }
                    </Timeline>
                </Card>
            </Modal>
        )
    }
}