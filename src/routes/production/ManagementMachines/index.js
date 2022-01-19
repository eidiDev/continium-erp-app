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
import locale from 'moment/locale/pt-br';
import api from 'util/Api';
import apiAdonis from 'util/ApiAdonis'
import EllipsisTooltip from 'components/EllipsisTooltip';
import moment from 'moment';
var _ = require('lodash');
const { Option } = Select;
const model2 = 'establishment';
const model3 = 'product';
const model4 = 'partner';
const model5 = 'category';

class ManagementMachine extends Component {
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
      listOrdens: [],
      listofcateg: [],
      tableResult: [],
      listofMaquinas: [],
      auxtrava: false,
      listofOrderprodMaquina: [],
      totalTempoPrevisto: '00:00:00',
      totalCustoPrevisto: 0,
      totalTempoRealizado: '00:00:00',
      totalCustoRealizado: 0,
    };

    this.columnsMaquinas = [
      {
        title: 'Código da Ordem',
        dataIndex: 'orderProduction',
        width: 120,
        key: 'orderProd',
        render: (text) => <span>{text}</span>,
      },
      {
        title: 'Ordem Principal',
        dataIndex: 'ordemPrincipal',
        key: 'ordemPrincipal',
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
        // render: (text) => <span>{text === "" ? "Sem dados" : text}</span>
      },
      {
        title: 'Maquina',
        dataIndex: 'maquina',
        width: 100,
        key: 'maquina',
        align: 'center',
        //sorter: (a,b) => a.maquina.length - b.maquina.length,
        render: (text) => <text>{text}</text>,
      },
      {
        title: 'Montagem',
        dataIndex: 'montagem',
        width: 100,
        key: 'montagem',
        align: 'center',
        render: (text) => <text>{text}</text>,
      },
      {
        title: 'Status da Ordem',
        dataIndex: 'status',
        key: 'status',
        align: 'center',
        width: 120,
        render: (text) => {
          if (text === undefined) {
            return '';
          } else {
            return <text>{text.toString().toUpperCase()}</text>;
          }
        },
      },
      {
        title: 'Cód Produto',
        dataIndex: 'product',
        width: 140,
        key: 'product',
      },
      {
        title: 'Prioridade Ordem Produção',
        width: 100,
        dataIndex: 'prioridade',
        key: 'prioridade',
        align: 'center',

        // render: (text,record) =>{
        //     return (
        //     <span>
        //         <Input
        //             defaultValue={record.orderProd.prioridade}
        //             type="number"
        //             min={1}
        //             name="prioridade"
        //             onChange={(e) => this.changeOrderPrioridadeOrdem(e,record)}
        //         >
        //         </Input>
        //     </span>
        //     )
        // },
      },
      {
        title: 'Status da Etapa',
        dataIndex: 'statusEtapa',
        align: 'center',
        width: 150,
        key: 'statusEtapa',
        render: (text) => {
          if (text === undefined) {
            return '';
          } else {
            return <text>{text.toString().toUpperCase()}</text>;
          }
        },
        // render: (text, record) => {
        //     return(
        //         <span>
        //             <Select
        //                 defaultValue={text === "" || text === undefined  ? "" : text}
        //                 onChange={(e) => this.changeSelectStatusMaq(e,text,record.id)}
        //                 style={{ width: '100%' }}
        //                 key={record.id}
        //                 >
        //                 <Option value={"planejada"}>Planejada</Option>
        //                 <Option value={"liberada"}>Liberada</Option>
        //                 <Option value={"execução"}>Em execução</Option>
        //                 <Option value={"finalizada"}>Finalizada</Option>
        //                 <Option value={"pausada"}>Pausada</Option>
        //             </Select>
        //         </span>
        //     )
        // }
      },
      {
        title: 'Prioridade Maquina/Montagem',
        dataIndex: 'prioridadeEtapa',
        width: 100,
        key: 'prioridadeEtapa',
        // render: (text, record) => {
        //     return(
        //         <span>
        //             <Input
        //             onChange={(e) => this.changeOrder(e,text,record.id)}
        //             key={record.id}
        //             type="number"
        //             min={1}
        //             defaultValue={text}
        //             style={{ width: '100%' }}
        //             disabled={record.statusEtapa === "execução" ? true : false}
        //             />
        //         </span>
        //     )
        // },
      },
      {
        title: 'Sequencia',
        width: 100,
        dataIndex: 'sequencia',
        align: 'center',
        key: 'sequencia',
      },
      {
        title: 'Qtde a Produzir',
        width: 100,
        dataIndex: 'qtde',
        align: 'center',
        key: 'qtde',
      },
      // {
      //     title: 'Qtde Produzida',
      //     width: 100,
      //     dataIndex:'orderProd.qtdeProduzida',
      //     align: 'center',
      //     key: 'qtdeProduzida',
      // },
      {
        title: 'Saldo',
        width: 100,
        dataIndex: 'saldo',
        key: 'saldo',
        align: 'center',
        render: (text) => {
          return <p>{text}</p>;
        },
      },
      {
        title: 'Pedido Cliente',
        dataIndex: 'pedidoCliente',
        width: 100,
        align: 'center',
        key: 'pedidoCliente',
      },
      {
        title: 'Pedido Venda',
        dataIndex: 'orderFox',
        width: 100,
        key: 'orderFox',
        align: 'center',
      },
      {
        title: 'Data Entrega',
        dataIndex: 'dataEntrega',
        width: 100,
        key: 'dataEntrega',
        render: (text) => (
          <text>
            {text}
          </text>
        ),
      },
      {
        title: 'Data Inicio',
        dataIndex: 'dataProd',
        width: 100,
        key: 'dataProd',
        render: (text) => (
          <text>
            {moment(text).format('DD-MM-YYYY') === 'Invalid date'
              ? text
              : moment(text).format('DD-MM-YYYY')}
          </text>
        ),
      },
      {
        title: 'Tempo previsto',
        width: 100,
        dataIndex: 'tempoPrevisto',
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
        width: 110,
        dataIndex: 'tempoRealizado',
        key: 'tempoRealizado',
        render: (text, record) => {
          // let segundos = 0;
          // if(record.orderProd.tempoEcustos === undefined){
          // }else{
          //     for (const iterator of record.orderProd.apontamentos) {
          //         segundos += parseInt(iterator.tempoRealizado.substr(0,2)) * 60 * 60;
          //         segundos += parseInt(iterator.tempoRealizado.substr(3,2)) * 60;
          //         segundos += parseInt(iterator.tempoRealizado.substr(6,2));
          //         // tempo = moment(iterator.tempoRealizado,'HH:mm:ss').toDate();
          //         // somaTempo.add(tempo);
          //         // console.log(moment(iterator.tempoRealizado,'HH:mm:ss').toDate());
          //     }
          // }
          // console.log(Math.floor(segundos / 60 / 60).toString().length);
          // // let hora = "";
          // let hora = Math.floor(segundos / 60 / 60).toString().length === 1 ? '0' + Math.floor(segundos / 60 / 60).toString() : Math.floor(segundos / 60 / 60).toString();
          // let minutos = Math.floor(segundos / 60).toString().length === 1 ? '0' + Math.floor(segundos / 60).toString() : Math.floor(segundos / 60).toString();
          // segundos = Math.floor(segundos % 60).toString().length === 1 ? '0' + Math.floor(segundos % 60 ).toString() : Math.floor(segundos % 60).toString();
          // return (somaTempo)
          // return (<Tag color="blue">{segundos ? hora + ':' + minutos + ":"+ segundos : '0:00'} hrs </Tag>)
          // return (<Tag color="blue">{text ? Math.floor(parseInt(text) / 60) + ':' + parseInt(text) % 60 : '0:00'} hrs </Tag>)
          return <Tag color="blue">{text !== '' ? text : '0:00'} hrs </Tag>;
        },
      },
      {
        title: 'Custo Previsto',
        width: 120,
        dataIndex: 'custoPrevisto',
        key: 'custoPrevisto',
        render: (text) => {
          return (
            <Tag color="green">
              {text
                ? new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(text)
                : new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(0)}
            </Tag>
          );
        },
      },
      {
        title: 'Custo Realizado',
        width: 120,
        dataIndex: 'custoRealizado',
        key: 'custoRealizado',
        render: (text) => {
          return (
            <Tag color="green">
              {text
                ? new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(text)
                : new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(0)}
            </Tag>
          );
        },
      },
      {
        title: 'Cliente',
        width: 150,
        dataIndex: 'razao_social',
        key: 'razao_social',
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
      {
        title: 'Estabelecimento',
        width: 110,
        dataIndex: 'name',
        key: 'name',
      },
    ];

    this.handleChange = this.handleChange.bind(this);
    this.setStateNew = this.setStateNew.bind(this);
    this.fetchListaDeOrdens = this.fetchListaDeOrdens.bind(this);
    // this.onHandleClickSave = this.onHandleClickSave.bind(this);
    this.onHandleClickNew = this.onHandleClickNew.bind(this);
    // this.handleSubmit = this.handleSubmit.bind(this);

    this.leftListChild = React.createRef();
  }

  onHandleClickNew = () => {
    this.setStateNew();
  };

  // changeOrder = (event, record, id) => {
  //   //    record.prioridadeEtapa = parseInt(event.target.value)
  //   console.log(event.target.value, record, id);

  //   let obj = this.state.listofOrderprodMaquina;
  //   console.log('obj', obj);
  //   obj.forEach((a) => {
  //     if (a.id === id) {
  //       a.prioridadeEtapa = event.target.value;
  //     }
  //   });

  //   // console.log('dep[ois',obj.find(e => e.id === 216))
  //   this.setState({ listofOrderprodMaquina: obj });
  // };

  // changeOrderPrioridadeOrdem = (event, record) => {
  //   record.orderProd.prioridade = parseInt(event.target.value);
  // };

  // dataChangeOrder = (date, dataString) => {
  //   let data1 = moment(dataString);

  //   // let newOrder = this.state.productOrder;
  //   // newOrder[event.target.name] = event.target.value;

  //   // this.setState(() => ({
  //   //     productOrder: newOrder
  //   // }))

  //   date.orderProd.dataProd = data1;
  // };

  // dataChangeOrderEntrega = (date, dataString) => {
  //   let data1 = moment(dataString);

  //   date.orderProd.dataEntrega = data1;
  // };

  // changeSelect = (event, record) => {
  //   record.orderProd.status = event;
  // };

  // changeSelectStatusMaq = (event, record, id) => {
  //   console.log(event, record, id);

  //   let obj = this.state.listofOrderprodMaquina;
  //   console.log('obj', obj);
  //   obj.forEach((a) => {
  //     if (a.id === id) {
  //       a.statusEtapa = event;
  //     }
  //   });

  //   // console.log('dep[ois',obj.find(e => e.id === 216))
  //   this.setState({ listofOrderprodMaquina: obj });

  //   // record.statusEtapa = event
  // };

  /**
   * Função que é chamada ao clicar no botão salvar no final do tabela.
   * @param {lista} Lista a ser atualizado
   */
  handleEditOrder = async (lista) => {
    let listaComFilhosOrdemModif = this.state.listofOrderprodMaquina;
    let isok = 1;

    //Verifica se tem registros iguas:
    const equals = [];
    for (let obj of listaComFilhosOrdemModif) {
      for (let ele of listaComFilhosOrdemModif) {
        console.log(obj);
        if (obj.id === ele.id) continue;
        if (
          ele.prioridadeEtapa === obj.prioridadeEtapa &&
          ((ele.montagem === obj.montagem && ele.montagem !== '') ||
            (ele.maquina === obj.maquina && ele.maquina !== ''))
        ) {
          equals.push(obj);
        }
      }
    }

    if (equals.length > 0) {
      message.error(
        'As linhas ' +
          equals
            .map(function (e) {
              return e.orderProduction;
            })
            .join("','") +
          ' estão com prioridades iguais.'
      );
      isok = 0;
      return;
    }

    await api
      .post('orderProdMaquina/checkPrioridadeMaquinas', {
        data: listaComFilhosOrdemModif,
      })
      .then((result) => {
        console.log('result: ', result);
        isok = 1;
      })
      .catch((error) => {
        console.log(error.response.data.error);
        message.error(error.response.data.error);
        isok = 0;
        // return;
      });

    console.log('isOk: ', isok);
    if (isok === 0) {
      return;
    }

    this.setState({
      loading: true,
      loadingTip: 'Alterando registros, aguarde...',
    });

    let parent = this;
    let METHOD = 'PATCH';

    try {
      for (const record of listaComFilhosOrdemModif) {
        let objAux = record;

        // if(objAux.orderProd !== null) {
        // objAux.orderProd = objAux.orderProd.id;
        let orderMaquinaModif = objAux;
        await api({
          method: METHOD,
          url: `orderprodMaquina/${record.id}`,
          data: orderMaquinaModif,
        });
        // }
      }

      await api({
        method: 'POST',
        url: `orderProdMaquina/updateOrdersOnManagement`,
        data: listaComFilhosOrdemModif,
      });

      await parent.fetchListaDeOrdens();
    } catch (error) {
      // console.log(error);
      message.error('Erro ao buscar registros. Err:' + error);
    }

    this.setState({ loading: false });
  };

  componentWillMount() {
    this.getEstabs();
    this.getProducts();
    this.getPartner();
    this.getOrdens();
    this.getMaquinas();
    this.getCategs();
  }

  getMaquinas() {
    api
      .get(`orderProdMaquina/getOnlyMaquinas`, {})
      .then((result) => {
        let dataProd = [];
        dataProd = result.data.data;

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
      .get(`orderProd`, {})
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
      .get(`${model3}`, {})
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
    console.log('vai buscar as categorias');
    api
      .get(`${model5}`, {})
      .then((result) => {
        let dataCateg = [];
        dataCateg = result.data.data;
        console.log('list of categ:', dataCateg);
        this.setState({
          listofcateg: dataCateg,
        });
      })
      .catch(function (error) {
        console.log('erro getcatege()', error);
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
        dataProdIni: '',
        dataProdFim: '',
        dataEntregaIni: '',
        dataEntregaFim: '',
        prioridadeEtapaIni: '',
        prioridadeEtapaFim: '',
      },
      dataAux: '',
      dataEntrega: '',
      tableResult: [],
      listofOrderprodMaquina: [],
    });
  };

  onClickSearchMaquina = () => {
    let record = this.state.productOrder;
    var parent = this;

    this.setState({
      loading: true,
      loadingTip: 'Pesquisando os registros, aguarde...',
      tableResult: [],
      listofOrderprodMaquina: [],
    });
    //Verifica se é uma atualizacao (PUT) ou novo registro (POST)
    let METHOD = 'POST';
    let URL = `orderProdMaquina/getMaquinasByPrioridade`;

    // console.log('onHandleSaveButton', record);
    const {
      maquina,
      dataEntrega,
      establishment,
      partner,
      product,
      orderFox,
      orderProduction,
      status,
      pedidoCliente,
      ordemPrincipal,
      prioridadeEtapa,
      montagem,
    } = record;
    api({
      method: METHOD,
      url: URL,
      data: {
        order: this.state.productOrder,
        montagem: montagem,
        maquina: maquina,
        prioridadeEtapa: prioridadeEtapa,
        establishments: establishment,
        product: product,
        partner: partner,
        dataProdIni: moment(this.state.productOrder.dataProdIni).format(
          'DD-MM-YYYY'
        ),
        dataProdFin: moment(this.state.productOrder.dataProdFim).format(
          'DD-MM-YYYY'
        ),
        dataEntregaIni: moment(this.state.productOrder.dataEntregaIni).format(
          'DD-MM-YYYY'
        ),
        dataEntregaFim: moment(this.state.productOrder.dataEntregaFim).format(
          'DD-MM-YYYY'
        ),
        dataEntrega: dataEntrega,
        pedidoCliente: pedidoCliente,
        orderFox: orderFox,
        ordemPrincipal: ordemPrincipal,
        orderProd: orderProduction,
        status: status,
      },
    })
      .then((result) => {
        //Caso consiga recuperar o model, ele atualiza a tela e para de carregar
        // console.log(result);
        message.success('Ordens filtradas!');

        parent.setState({
          canSave: true,
          canNew: true,
          canDelete: true,
          loading: false,
          isNew: false,
          //listofOrderprodMaquina: result.data
          listofOrderprodMaquina: _.sortBy(result.data, [
            (o) => {
              return o.prioridadeEtapa;
            },
          ]),
        });

        let totalTempoPrevisto = '00:00:00',
          totalCustoPrevisto = 0,
          totalTempoRealizado = '00:00:00',
          totalCustoRealizado = 0;
        if (result.data.length >= 0) {
          result.data.forEach((item) => {
            // console.log(item);
            // if(item.tempoEcustos[0] !== undefined) {
            totalCustoPrevisto += item.custoPrevisto;
            totalCustoRealizado += item.custoRealizado;
            totalTempoPrevisto = this.addTimes(
              totalTempoPrevisto,
              item.tempoPrevisto
            );

            if (item.tempoRealizado !== '0' && item.tempoRealizado !== null) {
              let pos1 = item.tempoRealizado.indexOf(':');
              let pos2 = totalTempoRealizado.indexOf(':');
              // console.log(pos1);
              // console.log(item.tempoRealizado);
              // console.log(String(item.tempoRealizado).subStr(0,2))
              // let hora = parseInt(item.tempoRealizado.substr(0,pos1)) + parseInt(item.tempoRealizado.substr(0,pos2))
              let hora =
                parseInt(item.tempoRealizado.substr(0, pos1)) +
                parseInt(totalTempoRealizado.substr(0, pos2));
              let min =
                parseInt(item.tempoRealizado.substr(pos1 + 1, 2)) +
                parseInt(totalTempoRealizado.substr(pos2 + 1, 2));
              let seg =
                parseInt(item.tempoRealizado.substr(pos1 + 4, 2)) +
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

            // }
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

        console.log('result data: ', result.data);
      })
      .catch((error) => {
        console.log(error);
        parent.setState({ loading: false });
        message.error('Erro ao buscar registros. Error:' + error);
      });
  };

  addTimes(startTime, tempo) {
    if (tempo === undefined) {
      return startTime;
    }

    // console.log(startTime,tempo);

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
      loading: false,
      isNew: true,
      refreshLeftList: false,
      listofOrderprodMaquina: [],
    });

    this.onClickSearchMaquina();
  };

  setStateEdit = (model) => {
    // console.log(model);
    this.setState({
      canSave: true,
      canNew: true,
      canDelete: true,
      loading: false,
      isNew: false,
      tableResult: model.sort(function (a, b) {
        return a.prioridade - b.prioridade;
      }),
    });
  };

  handleChange(event) {
    let newOrder = this.state.productOrder;
    newOrder[event.target.name] = event.target.value;

    this.setState(() => ({
      productOrder: newOrder,
    }));
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
  handlePrincipal = (event) => {
    let auxList = this.state.listOrdens;
    let newProdOrder = this.state.productOrder;

    // console.log(event);
    if (event === 'principal') {
      newProdOrder['ordemPrincipal'] = event;

      // console.log(newProdOrder);
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

  hangleChangeV2 = (name) => (value) => {
    let newObj = this.state.productOrder;
    newObj[name] = value; //moment(value).format('DD-MM-YYYY');
    console.log(newObj);

    this.setState({
      productOrder: newObj,
    });
  };

  dataChange = (date, dataString) => {
    console.log('date', date);
    console.log('dataString', dataString);

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

  handleTip = (event) => {
    // console.log(event);
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
            <Card type="inner" title="Gerenciamento de Maquina">
              <Form layout="horizontal">
                <Row>
                  <Col lg={4} md={6} sm={12} xs={24}>
                    <div className="gx-form-row0">
                      <Form.Item label="Estabelecimento">
                        <Select
                          value={orderPro.establishment}
                          onChange={this.handleEstab}
                        >
                          {estabs.map((e) => {
                            return <Option value={e.id}>{e.name}</Option>;
                          })}
                        </Select>
                      </Form.Item>
                    </div>
                  </Col>

                  <Col lg={4} md={6} sm={12} xs={24}>
                    <div className="gx-form-row0">
                      <Form.Item label="Cliente">
                        <Select
                          showSearch
                          value={orderPro.partner}
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

                  <Col lg={4} md={6} sm={12} xs={24}>
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

                  <Col lg={4} md={6} sm={12} xs={24}>
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

                  <Col lg={4} md={6} sm={12} xs={24}>
                    <div className="gx-form-row0">
                      <Form.Item label="Pedido Venda ">
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

                  <Col lg={4} md={6} sm={12} xs={24}>
                    <div className="gx-form-row0">
                      <Form.Item label="Ordem Principal">
                        <Select
                          showSearch
                          allowClear={true}
                          value={orderPro.ordemPrincipal}
                          onChange={this.handlePrincipal}
                          filterOption={(inputValue, option) =>
                            //option.props.children[0].concat(option.props.children[1],option.props.children[2]).toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                            option.props.children
                              .toUpperCase()
                              .indexOf(inputValue.toUpperCase()) >= 0
                          }
                        >
                          <Option value={'principal'}>Principal</Option>
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
                      <Form.Item label="Ordem Produção">
                        <Select
                          showSearch
                          allowClear={true}
                          value={orderPro.orderProduction}
                          // style={{ width: 230 }}
                          onChange={this.handleOrdem}
                          filterOption={(inputValue, option) =>
                            // console.log(inputValue)
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
                          value={orderPro.productCateg}
                          // style={{ width: 300 }}
                          onChange={this.handleCateg}
                          filterOption={(inputValue, option) =>
                            option.props.children
                              .toUpperCase()
                              .indexOf(inputValue.toUpperCase()) >= 0
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

                  <Col lg={4} md={6} sm={12} xs={24}>
                    <div className="gx-form-row0">
                      <Form.Item label="Código do Produto">
                        <Select
                          showSearch
                          value={orderPro.product}
                          // style={{ width: 300 }}
                          onChange={this.handleProduct}
                          filterOption={(inputValue, option) =>
                            option.props.children
                              .toUpperCase()
                              .indexOf(inputValue.toUpperCase()) >= 0
                          }
                        >
                          {products.map((e) => {
                            return <Option value={e.id}>{e.cod}</Option>;
                          })}
                        </Select>
                      </Form.Item>
                    </div>
                  </Col>

                  <Col lg={4} md={6} sm={12} xs={24}>
                    <div className="gx-form-row0">
                      <Form.Item label="Prioridade início">
                        <Input
                          type="text"
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
                          type="text"
                          // style={{ width: 150 }}
                          value={this.state.productOrder.prioridadeEtapaFim}
                          name="prioridadeEtapaFim"
                          onChange={this.handleChange}
                        />
                      </Form.Item>
                    </div>
                  </Col>

                  <Col lg={4} md={6} sm={12} xs={24}>
                    <div className="gx-form-row0">
                      <Form.Item label="Cod Maquina">
                        <Input
                          type="text"
                          // style={{ width: 150 }}
                          value={orderPro.maquina}
                          name="maquina"
                          onChange={this.handleChange}
                        />
                      </Form.Item>
                    </div>
                  </Col>
                  <Col lg={4} md={6} sm={12} xs={24}>
                    <div className="gx-form-row0">
                      <Form.Item label="Cod Montagem">
                        <Input
                          type="text"
                          // style={{ width: 150 }}
                          value={orderPro.montagem}
                          name="montagem"
                          onChange={this.handleChange}
                        />
                      </Form.Item>
                    </div>
                  </Col>
                </Row>
                <br />

                <Row>
                  <Col lg={4} md={6} sm={12} xs={24}>
                    <Button onClick={this.onClickSearchMaquina} type="primary">
                      Pesquisar Maquinas
                    </Button>
                  </Col>
                  <Col lg={4} md={6} sm={12} xs={24}>
                    <Button onClick={this.fetchListaDeOrdens}>Limpar</Button>
                  </Col>
                </Row>
              </Form>
            </Card>
            <Card type="inner" title="Resultado">
              <Table
                scroll={{ x: 1500, y: 2000 }}
                columns={this.columnsMaquinas}
                sorter={true}
                bordered
                size="small"
                dataSource={this.state.listofOrderprodMaquina}
                style={{ margin: '-15px -24px' }}
                key={Math.round(0, 100)}
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
                <Col span={4} style={{ marginTop: 5 }}>
                  <div className="gx-form-row0">
                    <br />
                    <br />
                    {/* <Button
                      disabled={
                        this.state.listofOrderprodMaquina.length === 0
                          ? true
                          : false
                      }
                      type="primary"
                      onClick={() =>
                        this.handleEditOrder(this.state.listofOrderprodMaquina)
                      }
                    >
                      Salvar
                    </Button> */}
                  </div>
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

export default ManagementMachine;
