import React from 'react';
import { Col, Row, Checkbox, Card, Layout, List, Tag, Button, Modal, Spin, message } from 'antd';
import api from 'util/Api';
//import api2 from 'util/ApiCors'
import Auxiliary from 'util/Auxiliary';
import NextOrders from 'components/dashboard/Crypto/NextOrders';
import MaquinaDetail from 'components/dashboard/MaquinaDetail';
import { columns } from 'routes/dashboard/V3/data_listing';
import { socket } from 'util/socket.js';
import LoginApontamento from './loginApontamento';
import AptProd from './aptOrderProd';

const { Content, Footer } = Layout;
const { Meta } = Card;

var _ = require('lodash');

const modelMachine = 'MachineLabor'

class DashboardV3 extends React.Component {
  constructor(props) {
    super(props);

    var checkeds = JSON.parse(localStorage.getItem('checkeds'));
    if (!checkeds) {
      checkeds = [];
    }

    this.state = {
      visible: false,
      visibleLogin: false,
      listOfMachines: [],
      checkeds: checkeds,
      listOfOrdersByMachines: [],
      lengthOfChecks: checkeds.length,
      loading: false,
      password: '',
      orderprodSelect: {},
      flagToSecondPage: false
    };
  }


  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  showModalLogin = () => {
    this.setState({
      visibleLogin: true,
    });
  };


  handleOk = e => {
    console.log(e);
    this.setState({
      visible: false,
      loading: true,
      loadingTip: 'Carregando informações...',
      lengthOfChecks: this.state.checkeds.length
    });

    localStorage.setItem('checkeds', JSON.stringify(this.state.checkeds));
    this.getOrdersByMachinesSelect()
  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  handleOkLogin = e => {
    this.setState({
      visibleLogin: false,
    });

    this.loginMatricula();
  };

  handleCancelLogin = e => {
    this.setState({
      visibleLogin: false,
      password: ''
    });
  };


  handleChange = (event) => {
    console.log(event);
    this.setState(({
      password: event.target.value,
    }));
  }

  async loginMatricula() {
    let referenceThis = this;
    let apontamento = "";
    let orderSelect = this.state.orderprodSelect;
    console.log(orderSelect);

    if (orderSelect.orderProdObj) {
      this.state.orderprodSelect.orderProdObj.apontamentos.forEach((item) => {
        //Se a data fim estiver === "" entao esse apontamento estao em andamento
        if (item.dataFim === "") {
          apontamento = item;
        }
      });
    }

    await api
      .get(`/api/machinelabor/maodeobra/${this.state.password}`)
      .then(function (response) {
        console.log(response.data);
        if (
          typeof response.data !== "undefined" &&
          response.data.length > 0
        ) {
          if (apontamento) {
            api
              .get(`/machinelabor/${apontamento.colaborador}`)
              .then(function (machineL) {
                console.log(
                  "machineL.data.passwordappoitment" +
                  machineL.data.passwordappoitment
                );
                if (machineL.data.passwordappoitment === this.state.password) {
                  // navigateOrdem(response.data);

                  message.success('OK')
                  referenceThis.setState({
                    flagToSecondPage: true
                  })
                } else {
                  message.error(
                    "Aviso",
                    "Ordem de produção em andamento para o operador: " +
                    machineL.data.name
                  );
                }
              });
          } else {
            console.log("else");
            message.success('OK')
            referenceThis.setState({
              flagToSecondPage: true
            })
            //navigateOrdem(response.data);
          }
        } else {
          message.error(
            "Aviso",
            "Nenhuma matricula encontrada para esse código."
          );
        }
      })
      .catch(function (err) {
        console.log(err);
      })
      .then(function () {
        // setSpinner(false);
      });
  }

  getMaquinas() {
    api
      .get(`${modelMachine}`, {
        params: {
          params: [
            {
              field: 'type',
              value: 'maoDeObra',
              op: '=',
            },
          ],
        },
      })
      .then((result) => {
        let dataProd = [];
        dataProd = result.data.data.filter(maq => maq.type !== 'maoDeObra');

        this.setState({
          listOfMachines: dataProd,
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  componentDidMount() {
    this.getMaquinas()
  }

  onChangeCheckBox = (checkedValues) => {
    console.log('checked = ', checkedValues);


    this.setState({ checkeds: checkedValues });

  }

  getOrdersByMachinesSelect = async () => {
    let machinesSelect = this.state.checkeds;
    console.log(machinesSelect);

    var maqs = "";
    let testjson = JSON.stringify(machinesSelect);
    console.log(testjson);
    JSON.parse(testjson).map((e) => {
      console.log(e)
      maqs += e + ",";
    });

    let url = "orderProdMaquina/maquina/" + maqs;
    // console.log(url);

    const ordersResult = await api
      .get(url)
      .then((result) => {
        console.log(result);
        var grouped = _.mapValues(_.groupBy(result.data, 'maquina', 'montagem'));


        console.log(grouped);

        let listToAddState = [];
        for (const key in grouped) {
          const arrayRows = grouped[key];
          console.log(arrayRows)
          listToAddState.push({
            titleMachine: key,
            orders: arrayRows
          })
        }

        this.setState({
          listOfOrdersByMachines: listToAddState,
          loading: false
        });

      })
      .catch(function (error) {
        console.log(error);
      });

    console.log(maqs);
  }

  clickOnCard = (item) => {
    console.log(item)
    this.setState({
      orderprodSelect: item
    })
    this.showModalLogin();
  }

  backToFirstPage = () => {
    this.setState({
      flagToSecondPage: false,
      orderprodSelect: {}
    })

    this.getOrdersByMachinesSelect()
  }


  render() {
    const data = [
      {
        title: 'OP - 1',
        sub: 'ordem de produção 1'
      },
      {
        title: 'OP - 1',
        sub: 'ordem de produção 1'
      },
    ];

    const { listOfMachines, listOfOrdersByMachines, lengthOfChecks, flagToSecondPage, orderprodSelect } = this.state

    return (
      <div>
        {
          flagToSecondPage === true ?
            <AptProd 
              orderProdSelect={orderprodSelect}
              backToFirstPage={this.backToFirstPage}
            />
            :
            <Spin spinning={this.state.loading} tip={this.state.loadingTip}>
              <Layout className="gx-app-layout">
                <Content className="gx-layout-content gx-container-wrap  ant-layout-content">
                  <div className="gx-main-content-wrapper">
                    <Auxiliary>
                      <Row>
                        <Col span={24}>
                          <Button onClick={this.showModal} >
                            Escolher maquinas
                          </Button>
                        </Col>
                      </Row>


                      {listOfOrdersByMachines.length === 0 ? ""
                        :
                        <Row gutter={[10, 10]}>
                          {
                            listOfOrdersByMachines.map(machinesWithOrders => {
                              return (
                                <Col
                                  xxl={lengthOfChecks === 1 ? 24 : 8}
                                  xl={lengthOfChecks === 1 ? 24 : 8}
                                  lg={lengthOfChecks === 1 ? 24 : 8}
                                  md={lengthOfChecks === 1 ? 24 : 8}
                                  sm={lengthOfChecks === 1 ? 24 : 8}
                                  xs={lengthOfChecks === 1 ? 24 : 8}
                                >
                                  <Card >
                                    <center>
                                      <Meta title={machinesWithOrders.titleMachine} />
                                    </center>
                                  </Card>
                                  <List
                                    grid={{ gutter: 16, column: 1 }}
                                    dataSource={machinesWithOrders.orders}
                                    renderItem={item => (
                                      <List.Item>
                                        <Card
                                          title={`Ordem Produção : ${item.orderProdObj.id}`}
                                          hoverable={true}
                                          onClick={() => this.clickOnCard(item)}
                                        >
                                          <Row gutter={[10, 10]} >
                                            <Col span={24}>
                                              {`Data inicio: ${item.orderProdObj.dataProd}`}
                                            </Col>

                                            <Col span={24}>
                                              {`Descrição: ${item.orderProdObj.orderProduction}`}
                                            </Col>

                                            <Col span={24}>
                                              {`Quantidade solicitada: ${item.orderProdObj.qtde}`}
                                            </Col>

                                            <Col span={24}>
                                              {`Data de Entrega: ${item.orderProdObj.dataEntrega}`}
                                            </Col>

                                            <Col span={24}>
                                              {`Descrição: ${item.orderProdObj.dataProd}`}
                                            </Col>

                                          </Row>
                                        </Card>
                                      </List.Item>
                                    )}
                                  />
                                </Col>
                              )
                            })
                          }
                        </Row>
                      }
                      <Modal
                        title="Selecione as Maquinas"
                        visible={this.state.visible}
                        onOk={this.handleOk}
                        onCancel={this.handleCancel}
                      >
                        <Checkbox.Group style={{ width: '100%' }} onChange={this.onChangeCheckBox}>
                          <Row gutter={[12, 24]}>
                            {listOfMachines.map(mach => {
                              return (
                                <>
                                  <Col span={8}>
                                    <Checkbox value={mach.cod}>{mach.cod}</Checkbox>
                                  </Col>
                                </>
                              )
                            })}
                          </Row>
                        </Checkbox.Group>
                      </Modal>

                      <LoginApontamento
                        visibleLogin={this.state.visibleLogin}
                        handleOkLogin={this.handleOkLogin}
                        handleCancelLogin={this.handleCancelLogin}
                        handleChange={this.handleChange}
                        passwordInput={this.state.password}
                      />



                    </Auxiliary>
                  </div>
                </Content>
              </Layout>


            </Spin>
        }
      </div>

    );
  }
}

export default DashboardV3;
