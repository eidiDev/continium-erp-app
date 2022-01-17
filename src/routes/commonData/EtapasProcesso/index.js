import React, {Component} from 'react'
import {Row, Col, Card, Form, Input, Button, message, Spin, Modal, Select, Checkbox } from 'antd'
import history from '../../../util/history';
import SimpleReactValidator from 'simple-react-validator';
import ListStep from './ListStep'
import api from '../../../util/Api'
//import { string } from 'prop-types';

const model = 'stepprocess';
const model3 = 'Machinelabor';
const model2 = 'establishment'
const { Option } = Select;


class EstapasProcesso extends Component {

    constructor() {
        super()
        this.state = {            
            isNew: true,
            loader: true,
			Step: {
                status: false,
                establishments: 1,
                generaldata: {
                    codMaquina: '',
                    descMaquina: '',
                    tempXqtdMaquina: 0,

                    codProgramador:'',
                    descProgramador:'',
                    tempoProgramador:0,

                    codOperador:'',
                    descOperador:'',
                    tempoOperador:0,

                    codMontagem:'',
                    descMontagem:'',
                    tempoMontagem:0
                }
            },
			canNew: true,
			canSave: true,
            canDelete: false,
            loading: false,
            listofEstabs: [],
            listofProg: [],
            listofOperador: [],
            listofMaquinas:[],
            listofMontagens:[]
        }
        this.handleChange = this.handleChange.bind(this);
        // this.handleChangeGeneral =  this.handleChangeGeneral.bind(this);
        this.handleEstab =  this.handleEstab.bind(this);

        this.setStateNew = this.setStateNew.bind(this);
        this.onHandleClickSave = this.onHandleClickSave.bind(this);
        
        this.onHandleClickDelete = this.onHandleClickDelete.bind(this);
        this.onHandleClickNew = this.onHandleClickNew.bind(this);
        // this.handleSubmit = this.handleSubmit.bind(this);
        this.validator = new SimpleReactValidator({locale: 'pt', messages:{default: `:attribute não pode estar vazio`}});

        this.leftListChild = React.createRef()
    }
    
    onHandleClickNew = () => {
        this.setStateNew()
    }

    componentWillMount(){
        this.getEstabs();
        this.getMachineLabors();
    }

    getEstabs(){
        api.get(`${model2}`, {
        })
        .then((result) => {
            let dataEstab = [];
            dataEstab = result.data;
            
            this.setState({
                listofEstabs: dataEstab
            });
            //Caso consiga recuperar o model, ele atualiza a tela e para de carregar
            // console.log(result.data.adresses);
            // console.log(result.adresses);
            // message.success('Cliente carregado com sucesso!');
            // parent.setStateEdit(result.data)
        },)
        .catch(function(error) { 
            console.log(error);
            // message.error('Erro ao buscar registro, tente novamente mais tarde!');
            // parent.setStateNew()
        })
    }

    getMachineLabors = () => {
        api.get(`${model3}/?limit=999`, {
        })
        .then((result) => {
            let dataMachine = [];
            let dataMaquinas = [];
            let dataOperadores = [];
            let dataProgramadores = [];
            let dataMontagens = []
            dataMachine = result.data;

            dataMachine.forEach(element => {
                if(element.type === "maquina"){
                    dataMaquinas.push(element);
                }
                if(element.programador === true){
                    dataProgramadores.push(element);
                }
                if(element.operador === true){
                    dataOperadores.push(element);
                }

                if(element.type === "montagem"){
                    dataMontagens.push(element);
                }
            });
            
            this.setState({
                listofProg: dataProgramadores,
                listofMaquinas: dataMaquinas,
                listofOperador: dataOperadores,
                listofMontagens: dataMontagens
            });
            //Caso consiga recuperar o model, ele atualiza a tela e para de carregar
            // console.log(result.data.adresses);
            // console.log(result.adresses);
            // message.success('Cliente carregado com sucesso!');
            // parent.setStateEdit(result.data)
        },)
        .catch(function(error) { 
            console.log(error);
            // message.error('Erro ao buscar registro, tente novamente mais tarde!');
            // parent.setStateNew()
        })
    }

    handleOnClickRow1 = (record, rowIndex) => {
        var parent = this
        //Primeria coisa ele seta loading para true
        this.setState({
            loading:true,
            loadingTip: 'Carregando registro, aguarde...'
        })

        //Coloquei esse timeout de 1 segundo para simular o carregamento
        setTimeout(function(){
            //Agora ele vai buscar o registro no servidor
            api.get(`${model}/${record.id}`, {
                })
                .then((result) => {
                    //Caso consiga recuperar o model, ele atualiza a tela e para de carregar
                    console.log(result.data.adresses);
                    // console.log(result.adresses);
                    message.success('Etapa carregada com sucesso!');
                    parent.setStateEdit(result.data)
                },)
                .catch(function(error) { 
                    console.log(error);
                    message.error('Erro ao buscar registro, tente novamente mais tarde!');
                    parent.setStateNew()
                })
        }, 1000);
        
    }

    onHandleClickSave = () => {
        // console.log(this.state.model);
        if(this.validator.allValid()) {
            let record = this.state.Step;
            var parent = this;
            
            console.log(record);
            let general =  record.generaldata;

            general.tempXqtdMaquina === "" && (general.tempXqtdMaquina = 0);
            general.tempoMontagem === ""  && (general.tempoMontagem = 0);
            general.tempoOperador === "" && (general.tempoOperador = 0);
            general.tempoProgramador === "" && (general.tempoProgramador = 0);  

            console.log(record);
            this.setState({
                loading:true,
                loadingTip: 'Salvando registro, aguarde...',
            })
            // console.log('vai tentar gravar',record)
            setTimeout(function(){
                //Verifica se é uma atualizacao (PUT) ou novo registro (POST)
                let METHOD = 'PATCH'
                let URL = `${model}/${record.id}`
                
                if(parent.state.isNew){
                    METHOD = 'POST'
                    URL = `${model}`
                    // record = Object.assign({},record)
                }
                console.log('onHandleSaveButton', record);
                const {cod, description, establishments, generaldata, status} = record;
        
                api(
                    {
                    method: METHOD,
                    url: URL,
                    data:
                    {
                        cod: cod,
                        status: status,
                        description: description,
                        establishments: establishments,
                        generaldata: generaldata
                    } 
                }).then((result) => {
                    //Caso consiga recuperar o model, ele atualiza a tela e para de carregar
                    message.success('Etapa salvo com sucesso!');
                    if(result.config.method === "post"){
                        let id = result.data.establishments;
                        result.data.establishments = {
                            id: id
                        }
                    }
                    parent.setStateEdit(result.data)
                    parent.leftListChild.current.fetchLeftList()
                },)
                .catch(function(error) { 
                    console.log(error);
                    parent.setStateEdit(record)
                    message.error('Erro ao gravar registro, tente novamente mais tarde!');
                })
            }, 1000);

        }else {
            message.warning('Campos obrigatórios em branco!');
            this.validator.showMessages();
            this.forceUpdate();
        }
    }

    onCancel = () => {
        history.replace('/dashboard');
        document.location.reload(true);
    }
    
    onHandleClickDelete = () => {
        // console.log(this.state.model);
        let record = this.state.Step
        var parent = this

        Modal.confirm({
            title: 'Tem certeza que deseja excluir esse registro?',
            onOk() {
                parent.setState({
                    loading:true,
                    loadingTip: 'Excluindo registro, aguarde...',
                })
                setTimeout(function(){
                    //Agora ele vai buscar o registro no servidor
                    let METHOD = 'DELETE'
                    let URL = `${model}/${record.id}`
                    api({
                        method: METHOD,
                        url: URL,
                    }).then((result) => {
                        //Caso consiga recuperar o model, ele atualiza a tela e para de carregar
                        message.success('Registro excluido com sucesso!');
                        parent.setStateNew()
                        parent.leftListChild.current.fetchLeftList()
                    },)
                    .catch(function(error) { 
                        console.log(error);
                        message.error('Erro ao excluir registro, tente novamente mais tarde!');
                    })
                }, 1000);
                parent.setStateNew()
            },
            onCancel() {
                //Nada acontece
            },
          });
    }

    setStateNew = () => {
        this.setState({ 
            canSave: true,
            canNew: true,
            canDelete: false,
            Step: {
                    status: false,
                    generaldata: {
                        codMaquina: '',
                        descMaquina: '',
                        tempXqtdMaquina: 0,
    
                        codProgramador:'',
                        descProgramador:'',
                        tempoProgramador:0,
    
                        codOperador:'',
                        descOperador:'',
                        tempoOperador:0,

                        codMontagem:'',
                        descMontagem:'',
                        tempoMontagem:0
                }
            },
            loading: false,
            isNew: true,
            refreshLeftList: false
        });
    }

    //Seta o estado para edição
    setStateEdit = (model) => {
        console.log(model);
        model.establishments = model.establishments.id;
        this.setState({ 
            canSave: true,
            canNew: true,
            canDelete: true,
            Step: model,
            loading: false,
            isNew: false
        });
    }


    handleChange(event) {
        let newStep = this.state.Step;
        newStep[event.target.name] = event.target.value;

        this.setState(() => ({
            Step: newStep
        }));
    }

    handleChangeGeneral = event => {
        let newStep = this.state.Step.generaldata;
        newStep[event.target.name] = event.target.value;

        

        this.setState(() => ({
            Step: {
                ...this.state.Step,
                generaldata: newStep
            }
        }))
    }

    LeftList = () => {
        // this.handleOnClickRow = (record, rowIndex) => {
        //     // alert('onclick row expert.js '+rowIndex)
        //     console.log(rowIndex, record)
        //     this.setState({
		// 		canSave: true,
		// 		canNew: true,
		// 		canDelete: true,
        //         categ: {
        //             cod: record.codigo,
        //             desc: record.descricao
        //         }
        //     });
        // }

        return (
            <ListStep onClickRow={this.handleOnClickRow1  }  ref={this.leftListChild} />
            // <ListUsers />
        )
    }

    handleEstab(event){
        let auxList = this.state.listofEstabs;
        let newStep = this.state.Step;
        
        auxList.map( obj => {
            if(obj.id === event){
                newStep["establishments"] = obj.id
                this.setState({
                    generaldata: newStep 
                })
            }

            return(
                ''
            )
        });
        console.log(event);
    }


    handleOperador = event => {
        let auxList = this.state.listofOperador;
        let newStep = this.state.Step.generaldata;
        
        console.log(event);
        auxList.map( obj => {
            if(obj.id === event){
                newStep["codOperador"] = obj.cod
                newStep["descOperador"] = obj.name
                newStep["tempoOperador"] = obj.ratetime

                console.log(newStep);
                this.setState({
                    ...this.state.Step,
                    generaldata: newStep 
                })
            }
            return(
                ''
            )
        });
    }

    handleProgramador = event => {
        let auxList = this.state.listofProg;
        let newStep = this.state.Step.generaldata;
        
        console.log(event);
        auxList.map( obj => {
            if(obj.id === event){
                newStep["codProgramador"] = obj.cod
                newStep["descProgramador"] = obj.name
                newStep["tempoProgramador"] = obj.ratetime

                console.log(newStep);
                this.setState({
                    ...this.state.Step,
                    generaldata: newStep 
                })
            }
            return(
                ''
            )
        });
    }


    handleMaquina = event => {
        let auxList = this.state.listofMaquinas;
        let newStep = this.state.Step.generaldata;
        
        console.log(event);
        auxList.map( obj => {
            if(obj.id === event){
                newStep["codMaquina"] = obj.cod
                newStep["descMaquina"] = obj.name
                newStep["tempXqtdMaquina"] = obj.ratetime

                console.log(newStep);
                this.setState({
                    ...this.state.Step,
                    generaldata: newStep 
                })
            }
            return(
                ''
            )
        });
    }

    handleMontagem = event => {
        let auxList = this.state.listofMontagens;
        let newStep = this.state.Step.generaldata;
        
        console.log(event);
        auxList.map( obj => {
            if(obj.id === event){
                newStep["codMontagem"] = obj.cod
                newStep["descMontagem"] = obj.name
                newStep["tempoMontagem"] = obj.ratetime

                console.log(newStep);
                this.setState({
                    ...this.state.Step,
                    generaldata: newStep 
                })
            }
            return(
                ''
            )
        });
    }


    onChangeCheck = event => {
        let newStep = this.state.Step;
        newStep["status"] = event.target.checked;
        this.setState({
            machine: newStep
        });

    }

    Content = (Step,estabs) => {

        let maquinas = this.state.listofMaquinas;
        let operadores = this.state.listofOperador;
        let programadores = this.state.listofProg;
        let montagens = this.state.listofMontagens;

        return (
            <div className="main">
                <Row>
                    <Col span={24}>
                        <Form layout="horizontal">
                            <Card type="inner" title="Cadastro de Etapas do Processo ">
                                <Row>
                                    <Col lg={6} md={6} sm={12} xs={24}>
                                        <div className="gx-form-row0">
                                            <Form.Item label="Código Etapa">
                                                <Input 
                                                    type="text" 
                                                    value={Step.cod} 
                                                    name="cod"
                                                    disabled={true}
                                                    onChange={this.handleChange}/>
                                            </Form.Item>
                                        </div>
                                    </Col>
                                    <Col lg={6} md={6} sm={12} xs={24}>
                                        <div className="gx-form-row0">
                                            <Form.Item label="Estabelecimento" required={true}>
                                                <Select
                                                showSearch 
                                                value={Step.establishments} 
                                                // style={{ width: 300 }} 
                                                onChange={this.handleEstab} 
                                                filterOption={(inputValue, option) =>
                                                    //console.log(inputValue,option)
                                                option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                                                }
                                                >
                                                    {
                                                        estabs.map( e => {
                                                            return (
                                                            <Option value={e.id}>{e.name}</Option>
                                                            ) 
                                                        })
                                                    }
                                                </Select>
                                                {this.validator.message('establishments', Step.establishments, 'required|alpha_num',{ className: 'text-danger' })}
                                            </Form.Item>
                                        </div>
                                    </Col>
                                    <Col lg={6} md={6} sm={12} xs={24}>
                                        <div className="gx-form-row0">
                                            <Form.Item label="Descrição">
                                                <Input 
                                                    type="text" 
                                                    value={Step.description} 
                                                    name="description"
                                                    onChange={this.handleChange}/>
                                            </Form.Item>
                                        </div>
                                    </Col>
                                    <Col lg={6} md={6} sm={12} xs={24}>
                                        <div className="gx-form-row0">
                                            <Form.Item label="Ativo">
                                                <Checkbox 
                                                    checked={this.state.Step.status} 
                                                    onChange={this.onChangeCheck}
                                                />
                                            </Form.Item>
                                        </div>
                                    </Col>
                                </Row>
                            </Card>
                            <Card type="inner" title="Dados Gerais">
                                <Row>
                                    <Col lg={6} md={6} sm={12} xs={24}> 
                                        <div className="gx-form-row0">
                                            <Form.Item  label="Cod Maquina">
                                                <Select
                                                showSearch 
                                                value={Step.generaldata.codMaquina === null ? "" : Step.generaldata.codMaquina } 
                                                onChange={this.handleMaquina} 
                                                // style={{ width: 250 }} 
                                                filterOption={(inputValue, option) =>
                                                    //console.log(inputValue,option)
                                                option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                                                }
                                                >
                                                    {
                                                        maquinas.map( m => {
                                                            return (
                                                            <Option value={m.id}>{m.cod}</Option>
                                                            ) 
                                                        })
                                                    }
                                                </Select>
                                            </Form.Item>
                                        </div>
                                    </Col>
                                    <Col lg={6} md={6} sm={12} xs={24}>
                                        <div className="gx-form-row0">
                                            <Form.Item  label="Descrição">
                                            <Input 
                                                type="text"
                                                // style={{width: 200}}
                                                disabled={true} 
                                                value={Step.generaldata.descMaquina} 
                                                name="descMaquina"
                                                onChange={this.handleChangeGeneral}/>
                                            </Form.Item>
                                        </div>
                                    </Col>
                                    <Col lg={6} md={6} sm={12} xs={24}>
                                        <div className="gx-form-row0">
                                            <Form.Item  label="Tempo (min) ">
                                            <Input 
                                                type="number" 
                                                value={Step.generaldata.tempXqtdMaquina}
                                                min={1} 
                                                name="tempXqtdMaquina"
                                                onChange={this.handleChangeGeneral}/>
                                            </Form.Item>
                                        </div>
                                    </Col>
                                </Row>
                            </Card>
                            <Card type="inner" title="Programador">
                                <Row>
                                    <Col lg={6} md={6} sm={12} xs={24}>
                                        <div className="gx-form-row0">
                                            <Form.Item   label="Cod Programador">
                                                <Select 
                                                    value={Step.generaldata.codProgramador === null ? "" : Step.generaldata.codProgramador } 
                                                    onChange={this.handleProgramador} 
                                                    // style={{ width: 250 }}  
                                                >
                                                    {
                                                        programadores.map( m => {
                                                            return (
                                                            <Option value={m.id}>{m.cod}</Option>
                                                            ) 
                                                        })
                                                    }
                                                </Select>
                                            </Form.Item>
                                        </div>
                                    </Col>
                                    <Col lg={6} md={6} sm={12} xs={24}>
                                        <div className="gx-form-row0">
                                            <Form.Item  label="Descrição">
                                                <Input 
                                                    type="text"
                                                    // style={{width: 200}}
                                                    disabled={true} 
                                                    value={Step.generaldata.descProgramador} 
                                                    name="descProgramador"
                                                    onChange={this.handleChangeGeneral}/>
                                            </Form.Item>
                                        </div>
                                    </Col>
                                    <Col lg={6} md={6} sm={12} xs={24}>
                                        <div className="gx-form-row0">
                                            <Form.Item label="Tempo (min)">
                                                <Input 
                                                    type="number" 
                                                    value={Step.generaldata.tempoProgramador} 
                                                    name="tempoProgramador"
                                                    min={1}
                                                    onChange={this.handleChangeGeneral}
                                                />
                                            </Form.Item>       
                                        </div>                                     
                                    </Col>      
                                </Row>
                            </Card>
                            <Card type="inner" title="Operador">
                                <Row>
                                    <Col lg={6} md={6} sm={12} xs={24}>
                                        <div className="gx-form-row0">
                                            <Form.Item   label="Cod operador">
                                                <Select 
                                                    value={Step.generaldata.codOperador === null ? "": Step.generaldata.codOperador} 
                                                    // style={{ width: 250 }} 
                                                    onChange={this.handleOperador} 
                                                    >
                                                    {
                                                        operadores.map( m => {
                                                            return (
                                                            <Option value={m.id}>{m.cod}</Option>
                                                            ) 
                                                        })
                                                    }
                                                </Select>
                                            </Form.Item>
                                        </div>
                                    </Col>
                                    <Col lg={6} md={6} sm={12} xs={24}>
                                        <div className="gx-form-row0">
                                            <Form.Item   label="Descrição">
                                                <Input 
                                                    type="text"
                                                    // style={{width: 200}}
                                                    disabled={true} 
                                                    value={Step.generaldata.descOperador} 
                                                    name="descOperador"
                                                    onChange={this.handleChangeGeneral}/>
                                            </Form.Item>
                                        </div>
                                    </Col>
                                    <Col lg={6} md={6} sm={12} xs={24}>
                                        <div className="gx-form-row0">
                                            <Form.Item   label="Tempo (min)">
                                                <Input 
                                                    type="number" 
                                                    value={Step.generaldata.tempoOperador} 
                                                    name="tempoOperador"
                                                    min={1}
                                                    onChange={this.handleChangeGeneral}/>
                                            </Form.Item>
                                        </div>
                                    </Col>
                                </Row>
                            </Card>
                            <Card type="inner" title="Montagem">
                                <Row>
                                    <Col lg={6} md={6} sm={12} xs={24}>
                                        <div className="gx-form-row0">
                                            <Form.Item   label="Cod montagem">
                                                <Select 
                                                    value={Step.generaldata.codMontagem === null ? "": Step.generaldata.codMontagem} 
                                                    // style={{ width: 250 }} 
                                                    onChange={this.handleMontagem} 
                                                >
                                                    {
                                                        montagens.map( m => {
                                                            return (
                                                            <Option value={m.id}>{m.cod}</Option>
                                                            ) 
                                                        })
                                                    }
                                                </Select>
                                            </Form.Item>
                                        </div>
                                    </Col>
                                    <Col lg={6} md={6} sm={12} xs={24}>
                                        <div className="gx-form-row0">
                                            <Form.Item   label="Descrição">
                                                <Input 
                                                    type="text"
                                                    // style={{width: 200}}
                                                    disabled={true} 
                                                    value={Step.generaldata.descMontagem} 
                                                    name="descMontagem"
                                                    onChange={this.handleChangeGeneral}/>
                                            </Form.Item>
                                        </div>
                                    </Col>
                                    <Col lg={6} md={6} sm={12} xs={24}>
                                        <div className="gx-form-row0">
                                            <Form.Item   label="Tempo (min)">
                                                <Input 
                                                    type="number" 
                                                    value={Step.generaldata.tempoMontagem} 
                                                    name="tempoMontagem"
                                                    min={1}
                                                    onChange={this.handleChangeGeneral}/>
                                            </Form.Item>
                                        </div>
                                    </Col>
                                </Row>
                            </Card>
                        </Form>
                    </Col>
                </Row>
            </div>
        )

    }
    

    render() {

        console.log(this.state.Step);
        return(
            <Spin spinning={this.state.loading} tip={this.state.loadingTip}>
                <Row>
                <Col lg={5} md={5} sm={24} xs={24}>
                        {this.LeftList()}
                    </Col>

                    <Col lg={15} md={15} sm={24} xs={24}>
                        {this.Content(this.state.Step,this.state.listofEstabs)}
                    </Col>

                    <Col lg={4} md={4} sm={24} xs={24}>
                        <Card className="gx-card" title="Etapas do Processo">
                            <Button 
                                block
                                type="primary"
                                className="gx-btn-secondary"
                                disabled={!this.state.canNew}
                                onClick={this.onHandleClickNew}
                            >
                                Novo
                            </Button>
                            <Button 
                                block
                                type="primary"
                                disabled={!this.state.canSave}
                                onClick={this.onHandleClickSave}
                            >
                                Salvar
                            </Button>
                            <br/>
                            <Button 
                                block
                                disabled={!this.state.canDelete} 
                                type="primary"
                                className="gx-btn-red"
                                onClick={this.onHandleClickDelete}
                            >
                                Excluir
                            </Button>

                            <Button 
                                block
                                type="default"
                                onClick={this.onCancel}
                            >
                                Cancelar
                            </Button>

                        </Card>
                    </Col>
                </Row>
            </Spin>
        )
    }


}

export default EstapasProcesso
