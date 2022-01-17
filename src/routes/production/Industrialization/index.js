import React, {Component} from 'react'
import {Row, Col, Card, Form,Input, message, Spin, Modal,  Select, DatePicker, Table} from 'antd'
import history from '../../../util/history';
import locale from 'antd/es/date-picker/locale/pt_BR';
import ListOrdemPro from './listInd';
import RightList from '../../../components/RightList'
import api from '../../../util/Api'
import EditRow from '../prodOrder/EditRow'

import {EditableCell} from '../prodOrder/EditRow'
// import IntlMessages from "../../../util/IntlMessages";
import moment from 'moment';
//import {getUser} from "../../../appRedux/actions/Auth";
//const Panel = Collapse.Panel;
const { Option } = Select;
const model = 'Industrialization';
const model2 = 'establishment';
const model3 = 'product';
const model4 = 'partner'
//const TabPane = Tabs.TabPane
// const FormItem = Form.item
// const customPanelStyle = {
//     borderRadius: 4,
//     border: 0,
//     overflow: 'hidden'
// };




// const menu = (
// 	<Menu>
// 	  <Menu.Item key="1">Imprimir</Menu.Item>
// 	  <Menu.Item key="2">Anexos</Menu.Item>
// 	</Menu>
// );

class Industrialization extends Component {
    
    constructor(props) {
        super(props)
        this.state = {            
            isNew: true,
            loader: true,
			productOrder: {
                establishment: 1,
                product: '',
                partner: '',
                dataProd: ''

            },
            dataAux: '',
			canNew: true,
			canSave: true,
            canDelete: false,
            loading: false,
            listofEstabs: [],
            listofProds: [],
            listofPartner: [],
            tableSteps: [],
            tableComp: [],
            tableCompFixa: []
        }

        this.kitcolums = [

            {
                title: 'Sequencia',
                dataIndex:'sequencia',
                key: 'sequencia',
                editable: true
            },
            {
                title: 'Prioridade',
                dataIndex:'prioridade',
                key: 'prioridade',
                editable: true
            },
            {
                title: 'Produto',
                dataIndex:'produto',
                key: 'produto',
                editable: true
            },
            {
                title: 'Descrição ',
                dataIndex:'desc',
                key: 'desc',
                editable: true
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
                key: 'unidade',
                editable: true
            },
            {
                title: 'Qtde enviada',
                dataIndex:'qtdeEnviada',
                key: 'qtdeEnviada',
                editable: true
            },

            {
                title: 'Qtde retorno',
                dataIndex:'qtdeRetorno',
                key: 'qtdeRetorno',
                editable: true
            },

            {
                title: 'Falta retorno',
                dataIndex:'faltaRetorno',
                key: 'faltaRetorno',
                editable: true
            },

        ]

    

        this.handleChange = this.handleChange.bind(this);
        this.setStateNew = this.setStateNew.bind(this);
        this.onHandleClickSave = this.onHandleClickSave.bind(this);
        
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
        this.getProducts();
        this.getPartner();
    }

    getProducts(){
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
                    // console.log(result.data.adresses);
                    // console.log(result.adresses);
                    message.success('Registro carregada com sucesso!');
                    parent.setStateEdit(result.data);
                },)
                .catch(function(error) { 
                    // console.log(error);
                    message.error('Erro ao buscar registro, tente novamente mais tarde!');
                    parent.setStateNew()
                })
        }, 1000);
        
    }

    onHandleClickSave = () => {
        // console.log(this.state.model);
        let record = this.state.productOrder;
        var parent = this;
        let components = this.state.tableComp;

        this.setState({
            loading:true,
            loadingTip: 'Salvando registro, aguarde...',
        })

        console.log(record);
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
            const {dataProd,establishment,partner,product,status, unity, description} = record;
            
            api(
                {
                method: METHOD,
                url: URL,
                data:
                {
                    establishments: establishment,
                    product: product,
                    unity: unity,
                    description: description,
                    terceiro: partner,
                    data: dataProd,
                    status: status,
                    components: components 
                } 
            }).then((result) => {
                //Caso consiga recuperar o model, ele atualiza a tela e para de carregar
                message.success('Registro salva com sucesso!');
                console.log(result);
                if(result.config.method === "post"){
                let idEstab = result.data.establishments;
                let idProduct = result.data.product;
                let idPartner = result.data.terceiro;
                result.data.establishments = {
                    id: idEstab
                }
                result.data.product = {
                    id: idProduct
                }
                result.data.terceiro = {
                    id: idPartner
                }
                }
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
                product: '',
                partner: '',
                dataProd: ''
            },
            dataAux: '',
            loading: false,
            isNew: true,
            refreshLeftList: false,
            tableSteps: [],
            tableComp: []
        });
    }
    //Seta o estado para edição
    setStateEdit = (model) => {
        console.log(model);
        let dataAux = moment(model.data);
        model["establishment"] = model.establishments.id
        model["product"] = model.product.id
        model['partner'] = model.terceiro.id

        console.log(model);
        this.setState({ 
            canSave: true,
            canNew: true,
            canDelete: true,
            productOrder: model,
            loading: false,
            isNew: false,
            dataAux: dataAux,
            tableComp: model.components,
            tableSteps: model.etapas
        });
    }
    

    handleChange(event) {
        let newOrder = this.state.productOrder;
        newOrder[event.target.name] = event.target.value;
        
        this.setState(() => ({
            productOrder: newOrder
        }))

        // if(event.target.name === "qtde"){
        //     let table = this.state.tableComp;
        //     let table2 = [this.state.tableCompFixa];
        //     let obj = {}
        //     let inicialValues = [];
            
        //     inicialValues.push([...table2]);
        //     console.log(table2);
            
        //      table.forEach(comp => {
                 
        //         comp.qtde = comp.qtde * event.target.value
        //         //  inicialValues.push(comp.qtde);

        //      });




        //      console.log(inicialValues);
        // }
    }


    LeftList = () => {
        return (
            <ListOrdemPro onClickRow={this.handleOnClickRow1  }  ref={this.leftListChild} />
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


        auxList.map( obj => {
            if(obj.id === event){
                console.log(obj);
                newProdOrder["product"] = obj.id
                newProdOrder["description"] = obj.description1
                newProdOrder["unity"] = obj.unity
                let compJSON = JSON.stringify(obj.kit);
                let stepsJSON = JSON.stringify(obj.stepXprod);

                let comp = JSON.parse(compJSON);
                let step = JSON.parse(stepsJSON);

                this.setState({
                    productOrder: newProdOrder
                });

                if(comp.length === 0 ){
                    this.setState({
                        tableComp: []
                    })
                }else{
                    comp[0].products.qtdeEnviada = 0
                    comp[0].products.qtdeRetorno = 0
                    comp[0].products.faltaRetorno = 0
                    this.setState({
                        tableComp: comp[0].products
                    });
                    this.setState({
                        tableCompFixa: comp[0].products
                    });

                }

                if(step.length === 0 ){
                    this.setState({
                        tableSteps: []
                    })
                }else{
                    this.setState({
                        tableSteps: step[0].steps
                    })
                }
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
        console.log(event);
        let newMachine = this.state.productOrder;
        newMachine["status"] = event;
        this.setState({
            productOrder: newMachine
        });
    }


    Content = (orderPro, estabs, products,partner) => {
        console.log(orderPro);

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



        return (
            <div className="main" >
                <Row>
                    <Col span={24}>
                        <Card type="inner" title="Industrialização">
                            <Form layout="horizontal">
                                <Row>
                                    <Col lg={4} md={8} sm={12} xs={24}>
                                        <div className="gx-form-row0">
                                            <Form.Item label="Ordem Industrialização">
                                                <Input 
                                                    type="text" 
                                                    value={orderPro.ordInd}
                                                    name="ordInd"
                                                    disabled={true}
                                                    onChange={this.handleChange}
                                                />
                                            </Form.Item>
                                        </div>
                                    </Col>
                                    <Col lg={4} md={8} sm={12} xs={24}>
                                        <div className="gx-form-row0">
                                            <Form.Item label="Cliente">
                                                <Select value={orderPro.partner} style={{ width: 160 }} onChange={this.handlePartner} >
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
                                    <Col lg={6} md={8} sm={12} xs={24}>
                                        <div className="gx-form-row0">
                                            <Form.Item label="Estabelecimiento">
                                                <Select 
                                                    value={orderPro.establishment} 
                                                    style={{ width: 250 }} 
                                                    onChange={this.handleEstab} 
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
                                    <Col lg={4} md={8} sm={12} xs={24}>
                                        <div className="gx-form-row0">
                                            <Form.Item label="Data de produção">
                                                <DatePicker 
                                                    value={this.state.dataAux} 
                                                    locale={locale} 
                                                    onChange={this.dataChange} 
                                                />
                                            </Form.Item>
                                        </div>
                                    </Col>
                                    <Col lg={4} md={8} sm={12} xs={24}>
                                        <div className="gx-form-row0">
                                            <Form.Item label="Status"> 
                                                <Select value={orderPro.status}  onChange={this.handleTip} style={{ width: 200 }} >
                                                    <Option value={"aberto"}>Aberto</Option>
                                                    <Option value={"enviado"}>Enviado</Option>
                                                    <Option value={"fechado"}>Fechado</Option>
                                                </Select>
                                            </Form.Item>
                                        </div>      
                                    </Col>
                                </Row>
                            </Form>
                        </Card>
                
                        <Card type="inner" title="Produto resultante">
                            <Row>
                            <Col lg={8} md={8} sm={12} xs={24}>
                                <div className="gx-form-row0">
                                    <Form.Item label="Produto industrializado"> 
                                        <Select
                                            showSearch 
                                            value={orderPro.product} 
                                            style={{ width: 350 }} 
                                            onChange={this.handleProduct} 
                                            filterOption={(inputValue, option) =>
                                                option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                                            }
                                        >
                                            {
                                                products.map( e => {
                                                    return (
                                                    <Option value={e.id}>{e.cod}</Option>
                                                    ) 
                                                })
                                            }
                                        </Select>
                                    </Form.Item>
                                </div>
                            </Col>
                            <Col lg={4} md={8} sm={12} xs={24}>
                                <div className="gx-form-row0">
                                    <Form.Item label="Descrição">
                                        <Input 
                                            type="text" 
                                            value={orderPro.description}
                                            disabled={true}
                                            name="description"
                                            onChange={this.handleChange}
                                        />
                                    </Form.Item>
                                </div>
                            </Col>
                            <Col lg={4} md={8} sm={12} xs={24}>
                                <div className="gx-form-row0">
                                    <Form.Item label="Unidade">
                                        <Input 
                                            type="text" 
                                            value={orderPro.unity}
                                            name="unity"
                                            disabled={true}
                                            onChange={this.handleChange}
                                        />
                                    </Form.Item>
                                </div>
                            </Col>
                            </Row>
                        </Card>
                        
                        <Card type="inner" title="Componentes">
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
                    </Col>
                </Row>
            </div>
        )
    } 

    render() {
        return(
            <Spin spinning={this.state.loading} tip={this.state.loadingTip}>
                <Row>
                    <Col span={5}>
                        {this.LeftList()}
                    </Col>

                    <Col span={15}>
                        {this.Content(this.state.productOrder,this.state.listofEstabs,this.state.listofProds, this.state.listofPartner)}
                    </Col>
                    <Col span={4}>
                        <RightList 
                            title="Industrialização"
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

export default Industrialization
