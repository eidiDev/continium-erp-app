import React from 'react';
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
} from 'antd';
import moment from 'moment';
// import SimpleReactValidator from 'simple-react-validator';

const { Option } = Select;

class AddApontamento extends React.Component {
  constructor(props) {
    super(props);
    console.log(props.listofMachines);
  }
  componentWillReceiveProps() {}

  render() {
    // const etapas = this.props.listofMachines.filter(
    //   (item) => item.type !== 'maoDeObra'
    // );

    const etapas = this.props.listaEtapas;

    const colaboradores = this.props.listofMachines.filter(
      (item) => item.type === 'maoDeObra'
    );

    return (
      <Modal
        title="Adicionar apontamento"
        visible={this.props.showAddApontamento}
        onOk={this.props.onOk}
        onCancel={this.props.onCancel}
        bodyStyle={{ padding: 0 }}
        confirmLoading={this.props.confirmLoading}
        footer={[
          <Button key="back" onClick={this.props.onCancel}>
            Cancelar
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={this.props.confirmLoading}
            onClick={this.props.onOk}
          >
            Adicionar
          </Button>,
        ]}
      >
        <Card type="inner" title="Apontamento">
          <Row>
            <Col span={12}>
              <div className="gx-form-row0">
                <Form.Item label="Etapa" required={true}>
                  <Select
                    style={{ width: '100%' }}
                    value={this.props.apontamento.etapa}
                    name="etapa"
                    // onChange={this.props.onChange}
                    onChange={this.props.onChange('etapa')}
                  >
                    <Option value="">Selecione</Option>
                    <Option value="Pausa">Pausa</Option>
                    {etapas.map((item) => {
                      return (
                        <Option value={item.id}>
                          {item.codEtapas}
                        </Option>
                      );
                    })}
                  </Select>
                  {/* {this.validator.message('establishments', orderPro.establishment, 'required|alpha_num',{ className: 'text-danger' })} */}
                </Form.Item>
              </div>
            </Col>
            <Col span={12}>
              <div className="gx-form-row0">
                <Form.Item label="Tipo de operação" required={true}>
                  <Select
                    style={{ width: '100%' }}
                    value={this.props.apontamento.tipo}
                    name="tipo"
                    onChange={this.props.onChange('tipo')}
                  >
                    <Option value="">Selecione uma etapa</Option>
                    <Option value="pausar">Pausa</Option>
                    <Option value="programar">Programando</Option>
                    <Option value="operar">Operando</Option>
                  </Select>
                  {/* {this.validator.message('establishments', orderPro.establishment, 'required|alpha_num',{ className: 'text-danger' })} */}
                </Form.Item>
              </div>
            </Col>
            <Col span={24}>
              <div className="gx-form-row0">
                <Form.Item label="Colaborador" required={true}>
                  <Select
                    style={{ width: '100%' }}
                    value={this.props.apontamento.colaborador}
                    name="colaborador"
                    onChange={this.props.onChange('colaborador')}
                  >
                    <Option value="">Selecione</Option>
                    {colaboradores.map((item) => {
                      return (
                        <Option value={item.id}>
                          {item.cod} - {item.name}
                        </Option>
                      );
                    })}
                  </Select>
                  {/* {this.validator.message('establishments', orderPro.establishment, 'required|alpha_num',{ className: 'text-danger' })} */}
                </Form.Item>
              </div>
            </Col>
            <Col span={12}>
              <div className="gx-form-row0">
                <Form.Item label="Data\Hora inicio" required={true}>
                  <DatePicker
                    showTime={{ format: 'HH:mm' }}
                    format="DD/MM/YYYY HH:mm"
                    placeholder={'Data/hora inicio'}
                    defaultValue={moment()}
                    // value={this.props.apontamento.horainicio}
                    name="dataInicio"
                    onOk={this.props.onChange('dataInicio')}
                    onChange={this.props.onChange('dataInicio')}
                  />
                  {/* {this.validator.message('establishments', orderPro.establishment, 'required|alpha_num',{ className: 'text-danger' })} */}
                </Form.Item>
              </div>
            </Col>
            <Col span={12}>
              <div className="gx-form-row0">
                <Form.Item label="Data\Hora fim" required={true}>
                  <DatePicker
                    showTime={{ format: 'HH:mm' }}
                    format="DD/MM/YYYY HH:mm"
                    placeholder={'Data/hora fim'}
                    defaultValue={moment()}
                    // value={this.props.apontamento.horafim}
                    name="dataFim"
                    onChange={this.props.onChange('dataFim')}
                    onOk={this.props.onChange('dataFim')}
                  />
                  {/* {this.validator.message('establishments', orderPro.establishment, 'required|alpha_num',{ className: 'text-danger' })} */}
                </Form.Item>
              </div>
            </Col>
            <Col span={12}>
              <div className="gx-form-row0">
                <Form.Item label="Quantidade apontada" required={true}>
                  <Input
                    type="number"
                    // style={{ width: 150 }}
                    value={this.props.apontamento.qtdeApontada}
                    min={0}
                    name="qtdeApontada"
                    onChange={this.props.onChange('qtdeApontada')}
                    // onChange={this.handleChange}
                  />
                  {/* {this.validator.message('establishments', orderPro.establishment, 'required|alpha_num',{ className: 'text-danger' })} */}
                </Form.Item>
              </div>
            </Col>
          </Row>
        </Card>
      </Modal>
    );
  }
}
export default AddApontamento;
