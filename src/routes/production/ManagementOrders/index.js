import React, { Component } from 'react';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  message,
  Spin,
  Select,
  DatePicker,
  Table,
  Button,
  Tag,
} from 'antd';
import history from 'util/history';
import locale from 'moment/locale/pt-br';
import api from 'util/Api';
import EllipsisTooltip from 'components/EllipsisTooltip';
import moment from 'moment';
const { Option } = Select;
var _ = require('lodash');
const model2 = 'establishment';
const model3 = 'product';
const model4 = 'partner';
const model5 = 'category';

class ManagementOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isNew: true,
      loader: true,
      productOrder: {
        establishment: 1,
        product: '',
        productCateg: '',
        partner: '',
        dataProd: '',
        status: [],
        dataProdIni: '',
        dataProdFim: '',
        dataEntregaIni: '',
        dataEntregaFim: '',
        prioridadeEtapaIni: '',
        prioridadeEtapaFim: '',
      },
      newOrderProdEdit: {
        prioridade: '',
      },
      canNew: true,
      canSave: true,
      canDelete: false,
      loading: false,
      listofEstabs: [],
      listofProds: [],
      listofPartner: [],
      listofcateg: [],
      listOrdens: [],
      tableResult: [],
      listofMaquinas: [],
      auxtrava: false,
      listofOrderprodMaquina: [],
      totalTempoPrevisto: '00:00:00',
      totalCustoPrevisto: 0,
      totalTempoRealizado: '00:00:00',
      totalCustoRealizado: 0,
    };

    this.columnsOrders = [
      {
        title: 'Código da ordem',
        dataIndex: 'orderProduction',
        key: 'orderProduction',
        width: 150,
        align: 'center',
        onCell: () => {
          return {
            style: {
              whiteSpace: 'nowrap',
              maxWidth: 150,
            },
          };
        },
        render: (text) => (
          <EllipsisTooltip title={text}>{text}</EllipsisTooltip>
        ),
      },
      // {
      //   title: 'Ordem Principal',
      //   dataIndex: 'ordemPrincipal',
      //   key: 'ordemPrincipal',
      //   width: 150,
      //   align: 'center',
      //   onCell: () => {
      //     return {
      //       style: {
      //         whiteSpace: 'nowrap',
      //         maxWidth: 150,
      //       },
      //     };
      //   },
      //   render: (text) => (
      //     <EllipsisTooltip title={text}>{text}</EllipsisTooltip>
      //   ),
      //   // render: (text) => <span>{text === "" ? "Sem dados" : text}</span>
      // },
      {
        title: 'Status da Ordem',
        dataIndex: 'status',
        key: 'status',
        width: 150,
        align: 'center',
        render: (text) => text.toUpperCase()
        // render: (text, record) => {
        //   return (
        //     <span>
        //       <Select
        //         defaultValue={
        //           record.status === '' || record.status === undefined
        //             ? ''
        //             : record.status
        //         }
        //         onChange={(e) => this.changeSelect(e, record)}
        //         key={record.id}
        //         style={{ width: '100%' }}
        //       >
        //         <Option value={'planejada'}>Planejada</Option>
        //         <Option value={'liberada'}>Liberada</Option>
        //         <Option value={'execução'}>Em execução</Option>
        //         <Option value={'finalizada'}>Finalizada</Option>
        //         <Option value={'pausada'}>Pausada</Option>
        //       </Select>
        //     </span>
        //   );
        // },
      },
      {
        title: 'Código do Produto',
        dataIndex: 'productObj.cod',
        width: 120,
        key: 'product',
      },
      {
        title: 'Prioridade Ordem de Produção',
        width: 95,
        align: 'center',
        dataIndex: 'prioridade',
        key: 'prioridade',
        // render: (text, record) => {
        //   return (
        //     <span>
        //       <Input
        //         defaultValue={
        //           record.prioridade === '' || record.prioridade === undefined
        //             ? ''
        //             : record.prioridade
        //         }
        //         min={1}
        //         key={record.id}
        //         type="number"
        //         name="prioridade"
        //         onChange={(e) => this.changeOrder(e, record)}
        //         style={{ textAlign: 'center' }}
        //       />
        //     </span>
        //   );
        // },
      },
      {
        title: 'Qtde a Produzir',
        width: 100,
        align: 'center',
        dataIndex: 'qtde',
        key: 'qtde',
      },

      {
        title: 'Qtde Produzida',
        width: 100,
        align: 'center',
        dataIndex: 'qtdeProduzida',
        key: 'qtdeProduzida',
        render: (text, record) => {
          let somaQtde = 0;
          if (record.apontamentos !== undefined) {
            for (const iterator of record.apontamentos) {
              somaQtde += iterator.qtdeApontada;
            }
          }

          return <text>{somaQtde}</text>;
        },
        //render: (text) => (<p>{text === null || text === 0 || text === "" ? "Sem dados" : text}</p>)
      },
      {
        title: 'Saldo',
        width: 100,
        align: 'center',
        dataIndex: 'tempoEcustos[0].saldo',
        key: 'saldo',
        render: (text) => {
          return <p>{text}</p>;
        },
      },
      {
        title: 'Pedido Cliente',
        dataIndex: 'pedidoCliente',
        width: 90,
        key: 'pedidoCliente',
        align: 'center',
      },
      {
        title: 'Pedido Venda',
        dataIndex: 'orderFox',
        width: 100,
        key: 'orderFox',
        align: 'center',
      },
      {
        title: 'Data Emissão',
        dataIndex: 'createdAt',
        width: 140,
        key: 'createdAt',
        align: 'center',
        render: (text, record) => (
          <span>
            <DatePicker
              defaultValue={
                record.createdAt === '' || record.createdAt === undefined
                  ? ''
                  : moment(record.createdAt)
              }
              locale={locale}
              key={record.id}
              disabled={true}
              format={'DD-MM-YYYY'}
              //onChange={(e,dataEmTexto) => this.dataChangeOrder(record, e,dataEmTexto)}
            />
          </span>
        ),
      },
      {
        title: 'Data Entrega',
        dataIndex: 'dataEntrega',
        width: 140,
        key: 'dataEntrega',
        align: 'center',
        render: (text, record) => (
          <span>
            <DatePicker
              defaultValue={
                record.dataEntrega === '' || record.dataEntrega === undefined
                  ? ''
                  : moment(record.dataEntrega, 'DD-MM-YYYY')
              }
              locale={locale}
              key={record.id}
              format={'DD-MM-YYYY'}
              disabled={true}
              onChange={(e, dataEmTexto) =>
                this.dataChangeOrderEntrega(record, e, dataEmTexto)
              }
            />
          </span>
        ),
      },
      {
        title: 'Data Inicio',
        dataIndex: 'dataProd',
        width: 140,
        key: 'dataProd',
        align: 'center',
        render: (text, record) => (
          <span>
            <DatePicker
              defaultValue={
                record.dataProd === '' || record.dataProd === undefined
                  ? ''
                  : moment(record.dataProd, 'DD-MM-YYYY')
              }
              locale={locale}
              key={record.id}
              format={'DD-MM-YYYY'}
              disabled={true}
              onChange={(e, dataEmTexto) =>
                this.dataChangeOrder(record, e, dataEmTexto)
              }
            />
          </span>
        ),
      },
      {
        title: 'Tempo previsto',
        width: 100,
        dataIndex: 'tempoEcustos[0].tempoPrevisto',
        key: 'tempoPrevisto',
        render: (text) => {
          return (
            <Tag color="blue">
              {text
                ? Math.floor(parseInt(text) / 60) + ':' + (parseInt(text) % 60)
                : '0:00'}{' '}
              hrs{' '}
            </Tag>
          );
        },
      },
      {
        title: 'Tempo Realizado',
        width: 100,
        dataIndex: 'tempoEcustos[0].tempoRealizado',
        key: 'tempoRealizado',
        align: 'center',
        render: (text, record) => {
          let inicioTempo = '00:00:00';
          let somasTempo;
          let index = 0;

          if(record.apontamentos.length === 0){
            somasTempo = inicioTempo
          }else{
            for (const iterator of record.apontamentos) {
              if(index === 0){
                somasTempo = addTimes(inicioTempo , iterator.tempoRealizado)
              }else{
                somasTempo = addTimes(somasTempo , iterator.tempoRealizado)
              }
              index = index + 1
            }
          }
          return (<Tag color="blue">{somasTempo} </Tag>)
        },
      },
      {
        title: 'Custo Previsto',
        width: 120,
        align: 'center',
        dataIndex: 'tempoEcustos[0].custoPrevisto',
        key: 'tempoEcustos',
        render: (text) => {
          return (
            <Tag color="green">
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format(text)}
            </Tag>
          );
        },
      },
      {
        title: 'Custo Realizado',
        width: 120,
        align: 'center',
        dataIndex: 'tempoEcustos[0].custoRealizado',
        key: 'custoRealizado',
        render: (text) => {
          return (
            <Tag color="green">
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format(text)}
            </Tag>
          );
        },
      },
      {
        title: 'Cliente',
        width: 100,
        align: 'center',
        dataIndex: 'partnerObj.razao_social',
        key: 'partner',
        onCell: () => {
          return {
            style: {
              whiteSpace: 'nowrap',
              maxWidth: 100,
            },
          };
        },
        render: (text) => (
          <EllipsisTooltip title={text}>{text}</EllipsisTooltip>
        ),
      },

      {
        title: 'Estabelecimento',
        width: 110,
        dataIndex: 'establishmentsObj.name',
        key: 'establishments',
        onCell: () => {
          return {
            style: {
              whiteSpace: 'nowrap',
              maxWidth: 110,
            },
          };
        },
        render: (text) => (
          <EllipsisTooltip title={text}>{text}</EllipsisTooltip>
        ),
      },
    ];

    this.handleChange = this.handleChange.bind(this);
    this.setStateNew = this.setStateNew.bind(this);
    this.fetchListaDeOrdens = this.fetchListaDeOrdens.bind(this);
    this.onHandleClickSave = this.onHandleClickSave.bind(this);
    this.onHandleClickNew = this.onHandleClickNew.bind(this);
    // this.handleSubmit = this.handleSubmit.bind(this);

    this.leftListChild = React.createRef();
    // console.log('Constructor ----');
  }

  onHandleClickNew = () => {
    this.setStateNew();
  };

  changeOrder = (event, record) => {
    record.prioridade = parseInt(event.target.value);
  };
  //Data Inicio
  dataChangeOrder = (date, dataString, dataEmTexto) => {
    date.dataProd = dataEmTexto;
  };

  //Data Entrega
  dataChangeOrderEntrega = (date, dataString, dataEmTexto) => {
    date.dataEntrega = dataEmTexto;
  };

  dataChangeEmissao = (date, dataString) => {
    // console.log(date,dataString);
    let newProdOrder = this.state.productOrder;

    newProdOrder['createdAt'] = date;

    this.setState({
      productOrder: newProdOrder,
    });
    this.setState({
      dataEmissao: date,
    });
  };

  changeSelect = (event, record) => {
    record.status = event;
  };

  handleEditOrder = async (lista) => {
    let parent = this;
    let METHOD = 'PATCH';

    try {
      for (let index = 0; index < lista.length; index++) {
        const record = lista[index];
        let URL = `orderprod/${record.id}`;
        const {
          dataProd,
          orderFox,
          description,
          orderProduction,
          qtde,
          unity,
          status,
          pedidoCliente,
          prioridade,
          components,
          etapas,
          dataEntrega,
        } = record;

        this.setState({
          loading: true,
          loadingTip: 'Alterando registro, Aguarde...',
        });

        await api({
          method: METHOD,
          url: URL,
          data: {
            description: description,
            dataProd: dataProd,
            dataEntrega: dataEntrega,
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
        });
      }
      await parent.setStateNew();
    } catch (error) {
      message.error('Erro ao gravar registro, tente novamente mais tarde!');
    }
  };

  componentWillMount() {
    this.getEstabs();
    this.getProducts();
    this.getCategs();
    this.getPartner();
    this.getOrdens();
    this.getMaquinas();
  }

  getMaquinas() {
    api
      .get(`orderProdMaquina/getOnlyMaquinas`, {})
      .then((result) => {
        let dataProd = [];
        dataProd = result.data.data;
        // console.log(result.data);

        this.setState({
          listofMaquinas: dataProd,
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  getOrdens() {
    api
      .get(`orderProd/`, {})
      .then((result) => {
        let dataProd = [];
        dataProd = result.data.data;

        this.setState({
          listOrdens: dataProd,
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  getProducts() {
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

  getCategs() {
    api
      .get(`${model5}`, {})
      .then((result) => {
        let dataCateg = [];
        dataCateg = result.data.data;
        this.setState({
          listofcateg: dataCateg,
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  fetchListaDeOrdens = () => {
    this.setState({
      productOrder: {
        establishment: 1,
        product: '',
        partner: '',
        dataProd: '',
        status: [],
        loading: false,
      },
      dataAux: '',
      dataEmissao: '',
      dataEntrega: '',
      tableResult: [],
      listofOrderprodMaquina: [],
    });
  };

  onHandleClickSave = () => {
    // console.log(this.state.model);
    let record = this.state.productOrder;
    var parent = this;

    this.setState({
      loading: true,
      loadingTip: 'Pesquisando os registros, aguarde...',
    });
    //Verifica se é uma atualizacao (PUT) ou novo registro (POST)
    let METHOD = 'POST';
    let URL = `api/orderProd/gerenciarOrdens`;

    // console.log('onHandleSaveButton', record);
    const {
      dataProd,
      dataEntrega,
      establishment,
      partner,
      product,
      orderFox,
      orderProduction,
      status,
      pedidoCliente,
      ordemPrincipal,
      prioridade,
    } = record;
    api({
      method: METHOD,
      url: URL,
      data: {
        order: this.state.productOrder,
        establishments: establishment,
        prioridade: prioridade,
        product: product,
        partner: partner,
        dataProd: dataProd,
        dataEntrega: dataEntrega,
        pedidoCliente: pedidoCliente,
        orderFox: orderFox,
        ordemPrincipal: ordemPrincipal,
        orderProduction: orderProduction,
        status: status,
      },
    })
      .then((result) => {
        //Caso consiga recuperar o model, ele atualiza a tela e para de carregar
        console.log(result);
        message.success('Ordens filtradas!');

        console.log('result data', result.data);

        parent.setStateEdit(result.data);
        // parent.leftListChild.current.fetchLeftList()
      })
      .catch(function (error) {
        // console.log(error);
        parent.setStateEdit(record);
        message.error('Erro ao gravar registro, tente novamente mais tarde!');
      });
  };

  onClickSearchMaquina = () => {
    // console.log(this.state.model);
    let record = this.state.productOrder;
    var parent = this;

    this.setState({
      loading: true,
      loadingTip: 'Pesquisando os registros, aguarde...',
    });
    //Verifica se é uma atualizacao (PUT) ou novo registro (POST)
    let METHOD = 'POST';
    let URL = `orderProdMaquina/getMaquinasForPrioridade`;

    // console.log('onHandleSaveButton', record);
    const { maquina } = record;
    api({
      method: METHOD,
      url: URL,
      data: {
        maquina: maquina,
      },
    })
      .then((result) => {
        //Caso consiga recuperar o model, ele atualiza a tela e para de carregar
        // console.log(result);
        // message.success('Ordens filtradas!');

        parent.setState({
          canSave: true,
          canNew: true,
          canDelete: true,
          loading: false,
          isNew: false,
          listofOrderprodMaquina: result.data,
        });
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
        status: '',
      },
      dataAux: '',
      dataEntrega: '',
      loading: false,
      isNew: true,
      refreshLeftList: false,
      tableResult: [],
    });

    this.onHandleClickSave();
  };
  //Seta o estado para edição
  setStateEdit = (model) => {
    // console.log(model);
    // let dataAux = moment(model.dataProd);
    // model["establishment"] = model.establishments.id
    // model["product"] = model.product.id
    // model['partner'] = model.partner.id
    this.setState({
      canSave: true,
      canNew: true,
      canDelete: true,
      loading: false,
      isNew: false,
      tableResult: _.sortBy(model, [
        (o) => {
          return o.prioridade;
        },
      ]),
    });

    // console.log('model',model);
    let totalTempoPrevisto = '00:00:00',
      totalCustoPrevisto = 0,
      totalTempoRealizado = '00:00:00c',
      totalCustoRealizado = 0;
    if (model.length >= 0) {
      model.forEach((item) => {
        if (item.tempoEcustos[0] !== undefined) {
          totalCustoPrevisto += item.tempoEcustos[0].custoPrevisto;
          totalCustoRealizado += item.tempoEcustos[0].custoRealizado;
          totalTempoPrevisto = this.addTimes(
            totalTempoPrevisto,
            item.tempoEcustos[0].tempoPrevisto
          );
          // totalTempoRealizado = this.addTimes(totalTempoRealizado, item.tempoEcustos[0].tempoRealizado);
          let tempoRealizado = item.tempoEcustos[0].tempoRealizado;
          if (tempoRealizado !== '0' && tempoRealizado !== null) {
            let pos1 = tempoRealizado.indexOf(':');
            let pos2 = totalTempoRealizado.indexOf(':');
            // console.log(pos1);
            // console.log(item.tempoRealizado);
            // console.log(String(item.tempoRealizado).subStr(0,2))
            // let hora = parseInt(item.tempoRealizado.substr(0,pos1)) + parseInt(item.tempoRealizado.substr(0,pos2))
            let hora =
              parseInt(tempoRealizado.substr(0, pos1)) +
              parseInt(totalTempoRealizado.substr(0, pos2));
            let min =
              parseInt(tempoRealizado.substr(pos1 + 1, 2)) +
              parseInt(totalTempoRealizado.substr(pos2 + 1, 2));
            let seg =
              parseInt(tempoRealizado.substr(pos1 + 4, 2)) +
              parseInt(totalTempoRealizado.substr(pos2 + 4, 2));

            let mil = (hora * 60 * 60 + min * 60 + seg) * 1000;
            // console.log(mil);
            hora =
              Math.floor(mil / (60 * 60 * 1000)).toString().length === 1
                ? '0' + Math.floor(mil / (60 * 60 * 1000)).toString()
                : Math.floor(mil / (60 * 60 * 1000)).toString();
            min =
              Math.floor((mil / (60 * 1000)) % 60).toString().length === 1
                ? '0' + Math.floor((mil / (60 * 1000)) % 60).toString()
                : Math.floor((mil / (60 * 1000)) % 60).toString();
            seg =
              Math.floor((mil / 1000) % 60).toString().length === 1
                ? '0' + Math.floor((mil / 1000) % 60).toString()
                : Math.floor((mil / 1000) % 60).toString();

            totalTempoRealizado = hora + ':' + min + ':' + seg;
          }
        }
      });

      totalCustoPrevisto = totalCustoPrevisto.toFixed(2);
      totalCustoRealizado = totalCustoRealizado.toFixed(2);
    }

    this.setState({
      totalTempoPrevisto,
      totalCustoPrevisto,
      totalTempoRealizado,
      totalCustoRealizado,
    });
    // console.log(reduce.reduce((sum, object) => sum + parseInt(object.tempoEcustos[0].custoPrevisto),0))
  };

  addTimes(startTime, tempo) {
    if (tempo === undefined) {
      return startTime;
    }

    console.log(startTime, tempo);

    var times = [0, 0, 0];
    var max = times.length;

    var a = (startTime || '').split(':');
    // var b = (endTime || '').split(':')

    // normalize time values
    for (var i = 0; i < max; i++) {
      a[i] = isNaN(parseInt(a[i])) ? 0 : parseInt(a[i]);
      //   b[i] = isNaN(parseInt(b[i])) ? 0 : parseInt(b[i])
    }

    // store time values
    for (var f = 0; f < max; f++) {
      times[f] = a[f]; //+ b[i]
    }

    var hours = times[0];
    var minutes = times[1] + tempo;
    var seconds = times[2];

    if (seconds >= 60) {
      var m = (seconds / 60) << 0;
      minutes += m;
      seconds -= 60 * m;
    }

    if (minutes >= 60) {
      var h = (minutes / 60) << 0;
      hours += h;
      minutes -= 60 * h;
    }

    return (
      ('0' + hours).slice(-2) +
      ':' +
      ('0' + minutes).slice(-2) +
      ':' +
      ('0' + seconds).slice(-2)
    );
  }

  handleChange(event) {
    let newOrder = this.state.productOrder;
    newOrder[event.target.name] = event.target.value;

    this.setState(() => ({
      productOrder: newOrder,
    }));
  }

  // LeftList = () => {
  //     return (
  //         <ListOrdemPro onClickRow={this.handleOnClickRow1  }  ref={this.leftListChild} />
  //     )
  // }

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
  handlePrincipal = (event) => {
    let auxList = this.state.listOrdens;
    let newProdOrder = this.state.productOrder;

    // console.log(event);
    if (event === 'Principal') {
      newProdOrder['ordemPrincipal'] = event;

      console.log(newProdOrder);
      this.setState({
        productOrder: newProdOrder,
      });
    } else {
      auxList.map((obj) => {
        if (obj.id === event) {
          newProdOrder['ordemPrincipal'] = obj.orderProduction;
          this.setState({
            productOrder: newProdOrder,
          });
        }
        return '';
      });
    }
  };

  handleOrdem = (event) => {
    let auxList = this.state.listOrdens;
    let newProdOrder = this.state.productOrder;

    auxList.map((obj) => {
      if (obj.id === event) {
        newProdOrder['orderProduction'] = obj.orderProduction;
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
        // console.log(obj);
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
          //tableCompAux = obj.kit[0].products;
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
  handleCateg = (event) => {
    let auxList = this.state.listofcateg;
    let newProdOrder = this.state.productOrder;

    auxList.map((obj) => {
      if (obj.id === event) {
        newProdOrder['productCateg'] = obj.id;
        this.setState({
          productOrder: newProdOrder,
        });
      }
      return '';
    });
  };
  hangleChangeV2 = (name) => (value) => {
    let newObj = this.state.productOrder;
    newObj[name] = value; //moment(value).format('DD-MM-YYYY');
    console.log(newObj);

    this.setState({
      productOrder: newObj,
    });
  };

  dataChange = (date, dataString) => {
    let newProdOrder = this.state.productOrder;
    // let data1 = moment(dataString).format('DD-MM-YYYY');
    // let data2 = moment(date).format('DD-MM-YYYY');
    // console.log(data1, data2, dataString);
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
    let data1 = moment(dataString).format('DD-MM-YYYY');
    let data2 = moment(date).format('DD-MM-YYYY');
    console.log(data1, data2);
    newProdOrder['dataEntrega'] = dataString;
    this.setState({
      productOrder: newProdOrder,
    });

    this.setState({
      dataEntrega: date,
    });
  };

  handleSave = (row) => {
    const newData = [...this.state.tableComp];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    console.log(newData);
    this.setState({ tableComp: newData });
  };

  handleTip = (event) => {
    console.log(event);
    let newMachine = this.state.productOrder;
    newMachine['status'] = event;
    this.setState({
      productOrder: newMachine,
    });
  };

  Content = (orderPro, estabs, products, partner, ordens, categs) => {
    return (
      <div className="main">
        <Row>
          <Col span={24}>
            <Card type="inner" title="Gerenciamento de ordens.">
              <Form layout="horizontal">
                <Row>
                  <Col lg={4} md={6} sm={12} xs={24}>
                    <div className="gx-form-row0">
                      <Form.Item label="Estabelecimento">
                        <Select
                          value={orderPro.establishment}
                          // style={{ width: 250 }}
                          onChange={this.handleEstab}
                        >
                          {estabs.map((e) => {
                            return <Option value={e.id}>{e.name}</Option>;
                          })}
                        </Select>
                      </Form.Item>
                    </div>
                  </Col>
                  <Col lg={4} md={8} sm={12} xs={24}>
                    <div className="gx-form-row0">
                      <Form.Item label="Cliente">
                        <Select
                          showSearch
                          value={orderPro.partner}
                          // style={{ width: 250 }}
                          onChange={this.handlePartner}
                          filterOption={(inputValue, option) =>
                            //option.props.children[0].concat(option.props.children[1],option.props.children[2]).toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                            option.props.children
                              .toUpperCase()
                              .indexOf(inputValue.toUpperCase()) >= 0
                          }
                        >
                          {partner.map((e) => {
                            return <Option value={e.id}>{e.name}</Option>;
                          })}
                        </Select>
                      </Form.Item>
                    </div>
                  </Col>

                  <Col lg={4} md={6} sm={12} xs={24}>
                    <div className="gx-form-row0">
                      <Form.Item label="Data de produção início">
                        <DatePicker
                          value={this.state.productOrder.dataProdIni}
                          format={'DD-MM-YYYY'}
                          name="dataProdIni"
                          locale={locale}
                          onChange={this.hangleChangeV2('dataProdIni')}
                        />
                      </Form.Item>
                    </div>
                  </Col>
                  <Col lg={4} md={6} sm={12} xs={24}>
                    <div className="gx-form-row0">
                      <Form.Item label="Data de produção fim">
                        <DatePicker
                          value={this.state.productOrder.dataProdFim}
                          format={'DD-MM-YYYY'}
                          locale={locale}
                          name="dataProdFim"
                          onChange={this.hangleChangeV2('dataProdFim')}
                        />
                      </Form.Item>
                    </div>
                  </Col>

                  <Col lg={4} md={6} sm={12} xs={24}>
                    <div className="gx-form-row0">
                      <Form.Item label="Data Entrega início">
                        <DatePicker
                          value={this.state.productOrder.dataEntregaIni}
                          format={'DD-MM-YYYY'}
                          locale={locale}
                          name="dataEntregaIni"
                          onChange={this.hangleChangeV2('dataEntregaIni')}
                        />
                      </Form.Item>
                    </div>
                  </Col>

                  <Col lg={4} md={6} sm={12} xs={24}>
                    <div className="gx-form-row0">
                      <Form.Item label="Data Entrega fim">
                        <DatePicker
                          value={this.state.productOrder.dataEntregaFim}
                          format={'DD-MM-YYYY'}
                          locale={locale}
                          name="dataEntregaFim"
                          onChange={this.hangleChangeV2('dataEntregaFim')}
                        />
                      </Form.Item>
                    </div>
                  </Col>

                  <Col lg={4} md={8} sm={12} xs={24}>
                    <div className="gx-form-row0">
                      <Form.Item label="Status">
                        <Select
                          value={orderPro.status}
                          onChange={this.handleTip}
                          mode="multiple"
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

                  <Col lg={4} md={8} sm={12} xs={24}>
                    <div className="gx-form-row0">
                      <Form.Item label="Pedido Cliente">
                        <Input
                          type="text"
                          // style={{ width: 150 }}
                          value={orderPro.pedidoCliente}
                          name="pedidoCliente"
                          onChange={this.handleChange}
                        />
                      </Form.Item>
                    </div>
                  </Col>

                  <Col lg={4} md={8} sm={12} xs={24}>
                    <div className="gx-form-row0">
                      <Form.Item label="Pedido Venda">
                        <Input
                          type="text"
                          // style={{ width: 150 }}
                          value={orderPro.orderFox}
                          name="orderFox"
                          onChange={this.handleChange}
                        />
                      </Form.Item>
                    </div>
                  </Col>

                  <Col lg={4} md={8} sm={12} xs={24}>
                    <div className="gx-form-row0">
                      <Form.Item label="Ordem Principal">
                        <Select
                          showSearch
                          value={orderPro.ordemPrincipal}
                          // style={{ width: 220 }}
                          onChange={this.handlePrincipal}
                          filterOption={(inputValue, option) =>
                            option.props.children
                              .toUpperCase()
                              .indexOf(inputValue.toUpperCase()) >= 0
                          }
                        >
                          <Option value={'Principal'}>Principal</Option>
                          {ordens.map((e) => {
                            return (
                              <Option value={e.id}>{e.orderProduction}</Option>
                            );
                          })}
                        </Select>
                      </Form.Item>
                    </div>
                  </Col>

                  <Col lg={4} md={8} sm={12} xs={24}>
                    <div className="gx-form-row0">
                      <Form.Item label="Ordem Produção">
                        <Select
                          showSearch
                          value={orderPro.orderProduction}
                          // style={{ width: 230 }}
                          onChange={this.handleOrdem}
                          filterOption={(inputValue, option) =>
                            option.props.children
                              .toUpperCase()
                              .indexOf(inputValue.toUpperCase()) >= 0
                          }
                        >
                          {ordens.map((e) => {
                            return (
                              <Option value={e.id}>{e.orderProduction}</Option>
                            );
                          })}
                        </Select>
                      </Form.Item>
                    </div>
                  </Col>

                  <Col lg={4} md={6} sm={12} xs={24}>
                    <div className="gx-form-row0">
                      <Form.Item label="Categoria do Produto">
                        <Select
                          showSearch
                          value={this.state.productOrder.productCateg}
                          // style={{ width: 300 }}
                          name="productCateg"
                          onChange={this.handleCateg}
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
                          {categs.map((e) => {
                            return (
                              <Option value={e.id}>
                                {e.cod} - {e.description}
                              </Option>
                            );
                          })}
                        </Select>
                      </Form.Item>
                    </div>
                  </Col>

                  <Col lg={4} md={8} sm={12} xs={24}>
                    <div className="gx-form-row0">
                      <Form.Item label="Código do Produto">
                        <Select
                          showSearch
                          value={orderPro.product}
                          // style={{ width: 300 }}
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
                      </Form.Item>
                    </div>
                  </Col>

                  {/* <Col lg={4} md={6} sm={12} xs={24}>
                    <div className="gx-form-row0">
                      <Form.Item label="Prioridade início">
                        <Input
                          type="number"
                          // style={{ width: 150 }}
                          value={this.state.productOrder.prioridadeEtapaIni}
                          name="prioridadeEtapaIni"
                          onChange={this.handleChange}
                        />
                      </Form.Item>
                    </div>
                  </Col>
                  <Col lg={4} md={6} sm={12} xs={24}>
                    <div className="gx-form-row0">
                      <Form.Item label="Prioridade fim">
                        <Input
                          type="number"
                          // style={{ width: 150 }}
                          value={this.state.productOrder.prioridadeEtapaFim}
                          name="prioridadeEtapaFim"
                          onChange={this.handleChange}
                        />
                      </Form.Item>
                    </div>
                  </Col> */}
                </Row>

                <Row>
                  <Col lg={4} md={6} sm={12} xs={24}>
                    <div className="gx-form-row0">
                      <Button onClick={this.onHandleClickSave} type="primary">
                        Pesquisar Ordens
                      </Button>
                    </div>
                  </Col>
                  <Col lg={4} md={6} sm={12} xs={24}>
                    <div className="gx-form-row0">
                      <Button onClick={this.fetchListaDeOrdens}>Limpar</Button>
                    </div>
                  </Col>
                </Row>
              </Form>
            </Card>

            <Card type="inner" title="Resultado">
              <Table
                scroll={{ x: 1500, y: 2000, scrollToFirstRowOnChange: true }}
                rowClassName="editable-row"
                bordered
                // pagination= {
                //     {
                //         pageSizeOptions: ['10','20','50', '100'],
                //         showSizeChanger: true,
                //     }}
                ellipsis={false}
                columns={this.columnsOrders}
                dataSource={this.state.tableResult}
                style={{ margin: '-15px -24px', borderRadius: 0 }}
              />
              <br />
              <Row>
                <Col span={5}>
                  <div className="gx-form-row0">
                    <Form.Item label="Total tempo previsto">
                      <Input
                        disabled
                        value={this.state.totalTempoPrevisto}
                        name="totalTempoPrevisto"
                      />
                    </Form.Item>
                  </div>
                </Col>
                <Col span={5}>
                  <div className="gx-form-row0">
                    <Form.Item label="Total custo previsto">
                      <Input
                        disabled
                        value={this.state.totalCustoPrevisto}
                        name="totalCustoPrevisto"
                      />
                    </Form.Item>
                  </div>
                </Col>
                <Col span={5}>
                  <div className="gx-form-row0">
                    <Form.Item label="Total tempo realizado">
                      <Input
                        disabled
                        value={this.state.totalTempoRealizado}
                        name="totalTempoPrevisto"
                      />
                    </Form.Item>
                  </div>
                </Col>
                <Col span={5}>
                  <div className="gx-form-row0">
                    <Form.Item label="Total custo realizado">
                      <Input
                        disabled
                        value={this.state.totalCustoRealizado}
                        name="totalCustoRealizado"
                      />
                    </Form.Item>
                  </div>
                </Col>
                {/* <Col span={4} style={{ marginTop: 5 }}>
                  <div className="gx-form-row0">
                    <br />
                    <br />
                    <Button
                      type="primary"
                      disabled={
                        this.state.tableResult.length === 0 ? true : false
                      }
                      onClick={() =>
                        this.handleEditOrder(this.state.tableResult)
                      }
                    >
                      Salvar
                    </Button>
                  </div>
                </Col> */}
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
        <Row>
          <Col span={24}>
            {this.Content(
              this.state.productOrder,
              this.state.listofEstabs,
              this.state.listofProds,
              this.state.listofPartner,
              this.state.listOrdens,
              this.state.listofcateg
            )}
          </Col>
        </Row>
      </Spin>
    );
  }
}



function addTimes(startTime, endTime) {
  var times = [0, 0, 0];
  var max = times.length;

  var a = (startTime || '').split(':');
  var b = (endTime || '').split(':');

  // normalize time values
  for (var i = 0; i < max; i++) {
      a[i] = isNaN(parseInt(a[i])) ? 0 : parseInt(a[i]);
      b[i] = isNaN(parseInt(b[i])) ? 0 : parseInt(b[i]);
  }

  // store time values
  for (var i = 0; i < max; i++) {
      times[i] = a[i] + b[i];
  }

  var hours = times[0];
  var minutes = times[1];
  var seconds = times[2];

  if (seconds >= 60) {
      var m = (seconds / 60) << 0;
      minutes += m;
      seconds -= 60 * m;
  }

  if (minutes >= 60) {
      var h = (minutes / 60) << 0;
      hours += h;
      minutes -= 60 * h;
  }

  return (
      ('0' + hours).slice(-2) +
      ':' +
      ('0' + minutes).slice(-2) +
      ':' +
      ('0' + seconds).slice(-2)
  );
}


export default ManagementOrder;
