import React, { Component } from 'react';
import {
  Row,
  Col,
  Button,
  Card,
  Form,
  Input,
  message,
  Spin,
  Modal,
  Checkbox,
  Select,
  Table,
} from 'antd';
import history from '../../../util/history';
import SimpleReactValidator from 'simple-react-validator';
import ListofStepXprods from './ListStepProd';
import RightList from '../../../components/RightList';
import api from '../../../util/Api';

const { Option } = Select;
const model = 'stepxprod';
const model2 = 'establishment';
const model3 = 'product';
const model4 = 'stepprocess';
const model5 = 'machinelabor';

class etapaXprod extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
      isNew: true,
      loader: true,
      stepXprod: {
        status: false,
        establishment: 1,
        product: '',
      },
      canNew: true,
      canSave: true,
      canDelete: false,
      loading: false,
      listofEstabs: [],
      listofProds: [],
      listofEtapas: [],
      tableList: [],
      listOfOperadores: [],
      jsonEtapas: {
        etapas: '',
        maquina: '',
        tempoMaquina: '',
        programador: '',
        tempoProgramador: '',
        operador: '',
        tempoOperador: '',
        montagem: '',
        tempoMontagem: '',
      },
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeTime = this.handleChangeTime.bind(this);
    this.setStateNew = this.setStateNew.bind(this);
    this.onHandleClickSave = this.onHandleClickSave.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
    this.handleDeleteAddressRow = this.handleDeleteAddressRow.bind(this);

    this.onHandleClickDelete = this.onHandleClickDelete.bind(this);
    this.onHandleClickNew = this.onHandleClickNew.bind(this);
    // this.handleSubmit = this.handleSubmit.bind(this);
    this.validator = new SimpleReactValidator({
      locale: 'pt',
      messages: { default: `:attribute não pode estar vazio` },
    });

    let auxthis = this;
    this.adressesColumns = [
      {
        title: 'Sequencia',
        dataIndex: 'sequencia',
        key: 'sequencia',
      },
      {
        title: 'Etapa',
        dataIndex: 'etapas',
        key: 'etapas',
        render: (text) => {
          return (text.toString().replace('null', ''))
        }
      },
      {
        title: 'Maquina',
        dataIndex: 'maquina',
        key: 'maquina',
      },
      {
        title: 'Tempo',
        dataIndex: 'tempoMaquina',
        key: 'tempoMaquina',
      },
      {
        title: 'Programador',
        dataIndex: 'programador',
        key: 'programador',
      },
      {
        title: 'Tempo',
        dataIndex: 'tempoProgramador',
        key: 'tempoProgramador',
      },
      {
        title: 'Operador',
        dataIndex: 'operador',
        key: 'operador',
      },
      {
        title: 'Tempo',
        dataIndex: 'tempoOperador',
        key: 'tempoOperador',
      },

      {
        title: 'Montagem',
        dataIndex: 'montagem',
        key: 'montagem',
      },
      {
        title: 'Tempo',
        dataIndex: 'tempoMontagem',
        key: 'tempoMontagem',
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
                  title: 'Tem certeza que deseja remover esta etapa ?',
                  onOk() {
                    auxthis.handleDeleteAddressRow(record.key, e);
                    message.success('Etapa removida');
                  },
                  onCancel() { },
                });
              }}
            />
          </div>
        ),
      },
    ];

    this.leftListChild = React.createRef();
    console.log('Constructor ----');
  }

  onHandleClickNew = () => {
    this.setStateNew();
  };
  componentWillMount() {
    this.getEstabs();
    this.getProd();
    this.getEtapas();
    this.getOperators();
  }

  getEstabs() {
    api
      .get(`${model2}`, {})
      .then((result) => {
        let dataEstab = [];
        dataEstab = result.data.data;

        this.setState({
          listofEstabs: dataEstab,
        });
        //Caso consiga recuperar o model, ele atualiza a tela e para de carregar
        // console.log(result.data.adresses);
        // console.log(result.adresses);
        // message.success('Cliente carregado com sucesso!');
        // parent.setStateEdit(result.data)
      })
      .catch(function (error) {
        console.log(error);
        // message.error('Erro ao buscar registro, tente novamente mais tarde!');
        // parent.setStateNew()
      });
  }

  getProd() {
    api
      .get(`${model3}/`, {})
      .then((result) => {
        let dataProd = [];
        dataProd = result.data.data;

        this.setState({
          listofProds: dataProd,
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  getEtapas() {
    api
      .get(`${model4}`, {
        params: {
          params: [
            {
              field: 'status',
              value: true,
              op: '=',
            },
          ],
        },
      })
      .then((result) => {
        let dataProd = [];
        dataProd = result.data.data;

        this.setState({
          listofEtapas: dataProd,
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  getOperators() {
    api
      .get(`${model5}`, {
        // params: {
        //   params: [
        //     {
        //       field: 'status',
        //       value: true,
        //       op: '=',
        //     },
        //   ],
        // },
      })
      .then((result) => {
        let dataProd = [];

        dataProd = result.data.data;

        let dataOperadores = [];
        dataProd.forEach(element => {
          if (element.operador === true) {
            dataOperadores.push(element);
          }
        });

        this.setState({
          listOfOperadores: dataOperadores,
        });
      })
      .catch(function (error) {
        console.log(error);
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
    //Agora ele vai buscar o registro no servidor
    api
      .get(`${model}/${record.id}`, {})
      .then((result) => {
        //Caso consiga recuperar o model, ele atualiza a tela e para de carregar
        // console.log(result.data.adresses);
        // console.log(result.adresses);
        message.success('Etapa carregada com sucesso!');
        parent.setStateEdit(result.data);
        console.log(result.data);
      })
      .catch(function (error) {
        // console.log(error);
        message.error('Erro ao buscar registro, tente novamente mais tarde!');
        parent.setStateNew();
      });
  };

  onHandleClickSave = () => {
    // console.log(this.state.model);
    if (this.validator.allValid()) {
      let record = this.state.stepXprod;
      let tabelalista = this.state.tableList;
      var parent = this;

      this.setState({
        loading: true,
        loadingTip: 'Salvando registro, aguarde...',
      });
      // console.log('vai tentar gravar',record)
      //Verifica se é uma atualizacao (PUT) ou novo registro (POST)
      let METHOD = 'PATCH';
      let URL = `${model}/${record.id}`;

      if (parent.state.isNew) {
        METHOD = 'POST';
        URL = `${model}`;
        // record = Object.assign({},record)
      }
      // console.log('onHandleSaveButton', record);
      const {
        establishment,
        product,
        status,
        description,
        descriptionStep,
      } = record;

      console.log(establishment);

      api({
        method: METHOD,
        url: URL,
        data: {
          establishment: establishment,
          product: product,
          description: description,
          descriptionStep: descriptionStep,
          steps: tabelalista,
          status: status,
        },
      })
        .then((result) => {
          //Caso consiga recuperar o model, ele atualiza a tela e para de carregar
          message.success('Etapa salva com sucesso!');
          console.log(result.data);
          parent.setStateEdit(result.data);
          parent.leftListChild.current.fetchLeftList();
        })
        .catch(function (error) {
          console.log(error);
          parent.setStateEdit(record);
          message.error(
            'Erro ao gravar registro, tente novamente mais tarde!'
          );
        });
    } else {
      message.warning('Campos obrigatórios em branco!');
      this.validator.showMessages();
      this.forceUpdate();
    }
  };

  onCancel = () => {
    history.replace('/dashboard');
    document.location.reload(true);
  };

  onChangeCheck = (event) => {
    let newstepXprod = this.state.stepXprod;
    newstepXprod['status'] = event.target.checked;
    this.setState({
      stepXprod: newstepXprod,
    });
  };

  onHandleClickDelete = () => {
    // console.log(this.state.model);
    let record = this.state.stepXprod;
    var parent = this;

    Modal.confirm({
      title: 'Tem certeza que deseja excluir esse registro?',
      onOk() {
        parent.setState({
          loading: true,
          loadingTip: 'Excluindo registro, aguarde...',
        });
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
      stepXprod: {
        status: false,
        establishment: 1,
        product: '',
      },
      loading: false,
      isNew: true,
      refreshLeftList: false,
      tableList: [],
      jsonEtapas: {
        etapas: '',
        maquina: '',
        programador: '',
        tempoProgramador: '',
        operador: '',
        tempoOperador: '',
        montagem: '',
        tempoMontagem: '',
      },
    });
  };
  //Seta o estado para edição
  setStateEdit = (model) => {
    console.log(model);
    model.establishment = model.establishment ? model.establishment : null;
    model.product = model.product;

    this.setState({
      canSave: true,
      canNew: true,
      canDelete: true,
      stepXprod: model,
      loading: false,
      isNew: false,
      tableList: model.steps,
    });
  };

  handleChange(event) {
    let newstepXprod = this.state.stepXprod;
    newstepXprod[event.target.name] = event.target.value;

    this.setState(() => ({
      stepXprod: newstepXprod,
    }));
  }

  handleChangeTime(event) {
    let jsonEtapas = this.state.jsonEtapas;
    jsonEtapas[event.target.name] = event.target.value;
    console.log(jsonEtapas);

    this.setState(() => ({ jsonEtapas: jsonEtapas }));
  }

  LeftList = () => {
    // this.handleOnClickRow = (record, rowIndex) => {
    //     // alert('onclick row expert.js '+rowIndex)
    //     console.log(rowIndex, record)
    //     this.setState({
    // 		canSave: true,
    // 		canNew: true,
    // 		canDelete: true,
    //         categ: {
    //             cod: record.codigo,
    //             desc: record.descricao
    //         }
    //     });
    // }

    return (
      <ListofStepXprods
        onClickRow={this.handleOnClickRow1}
        ref={this.leftListChild}
      />
      // <ListUsers />
    );
  };

  handleEstab = (event) => {
    let auxList = this.state.listofEstabs;
    let newstepXprod = this.state.stepXprod;

    auxList.map((obj) => {
      if (obj.id === event) {
        newstepXprod['establishment'] = obj.id;
        this.setState({
          stepXprod: newstepXprod,
        });
      }

      return '';
    });
  };

  handleEtapas = (event) => {
    let auxList = this.state.listofEtapas;
    let newstepXprod = this.state.jsonEtapas;

    auxList.map((obj) => {
      if (obj.id === event) {
        newstepXprod['etapas'] = obj.id;
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
          jsonEtapas: newstepXprod,
        });
      }

      return '';
    });
  };

  handleProd = (event) => {
    var parent = this;
    parent.setStateNew();
    let auxList = this.state.listofProds;
    let newstepXprod = this.state.stepXprod;

    auxList.map((obj) => {
      if (obj.id === event) {
        this.fetchAlreadyPro(obj);
        newstepXprod['product'] = obj.id;
        newstepXprod['description'] = obj.description1;
        this.setState({
          stepXprod: newstepXprod,
        });
      }

      return '';
    });
  };

  fetchAlreadyPro = (product) => {
    this.setState({
      loading: true,
      loadingTip: 'Carregando registro, aguarde...',
    });
    api
      .get(`stepXprod/?where={"product":${product.id}}`, {})
      .then((result) => {
        let dataEstab = [];
        dataEstab = result.data;

        if (dataEstab.length === 0) {
        } else {
          this.handleOnClickRow1(dataEstab[0]);
        }
        // console.log(result.data.adresses);
        // console.log(result.adresses);
        // message.success('Cliente carregado com sucesso!');
        // parent.setStateEdit(result.data)
      })
      .catch(function (error) {
        console.log(error);
        // message.error('Erro ao buscar registro, tente novamente mais tarde!');
        // parent.setStateNew()
      })
      .then((result) => {
        this.setState({
          loading: false,
        });
      });
  };

  handleAdd() {
    let lista = this.state.tableList;
    let obj = this.state.jsonEtapas;
    let last = lista[lista.length - 1];

    let objlista = {
      etapas: obj.etapas,
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
      if (m.id === obj.etapas) {
        objlista['etapas'] = m.cod + ' - ' + m.description;
      }
    });

    if (lista.length === 0) {
      objlista['sequencia'] = 1;
      objlista['key'] = 0;
    } else {
      objlista['key'] = last.key + 1;
      objlista['sequencia'] = last.sequencia + 1;
    }

    // this.setState({
    //     jsonEtapas: obj,git
    //     ...this.state.jsonEtapas
    // })

    lista.push(objlista);

    this.setState({
      tableList: lista,
    });

    message.success('Etapa adicionada !');

    this.setState({ jsonEtapas: {} });
  }

  handleDeleteAddressRow(key, e) {
    e.preventDefault();
    const adresses = this.state.tableList.filter((item) => item.key !== key);
    this.setState({
      tableList: adresses,
    });
  }

  // handleFilterOption = (inputValue, option) => {
  //     console.log(inputValue, option);
  //     option.props.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
  // }

  handleOperador = event => {
    let auxList = this.state.listOfOperadores;
    let newStep = this.state.jsonEtapas;
    
    console.log(event);
    auxList.map( obj => {
        if(obj.id === event){
            newStep["operador"] = obj.cod
            newStep["tempoOperador"] = obj.ratetime

            console.log(newStep);
            this.setState({
                jsonEtapas: newStep 
            })
        }
        return(
            ''
        )
    });
}

  Content = (stepXprod, estabs, prods, etapas) => {
    return (
      <div className="main">
        <Row>
          <Col span={24}>
            <Form layout="horizontal">
              <Card
                type="inner"
                title="Cadastro de Etapas do Processo X Produtos "
              >
                <Row>
                  <Col lg={6} md={6} sm={12} xs={24}>
                    <div className="gx-form-row0">
                      <Form.Item label="Codigo do Produto" required={true}>
                        <Select
                          showSearch
                          value={stepXprod.product}
                          // style={{ width: 400 }}
                          onChange={this.handleProd}
                          filterOption={(inputValue, option) =>
                            // console.log(inputValue)
                            option.props.children
                              .toUpperCase()
                              .indexOf(inputValue.toUpperCase()) !== -1
                          }
                        >
                          {prods.map((e) => {
                            return <Option value={e.id}>{e.cod}</Option>;
                          })}
                        </Select>
                        {this.validator.message(
                          'product',
                          stepXprod.product,
                          'required|alpha_num',
                          { className: 'text-danger' }
                        )}
                      </Form.Item>
                    </div>
                  </Col>
                  <Col lg={6} md={6} sm={12} xs={24}>
                    <div className="gx-form-row0">
                      <Form.Item label="Descrição">
                        <Input
                          type="text"
                          value={stepXprod.description}
                          disabled={true}
                          name="description"
                          onChange={this.handleChange}
                        />
                      </Form.Item>
                    </div>
                  </Col>
                  <Col lg={6} md={6} sm={12} xs={24}>
                    <div className="gx-form-row0">
                      <Form.Item label="Estabelecimento" required={true}>
                        <Select
                          showSearch
                          value={stepXprod.establishment}
                          // style={{ width: 200 }}
                          onChange={this.handleEstab}
                          filterOption={(inputValue, option) =>
                            option.props.children
                              .toUpperCase()
                              .indexOf(inputValue.toUpperCase()) !== -1
                          }
                        >
                          {estabs.map((e) => {
                            return <Option value={e.id}>{e.name}</Option>;
                          })}
                        </Select>
                        {this.validator.message(
                          'establishment',
                          stepXprod.establishment,
                          'required|alpha_num',
                          { className: 'text-danger' }
                        )}
                      </Form.Item>
                    </div>
                  </Col>
                  <Col lg={5} md={5} sm={12} xs={24}>
                    <div className="gx-form-row0">
                      <Form.Item label="Descrição etapa">
                        <Input
                          type="text"
                          value={stepXprod.descriptionStep}
                          name="descriptionStep"
                          onChange={this.handleChange}
                        />
                      </Form.Item>
                    </div>
                  </Col>
                  <Col lg={1} md={1} sm={12} xs={24}>
                    <div className="gx-form-row0">
                      <Form.Item label="Ativo">
                        <Checkbox
                          checked={this.state.stepXprod.status}
                          onChange={this.onChangeCheck}
                        />
                      </Form.Item>
                    </div>
                  </Col>
                </Row>
              </Card>

              <Card type="inner" title="Etapas">
                <Table
                  className="gx-table-responsive"
                  columns={this.adressesColumns}
                  dataSource={this.state.tableList}
                  size="small"
                  rowKey="id"
                  style={{ margin: '-15px -24px' }}
                />
              </Card>
              <Card type="inner" title="Etapas">
                <Row>
                  <Col lg={24} md={24} sm={24} xs={24}>
                    <div className="gx-form-row0">
                      <Form.Item label="Etapa">
                        <Select
                          showSearch
                          value={this.state.jsonEtapas.etapas}
                          // style={{ width: 500 }}
                          onChange={this.handleEtapas}
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
                          {etapas.map((e) => {
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
                        <Input
                          value={this.state.jsonEtapas.maquina}
                          disabled={true}
                        />
                      </Form.Item>
                    </div>
                  </Col>
                  <Col lg={6} md={6} sm={12} xs={24}>
                    <div className="gx-form-row0">
                      <Form.Item label="Tempo (min)">
                        <Input
                          value={this.state.jsonEtapas.tempoMaquina}
                          disabled={!this.state.jsonEtapas.maquina}
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
                          value={this.state.jsonEtapas.programador}
                          disabled={true}
                        />
                      </Form.Item>
                    </div>
                  </Col>
                  <Col lg={6} md={6} sm={12} xs={24}>
                    <div className="gx-form-row0">
                      <Form.Item label="Tempo (min)">
                        <Input
                          value={this.state.jsonEtapas.tempoProgramador}
                          disabled={!this.state.jsonEtapas.programador}
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
                        {/* <Input
                          value={this.state.jsonEtapas.operador}
                          disabled={!this.state.jsonEtapas.operador}
                        /> */}

                        <Select
                          value={this.state.jsonEtapas.operador}
                          // style={{ width: 250 }} 
                          onChange={this.handleOperador}
                          disabled={
                            !this.state.jsonEtapas.operador ||
                            this.state.jsonEtapas.operador === '-'
                          }
                        >
                          {
                              this.state.listOfOperadores.map(m => {
                              return (
                                <Option value={m.id}>{m.cod} - {m.name}</Option>
                              )
                            })
                          }
                        </Select>
                      </Form.Item>
                    </div>
                  </Col>
                  <Col lg={6} md={6} sm={12} xs={24}>
                    <div className="gx-form-row0">
                      <Form.Item label="Tempo (min)">
                        <Input
                          value={this.state.jsonEtapas.tempoOperador}
                          disabled={
                            !this.state.jsonEtapas.operador ||
                            this.state.jsonEtapas.operador === '-'
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
                          value={this.state.jsonEtapas.montagem}
                          disabled={true}
                        />
                      </Form.Item>
                    </div>
                  </Col>
                  <Col lg={6} md={6} sm={12} xs={24}>
                    <div className="gx-form-row0">
                      <Form.Item label="Tempo (min)">
                        <Input
                          value={this.state.jsonEtapas.tempoMontagem}
                          disabled={!this.state.jsonEtapas.montagem}
                          type="number"
                          name="tempoMontagem"
                          min={1}
                          onChange={this.handleChangeTime}
                        />
                      </Form.Item>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col lg={6} md={6} sm={12} xs={24}>
                    <div className="gx-form-row0">
                      <Button
                        type="primary"
                        htmlType="submit"
                        disabled={false}
                        onClick={this.handleAdd}
                      >
                        Adicionar Etapa
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
            {this.Content(
              this.state.stepXprod,
              this.state.listofEstabs,
              this.state.listofProds,
              this.state.listofEtapas
            )}
          </Col>
          <Col lg={4} md={4} sm={24} xs={24}>
            <RightList
              title="Etapas do Processo x Produtos"
              onHandleClickNew={this.onHandleClickNew}
              onHandleClickSave={this.onHandleClickSave}
              onHandleClickDelete={this.onHandleClickDelete}
              canNew={this.state.canNew}
              canSave={this.state.canSave}
              canDelete={this.state.canDelete}
            />
          </Col>
        </Row>
      </Spin>
    );
  }
}

export default etapaXprod;
