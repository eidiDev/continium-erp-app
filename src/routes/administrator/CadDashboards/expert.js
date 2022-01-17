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
  Table,
  Select,
} from 'antd';
import history from '../../../util/history';
import ListTaxaHora from './ListDashboards';
import api from '../../../util/Api';
import '../Users/maktorTemplate.less';

var _ = require('lodash');
const { Option } = Select;
const model = 'Dashboards';

class CadDashboardsexpert extends Component {
  constructor() {
    super();
    this.state = {
      isNew: true,
      loader: true,
      user: {},
      canNew: true,
      canSave: true,
      canDelete: false,
      loading: false,
      listofMaquinas: [],
      tableList: [],
      jsonMaquinaAdd: {
        id: '',
      },
    };
    let auxthis = this;
    this.columns = [
      {
        title: 'Codigo',
        dataIndex: 'cod',
      },
      {
        title: 'Nome',
        dataIndex: 'name',
      },
      {
        title: 'Taxa Hora',
        dataIndex: 'ratetime',
      },
      {
        title: 'Ações',
        key: 'action',
        render: (text, record) => (
          <div>
            <i
              className="icon icon-trash"
              style={{ marginRight: '10px' }}
              onClick={(e) => {
                Modal.confirm({
                  title: 'Tem certeza que deseja remover esta maquina?',
                  onOk() {
                    auxthis.handleDeleteAddressRow(record.id, e);
                    message.success('Maquina removida');
                  },
                  onCancel() {},
                });
              }}
            />
          </div>
        ),
      },
    ];

    this.handleChange = this.handleChange.bind(this);
    this.setStateNew = this.setStateNew.bind(this);
    this.onHandleClickSave = this.onHandleClickSave.bind(this);

    this.onHandleClickDelete = this.onHandleClickDelete.bind(this);
    this.onHandleClickNew = this.onHandleClickNew.bind(this);
    // this.handleSubmit = this.handleSubmit.bind(this);

    this.leftListChild = React.createRef();
  }

  componentWillMount() {
    this.getMaquinas();
  }

  getMaquinas = () => {
    api
      .get(`MachineLabor/?limit=999`, {})
      .then((result) => {
        let dataMaq = [];
        dataMaq = result.data;

        let taxMaquinas = _.filter(dataMaq, (o) => {
          return o.type === 'maquina' || 'montagem';
        });
        this.setState({
          listofMaquinas: taxMaquinas,
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  onHandleClickNew = () => {
    this.setStateNew();
  };

  handleDeleteAddressRow(key, e) {
    e.preventDefault();
    const list = this.state.tableList.filter((item) => item.id !== key);
    this.setState({
      tableList: list,
    });
  }

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
          message.success('Dashboard carregada com sucesso!');
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

    let listaDeMaquinasSelected = this.state.tableList;

    this.setState({
      loading: true,
      loadingTip: 'Salvando registro, aguarde...',
    });
    //Verifica se é uma atualizacao (PUT) ou novo registro (POST)
    let METHOD = 'PATCH';
    let URL = `${model}/${record.id}`;

    if (parent.state.isNew) {
      METHOD = 'POST';
      URL = `${model}`;
      // record = Object.assign({},record)
    }
    // console.log('onHandleSaveButton', record);
    const { cod, desc } = record;
    api({
      method: METHOD,
      url: URL,
      data: {
        cod: cod,
        desc: desc,
        listofMaquinas: listaDeMaquinasSelected,
      },
    })
      .then((result) => {
        //Caso consiga recuperar o model, ele atualiza a tela e para de carregar
        message.success('Dashboard salvo com sucesso!');
        // console.log(result.data);
        parent.setStateEdit(result.data);
        parent.leftListChild.current.fetchLeftList();
      })
      .catch(function (error) {
        // console.log(error);
        parent.setStateEdit(record);
        message.error('Erro ao gravar registro, tente novamente mais tarde!');
      });
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
      loading: false,
      isNew: true,
      tableList: [],
      jsonMaquinaAdd: {
        id: '',
      },
    });
  };

  //Seta o estado para edição
  setStateEdit = (model) => {
    this.setState({
      canSave: true,
      canNew: true,
      canDelete: true,
      user: model,
      loading: false,
      isNew: false,
      tableList: model.machines,
      jsonMaquinaAdd: {
        id: '',
      },
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
      <ListTaxaHora
        onClickRow={this.handleOnClickRow1}
        ref={this.leftListChild}
      />
    );
  };

  handleMaquina = (event) => {
    let auxList = this.state.listofMaquinas;
    let obj = {};

    for (const iterator of auxList) {
      if (event === iterator.id) {
        obj = iterator;
      }
    }

    this.setState({
      jsonMaquinaAdd: obj,
    });
  };

  handleAdd = () => {
    let lista = this.state.tableList;
    let obj = this.state.jsonMaquinaAdd;
    let last = lista[lista.length - 1];

    let objlista = obj;
    if (lista.length === 0) {
      objlista['key'] = 0;
    } else {
      objlista['key'] = last.key + 1;
    }

    lista.push(objlista);
    this.setState({
      tableList: lista,
    });
    message.success('Maquina adicionada !');
  };

  Content = (user) => {
    return (
      <div className="main">
        <Row>
          <Col span={24}>
            <Form layout="horizontal" size="small">
              <Card type="inner" title="Cadastro de Dashboards">
                <Row>
                  <Col lg={6} md={8} sm={12} xs={24}>
                    <div className="gx-form-row0">
                      <Form.Item label="Código">
                        <Input
                          type="text"
                          value={user.cod}
                          name="cod"
                          disabled={this.state.isNew ? false : true}
                          onChange={this.handleChange}
                        />
                      </Form.Item>
                    </div>
                  </Col>

                  <Col lg={6} md={8} sm={12} xs={24}>
                    <div className="gx-form-row0">
                      <Form.Item label="Descrição">
                        <Input
                          type="text"
                          value={user.desc}
                          name="desc"
                          onChange={this.handleChange}
                        />
                      </Form.Item>
                    </div>
                  </Col>
                </Row>
              </Card>

              <Card type="inner" title="Maquinas">
                <Table
                  className="gx-table-responsive"
                  dataSource={this.state.tableList}
                  size="small"
                  rowKey="id"
                  style={{ margin: '-15px -24px' }}
                  columns={this.columns}
                />
              </Card>

              <Card type="inner" title="Adicionar Maquinas">
                <Row>
                  <Col lg={6} md={6} sm={12} xs={24}>
                    <div className="gx-form-row0">
                      <Form.Item label="Maquinas">
                        <Select
                          style={{ width: 400 }}
                          showSearch
                          value={this.state.jsonMaquinaAdd.id}
                          onChange={this.handleMaquina}
                          filterOption={(inputValue, option) =>
                            // console.log(inputValue)
                            option.props.children[0]
                              .concat(
                                option.props.children[1],
                                option.props.children[2]
                              )
                              .toUpperCase()
                              .indexOf(inputValue.toUpperCase()) !== -1
                          }
                        >
                          {this.state.listofMaquinas.map((e) => {
                            return (
                              <Option value={e.id}>
                                {e.cod}-{e.name}
                              </Option>
                            );
                          })}
                        </Select>
                      </Form.Item>
                    </div>
                  </Col>
                </Row>
                <br />
                <br />
                <Row>
                  <Col lg={6} md={6} sm={12} xs={24}>
                    <div className="gx-form-row0">
                      <Button
                        type="primary"
                        htmlType="submit"
                        disabled={false}
                        onClick={this.handleAdd}
                      >
                        Adicionar Maquina
                      </Button>
                    </div>
                  </Col>
                </Row>
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
            <Card type="inner" title="Dashboards">
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

export default CadDashboardsexpert;
