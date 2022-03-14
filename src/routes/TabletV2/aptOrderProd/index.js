import React from 'react';
import { Col, Modal, Row, Input, Icon, Button, Layout, Spin, Card, Form, Table, Alert } from 'antd';
import Auxiliary from 'util/Auxiliary';
const { Meta } = Card;

const { Content, Footer } = Layout;

class AptProd extends React.Component {
    constructor(props) {
        super(props);


        this.state = {
            isApontando: true
        };
    }

    // btnAddApontamento = async (tipo, id) => {
    //     // this.setState({ spinner: true });

    //     let apontamento = {
    //       tipo: tipo,
    //       qtdeApontada: id === 0 ? 0 : this.state.qtdeApontada,
    //       orderProd: this.state.order_num,
    //       machineLabor: this.state.machineLabor.id,
    //       colaborador: this.state.colaborador,
    //       etapa: this.state.maquina_id,
    //       maquina: this.state.maquina_cod,
    //       orderProdMaqId: this.state.orderProdMaqId,
    //     };
    
    //     //Deve buscar o apontamento no banco de dados, para pegar as propriedades e atualizar
    //     if (id !== 0) {
    //       apontamento.dataFim = Moment().format("DD/MM/YY HH:mm:ss");
    //       let apontamentos = [...this.state.apontamentos];
    //       apontamentos.forEach((item) => {
    //         if (item[0] === id) {
    //           let horaInicio = Moment(item[2], "DD/MM/YY HH:mm:ss");
    //           let mill = Moment().diff(horaInicio);
    
    //           let hours =
    //             Math.floor(mill / (60 * 60 * 1000)).toString().length === 1
    //               ? "0" + Math.floor((mill / (60 * 60 * 1000)) % 60)
    //               : Math.floor((mill / (60 * 60 * 1000)) % 60);
    //           let minutes =
    //             Math.floor((mill / (60 * 1000)) % 60).toString().length === 1
    //               ? "0" + Math.floor((mill / (60 * 1000)) % 60)
    //               : Math.floor((mill / (60 * 1000)) % 60);
    //           let secconds =
    //             Math.floor((mill / 1000) % 60).toString().length === 1
    //               ? "0" + Math.floor((mill / 1000) % 60)
    //               : Math.floor((mill / 1000) % 60);
    
    //           apontamento.tempoRealizado = hours + ":" + minutes + ":" + secconds;
    
    //           return;
    //         }
    //       });
    //       // console.log(`/noteProd/${id}`);
    //       // console.log(apontamento);
    
    //       //agora vai atualizar no banco
    //       console.log(`Vai mandar o apontamento pro banco patch /noteProd/${id}`);
    
    //       await pneumaxApi
    //         .patch(`/noteProd/${id}`, apontamento)
    //         .then((response) => {
    //           let apontamentos = [...this.state.apontamentos];
    //           // apontamentos.forEach((item) =>  {
    //           //     console.log("item",item);
    //           //     if(item[0] === response.data.id) {
    //           //         item[3] = Moment().format("DD/MM/YY HH:mm");
    //           //         item[4] = Moment(Moment(Moment()).diff(Moment(response.data.dataInicio))).utc().format("HH:mm:ss");
    //           //         item[5] = response.data.qtdeApontada;
    //           //         return;
    //           //     };
    //           // });
    //           // console.log(apontamentos);
    //           //Se deu certo, ele atualiza no grid
    //           let item = apontamentos.find((record) => record[0] === id);
    //           item[3] = apontamento.dataFim;
    //           item[4] = apontamento.tempoRealizado;
    //           item[5] = apontamento.qtdeApontada;
    //           console.log("613");
    
    //           this.setState({
    //             isApontando: false,
    //             apontamentoAndamento: {},
    //             tipoApondamento: "",
    //             idApontando: 0,
    //             qtdeApontada: 0,
    //             apontamentos: apontamentos,
    //             qtdeApontadaEtapa:
    //               parseInt(this.state.qtdeApontadaEtapa) +
    //               parseInt(apontamento.qtdeApontada),
    //           });
    //           this.onStopTimer();
    //           this.updateControle();
    //           if (tipo === "programar" && this.state.maquina.controle) {
    //             this.setState({
    //               isBtnOperarDisabled: true,
    //               isBtnControleDisabled: false,
    //               spinner: false,
    //             });
    //           } else {
    //             this.setState({
    //               isBtnOperarDisabled: false,
    //               isBtnControleDisabled: true,
    //               spinner: false,
    //             });
    //           }
    //         })
    //         .catch((err) => {
    //           console.log(err);
    //           console.log(err.message);
    //           Alert.alert("Erro ao atualizar", "Error: " + err.message);
    //         });
    //     } else {
    //       console.log(`Vai mandar o apontamento pro banco post /noteProd/${id}`);
    //       //Caso o id nao exista, entao ele vai adicionar o apontamento apenas a data de inicio
    //       let apontamento = {
    //         tipo: tipo,
    //         qtdeApontada: id === 0 ? 0 : this.state.qtdeApontada,
    //         orderProd: this.state.order_num,
    //         etapa: this.state.maquina_id,
    //         maquina: this.state.maquina_cod,
    //         dataInicio: Moment().format("DD/MM/YY HH:mm:ss"),
    //         colaborador: this.state.colaborador,
    //         orderProdMaqId: this.state.orderProdMaqId,
    //       };
    //       this.setState({ ordem_status: "execução" });
    
    //       //Agora ele vai gravar no banco de dados.
    //       await pneumaxApi
    //         .post(`/noteProd/`, apontamento)
    //         .then((response) => {
    //           // console.log(response.data);
    //           apontamento.id = response.data.id;
    //           this.addApontamento(tipo, apontamento);
    //           this.setState({
    //             isApontando: true,
    //             apontamentoAndamento: apontamento,
    //             tipoApondamento: tipo,
    //             idApontando: response.data.id,
    //             tempoRodando: "00:00:00",
    //             spinner: false,
    //           });
    //           this.start();
    //           this.setState({ isBtnControleDisabled: true });
    //         })
    //         .catch((err) => {
    //           console.log(err);
    //           Alert.alert("Erro ao cadastrar apontamento", "Error: " + err.message);
    //         });
    //     }
    // };


    // onPressBtn = (action) => {
    //     switch (action) {
    //       case "programar":
    //         this.btnAddApontamento("programar", this.state.idApontando);
    //         break;
    //       case "operar":
    //         this.btnAddApontamento("operar", this.state.idApontando);
    //         break;
    //       case "montar":
    //         this.btnAddApontamento("montar", this.state.idApontando);
    //         break;
    //       case "pausar":
    //         this.btnAddApontamento("pausar", this.state.idApontando);
    //         break;
    //       case "finalizar":
    //         this.btnFinalizar();
    //         break;
    //       case "sair":
    //         break;
    //     }
    //     // this.setState({ spinner: false });
    // };

    render() {
        const { orderProdSelect } = this.props
        const { isApontando } = this.state;

        console.log(orderProdSelect);
        return (
            <Spin spinning={false} tip={''}>
                <Layout className="gx-app-layout">
                    <Content className="gx-layout-content gx-container-wrap  ant-layout-content">
                        <div className="gx-main-content-wrapper">
                            <Auxiliary>



                                <Row>
                                    <Col span={24}>
                                        <Button onClick={this.props.backToFirstPage} >
                                            Voltar
                                        </Button>
                                    </Col>
                                </Row>


                                {isApontando ?
                                    <>
                                        <Row >
                                            <Col span={24} >
                                                <Alert message={" Tempo Decorrido:"} type="error" />
                                            </Col>
                                        </Row>
                                        <br />
                                    </>
                                    :
                                    ""
                                }


                                <Row gutter={[10, 10]}>
                                    <Col span={24}>
                                        <Card type="inner" title="Dados da Ordem de Produção">
                                            <Row>
                                                <Col lg={6} md={6} sm={12} xs={24}>
                                                    <div className="gx-form-row0">
                                                        <Form.Item label="Máquina">
                                                            <Input
                                                                type="text"
                                                                value={orderProdSelect.maquina ? orderProdSelect.maquina : orderProdSelect.montagem  }
                                                                name="cod"
                                                                disabled={true}
                                                            />
                                                        </Form.Item>
                                                    </div>
                                                </Col>

                                                <Col lg={6} md={6} sm={12} xs={24}>
                                                    <div className="gx-form-row0">
                                                        <Form.Item label="Ordem de produção">
                                                            <Input
                                                                type="text"
                                                                value={orderProdSelect.orderProdObj.orderProduction}
                                                                name="cod"
                                                                disabled={true}
                                                            />
                                                        </Form.Item>
                                                    </div>
                                                </Col>

                                                <Col lg={6} md={6} sm={12} xs={24}>
                                                    <div className="gx-form-row0">
                                                        <Form.Item label="Status">
                                                            <Input
                                                                type="text"
                                                                value={orderProdSelect.orderProdObj.status.toUpperCase()}
                                                                name="cod"
                                                                disabled={true}
                                                            />
                                                        </Form.Item>
                                                    </div>
                                                </Col>

                                            </Row>
                                        </Card>


                                    </Col>
                                </Row>


                                <Row gutter={[10, 10]}>
                                    <Col span={24}>
                                        <Card type="inner" title="Produto">
                                            <Row>
                                                <Col lg={6} md={6} sm={12} xs={24}>
                                                    <div className="gx-form-row0">
                                                        <Form.Item label="Produto">
                                                            <Input
                                                                type="text"
                                                                value={orderProdSelect.orderProdObj.productObj.cod}
                                                                name="cod"
                                                                disabled={true}
                                                            />
                                                        </Form.Item>
                                                    </div>
                                                </Col>

                                                <Col lg={6} md={6} sm={12} xs={24}>
                                                    <div className="gx-form-row0">
                                                        <Form.Item label="Descrição">
                                                            <Input
                                                                type="text"
                                                                value={orderProdSelect.orderProdObj.productObj.description1}
                                                                name="cod"
                                                                disabled={true}
                                                            />
                                                        </Form.Item>
                                                    </div>
                                                </Col>

                                                <Col lg={6} md={6} sm={12} xs={24}>
                                                    <div className="gx-form-row0">
                                                        <Form.Item label="Qtde prevista">
                                                            <Input
                                                                type="text"
                                                                value={orderProdSelect.orderProdObj.qtde}
                                                                name="cod"
                                                                disabled={true}
                                                            />
                                                        </Form.Item>
                                                    </div>
                                                </Col>
                                            </Row>

                                            <Row>
                                            <Col lg={6} md={6} sm={12} xs={24}>
                                                    <div className="gx-form-row0">
                                                        <Form.Item label="Qtde apontada">
                                                            <Input
                                                                type="text"
                                                                // value={categ.cod}
                                                                name="cod"
                                                                disabled={true}
                                                            />
                                                        </Form.Item>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </Card>


                                    </Col>
                                </Row>


                                <Row gutter={[14, 10]}>
                                    <Col span={24}>
                                        <Card type="inner" title="Produzir">
                                            <Row>
                                                <Col lg={6} md={6} sm={12} xs={24}>
                                                    <div className="gx-form-row0">
                                                        <Button type="primary" block >
                                                            +1
                                                        </Button>
                                                    </div>
                                                </Col>

                                                <Col lg={6} md={6} sm={12} xs={24}>
                                                    <div className="gx-form-row0">
                                                        <Button type="primary" block>
                                                            -1
                                                        </Button>
                                                    </div>
                                                </Col>

                                                <Col lg={6} md={6} sm={12} xs={24}>
                                                    <div className="gx-form-row0">
                                                        <Button type="primary" block>
                                                            +10
                                                        </Button>
                                                    </div>
                                                </Col>

                                                <Col lg={6} md={6} sm={12} xs={24}>
                                                    <div className="gx-form-row0">
                                                        <Button type="primary" block>
                                                            -10
                                                        </Button>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </Card>
                                    </Col>
                                </Row>

                                <Row gutter={[10, 10]}>
                                    <Col
                                        xxl={18}
                                        xl={18}
                                        lg={18}
                                        md={18}
                                        sm={18}
                                        xs={24}>
                                        <Card type="inner" title="Apontamentos">
                                            <Table></Table>
                                        </Card>
                                    </Col>

                                    <Col
                                        xxl={6}
                                        xl={6}
                                        lg={6}
                                        md={6}
                                        sm={6}
                                        xs={24}>
                                        <Card type="inner" title="Apontamentos">
                                            <Row>
                                                <Col span={24}>
                                                    <Button type="primary" block>
                                                        Programar
                                                    </Button>
                                                </Col>
                                            </Row>

                                            <Row>
                                                <Col span={24}>
                                                    <Button type="primary" block >
                                                        Operar
                                                    </Button>
                                                </Col>
                                            </Row>

                                            <Row>
                                                <Col span={24}>
                                                    <Button type="primary" block>
                                                        Pausar
                                                    </Button>
                                                </Col>
                                            </Row>

                                            <Row>
                                                <Col span={24}>
                                                    <Button type="primary" block>
                                                        Finalizar
                                                    </Button>
                                                </Col>
                                            </Row>
                                        </Card>
                                    </Col>
                                </Row>
                            </Auxiliary>
                        </div>
                    </Content>
                </Layout>
            </Spin>
        )
    }
}

export default AptProd;