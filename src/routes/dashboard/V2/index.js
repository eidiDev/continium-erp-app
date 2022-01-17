import React from "react";
import {Col, Row, Checkbox } from "antd";
import api from '../../../util/ApiCors'
//import { Modal, Button } from 'antd';
import Auxiliary from "util/Auxiliary";
import NextOrders from "components/dashboard/Crypto/NextOrders";
import MaquinaDetail from "components/dashboard/Crypto/MaquinaDetail";
import {columns} from "routes/dashboard/V2/data_listing";
//import api from 'util/Api';


var _ = require('lodash');

class DashboardV2 extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      page: false,
      visible:true,
      listOfDashboards: [],
      listofMaquinasOfOrderProd: [],
      dashboard: {
          name: '',
          check: false
      },
      machinesExecution: [],
      machinesFreedom: []
    }

  }
  componentWillMount() {
    this.getDashboards();
    this.getMaquinasInOrderProd();
  }

  componentDidMount() {
    setInterval(this.updateWindow.bind(this), 6000);
  }


  updateWindow = () => {
    this.setState({
      page: !this.state.page,
    });
    // window.location.reload();
  }

  getDashboards = () => {
    api.get(`Dashboards`, {
    })
    .then((result) => {
        let dataDash = [];
        dataDash = result.data;

        console.log(result);

        this.setState({
          listOfDashboards: dataDash
        });

    },)
    .catch(function(error) { 
        console.log(error);
    })
  }
  getMaquinasInOrderProd = () => {
    api.get(`orderprodMaquina`, {
    })
    .then((result) => {
        let dataDash = [];
        dataDash = result.data;
        console.log(result);
        let filtered = _.filter(dataDash, (o) => {
          return o.orderProd.status  === "liberada" || o.orderProd.status  === "execução"
        })

        this.setState({
          listofMaquinasOfOrderProd: filtered
        });

    },)
    .catch(function(error) { 
        console.log(error);
    })
  }

  onChange = (e) =>  {
        let newCateg = this.state.dashboard;
        newCateg.name = e.target.name;
        newCateg.check = e.target.checked;

        this.setState({
            dashboard: newCateg
        });
        this.onChangeDash();
  }

  onChangeDash = async () => {
    let maquinas = [];

   const {listOfDashboards,dashboard, listofMaquinasOfOrderProd} = this.state;

    for (const dash of listOfDashboards) {
      if(dash.cod === dashboard.name){
        for (const machinesInDashboard of dash.machines) {
          for (const machinesInorder of listofMaquinasOfOrderProd) {
            if(machinesInDashboard.cod === machinesInorder.maquina || machinesInDashboard.cod === machinesInorder.montagem){
              maquinas.push(machinesInorder);
            }
          }
        }
      }
    }

   let filteredExec;
   filteredExec = await _.filter(maquinas, (o) => {
     if(o.orderProd.status === "execução"){
      console.log(o);
     }
     return o.orderProd.status  === "execução" && o.statusEtapa === "execução"
   })

   

   let filteredFredom;

   filteredFredom = _.filter(maquinas, (o) => {
     return o.statusEtapa === "liberada"
   })

   //filteredExec = _.uniqBy(filteredExec, 'maquina')

   this.setState({
     machinesExecution: filteredExec,
     machinesFreedom: filteredFredom
   })
  
  }

  handleOk = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  render () {
    const {listOfDashboards,dashboard, listofMaquinasOfOrderProd, machinesFreedom} = this.state
    let machinesExecution = this.state.machinesExecution;

    machinesExecution = machinesExecution.slice(0,4);
    
    let machinesExecFirstCouple = machinesExecution.slice(0,2);
    let machinesExecSecondCouple = machinesExecution.slice(2,4);

    return  (
      <>
          <Auxiliary>
          <Row style={{marginBottom:20, marginTop: 20, marginLeft:20}}>
            {
              listOfDashboards.map(dash => {
                return(
                <Col span={3}>
                  <div className="gx-form-row0">
                  {/* <Tag style={{width: "100%", height: 30}} color="blue"> */}
                      <Checkbox onChange={this.onChange} value={dashboard.check} name={dash.cod}>{dash.cod}</Checkbox>
                  {/* </Tag> */}
                  </div>
                </Col>
                )
              })
            }
          </Row>
          <br/><br/>

          {dashboard.check === false ? 
          ""
          :
          <Row>
            <Col xl={12} lg={14} md={14} sm={24} xs={24} >
              {this.state.page === false ? 
                <Row>
                  {machinesExecFirstCouple.map(mach => {
                    return (
                      <Col xl={12} lg={12} md={12} sm={12} xs={24}>
                        <MaquinaDetail chartProperties= {{
                          idOrderProdMaquina: mach.orderProd.id,
                          idOrderProd: mach.id,
                          title:`${mach.maquina === "" ? mach.montagem : mach.maquina }`,
                          status: `${mach.orderProd.status === "execução" ? "Em Execução" : mach.orderProd.status }`,
                          orderProd: `${mach.orderProd.orderProduction}`,
                          bgColor:"primary",
                          cro: `${mach.orderProd.product.cod}`,
                          pedidoFox: `${mach.orderProd.orderFox}`,
                          qtde: `${mach.orderProd.qtde}`,
                          programador: `${mach.programador}`,
                          operador: `${mach.operador}`
                        }}/>
                      </Col>
                    )
                  })}

                  {machinesExecSecondCouple.map(mach => {
                    return (
                      <Col xl={12} lg={12} md={12} sm={12} xs={24}>
                        <MaquinaDetail chartProperties= {{
                          idOrderProdMaquina: mach.orderProd.id,
                          idOrderProd: mach.id,
                          title:`${mach.maquina}`,
                          status: `${mach.orderProd.status}`,
                          bgColor:"primary",
                          cro: `${mach.orderProd.product.cod}`,
                          pedidoFox: `${mach.orderProd.orderFox}`,
                          qtde: `${mach.orderProd.qtde}`,
                          programador: `${mach.programador}`,
                          operador: `${mach.operador}`
                        }}/>
                      </Col>
                    )
                  })}
                </Row>
                :
                <Row>
                  {machinesExecFirstCouple.map(mach => {
                    return (
                      <Col xl={12} lg={12} md={12} sm={12} xs={24}>
                        <MaquinaDetail chartProperties= {{
                          idOrderProdMaquina: mach.orderProd.id,
                          idOrderProd: mach.id,
                          title:`${mach.maquina}`,
                          status: `${mach.orderProd.status === "execução" ? "Em Execução" : mach.orderProd.status }`,
                          orderProd: `${mach.orderProd.orderProduction}`,
                          bgColor:"primary",
                          cro: `${mach.orderProd.product.cod}`,
                          pedidoFox: `${mach.orderProd.orderFox}`,
                          qtde: `${mach.orderProd.qtde}`,
                          programador: `${mach.programador}`,
                          operador: `${mach.operador}`
                        }}/>
                      </Col>
                    )
                  })}

                  {machinesExecSecondCouple.map(mach => {
                    return (
                      <Col xl={12} lg={12} md={12} sm={12} xs={24}>
                        <MaquinaDetail chartProperties= {{
                          idOrderProdMaquina: mach.orderProd.id,
                          idOrderProd: mach.id,
                          title:`${mach.maquina}`,
                          status: `${mach.orderProd.status}`,
                          bgColor:"primary",
                          cro: `${mach.orderProd.product.cod}`,
                          pedidoFox: `${mach.orderProd.orderFox}`,
                          qtde: `${mach.orderProd.qtde}`,
                          programador: `${mach.programador}`,
                          operador: `${mach.operador}`
                        }}/>
                      </Col>
                    )
                  })}
                </Row>
              }
            </Col>


            {this.state.page === false ? 
            <Col xl={12} lg={10} md={24} sm={24} xs={24}>
                {
                  listofMaquinasOfOrderProd.length === 0 ? 
                  "":
                  <NextOrders itemProperties={{ 
                    title:"Proximas ordens",
                    subtitle: "ordens",
                    data: machinesFreedom.slice(0,9),
                    columns:columns
                    }}
                />                        
                }
            </Col>
            :
            <Col xl={12} lg={10} md={24} sm={24} xs={24}>
              
                {
                  listofMaquinasOfOrderProd.length === 0 ? 
                  "":
                  <NextOrders itemProperties={{ 
                    title:"Proximas ordens",
                    subtitle: "ordens",
                    data: machinesFreedom.slice(0,9),
                    columns:columns
                    }}
                />                        
                }
            </Col>
            }
          </Row>
        }
        </Auxiliary>
      </>
  
    );
  }
};

export default DashboardV2;
