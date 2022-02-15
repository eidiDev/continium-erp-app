import React, {Component} from 'react';
import {Row, Col, Spin, message, Modal, Button, Card, Upload, Icon} from 'antd';
import CustomerForm from './customerForm';
import CustomerList from './customersList';
import RightList from 'components/RightList';
import IntlMessages from "util/IntlMessages";
import api from 'util/Api';
import SimpleReactValidator from 'simple-react-validator';
import { Link } from 'react-router-dom';

const model = 'partner';
class Customers extends Component {
        //Construtor
    constructor() {
        super()
        this.state = {
            isNew: true,
            canNew: true,
			canSave: true,
            canDelete: false,
            loading: false,
            model: {
                tipo: ''
            },
            adresses: [],
            refreshEditAddress: false,
            knowToRaz: null,
            clearVars:false
        }
        this.setStateNew = this.setStateNew.bind(this);

        this.onHandleClickNew = this.onHandleClickNew.bind(this);
        this.onHandleClickSave = this.onHandleClickSave.bind(this);
        this.onHandleClickDelete = this.onHandleClickDelete.bind(this);

        this.handleClickAddAddress = this.handleClickAddAddress.bind(this);
        this.handleDeleteAddressRow = this.handleDeleteAddressRow.bind(this);

        this.leftListChild = React.createRef();

        this.validator = new SimpleReactValidator({locale: 'pt', messages:{default: `:attribute não pode estar vazio`}});
    }

    //Função para quando o usuario clicar no item da lista
    handleOnClickRow = (record, rowIndex) => {
        var parent = this
        //Primeria coisa ele seta loading para true
        this.setState({
            loading:true,
            loadingTip: 'Carregando registro',
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
                    message.success('Cliente carregado com sucesso!');
                    parent.setStateEdit(result.data);
                    parent.setState({
                        knowToRaz:true
                    })
                },)
                .catch(function(error) { 
                    console.log(error);
                    message.error('Erro ao buscar registro, tente novamente mais tarde!');
                    parent.setStateNew()
                })
        }, 1000);
        
    }

    //Função para clicar no botao Novo
    onHandleClickNew = () => {
        this.setStateNew()
    }

     //Função para clicar no botao Novo
     onHandleClickSave = () => {
        if(this.validator.allValid()) {
            let record = this.state.model;
            //Coloca a lista de endereços no modelo
            record.adresses = this.state.adresses;
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
        
                api({
                    method: METHOD,
                    url: URL,
                    data: {
                            name: record.name, 
                            lastname: record.lastname,
                            cnpj: record.cnpj,
                            razao_social: record.razao_social,
                            tipo: record.tipo,
                            adresses: record.adresses
                        }
                    // data: record
                }).then((result) => {
                    //Caso consiga recuperar o model, ele atualiza a tela e para de carregar
                    message.success('Cliente salvo com sucesso!');
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
        }else{
            message.warning('Campos obrigatórios em branco!');
            this.validator.showMessages();
            this.forceUpdate();
        }
    }

     //Função para clicar no botao Novo
     onHandleClickDelete = () => {
        // console.log(this.state.model);
        let record = this.state.model
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

    //Funcao para setar a tela como nao edicao
    setStateNew = () => {
        this.setState({ 
            canSave: true,
            canNew: true,
            canDelete: false,
            model: {},
            adresses: [],
            loading: false,
            isNew: true,
            refreshLeftList: false,
            knowToRaz:false
        });
        this.refreshEditAddress();

    }

    
    //Seta o estado para edição
    setStateEdit = (model) => {
        console.log(model);
        this.setState({ 
            canSave: true,
            canNew: true,
            canDelete: true,
            model: model,
            loading: false,
            isNew: false,
            adresses: model.adresses
        });
    }

    //Adicionando endereço a lista de endereços
    handleClickAddAddress(address) {
        //Vai adicionar o endereço a lista de endereços
        let nAdresses = this.state.adresses;
        let last = nAdresses[nAdresses.length - 1];
        if(nAdresses.length === 0){
            address['key'] = 0
        }else{
            address['key'] = last.key + 1
        }
        
        nAdresses.push(address);

        this.setState({
            adresses: nAdresses
        })
    }
    //Removendo item da lista de endereços
    handleDeleteAddressRow(key, e) {
        e.preventDefault();
        const adresses = this.state.adresses.filter(item => item.key !== key);
        this.setState({adresses})
    }

    handleEditAdress = (addr) => {
        let nAdresses = this.state.adresses;

        for (var iterator of nAdresses) {
            if(iterator.key === addr.key){
                iterator = addr
            }
        }
    } 

    refreshEditAddress = () => {
        if(this.state.refreshEditAddress === true){
            return true;
        }else{
            return false;
        }
    }

    knowIfIsEditing = () => {
        this.setState({
            refreshEditAddress: true
        })
    }

    knowToRaz = () => {
        if(this.state.knowToRaz === false){
            return true;
        }else{
            return false;
        }
    }

    knowToClearVars = (clearvars) => {
        if(clearvars === true){
            this.setState({
                clearVars: true
            })
        }
    }

    handleChangeUpload = (file, id) => {
        if (file.file.status === 'uploading') {
            this.setState({
                loading:true,
                loadingTip: 'Salvando registro, aguarde...',
            })
        }
        if (file.file.status === 'done') {
            this.setStateNew()
            this.leftListChild.current.fetchLeftList()
            message.success(`${file.file.name} Clientes salvos com Sucesso !`);
        } else if (file.file.status === 'error') {
            this.setStateNew()
          if(!file.file.type.includes('csv')){
            message.error(`${file.file.name} o sistema aceita somente CSV, tente novamente.`);
          }else{
            message.error(`${file.file.name} , erro ao fazer Upload, tente novamente.`);
          }
        }
      };

      customReq = async (options) => {
        const { onSuccess, onError, file, onProgress } = options;
    
        const fmData = new FormData();
    
        const config = {
          headers: { 'content-type': 'multipart/form-data' },
          onUploadProgress: (event) => {
            const percent = Math.floor((event.loaded / event.total) * 100);
            this.setState({
              progress: percent,
            });
            if (percent === 100) {
              setTimeout(() => this.setState({ progress: 0 }), 1000);
            }
            onProgress({ percent: (event.loaded / event.total) * 100 });
          },
        };
    
        fmData.append('avatar', file);
        try {
          await api.post(`/uploadCliente`, fmData, config);
    
          onSuccess('Ok');
          // console.log('server res: ', res);
        } catch (err) {
          console.log('Error: ', err);
          const error = new Error('Some error');
          onError({ error });
        }
      };

    render () {
        return (
            <Spin spinning={this.state.loading} tip={this.state.loadingTip}>
                <Row>
                    <Col lg={5} md={5} sm={24} xs={24}>
                        <CustomerList  onRowClick={this.handleOnClickRow} ref={this.leftListChild}/>
                    </Col>
                    <Col lg={15} md={15} sm={24} xs={24}>
                        <CustomerForm 
                            model={this.state.model} 
                            handleClickAddAddress={this.handleClickAddAddress}
                            refreshEditAddress={this.refreshEditAddress}
                            knowIfIsEditing={this.knowIfIsEditing}
                            knowToClearVars={this.knowToClearVars}
                            knowToRaz={this.knowToRaz}
                            adresses={this.state.adresses}
                            handleEditAdress={this.handleEditAdress}
                            handleDeleteAddressRow={this.handleDeleteAddressRow}
                            validator={this.validator} 
                        />
                    </Col>
                    <Col lg={4} md={4} sm={24} xs={24}>
                        <RightList 
                            title={<IntlMessages id="commondata.customers"/>}
                            onHandleClickNew={this.onHandleClickNew}
                            onHandleClickSave={this.onHandleClickSave}
                            onHandleClickDelete={this.onHandleClickDelete}
                            canNew={this.state.canNew}
                            canSave={this.state.canSave}
                            canDelete={this.state.canDelete}
                        />
                         <Card type="inner" title="Upload">
                             <center>

                             
                            <Upload 
                                customRequest={this.customReq}
                                onChange={(file) =>
                                    this.handleChangeUpload(
                                      file
                                    )
                                  }
                            >
                                <Button
                                      block
                                      type="primary"
                                >
                                <Icon type="upload" /> Upload de Clientes
                                </Button>
                            </Upload>
                            <br/>
                            <Link to="/csvlink/exUploadPartner.csv" target="_blank" download> <Icon type="download" /> Exemplo de arquivo CSV</Link>
                                
                            </center>


                         </Card>
                    </Col>
                </Row>
            </Spin>
        )
    }
}

export default Customers;