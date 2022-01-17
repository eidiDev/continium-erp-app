import React, {Component} from 'react'
import {Row, Col, Card, Form, Input, message, Spin, Modal,  Select, DatePicker, Table} from 'antd'
import history from '../../../util/history';
import locale from 'antd/es/date-picker/locale/pt_BR';
import ListnoteProduction from './listNoteProd';
import RightList from '../../../components/RightList'
import api from '../../../util/Api'
import EditRow from '../prodOrder/EditRow'

import {EditableCell} from '../prodOrder/EditRow'
// import IntlMessages from "../../../util/IntlMessages";
import moment from 'moment';
//import {getUser} from "../../../appRedux/actions/Auth";

//const Panel = Collapse.Panel;
const { Option } = Select;
const model = 'noteprod';
const model2 = 'establishment';
const model3 = 'orderprod';
const model4 = 'partner';

class noteProduction extends Component {
    
    constructor(props) {
        super(props)
        this.state = {            
            isNew: true,
            loader: true,
			productOrder: {
                establishment: 1,
                orderProd: '',
                partner: '',
                dataProd: '',
                dataFim:''

            },
            dataAux: '',
            dataFim: '',
			canNew: true,
			canSave: true,
            canDelete: false,
            loading: false,
            listofEstabs: [],
            listofProds: [],
            listofPartner: [],
            tableSteps: [],
            tableComp: [],
            tableProdAcabado:[]
        }

        let auxthis = this;

        this.kitcolums = [

            {
                title: 'Sequencia',
                dataIndex:'sequencia',
                key: 'sequencia'
            },
            {
                title: 'Prioridade',
                dataIndex:'prioridade',
                key: 'prioridade'
            },
            {
                title: 'Produto',
                dataIndex:'produto',
                key: 'produto'
            },
            {
                title: 'Descrição ',
                dataIndex:'desc',
                key: 'desc'
            },
            {
                title: 'Qtde',
                dataIndex:'qtde',
                key: 'qtde',
                editable: true
            },
            {
                title: 'Unidade',
                dataIndex:'unidade',
                key: 'unidade'
            },

            {
                title: 'Ações',
                key: 'action',
                render: (text, record) => (
                    <div>
                        <i className="icon icon-trash"
                            style={{marginRight:'10px'}}
                            onClick={(e) => {
                                Modal.confirm({
                                    title: 'Tem certeza que deseja remover esta etapa ?',
                                    onOk() {
                                        auxthis.handleDeleteAddressRow(record.key, e);
                                    },
                                    onCancel() {
                                    }
                                });
                                
                            }}
                        />
                    </div>
                )
            }
        ]

        this.etapascolums = [
            {
                // title: text => <IntlMessages id="commondata.customers.lastname"/>,
                title: 'Etapa',
                dataIndex:'etapas',
                key: 'etapas'
            },
            {
                title: 'Maquina',
                dataIndex:'maquina',
                key: 'maquina'
            },
            {
                title: 'Tempo',
                dataIndex:'tempoMaquina',
                key: 'tempoMaquina',
                editable: true
            },
            // {
            //     title: 'Tp setup',
            //     dataIndex:'tpsetup',
            //     key: 'tpsetup'
            // },

            // {
            //     title: 'Tp operatorio',
            //     dataIndex:'tpoperario',
            //     key: 'tpoperario'
            // },
            {
                title: 'Programador',
                dataIndex:'programador',
                key: 'programador'
            },
            {
                title: 'Tempo',
                dataIndex:'tempoProgramador',
                key: 'tempoProgramador',
                editable: true
            },
            {
                title: 'Operador',
                dataIndex:'operador',
                key: 'operador'
            },
            {
                title: 'Tempo',
                dataIndex:'tempoOperador',
                key: 'tempoOperador',
                editable: true
            },

            {
                title: 'Montagem',
                dataIndex:'montagem',
                key: 'montagem'
            },
            {
                title: 'Tempo',
                dataIndex:'tempoMontagem',
                key: 'tempoMontagem',
                editable: true
            },
            
            {
                title: 'Ações',
                key: 'action',
                render: (text, record) => (
                    <div>
                        <i className="icon icon-trash"
                            style={{marginRight:'10px'}}
                            onClick={(e) => {
                                Modal.confirm({
                                    title: 'Tem certeza que deseja remover esta etapa ?',
                                    onOk() {
                                        auxthis.handleDeleteRowSteps(record.key, e);
                                    },
                                    onCancel() {
                                    }
                                });
                                
                            }}
                        />
                    </div>
                )
            }
        ]

        this.produtoDonecolums = [
            {
                title: 'Produto',
                dataIndex:'cod',
                key: 'cod'
            },
            {
                title: 'Descrição',
                dataIndex:'description1',
                key: 'description1'
            },
            // {
            //     title: 'Qtde',
            //     dataIndex:'programador',
            //     key: 'programador'
            // },
            {
                title: 'Unidade',
                dataIndex:'unity',
                key: 'unity'
            }
        ]

        this.handleChange = this.handleChange.bind(this);
        this.setStateNew = this.setStateNew.bind(this);
        this.onHandleClickSave = this.onHandleClickSave.bind(this);
        this.handleDeleteAddressRow =  this.handleDeleteAddressRow.bind(this);

        this.onHandleClickDelete = this.onHandleClickDelete.bind(this);
        this.onHandleClickNew = this.onHandleClickNew.bind(this);
        // this.handleSubmit = this.handleSubmit.bind(this);

        this.leftListChild = React.createRef();
        console.log('Constructor ----');
    }
    
    onHandleClickNew = () => {
        this.setStateNew()
    }

    componentWillMount(){
        this.getEstabs();
        this.getOrderProd();
        this.getPartner();
    }

    handleDeleteAddressRow(key, e) {
        e.preventDefault();
        const adresses = this.state.tableComp.filter(item => item.key !== key);
        this.setState({
            tableComp: adresses
        })
    }

    handleDeleteRowSteps(key, e) {
        e.preventDefault();
        const adresses = this.state.tableSteps.filter(item => item.key !== key);
        this.setState({
            tableSteps: adresses
        })
    }

    getOrderProd(){
        api.get(`${model3}`, {
        })
        .then((result) => {
            let dataProd = [];
            dataProd = result.data;
            
            this.setState({
                listofProds: dataProd
            });
        },)
        .catch(function(error) { 
            console.log(error);
        })
    }

    getEstabs(){
        api.get(`${model2}`, {
        })
        .then((result) => {
            let dataEstabs = [];
            dataEstabs = result.data;
            
            this.setState({
                listofEstabs: dataEstabs
            });
        },)
        .catch(function(error) { 
            console.log(error);
        })
    }

    getPartner(){
        api.get(`${model4}`, {
        })
        .then((result) => {
            let dataCli = [];
            dataCli = result.data;
            
            this.setState({
                listofPartner: dataCli
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

        //Coloquei esse timeout de 1 segundo para simular o carregamento
        setTimeout(function(){
            //Agora ele vai buscar o registro no servidor
            api.get(`${model}/${record.id}`, {
                })
                .then((result) => {
                    //Caso consiga recuperar o model, ele atualiza a tela e para de carregar
                     console.log(result);
                    // console.log(result.adresses);
                    if(result.data.orderProd === null){
                        result.data.orderProd = {
                            id: ""
                        }
                    }
                    message.success('Apontamento carregado com sucesso!');
                    
                    parent.setStateEdit(result.data);
                },)
                .catch(function(error) { 
                    // console.log(error);
                    message.error('Erro ao buscar registro, tente novamente mais tarde!');
                    parent.setStateEdit(record);
                })
        }, 1000);
        
    }

    onHandleClickSave = () => {
        // console.log(this.state.model);
        let record = this.state.productOrder;
        var parent = this;
        let components = this.state.tableComp;
        let etapas =  this.state.tableSteps;
        let produtoacabado = this.state.tableProdAcabado;

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
            // console.log('onHandleSaveButton', record);
            const {dataFim,dataProd,establishment,partner,orderProd,orderFox, apontamento,qtdeRealizada,tempoRealizado, tipo, qtdePrevista} = record;
            
            api(
                {
                method: METHOD,
                url: URL,
                data:
                {
                    establishments: establishment,
                    orderProd: orderProd,
                    partner: partner,
                    dataFim: dataFim,
                    qtdeRealizada: qtdeRealizada,
                    tempoRealizado: tempoRealizado,
                    qtdePrevista: qtdePrevista,
                    tipo: tipo ,
                    dataProd: dataProd,
                    orderFox: orderFox,
                    apontamento: apontamento,
                    components: components,
                    prodacabado: produtoacabado,
                    etapas: etapas
                } 
            }).then((result) => {
                //Caso consiga recuperar o model, ele atualiza a tela e para de carregar
                message.success('Apontamento salvo com sucesso!');
                let idEstab = result.data.establishments;
                let idProduct = result.data.orderProd;
                let idPartner = result.data.partner;
                result.data.establishments = {
                    id: idEstab
                }
                result.data.orderProd = {
                    id: idProduct
                }
                result.data.partner = {
                    id: idPartner
                }
                parent.setStateEdit(result.data)
                parent.leftListChild.current.fetchLeftList()
            },)
            .catch(function(error) { 
                // console.log(error);
                parent.setStateNew();
                message.error('Erro ao gravar registro, tente novamente mais tarde!');
            })
        }, 1000);
    }

    onCancel = () => {
        history.replace('/dashboard');
        document.location.reload(true);
    }

    
    onChangeCheck = event => {
        let newCateg = this.state.categ;
        newCateg["status"] = event.target.checked;
        this.setState({
            categ: newCateg
        });

    }
    
    onHandleClickDelete = () => {
        // console.log(this.state.model);
        let record = this.state.productOrder
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
            productOrder: {
                establishment:1,
                orderProd: '',
                partner: '',
                dataProd: '',
                dataFim:''
            },
            dataAux: '',
            dataFim: '',
            loading: false,
            isNew: true,
            refreshLeftList: false,
            tableSteps: [],
            tableComp: [],
            tableProdAcabado:[]
        });
    }
    //Seta o estado para edição
    setStateEdit = (model) => {
        console.log(model);
        let dataAux = moment(model.dataProd);
        let dataFim = moment(model.dataFim)
        model["prodAcabado"] = model.prodacabado[0].cod
        model["prodAcabadoDesc"] = model.prodacabado[0].description1
        model["establishment"] = model.establishments.id
        model["orderProd"] = model.orderProd.id
        model['partner'] = model.partner.id

        this.setState({ 
            canSave: true,
            canNew: true,
            canDelete: true,
            productOrder: model,
            loading: false,
            isNew: false,
            dataAux: dataAux,
            dataFim: dataFim,
            tableComp: model.components,
            tableSteps: model.etapas,
            tableProdAcabado: model.prodacabado
        });
    }
    

    handleChange(event) {
        let newOrder = this.state.productOrder;
        newOrder[event.target.name] = event.target.value;

        this.setState(() => ({
            productOrder: newOrder
        }))
    }

    LeftList = () => {
        return (
            <ListnoteProduction onClickRow={this.handleOnClickRow1  }  ref={this.leftListChild} />
        )
    }

    handleEstab = (event) => {
        let auxList = this.state.listofEstabs;
        let newProdOrder = this.state.productOrder;
        
        auxList.map( obj => {
            if(obj.id === event){
                newProdOrder["establishment"] = obj.id
                this.setState({
                    productOrder: newProdOrder 
                })
            }

            return(
                ''
            )
        });
    }
    handleProduct = (event) => {
        let auxList = this.state.listofProds;
        let newProdOrder = this.state.productOrder;
        let tabelaProduto =  [];

        auxList.map( obj => {
            if(obj.id === event){
                tabelaProduto.push(obj.product);
                console.log(tabelaProduto);
                newProdOrder["orderProd"] = obj.id
                newProdOrder["prodAcabado"] = obj.product.cod
                newProdOrder["prodAcabadoDesc"] = obj.product.description1
                newProdOrder["qtdePrevista"] = obj.qtde
                this.setState({
                    productOrder: newProdOrder,
                })

                this.setState({
                    tableComp: obj.components,
                    tableSteps: obj.etapas,
                    tableProdAcabado: tabelaProduto
                });
            }

            return(
                ''
            )
        });
    }

    handlePartner = (event) => {
        let auxList = this.state.listofPartner;
        let newProdOrder = this.state.productOrder;
        
        auxList.map( obj => {
            if(obj.id === event){
                newProdOrder["partner"] = obj.id
                this.setState({
                    productOrder: newProdOrder 
                })
            }

            return(
                ''
            )
        });
    }
    
    dataChange = (date, dataString) =>  {
        let newProdOrder = this.state.productOrder;
        let data1 = moment(dataString).format('DD-MM-YYYY');
        let data2 = moment(date).format('DD-MM-YYYY');
        console.log(data1, data2);
            newProdOrder["dataProd"] = dataString;
            this.setState({
                productOrder: newProdOrder 
            });

            this.setState({
                dataAux: date
            });
    }

    dataChangeFim = (date, dataString) =>  {
        let newProdOrder = this.state.productOrder;
        let data1 = moment(dataString).format('DD-MM-YYYY');
        let data2 = moment(date).format('DD-MM-YYYY');
        console.log(data1, data2);
            newProdOrder["dataFim"] = dataString;
            this.setState({
                productOrder: newProdOrder 
            });

            this.setState({
                dataFim: date
            });
    }
    
    handleSave = row => {
        const newData = [...this.state.tableComp];
        const index = newData.findIndex(item => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        console.log(newData);
        this.setState({tableComp: newData });
    };

      handleSaveSteps = row => {
        const newData = [...this.state.tableSteps];
        const index = newData.findIndex(item => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        console.log(newData);
        this.setState({tableSteps: newData });
      };

      handleTip = event => {
        // console.log(event);
         let newMachine = this.state.productOrder;
         newMachine["tipo"] = event;
         this.setState({
             productOrder: newMachine
         });
     }


    Content = (orderPro, estabs, products,partner) => {
        const components = {
            body: {
              row: EditRow,
              cell: EditableCell,
            },
          };
          const columnsKit = this.kitcolums.map(col => {
            if (!col.editable) {
              return col;
            }
            return {
              ...col,
              onCell: record => ({
                record,
                editable: col.editable,
                dataIndex: col.dataIndex,
                title: col.title,
                handleSave: this.handleSave,
              }),
            };
          });

          const columnsEtapas = this.etapascolums.map(col => {
            if (!col.editable) {
              return col;
            }
            return {
              ...col,
              onCell: record => ({
                record,
                editable: col.editable,
                dataIndex: col.dataIndex,
                title: col.title,
                handleSave: this.handleSaveSteps,
              }),
            };
          });

        return (
            <div className="main">
                <Row>
                    <Col lg={24} md={24} sm={24} xs={24}>
                        <Card type="inner" title="Apontamento de produção">
                            <Form layout="horizontal">
                                <Row>
                                    <Col lg={6} md={6} sm={12} xs={24}>
                                        <div className="gx-form-row0">
                                            <Form.Item label="Estabelecimento"> 
                                                <Select 
                                                showSearch
                                                value={orderPro.establishment} 
                                                // style={{ width: 250 }} 
                                                onChange={this.handleEstab} 
                                                filterOption={(inputValue, option) =>
                                                    // console.log(inputValue)
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
                                            </Form.Item>
                                        </div>
                                    </Col>

                                    <Col lg={6} md={6} sm={12} xs={24}>
                                        <div className="gx-form-row0">
                                            <Form.Item label="Ordem de produção">
                                                <Select 
                                                showSearch
                                                value={orderPro.orderProd} 
                                                // style={{ width: 250 }} 
                                                onChange={this.handleProduct} 
                                                filterOption={(inputValue, option) =>
                                                    // console.log(inputValue)
                                                    option.props.children[0].concat(option.props.children[1],option.props.children[2]).toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                                                    }
                                                >
                                                    {
                                                        products.map( e => {
                                                            return (
                                                            <Option value={e.id}>{e.orderProduction}</Option>
                                                            ) 
                                                        })
                                                    }
                                                </Select>
                                            </Form.Item>
                                        </div>
                                    </Col>

                                    <Col lg={6} md={6} sm={12} xs={24}>
                                        <div className="gx-form-row0">
                                            <Form.Item label="Pedido Venda">
                                                <Input 
                                                    type="text" 
                                                    value={orderPro.orderFox}
                                                    name="orderFox"
                                                    onChange={this.handleChange}
                                                />
                                            </Form.Item>
                                        </div>
                                    </Col>

                                    <Col lg={6} md={8} sm={12} xs={24}>
                                        <div className="gx-form-row0">
                                            <Form.Item label="Cliente">
                                                <Select
                                                    value={orderPro.partner} 
                                                    style={{ width: 160 }} 
                                                    onChange={this.handlePartner} >
                                                    {
                                                        partner.map( e => {
                                                            return (
                                                            <Option value={e.id}>{e.name} - {e.lastname}</Option>
                                                            ) 
                                                        })
                                                    }
                                                </Select>
                                            </Form.Item>
                                        </div>
                                    </Col>

                                    <Col lg={6} md={6} sm={12} xs={24}>
                                        <div className="gx-form-row0">
                                            <Form.Item label="Data Inicio">
                                                <DatePicker 
                                                    value={this.state.dataAux} 
                                                    locale={locale} 
                                                    onChange={this.dataChange} 
                                                />
                                            </Form.Item>
                                        </div>
                                    </Col>

                                    <Col lg={6} md={6} sm={12} xs={24}>
                                        <div className="gx-form-row0">
                                            <Form.Item label="Data fim">
                                                <DatePicker 
                                                    value={this.state.dataFim} 
                                                    locale={locale} 
                                                    onChange={this.dataChangeFim} 
                                                />
                                            </Form.Item>
                                        </div>
                                    </Col>

                                    <Col lg={6} md={6} sm={12} xs={24}>
                                        <div className="gx-form-row0">
                                            <Form.Item label="Apontamento">
                                                <Input 
                                                    type="text" 
                                                    value={orderPro.apontamento}
                                                    name="apontamento"
                                                    disabled={true}
                                                    onChange={this.handleChange}/
                                                >
                                            </Form.Item>
                                        </div>
                                    </Col>
                                    <Col lg={6} md={6} sm={12} xs={24}>
                                        <div className="gx-form-row0">
                                            <Form.Item label="Tipo">
                                                <Select value={orderPro.tipo}  onChange={this.handleTip} style={{ width: 160 }} >
                                                    <Option value={"programador"}>Programador</Option>
                                                    <Option value={"montagem"}>Montagem</Option>
                                                    <Option value={"operador"}>Operador</Option>
                                                </Select>
                                            </Form.Item>
                                        </div>
                                    </Col>                                   
                                </Row>
                            </Form>
                        </Card>

                        
                        <Card type="inner" title="Produto acabado">
                            <Row>
                                <Col lg={6} md={8} sm={12} xs={24}>
                                    <div className="gx-form-row0">
                                        Produto acabado : 
                                        <Form.Item>
                                            <Input 
                                                type="text" 
                                                style={{ width: 250 }} 
                                                value={orderPro.prodAcabado}
                                                name="prodAcabado"
                                                disabled={true}
                                                onChange={this.handleChange}
                                            />
                                        </Form.Item>
                                    </div>
                                </Col>

                                <Col lg={6} md={8} sm={12} xs={24}>
                                    <div className="gx-form-row0">
                                        Descrição : 
                                        <Form.Item>
                                            <Input 
                                                type="text" 
                                                value={orderPro.prodAcabadoDesc}
                                                name="prodAcabadoDesc"
                                                disabled={true}
                                                onChange={this.handleChange}
                                            />
                                        </Form.Item>
                                    </div>
                                </Col>

                                <Col lg={6} md={8} sm={12} xs={24}>
                                        <div className="gx-form-row0">
                                            Qtde prevista :
                                            <Form.Item>
                                            <Input 
                                                type="number" 
                                                value={orderPro.qtdePrevista}
                                                name="qtdePrevista"
                                                disabled={true}
                                                onChange={this.handleChange}
                                            />
                                        </Form.Item>
                                    </div>
                                </Col>

                                <Col lg={6} md={8} sm={12} xs={24}>
                                        <div className="gx-form-row0">
                                            Qtde realizada : 
                                            <Form.Item>
                                            <Input 
                                                type="number" 
                                                value={orderPro.qtdeRealizada}
                                                name="qtdeRealizada"
                                                onChange={this.handleChange}
                                            />
                                        </Form.Item>
                                    </div>
                                </Col>
                            </Row>
                        </Card>

                        <Card type="inner" title="Componentes" >
                            <Table
                                components={components}
                                rowClassName={() => 'editable-row'}
                                bordered
                                className="gx-table-responsive"
                                columns={columnsKit}
                                dataSource={this.state.tableComp}
                                size="small"
                                rowKey="id"
                                style={{margin: '-15px -24px'}}
                            />
                        </Card>
                        <Card type="inner" title="Tempo">
                            {/* <Row> */}
                                <Table
                                    components={components}
                                    rowClassName={() => 'editable-row'}
                                    bordered
                                    className="gx-table-responsive"
                                    columns={columnsEtapas}
                                    dataSource={this.state.tableSteps}
                                    size="small"
                                    rowKey="id"
                                    style={{margin: '-15px -24px'}}
                                />
                            {/* </Row> */}
                            <br /><br />
                            <Row>
                                <Col lg={6} md={8} sm={12} xs={24}>
                                    <div className="gx-form-row0">
                                        Tempo realizado
                                        <Form.Item>
                                            <Input 
                                                type="number" 
                                                value={orderPro.tempoRealizado}
                                                name="tempoRealizado"
                                                onChange={this.handleChange}
                                            />
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
        return(
            <Spin spinning={this.state.loading} tip={this.state.loadingTip}>
                <Row>
                    <Col lg={5} md={5} sm={24} xs={24}>
                        {/* <Card> */}
                            <ListnoteProduction onClickRow={this.handleOnClickRow1  }  ref={this.leftListChild} />
                        {/* </Card> */}
                    </Col>

                    <Col lg={15} md={15} sm={24} xs={24}>
                        {this.Content(this.state.productOrder,this.state.listofEstabs,this.state.listofProds, this.state.listofPartner)}
                    </Col>
                    <Col lg={4} md={4} sm={24} xs={24}>
                        <RightList 
                            title="Apontamento de Produção "
                            onHandleClickNew={this.onHandleClickNew}
                            onHandleClickSave={this.onHandleClickSave}
                            onHandleClickDelete={this.onHandleClickDelete}
                            canNew={this.state.canNew}
                            canSave={this.state.canSave}
                            canDelete={this.state.canDelete}
                        />
                    </Col>
                </Row>
            </Spin>
        )
    }


}

export default noteProduction
