import React from 'react';
import { Col, Row, Checkbox, Card, Layout } from 'antd';
import api from 'util/ApiCors';
//import api2 from 'util/ApiCors'
import Auxiliary from 'util/Auxiliary';
import NextOrders from 'components/dashboard/Crypto/NextOrders';
import MaquinaDetail from 'components/dashboard/MaquinaDetail';
import { columns } from 'routes/dashboard/V3/data_listing';
import {socket} from 'util/socket.js'

const { Content, Footer } = Layout;

var _ = require('lodash');

class DashboardV3 extends React.Component {
  constructor(props) {
    super(props);

    var checkeds = JSON.parse(localStorage.getItem('checkeds'));
    if (!checkeds) {
      checkeds = [];
    }

    this.state = {
      page: false,
      visible: true,
      listOfDashboards: [],
      listofMaquinasOfOrderProd: [],
      dashboard: {
        name: '',
        check: false,
      },
      machinesExecution: [],
      machinesFreedom: [],
      checkeds: checkeds,
      showMaquinas: [],
      timerOrders: null,
    };

    //Timeout para buscar as ordens a cada 5 segndos
    // let timerOrders = setInterval(() => {
    //   // console.log('vai buscar as ordens');

    //   this.getMaquinasInOrderProd();
    // }, 10000);
    // this.setState({ timerOrders });
    
  }
  
  componentWillMount() {
    this.getDashboards();
    this.getMaquinasInOrderProd();
  }

  componentDidMount() {

      socket.on('getMachinesFreedom', data => {
          this.setState({
            machinesExecution: data.listaexec ,
            machinesFreedom:  data.lista
          })
      })    
  }

  updateWindow = () => {
    this.setState({
      page: !this.state.page,
    });
    // window.location.reload();
  };

  getDashboards = () => {
    api
      .get(`Dashboards`, {})
      .then((result) => {
        let dataDash = [];

        dataDash = result.data.data;

        this.setState({
          listOfDashboards: dataDash,
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  getMaquinasInOrderProd = async () => {
    // console.log('buscando ordens');
    if (this.state.checkeds.length > 0) {
      var dash = '';
      this.state.checkeds.map((e) => {
        dash += e + ',';
      });

      console.log(dash);
      // await api
      //   .get(`/dashboard/returnOrderProdMaquina/${dash}`)
      //   .then((result) => {
      //     let dataDash = [];
      //     dataDash = result.data;
      //     // console.log(result);
      //     // let filtered = _.filter(dataDash, (o) => {
      //     //   if (o.orderProdObj !== null) {
      //     //     return (
      //     //       o.orderProdObj.status === 'liberada' ||
      //     //       o.orderProdObj.status === 'execução'
      //     //     );
      //     //   }
      //     // });
      //     // let execucao = [];
      //     // execucao = filtered.filter(
      //     //   (item) =>
      //     //     item.orderProdObj.status === 'execução' ||
      //     //     item.statusEtapa === 'execução'
      //     // );

      //     // execucao.forEach(item => {
      //     //   item.tempo = setInterval(() => {
      //     //     const tempoRodando = moment(moment().diff(inicio)).utc().format("HH:mm:ss");
      //     //     let t = tempoRodando;
      //     //     // console.log(t);
      //     //     this.setState({tempoRodando: t});
      //     //   }, 1000);;
      //     // });

           
      //     // console.log(execucao);
      //     // this.setState({
      //     //   listofMaquinasOfOrderProd: filtered,
      //     //   machinesExecution: execucao,
      //     //   machinesFreedom: filtered.filter(
      //     //     (item) => item.statusEtapa === 'liberada'
      //     //   ),
      //     // });

      //     this.setState({
            
      //     })

      //     this.forceUpdate();
      //   })
      //   .catch(function (error) {
      //     console.log(error);
      //   });
      this.showDash(this.state.checkeds);
    }
  };

  onChange = (e) => {
    // console.log(this.state.listOfDashboards);


    let dash = this.state.checkeds;

    if (e.target.checked) {
      dash.push(e.target.name);
    } else {
      dash = dash.filter((item) => item !== e.target.name);
    }
    localStorage.setItem('checkeds', JSON.stringify(dash));
    this.setState({ checkeds: dash });

    if(localStorage.length === 0){
    }else{
      this.getMaquinasInOrderProd();
    }

    // uniqueArray = a.filter(function(item, pos) {
    //     return a.indexOf(item) == pos;
    // })

    // console.log(this.state.checkeds);
    this.showDash(dash);

    /* *
    let showMaq = [];
    let listofDash = this.state.listOfDashboards;
    // eslint-disable-next-line
    dash.forEach(function (item) {
      let maqs = [];
      // eslint-disable-next-line
      listofDash.forEach((item2) => {
        if (item2.cod === item) {
          item2.machines.forEach((machine) => {
            maqs.push(machine.cod);
          });
        }
      });
      // eslint-disable-next-line
      maqs.forEach((maq) => {
        if (!showMaq.find((item) => item === maq)) {
          showMaq.push(maq);
        }
      });
    });
    */

    // let newCateg = this.state.dashboard;
    // newCateg.name = e.target.name;
    // newCateg.check = e.target.checked;

    // this.setState({
    //     dashboard: newCateg
    // });

    // this.onChangeDash();
  };

  showDash = (dash) => {
    let showMaq = [];
    let listofDash = this.state.listOfDashboards;
    // const dash = this.state.checkeds;
    // eslint-disable-next-line
    dash.forEach(function (item) {
      let maqs = [];
      // eslint-disable-next-line
      listofDash.forEach((item2) => {
        if (item2.cod === item) {
          item2.machines.forEach((machine) => {
            maqs.push(machine.cod);
          });
        }
      });
      // eslint-disable-next-line
      maqs.forEach((maq) => {
        if (!showMaq.find((item) => item === maq)) {
          showMaq.push(maq);
        }
      });
    });
    this.setState({ showMaquinas: showMaq });
  };

  onChangeDash = async () => {
    let maquinas = [];

    const {
      listOfDashboards,
      dashboard,
      listofMaquinasOfOrderProd,
    } = this.state;

    for (const dash of listOfDashboards) {
      if (dash.cod === dashboard.name) {
        for (const machinesInDashboard of dash.machines) {
          for (const machinesInorder of listofMaquinasOfOrderProd) {
            if (
              machinesInDashboard.cod === machinesInorder.maquina ||
              machinesInDashboard.cod === machinesInorder.montagem
            ) {
              maquinas.push(machinesInorder);
            }
          }
        }
      }
    }

    let filteredExec;
    filteredExec = await _.filter(maquinas, (o) => {
      if (o.orderProd.status === 'execução') {
        //   console.log(o);
      }
      return o.orderProd.status === 'execução' && o.statusEtapa === 'execução';
    });

    let filteredFredom;

    filteredFredom = _.filter(maquinas, (o) => {
      return o.statusEtapa === 'liberada';
    });

    //filteredExec = _.uniqBy(filteredExec, 'maquina')

    this.setState({
      machinesExecution: filteredExec,
      machinesFreedom: filteredFredom,
    });
  };

  handleOk = (e) => {
    // console.log(e);
    this.setState({
      visible: false,
    });
  };

  render() {
    const {
      listOfDashboards,
      dashboard,
      listofMaquinasOfOrderProd,
      machinesFreedom,
    } = this.state;
    // let machinesExecution = this.state.machinesExecution;
    // machinesExecution = machinesExecution.slice(0,4);



    let nextOrders = [];
    machinesFreedom.forEach((item) => {
      if (
        this.state.showMaquinas.find(
          (maq) => maq === item.maquina || maq === item.montagem
        )
      ) {
        nextOrders.push(item);
      }
    });

    if(this.state.showMaquinas.length != 0 ){
      let mqs = this.state.showMaquinas

      socket.emit("getMachinesFreedom", mqs);

      // socket.emit("getMachinesExec", mqs)
    }
    // let machinesExecFirstCouple = machinesExecution.slice(0,2);
    // let machinesExecSecondCouple = machinesExecution.slice(2,4);
    // let showMaqs = this.state.showMaquinas;
    return (
      <Layout className="gx-app-layout">
        <Content className="gx-layout-content gx-container-wrap  ant-layout-content">
          <div className="gx-main-content-wrapper">
            <Auxiliary>
              <Row>
                <Col span={24}>
                  <Card type="inner" title="Dashboards">
                    <Row>
                      {listOfDashboards.map((dash) => {
                        return (
                          <Col span={4}>
                            <div className="gx-form-row0">
                              <Checkbox
                                onChange={this.onChange}
                                value={dashboard.check}
                                checked={
                                  this.state.checkeds.find(
                                    (item) => item === dash.cod
                                  )
                                    ? true
                                    : false
                                }
                                name={dash.cod}
                              >
                                {dash.cod}
                              </Checkbox>
                            </div>
                          </Col>
                        );
                      })}
                    </Row>
                  </Card>
                </Col>
              </Row>
              <Row>
                <Col span={13}>
                  <Row>
                    {this.state.machinesExecution.map((mach) => {
                      return (
                        // <div style={{display: this.state.showMaquinas.find(item => item === mach.maquina || item === mach.montagem) ? '' :'none'}}>
                        <div
                          style={{
                            width: '50%',
                            display: this.state.showMaquinas.find(
                              (item) =>
                                item === mach.maquina || item === mach.montagem
                            )
                              ? ''
                              : 'none',
                          }}
                        >
                          <Col span={24}>
                            <MaquinaDetail
                              key={mach.orderprodid}
                              idOrderProdMaquina={mach.orderprodid}
                              //apontamentos={mach.orderProd.apontamentos}
                              idOrderProd={mach.orderprodid}
                              title={`${
                                mach.maquina === ''
                                  ? mach.montagem
                                  : mach.maquina
                              }`}
                              status={`${
                                mach.status === 'execução'
                                  ? 'Em Execução'
                                  : mach.status
                              }`}
                              orderProd={`${mach.orderProduction}`}
                              bgColor={'primary'}
                              //order={mach.orderProd}
                              cro={
                                mach.productid !== null
                                  ? mach.produtocod
                                  : ''
                              }
                              obj={mach}
                              pedidoFox={`${mach.orderFox}`}
                              qtde={`${mach.qtdeApontada}`}
                              programador={`${mach.programador}`}
                              operador={`${mach.operador}`}
                              //apontamento={apontamento}
                              dataInicio={`${mach.dataInicio}`}
                              show={
                                this.state.showMaquinas.find(
                                  (item) =>
                                    item === mach.maquina ||
                                    item === mach.montagem
                                )
                                  ? true
                                  : false
                              }
                            />
                          </Col>
                        </div>
                      );
                    })}
                  </Row>
                </Col>
                <Col span={11}>
                  {machinesFreedom.length === 0 ? (
                    ''
                  ) : (
                    <NextOrders
                      data={nextOrders}
                      itemProperties={{
                        title: 'Proximas ordens',
                        // subtitle: "ordens",
                        data: nextOrders,
                        columns: columns,
                      }}
                    />
                  )}
                </Col>
              </Row>
            </Auxiliary>
          </div>
        </Content>
      </Layout>
    );
  }
}

export default DashboardV3;
