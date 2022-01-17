import React, { Component } from 'react';
import {Row, Col, Card, Form, Input, message, Spin, Modal, Checkbox, Select} from 'antd'
import SimpleReactValidator from 'simple-react-validator';

export default class FormMatriz extends Component {
  constructor() {
    super();
    this.state = {
      record: {
        codigo: '',
        description: ''
      }
    };
    this.validator = new SimpleReactValidator({locale: 'pt', messages:{default: `:attribute não pode estar vazio`}});
  }
  render() {
    return (
      <div className="main">
        <Row>
            <Col span={24}>
                <Form layout="horizontal" size="small" >
                    <Card type="inner" title="Tabela de Haste / Camisa ">
                        <Row>
                            <Col lg={6} md={8} sm={12} xs={24} >
                                <div className="gx-form-row0">
                                    <Form.Item label="Código" required={true}>
                                      <Input 
                                          type="text" 
                                          value={this.state.record.codigo}
                                          name="cod"
                                          disabled={this.props.isNew ? false : true}
                                          // onChange={this.handleChange}
                                        />
                                        {this.validator.message('codigo', this.state.record.cod, 'required',{ className: 'text-danger' })}
                                    </Form.Item>
                                </div>
                            </Col>

                            <Col lg={12} md={12} sm={12} xs={24} >
                                <div className="gx-form-row0">
                                    <Form.Item label="Descrição"  required={true}>
                                      <Input 
                                          type="text" 
                                          value={this.state.record.description}
                                          name="description"
                                          disabled={this.props.isNew ? false : true}
                                          // onChange={this.handleChange}
                                          />
                                          {this.validator.message('description', this.state.record.description, 'required',{ className: 'text-danger' })}
                                    </Form.Item>
                                </div>
                            </Col>
                            <Col lg={6} md={8} sm={12} xs={24} >
                              <div className="gx-form-row0">
                                <Form.Item label="Tipo">
                                    <Select 
                                    // value={produtos.category === null ? "" : produtos.category } 
                                    // onChange={this.handleChange} 
                                    // style={{ width: 300 }} 
                                    defaultValue={1}
                                    >
                                      <Select.Option value={1}>Haste</Select.Option>
                                      <Select.Option value={2}>Camisa</Select.Option>
                                    </Select>
                                </Form.Item>
                              </div>
                          </Col>
                        </Row>
                    </Card>
                </Form>
            </Col>
        </Row>
    </div>
    );
  }
}
