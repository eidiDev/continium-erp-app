import React from 'react';
import { Modal, Card, Form, Col, Row, Select, Input, Button } from 'antd';
import api from 'util/Api';
// import SimpleReactValidator from 'simple-react-validator';

const { Option } = Select;

class AddEtapa extends React.Component {
  constructor(props) {
    super();
    this.state = {
      listofEtapas: [],
      jsonEtapa: {
        etapa: '',
        maquina: '',
        tempoMaquina: '',
        programador: '',
        tempoProgramador: '',
        operador: '',
        tempoOperador: '',
        montagem: '',
        tempoMontagem: '',
      },
      stepXprod: {
        status: false,
        etapa: 1,
        product: '',
      },
    };

    api
      .get(`stepprocess/`, {})
      .then((result) => {
        this.setState({
          listofEtapas: result.data.data,
        });
      })
      .catch(function (error) {
        console.log(error);
      });

    this.handleEtapas = this.handleEtapas.bind(this);
    this.handleChangeTime = this.handleChangeTime.bind(this);
  }

  handleEtapas(selectedId) {
    let listOfEtapas = this.state.listofEtapas;
    let newstepXprod = this.state.jsonEtapa;

    listOfEtapas.map((obj) => {
      if (obj.id === selectedId) {
        newstepXprod['etapa'] = obj.id;
        newstepXprod['maquina'] = obj.generaldata.codMaquina;
        newstepXprod['tempoMaquina'] = obj.generaldata.tempXqtdMaquina;
        newstepXprod['programador'] = obj.generaldata.codProgramador
          ? obj.generaldata.codProgramador +
            ' - ' +
            obj.generaldata.descProgramador
          : '';
        newstepXprod['tempoProgramador'] = obj.generaldata.tempoProgramador;
        newstepXprod['operador'] = obj.generaldata.codOperador
          ? obj.generaldata.codOperador + ' - ' + obj.generaldata.descOperador
          : '';
        newstepXprod['tempoOperador'] = obj.generaldata.tempoOperador;
        newstepXprod['montagem'] = obj.generaldata.codMontagem;
        newstepXprod['tempoMontagem'] = obj.generaldata.tempoMontagem;

        this.setState({
          jsonEtapa: newstepXprod,
        });
      }

      return '';
    });
  }

  handleChangeTime(event) {
    let { jsonEtapa } = this.state;
    jsonEtapa[event.target.name] = event.target.value;

    this.setState(() => ({ jsonEtapa }));
  }

  onOk = () => {
    //Vai perarar os dados para retornar
    console.log(this.state.listofEtapas);
    let obj = this.state.jsonEtapa;

    let objlista = {
      etapas: obj.etapa,
      statusEtapa: 'planejada',
      maquina: obj.maquina,
      tempoMaquina: obj.tempoMaquina,
      programador: obj.programador,
      tempoProgramador: obj.tempoProgramador,
      operador: obj.operador,
      tempoOperador: obj.tempoOperador,
      montagem: obj.montagem,
      tempoMontagem: obj.tempoMontagem,
    };

    // eslint-disable-next-line
    this.state.listofEtapas.map((m) => {
      if (m.id === obj.etapa) {
        objlista['etapas'] = m.cod + ' - ' + m.description;
      }
    });

    //chama o OnOK do props;
    this.props.onOk(objlista);
  };

  componentDidMount() {}

  componentWillReceiveProps() {}

  render() {
    const { listofEtapas } = this.state;
    return (
      <Modal
        title="Adicionar etapa"
        visible={this.props.showAddEtapa}
        onOk={this.onOk}
        onCancel={this.props.onCancel}
        bodyStyle={{ padding: 0 }}
        width="65%"
        confirmLoading={this.props.confirmLoading}
        footer={[
          <Button key="back" onClick={this.props.onCancel}>
            Cancelar
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={this.props.confirmLoading}
            onClick={this.onOk}
          >
            Adicionar
          </Button>,
        ]}
      >
        <Card type="inner">
          <Row>
            <Col lg={24} md={24} sm={24} xs={24}>
              <div className="gx-form-row0">
                <Form.Item label="Etapa">
                  <Select
                    showSearch
                    value={this.state.jsonEtapa.etapa}
                    onChange={this.handleEtapas}
                    placeholder="Selecione uma etapa"
                    style={{ width: 400 }}
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
                    {listofEtapas.map((e) => {
                      return (
                        <Option value={e.id}>
                          {e.cod}-{e.description}
                        </Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              </div>
            </Col>
            <Col lg={6} md={6} sm={12} xs={24}>
              <div className="gx-form-row0">
                <Form.Item label="Maquina">
                  <Input value={this.state.jsonEtapa.maquina} disabled={true} />
                </Form.Item>
              </div>
            </Col>
            <Col lg={6} md={6} sm={12} xs={24}>
              <div className="gx-form-row0">
                <Form.Item label="Tempo (min)">
                  <Input
                    value={this.state.jsonEtapa.tempoMaquina}
                    disabled={!this.state.jsonEtapa.maquina}
                    type="number"
                    name="tempoMaquina"
                    min={1}
                    onChange={this.handleChangeTime}
                  />
                </Form.Item>
              </div>
            </Col>
            <Col lg={6} md={6} sm={12} xs={24}>
              <div className="gx-form-row0">
                <Form.Item label="Programador">
                  <Input
                    value={this.state.jsonEtapa.programador}
                    disabled={true}
                  />
                </Form.Item>
              </div>
            </Col>
            <Col lg={6} md={6} sm={12} xs={24}>
              <div className="gx-form-row0">
                <Form.Item label="Tempo (min)">
                  <Input
                    value={this.state.jsonEtapa.tempoProgramador}
                    disabled={!this.state.jsonEtapa.programador}
                    type="number"
                    name="tempoProgramador"
                    min={1}
                    onChange={this.handleChangeTime}
                  />
                </Form.Item>
              </div>
            </Col>
            <Col lg={6} md={6} sm={12} xs={24}>
              <div className="gx-form-row0">
                <Form.Item label="Operador">
                  <Input
                    value={this.state.jsonEtapa.operador}
                    disabled={true}
                  />
                </Form.Item>
              </div>
            </Col>
            <Col lg={6} md={6} sm={12} xs={24}>
              <div className="gx-form-row0">
                <Form.Item label="Tempo (min)">
                  <Input
                    value={this.state.jsonEtapa.tempoOperador}
                    disabled={
                      !this.state.jsonEtapa.operador ||
                      this.state.jsonEtapa.operador === '-'
                    }
                    type="number"
                    name="tempoOperador"
                    min={1}
                    onChange={this.handleChangeTime}
                  />
                </Form.Item>
              </div>
            </Col>
            <Col lg={6} md={6} sm={12} xs={24}>
              <div className="gx-form-row0">
                <Form.Item label="Montagem">
                  <Input
                    value={this.state.jsonEtapa.montagem}
                    disabled={true}
                  />
                </Form.Item>
              </div>
            </Col>
            <Col lg={6} md={6} sm={12} xs={24}>
              <div className="gx-form-row0">
                <Form.Item label="Tempo (min)">
                  <Input
                    value={this.state.jsonEtapa.tempoMontagem}
                    disabled={!this.state.jsonEtapa.montagem}
                    type="number"
                    name="tempoMontagem"
                    min={1}
                    onChange={this.handleChangeTime}
                  />
                </Form.Item>
              </div>
            </Col>
          </Row>
          {/* <Row>
            <Col lg={6} md={6} sm={12} xs={24}>
              <div className="gx-form-row0">
                <Button
                  type="primary"
                  htmlType="submit"
                  disabled={false}
                  // onClick={this.handleAdd}
                >
                  Adicionar Etapa
                </Button>
              </div>
            </Col>
          </Row> */}
        </Card>
      </Modal>
    );
  }
}
export default AddEtapa;
