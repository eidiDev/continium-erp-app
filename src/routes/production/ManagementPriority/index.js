import React, { Component } from 'react';
import { Row, Col, Card, Spin, Button, message } from 'antd';
import ImportOrdersFoxForm from './ImportOrdersFoxForm';
import ImportOrdersFoxResults from './ImportOrdersFoxResults';
import api from 'util/ApiAdonis';
import apiAdonis from 'util/ApiAdonis'
import Log from './Log';
import update from 'immutability-helper';

api.defaults.timeout = 60000000;

class ImportOrdersFox extends Component {
    constructor() {
        super();
        this.state = {
            loading: false,
            loadingTip: '',
            canGenerate: false,
            resultsLoading: false,
            showLog: false,
            resultData: [],
            array: [],
            array2: [],
            selectedRowKeys: [],
            selectedRows: [],
            filtros: {
                pedido: '',
                pedidoCliente: '',
                cfop: '',
                produto: '',
                empresa: '',
                dataInicio: '',
                dataFim: '',
                dataInicioM: '',
                dataFimM: ''
            },
            logs: [],
            listOfMaquinas: [],
            idMaquina: ''
        };

        //this.setState({logs: this.state.logs.push('Criado produto 1', 'criado produto 2', 'criado produto 3')}); 

        // console.log('Import Ordens Fox....');
    }

    componentWillMount() {
        this.getMaquinas();
    }

    getMaquinas = () => {
        api
            .get(`MachineLabor/`, {})
            .then((result) => {
                let dataMaq = [];
                dataMaq = result.data.data;

                let taxMaquinas = dataMaq.filter((o) => {
                    return o.type === 'maquina' || o.type === 'montagem';
                });
                this.setState({
                    listOfMaquinas: taxMaquinas,
                });
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    handleChange = name => value => {
        let filtros = this.state.filtros;

        if (typeof (value) === "object") {
            if (name === 'dataInicio' || name === 'dataFim') {
                if (value) {
                    filtros[name] = value.format('YYYY-MM-DD');
                }
            } else {
                filtros[name] = value.target.value;
            }
        } else {
            filtros[name] = value;
        }

        this.setState({ filtros });
    }

    onChangePage = (page, pageSize) => {
        console.log(page, pageSize);
    }

    onHandleClickSearch = () => {
        this.setState({ resultsLoading: true });
        let parent = this;

        this.setState({ resultData: [], selectedRowKeys: [] });

        // console.log(this.state.filtros);

        apiAdonis.get(`filterPdfVenda/`, {
            params: this.state.filtros
        })
            .then((result) => {

                parent.setState({
                    resultData: result.data
                });
                message.success('Registros carregados.');
            })
            .catch(function (error) {
                message.error('Erro ao buscar registro, tente novamente mais tarde!:' + error.message);
                console.log('error', error)
            })
            .then(function () {
                // always executed
                parent.setState({ resultsLoading: false });
            });
    }

    onSelectChange = (selectedRowKeys, selectedRows) => {
        // console.log('selectedRowKeys');
        // console.log(selectedRowKeys, selectedRows);

        this.setState({ selectedRowKeys: selectedRowKeys, selectedRows: selectedRows });

    }

    /**
    * Função que é usava para quando usuario apertar ENTER no teclado ele realizar a pesquisar
    **/
    onKeyDown = (e) => {
        if (e.key === 'Enter') {
            this.onHandleClickSearch();
        }
    }

    onCreateBasicData = async () => {
        this.setState({ resultsLoading: true });
        let selectRows = this.state.selectedRows;
        let parent = this;
        let METHOD = "POST";


        console.log(selectRows);
        await apiAdonis({
            method: METHOD,
            url: `foxControllerPd/onCreateBasicData`,
            data: {
                rows: selectRows
            }
        }).then(function (result) {
            parent.setState({
                resultData: [],
                showLog: true,
                logs: result.data,
                resultsLoading: false
            });

            message.success('Registros Criados Ou Alterados.');
        })
            .catch(function (error) {
                message.error('Erro interno, tente novamente mais tarde!:' + error.message);
                console.log('error', error)
            })
            .then(function (e) {
                // always executed
                parent.setState({ resultsLoading: false });
            });

        // if(req){

        // }else{
        //     message.error("ERRO");
        // }
    }

    onCreateOrders = async () => {

        console.log('onCreateOrders....');

        this.setState({ resultsLoading: true });
        let selectRows = this.state.selectedRows;
        let parent = this;

        let METHOD = "POST";

        try {
            await apiAdonis({
                method: METHOD,
                //url: `Fox/createOrders`,
                url: `foxControllerPd/onCreateOrders`,
                data: {
                    rows: selectRows
                }
            }).then(function (result) {

                parent.setState({
                    resultData: [],
                    showLog: true,
                    logs: result.data !== undefined ? result.data : [],
                    array: []
                })

                if (result.data.find(spe => spe.includes('não tem'))) {
                    message.error('Kits filhos nao tem Etapas !');
                } else {
                    message.success('Ordens criadas !');
                }
            }).catch(function (error) {
                message.error('Erro interno, tente novamente mais tarde!:' + error.message);
                console.log('error', error)
            })
                .then(function (e) {
                    // always executed
                    parent.setState({ resultsLoading: false });
                });

        } catch (error) {
            message.error('Erro interno, tente novamente mais tarde!:' + error.message);
            console.log('error', error)
        }
    }

    onChangeStatus = async (type) => {
        console.log('onCreateOrders....');

        this.setState({ resultsLoading: true });
        let selectRows = this.state.selectedRows;
        let parent = this;
        let idMaquina = this.state.idMaquina;

        let METHOD = "POST";

        try {
            await apiAdonis({
                method: METHOD,
                //url: `Fox/createOrders`,
                url: `changeStatusMaq`,
                data: {
                    type,
                    rows: selectRows
                }
            }).then(function (result) {

                parent.getDataFromServer(idMaquina)
                parent.setState({
                    resultsLoading: false,
                })

                message.success('Etapas atualizadas !');

            }).catch(function (error) {
                message.error('Erro interno, tente novamente mais tarde!:' + error.message);
                console.log('error', error)
            })
                .then(function (e) {
                    // always executed
                    parent.setState({ resultsLoading: false });
                });

        } catch (error) {
            message.error('Erro interno, tente novamente mais tarde!:' + error.message);
            console.log('error', error)
        }
    }

    /**
     * Para fechar o modal do log
     */
    onOkLog = () => {
        this.setState({
            showLog: false,
        });
    }

    mudarPrioridade = async () => {
        console.log('onCreateOrders....');

        this.setState({ resultsLoading: true });
        let selectRows = this.state.selectedRows;
        let parent = this;
        let idMaquina = this.state.idMaquina;

        let METHOD = "POST";

        try {
            await apiAdonis({
                method: METHOD,
                //url: `Fox/createOrders`,
                url: `changePriorMaq`,
                data: {
                    idMaquina,
                    rows: selectRows
                }
            }).then(function (result) {

                parent.getDataFromServer(idMaquina)
                parent.setState({
                    resultsLoading: false,
                })

                message.success('Etapas atualizadas !');

            }).catch(function (error) {
                message.error('Erro interno, tente novamente mais tarde!:' + error.message);
                console.log('error', error)
            })
                .then(function (e) {
                    // always executed
                    parent.setState({ resultsLoading: false });
                });

        } catch (error) {
            message.error('Erro interno, tente novamente mais tarde!:' + error.message);
            console.log('error', error)
        }
    }



    checkIfAllstatusIsOk = (selectedRows) => {
        let listaDeSelects = selectedRows;

        if (listaDeSelects.length === 0) {
            this.setState({
                array: []
            })
        } else {
            let array = [];
            for (const iterator of listaDeSelects) {
                const find = iterator.linhas.find(el => el.isDadosBaseOk === 0);

                if (find === undefined) {
                    array.push(iterator);
                    this.setState({
                        array: array
                    });
                }

            }
            if (array.length === listaDeSelects.length) {

            } else {
                this.setState({
                    array: []
                })
            }


        }
    }

    handleMaquina = (selected) => {
        this.setState({ idMaquina: selected });
        this.getDataFromServer(selected)
    };

    getDataFromServer = async (idMaquina, offset) => {
        let dataToReturn = {};
        this.setState({ resultsLoading: true });
        const params = {
            offset
        }
        await api
            .get(`/prioridade?idMaquina=${idMaquina}`, { params })
            .then((result) => {
                dataToReturn = result.data;
                this.setState({
                    resultData: dataToReturn,
                    resultsLoading: false
                })
            })
            .then((response) => {
                // this.setState({ loading: false });
            })
            .catch(function (error) {
                console.log(error);
            });
        return dataToReturn;
    };

    setStateDrag = async (newData) => {
        const { idMaquina} = this.state;
        this.setState({ resultsLoading: true });
        let listUpdate = [];
        let index = 0;
        newData.forEach((lane) => {
            index += 1;
            const opmUpdate = {
              id: lane.id,
              statusEtapa: lane.statusEtapa,
              maquina: lane.maquina === null || lane.maquina === undefined ? lane.montagem : lane.maquina,
              index,
            };
            listUpdate.push(opmUpdate);
        });
    
        //Agora via enviar e atualizar no banco
        // console.log(listUpdate);
        await api
          .patch('/prioridade', { listUpdate, idMaquina })
          .then((result) => {
            // console.log(result.data);
            // const dataFromServer = this.getDataFromServer(idMaquina);
            this.setState({ resultData: result.data,
                resultsLoading:false
            });
          })
          .then((result) => {
            this.setState({ loading: false, resultsLoading:false });
          })
          .catch(function (error) {
            console.log(error);
          });
    }
    render() {
        return (
            <Spin spinning={this.state.loading} tip={this.state.loadingTip}>
                <Log
                    showLog={this.state.showLog}
                    onOkLog={this.onOkLog}
                    logs={this.state.logs}
                />
                <Row>
                    <Col lg={20} md={20} sm={24} xs={24}>
                        <ImportOrdersFoxForm
                            handleMaquina={this.handleMaquina}
                            listOfMaquinas={this.state.listOfMaquinas}
                            handleChange={this.handleChange}
                            moveRow={this.moveRow}
                            filtros={this.state.filtros}
                            onKeyDown={this.onKeyDown}
                        />
                        <ImportOrdersFoxResults
                            resultData={this.state.resultData}
                            loading={this.state.resultsLoading}
                            selectedRowKeys={this.state.selectedRowKeys}
                            onSelectChange={this.onSelectChange}
                            onChangePage={this.onChangePage}
                            setStateDrag={this.setStateDrag}
                        />
                    </Col>

                    <Col lg={4} md={4} sm={24} xs={24}>
                        <Card type="inner" title="Açoes">
                            <Button
                                block
                                type="primary"
                                className="gx-btn-purple"
                                disabled={!this.state.selectedRows.length > 0}
                                onClick={() => this.onChangeStatus('planejada')}
                            >
                                Planejada
                            </Button>

                            <Button
                                block
                                type="primary"
                                lassName="gx-btn-blue"
                                disabled={!this.state.selectedRows.length > 0}
                                onClick={() => this.onChangeStatus('liberada')}
                            >
                                Liberada
                            </Button>

                            <Button
                                block
                                type="primary"
                                className="gx-btn-orange"
                                disabled={!this.state.selectedRows.length > 0}
                                onClick={() => this.onChangeStatus('execucao')}
                            >
                                Em Execução
                            </Button>

                            <Button
                                block
                                type="primary"
                                className="gx-btn-red"
                                disabled={!this.state.selectedRows.length > 0}
                                onClick={() => this.onChangeStatus('pausada')}
                            >
                                Pausada
                            </Button>

                            <Button
                                block
                                type="primary"
                                className="gx-btn-secondary"
                                disabled={!this.state.selectedRows.length > 0}
                                onClick={() => this.onChangeStatus('finalizada')}
                            >
                                Finalizada
                            </Button>

                            <Button
                                block
                                type="primary"
                                className="gx-btn-dark"
                                disabled={!this.state.selectedRows.length > 0}
                                onClick={() => this.mudarPrioridade()}
                            >
                                Mudar Prioridade
                            </Button>
                        </Card>
                    </Col>
                </Row>
            </Spin>
        )
    }
}

export default ImportOrdersFox;