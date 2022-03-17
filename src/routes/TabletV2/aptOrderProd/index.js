import React from 'react';
import { Col, Modal, Row, Input, Icon, Button, Layout, Spin, Card, Form, Table, Alert, message, } from 'antd';
import Auxiliary from 'util/Auxiliary';
import Moment from "moment";
import api from 'util/Api';
const { Meta } = Card;
const { confirm } = Modal;


const { Content, Footer, Header } = Layout;

const StatusEnum = Object.freeze({
    programar: "Programando",
    montar: "Montando",
    operar: "Operando",
    pausar: "Pausado",
    retrabalho: "Retrabalho",
    outro: "Outros",
    controle: "Controle",
});


class AptProd extends React.Component {
    constructor(props) {
        super(props);


        this.state = {
            loading: false,
            isApontando: false,
            tempoRodando: "00:00:00",
            apontamentoAndamento: {},
            tipoApondamento: "",
            idApontando: 0,
            qtdeApontada: 0,
            apontamentos: [],
            qtdeApontadaEtapa: 0,
            qtdeApontadaEtapaAnterior: 0,
            maquina_cod: this.props.orderProdSelect.maquina ? this.props.orderProdSelect.maquina : this.props.orderProdSelect.montagem,
            lodingAll: false,
            motivoText: ""
        };

        this.columnsApt = [
            {
                title: 'ID',
                dataIndex: 'id',
                key: 'id',
            },
            {
                title: 'Tipo',
                dataIndex: 'tipo',
                key: 'tipo',
            },
            {
                title: 'Data Hora Inicio',
                dataIndex: 'dataInicio',
                key: 'dataInicio',
            },
            {
                title: 'Data Hora Fim',
                dataIndex: 'dataFim',
                key: 'dataFim',
            },
            {
                title: 'Tempo',
                dataIndex: 'tempo',
                key: 'tempo',
            },
            {
                title: 'Apontado',
                dataIndex: 'qtdeApontada',
                key: 'qtdeApontada',
            },
        ];

        this.getOrdemDetail(this.props.orderProdSelect.orderProdObj.id);
    }

    onChangeMotivo = event => {
        let motivoEvent = this.state.motivoText;
        motivoEvent = event.target.value;

        this.setState(() => ({
            motivoText: motivoEvent
        }))
    }

    getOrdemDetail = async (id) => {
        // this.setState({ spinner: true });
        // console.log("Vai busccar a ordem: "+id)
        const result = await api.get("/orderProd/" + id);

        let etapaAnterior = {};
        let etapaAtual = result.data.etapas.find(
            (etapa) => etapa.maquina === this.state.maquina_cod
        );

        if (etapaAtual !== undefined) {
            if (etapaAtual.sequencia > 1) {
                etapaAnterior = result.data.etapas.find((etapa) => {
                    console.log(etapa.sequencia);
                    if (etapa.sequencia === etapaAtual.sequencia - 1) {
                        return etapa;
                    }
                });
            }
        }

        const apontamentos = result.data.apontamentos.filter(
            (apt) => apt.maquina === this.state.maquina_cod
        );
        // console.log('etapaAtual',etapaAtual);
        // console.log('etapaAnterior',etapaAnterior);
        // console.log(result.data.product.principalArch[0].type);
        // console.log(result.data.product.principalArch[0].urlem64);

        let product = [];
        product.cod = result.data.product.cod;
        product.description = result.data.product.description1;
        // console.log('----------------');

        let apont = [];
        let qtdeApontadaEtapa = 0;
        let qtdeApontadaEtapaAnterior = 0;

        apontamentos.forEach((item) => {
            apont.push({
                id: item.id,
                tipo: this.getStatus(item.tipo),
                dataInicio: item.dataInicio,
                dataFim: item.dataFim,
                tempo: item.tempoRealizado,
                qtdeApontada: item.qtdeApontada,
            }
            );
            //Se a data fim estiver === "" entao esse apontamento estao em andamento
            if (item.dataFim === null) {
                let inicio = Moment(item.dataInicio, "DD/MM/YY HH:mm:ss");
                const tempoRodando = Moment(Moment().diff(inicio))
                    .utc()
                    .format("HH:mm:ss");
                this.setState({
                    tempoRodando: tempoRodando,
                    apontamentoAndamento: item,
                    isApontando: true,
                    tipoApondamento: item.tipo,
                    idApontando: item.id,
                    qtdeApontada: item.qtdeApontada.toString(),
                });
                this.start();
            }
            //Pega a quantidade apontada nessa etapa
            if (item.etapa === this.state.maquina_id && item.dataFim !== "") {
                qtdeApontadaEtapa += item.qtdeApontada;
            }
        });

        result.data.apontamentos.forEach((item) => {
            if (etapaAtual !== undefined && etapaAnterior !== undefined) {
                if (etapaAtual.sequencia > 1 && Object.keys(etapaAnterior).length > 0) {
                    if (etapaAnterior.maquina === item.maquina) {
                        qtdeApontadaEtapaAnterior += item.qtdeApontada;
                    }
                }
            }
        });

        apont.sort(function (a, b) {
            if (a[0] > b[0]) {
                return -1;
            }
            if (a[0] < b[0]) {
                return 1;
            }
            return 0;
        });
        console.log(result.data);
        this.setState({
            apontamentos: apont,
            qtdeApontadaEtapa: qtdeApontadaEtapa,
            qtdeApontadaEtapaAnterior,
        });

        //Adicionar a imagem
        // console.log(
        //   "result.data.product.principalArch[0].urlem64",
        //   result.data.product.principalArch
        // );
        // if (result.data.product.principalArch != "[]") {
        //   pneumaxApi
        //     .get(API_URL + `/getFiles`, {
        //       params: result.data.product.principalArch,
        //     })
        //     .then((result2) => {
        //       // console.log(result2.request.responseURL);
        //       this.setState({
        //         imagemUrl: result2.request.responseURL,
        //         imagemType: result.data.product.principalArch.type,
        //       });

        //       // window.open(result.request.responseURL);
        //     })
        //     .catch(function (error) {
        //       console.log(error);
        //       // message.error('Erro ao buscar registro, tente novamente mais tarde!');
        //       //parent.setStateEdit(record)
        //     });
        //   // if(result.data.product.principalArch != null) {
        //   //     this.setState({
        //   //         imagem64: result.data.product.principalArch[0].urlem64,
        //   //         imagemType: result.data.product.principalArch[0].type,
        //   //     })
        //   // }
        // }
        // console.log(result.data.product.principalArch[0].urlem64);
        // imagem64: result.data.product.principalArch[0].urlem64,
        // imagemType: result.data.product.principalArch[0].type,

        //Verifica o ultimo apontamento
        // this.updateControle();
    };

    getStatus(tipoApondamento) {
        switch (tipoApondamento) {
            case "programar":
                return StatusEnum.programar;
            case "montar":
                return StatusEnum.montar;
            case "operar":
                return StatusEnum.operar;
            case "pausar":
                return StatusEnum.pausar;
            case "controle":
                return StatusEnum.controle;
            case "retrabalho":
                return StatusEnum.retrabalho;
            case "outro":
                return StatusEnum.outro;

            default:
                return "";
                break;
        }
    }

    start = () => {
        var self = this;
        let timer = setInterval(() => {
            let inicio = Moment(
                this.state.apontamentoAndamento.dataInicio,
                "DD/MM/YY HH:mm:ss"
            );
            const tempoRodando = Moment(Moment().diff(inicio))
                .utc()
                .format("HH:mm:ss");
            // console.log('#321: '+inicio);
            // console.log('#322: '+tempoRodando);

            let t = tempoRodando;
            this.setState({ tempoRodando: t });
        }, 1000);
        this.setState({ timer });

        // var date = new Date();
        // this.setState({horaInicio: date.getHours()+":"+date.getMinutes()})
    }

    btnAddApontamento = async (tipo, id) => {
        this.setState({ loading: true, loadingTip: "Carregando Operação..." });
        const { orderProdSelect, operadorSelect } = this.props;

        console.log(orderProdSelect);

        let apontamento = {
            tipo: tipo,
            qtdeApontada: id === 0 ? 0 : this.state.qtdeApontada,
            orderProd: orderProdSelect.orderProdObj.id,
            machineLabor: null,
            colaborador: operadorSelect.id,
            etapa: orderProdSelect.id,
            maquina: orderProdSelect.maquina ? orderProdSelect.maquina : orderProdSelect.montagem,
            orderProdMaqId: orderProdSelect.id,
            motivo_retrabalho: this.state.motivoText
        };

        //Deve buscar o apontamento no banco de dados, para pegar as propriedades e atualizar
        if (id !== 0) {
            apontamento.dataFim = Moment().format("DD/MM/YY HH:mm:ss");
            let apontamentos = [...this.state.apontamentos];
            apontamentos.forEach((item) => {
                if (item.id === id) {
                    let horaInicio = Moment(item.dataInicio, "DD/MM/YY HH:mm:ss");
                    let mill = Moment().diff(horaInicio);

                    let hours =
                        Math.floor(mill / (60 * 60 * 1000)).toString().length === 1
                            ? "0" + Math.floor((mill / (60 * 60 * 1000)) % 60)
                            : Math.floor((mill / (60 * 60 * 1000)) % 60);
                    let minutes =
                        Math.floor((mill / (60 * 1000)) % 60).toString().length === 1
                            ? "0" + Math.floor((mill / (60 * 1000)) % 60)
                            : Math.floor((mill / (60 * 1000)) % 60);
                    let secconds =
                        Math.floor((mill / 1000) % 60).toString().length === 1
                            ? "0" + Math.floor((mill / 1000) % 60)
                            : Math.floor((mill / 1000) % 60);

                    apontamento.tempoRealizado = hours + ":" + minutes + ":" + secconds;

                    return;
                }
            });
            // console.log(`/noteProd/${id}`);
            // console.log(apontamento);

            //agora vai atualizar no banco
            console.log(`Vai mandar o apontamento pro banco patch /noteProd/${id}`);

            await api
                .patch(`/noteProd/${id}`, apontamento)
                .then((response) => {
                    let apontamentos = [...this.state.apontamentos];
                    // apontamentos.forEach((item) =>  {
                    //     console.log("item",item);
                    //     if(item[0] === response.data.id) {
                    //         item[3] = Moment().format("DD/MM/YY HH:mm");
                    //         item[4] = Moment(Moment(Moment()).diff(Moment(response.data.dataInicio))).utc().format("HH:mm:ss");
                    //         item[5] = response.data.qtdeApontada;
                    //         return;
                    //     };
                    // });
                    // console.log(apontamentos);
                    //Se deu certo, ele atualiza no grid
                    let item = apontamentos.find((record) => record.id === id);
                    console.log(item);
                    item.dataFim = apontamento.dataFim;
                    item.tempoRealizado = apontamento.tempoRealizado;
                    item.tempo = apontamento.tempoRealizado
                    item.qtdeApontada = apontamento.qtdeApontada;
                    console.log("613");

                    this.setState({
                        loading: false,
                        isApontando: false,
                        apontamentoAndamento: {},
                        tipoApondamento: "",
                        idApontando: 0,
                        qtdeApontada: 0,
                        apontamentos: apontamentos,
                        motivoText: "",
                        qtdeApontadaEtapa:
                            parseInt(this.state.qtdeApontadaEtapa) +
                            parseInt(apontamento.qtdeApontada),
                    });
                    //   this.onStopTimer();
                    //   this.updateControle();
                    //   if (tipo === "programar" && this.state.maquina.controle) {
                    //     // this.setState({
                    //     //   isBtnOperarDisabled: true,
                    //     //   isBtnControleDisabled: false,
                    //     //   spinner: false,
                    //     // });
                    //   } else {
                    //     // this.setState({
                    //     //   isBtnOperarDisabled: false,
                    //     //   isBtnControleDisabled: true,
                    //     //   spinner: false,
                    //     // });
                    //   }
                })
                .catch((err) => {
                    console.log(err);
                    console.log(err.message);
                    message.error("Erro ao atualizar", "Error: " + err.message);
                });
        } else {
            console.log(`Vai mandar o apontamento pro banco post /noteProd/${id}`);
            //Caso o id nao exista, entao ele vai adicionar o apontamento apenas a data de inicio
            let apontamento = {
                tipo: tipo,
                qtdeApontada: id === 0 ? 0 : this.state.qtdeApontada,
                orderProd: orderProdSelect.orderProdObj.id,
                etapa: orderProdSelect.id,
                maquina: orderProdSelect.maquina ? orderProdSelect.maquina : orderProdSelect.montagem,
                dataInicio: Moment().format("DD/MM/YY HH:mm:ss"),
                colaborador: operadorSelect.id,
                orderProdMaqId: orderProdSelect.id,
            };
            // this.setState({ ordem_status: "execução" });

            //Agora ele vai gravar no banco de dados.
            await api
                .post(`/noteProd/`, apontamento)
                .then((response) => {
                    // console.log(response.data);
                    apontamento.id = response.data[0].id;
                    this.addApontamento(tipo, apontamento);
                    this.setState({
                        loading: false,
                        isApontando: true,
                        apontamentoAndamento: apontamento,
                        tipoApondamento: tipo,
                        idApontando: response.data[0].id,
                        tempoRodando: "00:00:00",
                    });
                    this.start();
                })
                .catch((err) => {
                    console.log(err);
                    Alert.alert("Erro ao cadastrar apontamento", "Error: " + err.message);
                });
        }
    };


    addApontamento = (tipo, apontamento) => {
        let newApont = [...this.state.apontamentos];
        newApont.unshift(
            {
                id: apontamento.id,
                tipo: tipo,
                dataInicio: apontamento.dataInicio,
                dataFim: apontamento.dataFim,
                tempo: "00:00:00",
                qtdeApontada: apontamento.qtdeApontada,
            }
        );

        this.setState({
            apontamentos: newApont,
        });
    };

    onPressBtn = (action) => {
        switch (action) {
            case "programar":
                this.btnAddApontamento("programar", this.state.idApontando);
                break;
            case "operar":
                this.btnAddApontamento("operar", this.state.idApontando);
                break;
            case "montar":
                this.btnAddApontamento("montar", this.state.idApontando);
                break;
            case "pausar":
                this.btnAddApontamento("pausar", this.state.idApontando);
                break;
            case "retrabalho":
                this.btnAddApontamento("retrabalho", this.state.idApontando);
                break;
            case "outro":
                this.btnAddApontamento("outro", this.state.idApontando);
                break;
            case "finalizar":
                this.btnFinalizar();
                break;
            case "sair":
                break;
        }
        // this.setState({ spinner: false });
    };

    onAddProduzido = async (valor) => {
        this.setState({ loading: true });
        let qtd = this.state.qtdeApontada;
        if (qtd + valor <= 0) {
            qtd = 0;
        } else {
            // console.log(valor);
            if (valor !== 0) {
                qtd = parseInt(valor) + parseInt(qtd);
            }
        }
        this.setState({ qtdeApontada: qtd.toString() });

        // console.log('idApontando',this.state.idApontando);
        // console.log('Quantiade: ',qtd);

        //Faz um patch, atualizando no banco de dados quanto foi apontando
        await api
            .patch(`/noteProd/${this.state.idApontando}`, { qtdeApontada: qtd })
            .then((response) => {
                let apontamentos = [...this.state.apontamentos];

                apontamentos.forEach((item) => {
                    if (item.id === response.data.id) {
                        item.qtdeApontada = response.data.qtdeApontada;
                        return;
                    }
                });
            })
            .catch((err) => {
                console.log(err);
                console.log(err.message);
                // Alert.alert(
                //   "Erro ao atualizar a quantidade apontada no banco.",
                //   "Error: " + err.message
                // );
            })
            .then(() => {
                this.setState({ loading: false });
            });
    };


    btnFinalizar = () => {
        alert(
            "Finailizar ordem de produção",
            "Tem certeza que deseja finalizar essa Ordem?",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Sim",
                    onPress: async () => {
                        this.setState({ spinner: true });
                        await api
                            .post(
                                `/orderProdMaquina/finalizar/${this.state.orderProdMaqId}`,
                                {}
                            )
                            .then((response) => {
                                this.props.navigation.navigate("Home");
                            })
                            .catch((err) => {
                                console.log(err);
                                Alert.alert(
                                    "Erro ao finalziar a Ordem",
                                    "Error: " + err.message
                                );
                            });
                    },
                },
            ],
            { cancelable: false }
        );
    };


    showConfirm = () => {
        let flagThis = this
        confirm({
            title: 'Finalizar ordem de produção',
            content: 'Tem certeza que deseja finalizar essa Ordem?',
            async onOk() {
                flagThis.setState({ loadingTipAll: true });
                await api
                    .post(
                        `/orderProdMaquina/finalizar/${flagThis.props.orderProdSelect.id}`,
                        {}
                    )
                    .then((response) => {
                        flagThis.setState({
                            loadingTipAll: false,
                        })

                        flagThis.props.backToFirstPage()
                    })
                    .catch((err) => {
                        console.log(err);
                        Alert.alert(
                            "Erro ao finalziar a Ordem",
                            "Error: " + err.message
                        );
                    });
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }

    render() {
        const { orderProdSelect } = this.props
        const { isApontando, tempoRodando } = this.state;

        console.log(orderProdSelect);
        return (
            <Spin spinning={this.state.lodingAll} >
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
                                        <Row>
                                            <Col span={12}>
                                                <Header style={{ position: 'fixed', zIndex: 1 }}>
                                                    <Row >
                                                        <Col span={24} >
                                                            <Alert message={`Tempo Decorrido: ${tempoRodando}`} type="error" />
                                                        </Col>
                                                    </Row>
                                                </Header>
                                            </Col>
                                        </Row>
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
                                                                value={orderProdSelect.maquina ? orderProdSelect.maquina : orderProdSelect.montagem}
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
                                                                value={this.state.qtdeApontada}
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
                                                        <Button
                                                            type="primary"
                                                            block
                                                            onClick={() => this.onAddProduzido(1)}
                                                            disabled={!this.state.isApontando}
                                                        >
                                                            +1
                                                        </Button>
                                                    </div>
                                                </Col>

                                                <Col lg={6} md={6} sm={12} xs={24}>
                                                    <div className="gx-form-row0">
                                                        <Button
                                                            type="primary"
                                                            block
                                                            onClick={() => this.onAddProduzido(-1)}
                                                            disabled={!this.state.isApontando}
                                                        >
                                                            -1
                                                        </Button>
                                                    </div>
                                                </Col>

                                                <Col lg={6} md={6} sm={12} xs={24}>
                                                    <div className="gx-form-row0">
                                                        <Button
                                                            type="primary"
                                                            block
                                                            onClick={() => this.onAddProduzido(+10)}
                                                            disabled={!this.state.isApontando}
                                                        >
                                                            +10
                                                        </Button>
                                                    </div>
                                                </Col>

                                                <Col lg={6} md={6} sm={12} xs={24}>
                                                    <div className="gx-form-row0">
                                                        <Button
                                                            type="primary"
                                                            block
                                                            onClick={() => this.onAddProduzido(-10)}
                                                            disabled={!this.state.isApontando}
                                                        >
                                                            -10
                                                        </Button>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </Card>
                                    </Col>
                                </Row>

                                {
                                    this.state.tipoApondamento === "retrabalho" || this.state.tipoApondamento === "outro" ?
                                        <Row gutter={[14, 10]}>
                                            <Col span={24}>
                                                <Card type="inner" title="Motivos de Retrabalho / Outros">
                                                    <Row>
                                                        <Col lg={6} md={6} sm={12} xs={24}>
                                                            <div className="gx-form-row0">
                                                                <Input
                                                                    placeholder='Motivo'
                                                                    value={this.state.motivoText}
                                                                    onChange={this.onChangeMotivo}
                                                                />
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                </Card>
                                            </Col>
                                        </Row>
                                        :

                                        ""
                                }



                                <Row gutter={[10, 10]}>

                                    <Col
                                        xxl={18}
                                        xl={18}
                                        lg={18}
                                        md={18}
                                        sm={18}
                                        xs={24}>
                                        <Spin spinning={this.state.loading} tip={this.state.loadingTip}>


                                            <Card type="inner" title="Apontamentos">
                                                <Table
                                                    columns={this.columnsApt}
                                                    dataSource={this.state.apontamentos.sort((a, b) => b.id - a.id)}
                                                ></Table>
                                            </Card>
                                        </Spin>
                                    </Col>

                                    <Col
                                        xxl={6}
                                        xl={6}
                                        lg={6}
                                        md={6}
                                        sm={6}
                                        xs={24}>
                                        <Card type="inner" title="Comandos">
                                            <Row>
                                                <Col span={24}>
                                                    <Button
                                                        type={this.state.tipoApondamento === 'programar' && this.state.isApontando ? "danger" : "primary"}
                                                        block
                                                        className="gx-btn-dark"
                                                        disabled={this.state.isApontando === true && this.state.tipoApondamento !== "programar" ? true : false}
                                                        onClick={() => this.onPressBtn("programar", true)}
                                                    >
                                                        {this.state.tipoApondamento === 'programar' && this.state.isApontando ? "Parar" : "Programar"}
                                                    </Button>
                                                </Col>
                                            </Row>

                                            <Row>
                                                <Col span={24}>
                                                    <Button
                                                        type={this.state.tipoApondamento === 'operar' && this.state.isApontando ? "danger" : "primary"}
                                                        block
                                                        className="gx-btn-dark"
                                                        disabled={this.state.isApontando === true && this.state.tipoApondamento !== "operar" ? true : false}
                                                        onClick={() => this.onPressBtn("operar", true)}
                                                    >
                                                        {this.state.tipoApondamento === 'operar' && this.state.isApontando ? "Parar" : "Operar"}
                                                    </Button>
                                                </Col>
                                            </Row>

                                            <Row>
                                                <Col span={24}>
                                                    <Button
                                                        type={this.state.tipoApondamento === 'pausar' && this.state.isApontando ? "danger" : "primary"}
                                                        block
                                                        className="gx-btn-dark"
                                                        disabled={this.state.isApontando === true && this.state.tipoApondamento !== "pausar" ? true : false}
                                                        onClick={() => this.onPressBtn("pausar", true)}
                                                    >
                                                        {this.state.tipoApondamento === 'pausar' && this.state.isApontando ? "Parar" : "Pausar"}
                                                    </Button>
                                                </Col>
                                            </Row>

                                            <Row>
                                                <Col span={24}>
                                                    <Button
                                                        type={this.state.tipoApondamento === 'retrabalho' && this.state.isApontando ? "danger" : "primary"}
                                                        block
                                                        className="gx-btn-purple"
                                                        disabled={this.state.isApontando === true && this.state.tipoApondamento !== "retrabalho" ? true : false}
                                                        onClick={() => this.onPressBtn("retrabalho", true)}
                                                    >
                                                        {this.state.tipoApondamento === 'retrabalho' && this.state.isApontando ? "Parar" : "Retrabalho"}
                                                    </Button>
                                                </Col>
                                            </Row>

                                            <Row>
                                                <Col span={24}>
                                                    <Button
                                                        type={this.state.tipoApondamento === 'outro' && this.state.isApontando ? "danger" : "primary"}
                                                        block
                                                        className="gx-btn-purple"
                                                        disabled={this.state.isApontando === true && this.state.tipoApondamento !== "outro" ? true : false}
                                                        onClick={() => this.onPressBtn("outro", true)}
                                                    >
                                                        {this.state.tipoApondamento === 'outro' && this.state.isApontando ? "Parar" : "Outros"}
                                                    </Button>
                                                </Col>
                                            </Row>

                                            <Row>
                                                <Col span={24}>
                                                    <Button
                                                        type="primary"
                                                        block
                                                        className="gx-btn-secondary"
                                                        disabled={this.state.isApontando === true && this.state.tipoApondamento !== "finalizar" ? true : false}
                                                        onClick={() => this.showConfirm()}
                                                    >
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