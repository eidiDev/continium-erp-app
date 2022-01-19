import React, {Component} from 'react'
import {Row, Col, Card, Form, Input, Button, message, Spin, Modal, Select, Checkbox} from 'antd';
import SimpleReactValidator from 'simple-react-validator';
import history from '../../../util/history';
import ListMaquina from './MaquinaList'
import api from '../../../util/Api'

//import { string } from 'prop-types';

const model = 'Machinelabor';
const model2 = 'establishment'
const { Option } = Select;
const _ = require('lodash');

class MaquinaMaodeObra extends Component {

    constructor() {
        super()
        this.state = {            
            isNew: true,
            loader: true,
			machine: {
                establishments: 1,
                rateTimeRelation: {
                    id: '',
                    cod: '',
                    valor: '',
                    tipo: ''
                },
                programador: false,
                operador: false,
                montagem: false,
                controle: false,
            },
			canNew: true,
			canSave: true,
            canDelete: false,
            loading: false,
            listofEstabs: [],
            listofTaxaMaquinas: [],
            listofTaxaMontagens: []
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleEstab =  this.handleEstab.bind(this);
        this.handleTip =  this.handleTip.bind(this);
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
        this.getTaxas();
    }

    onChangeCheck = (name,event) => {
        console.log(event, name);
        let newCateg = this.state.machine;
        newCateg[name] = event.target.checked;

        this.setState({
            machine: newCateg
        });

    }

    getEstabs(){
        api.get(`${model2}`, {
        })
        .then((result) => {
            let dataEstab = [];
            dataEstab = result.data.data;
            
            this.setState({
                listofEstabs: dataEstab
            });
            
        },)
        .catch(function(error) { 
        })
    }

    getTaxas(){
        api.get("TaxaHora", {
        })
        .then((result) => {
            let dataEstab = [];
            dataEstab = result.data.data;

            
            let taxMaquinas = _.filter(dataEstab, {'tipo': 'maquina'})
            this.setState({
                listofTaxaMaquinas: taxMaquinas
            });

            let taxMontagens = _.filter(dataEstab, {'tipo': 'montagem'})

            this.setState({
                listofTaxaMontagens: taxMontagens
            });

        },)
        .catch(function(error) { 
            console.log(error);
        })
    }

    handleOnClickRow1 = (record, rowIndex) => {
        var parent = this
        //Primeria coisa ele seta loading para true
        this.setState({
            loading:true,
            loadingTip: 'Carregando registro, aguarde...'
        })
        //Agora ele vai buscar o registro no servidor
        api.get(`${model}/${record.id}`, {})
        .then((result) => {
            //Caso consiga recuperar o model, ele atualiza a tela e para de carregar
            console.log(result.data.adresses);
            // console.log(result.adresses);
            message.success('Registro carregado com sucesso!');
            parent.setStateEdit(result.data)
        },)
        .catch(function(error) { 
            console.log(error);
            message.error('Erro ao buscar registro, tente novamente mais tarde!');
            parent.setStateNew()
        })
        
    }

    onHandleClickSave = () => {
        // console.log(this.state.model);
        if(this.validator.allValid()) {
            let record = this.state.machine;
            var parent = this;
            
            this.setState({
                loading:true,
                loadingTip: 'Salvando registro, aguarde...',
            });
            let ok = 1;
            if(record.type === 'maoDeObra') {
                //Verifica se possui maquina já cadastrada com esse código de apontamento
                api.get(`api/machinelabor/maodeobra/${record.passwordappoitment}`, {})
                .then(async (result) => {
                    console.log(result.data);
                    console.log(record);
                    if(result.data.length > 0 && result.data[0].cod !== record.cod) {
                        message.error('Identifacodr p/ apontamento já cadastrado. Escolha outro.');
                        this.setState({loading:false});    
                    }else {
                            // console.log('vai tentar gravar',record)
                            //Verifica se é uma atualizacao (PUT) ou novo registro (POST)
                        let METHOD = 'PATCH'
                        let URL = `${model}/${record.id}`
                        
                        if(parent.state.isNew){
                            METHOD = 'POST'
                            URL = `${model}`
                            // record = Object.assign({},record)
                        }
                        
                        const {cod, name, establishments, passwordappoitment, ratetime, type, programador,operador,montagem, rateTimeRelation, controle } = record;
                        let auxRateTimeRelation = rateTimeRelation;

                        if(auxRateTimeRelation === null) {
                            auxRateTimeRelation = {
                                id : null
                            }
                        }else{
                            if(auxRateTimeRelation.id === '' || auxRateTimeRelation.id === null){
                                auxRateTimeRelation.id = null 
                            }
                        }
                        api(
                            {
                            method: METHOD,
                            url: URL,
                            data:
                            {
                                cod: cod,
                                name: name,
                                establishments: establishments,
                                passwordappoitment: passwordappoitment,
                                ratetime: ratetime,
                                rateTimeRelation: auxRateTimeRelation.id,
                                programador: programador,
                                operador: operador,
                                montagem: montagem,
                                type: type,
                                controle: controle,
                            } 
                        }).then((result) => {
                            //Caso consiga recuperar o model, ele atualiza a tela e para de carregar
                            message.success('Registro salvo com sucesso!');

                            parent.setStateEdit(result.data);
                            parent.leftListChild.current.fetchLeftList()
                        },)
                        .catch(function(error) { 
                            console.log(error);
                            parent.setStateEdit(record)
                            message.error('Erro ao gravar registro, tente novamente mais tarde!');
                        })

                    }
                },)
                .catch(function(error) {
                    // message.error('Erro ao buscar registro, tente novamente mais tarde!:'+error.message);
                    console.log('error', error)
                });

            }else{
                let METHOD = 'PATCH'
                let URL = `${model}/${record.id}`
                
                if(parent.state.isNew){
                    METHOD = 'POST'
                    URL = `${model}`
                    // record = Object.assign({},record)
                }
                
                const {cod, name, establishments, passwordappoitment, ratetime, type, programador,operador,montagem, rateTimeRelation, controle } = record;
                let auxRateTimeRelation = rateTimeRelation;

                if(auxRateTimeRelation === null) {
                    auxRateTimeRelation = {
                        id : null
                    }
                }else{
                    if(auxRateTimeRelation.id === '' || auxRateTimeRelation.id === null){
                        auxRateTimeRelation.id = null 
                    }
                }
                api(
                    {
                    method: METHOD,
                    url: URL,
                    data:
                    {
                        cod: cod,
                        name: name,
                        establishments: establishments,
                        passwordappoitment: passwordappoitment,
                        ratetime: ratetime,
                        rateTimeRelation: auxRateTimeRelation.id,
                        programador: programador,
                        operador: operador,
                        montagem: montagem,
                        type: type,
                        controle: controle,
                    } 
                }).then((result) => {
                    //Caso consiga recuperar o model, ele atualiza a tela e para de carregar
                    message.success('Registro salvo com sucesso!');

                    parent.setStateEdit(result.data);
                    parent.leftListChild.current.fetchLeftList()
                },)
                .catch(function(error) { 
                    console.log(error);
                    parent.setStateEdit(record)
                    message.error('Erro ao gravar registro, tente novamente mais tarde!');
                });
            }
            if(ok === 0) { 
                console.log('nao vai gravar');
                return 
            }

            console.log('vai gravar..');

            
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
        let record = this.state.machine
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
            machine: {
                establishments: 1,
                rateTimeRelation: {
                    id: '',
                    cod: '',
                    valor: '',
                    tipo: ''
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
            machine: model,
            loading: false,
            isNew: false
        });
    }
    
    handleChange(event) {
        let newMachine = this.state.machine;
        newMachine[event.target.name] = event.target.value;

        this.setState(() => ({
            machine: newMachine
        }))
    }

    LeftList = () => {
        return (
            <ListMaquina onClickRow={this.handleOnClickRow1  }  ref={this.leftListChild} />
        )
    }

    handleEstab(event){
        let auxList = this.state.listofEstabs;
        let newMachine = this.state.machine;
        
        auxList.map( obj => {
            if(obj.id === event){
                newMachine["establishments"] = obj.id
                this.setState({
                    machine: newMachine 
                })
            }

            return(
                ''
            )
        });
        console.log(event);
    }

    handleTip(event){
        console.log(event);
        let newMachine = this.state.machine;
        newMachine["type"] = event;
        this.setState({
            machine: newMachine
        });
    }

    handleTaxaHora = (event) => {
        console.log(event);
        let newMachine = this.state.machine;
        if(newMachine.rateTimeRelation === null){
            newMachine["rateTimeRelation"] = {
                cod: '',
                id: '',
                tipo: '',
                valor: ''
            }
        }

        for (const iterator of this.state.listofTaxaMaquinas) {
            if(iterator.id === event){
                newMachine.rateTimeRelation.valor = iterator.valor
                newMachine.rateTimeRelation.id = iterator.id
                this.setState({
                    machine: newMachine
                });
            }
        }
    }

    handleTaxaHoraMtg = (event) => {
        console.log(event);
        let newMachine = this.state.machine;
        if(newMachine.rateTimeRelation === null){
            newMachine["rateTimeRelation"] = {
                cod: '',
                id: '',
                tipo: '',
                valor: ''
            }
        }

        for (const iterator of this.state.listofTaxaMontagens) {
            if(iterator.id === event){
                newMachine.rateTimeRelation.valor = iterator.valor;
                newMachine.rateTimeRelation.id = iterator.id
                this.setState({
                    machine: newMachine
                });
            }
        }
    }

    Content = (machine,estabs,taxasMaq,taxasMtg) => {
        return (
            <div className="main">
                <Row>
                    <Col span={24}>
                        <Form layout="horizontal" size="small">
                            <Card type="inner" title="Cadastro de Maquinas e mão de Obra ">
                                <Row>
                                    <Col lg={6} md={6} sm={12} xs={24}>
                                        <div className="gx-form-row0">
                                            <Form.Item label="Código" required={true} >
                                                <Input 
                                                    type="text" 
                                                    value={machine.cod} 
                                                    name="cod"
                                                    disabled={this.state.isNew ? false : true}
                                                    onChange={this.handleChange}/>
                                                    {this.validator.message('cod', machine.cod, 'required|string',{ className: 'text-danger' })}
                                            </Form.Item>
                                        </div>
                                    </Col>
                                    <Col lg={6} md={6} sm={12} xs={24}>
                                        <div className="gx-form-row0">
                                            <Form.Item label="Estabelecimento" required={true} >
                                                <Select
                                                showSearch 
                                                value={machine.establishments} 
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
                                                {this.validator.message('establishments', machine.establishments, 'required|alpha_num',{ className: 'text-danger' })}
                                            </Form.Item>
                                        </div>
                                    </Col>
                                    <Col lg={6} md={6} sm={12} xs={24}>
                                        <div className="gx-form-row0">
                                            <Form.Item label="Nome">
                                                <Input 
                                                    type="text" 
                                                    value={machine.name} 
                                                    name="name"
                                                    onChange={this.handleChange}/>
                                            </Form.Item>
                                        </div>
                                    </Col>
                                    <Col lg={6} md={6} sm={12} xs={24}>
                                        <div className="gx-form-row0">
                                            <Form.Item label="Tipo">
                                                <Select 
                                                    value={machine.type}  
                                                    onChange={this.handleTip} 
                                                    // style={{ width: 250 }} 
                                                >
                                                    <Option value={"maquina"}>Maquina</Option>
                                                    <Option value={"maoDeObra"}>Mão de Obra</Option>
                                                    <Option value={"montagem"}>Montagem</Option>
                                                </Select>
                                            </Form.Item>
                                        </div>
                                    </Col>
                                </Row>
                            </Card>
                        </Form>

                        <Card type="inner" title="Dados Gerais">
                            {machine.type === "maoDeObra" ?
                        <> 
                            <Row>
                                <Col lg={6} md={6} sm={12} xs={24}>
                                    <div className="gx-form-row0">
                                        <Form.Item label="Mao de obra">
                                            <Checkbox checked={this.state.machine.programador} onChange={e => this.onChangeCheck("programador", e)}>Programador</Checkbox>
                                            <Checkbox checked={this.state.machine.operador} onChange={e => this.onChangeCheck("operador", e)}>Operador</Checkbox>
                                            {/* <Checkbox checked={this.state.machine.montagem} onChange={e => this.onChangeCheck("montagem", e)}>Montagem</Checkbox> */}
                                        </Form.Item>
                                    </div>
                                </Col>
                            </Row>
                            {machine.programador === true || machine.operador === true ?               
                            <Row>
                                <Col lg={6} md={6} sm={12} xs={24}>
                                    <div className="gx-form-row0">
                                        <Form.Item colon={true}  label="Identificador p/ apontamento">
                                            <Input 
                                                type="text" 
                                                value={machine.passwordappoitment} 
                                                name="passwordappoitment"
                                                onChange={this.handleChange}
                                            />
                                        </Form.Item>
                                    </div>
                                </Col>
                            </Row>
                            :
                            ""    
                            }
                            </>
                            :
                            ""
                            }
                            {machine.type === "maquina" ?
                            <Row>
                                <Col lg={8} md={6} sm={12} xs={24}>
                                    <div className="gx-form-row0">
                                        <Form.Item label="Taxa Hora">
                                            <Select 
                                                value={machine.rateTimeRelation === null ? "" : machine.rateTimeRelation.id} 
                                                onChange={this.handleTaxaHora} 
                                                style={{ width: 250 }} 
                                            >
                                                {
                                                    taxasMaq.map( e => {
                                                        return (
                                                        <Option value={e.id}>{e.cod}</Option>
                                                        ) 
                                                    })
                                                }
                                            </Select>
                                        </Form.Item>
                                    </div>
                                </Col>
                                <Col lg={6} md={6} sm={12} xs={24}>
                                    <div className="gx-form-row0">
                                        <Form.Item label="Valor">
                                            <Input 
                                                type="number" 
                                                disabled={true}
                                                value={machine.rateTimeRelation === null ? machine.ratetime : machine.rateTimeRelation.valor} 
                                                name="ratetime"
                                                onChange={this.handleChange}
                                            />
                                        </Form.Item>
                                    </div>
                                </Col>
                            </Row>
                        :
                        ""
                        }

                        {machine.type === "montagem" ?
                            <Row>
                                <Col lg={8} md={6} sm={12} xs={24}>
                                    <div className="gx-form-row0">
                                        <Form.Item label="Taxa Hora">
                                            <Select 
                                                value={machine.rateTimeRelation === null ? "" : machine.rateTimeRelation.id } 
                                                onChange={this.handleTaxaHoraMtg} 
                                                style={{ width: 250 }} 
                                            >
                                                {
                                                    taxasMtg.map( e => {
                                                        return (
                                                        <Option value={e.id}>{e.cod}</Option>
                                                        ) 
                                                    })
                                                }
                                            </Select>
                                        </Form.Item>
                                    </div>
                                </Col>

                                <Col lg={6} md={6} sm={12} xs={24}>
                                    <div className="gx-form-row0">
                                        <Form.Item label="Valor">
                                            <Input 
                                                type="number" 
                                                disabled={true}
                                                value={machine.rateTimeRelation === null ? machine.ratetime :  machine.rateTimeRelation.valor} 
                                                name="ratetime"
                                                onChange={this.handleChange}/>
                                        </Form.Item>
                                        </div>
                                </Col>
                            </Row>
                            :
                            ""
                            }
                            <Row>
                                <Col lg={6} md={6} sm={12} xs={24}>
                                    <div className="gx-form-row0">
                                        <Form.Item label="Possui Controle?">
                                            <Checkbox checked={machine.controle} onChange={e => this.onChangeCheck("controle", e)}>Sim</Checkbox>
                                            
                                            {/* <Checkbox checked={this.state.machine.montagem} onChange={e => this.onChangeCheck("montagem", e)}>Montagem</Checkbox> */}
                                        </Form.Item>
                                    </div>
                                </Col>
                            </Row>
                        </Card>  
                    </Col>
                </Row>
            </div>
        )

    }
    

    render() {

        console.log(this.state.machine);
        return(
            <Spin spinning={this.state.loading} tip={this.state.loadingTip}>
                <Row>
                    <Col lg={5} md={5} sm={24} xs={24}>
                        {this.LeftList()}
                    </Col>

                    <Col lg={15} md={15} sm={24} xs={24}>
                        {this.Content(this.state.machine,this.state.listofEstabs,this.state.listofTaxaMaquinas,this.state.listofTaxaMontagens)}
                    </Col>

                    <Col lg={4} md={4} sm={24} xs={24}>
                        <Card type="inner" title="Maquinas e mão de obra">
                            <Button 
                                block
                                type="primary"
                                className="gx-btn-secondary"
                                disabled={!this.state.canNew}
                                onClick={this.onHandleClickNew}>
                                Novo</Button>
                            <Button 
                                block
                                type="primary"
                                disabled={!this.state.canSave}
                                onClick={this.onHandleClickSave}>
                                Salvar
                                </Button>
                            <br/>
                            <Button 
                                block
                                disabled={!this.state.canDelete} 
                                type="primary"
                                className="gx-btn-red"
                                onClick={this.onHandleClickDelete}
                                >Excluir</Button>
                            <Button 
                                block
                                type="default"
                                onClick={this.onCancel}
                                >Cancelar</Button>
                        </Card>
                    </Col>
                </Row>
            </Spin>
        )
    }


}

export default MaquinaMaodeObra
