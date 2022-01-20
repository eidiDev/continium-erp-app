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
  Popconfirm,
  Button,
  Dropdown,
  Menu,
} from 'antd';
import { Icon } from '@ant-design/compatible';
import history from 'util/history';
import locale from 'moment/locale/pt-br';
import ListOrdemPro from './listOrdemProd';
import api from 'util/Api';
import apiLinux from 'util/Api'
import apiAdonis from 'util/ApiAdonis'
import EditRow from './EditRow';
import { EditableCell } from './EditRow';
import moment from 'moment';
import SimpleReactValidator from 'simple-react-validator';
import { saveAs } from 'file-saver';
import { apontamentoColumns } from './columns';
import AddApontamento from './addApontamento';
import AddEtapa from './addEtapa';
import Log from './Log';
// import { object } from 'prop-types';

const { Option } = Select;
const model = 'orderprod';
const model2 = 'establishment';
const model3 = 'product';
const model4 = 'partner';
// const url_api = 'http://localhost:3337';

let tableCompAux = [];

class ProdOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isNew: true,
      loader: true,
      productOrder: {
        establishment: 1,
        product: '',
        createdAt: '',
        partner: '',
        dataProd: '',
        status: 'planejada',
        prioridade: '',
      },
      modalVisible: false,
      dataAux: '',
      dataEntrega: '',
      canNew: true,
      canSave: true,
      canDelete: false,
      loading: false,
      listofEstabs: [],
      listofProds: [],
      listofPartner: [],
      tableSteps: [],
      tableComp: [],
      tableCompFixa: [],
      dataKitArvore: [],
      tableOfKitToMade: [],
      listofMachines: [],
      listFilhos: [],
      listOfOrder: [],
      listProdsOfOrderProd: [],
      modalAddApontamento: false,
      modalAddEtapa: false,
      loadingApontamento: false,
      loadingEtapa: false,
      apontamentos: [],
      apontamento: {
        id: '',
        etapa: '',
        tipo: '',
        colaborador: '',
        dataInicio: moment(),
        dataFim: moment(),
        qtdeApontada: 0,
      },
      showLog: false,
      logs: [],
      qtdeApontadaEtapaAnterior: 0,
      listOrderProdMaqOnApt: []
    };

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
    let auxthis = this;

    this.apontamentoColumns = [
      ...apontamentoColumns,
      {
        title: 'Remover registro',
        dataIndex: 'operation',
        align: 'center',
        render: (text, record) => (
          //   this.state.apontamentos.length >= 1 ? (
          <Popconfirm
            title="Tem certeza?"
            icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}
            onConfirm={() => this.onRemoveApontamento(record.id)}
          >
            <i className="icon icon-trash" />
          </Popconfirm>
        ),
      },
    ];

    this.handleChange = this.handleChange.bind(this);
    this.handleChangeApontamento = this.handleChangeApontamento.bind(this);
    this.onRemoveApontamento = this.onRemoveApontamento.bind(this);
    this.setStateNew = this.setStateNew.bind(this);
    this.onHandleClickSave = this.onHandleClickSave.bind(this);

    this.onHandleClickDelete = this.onHandleClickDelete.bind(this);
    this.onHandleClickNew = this.onHandleClickNew.bind(this);
    this.handleAddEtapa = this.handleAddEtapa.bind(this);

    this.validator = new SimpleReactValidator({
      locale: 'pt',
      messages: { default: `:attribute não pode estar vazio` },
    });

    this.leftListChild = React.createRef();
  }

  onHandleClickNew = () => {
    this.setStateNew();
  };

  componentWillMount() {
    this.getEstabs();
    this.getProducts();
    this.getPartner();
    this.getForOrderProd();
    this.getMaquinaseMaodeObra();
  }

  handleStatus = (event, record, tipo) => {
    let newProdOrder = this.state.tableSteps;
    for (const status of newProdOrder) {
      console.log(status);
      if (record.key === status.key) {
        if(tipo === "maquina"){
          status.maquina = event;
          status.montagem = '';
        }else{
          status.montagem = event;
          status.maquina = ''
        }
        
      }
    }
    // console.log(newProdOrder);

    this.setState({
      tableSteps: newProdOrder,
    });
  };

  getProducts() {
    api
      .get(`${model3}/`, {})
      .then((result) => {
        let dataProd = [];
        dataProd = result.data.data;

        this.setState({
          listProdsOfOrderProd: dataProd,
        });
      })
      .catch(function (error) {
        //console.log(error);
      });
  }

  getForOrderProd() {
    api
      .get(`getOnlyproductsHasKitStep`, {})
      .then((result) => {
        let dataProd = [];
        dataProd = result.data;

        this.setState({
          listProdsOfOrderProd: dataProd,
        });
      })
      .catch(function (error) {
        //console.log(error);
      });
  }

  getOrdemDeProducao() {
    api
      .get(`orderprod`, {})
      .then((result) => {
        let dataProd = [];
        dataProd = result.data;

        this.setState({
          listOfOrder: dataProd,
        });
      })
      .catch(function (error) {
        //console.log(error);
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
        // console.log(error);
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
        // console.log(error);
      });
  }

  getMaquinaseMaodeObra() {
    api
      .get('machinelabor/', {})
      .then((result) => {
        let dataCli = [];
        dataCli = result.data.data;
        this.setState({
          listofMachines: dataCli,
        });
      })
      .catch(function (error) {
        // console.log(error);
      });
  }

  handleOnClickRow1 = (record, rowIndex) => {
    var parent = this;
    //Primeria coisa ele seta loading para true
    this.setState({
      loading: true,
      loadingTip: 'Carregando registro, aguarde...',
    });
    api
      .get(`${model}/${record.id}`, {})
      .then((result) => {
        //Caso consiga recuperar o model, ele atualiza a tela e para de carregar
        // console.log(result.data.adresses);
        message.success('Ordem carregada com sucesso!');
        parent.setStateEdit(result.data);
        parent.checkMachinesOnOrderProdmaq();
      })
      .catch(function (error) {
         console.log(error);
        message.error('Erro ao buscar registro, tente novamente mais tarde! AQUIII');
        parent.setStateNew();
      });
  };

  onHandleClickSave = () => {
    console.log(this.state.productOrder.qtde);
    if (
      this.state.productOrder.qtde <= 0 ||
      this.state.productOrder.qtde === ''
    ) {
      message.warning('Quantidade deve ser maior que 0');
      return;
    }
    if (this.validator.allValid()) {
      let record = this.state.productOrder;
      var parent = this;
      let components = this.state.tableComp;
      let etapas = this.state.tableSteps;
      let filhos = this.state.dataKitArvore;

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
      const {
        dataEntrega,
        dataProd,
        establishment,
        partner,
        product,
        orderFox,
        description,
        orderProduction,
        qtde,
        unity,
        status,
        pedidoCliente,
        prioridade,
      } = record;
      api({
        method: METHOD,
        url: URL,
        data: {
          establishments: establishment,
          product: product,
          description: description,
          partner: partner,
          dataEntrega: dataEntrega,
          dataProd: dataProd,
          dataProdEnd: dataProd,
          pedidoCliente: pedidoCliente,
          orderFox: orderFox,
          orderProduction: orderProduction,
          qtde: qtde,
          prioridade: prioridade,
          unity: unity,
          components: components,
          etapas: etapas,
          status: status,
        },
      })
        .then((result) => {
          //Caso consiga recuperar o model, ele atualiza a tela e para de carregar
          // let idEstab = result.data.establishments;
          // let idProduct = result.data.product;
          // let idPartner = result.data.partner;
          // result.data.establishments = {
          //   id: idEstab,
          // };
          // result.data.product = {
          //   id: idProduct,
          // };
          // result.data.partner = {
          //   id: idPartner,
          // };

          message.success('Ordem salva com sucesso!');
          parent.setStateEdit(result.data);
          parent.leftListChild.current.fetchLeftList();
        })
        .catch(function (error) {
          console.log(error);
          message.error('Erro ao gravar registro, tente novamente mais tarde!');
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
    let newCateg = this.state.categ;
    newCateg['status'] = event.target.checked;
    this.setState({
      categ: newCateg,
    });
  };

  onHandleClickDelete = () => {
    // console.log(this.state.model);
    let record = this.state.productOrder;
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

  checkPrioridade = () => {
    let lista = [];
    let priori = this.state.productOrder;

    api
      .get(`orderprod`, {})
      .then((result) => {
        let dataProd = [];
        dataProd = result.data;

        lista = dataProd;

        if (lista.length === 0) {
          priori['prioridade'] = 1;
          this.setState({
            productOrder: priori,
          });
        } else {
          let arrayNumeros = [];
          for (const order of lista) {
            arrayNumeros.push(order.prioridade);
          }
          const maior = Math.max(...arrayNumeros);

          priori['prioridade'] = maior + 1;

          this.setState({
            productOrder: priori,
          });
        }
      })
      .catch(function (error) {
        //console.log(error);
      });
  };

  setStateNew = async () => {
    await this.setState({
      canSave: true,
      canNew: true,
      canDelete: false,
      productOrder: {
        establishment: 1,
        createdAt: '',
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
      apontamentos: [],
    });

    this.checkPrioridade();
    this.getForOrderProd();
  };
  //Seta o estado para edição
  setStateEdit = (modelObject) => {
    const model = modelObject instanceof Array ? modelObject[0] : modelObject 
    console.log(model);
    let dataAux = moment(model.dataProd, 'DD-MM-YYYY');
    let dataEntrega = moment(model.dataEntrega, 'DD-MM-YYYY');

    model['establishment'] = model.establishments ;
    model['image'] = model.productObj.principalArch;
    model['product_cod'] = model.productObj.cod;
    model['product'] = model.productObj.id;

    model['partner'] = model.partnerObj.id;
    let etapas;

    if (model.maquinas === undefined) {
      etapas = model.etapas.sort(function (a, b) {
        return a.sequencia < b.sequencia
          ? -1
          : a.sequencia > b.sequencia
          ? 1
          : 0;
      });
    } else {
      etapas = model.maquinas.sort(function (a, b) {
        return a.sequencia < b.sequencia
          ? -1
          : a.sequencia > b.sequencia
          ? 1
          : 0;
      });

      let i = 1;
      for (const iterator of model.maquinas) {
        iterator.etapas = iterator.codEtapas;
        delete iterator.codEtapas;

        iterator.key = i;
        i = i + 1;
      }
    }

    this.setState({
      canSave: true,
      canNew: true,
      canDelete: true,
      productOrder: model,
      loading: false,
      isNew: false,
      dataAux: dataAux,
      dataEntrega: dataEntrega,
      tableComp: model.components,
      tableSteps: etapas,
      apontamentos: model.apontamentos,
      //dataKitArvore: model.filhosdoProduto,
    });

    this.atualizaQtdeProduzidaApontamentos(model);

    //busca os apontamentos
    this.getApontamentos(model.id);
  };

  getApontamentos = async (orderProdId) => {
    try {
      await api
        .get(`noteprod`, {
          params: {
            params: [
              {
                field: 'orderProd',
                value: orderProdId,
                op: '=',
              },
            ],
          },
        })
        .then((result) => {
          let apontamentos = result.data.data;

          this.setState({ apontamentos });
        })
        .catch(function (error) {
          //console.log(error);
        });
    } catch (err) {}
  };

  handleChangeApontamento = (name) => (value) => {
    let newObj = this.state.apontamento;
    if (typeof value === 'object') {
      if (name === 'dataInicio' || name === 'dataFim') {
        newObj[name] = moment(value);
      } else {
        newObj[value.target.name] = value.target.value;
      }
    } else {
      newObj[name] = value;
    }
    this.setState({ apontamento: newObj });
  };

  handleChange(event) {
    let newOrder = this.state.productOrder;
    newOrder[event.target.name] = event.target.value;

    this.setState(() => ({
      productOrder: newOrder,
    }));

    // if(event.target.name === "qtde"){
    //     let table = this.state.tableComp;
    //     let table2 = [this.state.tableCompFixa];
    //     let obj = {}
    //     let inicialValues = [];

    //     inicialValues.push([...table2]);
    //     console.log(table2);

    //      table.forEach(comp => {

    //         comp.qtde = comp.qtde * event.target.value
    //         //  inicialValues.push(comp.qtde);

    //      });

    //      console.log(inicialValues);
    // }
  }

  LeftList = () => {
    return (
      <ListOrdemPro
        onClickRow={this.handleOnClickRow1}
        ref={this.leftListChild}
      />
    );
  };

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
    //let auxList = this.state.listofProds;

    let auxPrioridade = this.state.listProdsOfOrderProd;

    let newProdOrder = this.state.productOrder;

    auxPrioridade.map((obj) => {
      if (obj.id === event) {
        // console.log(obj);
        newProdOrder['product'] = obj.id;
        newProdOrder['description'] = obj.description1;
        newProdOrder['unity'] = obj.unity;
        if (obj.kit) {
          newProdOrder['qtdebase'] = 0;
        } else {
          newProdOrder['qtdebase'] = obj.kit.qtdebase;
        }
        let compJSON = JSON.stringify(obj.kit);
        //let stepsJSON = JSON.stringify(obj.stepXprod);

        let comp = obj.kit;
        let step = obj.stepXprod;

        this.setState({
          productOrder: newProdOrder,
        });

        if (!comp) {
          this.setState({
            tableComp: [],
          });
        } else {
          this.setState({
            tableComp: comp.products,
          });
          this.setState({
            tableCompFixa: comp.products,
          });
          tableCompAux = obj.kit.products;
        }

        if (!step) {
          this.setState({
            tableSteps: [],
          });
        } else {
          for (const priority of step.steps) {
            priority.statusEtapa = '';
          }

          this.setState({
            tableSteps: step.steps,
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

  dataChange = (date, dataString) => {
    let newProdOrder = this.state.productOrder;
    // let data1 = moment(dataString).format('DD-MM-YYYY');
    // let data2 = moment(date).format('DD-MM-YYYY');
    //console.log(data1, data2);
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
    // let data1 = moment(dataString).format('DD-MM-YYYY');
    // let data2 = moment(date).format('DD-MM-YYYY');
    //console.log(data1, data2);
    newProdOrder['dataEntrega'] = dataString;
    this.setState({
      productOrder: newProdOrder,
    });

    this.setState({
      dataEntrega: date,
    });
  };

  _handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      // tableCompAux = obj.kit[0].products;
      let auxPrioridade = this.state.listProdsOfOrderProd;

      auxPrioridade.forEach((obj) => {
        if (obj.cod === this.state.productOrder.product_cod) {
          tableCompAux = obj.kit[0].products;
        }
      });
      let newProdOrder = this.state.productOrder;
      let table = this.state.tableComp;

      let tableaux = [];
      let tableInicial = tableCompAux;

      for (const comp of table) {
        tableaux.push(comp);
      }
      for (const co of tableaux) {
        for (const fix of tableInicial) {
          if (co.key === fix.key) {
            co.qtde = (fix.qtde * parseInt(e.target.value)).toFixed(6);
          }
        }
      }

      this.setState({
        tableComp: tableaux,
      });

      newProdOrder['qtdePrevisto'] =
        e.target.value * this.state.productOrder.qtdebase;
      this.setState({
        productOrder: newProdOrder,
      });
    }
  };

  handleSave = (row) => {
    const newData = [...this.state.tableComp];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    // console.log(newData);
    this.setState({ tableComp: newData });
  };

  handleSaveSteps = (row) => {
    const newData = [...this.state.tableSteps];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    // console.log(newData);
    this.setState({ tableSteps: newData });
  };

  handleTip = (event) => {
    // console.log(event);
    let newMachine = this.state.productOrder;
    newMachine['status'] = event;
    this.setState({
      productOrder: newMachine,
    });
  };

  componentDidMount() {
    // this.getOrdemDeProducao();
    this.checkPrioridade();
  }

  atualizaQtdeProduzidaApontamentos = (order) => {
    let contadorQtdeProduzida = 0;

    let ultimaEtapa = order.etapas[order.etapas.length - 1];

    if (order.apontamentos !== undefined) {
      order.apontamentos.forEach((item) => {
        if (item.maquina === ultimaEtapa.maquina) {
          contadorQtdeProduzida += item.qtdeApontada;
        }
      });
    }

    this.setState({ qtdeProduzida: contadorQtdeProduzida });
  };

  createAndDownloadPdf = () => {
    this.setState({
      loading: true,
      loadingTip: 'Gerando pdf, aguarde...',
    });

    let emitente = localStorage.getItem('user');
    let objetOrder = this.state.productOrder;
    let prods;
    let product = this.state.productOrder.product;
    for (const iterator of this.state.listProdsOfOrderProd) {
      if (iterator.id === product) {
        prods = iterator;
      }
    }
    objetOrder['emitente'] = emitente;
    objetOrder['prods'] = prods;
    objetOrder['tablesteps'] = this.state.tableSteps;
    objetOrder['tableComp'] = this.state.tableComp;

    apiLinux
      .post('/create-pdf', objetOrder)
      .then(() => apiLinux.get('/fetch-pdf', { responseType: 'blob' }))
      .then((res) => {
        const pdfBlob = new Blob([res.data], { type: 'application/pdf' });

        saveAs(pdfBlob, `${this.state.productOrder.orderProduction}.pdf`);
        this.setState({ loading: false });

        //Agora vai imprimir a imagem do produto principal
        apiLinux
          .get(`/getFiles`, {
            params: this.state.productOrder.image,
          })
          .then((result) => {
            // console.log(result.request);
            // saveAs(result.request.responseURL);
            window.open(result.request.responseURL);
          })
          .catch(function (error) {
            console.log(error);
            // message.error('Erro ao buscar registro, tente novamente mais tarde!');
          });

        // api
        //   .post('/create-pdf2', objetOrder)
        //   .then(() => api.get('/fetch-pdf2', { responseType: 'blob' }))
        //   .then((res) => {
        //     const pdfBlob = new Blob([res.data], { type: 'application/pdf' });

        //     saveAs(pdfBlob, `${this.state.productOrder.orderProduction}.pdf`);
        //   });
      });
  };

  onOkLog = () => {
    this.setState({
      showLog: false,
    });
  };

  showModal = () => {
    api
      .get(`api/orderProd/calculateCustOnOrder`, {
        params: this.state.productOrder,
      })
      .then((result) => {
        let dataProd = [];
        dataProd = result.data;

        this.setState({
          showLog: true,
          logs: dataProd,
        });
      })
      .catch(function (error) {
        //console.log(error);
      });
  };

  handleOk = (e) => {
    this.setState({
      modalVisible: false,
    });
  };

  getFilhos = () => {
    let pai = this.state.productOrder;
    let METHOD = 'POST';
    let URL = `api/orderProd/getFilhos`;
    api({
      method: METHOD,
      url: URL,
      data: {
        pai: pai,
      },
    })
      .then((result) => {
        this.setState({
          listFilhos: result.data,
        });
      })
      .catch(function (error) {});
  };

  checkMachinesOnOrderProdmaq = () => {
    let id = this.state.productOrder.id;

    api
      .post('getOnlyOrderProdmaqByOrder', {idOrder: id})
      .then((result) => {
        console.log(result);

        this.setState({
          listOrderProdMaqOnApt: result.data
        })

      })
      .catch(function (error) {
        // console.log(error);
      });

  }

  onOkApontamento = async () => {
    //vai adicionar na lista de apontamentos
    this.setState({
      loadingApontamento: true,
    });
    try {
      if (
        this.state.apontamento.etapa === '' ||
        this.state.apontamento.maodeobra === '' ||
        this.state.apontamento.colaborador === '' ||
        this.state.apontamento.datainicio === ''
      ) {
        message.error('Todos os campos devem ser preenchidos');
        this.setState({ loadingApontamento: false });
        return;
      }

      if (
        moment(
          this.state.apontamento.dataFim.diff(this.state.apontamento.dataInicio)
        ) < 0
      ) {
        message.error('Data fim não pode ser inferior a data inicial!');
        this.setState({ loadingApontamento: false });
        return;
      }

      // console.log(moment(this.state.apontamento.datafim.diff(this.state.apontamento.datainicio)));

      // this.state.apontamento.temporealizado = moment(this.state.apontamento.datainicio.diff(this.state.apontamento.datafim));
      let mill = this.state.apontamento.dataFim.diff(
        this.state.apontamento.dataInicio
      );
      let hours =
        Math.floor(mill / (60 * 60 * 1000)).toString().length === 1
          ? '0' + Math.floor((mill / (60 * 60 * 1000)) % 60)
          : Math.floor((mill / (60 * 60 * 1000)) % 60);
      let minutes =
        Math.floor((mill / (60 * 1000)) % 60).toString().length === 1
          ? '0' + Math.floor((mill / (60 * 1000)) % 60)
          : Math.floor((mill / (60 * 1000)) % 60);
      let secconds =
        Math.floor((mill / 1000) % 60).toString().length === 1
          ? '0' + Math.floor((mill / 1000) % 60)
          : Math.floor((mill / 1000) % 60);

      this.state.apontamento.tempoRealizado =
        hours + ':' + minutes + ':' + secconds;

      //Agora vai gravar no banco
      let apontamento = {
        tipo: this.state.apontamento.tipo,
        qtdeApontada: this.state.apontamento.qtdeApontada,
        orderProd: this.state.productOrder.id,
        colaborador: this.state.apontamento.colaborador,
        etapa: this.state.apontamento.etapa,
        orderProdMaqId: this.state.apontamento.etapa,
        dataInicio: this.state.apontamento.dataInicio.format('DD/MM/YY HH:mm'),
        dataFim: this.state.apontamento.dataFim.format('DD/MM/YY HH:mm'),
        tempoRealizado: this.state.apontamento.tempoRealizado,
      };

      //Agora ele vai gravar no banco de dados.
      await api
        .post(`/createOnWeb/`, apontamento)
        .then((response) => {
          // apontamento.id = response.data.id;
          let list = [...this.state.apontamentos, response.data];
          // list.push(response.data);

          this.setState({
            apontamentos: list,
            modalAddApontamento: false,
            apontamento: {
              id: '',
              etapa: '',
              tipo: '',
              colaborador: '',
              dataInicio: moment(),
              dataFim: moment(),
              qtdeApontada: 0,
            },
            qtdeProduzida:
              parseInt(this.state.qtdeProduzida) +
              parseInt(apontamento.qtdeApontada),
          });

          message.success('Apontamento adicionado.');
        })
        .catch(function (error) {
          console.log(error);
          message.error(
            'Erro ao adicionar apontamento, erro: ' + error.response.message
          );
        });
    } catch (err) {
      console.log(err);
      message.error('Erro ao adicionar apontamento, erro: ' + err);
    }
    this.setState({ loadingApontamento: false });
  };

  onRemoveApontamento = async (id) => {
    this.setState({
      loading: true,
      loadingTip: 'Removendo registro, aguarde...',
    });

    let list = [...this.state.apontamentos];
    let item = list.find((item) => item.id === id);

    await api
      .delete(`/noteProd/${item.id}`)
      .then((response) => {
        message.success('Apontamento removido.');
        this.setState({
          apontamentos: list.filter((item) => item.id !== id),
          qtdeProduzida:
            parseInt(this.state.qtdeProduzida) - parseInt(item.qtdeApontada),
        });
      })
      .catch(function (error) {
        console.log(error.response);
        message.error(
          'Erro ao remover apontamento, erro: ' + error.response.statusText
        );
      });

    this.setState({ loading: false });
  };

  handleAddEtapa(etapa) {
    this.setState({
      loadingEtapa: true,
    });

    const lista = this.state.tableSteps;
    const last = lista[lista.length - 1];

    if (lista.length === 0) {
      etapa['sequencia'] = 1;
      etapa['key'] = 0;
    } else {
      etapa['key'] = last.key + 1;
      etapa['sequencia'] = last.sequencia + 1;
    }

    console.log(etapa);

    lista.push(etapa);

    //Envio a nova etapa para gravar no servidor

    this.setState({
      tableSteps: lista,
      loadingEtapa: false,
      modalAddEtapa: false,
    });

    message.success('Etapa adicionada !');

    //Descomentar no final
    // this.setState({ modalAddEtapa: false });
    // this.setState({ loadingEtapa: false });
  }

  handleDeleteEtapa(etapa, e) {
    console.log(etapa);
    if (etapa.statusEtapa !== 'planejada' && etapa.statusEtapa !== 'liberada') {
      message.warn(
        'Só é possivel remover estapas com status de Planejada ou liberada.'
      );
      return;
    }

    //Implementar a requisição no banco de dados para remover essa etapa.

    const newLTableSteps = this.state.tableSteps.filter(
      (item) => item.key !== etapa.key
    );

    console.log(newLTableSteps);

    this.setState({
      tableSteps: newLTableSteps,
    });
  }

  modalContent = () => {
    const modalColumns = [
      {
        title: 'Tempo Previsto',
        dataIndex: 'tempoPrevisto',
        key: 'tempoPrevisto',
        // eslint-disable-next-line
        render: (text) => <a>{text} Minutos</a>,
      },
      {
        title: 'Custo Previsto',
        dataIndex: 'custoPrevisto',
        key: 'custoPrevisto',

        // eslint-disable-next-line
        render: (text) => <a> R$ {text}</a>,
      },
      {
        title: 'Tempo Realizado',
        dataIndex: 'tempoRealizado',
        key: 'tempoRealizado',
      },
      {
        title: 'Custo Realizado',
        dataIndex: 'custoRealizado',
        key: 'custoRealizado',
        // eslint-disable-next-line
        render: (text) => <a>{text === undefined ? '' : 'R$ ' + text}</a>,
      },
    ];

    return (
      <>
        <Card className="gx-card" title="Ordem de Produção">
          <Table
            columns={modalColumns}
            bordered
            //dataSource={dataSource}
          />
        </Card>

        {this.state.productOrder.ordemPrincipal === 'Principal' ? (
          <Card className="gx-card" title="P.A + S.A">
            <Table
              columns={modalColumns}
              bordered
              //dataSource={dataSourcePASA}
            />
          </Card>
        ) : (
          ''
        )}
      </>
    );
  };

  Content = (orderPro, estabs, products, partner) => {
    let maquinas = this.state.listofMachines.filter((maq) => maq.type === "maquina");
    let montagens = this.state.listofMachines.filter((mtg) => mtg.type === "montagem" );

    let auxthis = this;

    let etapascolums = [
      {
        // title: text => <IntlMessages id="commondata.customers.lastname"/>,
        title: 'Sequencia',
        dataIndex: 'sequencia',
        key: 'sequencia',
      },
      {
        // title: text => <IntlMessages id="commondata.customers.lastname"/>,
        title: 'Etapa',
        dataIndex: 'etapas',
        key: 'etapas',
      },
      {
        title: 'Prioridade',
        dataIndex: 'prioridadeEtapa',
        key: 'prioridadeEtapa',
      },
      {
        title: 'Status',
        dataIndex: 'statusEtapa',
        key: 'statusEtapa',
        render: (text, record) => (
          <Select
            style={{ width: 200 }}
            key={record.key}
            disabled={true}
            //onChange={(e) => this.handleStatus(e, record, )}
            value={text === '' ? (record.statusEtapa = 'planejada') : text}
          >
            <Option value={'planejada'}>Planejada</Option>
            <Option value={'liberada'}>Liberada</Option>
            <Option value={'execução'}>Em execução</Option>
            <Option value={'finalizada'}>Finalizada</Option>
            <Option value={'pausada'}>Pausada</Option>
          </Select>
        ),
      },
      {
        title: 'Maquina',
        dataIndex: 'maquina',
        key: 'maquina',
        render: (text, record) => (
          <Select
            style={{ width: 120 }}
            key={record.key}
            disabled={record.statusEtapa === "liberada" || record.statusEtapa === "planejada" ? false : true}
            onChange={(e) => this.handleStatus(e, record, "maquina")}
            value={text === '' ? (record.maquina = '') : text}
          >
            <Option value={''}>Nenhum</Option>
            {maquinas.map((e) => {
                            return (
                              <Option value={e.cod}>
                                {e.cod}
                              </Option>
                            );
                          })}

            {/* <Option value={'planejada'}>Planejada</Option> */}
          </Select>
        ),
      },
      {
        title: 'Tempo',
        dataIndex: 'tempoMaquina',
        key: 'tempoMaquina',
        //editable: true,
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
        //editable: true,
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
        //editable: true,
      },
      {
        title: 'Montagem',
        dataIndex: 'montagem',
        key: 'montagem',
        render: (text, record) => (
          <Select
            style={{ width: 120 }}
            key={record.key}
            disabled={record.statusEtapa === "liberada" || record.statusEtapa === "planejada" ? false : true}
            onChange={(e) => this.handleStatus(e, record, "montagem")}
            value={text === '' ? (record.montagem = '') : text}
          >
            <Option value={''}>Nenhum</Option>
            {montagens.map((e) => {
                return (
                  <Option value={e.cod}>
                    {e.cod}
                  </Option>
                );
              })}
            {/* <Option value={'planejada'}>Planejada</Option> */}
          </Select>
        ),
      },
      {
        title: 'Tempo',
        dataIndex: 'tempoMontagem',
        key: 'tempoMontagem',
        //editable: true,
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
                  title: 'Tem certeza que deseja remover esta linha?',
                  onOk() {
                    auxthis.handleDeleteEtapa(record, e);
                  },
                  onCancel() {},
                });
              }}
            />
          </div>
        ),
      },
    ];

    const components = {
      body: {
        row: EditRow,
        cell: EditableCell,
      },
    };
    const columnsKit = this.kitcolums.map((col) => {
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

    const columnsEtapas = etapascolums.map((col) => {
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
          handleSave: this.handleSaveSteps,
        }),
      };
    });

    //   const rowSelection = {
    //     onChange: (selectedRowKeys, selectedRows) => {
    //       console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    //         this.setState({
    //             tableOfKitToMade: selectedRows
    //         });
    //     },
    //     getCheckboxProps: record => ({
    //       disabled: record.name === 'Disabled User', // Column configuration not to be checked
    //       name: record.name,
    //     }),
    //   };

    return (
      <div className="main">
        <Row>
          <Col span={24}>
            <Card type="inner" title="Cadastro ordem de produção">
              <Form layout="horizontal" size="small">
                <Row>
                  <Col lg={4} md={6} sm={12} xs={24}>
                    <div className="gx-form-row0">
                      <Form.Item label="Estabelecimento" required={true}>
                        <Select
                          value={orderPro.establishment}
                          // style={{ width: 160 }}
                          onChange={this.handleEstab}
                        >
                          {estabs.map((e) => {
                            return <Option value={e.id}>{e.name}</Option>;
                          })}
                        </Select>
                        {this.validator.message(
                          'establishments',
                          orderPro.establishment,
                          'required|alpha_num',
                          { className: 'text-danger' }
                        )}
                      </Form.Item>
                    </div>
                  </Col>
                  <Col lg={4} md={6} sm={12} xs={24}>
                    <div className="gx-form-row0">
                      <Form.Item label="Cliente" required={true}>
                        <Select
                          value={orderPro.partner}
                          // style={{ width: 160 }}
                          onChange={this.handlePartner}
                        >
                          {partner.map((e) => {
                            return (
                              <Option value={e.id}>
                                {e.name} - {e.lastname}
                              </Option>
                            );
                          })}
                        </Select>
                        {this.validator.message(
                          'partner',
                          orderPro.partner,
                          'required|alpha_num',
                          { className: 'text-danger' }
                        )}
                      </Form.Item>
                    </div>
                  </Col>
                  <Col lg={6} md={6} sm={12} xs={24}>
                    <div className="gx-form-row0">
                      <Form.Item
                        label="Data inicio de produção"
                        required={true}
                      >
                        <DatePicker
                          value={this.state.dataAux}
                          locale={locale}
                          format={'DD-MM-YYYY'}
                          onChange={this.dataChange}
                          style={{ width: '100%' }}
                        />
                        {this.validator.message(
                          'dataprod',
                          this.state.dataAux,
                          'required',
                          { className: 'text-danger' }
                        )}
                      </Form.Item>
                    </div>
                  </Col>
                  <Col lg={6} md={6} sm={12} xs={24}>
                    <div className="gx-form-row0">
                      <Form.Item label="Data fim da produção">
                        <Input
                          type="text"
                          disabled={true}
                          // style={{ width: 265 }}
                          value={orderPro.dataProdEnd}
                        />
                        {/* <DatePicker
                                                    value={this.state.dataAux}
                                                    locale={locale}
                                                    format={"DD-MM-YYYY"}
                                                    onChange={this.dataChange}
                                                /> */}
                        {/* {this.validator.message('dataprod', this.state.dataAux, 'required',{ className: 'text-danger' })} */}
                      </Form.Item>
                    </div>
                  </Col>
                  <Col lg={4} md={6} sm={12} xs={24}>
                    <div className="gx-form-row0">
                      <Form.Item label="Status">
                        <Select
                          value={orderPro.status}
                          onChange={this.handleTip}
                          // style={{ width: 160 }}
                        >
                          <Option value={'planejada'}>Planejada</Option>
                          <Option value={'liberada'}>Liberada</Option>
                          <Option value={'execução'}>Em execução</Option>
                          <Option value={'finalizada'}>Finalizada</Option>
                          <Option value={'pausada'}>Pausada</Option>
                        </Select>
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
                  <Col lg={4} md={6} sm={12} xs={24}>
                    <div className="gx-form-row0">
                      <Form.Item label="Linha Pedido Fox">
                        <Input
                          type="text"
                          disabled={true}
                          value={orderPro.itemOrderFox}
                          name="orderFox"
                          onChange={this.handleChange}
                        />
                      </Form.Item>
                    </div>
                  </Col>
                  <Col lg={6} md={8} sm={12} xs={24}>
                    <div className="gx-form-row0">
                      <Form.Item label="Ordem Principal">
                        <Input
                          type="text"
                          disabled={true}
                          // style={{ width: 265 }}
                          value={orderPro.ordemPrincipal}
                          name="orderFox"
                          onChange={this.handleChange}
                        />
                      </Form.Item>
                    </div>
                  </Col>
                  <Col lg={6} md={8} sm={12} xs={24}>
                    <div className="gx-form-row0">
                      <Form.Item label="Ordem Produção">
                        <Input
                          type="text"
                          // style={{ width: 265 }}
                          value={orderPro.orderProduction}
                          name="orderProduction"
                          disabled={true}
                          onChange={this.handleChange}
                        />
                      </Form.Item>
                    </div>
                  </Col>
                  <Col lg={4} md={6} sm={12} xs={24}>
                    <div className="gx-form-row0">
                      <Form.Item label="Prioridade">
                        <Input
                          type="number"
                          // style={{ width: 150 }}
                          value={orderPro.prioridade}
                          min={0}
                          name="prioridade"
                          onChange={this.handleChange}
                        />
                      </Form.Item>
                    </div>
                  </Col>
                  <Col lg={4} md={6} sm={12} xs={24}>
                    <div className="gx-form-row0">
                      <Form.Item label="Data Entrega">
                        <DatePicker
                          value={this.state.dataEntrega}
                          locale={locale}
                          format={'DD-MM-YYYY'}
                          onChange={this.dataChangeEntrega}
                        />
                      </Form.Item>
                    </div>
                  </Col>
                  <Col lg={4} md={6} sm={12} xs={24}>
                    <div className="gx-form-row0">
                      <Form.Item label="Data Emissão">
                        <DatePicker
                          value={
                            orderPro.createdAt === ''
                              ? ''
                              : moment(orderPro.createdAt)
                          }
                          disabled={true}
                          locale={locale}
                          format={'DD-MM-YYYY'}
                        />
                      </Form.Item>
                    </div>
                  </Col>
                </Row>
              </Form>
            </Card>
            <Card type="inner" title="Produto resultante">
              <Row>
                <Col lg={10} md={12} sm={12} xs={24}>
                  <div className="gx-form-row0">
                    <Form.Item label="Produto" required={true}>
                      <Select
                        showSearch
                        value={orderPro.product}
                        style={{ width: 250 }}
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
                        'required|alpha_num',
                        { className: 'text-danger' }
                      )}
                    </Form.Item>
                  </div>
                </Col>
                <Col lg={4} md={6} sm={12} xs={24}>
                  <div className="gx-form-row0">
                    <Form.Item label="Descrição">
                      <Input
                        type="text"
                        // style={{ width: 200 }}
                        value={orderPro.description}
                        disabled={true}
                        name="description"
                        onChange={this.handleChange}
                      />
                    </Form.Item>
                  </div>
                </Col>
                <Col lg={4} md={8} sm={12} xs={24}>
                  <div className="gx-form-row0">
                    <Form.Item label="Unidade">
                      <Input
                        type="text"
                        value={orderPro.unity}
                        name="unity"
                        disabled={true}
                        onChange={this.handleChange}
                      />
                    </Form.Item>
                  </div>
                </Col>

                <Col lg={4} md={8} sm={12} xs={24}>
                  <div className="gx-form-row0">
                    <Form.Item label="Qtde a produzir" required={true}>
                      <Popconfirm
                        placement="right"
                        title="Para alterar a quantidade dos Kit,
                                                pressione Enter "
                        okText="Ok"
                      >
                        <Input
                          type="text"
                          value={orderPro.qtde}
                          name="qtde"
                          //disabled={this.state.isNew === true ? false : true}
                          onKeyDown={this._handleKeyDown}
                          onChange={this.handleChange}
                        />
                        {this.validator.message(
                          'qtde',
                          orderPro.qtde,
                          'required|alpha_num',
                          { className: 'text-danger' }
                        )}
                      </Popconfirm>
                    </Form.Item>
                  </div>
                </Col>

                <Col lg={4} md={8} sm={12} xs={24}>
                  <div className="gx-form-row0">
                    <Form.Item label="Qtde produzida ">
                      <Input
                        type="text"
                        disabled={true}
                        value={this.state.qtdeProduzida}
                        name="qtdeProduzida"
                        onChange={this.handleChange}
                      />
                    </Form.Item>
                  </div>
                </Col>
              </Row>
            </Card>
            <Card type="inner" title="Necessidades">
              <Table
                components={components}
                rowClassName={() => 'editable-row'}
                bordered
                className="gx-table-responsive"
                columns={columnsKit}
                dataSource={this.state.tableComp}
                size="small"
                rowKey="id"
                span={24}
                style={{ margin: '-15px -24px' }}
              />
            </Card>

            <Card type="inner" title="Etapas">
              <Row type="flex">
                <Col>
                  <Button
                    type="primary"
                    // disabled={!this.state.canDelete}
                    onClick={() => this.setState({ modalAddEtapa: true })}
                  >
                    Adicionar etapa
                  </Button>
                </Col>
              </Row>
              <br />
              <Table
                components={components}
                rowClassName={() => 'editable-row'}
                bordered
                className="gx-table-responsive"
                columns={columnsEtapas}
                dataSource={this.state.tableSteps}
                rowKey="id"
                size="small"
                style={{ margin: '-15px -24px' }}
              />
            </Card>

            {/* Apontamentos de produção */}
            <Card type="inner" title="Apontamentos de produção">
              <Row type="flex">
                <Col>
                  <Button
                    type="primary"
                    disabled={!this.state.canDelete}
                    onClick={() => this.setState({ modalAddApontamento: true })}
                  >
                    Adicionar apontamento
                  </Button>
                </Col>
              </Row>
              <br />
              <Table
                components={components}
                rowClassName={() => 'editable-row'}
                bordered
                className="gx-table-responsive"
                columns={this.apontamentoColumns}
                dataSource={this.state.apontamentos}
                rowKey="id"
                size="small"
                style={{ margin: '-15px -24px' }}
              />
            </Card>

            {/* </Row> */}
          </Col>
        </Row>
      </div>
    );
  };

  render() {
    const menu = (
      <Menu>
        <Menu.Item key="1" onClick={this.showModal}>
          Calc. Tempo e Custo
        </Menu.Item>

        <Menu.Item key="1" onClick={this.createAndDownloadPdf}>
          <i className="icon icon-long-arrow-down" />
          &nbsp; Relatorio PDF
        </Menu.Item>
      </Menu>
    );

    return (
      <Spin spinning={this.state.loading} tip={this.state.loadingTip}>
        <Row>
          <Col lg={5} md={5} sm={24} xs={24}>
            {this.LeftList()}
          </Col>
          <Col lg={15} md={15} sm={24} xs={24}>
            {this.Content(
              this.state.productOrder,
              this.state.listofEstabs,
              this.state.listProdsOfOrderProd,
              this.state.listofPartner
            )}
          </Col>
          <Col lg={4} md={4} sm={24} xs={24}>
            <Card type="inner" title="Ordem de Produção">
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
                disabled={!this.state.canSave}
                onClick={this.onHandleClickSave}
              >
                Salvar
              </Button>
              <br />
              <Button
                block
                type="primary"
                className="gx-btn-red"
                disabled={!this.state.canDelete}
                onClick={this.onHandleClickDelete}
              >
                Excluir
              </Button>
              {this.state.isNew === true ? (
                ''
              ) : (
                <Dropdown overlay={menu}>
                  <Button block>
                    Outras <Icon type="down" />
                  </Button>
                </Dropdown>
              )}

              {/* <Modal
                                title="Calculo tempo e custo"
                                visible={this.state.modalVisible}
                                onOk={this.handleOk}
                                onCancel={this.handleOk}
                                >
                                {this.modalContent()}
                            </Modal> */}

              <Log
                showLog={this.state.showLog}
                onOkLog={this.onOkLog}
                logs={this.state.logs}
              />

              <AddApontamento
                apontamento={this.state.apontamento}
                showAddApontamento={this.state.modalAddApontamento}
                onOk={() => this.onOkApontamento()}
                onCancel={() =>
                  this.setState({ modalAddApontamento: false, apontamento: [] })
                }
                onChange={this.handleChangeApontamento}
                listofMachines={this.state.listofMachines}
                listaEtapas={this.state.listOrderProdMaqOnApt}
                confirmLoading={this.state.loadingApontamento}
              />
              <AddEtapa
                etapa={this.state.etapa}
                showAddEtapa={this.state.modalAddEtapa}
                onOk={this.handleAddEtapa}
                onCancel={() =>
                  this.setState({ modalAddEtapa: false, etapa: [] })
                }
                onChange={this.handleChangeApontamento}
                listofMachines={this.state.listofMachines}
                confirmLoading={this.state.loadingEtapa}
              />
            </Card>
          </Col>
        </Row>
      </Spin>
    );
  }
}

export default ProdOrder;
