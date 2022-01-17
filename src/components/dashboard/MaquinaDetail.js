import React from 'react';
import api from 'util/ApiCors';
import Widget from 'components/Widget/index';
import moment from 'moment';


var moment2 = require('moment-timezone');

class MaquinaDetail extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      chartProperties: {
        idOrderProdMaquina: '',
        idOrderProd: '',
        title: '',
        pedidoFox: '',
        status: '',
        qtde: '',
        CRO: '',
        orderProd: '',
        progresso: '',
        operador: '',
        programador: '',
        op: '',
        bgColor: '',
      },
      timer: {},
      timerColaborador: {},
      apt: {},
      colaborador: {},
    };
  }

  // start = (apontamento)  => {
  //   // console.log(this.state.apt.dataInicio);
  //   console.log(apontamento);
  //   let inicio =  moment(apontamento.dataInicio, "DD/MM/YY HH:mm:ss");
  //   let timer = setInterval(() => {
  //       const tempoRodando = moment(moment().diff(inicio)).utc().format("HH:mm:ss");
  //       let t = tempoRodando;
  //       // console.log(t);
  //       this.setState({tempoRodando: t});
  //   }, 1000);
  //   this.setState({timer});

  //   //Criar um settime out para buscar o status no banco de dados.

  //   // var date = new Date();
  //   // this.setState({horaInicio: date.getHours()+":"+date.getMinutes()})
  // }

  // timerColaborador = () => {
  //   let timerColaborador = setInterval(() => {

  //     api.get(`dashboard/returnInitHour/${this.props.idOrderProd}`,)
  //     .then((result) => {
  //         let dataDash = [];
  //         dataDash = result.data;

  //         this.setState({
  //           colaborador: dataDash[0].colaborador
  //         })
  //         this.start();
  //     },)
  //     .catch(function(error) {
  //         // console.log(error);
  //     })
  //     // console.log(t);

  //   }, 60000);
  //   this.setState({timerColaborador});
  // }

  makeMathHours = async (idOrderProd) => {
    if (idOrderProd !== '') {
    await  api
        .get(`dashboard/returnInitHour/${idOrderProd}`)
        .then((result) => {
          let dataDash = [];
          dataDash = result.data.apontamentos;
          const serverTime = moment2().utc().tz('America/Bahia');
          serverTime.subtract(1, "hour");

          console.log(serverTime);
          // if (idOrderProd === 616) {
          //   // console.log(idOrderProd);
          //   console.log('data', result.data);
          //   console.log('result.data.serverTime', result.data.serverTime);
          //   console.log('serverTime Moment', serverTime.format('HH:mm:ss'));
          //   console.log('data inicio props', this.props.dataInicio);
          //   const ini = moment(this.props.dataInicio);
          //   console.log(
          //     'diff',
          //     moment(serverTime.diff(ini)).utc().format('HH:mm:ss')
          //   );
          // }
          // console.log(dataDash[0]);
          // this.setState({
          //   apt: dataDash[0],
          //   colaborador: dataDash[0].colaborador,
          // });
          const inicio = moment(this.props.dataInicio, "DD/MM/YY HH:mm:ss");
          serverTime.add(1,'hour');
          this.timer(inicio, serverTime);
        })
        .catch(function (error) {
          // console.log(error);
        });
    }
  };
  // componentDidCatch(){
  //   console.log('this.props.idOrderProd = '+this.props.idOrderProd+ ' Show: '+this.props.show);
  // }
  componentDidUpdate() {
    // console.log('this.props.idOrderProd = '+this.props.idOrderProd+ ' Show: '+this.props.show);
    // this.makeMathHours(this.props.idOrderProd);
  }
  componentWillMount() {
    // this.setState((previousState) => ({
    //   chartProperties: this.props.chartProperties,
    // }));
    // if(this.props.orderProd === 'OP-000120'){
    //   console.log('componentWillMount'+this.props.idOrderProd);
    //   console.log('apontamento',this.props.apontamento);
    // }
    // console.log('this.props.idOrderProd', this.props.idOrderProd);
    this.makeMathHours(this.props.idOrderProd);
    // console.log(this.props.idOrderProd);
    // if(this.props.idOrderProd === 120) {
    // let inicio =  moment(this.props.dataInicio, "DD/MM/YY HH:mm:ss");
    // // console.log(inicio);
    // this.timer(inicio);

    // this.setState({timer});
    // console.log(timer);
    // }
  }

  timer = (inicio, serverTime) => {
    this.interval = setInterval(() => {
      serverTime.add(1, 's');
      const tempoRodando = moment(serverTime.diff(inicio))
        .utc()
        .format('HH:mm:ss');
      let t = tempoRodando;
      this.setState({ tempoRodando: t });
    }, 1000);
  };

  componentWillUnmount() {
    // console.log(this.interval);
    clearInterval(this.interval);
    // console.log(this.interval);
    // this.setState({timer:null});
    // clearTimeout(this.state.timer);
    // console.log('vai desmontar');
    // console.log(this.state.timer);
  }

  render() {
    const { bgColor, title } = this.props;

    // let qtdePrevista = 0;
    // let qtdeProduzida = 0;
    // // let prevEtapa = '';
    // let etapaAnterior = {};

    // let etapas = this.props.order.etapas.sort(function (a, b) {
    //   if (a.sequencia > b.sequencia) {
    //     return 1;
    //   }
    //   if (a.sequencia < b.sequencia) {
    //     return -1;
    //   }
    //   return 0;
    // });

    // let firstEtapa = etapas[0].maquina;
    // // let lastEtapa = etapas[etapas.length - 1].maquina;

    // // console.log(etapas);

    // //Pega a etapa anterior
    // let etapaAtual = etapas.find((etapa) => etapa.maquina === title);
    // if (etapaAtual !== undefined) {
    //   if (etapaAtual.sequencia > 1) {
    //     // eslint-disable-next-line
    //     etapaAnterior = etapas.find((etapa) => {
    //       if (etapa.sequencia === etapaAtual.sequencia - 1) {
    //         return etapa;
    //       }
    //     });
    //   }
    // }

    // // console.log('title',title);
    // // console.log('firstEtapa',firstEtapa);

    // //Se for a primeira etapa ele deve buscar a quantidade a produzir no cadastro da ordem.
    // //Se nao for a primeira etapa, ele deve buscar a soma das quantidades apontadas na etapa anterior.
    // if (title === firstEtapa) {
    //   qtdePrevista = this.props.order.qtde;
    // } else {
    //   this.props.order.apontamentos.forEach((item) => {
    //     // console.log('etapaAnterior', etapaAnterior);
    //     if (etapaAtual !== undefined && etapaAnterior !== undefined) {
    //       if (
    //         etapaAtual.sequencia > 1 &&
    //         Object.keys(etapaAnterior).length > 0
    //       ) {
    //         if (etapaAnterior !== undefined && etapaAnterior !== null) {
    //           if (etapaAnterior.maquina === item.maquina) {
    //             qtdePrevista += item.qtdeApontada;
    //           }
    //         }
    //       }
    //     }
    //   });
    // }

    // //Qtde produzida:
    // // A soma das quantidades dos apontamentos da etapa atual.
    // let apt = this.props.apontamentos.filter((item) => item.maquina === title);
    // qtdeProduzida = apt.reduce((sum, record) => sum + record.qtdeApontada, 0);

    return (
      <div style={{ display: this.props.show === true ? '' : 'none' }}>
        <Widget styleName={`gx-card-full gx-bg-${bgColor}`}>
          <div className="gx-actchart gx-px-3 gx-pt-3 ">
            <div className="ant-row-flex">
              <h1 className="gx-mb-0 gx-fs-xxl gx-font-weight-medium gx-text-white">
                {title}
                <span
                  className={`gx-mb-0 gx-ml-2 gx-pt-xl-2 gx-fs-lg gx-chart-$`}
                >
                  {' '}
                  <i className="icon icon-menu-up gx-fs-sm" />
                </span>
              </h1>
              <i
                className={`icon icon- gx-fs-xl gx-ml-auto gx-text-primary gx-fs-xxxl`}
              />
            </div>
            <p className="gx-mb-0 gx-fs-sm gx-text-white"></p>
          </div>
          <div className="ant-row-flex gx-justify-content-between gx-mb-3 gx-mb-sm-4 gx-dash-search ">
            <div className="gx-mx-sm-2">
              <div className="gx-media gx-featured-item">
                <div className="gx-media-body gx-featured-content">
                  <div className="gx-featured-content-left">
                    <br />
                    <br />

                    <h1 className="gx-text-white gx-mb-1">
                      {/* Status: {this.props.status} */}
                      Status: Em execução
                    </h1>

                    <div className="ant-row-flex">
                      <h1 className="gx-mr-3 gx-mb-1">
                        <span className="gx-text-white">
                          Cod Produto: {this.props.cro}
                        </span>
                      </h1>
                    </div>

                    <div className="ant-row-flex">
                      <h1 className="gx-mr-3 gx-mb-1">
                        <span className="gx-text-white">
                          Cod Ordem: {this.props.orderProd}
                        </span>
                      </h1>
                    </div>

                    <div className="ant-row-flex">
                      <h1 className="gx-mr-3 gx-mb-1">
                        <span className="gx-text-white">
                          Ped. Venda: {this.props.pedidoFox}
                        </span>
                      </h1>
                    </div>

                    <div className="ant-row-flex">
                      <h1 className="gx-mr-3 gx-mb-1">
                        <span className="gx-text-white">
                          Qtde Prevista: {this.props.obj.qtde}
                        </span>
                      </h1>
                    </div>

                    <div className="ant-row-flex">
                      <h1 className="gx-mr-3 gx-mb-1">
                        <span className="gx-text-white">
                          Qtde Produzida: {this.props.obj.qtdeApontada}
                        </span>
                      </h1>
                    </div>

                    {/* <div className="ant-row-flex">
                      <h1 className="gx-mr-3 gx-mb-1"><span className="gx-text-white">Progresso: {progresso}</span> </h1>
                    </div> */}
                    {this.props.obj.tipo === 'programar' ? (
                      <div className="ant-row-flex">
                        <h1 className="gx-mr-3 gx-mb-1">
                          <span className="gx-text-white">
                            Programador:{' '}
                            {this.props.obj.colaboradorNome}
                          </span>
                        </h1>
                      </div>
                    ) : (
                      <div className="ant-row-flex">
                        <h1 className="gx-mr-3 gx-mb-1">
                          <span className="gx-text-white">
                            Operador:
                            {this.props.obj.colaboradorNome}
                          </span>{' '}
                        </h1>
                      </div>
                    )}
                    <div className="ant-row-flex">
                      <h1 className="gx-mr-3 gx-mb-1">
                        <span className="gx-text-white">
                          Tempo rodando:{' '}
                          {!this.state.tempoRodando ||
                          this.state.tempoRodando === ''
                            ? '00:00:00'
                            : this.state.tempoRodando}{' '}
                        </span>{' '}
                      </h1>
                    </div>
                    <div className="ant-row-flex">
                      <h1 className="gx-mr-3 gx-mb-1">
                        <span className="gx-text-white">
                          Data Inicio: {this.props.dataInicio}{' '}
                        </span>{' '}
                      </h1>
                    </div>

                    {/* <div className="ant-row-flex">
                      <p className="gx-text-white gx-mb-1">
                        <i className={`icon icon-user gx-fs-xs gx-mr-2 gx-d-inline-flex gx-vertical-align-middle`}/>name
                      </p>
                      <p className="gx-text-white gx-ml-4 gx-mb-1">
                        <i className={`icon icon-datepicker gx-fs-xs gx-mr-2 gx-d-inline-flex gx-vertical-align-middle`}/>date
                      </p>
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Widget>
      </div>
    );
  }
}

export default MaquinaDetail;
