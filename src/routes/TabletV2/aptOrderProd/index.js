import React from 'react';
import { Col, Modal, Row, Input, Icon, Button, Layout, Spin, Card, Form, Table } from 'antd';
import Auxiliary from 'util/Auxiliary';
const { Meta } = Card;

const { Content, Footer } = Layout;

class AptProd extends React.Component {
    constructor(props) {
        super(props);


        this.state = {

        };
    }

    render() {
        const { orderProdSelect } = this.props

        return (
            <Spin spinning={false} tip={''}>
                <Layout className="gx-app-layout">
                    <Content className="gx-layout-content gx-container-wrap  ant-layout-content">
                        <div className="gx-main-content-wrapper">
                            <Auxiliary>
                                <Row>
                                    <Col span={24}>
                                        <Button onClick={this.props.backToFirstPage} >
                                            Voltar
                                        </Button>
                                    </Col>
                                </Row>

                                <Row gutter={[10, 10]}>
                                    <Col span={24}>
                                        <Card type="inner" title="Dados da Ordem de Produção">
                                            <Row>
                                                <Col lg={6} md={6} sm={12} xs={24}>
                                                    <div className="gx-form-row0">
                                                        <Form.Item label="Máquina">
                                                            <Input
                                                                type="text"
                                                                // value={categ.cod}
                                                                name="cod"
                                                                disabled={true}
                                                            />
                                                        </Form.Item>
                                                    </div>
                                                </Col>

                                                <Col lg={6} md={6} sm={12} xs={24}>
                                                    <div className="gx-form-row0">
                                                        <Form.Item label="Ordem de produção">
                                                            <Input
                                                                type="text"
                                                                // value={categ.cod}
                                                                name="cod"
                                                                disabled={true}
                                                            />
                                                        </Form.Item>
                                                    </div>
                                                </Col>

                                                <Col lg={6} md={6} sm={12} xs={24}>
                                                    <div className="gx-form-row0">
                                                        <Form.Item label="Status">
                                                            <Input
                                                                type="text"
                                                                // value={categ.cod}
                                                                name="cod"
                                                                disabled={true}
                                                            />
                                                        </Form.Item>
                                                    </div>
                                                </Col>

                                                <Col lg={6} md={6} sm={12} xs={24}>
                                                    <div className="gx-form-row0">
                                                        <Form.Item label="Usuário">
                                                            <Input
                                                                type="text"
                                                                // value={categ.cod}
                                                                name="cod"
                                                                disabled={true}
                                                            />
                                                        </Form.Item>
                                                    </div>
                                                </Col>

                                            </Row>
                                        </Card>


                                    </Col>
                                </Row>


                                <Row gutter={[10, 10]}>
                                    <Col span={24}>
                                        <Card type="inner" title="Produto">
                                            <Row>
                                                <Col lg={6} md={6} sm={12} xs={24}>
                                                    <div className="gx-form-row0">
                                                        <Form.Item label="Produto">
                                                            <Input
                                                                type="text"
                                                                // value={categ.cod}
                                                                name="cod"
                                                                disabled={true}
                                                            />
                                                        </Form.Item>
                                                    </div>
                                                </Col>

                                                <Col lg={6} md={6} sm={12} xs={24}>
                                                    <div className="gx-form-row0">
                                                        <Form.Item label="Descrição">
                                                            <Input
                                                                type="text"
                                                                // value={categ.cod}
                                                                name="cod"
                                                                disabled={true}
                                                            />
                                                        </Form.Item>
                                                    </div>
                                                </Col>

                                                <Col lg={6} md={6} sm={12} xs={24}>
                                                    <div className="gx-form-row0">
                                                        <Form.Item label="Qtde prevista">
                                                            <Input
                                                                type="text"
                                                                // value={categ.cod}
                                                                name="cod"
                                                                disabled={true}
                                                            />
                                                        </Form.Item>
                                                    </div>
                                                </Col>

                                                <Col lg={6} md={6} sm={12} xs={24}>
                                                    <div className="gx-form-row0">
                                                        <Form.Item label="Qtde produzida na etapa">
                                                            <Input
                                                                type="text"
                                                                // value={categ.cod}
                                                                name="cod"
                                                                disabled={true}
                                                            />
                                                        </Form.Item>
                                                    </div>
                                                </Col>

                                                <Col lg={6} md={6} sm={12} xs={24}>
                                                    <div className="gx-form-row0">
                                                        <Form.Item label="Qtde apontada">
                                                            <Input
                                                                type="text"
                                                                // value={categ.cod}
                                                                name="cod"
                                                                disabled={true}
                                                            />
                                                        </Form.Item>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </Card>


                                    </Col>
                                </Row>


                                <Row gutter={[14, 10]}>
                                    <Col span={24}>
                                        <Card type="inner" title="Produzir">
                                            <Row>
                                                <Col lg={6} md={6} sm={12} xs={24}>
                                                    <div className="gx-form-row0">
                                                        <Button type="primary" block >
                                                            +1
                                                        </Button>
                                                    </div>
                                                </Col>

                                                <Col lg={6} md={6} sm={12} xs={24}>
                                                    <div className="gx-form-row0">
                                                        <Button type="primary" block>
                                                            -1
                                                        </Button>
                                                    </div>
                                                </Col>

                                                <Col lg={6} md={6} sm={12} xs={24}>
                                                    <div className="gx-form-row0">
                                                        <Button type="primary" block>
                                                            +10
                                                        </Button>
                                                    </div>
                                                </Col>

                                                <Col lg={6} md={6} sm={12} xs={24}>
                                                    <div className="gx-form-row0">
                                                        <Button type="primary" block>
                                                            -10
                                                        </Button>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </Card>
                                    </Col>
                                </Row>

                                <Row gutter={[10, 10]}>
                                    <Col 
                                    xxl={18}
                                    xl={18}
                                    lg={18}
                                    md={18}
                                    sm={18}
                                    xs={24}>
                                        <Card type="inner" title="Apontamentos">
                                            <Table></Table>
                                        </Card>
                                    </Col>

                                    <Col  
                                    xxl={6}
                                    xl={6}
                                    lg={6}
                                    md={6}
                                    sm={6}
                                    xs={24}>
                                        <Card type="inner" title="Apontamentos">
                                            <Row>
                                                <Col span={24}>
                                                    <Button  type="primary" block>
                                                        Programar
                                                    </Button>
                                                </Col>
                                            </Row>

                                            <Row>
                                                <Col span={24}>
                                                    <Button type="primary" block >
                                                        Operar
                                                    </Button>
                                                </Col>
                                            </Row>

                                            <Row>
                                                <Col span={24}>
                                                    <Button type="primary" block>
                                                        Pausar
                                                    </Button>
                                                </Col>
                                            </Row>

                                            <Row>
                                                <Col span={24}>
                                                    <Button type="primary" block>
                                                        Finalizar
                                                    </Button>
                                                </Col>
                                            </Row>
                                        </Card>
                                    </Col>
                                </Row>
                            </Auxiliary>
                        </div>
                    </Content>
                </Layout>
            </Spin>
        )
    }
}

export default AptProd;