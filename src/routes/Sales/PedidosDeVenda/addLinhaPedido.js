import React, {useRef} from 'react';
import SimpleReactValidator from 'simple-react-validator';
import {
  Modal,
  Card,
  Form,
  Col,
  Row,
  Select,
  DatePicker,
  Input,
  Button,
  Spin
} from 'antd';
//import moment from 'moment';

//import api from '../../../util/Api';
import locale from 'moment/locale/pt-br';
import { useForm, Controller } from "react-hook-form";
// import SimpleReactValidator from 'simple-react-validator';

let lodash = require("lodash"); 
const { Option } = Select;
const { TextArea } = Input;
//const model1 = 'orderprod'

function AddPedido (props) {

    const validator = useRef(new SimpleReactValidator({ messages: { default: `:attribute não pode estar vazio` }}));
    const { handleSubmit, control } = useForm();

    
    return (
        <Modal
        title="Adicionar linha Pedido Venda"
        visible={props.showAddALinhaPd}
        //onOk={ checkWichFunc}
        onCancel={props.onCancel}
        bodyStyle={{ padding: 0 }}
        confirmLoading={props.confirmLoading}
        width={1100}
        footer={[
          <Button key="back" onClick={props.onCancel}>
            Cancelar
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={props.confirmLoading}
            onClick={props.isNew === true && props.isEditingBeforeCreated === false ? (data) => handleSubmit(props.onOk(data, validator)) : 
              props.isEditingAfterCreated === true && props.isNew === false ? (data) => handleSubmit(props.EditLinPd(data, validator)) : 
              props.isNew === true && props.isEditingBeforeCreated === true ? (data) => handleSubmit(props.EditLinPdBeforeCreated(data, validator)) :
              props.isNew === false && props.isEditingAfterCreated === false ? (data) => handleSubmit(props.onOkLinhaPedidoAfter(data,validator)) : "" 
            }
          >
            Adicionar
          </Button>,
        ]}
      >
        <Card type="inner" title="Linhas Pedido de Venda">
        <Row>
        <Col span={24}>  
          <Row>
            <Col span={5}>
                <div className="gx-form-row0">
                    <Form.Item label="Linha Id">
                    <Input
                        type="text"
                        disabled={true}
                        value={props.linhaPd.id}
                      />
                    </Form.Item>
                </div>
              </Col>

              <Col span={5}>
                <div className="gx-form-row0">
                <Controller
                        name="lin_pedido_cliente"
                        control={control}
                        defaultValue={""}
                        as={
                          <Form.Item label="Pedido Cliente" >
                          <Input
                              type="text"
                              // style={{ width: 150 }}
                              value={props.linhaPd.lin_pedido_cliente}
                              min={0}
                              name="lin_pedido_cliente"
                              //onChange={this.props.onChange('qtdeApontada')}
                              onChange={props.onChange}
                            />
                          </Form.Item>
                        }
                      />
                </div>
              </Col>
              <Col span={5}>
                <div className="gx-form-row0">
                  <Controller
                      name="lin_pedido_fox"
                      control={control}
                      defaultValue={""}
                      as={
                          <Form.Item label="Pedido Fox" >
                          <Input
                              type="text"
                              // style={{ width: 150 }}
                              //value={this.props.apontamento.qtdeApontada}
                              value={props.linhaPd.lin_pedido_fox}
                              min={0}
                              name="lin_pedido_fox"
                              onChange={props.onChange}
                              //onChange={this.props.onChange('qtdeApontada')}
                              // onChange={this.handleChange}
                          />
                          </Form.Item>
                      }
                  />
                </div>
              </Col>

              <Col span={5}>
                <div className="gx-form-row0">
                <Controller
                      render={(props1) => (
                          <Form.Item
                      label="Data Entrega"
                      required={true}
                      >
                      <DatePicker
                          //value={this.state.dataAux}
                          {...props1}
                          value={props.linhaPd.data_entrega}
                          onChange={(date,dataString) => props.handleDatePicker(date, dataString, props1)}
                          locale={locale}
                          format={'DD-MM-YYYY'}
                          style={{ width: '100%' }}
                      />
                      {validator.current.message(
                            'Data Entrega',
                            props.linhaPd.data_entrega,
                            'required',
                            { className: 'text-danger' }
                      )}
                      </Form.Item>
                      
                      )}
                      control={control}
                      name="data_entrega"
                      defaultValue=""
                  />
                </div>
              </Col>

              <Col span={4}>
                <div className="gx-form-row0">
                <Controller
                      render={(props1) => (
                          <Form.Item
                      label="Data Prevista"
                      required={true}
                      >
                      <DatePicker
                          //value={this.state.dataAux}s
                          {...props1}
                          value={props.linhaPd.data_prevista}
                          onChange={(date,dataString) => props.handleDatePicker(date, dataString, props1)}
                          locale={locale}
                          format={'DD-MM-YYYY'}
                          style={{ width: '100%' }}
                      />
                      {validator.current.message(
                            'Data Prevista',
                            props.linhaPd.data_prevista,
                            'required',
                            { className: 'text-danger' }
                      )}
                      </Form.Item>
                      )}
                      control={control}
                      name="data_prevista"
                      defaultValue=""
                  />
                </div>
              </Col>

            </Row>

          <Row>
              <Col span={5}>
              <div className="gx-form-row0">
                  <Controller
                    name="product_id"
                    control={control}
                    defaultValue={""}
                    render={ (props1) => (
                    <Form.Item label="Produto">
                      <Select
                        {...props1}
                        value={props.linhaPd.product_id}
                        style={{ width: 205 }}
                        showSearch
                        notFoundContent={props.fetchingProduct ? <Spin size="small" /> : null}
                        onInputKeyDown={props.findSpeProduct}
                        onChange={(e) => props.handleSelect(e,props1)}
                        filterOption={(inputValue, option) =>
                          // console.log(inputValue)
                          option.props.children
                            .toUpperCase()
                            .indexOf(inputValue.toUpperCase()) !== -1
                        }
                      >
                        {props.listofProducts.map((e) => {
                          return (
                            <Option value={e.id}>
                              {e.cod}
                            </Option>
                          );
                        })}

                        {lodash.isEmpty(props.linhaPd.productObj) ?
                          "" : 
                          <Option value={props.linhaPd.productObj.id }>
                            {props.linhaPd.productObj.cod}
                          </Option>
                        }
                      </Select>
                    </Form.Item>
                    )   
                    }

                    
                  />
              </div>
              </Col>

              <Col span={5}>
                <div className="gx-form-row0">
                  <Controller
                  name="tipo_produto"
                  control={control}
                  defaultValue={""}
                  render={ (props1) => (<Form.Item label="Tipo Produto">
                    <Select
                      {...props1}
                      value={props.linhaPd.tipo_produto}
                      style={{ width: 205 }}
                      onChange={(e) => props.handleSelect(e,props1)}
                    >
                      <Option value={'produto'}>Produto</Option>
                      <Option value={'servico'}>Serviço</Option>
                    </Select>
                  </Form.Item>)
                    }
                  />
                </div>
              </Col>

              <Col span={5}>
                <div className="gx-form-row0">
                  <Form.Item label="Unidade" >
                      <Input
                          type="text"
                          value={props.linhaPd.unidade}
                          min={0}
                          name="unidade"
                          disabled={true}
                      />
                  </Form.Item>
                </div>
              </Col>
              

              <Col span={5}>
            <div className="gx-form-row0">
                <Controller
                  name="orderprod_id"
                  control={control}
                  defaultValue={""}
                  render={ (props1) => (
                  <Form.Item label="Ordem de Produção" >
                    <Select
                      {...props1}
                      value={props.linhaPd.orderprod_id}
                      style={{ width: 205 }}
                      showSearch
                      notFoundContent={props.fetchingProduct ? <Spin size="small" /> : null}
                      onInputKeyDown={props.findSpeOrderProd}
                      onChange={(e) => props.handleSelect(e,props1)}
                      filterOption={(inputValue, option) =>
                        // console.log(inputValue)
                        option.props.children
                          .toUpperCase()
                          .indexOf(inputValue.toUpperCase()) !== -1
                      }
                    >
                      {props.listOfOrders.map((e) => {
                        return (
                          <Option value={e.id}>
                            {e.orderProduction}
                          </Option>
                        );
                      })}

                      {lodash.isEmpty(props.linhaPd.orderprod) ?
                        "" : 
                        <Option value={props.linhaPd.orderprod.id}>
                          {props.linhaPd.orderprod.orderProduction}
                        </Option>
                      }
                    </Select>
                  </Form.Item>
                  )   
                  }
                />
            </div>
            </Col>

            <Col span={4}>
              <div className="gx-form-row0">
              <Controller
                    name="cfop"
                    control={control}
                    defaultValue={""}
                    as={
                        <Form.Item label="CFOP" >
                            <Input
                            type="number"
                            value={props.linhaPd.cfop}
                            min={0}
                            name="cfop"
                            onChange={props.onChange}
                            />
                        </Form.Item>
                    }
                />
              </div>
            </Col>

            </Row>

          <Row>
            <Col span={5}>
              <div className="gx-form-row0">
              <Controller
                    name="qty_produzida"
                    control={control}
                    defaultValue={""}
                    as={
                        <Form.Item label="Quantidade Produzida" >
                            <Input
                                type="number"
                                value={props.linhaPd.qty_produzida}
                                min={0}
                                name="qty_produzida"
                                onChange={props.onChange}
                            />
                        </Form.Item>
                    }
                />
              </div>
            </Col>

            <Col span={5}>
              <div className="gx-form-row0">
              <Controller
                    name="Produto Cliente"
                    control={control}
                    defaultValue={""}
                    as={
                        <Form.Item label="Produto Cliente" >
                            <Input
                                type="text"
                                value={props.linhaPd.produto_cliente}
                                min={0}
                                name="produto_cliente"
                                onChange={props.onChange}
                            />
                        </Form.Item>
                    }
                />
              </div>
            </Col>
            </Row>

          <Row>
            <Col span={15}>
                <div className="gx-form-row0">
                <Controller
                      name="obs"
                      control={control}
                      defaultValue={""}
                      as={
                          <Form.Item label="Observação" >
                          <TextArea
                              type="text"
                              name="obs"
                              value={props.linhaPd.obs}
                              onChange={props.onChange}
                              style={{ width: '500px' }}
                              autoSize={{ minRows: 3, maxRows: 7 }}
                          />
                          </Form.Item>
                      }
                  />
                </div>
              </Col>
          </Row>
        </Col>
        </Row>    
        </Card>
      </Modal>
    )
}
export default AddPedido;
