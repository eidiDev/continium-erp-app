import React, {Component} from 'react';
import {Row, Col, Card, Form, Input, Button, message, Spin, Modal} from 'antd';
import SimpleReactValidator from 'simple-react-validator';
import history from 'util/history';
import ListEstab from './ListEstab'
import api from 'util/Api';

const model = 'establishment';
class Estabelecimento extends Component {

    constructor() {
        super()
        this.state = {            
            isNew: true,
            loader: true,
			estab: {},
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
        
        this.validator = new SimpleReactValidator({locale: 'pt', messages:{default: `:attribute não pode estar vazio`}});
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
                    console.log(result.data.adresses);
                    // console.log(result.adresses);
                    message.success('Estabelecimento carregado com sucesso!');
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

        if(this.validator.allValid()) {
            // console.log(this.state.model);
            let record = this.state.estab;
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
                console.log('onHandleSaveButton', record);
                const {cod, name} = record;
        
                api(
                    {
                    method: METHOD,
                    url: URL,
                    data:
                    {
                        cod: cod,
                        name: name
                    } 
                }).then((result) => {
                    //Caso consiga recuperar o model, ele atualiza a tela e para de carregar
                    message.success('Estabelecimento salvo com sucesso!');
                    console.log(result.data);
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
        let record = this.state.estab
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
                        message.error(error.response.data.message);
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
            estab: {},
            loading: false,
            isNew: true,
            refreshLeftList: false
        });
    }
    //Seta o estado para edição
    setStateEdit = (model) => {
        console.log(model);
        this.setState({ 
            canSave: true,
            canNew: true,
            canDelete: true,
            estab: model,
            loading: false,
            isNew: false
        });
    }
    
    setStateNew = () => {
        this.setState({ 
            canSave: true,
            canNew: true,
            canDelete: false,
            estab: {},
            loading: false,
            isNew: true,
            refreshLeftList: false
        });
    }

    handleChange(event) {
        let newEstab = this.state.estab;
        newEstab[event.target.name] = event.target.value;

        this.setState(() => ({
            estab: newEstab
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
            <ListEstab onClickRow={this.handleOnClickRow1  }  ref={this.leftListChild} />
            // <ListUsers />
        )
    }

    
    Content = (estab) => {
        return (
            <div className="main">
                <Row>
                    <Col span={24}>
                        <Form layout="horizontal">
                            <Card type="inner" title="Cadastro de Estabelecimentos">
                                <Row>
                                    <Col lg={6} md={6} sm={12} xs={24}>
                                        <div className="gx-form-row0">
                                            <Form.Item label="Código" required={true}>
                                                <Input 
                                                    type="text" 
                                                    value={estab.cod} 
                                                    name="cod"
                                                    disabled={this.state.isNew ? false : true}
                                                    onChange={this.handleChange}
                                                    onBlur={() => this.validator.showMessageFor('cod')} 
                                                />
                                                {this.validator.message('Codigo', estab.cod, 'required|string',{ className: 'text-danger' })}
                                            </Form.Item>
                                        </div>
                                    </Col>
                                    <Col lg={6} md={6} sm={12} xs={24}>
                                        <div className="gx-form-row0">
                                            <Form.Item label="Nome" required={true}>
                                                <Input 
                                                    type="text" 
                                                    value={estab.name}
                                                    name="name"
                                                    onChange={this.handleChange}/>
                                                {this.validator.message('Nome', estab.name, 'required|string',{ className: 'text-danger' })}
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
        return(
            <Spin spinning={this.state.loading} tip={this.state.loadingTip}>
                <Row>
                    <Col lg={5} md={5} sm={24} xs={24}>
                        {this.LeftList()}
                    </Col>
                
                    <Col lg={15} md={15} sm={24} xs={24}>
                        {this.Content(this.state.estab)}
                    </Col>

                    <Col lg={4} md={4} sm={24} xs={24}>
                        <Card type="inner" title="Estabelecimentos">
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
                        </Card>
                    </Col>
                </Row>
            </Spin>
        )
    }


}

export default Estabelecimento
