import React, { Component } from 'react';
import {Card, 
        Form, 
        Input, 
        Row, 
        Col, 
        DatePicker
    } from 'antd';
// import locale from 'moment/locale/pt-br';
// import moment from 'moment';
/**
 * Esse form é responsável por gerenciar os campos da tela de import
 * POrem as actions virão do component pai.
 */
export default class ImportOrdersFoxForm extends Component {

    render () {
        return(
            <Row>
                <Col span={24}>
                    <Card type="inner" title="Validar Pedido de  Venda">
                        <Form layout="horizontal" size="small">
                            <Row>

                            <Col lg={3} md={6} sm={12} xs={24}>
                                <div className="gx-form-row0">
                                    <Form.Item label="Data Entrega inicial">
                                        <DatePicker 
                                            // value={this.state.dataEntrega}
                                            // locale={locale}
                                            format={"DD-MM-YYYY"} 
                                            onChange={this.props.handleChange('dataInicio')} 
                                        />
                                    </Form.Item>
                                </div>
                            </Col>

                            <Col lg={3} md={6} sm={12} xs={24}>
                                <div className="gx-form-row0">
                                    <Form.Item label="Data Entrega Final">
                                        <DatePicker 
                                            // value={this.state.dataEntrega}
                                            // locale={locale}
                                            format={"DD-MM-YYYY"} 
                                            onChange={this.props.handleChange('dataFim')} 
                                        />
                                    </Form.Item>
                                </div>
                            </Col>

                            <Col lg={3} md={6} sm={12} xs={24}>
                                <div className="gx-form-row0">
                                    <Form.Item label="Data Prevista inicial">
                                        <DatePicker 
                                            // value={this.state.dataEntrega}
                                            // locale={locale}
                                            format={"DD-MM-YYYY"} 
                                            onChange={this.props.handleChange2('dataInicioM')} 
                                        />
                                    </Form.Item>
                                </div>
                            </Col>

                            <Col lg={3} md={6} sm={12} xs={24}>
                                <div className="gx-form-row0">
                                    <Form.Item label="Data Prevista Final">
                                        <DatePicker 
                                            // value={this.state.dataEntrega}
                                            // locale={locale}
                                            format={"DD-MM-YYYY"} 
                                            onChange={this.props.handleChange2('dataFimM')} 
                                        />
                                    </Form.Item>
                                </div>
                            </Col>
                            
                            {/* <Col lg={4} md={6} sm={12} xs={24}>
                                <div className="gx-form-row0">
                                    <Form.Item label="Data final">
                                        <DatePicker 
                                            // locale={locale}
                                            // defaultValue={moment()}
                                            format={"DD-MM-YYYY"} 
                                            onChange={this.props.handleChange('dataFim')} 
                                        />
                                    </Form.Item>
                                </div>
                            </Col> */}

                            <Col lg={3} md={6} sm={12} xs={24}>
                                <div className="gx-form-row0">
                                    <Form.Item label="Pedido Cliente">
                                        <Input 
                                            type="number"
                                            // style={{ width: 120 }}  
                                            value={this.props.filtros.id_PedidoVenda}
                                            name="id_PedidoVenda"
                                            onChange={this.props.handleChange('id_PedidoVenda')}
                                            onKeyDown={this.props.onKeyDown}
                                        />
                                    </Form.Item>
                                </div>
                            </Col>
                            <Col lg={3} md={6} sm={12} xs={24}>
                                <div className="gx-form-row0">
                                    <Form.Item label="Pedido Fox">
                                        <Input 
                                            type="text"
                                            // style={{ width: 120 }}  
                                            value={this.props.filtros.pedido_fox}
                                            name="pedido_fox"
                                            onChange={this.props.handleChange('pedido_fox')}
                                            onKeyDown={this.props.onKeyDown}
                                        />
                                    </Form.Item>
                                </div>
                            </Col>
                            {/* <Col lg={4} md={6} sm={12} xs={24}>
                                <div className="gx-form-row0">
                                    <Form.Item label="Codigo produto" >
                                        <Input 
                                            type="text" 
                                            // style={{ width: 120 }}
                                            // value={orderPro.pedidoCliente}
                                            value={this.props.filtros.produto}
                                            name="produto"
                                            onChange={this.props.handleChange('produto')}
                                            onKeyDown={this.props.onKeyDown}
                                        />
                                    </Form.Item>
                                </div>
                            </Col> */}

                            {/* <Col lg={4} md={6} sm={12} xs={24}>
                                <div className="gx-form-row0">
                                    <Form.Item label="CFOP" >
                                        <Input 
                                            type="text" 
                                            // style={{ width: 120 }}
                                            // value={orderPro.pedidoCliente}
                                            name="cfop"
                                            value={this.props.filtros.cfop}
                                            onChange={this.props.handleChange('cfop')}
                                            onKeyDown={this.props.onKeyDown}
                                        />
                                    </Form.Item>
                                </div>
                            </Col> */}
                            </Row>
                        </Form>
                    </Card>
                </Col>
            </Row>
        )
    }
}

