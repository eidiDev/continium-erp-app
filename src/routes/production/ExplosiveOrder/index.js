import React, { Component } from 'react';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  message,
  Spin,
  Modal,
  Select,
  DatePicker,
  Table,
  Popover,
  Tag,
  Button,
} from 'antd';
import history from '../../../util/history';
import locale from 'antd/es/date-picker/locale/pt_BR';
import ListExplosive from './listExplosive';
import api from '../../../util/Api';
import moment from 'moment';
import EditRow from '../prodOrder/EditRow';
import { EditableCell } from '../prodOrder/EditRow';
import SimpleReactValidator from 'simple-react-validator';
import Log from './Log';
//const Panel = Collapse.Panel;
const { Option } = Select;
const model = 'explosive';
const model2 = 'establishment';
const model3 = 'product';
const model4 = 'partner';
//const TabPane = Tabs.TabPane
// const FormItem = Form.item
// const customPanelStyle = {
//     borderRadius: 4,
//     border: 0,
//     overflow: 'hidden'
// };

//let tableCompAux = [];
class ProdOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isNew: true,
      loader: true,
      productOrder: {
        establishment: 1,
        product: '',
        partner: '',
        dataProd: '',
        status: 'planejada',
        pedidoCliente: '',
        orderFox: '',
      },
      dataAux: '',
      dataEntrega: '',
      canNew: true,
      canSave: true,
      canDelete: false,
      loading: false,
      listofEstabs: [],
      listofProds: [],
      listofPartner: [],
      listofStepXprod: [],
      listofKit: [],

      tableSteps: [],
      tableComp: [],
      tableCompFixa: [],
      dataKitArvore: [],
      tableOfKitToMade: [],
      dataAlreadyOnRow: [],
      listOffilhos: [],
      logs: [],
      showLog: false,
    };

    this.validator = new SimpleReactValidator({
      locale: 'pt',
      messages: { default: `:attribute não pode estar vazio` },
    });

    this.kitcolums = [
      {
        title: 'Sequencia',
        dataIndex: 'sequencia',
        key: 'sequencia',
      },
      {
        title: 'Prioridade',
        dataIndex: 'prioridade',
        key: 'prioridade',
      },
      {
        title: 'Produto',
        dataIndex: 'produto',
        key: 'produto',
      },
      {
        title: 'Descrição ',
        dataIndex: 'desc',
        key: 'desc',
      },
      {
        title: 'Qtde',
        dataIndex: 'qtde',
        key: 'qtde',
        editable: true,
      },
      {
        title: 'Unidade',
        dataIndex: 'unidade',
        key: 'unidade',
      },
    ];

    this.columnsArvore = [
      {
        title: 'Codigo',
        dataIndex: 'cod',
        // eslint-disable-next-line
        render: (text) => <a>{text}</a>,
      },
      {
        title: 'Descrição',
        dataIndex: 'product.description1',
      },
      {
        title: 'Qtde prevista',
        dataIndex: 'qtdebase',
        editable: true,
      },
      {
        title: 'Tempo previsto',
        dataIndex: 'tempoPrevisto',
        editable: true,
      },
    ];

    this.etapascolums = [
      {
        // title: text => <IntlMessages id="commondata.customers.lastname"/>,
        title: 'Etapa',
        dataIndex: 'etapas',
        key: 'etapas',
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
        editable: true,
      },
      // {
      //     title: 'Tp setup',
      //     dataIndex:'tpsetup',
      //     key: 'tpsetup'
      // },

      // {
      //     title: 'Tp operatorio',
      //     dataIndex:'tpoperario',
      //     key: 'tpoperario'
      // },
      {
        title: 'Programador',
        dataIndex: 'programador',
        key: 'programador',
      },
      {
        title: 'Tempo',
        dataIndex: 'tempoProgramador',
        key: 'tempoProgramador',
        editable: true,
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
        editable: true,
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
        editable: true,
      },
    ];

    this.handleChange = this.handleChange.bind(this);
    this.setStateNew = this.setStateNew.bind(this);
    this.onHandleClickNew = this.onHandleClickNew.bind(this);
    // this.handleSubmit = this.handleSubmit.bind(this);

    this.leftListChild = React.createRef();
  }

  onHandleClickNew = () => {
    this.setStateNew();
  };

  componentWillMount() {
    this.getEstabs();
    this.getProducts();
    this.getPartner();
  }

  onOkLog = () => {
    this.setState({
      showLog: false,
    });
  };

  getProducts() {
    api
      .get(`${model3}/`)
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

  getEstabs() {
    api
      .get(`${model2}`, {})
      .then((result) => {
        let dataEstabs = [];
        dataEstabs = result.data.data;

        this.setState({
          listofEstabs: dataEstabs,
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  getPartner() {
    api
      .get(`${model4}`, {})
      .then((result) => {
        let dataCli = [];
        dataCli = result.data.data;

        this.setState({
          listofPartner: dataCli,
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
    setTimeout(function () {
      //Agora ele vai buscar o registro no servidor
      api
        .get(`${model}/${record.id}`, {})
        .then((result) => {
          //Caso consiga recuperar o model, ele atualiza a tela e para de carregar
          // console.log(result.data.adresses);
          // console.log(result.adresses);
          message.success('Ordem carregada com sucesso!');
          parent.setStateEdit(result.data);
        })
        .catch(function (error) {
          // console.log(error);
          message.error('Erro ao buscar registro, tente novamente mais tarde!');
          parent.setStateNew();
        });
    }, 1000);
  };

  onCancel = () => {
    history.replace('/dashboard');
    document.location.reload(true);
  };

  onChangeCheck = (event) => {
    let newCateg = this.state.categ;
    newCateg['status'] = event.target.checked;
    this.setState({
      categ: newCateg,
    });
  };

  setStateNew = () => {
    this.setState({
      canSave: true,
      canNew: true,
      canDelete: false,
      productOrder: {
        establishment: 1,
        product: '',
        partner: '',
        dataProd: '',
        status: 'planejada',
      },
      dataAux: '',
      dataEntrega: '',
      loading: false,
      isNew: true,
      refreshLeftList: false,
      tableSteps: [],
      tableComp: [],
      dataKitArvore: [],
      tableOfKitToMade: [],
    });
  };
  //Seta o estado para edição
  setStateEdit = (model) => {
    console.log(model);
    let dataAux = moment(model.dataProd);
    let dataEntrega = moment(model.dataEntrega);
    model['establishment'] = model.establishments.id;
    model['product'] = model.product.id;
    model['partner'] = model.partner.id;

    console.log(model);
    this.setState({
      canSave: true,
      canNew: true,
      canDelete: true,
      productOrder: model,
      loading: false,
      isNew: false,
      dataAux: dataAux,
      dataEntrega: dataEntrega,
      dataAlreadyOnRow: model.filhos,
    });

    this.handleProduct(model.product);
  };

  handleChange(event) {
    let newOrder = this.state.productOrder;
    newOrder[event.target.name] = event.target.value;

    this.setState(() => ({
      productOrder: newOrder,
    }));

    // if(event.target.name === 'qtde') {
    //     let table = this.state.dataKitArvore;
    //     this.setArvoreKit(this.state.listOffilhos, event.target.value );
    //     this.setState({
    //         dataKitArvore: table
    //     });
    // }
  }

  handleEstab = (event) => {
    let auxList = this.state.listofEstabs;
    let newProdOrder = this.state.productOrder;

    auxList.map((obj) => {
      if (obj.id === event) {
        newProdOrder['establishment'] = obj.id;
        this.setState({
          productOrder: newProdOrder,
        });
      }

      return '';
    });
  };

  handleProduct = (event) => {
    let auxList = this.state.listofProds;
    let newProdOrder = this.state.productOrder;

    auxList.map((obj) => {
      if (obj.id === event) {
        console.log(obj);
        newProdOrder['product'] = obj.id;
        newProdOrder['description'] = obj.description1;
        newProdOrder['unity'] = obj.unity;
        let compJSON = JSON.stringify(obj.kit);
        let stepsJSON = JSON.stringify(obj.stepXprod);

        let comp = JSON.parse(compJSON);
        let step = JSON.parse(stepsJSON);

        this.setState({
          productOrder: newProdOrder,
        });

        if (comp.length === 0) {
          this.setState({
            tableComp: [],
          });
        } else {
          this.setState({
            tableComp: comp[0].products,
          });
          this.setState({
            tableCompFixa: comp[0].products,
          });
          this.getArvoreKit(comp[0].products);
          this.setState({
            listOffilhos: comp[0].products,
          });
        }

        if (step.length === 0) {
          this.setState({
            tableSteps: [],
          });
        } else {
          this.setState({
            tableSteps: step[0].steps,
          });
        }
      }

      return '';
    });
  };

  handlePartner = (event) => {
    let auxList = this.state.listofPartner;
    let newProdOrder = this.state.productOrder;

    auxList.map((obj) => {
      if (obj.id === event) {
        newProdOrder['partner'] = obj.id;
        this.setState({
          productOrder: newProdOrder,
        });
      }

      return '';
    });
  };

  LeftList = () => {
    return (
      <ListExplosive
        onClickRow={this.handleOnClickRow1}
        ref={this.leftListChild}
      />
    );
  };

  dataChange = (date, dataString) => {
    let newProdOrder = this.state.productOrder;
    newProdOrder['dataProd'] = dataString;
    this.setState({
      productOrder: newProdOrder,
    });

    this.setState({
      dataAux: date,
    });
  };

  dataChangeEntrega = (date, dataString) => {
    let newProdOrder = this.state.productOrder;

    newProdOrder['dataEntrega'] = dataString;
    this.setState({
      productOrder: newProdOrder,
    });

    this.setState({
      dataEntrega: date,
    });
  };

  time_convert(num) {
    var hours = Math.floor(num / 60);
    var minutes = num % 60;
    return hours + ':' + minutes;
  }

  _handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      this.setState({ loading: true, loadingTip: 'calculando...' });
      let table = this.state.dataKitArvore;
      this.setArvoreKit(this.state.listOffilhos, e.target.value);
      this.setState({
        dataKitArvore: table
      });
    }
  };

  getArvoreKit(body) {
    console.log(body);
    let url = 'api/orderProd/getKitArvore';
    api
      .post(`${url}`, { produto: body, pai: this.state.productOrder.product })
      .then((result) => {
        console.log(result);
        result.data.forEach((element) => {
          // let arrayFilho = []

          // body.forEach( b => {
          //     if(b.produto === element.cod){
          //         element.qtdebase = b.qtde
          //     }
          // })

          // arrayFilho =  element.products;

          // for (const pAux of arrayFilho) {
          //     if(element.cod === pAux.produto){
          //         element.qtdebase = pAux.qtde
          //     }
          // }
          element.key = element.id;
          element.tempoPrevisto = 0;
        });

        //tableCompAux = result.data;
        console.log(result.data);
        this.setState({
          dataKitArvore: result.data,
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  setArvoreKit(body, inteiro) {
    let url = 'api/orderProd/setKitArvore';

    api
      .post(`${url}`, {
        produto: body,
        pai: this.state.productOrder.product,
        numero: inteiro,
      })
      .then((result) => {
        console.log(result);
        result.data.forEach((element) => {
          element.key = element.id;
          //element.tempoPrevisto = 0
        });

        //tableCompAux = result.data;
        console.log(result.data);
        this.setState({
          dataKitArvore: result.data,
          loading: false,
        });
      })
      .catch(function (error) {
        console.log(error);
        this.setState({
          loading: false,
        });
      });
  }

  handleSave = (row) => {
    const newData = [...this.state.dataKitArvore];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    console.log(newData);
    this.setState({ dataKitArvore: newData });
  };

  handleSaveSteps = (row) => {
    const newData = [...this.state.tableSteps];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    console.log(newData);
    this.setState({ tableSteps: newData });
  };

  handleTip = (event) => {
    console.log(event);
    let newMachine = this.state.productOrder;
    newMachine['status'] = event;
    this.setState({
      productOrder: newMachine,
    });
  };

  gerarOrdemKits = () => {
    if (this.validator.allValid()) {
      let arraySelectKits = this.state.tableOfKitToMade;
      let record = this.state.productOrder;
      const { confirm } = Modal;
      let parent = this;

      // console.log(record, arraySelectKits);

      confirm({
        title: 'Voce deseja criar ordem para estes produtos ?',
        content: '',
        onOk() {
          //POST ON BACK-BEND
          parent.setState({
            loading: true,
            loadingTip: 'Criando Ordens, aguarde...',
          });
          //Agora ele vai buscar o registro no servidor
          let METHOD = 'POST';
          let URL = `api/orderProd/createOrdersKits`;
          
          api.get('checkIfHasStepKit', {params: {arrayProdutos: arraySelectKits}}).then((result) => {
            if(result.data.flag === true){
              api({
                method: METHOD,
                url: URL,
                data: {
                  arrayProdutos: arraySelectKits,
                  record: record,
                },
              })
                .then((result) => {
                  message.success(result.data.msg);
    
                  parent.setState({
                    loading: false,
                    showLog: true,
                    logs: result.data.orders,
                  });
                  parent.setStateNew();
                  // parent.leftListChild.current.fetchLeftList()
                })
                .catch(function (error) {
                  parent.setState({ loading: false });
                  console.log(error);
                  message.error(
                    'Erro ao criar as ordens, tente novamente mais tarde!'
                  );
                  parent.setStateNew();
                  // if(error.message === "Cannot read property 'fetchLeftList' of null"){
    
                  // }else{
                  //     message.error('Erro ao criar as ordens, tente novamente mais tarde!');
                  //     parent.setStateNew()
                  // }
                });
            }else{
                parent.setState({
                  loading: false,
                  showLog: true,
                  logs: result.data.lista,
                });
            }
          }).catch((error) => {
            console.log(error);
          })
        },
        onCancel() {},
      });
    } else {
      message.warning('Campos obrigatórios em branco!');
      this.validator.showMessages();
      this.forceUpdate();
    }
  };

  deleteOrders = () => {
    let arraySelectKits = this.state.tableOfKitToMade;
    let record = this.state.productOrder;
    const { confirm } = Modal;
    let parent = this;

    console.log(record, arraySelectKits);
    confirm({
      title: 'Voce deseja DELETAR ordem para estes produtos ?',
      content: '',
      onOk() {
        //POST ON BACK-BEND
        parent.setState({
          loading: true,
          loadingTip: 'Criando Ordens, aguarde...',
        });
        setTimeout(function () {
          //Agora ele vai buscar o registro no servidor
          let METHOD = 'DELETE';
          let URL = `api/orderProd/deleteOrders`;
          api({
            method: METHOD,
            url: URL,
            data: {
              arrayProdutos: arraySelectKits,
              record: record,
            },
          })
            .then((result) => {
              console.log(result, parent);
              message.success(result.data);
              parent.setState({
                loading: false,
              });
              parent.setStateNew();
              parent.leftListChild.current.fetchLeftList();
            })
            .catch(function (error) {
              console.log(error);
              if (
                error.message === "Cannot read property 'fetchLeftList' of null"
              ) {
              } else {
                message.error(error.message);
                parent.setStateNew();
              }
            });
        }, 1000);
      },
      onCancel() {},
    });
  };

  Content = (orderPro, estabs, products, partner) => {
    const components = {
      body: {
        row: EditRow,
        cell: EditableCell,
      },
    };
    const columnsKit = this.columnsArvore.map((col) => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: (record) => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave,
        }),
      };
    });

    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({
          tableOfKitToMade: selectedRows,
        });
      },
      getCheckboxProps: (record) => ({
        name: record.name,
      }),
    };

    const content = (
      <div>
        <p>Para alterar a quantidade dos Kit,pressione:</p>
        <Tag color="blue">Enter</Tag>
      </div>
    );

    return (
      <div className="main">
        <Row>
          <Col span={24}>
            {/* <Card className="gx-card" title="Explosão Multi-Nível"> */}
            <Card type="inner" title="Explosão Multi-nível">
              <Form layout="horizontal">
                <Row>
                  <Col lg={4} md={6} sm={12} xs={24}>
                    <div className="gx-form-row0">
                      <Form.Item required={true} label="Estabelecimento">
                        <Select
                          value={orderPro.establishment}
                          style={{ width: 160 }}
                          onChange={this.handleEstab}
                        >
                          {estabs.map((e) => {
                            return <Option value={e.id}>{e.name}</Option>;
                          })}
                        </Select>
                        {this.validator.message(
                          'Estabelecimento',
                          orderPro.establishment,
                          'required',
                          { className: 'text-danger' }
                        )}
                      </Form.Item>
                    </div>
                  </Col>

                  <Col lg={4} md={12} sm={16} xs={24}>
                    <div className="gx-form-row0">
                      <Form.Item label="Cliente" required={true}>
                        <Select
                          value={orderPro.partner}
                          showSearch
                          //style={{ width: 200 }}
                          onChange={this.handlePartner}
                          filterOption={(input, option) =>
                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          }
                        >
                          {partner.map((e) => {
                            return (
                              <Option value={e.id}>
                                {e.name}
                              </Option>
                            );
                          })}
                        </Select>
                      </Form.Item>
                      {this.validator.message(
                        'Cliente',
                        orderPro.partner,
                        'required',
                        { className: 'text-danger' }
                      )}
                    </div>
                  </Col>

                  <Col lg={4} md={6} sm={12} xs={24}>
                    <div className="gx-form-row0">
                      <Form.Item label="Data produção" required={true}>
                        <DatePicker
                          value={this.state.dataAux}
                          format={'DD-MM-YYYY'}
                          locale={locale}
                          onChange={this.dataChange}
                        />
                        {this.validator.message(
                          'Data prod',
                          this.state.dataAux,
                          'required',
                          { className: 'text-danger' }
                        )}
                      </Form.Item>
                    </div>
                  </Col>

                  <Col lg={4} md={6} sm={12} xs={24}>
                    <div className="gx-form-row0">
                      <Form.Item label="Data Entrega" required={true}>
                        <DatePicker
                          value={this.state.dataEntrega}
                          format={'DD-MM-YYYY'}
                          locale={locale}
                          onChange={this.dataChangeEntrega}
                        />
                        {this.validator.message(
                          'Data prod',
                          this.state.dataEntrega,
                          'required',
                          { className: 'text-danger' }
                        )}
                      </Form.Item>
                    </div>
                  </Col>
                  <Col lg={6} md={6} sm={12} xs={24}>
                    <div className="gx-form-row0">
                      <Form.Item label="Produto" required={true}>
                        <Select
                          showSearch
                          value={orderPro.product}
                          placeholder="Selecione um produto"
                          style={{ width: 300 }}
                          onChange={this.handleProduct}
                          filterOption={(inputValue, option) =>
                            // console.log(inputValue)
                            option.props.children
                              .toUpperCase()
                              .indexOf(inputValue.toUpperCase()) !== -1
                          }
                        >
                          {products.map((e) => {
                            return <Option value={e.id}>{e.cod}</Option>;
                          })}
                        </Select>
                        {this.validator.message(
                          'product',
                          orderPro.product,
                          'required',
                          { className: 'text-danger' }
                        )}
                      </Form.Item>
                    </div>
                  </Col>

                  <Col lg={4} md={6} sm={12} xs={24}>
                    <div className="gx-form-row0">
                      <Form.Item label="Qtde a produzir" required={true}>
                        <Popover
                          content={content}
                          title="Mudar a Quantidade"
                          placement="bottom"
                        >
                          <Input
                            type="text"
                            value={orderPro.qtde}
                            name="qtde"
                            onKeyDown={this._handleKeyDown}
                            onChange={this.handleChange}
                          />
                        </Popover>
                        {this.validator.message(
                          'qtde',
                          orderPro.qtde,
                          'required',
                          { className: 'text-danger' }
                        )}
                      </Form.Item>
                    </div>
                  </Col>
                  <Col lg={4} md={6} sm={12} xs={24}>
                    <div className="gx-form-row0">
                      <Form.Item label="Pedido Cliente">
                        <Input
                          type="text"
                          // style={{ width: 120 }}
                          value={orderPro.pedidoCliente}
                          name="pedidoCliente"
                          onChange={this.handleChange}
                        />
                      </Form.Item>
                    </div>
                  </Col>
                  <Col lg={4} md={6} sm={12} xs={24}>
                    <div className="gx-form-row0">
                      <Form.Item label="Pedido Venda">
                        <Input
                          type="text"
                          // style={{ width: 120 }}
                          value={orderPro.orderFox}
                          name="orderFox"
                          onChange={this.handleChange}
                        />
                      </Form.Item>
                    </div>
                  </Col>
                </Row>
              </Form>
            </Card>

            <Card type="inner" title="Kit árvore">
              {/* <Card className="gx-card" title="Ordem de Produção"></Card> */}
              <Table
                components={components}
                rowSelection={rowSelection}
                columns={columnsKit}
                dataSource={this.state.dataKitArvore}
                style={{ margin: '-15px -24px' }}
                size="small"
              />

              <br />
              <br />
              <Row justify="end">
                <Col lg={4} md={6} sm={12} xs={24} gutter={[8, 8]}>
                  <Button
                    block
                    disabled={
                      this.state.tableOfKitToMade.length === 0 ? true : false
                    }
                    type="primary"
                    onClick={this.gerarOrdemKits}
                  >
                    Gerar
                  </Button>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </div>
    );
  };

  render() {
    return (
      <Spin spinning={this.state.loading} tip={this.state.loadingTip}>
        <Log
          showLog={this.state.showLog}
          onOkLog={this.onOkLog}
          logs={this.state.logs}
        />
        <Row>
          <Col span={24}>
            {this.Content(
              this.state.productOrder,
              this.state.listofEstabs,
              this.state.listofProds,
              this.state.listofPartner
            )}
          </Col>
        </Row>
      </Spin>
    );
  }
}

export default ProdOrder;
