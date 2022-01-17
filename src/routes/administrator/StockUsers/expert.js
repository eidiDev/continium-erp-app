import React, { Component } from 'react';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Button,
  message,
  Modal,
  Spin,
  Select,
  Checkbox,
  Table
} from 'antd';
//Collapse
import history from '../../../util/history';
import ListUsers from './ListUsers';
import api from '../../../util/ApiAdonisWeb';
import './maktorTemplate.less';
//const { DateTime } = require("luxon");

const moment = require('moment-timezone');
const moment1 = require('moment');
const { Option } = Select;

// const FormItem = Form.item
const model = 'consultastock';

// const customPanelStyle = {
//     borderRadius: 4,
//     border: 0,
//     overflow: 'hidden',
// };

// const menu = (
// 	<Menu>
// 	  <Menu.Item key="1">Imprimir</Menu.Item>
// 	  <Menu.Item key="2">Anexos</Menu.Item>
// 	</Menu>
// );

class UsersExpert extends Component {
  constructor() {
    super();
    this.state = {
      isNew: true,
      loader: true,
      user: {
        ativo: false,
        showPrice: false,
      },
      groups: [],
      checkListSelect: [],
      canNew: true,
      canSave: true,
      canDelete: false,
      loading: false,
      showInputLimit: false
    };

    this.columns = [
      {
        title: 'Dia',
        dataIndex: 'created_at',
        render: text => {

          var dataUtc = moment.utc(text);
          return moment.tz(dataUtc, moment.tz.guess()).format('DD-MM-YYYY');

        }
      },
      {
        title: 'Hora',
        dataIndex: 'created_at',
        render: text => {

          return moment.tz(text, moment.tz.guess()).format('HH:mm:ss');
          //return moment(text).tz('America/Sao_Paulo').format('DD-MM-YYYY HH:mm')
        }
      },
      {
        title: 'Produto Consultado',
        dataIndex: 'produto_consultado',
      },
    ]
    this.handleChange = this.handleChange.bind(this);
    this.setStateNew = this.setStateNew.bind(this);
    this.onHandleClickSave = this.onHandleClickSave.bind(this);

    this.onHandleClickDelete = this.onHandleClickDelete.bind(this);
    this.onHandleClickNew = this.onHandleClickNew.bind(this);
    // this.handleSubmit = this.handleSubmit.bind(this);

    this.leftListChild = React.createRef();
  }

  componentDidMount() {
    api
      .get(`getGrouposFox`, {})
      .then((result) => {
        //Caso consiga recuperar o model, ele atualiza a tela e para de carregar
        // console.log(result.data.adresses);
        this.setState({
          groups: result.data
        })
        //parent.setStateEdit(result.data);
      })
      .catch(function (error) {
        // console.log(error);
        message.error('Erro ao buscar registro, tente novamente mais tarde!');
        //parent.setStateNew();
      });
  }

  onHandleClickNew = () => {
    this.setStateNew();
  };

  handleOnClickRow1 = (record, rowIndex) => {
    var parent = this;
    //Primeria coisa ele seta loading para true
    this.setState({
      loading: true,
      loadingTip: 'Carregando registro, aguarde...',
    });

    //Coloquei esse timeout de 1 segundo para simular o carregamento
    setTimeout(function () {
      //Agora ele vai buscar o registro no servidor
      api
        .get(`${model}/${record.id}`, {})
        .then((result) => {
          //Caso consiga recuperar o model, ele atualiza a tela e para de carregar
          // console.log(result.data.adresses);
          // console.log(result.adresses);
          message.success('Usuario carregada com sucesso!');
          parent.setStateEdit(result.data);
        })
        .catch(function (error) {
          // console.log(error);
          message.error('Erro ao buscar registro, tente novamente mais tarde!');
          parent.setStateNew();
        });
    }, 1000);
  };

  onHandleClickSave = () => {
    // console.log(this.state.model);
    let record = this.state.user;
    var parent = this;

    let listacheck = this.state.checkListSelect;
    this.setState({
      loading: true,
      loadingTip: 'Salvando registro, aguarde...',
    });
    // console.log('vai tentar gravar',record)
    setTimeout(function () {
      //Verifica se é uma atualizacao (PUT) ou novo registro (POST)
      let METHOD = 'PATCH';
      let URL = `${model}/${record.id}`;

      if (parent.state.isNew) {
        METHOD = 'POST';
        // URL = `${model}`
        URL = `${model}`;

        // record = Object.assign({},record)
      }
      // console.log('onHandleSaveButton', record);
      const { username, nome, sobrenome, senha, ativo, showPrice, qty_show, limiteAcesso } = record;

      api({
        method: METHOD,
        url: URL,
        data: {
          groups_grants: JSON.stringify(listacheck) ,
          nome: nome,
          sobrenome: sobrenome,
          username: username,
          senha: senha,
          ativo: ativo,
          limiteAcesso: parseInt(limiteAcesso),
          showPrice: showPrice,
          qty_show: qty_show
        },
      })
        .then((result) => {
          //Caso consiga recuperar o model, ele atualiza a tela e para de carregar
          message.success('Usuario salvo com sucesso!');
          // console.log(result.data);
          parent.setStateEdit(result.data);
          parent.leftListChild.current.fetchLeftList();
        })
        .catch(function (error) {
          // console.log(error);
          parent.setStateEdit(record);
          message.error('Erro ao gravar registro, tente novamente mais tarde!');
        });
    }, 1000);
  };

  onCancel = () => {
    history.replace('/dashboard');
    document.location.reload(true);
  };

  onHandleClickDelete = () => {
    // console.log(this.state.model);
    let record = this.state.user;
    var parent = this;

    Modal.confirm({
      title: 'Tem certeza que deseja excluir esse registro?',
      onOk() {
        parent.setState({
          loading: true,
          loadingTip: 'Excluindo registro, aguarde...',
        });
        setTimeout(function () {
          //Agora ele vai buscar o registro no servidor
          let METHOD = 'DELETE';
          let URL = `${model}/${record.id}`;
          api({
            method: METHOD,
            url: URL,
          })
            .then((result) => {
              //Caso consiga recuperar o model, ele atualiza a tela e para de carregar
              message.success('Registro excluido com sucesso!');
              parent.setStateNew();
              parent.leftListChild.current.fetchLeftList();
            })
            .catch(function (error) {
              // console.log(error);
              message.error(
                'Erro ao excluir registro, tente novamente mais tarde!'
              );
            });
        }, 1000);
        parent.setStateNew();
      },
      onCancel() {
        //Nada acontece
      },
    });
  };

  setStateNew = () => {
    this.setState({
      canSave: true,
      canNew: true,
      canDelete: false,
      user: {},
      checkListSelect:[],
      loading: false,
      isNew: true,
      refreshLeftList: false,
      showInputLimit: false
    });
  };

  //Seta o estado para edição
  setStateEdit = (model) => {
    // console.log(model);
    let checkList = model.groups_grants
    let aux = model.qty_show === 'limitado' ? true : false

    this.setState({
      canSave: true,
      canNew: true,
      canDelete: true,
      user: model,
      checkListSelect:checkList,
      loading: false,
      showInputLimit: aux,
      isNew: false,
    });
  };

  handleChange = (event) => {
    let newUser = this.state.user;
    newUser[event.target.name] = event.target.value;

    this.setState(() => ({
      user: newUser,
    }));
  };

  LeftList = () => {
    return (
      <ListUsers onClickRow={this.handleOnClickRow1} ref={this.leftListChild} />
    );
  };

  handleTip = (event) => {
    let newUser = this.state.user;
    newUser['qty_show'] = event;
    this.setState({
      user: newUser,
    });

    if (event === 'limitado') {
      this.setState({
        showInputLimit: true
      })
    } else {
      this.setState({
        showInputLimit: false
      })
    }
  };

  handleTip2 = (event) => {
    this.setState({
      checkListSelect: event,
    });
  };

  onChangeCheck1 = (event) => {
    let newCateg = this.state.user;
    newCateg['ativo'] = event.target.checked;
    this.setState({
      user: newCateg,
    });
  };

  onChangeCheck2 = (event) => {
    let newCateg = this.state.user;
    newCateg['showPrice'] = event.target.checked;
    this.setState({
      user: newCateg,
    });
  };

  Content = (user) => {
    return (
      <div className="main">
        <Row>
          <Col span={24}>
            <Form layout="horizontal" size="small">
              <Card type="inner" title="Stock Usuários">
                <Row>
                  <Col lg={6} md={8} sm={12} xs={24}>
                    <div className="gx-form-row0">
                      <Form.Item label="Nome">
                        <Input
                          type="text"
                          value={user.nome}
                          name="nome"
                          onChange={this.handleChange}
                        />
                      </Form.Item>
                    </div>
                  </Col>

                  <Col lg={6} md={8} sm={12} xs={24}>
                    <div className="gx-form-row0">
                      <Form.Item label="Sobrenome">
                        <Input
                          type="text"
                          value={user.sobrenome}
                          name="sobrenome"
                          onChange={this.handleChange}
                        />
                      </Form.Item>
                    </div>
                  </Col>

                  <Col lg={6} md={8} sm={12} xs={24}>
                    <div className="gx-form-row0">
                      <Form.Item label="Usuário">
                        <Input
                          type="text"
                          value={user.username}
                          name="username"
                          onChange={this.handleChange}
                        />
                      </Form.Item>
                    </div>
                  </Col>

                  <Col lg={6} md={8} sm={12} xs={24}>
                    <div className="gx-form-row0">
                      <Form.Item label="Senha">
                        <Input
                          type="password"
                          value={user.senha}
                          name="senha"
                          onChange={this.handleChange}
                        />
                      </Form.Item>
                    </div>
                  </Col>
                </Row>

                <Row>
                  <Col lg={6} md={8} sm={12} xs={24}>
                    <div className="gx-form-row0">
                      <Form.Item label="Ativo">
                        <Checkbox
                          checked={this.state.user.ativo}
                          onChange={this.onChangeCheck1}
                        ></Checkbox>
                      </Form.Item>
                    </div>
                  </Col>

                  <Col lg={6} md={8} sm={12} xs={24}>
                      <div className="gx-form-row0">
                        <Form.Item label="Mostrar Preço">
                          <Checkbox
                            checked={this.state.user.showPrice}
                            onChange={this.onChangeCheck2}
                          ></Checkbox>
                        </Form.Item>
                      </div>
                    </Col>
                </Row>

                <Row>
                  <Col lg={9} md={8} sm={12} xs={24}>
                    <div className="gx-form-row0">
                      <Form.Item label="Quantidade de registros por dia">
                        <Select
                          value={user.qty_show}
                          style={{ width: 200 }}
                          onChange={this.handleTip}
                        >
                          <Option value={'ilimitado'}>Ilimitado</Option>
                          <Option value={'limitado'}>Limitado</Option>
                        </Select>
                      </Form.Item>
                    </div>
                  </Col>

                  {
                    this.state.showInputLimit === true ?
                      <Col lg={6} md={8} sm={12} xs={24}>
                        <div className="gx-form-row0">
                          <Form.Item label="Registros">
                            <Input
                              type="text"
                              value={user.limiteAcesso}
                              name="limiteAcesso"
                              onChange={this.handleChange}
                            />
                          </Form.Item>
                        </div>
                      </Col>
                      :
                      ""
                  }

                </Row>
                <Row>
                  <Col lg={6} md={8} sm={12} xs={24}>
                    <div className="gx-form-row0">
                      <Form.Item label="Grupos">
                        <Select
                          mode='multiple'
                          style={{ width: 200 }}
                          onChange={this.handleTip2}
                          value={this.state.checkListSelect === null ? [] : this.state.checkListSelect }
                          >
                          {
                            this.state.groups.map(gp => {
                              return <Option value={gp.Código}>{gp.Descrição}</Option>
                            })
                          }
                        </Select>
                      </Form.Item>
                    </div>
                  </Col>
                </Row>
                <Row>

                </Row>
              </Card>

              <Card type="inner" title="Logs">
                <Table
                  className="gx-table-responsive"
                  dataSource={this.state.user.logs}
                  size="small"
                  rowKey="id"
                  style={{ margin: '-15px -24px' }}
                  columns={this.columns}
                />
              </Card>

            </Form>
          </Col>
        </Row>
      </div>
    );
  };

  render() {
    return (
      <Spin spinning={this.state.loading} tip={this.state.loadingTip}>
        <Row>
          <Col lg={5} md={5} sm={24} xs={24}>
            {this.LeftList()}
          </Col>

          <Col lg={15} md={15} sm={24} xs={24}>
            {this.Content(this.state.user)}
          </Col>

          <Col lg={4} md={4} sm={24} xs={24}>
            <Card className="gx-card" title="Stock Usuários">
              <Button
                block
                type="primary"
                className="gx-btn-secondary"
                disabled={!this.state.canNew}
                onClick={this.onHandleClickNew}
              >
                Novo
              </Button>
              <Button
                block
                type="primary"
                onClick={this.onHandleClickSave}
                disabled={!this.state.canSave}
              >
                Salvar
              </Button>
              <br />
              <Button
                block
                disabled={!this.state.canDelete}
                type="primary"
                onClick={this.onHandleClickDelete}
                className="gx-btn-red"
              >
                Excluir
              </Button>
            </Card>
          </Col>
        </Row>
      </Spin>
    );
  }
}

export default UsersExpert;
