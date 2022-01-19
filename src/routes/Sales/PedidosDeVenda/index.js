import React, {  useState ,useMemo, useRef} from 'react';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  message,
  Spin,
  Modal,
  Select,
  DatePicker,
  Button,
  Table
} from 'antd';
import SimpleReactValidator from 'simple-react-validator';
import ListUsers from './ListPedidoDeVenda';
import RightList from 'components/RightList';
import api from 'util/Api';
import apiAdonis from 'util/ApiAdonis'
import moment from 'moment';
import locale from 'moment/locale/pt-br';
import AddLinhaPedido from './addLinhaPedido';
import { useForm, Controller } from "react-hook-form";

let lodash = require("lodash"); 
const { TextArea } = Input;
const { Option } = Select;
//const model2 = 'linsalesorder'
const model3 = 'product'
const model = 'salesorder';
const model4 = 'partner';
const model1 = 'orderprod';

function PedidoVen() {
  const [loading, setLoading] = useState(false);
  const [loadingTip, setLoadingTip] = useState('');
  const [pdVenda, setPdVenda] = useState({});
  const [listOfPartner, setListPartner] = useState([]);
  const [canNew, setCanNew] = useState(true)
  const [canSave, setCanSave] = useState(true)
  const [canDelete, setCanDelete] = useState(false)
  const [isNew, setIsNew] = useState(true)
  const [isEditingAfterCreated, setisEditingAfterCreated] = useState(false)
  const [isEditingBeforeCreated, setisEditingBeforeCreated] = useState(false)
  const [, forceUpdate] = useState();
  const { handleSubmit, control } = useForm();
  const [modalAddLinha,setModalAddLinha] = useState(false);
  const [linhaPd, setLinhaPd] = useState({});
  const [loadingEtapa,setLoadingEtapa ] = useState(false);
  //const [linhasPedidos , setlinhasPedidos] = useState([]);
  const [fetchingPartner, setFetchingPartner] = useState(false);
  const [fetchingProduct, setFetchingProduct] = useState(false);
  const [fetchingOrderProd, setFetchingOrderProd] = useState(false);

  //const [flagButtonLin, setflagButtonLin] = useState(true);
  const [listOfOrders, setListOrders] = useState([]);
  const [listofProducts, setListProducts] = useState([]);
  const [listLin,setListLin] = useState([]);
  const validator = useRef(new SimpleReactValidator({ messages: { default: `:attribute não pode estar vazio` }}));
  const leftListChild = useRef( React.createRef );



  const  columnsLinhaPedido = [
    {
      title: 'Linha',
      dataIndex: 'id',
      key: 'id'
    },
    {
      title: 'Pedido Cliente',
      dataIndex: 'lin_pedido_cliente',
      key: 'lin_pedido_cliente'
    },
    {
      title: 'Pedido Fox',
      dataIndex: 'lin_pedido_fox',
      key: 'lin_pedido_fox'
    },
    {
        title: 'Ordem de Produção',
        dataIndex: 'orderprod.orderProduction',
        key: ''
      },
    {
      title: 'Produto',
      dataIndex: 'productObj.cod',
      key: 'produto'
    },
    {
      title: 'CFOP',
      dataIndex: 'cfop',
      key: 'cfop'
    },
    {
      title: 'Data Entrega',
      dataIndex: 'data_entrega',
      key: 'data_entrega',
      render: (text,record) => moment(record.data_entrega).format('DD-MM-YYYY')
    },
    {
      title: 'Data Prevista',
      dataIndex: 'data_prevista',
      key: 'data_prevista',
      render: (text,record) => moment(record.data_prevista).format('DD-MM-YYYY')
    },
    {
        title: 'Quantidade Produzida',
        dataIndex: 'qty_produzida',
        key: 'qty_produzida'
    },
    {
      title: 'Produto Cliente',
      dataIndex: 'produto_cliente',
      key: 'produto_cliente'
    },
    {
      title: 'Ações',
      key: 'action',
      render: (text, record) => (
        <div>
          &nbsp;
          <i
            className="icon icon-trash"
            style={{ marginRight: '10px' }}
            onClick={(e) => {
              Modal.confirm({
                title: 'Tem certeza que deseja remover esta linha ?',
                onOk() {
                  
                  isNew === true ? deleteOnNew(record) : handleDeleteLinRow(record);
                  message.success('Linha removida');
                },
                onCancel() {},
              });
            }}
          />
          
          &nbsp;
          <i
            className="icon icon-edit"
            style={{ marginRight: '10px' }}
            onClick={(e) => {
              Modal.confirm({
                title: 'Tem certeza que deseja editar esta linha ?',
                onOk() {
                  handleEditRow(record);
                },
                onCancel() {},
              });
            }}
          />
        </div>
      ),
    }
  ]

  const inputHandle = (event) => {
    const { name, value } = event.target
    setPdVenda((prevState) => ({
       ...prevState,
       [name]: value
    }));
  }


  const inputHandleLinha = (event) => {
    const { name, value } = event.target
    setLinhaPd((prevState) => ({
       ...prevState,
       [name]: value
    }));
  }

  const handleSelect = (event,props) => {
    let auxList;
    let findCli;
    // eslint-disable-next-line
    switch(props.name){
      case 'partner_id':
        auxList  = listOfPartner
    
        findCli = auxList.find(obj => obj.id === event);

        if(findCli){
          setPdVenda((prevState) => ({
            ...prevState,
            'partner_id': findCli.id,
            'partner': {name: findCli.name , id: findCli.id}
          }));
        }

      break;

      case 'orderprod_id':
        auxList  = listOfOrders
    
        findCli = auxList.find(obj => obj.id === event);

        if(findCli){
          setLinhaPd((prevState) => ({
            ...prevState,
            'orderprod_id': findCli.id,
            'orderprod': {orderProduction: findCli.orderProduction}
          }));
        }
      break;

      case 'product_id':
        auxList  = listofProducts
    
        findCli = auxList.find(obj => obj.id === event);

        if(findCli){
          setLinhaPd((prevState) => ({
            ...prevState,
            'product_id': findCli.id,
            'productObj':  {cod: findCli.cod },
            'unidade': findCli.unity
          }));
        }
      break;  
      
      case 'status':
      case 'tipo_registro':
        setPdVenda((prevState) => ({
          ...prevState,
          [props.name]: event
        }));
      break;

      case 'tipo_produto':
        setLinhaPd((prevState) => ({
          ...prevState,
          'tipo_produto': event
        }));
      break;
    }
  };

  const handleDatePicker = (data, dataString, props)  => {
    if(props.name === "data_entrega" || props.name === "data_prevista"){
      setLinhaPd((prevState) => ({
        ...prevState,
        [props.name]: data
      }));
    }else{
      setPdVenda((prevState) => ({
        ...prevState,
        [props.name]: data
      }));
    }
  }

  const onSubmit = data => {
    console.log(data);
  } 

  async function handleDeleteLinRow(record) {
    try {
      let METHOD = 'DELETE';
      let URL = `linsalesorder/${record.id}`;

      const deleteRow = await apiAdonis({
        method: METHOD,
        url: URL,
      });

      if(deleteRow){
        const updateRow = await apiAdonis({
          method: 'GET',
          url: `salesorder/${record.num_salesorder}`
        });

        if(updateRow){
          setStateEdit(updateRow.data[0]);
        }
      }
    } catch (error) {
      message.error(error);
    }
  }

  function deleteOnNew(record) {
      const lins = listLin.filter((item) => item.key !== record.key);
      setListLin(lins);
  }

  function handleEditRow(record) {
    if(isNew === true){
      setisEditingBeforeCreated(true);
    }else{
      setisEditingAfterCreated(true);
      setisEditingBeforeCreated(false)
    }
    try {
      record.data_entrega = moment(record.data_entrega);
      record.data_prevista = moment(record.data_prevista);

      setLinhaPd(record);
      
      setLoadingEtapa(false);
      setModalAddLinha(true)
    } catch (error) {
      message.error(error);
    }
  }

  async function EditLinPd (data,validator1) {
    if (validator1.current.allValid()) {
      setLoadingEtapa(true);

      const METHOD = 'PATCH';
      const URL = `linsalesorder/${linhaPd.id}`;
  
      const { data_entrega, data_prevista, cfop, lin_pedido_cliente, lin_pedido_fox, qty_produzida, tipo_produto, obs, produto_cliente
      } = linhaPd;
      const {orderprod_id, product_id} = linhaPd;
  
      try {
        const updateRecord = await apiAdonis({
          method: METHOD,
          url: URL,
          data: {
            data_entrega: data_entrega,
            data_prevista: data_prevista,
            cfop: cfop,
            lin_pedido_fox: lin_pedido_fox,
            produto_cliente: produto_cliente,
            lin_pedido_cliente: lin_pedido_cliente,
            qty_produzida: qty_produzida,
            tipo_produto:tipo_produto,
            obs: obs,
            orderprod_id: orderprod_id,
            product_id: product_id,
          }
        });
        
        if(updateRecord){
          const updateRow = await apiAdonis({
            method: 'GET',
            url: `salesorder/${pdVenda.id}`
          });
  
  
          if(updateRow){
            setStateEdit(updateRow.data[0]);
            message.success('Linha salva com sucesso!');
            setLoadingEtapa(false);
            setModalAddLinha(false);
            setisEditingAfterCreated(false);
            setLinhaPd({});
          }
         
        }
      } catch (error) {
        console.log(error);
        setStateEdit(pdVenda);
        message.error('Erro ao gravar registro, tente novamente mais tarde!');
      }
    }else{
      message.warning('Campos obrigatórios em branco!');
      validator1.current.showMessages();
      forceUpdate(1)
    }
  }

  function EditLinPdBeforeCreated(data,validator1) {
    if (validator1.current.allValid()) {
      const elementsIndex = listLin.findIndex(element => element.key === linhaPd.key );
      data.key = linhaPd.key
      let newArray = [...listLin];
  
      newArray[elementsIndex] = linhaPd;
     
      setListLin(newArray);
      setLinhaPd({});
      setLoadingEtapa(false);
      setModalAddLinha(false);
      setisEditingBeforeCreated(false);
    }else{
      message.warning('Campos obrigatórios em branco!');
      validator1.current.showMessages();
      forceUpdate(1)
    }
  }

  useMemo( () => {
    getPart();
    getOrders();
    getProducts();
    
  },[])

  
  function _handleKeyDownPartner (e) {
    if (e.key === 'Enter') {
      setFetchingPartner(true);
      const {value} = e.target;

      api
      .get(`Partner/findSpePartner`, {params: {valor: value}  })
      .then((result) => {
        let data = result.data;

        setFetchingPartner(false);
        setListPartner(data);
      })
      .catch(function (error) {
        // console.log(error);
      });

    }
  };

  
  function _handleKeyDownOrderProd (e) {
    if (e.key === 'Enter') {
      setFetchingOrderProd(true);
      const {value} = e.target;

      api
      .get(`OrderProd/findSpeOrdeProd`, {params: {valor: value}  })
      .then((result) => {
        let data = result.data;

        setFetchingOrderProd(false);
        setListOrders(data);
      })
      .catch(function (error) {
        // console.log(error);
      });

    }
  };

  
  function _handleKeyDownProduct (e) {
    if (e.key === 'Enter') {
      setFetchingProduct(true);
      const {value} = e.target;

      api
      .get(`Product/findSpeProduct`, {params: {valor: value}  })
      .then((result) => {
        let data = result.data;

        setFetchingProduct(false);
        setListProducts(data);
      })
      .catch(function (error) {
        // console.log(error);
      });

    }
  };

  function getPart () {
    api
    .get(`${model4}/`, {})
    .then((result) => {
      let dataCli = [];
      dataCli = result.data.data;

      setListPartner(dataCli)
    })
    .catch(function (error) {
      // console.log(error);
    });
  }

  function getOrders () {
    api
    .get(`${model1}/?limit=10`, {})
    .then((result) => {
      let dataCli = [];
      dataCli = result.data;

      setListOrders(dataCli)
    })
    .catch(function (error) {
      // console.log(error);
    });
  }

function getProducts () {
    api
    .get(`${model3}/?limit=10`, {})
    .then((result) => {
      let dataCli = [];
      dataCli = result.data;

      setListProducts(dataCli)
    })
    .catch(function (error) {
      // console.log(error);
    });
  
  }

  function setStateNew() {
    setCanSave(true)
    setCanNew(true)
    setCanDelete(false)
    setLoading(false)
    setIsNew(true)
    setPdVenda({})
    setListLin([])
    setLinhaPd({})
    //setflagButtonLin(true)
    setisEditingAfterCreated(false);
    setisEditingBeforeCreated(false)
  }

  function onHandleClickNew () {
    setStateNew();
  };
  
  function Content (categ, partner) {
    return (
      <Form onSubmit={handleSubmit(onSubmit)}>

      <div className="main">
        
        <Row>
          <Col span={24}>
            <Form layout="horizontal">
              <Card type="inner" title="Pedido Venda">
                <Row>
                  <Col lg={5} md={6} sm={12} xs={24}>
                    <div className="gx-form-row0">
                    <Controller
                      name="id"
                      control={control}
                      defaultValue={""}
                      as={
                        <Form.Item label="Número" >
                        <Input
                          type="text"
                          value={categ.id}
                          name="id"
                          disabled={true}
                         onChange={inputHandle}
                        />
                      </Form.Item>
                      }
                    />
                    </div>
                  </Col>

                  <Col lg={5} md={6} sm={12} xs={24}>
                    <div className="gx-form-row0">
                    <Controller
                      name="partner_id"
                      control={control}
                      defaultValue={""}
                      render={ (props) => (
                      <Form.Item label="Cliente" required={true}>
                        <Select
                          {...props}
                          value={categ.partner_id}
                          // style={{ width: 160 }}
                          showSearch
                          notFoundContent={fetchingPartner ? <Spin size="small" /> : null}
                          onInputKeyDown={_handleKeyDownPartner}
                          onChange={(e) => handleSelect(e,props)}
                          filterOption={(inputValue, option) =>
                            // console.log(inputValue)
                            option.props.children
                              .toUpperCase()
                              .indexOf(inputValue.toUpperCase()) !== -1
                          }
                        >
                          {partner.map((e) => {
                            return (
                              <Option value={e.id}>
                                {e.name === undefined || e.name === null ? categ.partner.name  : e.name}
                              </Option>
                            );
                          })}

                          {lodash.isEmpty(categ) ?
                            "" : 
                            <Option value={categ.partner.id}>
                              {categ.partner.name}
                            </Option>
                          }
                            
                        </Select>
                        {validator.current.message(
                          'Cliente',
                          categ.partner_id,
                          'required|alpha_num',
                          { className: 'text-danger' }
                        )}
                      </Form.Item>
                      )   
                      }
                    />
                    </div>
                  </Col>

                  <Col lg={5} md={6} sm={12} xs={24}>
                    <div className="gx-form-row0">
                    <Controller
                        
                        render={(props) => (
                          <Form.Item
                        label="Data Ped.Venda"
                        required={true}
                      >
                        <DatePicker
                          //value={this.state.dataAux}
                          {...props}
                            value={categ.orddat}
                            onChange={(date,dataString) => handleDatePicker(date, dataString, props)}
                          locale={locale}
                          format={'DD-MM-YYYY'}
                          style={{ width: '100%' }}
                        />
                        {validator.current.message(
                          'Data',
                          categ.orddat,
                          'required',
                          { className: 'text-danger' }
                        )}
                      </Form.Item>
                        )}
                        control={control}
                        name="orddat"
                        defaultValue=""
                      />
                    </div>
                  </Col>

                  <Col lg={5} md={6} sm={12} xs={24}>
                    <div className="gx-form-row0">
                      <Controller
                      name="status"
                      control={control}
                      defaultValue={""}
                      render={ (props) => (<Form.Item label="Status">
                      <Select
                        {...props}
                        value={categ.status}
                        onChange={(e) => handleSelect(e,props)}
                      >
                        <Option value={'pendente'}>Pendente</Option>
                        <Option value={'confirmada'}>Confirmada</Option>
                        <Option value={'concluida'}>Concluida</Option>
                      </Select>
                    </Form.Item>)
                      }
                      />
                    </div>
                  </Col>

                  <Col lg={4} md={6} sm={12} xs={24}>
                    <div className="gx-form-row0">
                    <Controller
                      name="numnfe"
                      defaultValue={""}
                      control={control}
                      as={
                        <Form.Item label="Numero NFe" >
                        <Input
                          type="text"
                          value={categ.numnfe}
                          name="numnfe"
                         // disabled={this.state.isNew ? false : true}
                         onChange={inputHandle}
                        />
                      </Form.Item>
                      }
                    />
                    </div>
                  </Col>
                </Row>

              
                <Row>
                <Col lg={5} md={6} sm={12} xs={24}>
                    <div className="gx-form-row0">
                    <Controller
                      name="vl_total"
                      control={control}
                      defaultValue={""}
                      as={
                        <Form.Item label="Vlr. Total Pedido" >
                        <Input
                          type="text"
                          value={categ.vl_total}
                          name="vl_total"
                         // disabled={this.state.isNew ? false : true}
                         onChange={inputHandle}
                        />
                      </Form.Item>
                      }
                    />
                    </div>
                  </Col>

                  <Col lg={5} md={6} sm={12} xs={24}>
                    <div className="gx-form-row0">
                    <Controller
                      name="vl_total_frete"
                      control={control}
                      defaultValue={""}
                      as={
                        <Form.Item label="Vlr. Frete" >
                        <Input
                          type="text"
                          value={categ.vl_total_frete}
                          name="vl_total_frete"
                         // disabled={this.state.isNew ? false : true}
                         onChange={inputHandle}
                        />
                      </Form.Item>
                      }
                    />
                    </div>
                  </Col>

                  <Col lg={5} md={6} sm={12} xs={24}>
                    <div className="gx-form-row0">
                    <Controller
                      name="vl_total_merc"
                      control={control}
                      defaultValue={""}
                      as={
                        <Form.Item label="Vlr. Mercadorias" >
                        <Input
                          type="text"
                          value={categ.vl_total_merc}
                          name="vl_total_merc"
                         // disabled={this.state.isNew ? false : true}
                         onChange={inputHandle}
                        />
                      </Form.Item>
                      }
                    />
                    </div>
                  </Col>

                  <Col lg={5} md={6} sm={12} xs={24}>
                    <div className="gx-form-row0">
                    <Controller
                      name="vl_total_outros"
                      control={control}
                      defaultValue={""}
                      as={
                        <Form.Item label="Valor outros" >
                        <Input
                          type="text"
                          value={categ.vl_total_outros}
                          name="vl_total_outros"
                         // disabled={this.state.isNew ? false : true}
                         onChange={inputHandle}
                        />
                      </Form.Item>
                      }
                    />
                    </div>
                  </Col>

                  <Col lg={4} md={6} sm={12} xs={24}>
                    <div className="gx-form-row0">
                    <Controller
                      name="vl_total_desc"
                      control={control}
                      defaultValue={""}
                      as={
                        <Form.Item label="Vlr.Total Descontos" >
                        <Input
                          type="text"
                          value={categ.vl_total_desc}
                          name="vl_total_desc"
                         // disabled={this.state.isNew ? false : true}
                         onChange={inputHandle}
                        />
                      </Form.Item>
                      }
                    />
                    </div>
                  </Col>
                </Row>
              
                <Row>
                <Col lg={5} md={6} sm={12} xs={24}>
                    <div className="gx-form-row0">
                    <Controller
                      name="pedido_cliente"
                      defaultValue={""}
                      control={control}
                      as={
                        <Form.Item label="Pedido Cliente" >
                        <Input
                          type="text"
                          value={categ.pedido_cliente}
                          name="pedido_cliente"
                         // disabled={this.state.isNew ? false : true}
                         onChange={inputHandle}
                        />
                      </Form.Item>
                      }
                    />
                    </div>
                  </Col>

                  <Col lg={5} md={6} sm={12} xs={24}>
                    <div className="gx-form-row0">
                    <Controller
                      name="pedido_fox"
                      control={control}
                      defaultValue={""}
                      as={
                        <Form.Item label="Pedido Fox" >
                        <Input
                          type="text"
                          value={categ.pedido_fox}
                          name="pedido_fox"
                         // disabled={this.state.isNew ? false : true}
                         onChange={inputHandle}
                        />
                      </Form.Item>
                      }
                    />
                    </div>
                  </Col>

                  <Col lg={5} md={6} sm={12} xs={24}>
                    <div className="gx-form-row0">
                      <Controller
                      name="tipo_registro"
                      control={control}
                      defaultValue={""}
                      render={ (props) => (<Form.Item label="Tipo Registro">
                      <Select
                        {...props}
                        value={categ.tipo_registro}
                        onChange={(e) => handleSelect(e,props)}
                      >
                        <Option value={'fatura'}>Fatura</Option>
                        <Option value={'nfs-e'}>NFS-e</Option>
                      </Select>
                    </Form.Item>)
                      }
                      />
                    </div>
                  </Col>

                  <Col lg={5} md={6} sm={12} xs={24}>
                    <div className="gx-form-row0">
                    <Controller
                      name="serie"
                      defaultValue={""}
                      control={control}
                      as={
                        <Form.Item label="Serie NFE" >
                        <Input
                          type="text"
                          value={categ.serie}
                          name="serie"
                         // disabled={this.state.isNew ? false : true}
                         onChange={inputHandle}
                        />
                      </Form.Item>
                      }
                    />
                    </div>
                  </Col>

                  <Col lg={4} md={6} sm={12} xs={24}>
                    <div className="gx-form-row0">
                    <Controller
                      name="peso_liquido"
                      defaultValue={""}
                      control={control}
                      as={
                        <Form.Item label="Peso Liquido" >
                        <Input
                          type="text"
                          value={categ.peso_liquido}
                          name="peso_liquido"
                         // disabled={this.state.isNew ? false : true}
                         onChange={inputHandle}
                        />
                      </Form.Item>
                      }
                    />
                    </div>
                  </Col>
                  </Row>
                  <Row>

                  <Col lg={5} md={6} sm={12} xs={24}>
                    <div className="gx-form-row0">
                    <Controller
                      name="peso_bruto"
                      defaultValue={""}
                      control={control}
                      as={
                        <Form.Item label="Peso Bruto" >
                        <Input
                          type="text"
                          value={categ.peso_bruto}
                          name="peso_bruto"
                         // disabled={this.state.isNew ? false : true}
                         onChange={inputHandle}
                        />
                      </Form.Item>
                      }
                    />
                    </div>
                  </Col>

                  <Col lg={5} md={6} sm={12} xs={24}>
                    <div className="gx-form-row0">
                    <Controller
                      name="nr_volumes"
                      control={control}
                      defaultValue={""}
                      as={
                        <Form.Item label="Num. Volume Pedido" >
                        <Input
                          type="text"
                          value={categ.nr_volumes}
                          name="nr_volumes"
                         // disabled={this.state.isNew ? false : true}
                         onChange={inputHandle}
                        />
                      </Form.Item>
                      }
                    />
                    </div>
                  </Col>
                  

                  <Col lg={5} md={6} sm={12} xs={24}>
                    <div className="gx-form-row0">
                    <Controller
                      name="mod_frete"
                      control={control}
                      defaultValue={""}
                      as={
                        <Form.Item label="Modalidade Frete" >
                        <Input
                          type="text"
                          value={categ.mod_frete}
                          name="mod_frete"
                         // disabled={this.state.isNew ? false : true}
                         onChange={inputHandle}
                        />
                      </Form.Item>
                      }
                    />
                    </div>
                  </Col>
                </Row>

                <Row>
                <Col lg={12} md={12} sm={12} xs={24}>
                    <div className="gx-form-row0">
                    <Controller
                      name="obs"
                      control={control}
                      defaultValue={""}
                      as={
                        <Form.Item label="Observação" >
                          <TextArea
                            type="text"
                            value={categ.obs}
                            name="obs"
                            onChange={inputHandle}
                            style={{ width: '500px' }}
                            autoSize={{ minRows: 3, maxRows: 7 }}
                          />
                        </Form.Item>
                      }
                    />
                    </div>
                  </Col>

                </Row>
              </Card>
              <Card type="inner" title="Linha Pedido Venda">
                  <Row type="flex">
                    <Col lg={4} md={6} sm={12} xs={24}>
                      <div className="gx-form-row0">
                      <Button onClick={() => setModalAddLinha(true)} type="primary">
                        Adicionar Linhas
                      </Button>
                      </div>
                    </Col>
                  </Row>

                  <br />
                  <Table
                    //components={components}
                    rowClassName={() => 'editable-row'}
                    bordered
                    className="gx-table-responsive"
                    columns={columnsLinhaPedido}
                    dataSource={listLin}
                    rowKey="id"
                    size="small"
                    style={{ margin: '-15px -24px' }}
                  />
              </Card>

            </Form>
          </Col>
        </Row>
      </div>
      </Form>
    );
  };

  function LeftList() {
    return (
      <ListUsers onClickRow={handleOnClickRow1} ref={leftListChild} />
    );
  }

  function handleOnClickRow1 (record, rowIndex)  {
    setLoading(true);
    setLoadingTip('Carregando registro, aguarde...');
      
    apiAdonis
      .get(`${model}/${record.id}`, {})
      .then((result) => {
        //Caso consiga recuperar o model, ele atualiza a tela e para de carregar
        // console.log(result.data.adresses);
        // console.log(result.adresses);
        message.success('Pedido carregado com sucesso!');
        
        setStateEdit(result.data[0]);
      })
      .catch(function (error) {
         console.log(error);
        message.error('Erro ao buscar registro, tente novamente mais tarde!');
        setStateNew();
    });
    };

    function 
    setStateEdit (model) {

    model.orddat = moment(model.orddat)
    setListLin(model.linhas);
    setCanSave(true);
    setCanNew(true);
    setCanDelete(true);
    setLoading(false);
    setLoadingEtapa(false);
    setIsNew(false);
    //setflagButtonLin(false);


    
    setPdVenda(model)
    // this.setState({
    //   canSave: true,
    //   canNew: true,
    //   canDelete: true,
    // //  categ: newModel,
    //   loading: false,
    //   isNew: false,
    // });
  };

   function onHandleClickSave (data) {
    if (validator.current.allValid()) {
      // let record = this.state.categ;
      // var parent = this;

      // this.setState({
      //   loading: true,
      //   loadingTip: 'Salvando registro, aguarde...',
      // });
      setLoading(true)
      setLoadingTip('Salvando registro, aguarde...')
      //Verifica se é uma atualizacao (PUT) ou novo registro (POST)
      let METHOD = 'PATCH';
      let URL = `${model}/${pdVenda.id}`;

      if (isNew) {
        METHOD = 'POST';
        URL = `${model}`;
        // record = Object.assign({},record)
      }
      const {partner_id, orddat, status, tipo_registro} = pdVenda
      // console.log('onHandleSaveButton', record);
      const { obs, mod_frete, nr_volumes,numnfe,
        pedido_cliente,pedido_fox,peso_bruto,peso_liquido,serie
        ,vl_total,vl_total_desc,vl_total_frete,
        vl_total_merc,vl_total_outros,
      } = pdVenda;

      apiAdonis({
        method: METHOD,
        url: URL,
        data: {
          obs: obs,
          status: status,
          mod_frete: mod_frete,
          nr_volumes: nr_volumes,
          numnfe:numnfe,
          pedido_cliente: pedido_cliente,
          pedido_fox:pedido_fox,
          peso_bruto: peso_bruto,
          peso_liquido: peso_liquido,
          serie: serie,
          orddat: orddat,
          tipo_registro: tipo_registro,
          vl_total: vl_total,
          vl_total_desc: vl_total_desc,
          vl_total_frete: vl_total_frete,
          vl_total_merc: vl_total_merc,
          vl_total_outros: vl_total_outros,
          partner_id: partner_id,
          linhasPd: METHOD === "PATCH" ? undefined :  listLin
        },
      })
        .then((result) => {
          //Caso consiga recuperar o model, ele atualiza a tela e para de carregar
          message.success('Pedido salva com sucesso!');
          // console.log(result.data);
          setStateEdit(result.data[0] === undefined ? result.data : result.data[0] )
          leftListChild.current.fetchLeftList();
        })
        .catch(function (error) {
          console.log(error);
          setStateEdit(data);
          message.error('Erro ao gravar registro, tente novamente mais tarde!');
        });
    } else {
      message.warning('Campos obrigatórios em branco!');
      validator.current.showMessages();
      forceUpdate(1)
    }
  };

  function onHandleClickDelete () {
    // console.log(this.state.model);
    const record = pdVenda

    Modal.confirm({
      title: 'Tem certeza que deseja excluir esse registro?',
      onOk() {
        setLoading(true);
        setLoadingTip('Excluindo registro, aguarde...');

        setTimeout(function () {
          //Agora ele vai buscar o registro no servidor
          let METHOD = 'DELETE';
          let URL = `${model}/${record.id}`;
          apiAdonis({
            method: METHOD,
            url: URL,
          })
            .then((result) => {
              //Caso consiga recuperar o model, ele atualiza a tela e para de carregar
              message.success('Registro excluido com sucesso!');
              setStateNew();
              leftListChild.current.fetchLeftList();
            })
            .catch(function (error) {
              console.log(error);
              message.error(error.response.data.message);
            });
        }, 1000);
        setStateNew();
      },
      onCancel() {
        //Nada acontece
      },
    });
  };


  function onOkLinhaPedido (data, validator1) {
    if (validator1.current.allValid()) {
      setLoadingEtapa(true);
      let newObj;
      let lista = listLin;
      let tamanho = lista.length;
      let key;

      if(tamanho === 0 ){
        key = 1 
      }else{
        let t = lodash.sortBy(lista, (e) => {return e.key})
        lista =  t;
        var last = lista[lista.length - 1]
        key = last.key + 1;
      }

      newObj = linhaPd;
      newObj.key = key;

      lista.push(newObj);

      setListLin(lista);
      setLinhaPd({});
      setLoadingEtapa(false);
      setModalAddLinha(false);
      message.success('Linha Adicionada com Sucesso');
    } else {
      message.warning('Campos obrigatórios em branco!');
      validator1.current.showMessages();
      forceUpdate(1)
    }
  }


  async function onOkLinhaPedidoAfter(data, validator1) {
    if (validator1.current.allValid()) {
      setLoadingEtapa(true);

      const METHOD = 'POST';
      const URL = `linsalesorder`;
  
      const {id} = pdVenda;
      const { data_entrega, data_prevista, cfop, lin_pedido_cliente, lin_pedido_fox, qty_produzida, tipo_produto, obs, produto_cliente
      } = linhaPd;
      const {orderprod_id, product_id} = linhaPd;
  
      try {
        const updateRecord = await apiAdonis({
          method: METHOD,
          url: URL,
          data: {
            num_salesorder: id,
            data_entrega: data_entrega,
            data_prevista: data_prevista,
            produto_cliente:produto_cliente,
            cfop: cfop,
            lin_pedido_fox: lin_pedido_fox,
            lin_pedido_cliente: lin_pedido_cliente,
            qty_produzida: qty_produzida,
            tipo_produto:tipo_produto,
            obs: obs,
            orderprod_id: orderprod_id,
            product_id: product_id,
          }
        });
        
        if(updateRecord){
          const updateRow = await apiAdonis({
            method: 'GET',
            url: `salesorder/${pdVenda.id}`
          });
  
          if(updateRow){
            setListLin(updateRow.data[0].linhas);
            setLoadingEtapa(false);
            message.success('Linha salva com sucesso!');
            setModalAddLinha(false);
            setLinhaPd({});
          }
         
        }
      } catch (error) {
        console.log(error);
        setStateEdit(pdVenda);
        message.error('Erro ao gravar registro, tente novamente mais tarde!');
      }
    } else {
      message.warning('Campos obrigatórios em branco!');
      validator1.current.showMessages();
      forceUpdate(1)
    }
  }

  return  (
    <Spin spinning={loading} tip={loadingTip}>
        <Row>
          <Col lg={5} md={5} sm={24} xs={24}>
            {LeftList()}
          </Col>
          <Col lg={15} md={15} sm={24} xs={24}>
            {Content(pdVenda,listOfPartner)}
          </Col>
          <Col lg={4} md={4} sm={24} xs={24}>
            <RightList
              title={'Pedido Venda'}
              onHandleClickNew={onHandleClickNew}
              onHandleClickSave={handleSubmit(onHandleClickSave)}
              onHandleClickDelete={onHandleClickDelete}
              canNew={canNew}
              canSave={canSave}
              canDelete={canDelete}
            />
            <AddLinhaPedido
                onChange={inputHandleLinha}
                linhaPd={linhaPd}
                handleDatePicker={handleDatePicker}
                handleSelect={handleSelect}
                listOfOrders={listOfOrders}
                listofProducts={listofProducts}
                showAddALinhaPd={modalAddLinha}
                onOk={ onOkLinhaPedido}
                isNew={isNew}
                onOkLinhaPedidoAfter={onOkLinhaPedidoAfter}
                EditLinPd={EditLinPd}
                isEditingAfterCreated={isEditingAfterCreated}
                EditLinPdBeforeCreated={EditLinPdBeforeCreated}
                isEditingBeforeCreated={isEditingBeforeCreated}
                findSpeProduct={_handleKeyDownProduct}
                findSpeOrderProd={_handleKeyDownOrderProd}
                setFetchingProduct={setFetchingProduct}
                setFetchingOrderProd={setFetchingOrderProd}
                fetchingOrderprod={fetchingOrderProd}
                fetchingProduct={fetchingProduct}
                onCancel={() => {
                  setModalAddLinha(false)
                  setLinhaPd([])
                }
                  
                  //this.setState({ modalAddApontamento: false, apontamento: [] })
                }
                //onChange={this.handleChangeApontamento}
                //listofMachines={this.state.listofMachines}
                //listaEtapas={this.state.listOrderProdMaqOnApt}
                confirmLoading={loadingEtapa}
            />
          </Col>
        </Row>
      </Spin>
  )
}

export default PedidoVen;
