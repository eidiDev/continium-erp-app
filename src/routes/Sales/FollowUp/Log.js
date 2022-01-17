import React from 'react';
import {Modal, Card, Timeline, Button} from 'antd';

export default class Log extends React.Component {
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
                                return <Timeline.Item color={x.includes('não') ? "red": "green"}>{item}</Timeline.Item>        
                            })
                        }
                        {/* <Timeline.Item color="green">Create a services site 2015-09-01</Timeline.Item>
                        <Timeline.Item color="red">
                        <p>Solve initial network problems 1</p>
                        <p>Solve initial network problems 2</p>
                        <p>Solve initial network problems 3 2015-09-01</p>
                        </Timeline.Item>
                        <Timeline.Item>
                        <p>Technical testing 1</p>
                        <p>Technical testing 2</p>
                        <p>Technical testing 3 2015-09-01</p>
                        </Timeline.Item> */}
                    </Timeline>
                </Card>
            </Modal>
        )
    }
}