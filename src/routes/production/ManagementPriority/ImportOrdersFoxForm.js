import React, { Component } from 'react';
import {Card, 
        Form, 
        Input, 
        Row, 
        Col, 
        DatePicker,
        Select
    } from 'antd';
// import locale from 'moment/locale/pt-br';
// import moment from 'moment';
/**
 * Esse form é responsável por gerenciar os campos da tela de import
 * POrem as actions virão do component pai.
 */
export default class ImportOrdersFoxForm extends Component {

    render () {
        const { listOfMaquinas } = this.props;
        return(
            <Row>
                <Col span={24}>
                    <Card type="inner" title="Gerenciamento de Prioridades">
                        <Form layout="horizontal" size="small">
                            <Row>

                            <Col lg={4} md={6} sm={12} xs={24}>
                                <div className="gx-form-row0">
                                    <Form.Item label="Maquinas">
                                    <Select
                                        style={{ width: 400 }}
                                        showSearch
                                        placeholder="Filtrar por maquina"
                                        onChange={this.props.handleMaquina}
                                        filterOption={(inputValue, option) =>
                                            option.props.children[0]
                                            .concat(
                                                option.props.children[1],
                                                option.props.children[2]
                                            )
                                            .toUpperCase()
                                            .indexOf(inputValue.toUpperCase()) !== -1
                                        }
                                        >
                                        {listOfMaquinas.map((e) => {
                                            return (
                                            <Select.Option value={e.cod}>
                                                {e.cod}-{e.name}
                                            </Select.Option>
                                            );
                                        })}
                                    </Select>
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
                            </Col>

                            <Col lg={4} md={6} sm={12} xs={24}>
                                <div className="gx-form-row0">
                                    <Form.Item label="ID Pedido Venda">
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

                            <Col lg={4} md={6} sm={12} xs={24}>
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
                            <Col lg={4} md={6} sm={12} xs={24}>
                                <div className="gx-form-row0">
                                    <Form.Item label="Pedido Cliente" >
                                        <Input 
                                            type="text" 
                                            // style={{ width: 120 }}
                                            value={this.props.filtros.pedido_cliente}
                                            name="pedido_cliente"
                                            onChange={this.props.handleChange('pedido_cliente')}
                                            onKeyDown={this.props.onKeyDown}
                                        />
                                    </Form.Item>
                                </div>
                            </Col> */}

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

                            {/* <Col lg={4} md={6} sm={12} xs={24}>
                                <div className="gx-form-row0">
                                    <Form.Item label="Cliente" >
                                        <Input 
                                            type="text" 
                                            // style={{ width: 120 }}
                                            // value={orderPro.pedidoCliente}
                                            value={this.props.filtros.cliente}
                                            name="cliente"
                                            onChange={this.props.handleChange('cliente')}
                                            onKeyDown={this.props.onKeyDown}
                                        />
                                    </Form.Item>
                                </div>
                            </Col>

                            <Col lg={4} md={6} sm={12} xs={24}>
                                <div className="gx-form-row0">
                                    <Form.Item label="Status" >
                                        <Input 
                                            type="text" 
                                            // style={{ width: 120 }}
                                            // value={orderPro.pedidoCliente}
                                            value={this.props.filtros.status}
                                            name="status"
                                            onChange={this.props.handleChange('status')}
                                            onKeyDown={this.props.onKeyDown}
                                        />
                                    </Form.Item>
                                </div>
                            </Col>

                            <Col lg={4} md={6} sm={12} xs={24}>
                                <div className="gx-form-row0">
                                    <Form.Item label="Tipo registro" >
                                        <Input 
                                            type="text" 
                                            // style={{ width: 120 }}
                                            // value={orderPro.pedidoCliente}
                                            value={this.props.filtros.tipo_registro}
                                            name="tipo_registro"
                                            onChange={this.props.handleChange('tipo_registro')}
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

