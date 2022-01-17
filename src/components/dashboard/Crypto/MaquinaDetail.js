import React from "react";
import api from 'util/ApiCors';
import Widget from "components/Widget/index";
import moment from 'moment';

class MaquinaDetail extends React.Component {
  

  constructor(props) {
    super(props)

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
        bgColor: ''
      },
      timer : {},
      timerColaborador: {},
      apt: {},
      colaborador: {},


    }

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

  makeMathHours = (idOrderProd) =>   {
    
    if(idOrderProd !== ""){
      
      api.get(`dashboard/returnInitHour/${idOrderProd}`,)
      .then((result) => {
          let dataDash = [];
          dataDash = result.data;
          // if(idOrderProd === 23) {
          //   console.log('result data',result.data);
          //   console.log("idorderProd",idOrderProd);
          //   console.log("result",result.data[0].colaborador);
          // }
          console.log(idOrderProd);
          if(idOrderProd === 120) {
            // console.log("dataDash",dataDash);
          }
  
          this.setState({
            apt: dataDash[0],
            colaborador: dataDash[0].colaborador
          });
          let inicio =  moment(this.props.dataInicio, "DD/MM/YY HH:mm:ss");
          // console.log(inicio);
          this.timer(inicio);
          // this.start();
          // this.timerColaborador();
      },)
      .catch(function(error) { 
          // console.log(error);
      })
    }
  }
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

  timer = (inicio) => { 
    this.interval = setInterval(() => {
      const tempoRodando = moment(moment().diff(inicio)).utc().format("HH:mm:ss");
      let t = tempoRodando;
      // console.log(t);
      this.setState({tempoRodando: t});
    }, 1000);
  }
  
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
    const {bgColor, title} = this.props;

    // console.log(this.state.apt);

    // console.log('orderProd',this.props.apontamentos);
    let qdeApontanda = 0;
    this.props.apontamentos.forEach(item => {
      qdeApontanda += item.qtdeApontada;
    });

    // this.setState({colaborador: this.props.apontamentos[0].colaborador});
    

    // console.log('qdeApontanda',qdeApontanda);
    

    // let cutProg, cutOperador;
    // cutProg = programador.toString();
    // cutOperador =  operador.toString();

    // cutProg = cutProg.substr(0, cutProg.lastIndexOf("-"));
    // cutOperador = cutOperador.substr(0, cutOperador.lastIndexOf("-"));

    // if(this.props.show === true && !this.state.rodando ) { 
    //   console.log(this.props.idOrderProd);
    //   console.log(this.props.apontamento);
    //   this.setState({rodando: true});
    // }
    
    return (
      // <span>LALALAL</span>
      
      
        // {/* <div className="gx-actchart gx-px-3 gx-pt-3 " > */}
      //   <Row span={24}>
      //    {/* <div className="ant-row-flex"> */}

      //      <h1 className="gx-mb-0 gx-fs-xxl gx-font-weight-medium gx-text-white">
      //        {title}
      //         <span className={`gx-mb-0 gx-ml-2 gx-pt-xl-2 gx-fs-lg gx-chart-$`}> <i
      //         className="icon icon-menu-up gx-fs-sm"/>
      //       </span>
      //     </h1>
      //     {/* <i className={`icon icon- gx-fs-xl gx-ml-auto gx-text-primary gx-fs-xxxl`}/> */}
      //   {/* </div> */}
      //   {/* <p className="gx-mb-0 gx-fs-sm gx-text-white"></p> */}
      // </Row>
      //   <p>campos</p>
      //   <p>campos</p>
      //   <p>campos</p>
      // </Widget>
      

      <div style={{display: this.props.show === true ? '' :'none'}}>
      <Widget styleName={`gx-card-full gx-bg-${bgColor}`} >
        <div className="gx-actchart gx-px-3 gx-pt-3 " >
          <div className="ant-row-flex">
            <h1 className="gx-mb-0 gx-fs-xxl gx-font-weight-medium gx-text-white">
              {title}
              <span className={`gx-mb-0 gx-ml-2 gx-pt-xl-2 gx-fs-lg gx-chart-$`}> <i
                className="icon icon-menu-up gx-fs-sm"/>
              </span>
            </h1>
            <i className={`icon icon- gx-fs-xl gx-ml-auto gx-text-primary gx-fs-xxxl`}/>
          </div>
          <p className="gx-mb-0 gx-fs-sm gx-text-white"></p>
        </div>
        <div className="ant-row-flex gx-justify-content-between gx-mb-3 gx-mb-sm-4 gx-dash-search ">
          <div className="gx-mx-sm-2">
            <div className="gx-media gx-featured-item">
                <div className="gx-media-body gx-featured-content">
                  <div className="gx-featured-content-left">
                    <br /><br />

                    <h1 className="gx-text-white gx-mb-1">Status: {this.props.status}</h1>

                    <div className="ant-row-flex">
                      <h1 className="gx-mr-3 gx-mb-1"><span className="gx-text-white">Cod Produto: {this.props.cro}</span></h1>
                    </div>

                    <div className="ant-row-flex">
                      <h1 className="gx-mr-3 gx-mb-1"><span className="gx-text-white">Cod Ordem: {this.props.orderProd}</span></h1>
                    </div>

                    <div className="ant-row-flex">
                      <h1 className="gx-mr-3 gx-mb-1"><span className="gx-text-white">Ped. Venda: {this.props.pedidoFox}</span></h1>
                    </div>

                    <div className="ant-row-flex">
                      <h1 className="gx-mr-3 gx-mb-1"><span className="gx-text-white">Qtde Prevista: {this.props.qtde}</span></h1>
                    </div>

                    <div className="ant-row-flex">
                      <h1 className="gx-mr-3 gx-mb-1"><span className="gx-text-white">Qtde Produzida: {qdeApontanda}</span></h1>
                    </div>

                    {/* <div className="ant-row-flex">
                      <h1 className="gx-mr-3 gx-mb-1"><span className="gx-text-white">Progresso: {progresso}</span> </h1>
                    </div> */}
                    {this.state.apt.tipo === 'programar' ?
                    <div className="ant-row-flex">
                      <h1 className="gx-mr-3 gx-mb-1">
                        <span className="gx-text-white">Programador: {this.state.colaborador.name} </span> 
                      </h1>
                    </div>
                    :
                    <div className="ant-row-flex">
                      <h1 className="gx-mr-3 gx-mb-1"><span className="gx-text-white">Operador: {this.state.colaborador.name} </span> </h1>
                    </div>
                    }
                    <div className="ant-row-flex">
                      <h1 className="gx-mr-3 gx-mb-1"><span className="gx-text-white">Tempo rodando: {!this.state.tempoRodando || this.state.tempoRodando === '' ? '00:00:00' : this.state.tempoRodando} </span> </h1>
                    </div> 
                    <div className="ant-row-flex">
                      <h1 className="gx-mr-3 gx-mb-1"><span className="gx-text-white">Data Inicio: {this.props.dataInicio} </span> </h1>
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
};

export default MaquinaDetail;
