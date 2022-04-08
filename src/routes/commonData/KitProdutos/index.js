import React, {Component} from 'react'
import {Row, Col, Card, Form, Input, Button, AutoComplete,message, Spin, Modal, InputNumber, Popconfirm, Table} from 'antd';
import history from '../../../util/history';
import ListKit from './ListKit'
import api from '../../../util/Api'
import SimpleReactValidator from 'simple-react-validator';

const model = 'Kit';
const model2 = 'product';
const { Option } = AutoComplete;

//let ObjetoTeste;
let isNovo = true;
let arrayofProd = [];
let auxToKnowRaz = false;
let getSpeProds = [];
let isEditando = false;

let data = [];

const EditableContext = React.createContext();

class EditableCell extends React.Component {

    constructor(props){
        super(props)

        this.state={
            listofProd: [],
            product: {}
        }

        // this.handleChange = this.handleChange.bind(this);

    }


  getInput = () => {
     
    if (this.props.inputType === 'number') {
      return <InputNumber type="number" style={{ width: 110 }} min={0}/>;
    }
    // if(this.props.title === 'Sequencia' || this.props.title ==='Prioridade'|| this.props.title === 'Qtde'){
    //     return <Input type="number" />;
    // }
   

    let dataProds = this.state.listofProd;
    if(this.props.title === 'Produto'){
        if(this.state.product.id === undefined  ){
            auxToKnowRaz = false;
        }else{
          //auxProduto = this.state.product;
            if(auxToKnowRaz === true){
                this.props.record.desc = ""
                this.props.record.unidade = ""
                this.props.record.produto = ""
                auxToKnowRaz = false;
            }else{
                this.props.record.desc = this.state.product.description1
                this.props.record.unidade = this.state.product.unity
                this.props.record.produto =  this.state.product.cod
                auxToKnowRaz = false;
                console.log(arrayofProd);
            }
            
        } 
        return(
        // <Select style={{ width: 400 }} onChange={this.handleChange} >
        //     {dataProds.map(objeto => {
        //         return(
        //         <Option value={objeto.id}>{objeto.cod}</Option>
        //         )
        //     })}
        // </Select>

          <AutoComplete
          style={{ width: 250 }}
          placeholder="input here"
          // onChange={this.handleProd}
          onSelect={this.testeSelect}
          filterOption={(inputValue, option) =>
            option.props.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
          }
          >
          {
          dataProds.map( e => {
            return(
            
            <Option key={e.id} value={e.cod}>{e.cod}
            </Option>
            )
          })
          }

          </AutoComplete>
        ) 
    }

    if(this.props.title === 'Descrição'){
        return(
            <Input style={{ width: 280 }} disabled={true}/>
        )
    }
    if(this.props.title === 'Unidade'){

      return <Input style={{ width: 60 }} disabled={true}/>
    }
   
   
    

    return <Input />;
  };

  testeSelect = (value, option) => {
    let listaux = this.state.listofProd;
    
    let keyProd = parseInt(option.key);
    listaux.map( obj => {
        if(obj.id === keyProd){
            this.setState({
                product: obj 
            });
        }
        return(
            ''
        )
    });
  }

    // handleChange(event){
    //     let listaux = this.state.listofProd;
    //     // eslint-disable-next-line
    //     listaux.map(aux => {
    //         if(aux.id === event){
    //             this.setState({
    //                 product: aux
    //             })
    //         }
    //     });
    // }
    componentWillMount(){
    this.getProducts();
    }

    getProducts(){
    api.get(`${model2}/`, {
    })
    .then((result) => {
        let dataProd = [];
        dataProd = result.data.data;
        
        this.setState({
            listofProd: dataProd
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

  renderCell = ({ getFieldDecorator }) => {
    const {
      editing,
      dataIndex,
      title,
      inputType,
      record,
      index,
      children,
      ...restProps
    } = this.props;
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item style={{ margin: 0 }}>
            {getFieldDecorator(dataIndex, {
              // rules: [
              //   {
              //     required: true,
              //     message: `Preencha os campos de ${title}!`,
              //   },
              // ],
              initialValue: record[dataIndex],
            })(this.getInput())}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };

  render() {
    return <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>;
  }
}


class EditableTable extends React.Component {
    constructor(props) {
      super(props);
      this.state = {  
        editingKey: '',
        isEditing: false, 
        count: 0, 
        listofProd: [],
        data: [],
        reload: 0
      };

      this.updateWindow = this.updateWindow.bind(this);

      this.columns = [
        {
          title: 'Sequencia',
          dataIndex: 'sequencia',
          width: '5%',
          editable: true,
        },
        {
          title: 'Prioridade',
          dataIndex: 'prioridade',
          width: '5%',
          editable: true,
        },
        {
          title: 'Produto',
          dataIndex: 'produto',
          width: '20%',
          editable: true,
        },

        {
            title: 'Descrição',
            dataIndex: 'desc',
            width: '70%',
            editable: true,
        },

        {
            title: 'Qtde',
            dataIndex: 'qtde',
            width: '50%',
            editable: true,
        },

        {
            title: 'Unidade',
            dataIndex: 'unidade',
            width: '20%',
            editable: true,
        },

        {
          title: 'operation',
          dataIndex: 'operation',

          render: (text, record) => {
            const { editingKey } = this.state;
            const editable = this.isEditing(record);

            console.log(editable);
           
            return editable ? (
              <span>
                <EditableContext.Consumer>
                  {form => (
                    // eslint-disable-next-line
                    <a
                      onClick={() => this.save(form, record.key)}
                      style={{ marginRight: 8 }}
                    >
                      Salvar
                    </a>
                  )}
                </EditableContext.Consumer>
                
                {/* <Popconfirm title="Sure to cancel?" onConfirm={() => this.cancel(record.key)}>
                   eslint-disable-next-line 
                  <a>Cancelar</a>
                </Popconfirm> */}
              </span>
            ) : (
            <div>

                <span>
                <EditableContext.Consumer>
                  {form => (
                    // eslint-disable-next-line
                    <a disabled={editingKey !== ''} onClick={() => this.edit(record.key)}>
                      Editar
                    </a>
                  )}
                </EditableContext.Consumer>


                <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDelete(record.key)}>
                
                {/* eslint-disable-next-line */}
                <a>  Excluir</a>
                </Popconfirm>
              </span>

          
            
            
            
            

            </div>
              

              
            );
          },
        },
      ];
    }


    handleDelete = key => {
        let dataSource;
        if(getSpeProds.length === 0 && isNovo === true){
          dataSource = arrayofProd;
        }else{
          dataSource = getSpeProds;
        }
        console.log(arrayofProd);
        console.log(dataSource);
        data = dataSource.filter(item => item.key !== key)
        

       
        //this.setState({ data: dataSource.filter(item => item.key !== key) });

        // eslint-disable-next-line
        arrayofProd.map( aux => {
            if(aux.key === key){
                var index = arrayofProd.indexOf(aux);
                if ( index > -1) {
                    arrayofProd.splice(index, 1);
                  }
            }

        });
        
        this.setState({
          reload: 1
        });
       
        //arrayofProd.splice(key);
    };

    handleAdd = () => {
        let newlist;
        const { count } = this.state;
        let newData;

        if(getSpeProds.length === 0 && isNovo === true){
          newlist = arrayofProd;
           newData = {
            key: count,
            sequencia: `${count}`,
            prioridade: 0,
            produto: ``,
            desc: ``,
            qtde: 0,
            unidade: ``, 
          };

        }else{
          newlist = getSpeProds;
          let last = newlist[newlist.length - 1]
          
          console.log(last);


          newData = {
            key: last === undefined ? 1 : last.key + 1,
            sequencia: `${last === undefined ? 1 : last.key + 1}`,
            prioridade: 0,
            produto: ``,
            desc: ``,
            qtde: 0,
            unidade: ``, 
          };

        }
        
        
        
        
        newlist = [...newlist, newData];
        data = newlist;
        console.log(newlist);
        console.log(data);
        this.setState({
          count: count + 1
        });

        arrayofProd.push(newData);

        
      };
  
    isEditing = record => record.key === this.state.editingKey;
  
    cancel= (teste) => {
      let datalist;
      if(getSpeProds.length === 0 && isNovo === true ){
        datalist = data;
      }else{
        datalist = getSpeProds;
      }


        
        // eslint-disable-next-line
        datalist.map(auxiliar => {
            if(auxiliar.key === teste){
                
                //let objindex = datalist.findIndex(auxiliar);

                auxiliar.sequencia = auxiliar.sequencia === 0 ? 0 : auxiliar.sequencia 
                auxiliar.prioridade = auxiliar.prioridade === 0 ? 0 : auxiliar.prioridade
                auxiliar.produto = auxiliar.produto === "" ? "" : auxiliar.produto
                auxiliar.desc = auxiliar.desc === "" ? "" : auxiliar.desc
                auxiliar.qtde = auxiliar.qtde === 0 ? 0 : auxiliar.qtde
                auxiliar.unidade = auxiliar.unidade === "" ? "" : auxiliar.unidade 

                
                
                datalist[teste] = auxiliar;
                data = datalist

                
                this.setState({
                  reload: 1
                });
                // this.setState({data: datalist});
                auxToKnowRaz = true;
            }
        });
      console.log(teste);
      this.setState({ editingKey: '' });

      
      this.setState({
        reload: 0
      });

    };

  
    save(form, key) {
      let newData;
        console.log(form, key);
      form.validateFields((error, row) => {
        console.log(row);
        if (error) {
          return;
        }
        if(getSpeProds.length === 0 ){
          newData = [...data];
        }else{
          newData = [...getSpeProds];
        }
        if(row.produto === ""){
          row.produto = ""
        }else{
          // row.produto = auxProduto.cod
        }
        const index = newData.findIndex(item => key === item.key);
        if (index > -1) {
          const item = newData[index];
          
          newData.splice(index, 1, {
            ...item,
            ...row,
          });
          data = newData;
          arrayofProd = data;
          if(isNovo === false){
            getSpeProds =  data;
          }
          this.setState({  editingKey: '' });
        } else {
          newData.push(row);
          data =  newData;
          
          
          this.setState({  editingKey: '' });
        }
      });
    }
  
    edit(key) {
      this.setState({ editingKey: key,
        isEditing: true});

        isEditando = true;
    }

    componentDidUpdate(prevProps, prevState,snapshot){
      console.log(this);
      console.log(getSpeProds);
      console.log(arrayofProd);
      // console.log(getSpeProds, isNovo,this.state.data, prevProps, prevState,snapshot);
      if(isNovo === true && arrayofProd.length === 0 ){
        
        arrayofProd = [];
        getSpeProds = [];
        data = [];

        if(prevState.count !== 0 ){
          this.setState({
            count: 0
          });
          this.setState({
            editingKey: ''
          })
        }
        

        if(prevState.reload === 0){
          this.updateWindow();
        }
      }

      

      if(prevState.editingKey !== "" && isEditando !== true ){
        this.setState({
          editingKey: ''
        })
      }
    }

    componentWillMount(){
        arrayofProd = [];
        getSpeProds = [];
        data = [];
    }

    
    

    updateWindow = () => {
      this.setState({
        reload: !this.state.reload,
      });
      // window.location.reload();
    }

    

    render() {
      const components = {
        body: {
          cell: EditableCell,
        },
      };
  
      const columns = this.columns.map(col => {
        if (!col.editable) {
          return col;
        }
        return {
          ...col,
          onCell: record => ({
            record,
            inputType: col.dataIndex === 'sequencia' || col.dataIndex === 'prioridade' || col.dataIndex === 'qtde'  ? 'number' : 'text',
            dataIndex: col.dataIndex,
            title: col.title,
            editing: this.isEditing(record),
          }),
        };
      });
      return (
        <EditableContext.Provider value={this.props.form}>

        <Button  onClick={this.handleAdd}  type="primary" style={{ marginBottom: 16 }}>
          Adicionar Produto
        </Button>

        {this.state.reload === 1 ? 
        <Table
        components={components}
        bordered
        dataSource={getSpeProds.length === 0 && isNovo === true ? data : getSpeProds}
        columns={columns}
        rowClassName="editable-row"
        pagination={{
          onChange: this.cancel,
        }}
        /> : 

      <Table
            components={components}
            bordered
            dataSource={getSpeProds.length === 0 && isNovo === true ? arrayofProd : getSpeProds}
            columns={columns}
            rowClassName="editable-row"
            pagination={{
              onChange: this.cancel,
            }}
          />
        }
          
    
        </EditableContext.Provider>
      );
    }
  }


const EditableFormTable = Form.create()(EditableTable);

class KitProdutos extends Component {

    constructor() {
        super()
        this.state = {            
            isNew: true,
            loader: true,
			kitProd:{
              product: ''
            },
			canNew: true,
			canSave: true,
            canDelete: false,
            loading: false,
            listofEstabs: [],
            listofProds: [],
            listteste: []
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleTip =  this.handleTip.bind(this);
        this.setStateNew = this.setStateNew.bind(this);
        this.onHandleClickSave = this.onHandleClickSave.bind(this);
        
        this.onHandleClickDelete = this.onHandleClickDelete.bind(this);
        this.onHandleClickNew = this.onHandleClickNew.bind(this);
        // this.handleSubmit = this.handleSubmit.bind(this);
        this.validator = new SimpleReactValidator({locale: 'pt', messages:{default: `:attribute não pode estar vazio`}});

        this.leftListChild = React.createRef()
 

    }

    isEditing = record => record.key === this.state.editingKey;

    cancel = () => {
      this.setState({ editingKey: '' });
    };
  
    save(form, key) {
      form.validateFields((error, row) => {
        if (error) {
          return;
        }
        const newData = [...this.state.data];
        const index = newData.findIndex(item => key === item.key);
        if (index > -1) {
          const item = newData[index];
          newData.splice(index, 1, {
            ...item,
            ...row,
          });
          this.setState({ data: newData, editingKey: '' });
        } else {
          newData.push(row);
          this.setState({ data: newData, editingKey: '' });
        }
      });
    }
  
    edit(key) {
      this.setState({ editingKey: key });
    }

    //******************************************************************************************8*/
 
    
    onHandleClickNew = () => {
        this.setStateNew()
    }

    componentWillMount(){
        //this.getEstabs();
        this.getProds();
    }

    // getEstabs(){
    //     api.get(`${model2}`, {
    //     })
    //     .then((result) => {
    //         let dataEstab = [];
    //         dataEstab = result.data;
            
    //         this.setState({
    //             listofEstabs: dataEstab
    //         });
    //         //Caso consiga recuperar o model, ele atualiza a tela e para de carregar
    //         // console.log(result.data.adresses);
    //         // console.log(result.adresses);
    //         // message.success('Cliente carregado com sucesso!');
    //         // parent.setStateEdit(result.data)
    //     },)
    //     .catch(function(error) { 
    //         console.log(error);
    //         // message.error('Erro ao buscar registro, tente novamente mais tarde!');
    //         // parent.setStateNew()
    //     })
    // }

    getProds(){
      api.get(`${model2}`, {
      })
      .then((result) => {
          let dataprod = [];
          dataprod = result.data.data;
          
          this.setState({
              listofProds: dataprod
          });
      },)
      .catch(function(error) { 
          console.log(error);
      })
    }

    handleOnClickRow1 = (record, rowIndex) => {
        var parent = this
        isEditando =  false;
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
                    // console.log(result.adresses);
                    message.success('Kit carregado com sucesso!');
                    if(result.data.product === null){
                      result.data.product = {}
                    }
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
          let record = this.state.kitProd;
          var parent = this;
          
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
              const { name, qtdebase, unity,product } = record;
              api(
                  {
                  method: METHOD,
                  url: URL,
                  data:
                  {
                      cod: product.cod,
                      product: product.id,
                      name: name,
                      qtdebase: qtdebase,
                      unity: unity,
                      products: arrayofProd
                  } 
              }).then((result) => {
                  //Caso consiga recuperar o model, ele atualiza a tela e para de carregar
                  message.success('Kit salvo com sucesso!');
                  console.log(result.data);
                  parent.setStateEdit(result.data)
                  parent.leftListChild.current.fetchLeftList()
              },)
              .catch(function(error) { 
                  console.log(error);
                  parent.setStateNew();
                  if(error.response.data.error.status === 500){
                    message.error('Este produto ja tem um Kit cadastrado no sistema, Tente Novamente')
                  }else{
                    message.error('Não foi possivel cadastrar, Tente Novamente');
                  }
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
        let record = this.state.kitProd
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
        console.log(getSpeProds,arrayofProd);
        isNovo =  true;
        getSpeProds = [];
        arrayofProd = [];
        this.setState({ 
            canSave: true,
            canNew: true,
            canDelete: false,
            kitProd: {
              product:''
            },
            loading: false,
            isNew: true,
            refreshLeftList: false
        });
    }

    //Seta o estado para edição
    setStateEdit = (model) => {
        
        model.product = model.productObj;
        isNovo = false;
        getSpeProds = model.products;
        arrayofProd = model.products;
        // model.establishments = model.establishments.id;
        this.setState({ 
            canSave: true,
            canNew: true,
            canDelete: true,
            kitProd: model,
            loading: false,
            isNew: false
        });
    }
    

    handleChange(event) {
        let newKitprod = this.state.kitProd;
        newKitprod[event.target.name] = event.target.value;

        this.setState(() => ({
            kitProd: newKitprod
        }))
    }

    LeftList = () => {
        return (
            <ListKit onClickRow={this.handleOnClickRow1  }  ref={this.leftListChild} />
        )
    }

    teste(){
        console.log(arrayofProd);
        console.log(data);
    }


    handleTip(event){
        console.log(event);
        let newMachine = this.state.machine;
        newMachine["type"] = event;
        this.setState({
            machine: newMachine
        });
    }

    // handleProd = (event) =>{
    //   console.log(event);
    //   let auxList = this.state.listofProds;
    //   let newstepXprod = this.state.kitProd;
      
    //   auxList.map( obj => {
    //       if(obj.id === event){
    //           newstepXprod["product"] = obj.id
    //           this.setState({
    //               kitProd: newstepXprod 
    //           })
    //       }

    //       return(
    //           ''
    //       )
    //   });
    // }

    testeSelect = (value, option) => {
      let auxList = this.state.listofProds;
      let newstepXprod = this.state.kitProd;
      
      let keyProd = parseInt(option.key);
      auxList.map( obj => {
          if(obj.id === keyProd){
              newstepXprod["product"] = obj
              newstepXprod["name"] = obj.description1
              newstepXprod["unity"] = obj.unity

              this.setState({
                  kitProd: newstepXprod 
              });

          }

          return(
              ''
          )
      });
    }

    onSearch = searchText => {
        console.log(searchText);
    }

    changeValue = event => {
      this.setState({
        kitProd: {
          product: {
            cod: event
          }
        }
      })
    }

    Content = (kit,prods) => {
        return (
            <div className="main">
              <Row>
                <Col span={24}>
					<Form layout="horizontal">
                  		<Card type="inner" title="Cadastro de Árvore Kit">
                        	<Row>
                          		<Col lg={12} md={12} sm={12} xs={24}>
                              		<div className="gx-form-row0">
                        				<Form.Item label="Produto" required={true} >
											<AutoComplete
													//   style={{ width: 400 }}
													//placeholder={this.state.kitProd.product.cod}
													value={kit.product.cod}
													onChange={this.changeValue}
													allowClear={true}
													onSelect={this.testeSelect}
													filterOption={(inputValue, option) =>
														option.props.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
													}
											>
												{
												prods.map( e => {
													return (
													<Option key={e.id} value={e.cod}>{e.cod}</Option>
													) 
												})}
                              				</AutoComplete> 
                                      {this.validator.message('cod', kit.product.cod, 'required|string',{ className: 'text-danger' })}
										</Form.Item>
									</div>
								</Col>
								<Col lg={12} md={12} sm={12} xs={24}>
									<div className="gx-form-row0">
										<Form.Item label="Descrição ">
											<Input 
													type="text"
													// style={{ width: 300 }} 
													value={kit.name} 
													name="name"
													disabled={true}
													onChange={this.handleChange}/>
										</Form.Item>
									</div>
								</Col>
								<Col lg={6} md={6} sm={12} xs={24}>
									<div className="gx-form-row0">
										<Form.Item label="Qtde base" required={true} >
											<Input 
												type="number" 
												value={kit.qtdebase} 
												name="qtdebase"
												onChange={this.handleChange}/>
                        {this.validator.message('qtdebase', kit.qtdebase, 'required|alpha_num',{ className: 'text-danger' })}
										</Form.Item>
									</div>
								</Col>
								<Col lg={6} md={6} sm={12} xs={24}>
									<div className="gx-form-row0">
										<Form.Item label="Unidade">
											<Input 
													type="text" 
													value={kit.unity}
													disabled={true} 
													name="unity"
													onChange={this.handleChange}/>
										</Form.Item>
									</div>
								</Col>
                      		</Row>
                		</Card>
					</Form>

                	<Card type="inner" title="Componentes">
                  		<div style={{overflowX: "auto"}}>
                    		<EditableFormTable />
                  		</div>
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
                  {this.Content(this.state.kitProd,this.state.listofProds)}
                </Col>

                <Col lg={4} md={4} sm={24} xs={24}>
                  <Card type="inner" title="Árvore Kit">
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

export default KitProdutos
