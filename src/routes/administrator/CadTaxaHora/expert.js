import React, {Component} from 'react'
import {Row, Col, Card, Form, Input, Button,message,  Modal, Spin,Select} from 'antd'
//Collapse
import history from '../../../util/history';
import ListTaxaHora from './ListTaxaHora';
import api from '../../../util/Api'
import '../Users/maktorTemplate.less'
const { Option } = Select;

// const FormItem = Form.item
const model = 'TaxaHora';

// const customPanelStyle = {
//     borderRadius: 4,
//     border: 0,
//     overflow: 'hidden',
// };

class TaxaHoraExpert extends Component {
    constructor(){
        super();
        this.state = {            
            isNew: true,
            loader: true,
			user: {},
			canNew: true,
			canSave: true,
            canDelete: false,
            loading: false
        }

        this.handleChange = this.handleChange.bind(this);
        this.setStateNew = this.setStateNew.bind(this);
        this.onHandleClickSave = this.onHandleClickSave.bind(this);
        
        this.onHandleClickDelete = this.onHandleClickDelete.bind(this);
        this.onHandleClickNew = this.onHandleClickNew.bind(this);
        // this.handleSubmit = this.handleSubmit.bind(this);

        this.leftListChild = React.createRef();


    }

    onHandleClickNew = () => {
        this.setStateNew()
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
                    // console.log(result.data.adresses);
                    // console.log(result.adresses);
                    message.success('Taxa Hora carregada com sucesso!');
                    parent.setStateEdit(result.data)
                },)
                .catch(function(error) { 
                    // console.log(error);
                    message.error('Erro ao buscar registro, tente novamente mais tarde!');
                    parent.setStateNew()
                })
        }, 1000);
        
    }

    onHandleClickSave = () => {

        let isok = 0;
        var pwd = prompt("Para alterar o valor é necessário a senha.");
        if(pwd != null && pwd === 'COTINIUMERP@') {
            isok = 1;
        }else {
            message.error('Senha incorreta!');
        }
        
        if(!isok) { return };

        // console.log(this.state.model);
        let record = this.state.user;
        var parent = this;

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
            // console.log('onHandleSaveButton', record);
            const {cod, valor, tipo} = record;
       
            api(
                {
                method: METHOD,
                url: URL,
                data:
                {
                    cod: cod,
                    valor: valor,
                    tipo: tipo
                } 
            }).then((result) => {
                //Caso consiga recuperar o model, ele atualiza a tela e para de carregar
                message.success('Taxa hora salva com sucesso!');
                // console.log(result.data);
                parent.setStateEdit(result.data)
                parent.leftListChild.current.fetchLeftList()
            },)
            .catch(function(error) { 
                // console.log(error);
                parent.setStateEdit(record)
                message.error('Erro ao gravar registro, tente novamente mais tarde!');
            })
        }, 1000);
    }

    onCancel = () => {
        history.replace('/dashboard');
        document.location.reload(true);
    }
    
    onHandleClickDelete = () => {
        // console.log(this.state.model);
        let isok = 0;
        var pwd = prompt("Para alterar o valor é necessário a senha.");
        if(pwd != null && pwd === 'COTINIUMERP@') {
            isok = 1;
        }else {
            message.error('Senha incorreta!');
        }
        
        if(!isok) { return };


        let record = this.state.user
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
                        // console.log(error);
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
            user: {},
            loading: false,
            isNew: true,
            refreshLeftList: false
        });
    }

    //Seta o estado para edição
    setStateEdit = (model) => {
        // console.log(model);
        this.setState({ 
            canSave: true,
            canNew: true,
            canDelete: true,
            user: model,
            loading: false,
            isNew: false
        });
    }

    handleChange = event => {

        let newUser = this.state.user;
        newUser[event.target.name] = event.target.value;

        this.setState(() => ({
            user: newUser
        }))
    }

    LeftList = () => {
        return (
            <ListTaxaHora onClickRow={this.handleOnClickRow1}  ref={this.leftListChild} />
        )
    }

    handleTip = event =>{
        console.log(event);
        let newUser = this.state.user;
        newUser["tipo"] = event;
        this.setState({
            user: newUser
        });
    }

    Content = (user) => {
        return (
            <div className="main">
                <Row>
                    <Col span={24}>
                        <Form layout="horizontal" size="small" >
                            <Card type="inner" title="Cadastro de Taxa Hora">
                                <Row>
                                    <Col lg={6} md={8} sm={12} xs={24} >
                                        <div className="gx-form-row0">
                                            <Form.Item label="Código">
                                                    <Input 
                                                        type="text" 
                                                        value={user.cod}
                                                        name="cod"
                                                        disabled={this.state.isNew ? false : true}
                                                        onChange={this.handleChange}/>
                                            </Form.Item>
                                        </div>
                                    </Col>

                                    <Col lg={6} md={8} sm={12} xs={24} >
                                        <div className="gx-form-row0">
                                            <Form.Item label="Valor">
                                                    <Input 
                                                        type="number" 
                                                        value={user.valor}
                                                        name="valor"
                                                        onChange={this.handleChange}/>
                                            </Form.Item>
                                        </div>
                                    </Col>

                                    <Col lg={6} md={8} sm={12} xs={24} >
                                        <div className="gx-form-row0">
                                            <Form.Item label="Tipo">
                                                <Select 
                                                    value={user.tipo} 
                                                    // style={{ width: 200 }} 
                                                    onChange={this.handleTip}
                                                >
                                                    <Option value={"maquina"}>Maquina</Option>
                                                    <Option value={"montagem"}>Montagem</Option>
                                                </Select>
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
        return (
            <Spin spinning={this.state.loading} tip={this.state.loadingTip}>
                <Row>
                    <Col lg={5} md={5} sm={24} xs={24}>
                            {this.LeftList()}
                    </Col>

                    <Col lg={15} md={15} sm={24} xs={24}>
                        {this.Content(this.state.user)}
                    </Col>

                    <Col lg={4} md={4} sm={24} xs={24}>
                        <Card type="inner" title="Taxa Hora">
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
                                onClick={this.onHandleClickSave}
                                disabled={!this.state.canSave}
                            >
                                Salvar
                            </Button>
                            <br/>
                            <Button 
                                block
                                disabled={!this.state.canDelete} 
                                type="primary"
                                onClick={this.onHandleClickDelete}
                                className="gx-btn-red"
                            >
                                Excluir
                            </Button>
                        </Card>
                    </Col>
                </Row>
            </Spin>
        )
    }
}

export default TaxaHoraExpert