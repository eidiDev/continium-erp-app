import React, { Component } from 'react';
import {Row, Col, Card, Spin, Button, message} from 'antd';
import ImportOrdersFoxForm from './ImportOrdersFoxForm';
import ImportOrdersFoxResults from './ImportOrdersFoxResults';
import api from 'util/Api';
import apiAdonis from 'util/ApiAdonis'
import Log from './Log';

api.defaults.timeout = 60000000;

class ImportOrdersFox extends Component {
    constructor() {
        super();
        this.state = {
            loading:false,
            loadingTip: '',
            canGenerate: false,
            resultsLoading: false,
            showLog: false,
            resultData: [],
            array: [],
            array2:[],
            selectedRowKeys: [],
            selectedRows: [],
            filtros: {
                pedido: '',
                pedidoCliente: '',
                cfop:'',
                produto: '',
                empresa: '',
                dataInicio: '',
                dataFim: '',
                dataInicioM: '',
                dataFimM: ''
            },
            logs: []
        };

        //this.setState({logs: this.state.logs.push('Criado produto 1', 'criado produto 2', 'criado produto 3')}); 
        
        // console.log('Import Ordens Fox....');
    }

    handleChange = name => value => {
        let filtros = this.state.filtros;

        if(typeof(value) === "object") {
            if(name === 'dataInicio' || name === 'dataFim') {
                if(value){
                    filtros[name] = value.format('YYYY-MM-DD');
                }
            }else {
                filtros[name] = value.target.value;
            }
        }else {
            filtros[name] = value;
        }

        this.setState({filtros});
    }

    
    handleChange2 = name => value => {
        let filtros = this.state.filtros;

        if(typeof(value) === "object") {
            if(name === 'dataInicioM' || name === 'dataFimM') {
                if(value){
                    filtros[name] = value.format('YYYY-MM-DD');
                }
            }else {
                filtros[name] = value.target.value;
            }
        }else {
            filtros[name] = value;
        }

        this.setState({filtros});
    }

    onChangePage = (page, pageSize) => {
        console.log(page, pageSize);
    }

    onHandleClickSearch = () => {
        this.setState({resultsLoading: true});
        let parent = this;

        this.setState({resultData: [], selectedRowKeys: []});

        // console.log(this.state.filtros);
        
        apiAdonis.get(`filterLinPdVenda/`, {
            params: this.state.filtros
        })
        .then( (result) => {
            console.log(result);
            parent.setState({
                resultData: result.data
            });
        
            // for (const iterator of result.data) {
            //     const req = await api({
            //         method: "GET",
            //         url: `Fox/checkClient`,
            //         params: iterator.Empresa
            //     });
        
            //     if(req){
            //         if(req.data === "pendente"){
            //             iterator.isClienteOk = "pendente"
            //         }else{
            //             iterator.isClienteOk = req.data.name
            //         }
            //     }
            // }
            message.success('Registros carregados.');
        },)
        .catch(function(error) {
            message.error('Erro ao buscar registro, tente novamente mais tarde!:'+error.message);
            console.log('error', error)
        })
        .then(function () {
            // always executed
            parent.setState({resultsLoading: false});
        });
    }
        
    onSelectChange = (selectedRowKeys,selectedRows) => {
        // console.log('selectedRowKeys');
        // console.log(selectedRowKeys, selectedRows);
        
        this.setState({selectedRowKeys: selectedRowKeys.slice(0,5), selectedRows: selectedRows.slice(0,5)});

        this.checkIfAllstatusIsOk(selectedRows);
    }

    /**
    * Função que é usava para quando usuario apertar ENTER no teclado ele realizar a pesquisar
    **/
    onKeyDown =(e) =>{
        if (e.key === 'Enter') {
            this.onHandleClickSearch();
        }
    }

    onCreateBasicData = async  () => {
        this.setState({resultsLoading: true});
        let selectRows = this.state.selectedRows;
        let parent = this;
        let METHOD = "POST";

        await apiAdonis({
            method: METHOD,
            url: `validateProductLinPdVenda`,
            data: {
                rows: selectRows
            }
        }).then(function(result){

            console.log(result);
            parent.setState({
                resultData: [],
                showLog: true,
                logs: result.data,
                resultsLoading: false
            });

            message.success('Registros Criados Ou Alterados.');
        })
        .catch(function(error) {
            message.error('Erro interno, tente novamente mais tarde!:'+error.message);
            console.log('error', error)
        })
        .then(function(e) {
            // always executed
            parent.setState({resultsLoading: false});
        });

        // if(req){
            
        // }else{
        //     message.error("ERRO");
        // }
    }

    onCreateOrders = async () => {

        console.log('onCreateOrders....');

        this.setState({resultsLoading: true});
        let selectRows = this.state.selectedRows;
        let parent = this;
        
        let METHOD = "POST";

        try {
            await apiAdonis({
                method: METHOD,
                //url: `Fox/createOrders`,
                url: `oncreateOrders`,
                data: {
                    rows: selectRows
                }
            }).then(function(result){
    
                parent.setState({
                    resultData: [],
                    showLog: true,
                    logs: result.data !== undefined ? result.data : [],
                    array:[]
                })
    
                if(result.data.find(spe => spe.includes('não tem'))){
                    message.error('Kits filhos nao tem Etapas !');
                }else{
                    message.success('Ordens criadas !');
                }
            }).catch(function(error) {
                message.error('Erro interno, tente novamente mais tarde!:'+error.message);
                console.log('error', error)
            })
            .then(function(e) {
                // always executed
                parent.setState({resultsLoading: false});
            });
            
        } catch (error) {
            message.error('Erro interno, tente novamente mais tarde!:'+error.message);
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

    checkIfAllstatusIsOk = (selectedRows) => {
        let listaDeSelects = selectedRows;

        if(listaDeSelects.length === 0){
            this.setState({
                array: []
            })
        }else{
            let array = [];
            for (const iterator of listaDeSelects) {
                if(iterator.isProdutoOk === 1 && 
                   iterator.isKitOk === 1 && 
                   iterator.isClienteOk === 1 && 
                   iterator.isEtapaOk === 1 && 
                   iterator.isOrdemOk === 0 &&
                   iterator.isDadosBaseOk === 1){
                    array.push(iterator);
                    this.setState({
                        array: array
                    });
                }
            }
            if(array.length === listaDeSelects.length){

            }else{
                this.setState({
                    array: []
                })
            }


        }
    }

    render() {
        return(
            <Spin spinning={this.state.loading} tip={this.state.loadingTip}>
            <Log 
                showLog={this.state.showLog}
                onOkLog={this.onOkLog}
                logs={this.state.logs}
            />
            <Row>
                <Col lg={20} md={20} sm={24} xs={24}>
                    <ImportOrdersFoxForm 
                        handleChange={this.handleChange}
                        handleChange2={this.handleChange2}
                        filtros={this.state.filtros} 
                        onKeyDown={this.onKeyDown}
                    />
                    <ImportOrdersFoxResults 
                        resultData={this.state.resultData} 
                        loading={this.state.resultsLoading}
                        selectedRowKeys={this.state.selectedRowKeys}
                        onSelectChange={this.onSelectChange}
                        onChangePage={this.onChangePage}
                        />
                </Col>

                <Col lg={4} md={4} sm={24} xs={24}>
                    <Card type="inner" title="Açoes">
                    <Button 
                                block
                                type="primary"
                                // disabled={!this.state.canNew}
                                onClick={this.onHandleClickSearch}
                            >
                                Pesquisar
                            </Button>
                            <Button 
                                block
                                type="primary"
                                className="gx-btn-secondary"
                                disabled={!this.state.selectedRows.length > 0}
                                onClick={this.onCreateBasicData}
                            >
                                Validar
                            </Button>

                            {/* <Button 
                                block
                                type="primary"
                                className="gx-btn-red"
                                disabled={this.state.array.length === 0  ? true: false}
                                onClick={this.onCreateOrders}
                            >
                                Gerar OP
                            </Button> */}

                    </Card>
                </Col>
            </Row>
            </Spin>
        )
    }
}

export default ImportOrdersFox;