import React, {Component} from 'react';
import {Card, Form, Input, Row, Col, Table, Button, Select, Modal, notification} from 'antd';
import MaskedInput from 'react-text-mask';
import IntlMessages from "util/IntlMessages";

const Option = Select.Option;

const openNotificationWithIcon = type => {
    notification[type]({
        message: 'Endereço ADICIONADO '
    });
};

const openNotificationWithIcon2 = type => {
    notification[type]({
      message: 'Endereço REMOVIDO'
    });
};

const openNotificationWithIcon3 = type => {
    notification[type]({
        message: 'Endereço EDITADO '
    });
};

class CustomerForm extends Component {

    constructor() {
        
        super()
        this.state ={
            adresses: [],
            address: {
                type: "1",
                personType: "1"
            },
            canEdit: false,
            maskCPFCNPJ: [/[1-9]/, /\d/,/\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/],
            maskCPFCNPJ_placeholder: '999.999.999-99',
            titleCPFCNPJ: 'CPF'
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleClickAddAddress = this.handleClickAddAddress.bind(this);
        let auxthis = this;

        this.adressesColumns = [
            {
                title: 'Nome',
                dataIndex:'name',
                key: 'name'
            },
            {
                title: 'Endereco',
                dataIndex:'address',
                key: 'address'
            },
            {
                // title: text => <IntlMessages id="commondata.customers.lastname"/>,
                title: 'CEP',
                dataIndex:'cep',
                key: 'cep'
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
                                    title: 'Tem certeza que deseja remover esse endereço?',
                                    onOk() {
                                        auxthis.handleDeleteAddressRow(record.key, e); 
                                    },
                                    onCancel() {

                                    }
                                });
                                
                            }}
                        />
                        {/* <div className="gx-icon-views"> */}
                            <i className="icon icon-edit"
                                onClick={(e) => auxthis.handleEditAdress(record,e)}
                            />
                        {/* </div> */}
                    </div>
                )
            }
        ]

        // this.validator = new SimpleReactValidator({locale: 'pt'});

    }

    handleChange(event) {
        console.log(event);
        let nModel = this.props.model;

        if(event === "cliente" || event === "fornecedor" ||  event === "ambos") {
            nModel["tipo"] = event
        }else{
            if(event.target.name === 'cnpj'){
                // alert('cnpj');
                nModel[event.target.name] = event.target.value.replace(/\D+/g,'');            
            }else {
                nModel[event.target.name] = event.target.value;
            }
        }

        this.setState(() => ({
            model: nModel
        }))
    }

    handleChangeAddress(name, value) {
        console.log('name', name);
        console.log('value', value);
        let address = this.state.address;
        
        address[name] = value;

        this.setState({address});    
    }

    handleEditAdress =  (record, e) => {
        this.props.knowIfIsEditing();
        this.setState({
            address: record,
            canEdit: true
        });
    }
    
    handleEditAdressOntable = () => {
        this.props.handleEditAdress(this.state.address);
        this.setState({
            address: {
                name:'',
                cep: '',
                cpfcnpj: '',
                phone:''
            }
        });
        openNotificationWithIcon3('success');
    }

    handleDeleteAddressRow(key, e) {
        console.log(key);
        this.props.handleDeleteAddressRow(key, e);
        openNotificationWithIcon2('success')
    }

    handleClickAddAddress() {
        this.props.handleClickAddAddress(this.state.address);
        this.setState({
            address: {
                name:'',
                cep: '',
                cpfcnpj: '',
                phone:''
            }
        });
        openNotificationWithIcon('success');
    }

    handleTipoPessoa(name, value) {
        console.log('handleTipoPessoa',value);
        let maskCPFCNPJ = [/[1-9]/, /\d/,/\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/]
        let maskCPFCNPJ_placeholder = '999.999.999-99';
        let titleCPFCNPJ = 'CPF';
        if(value === 2) {
            //CNPJ
            maskCPFCNPJ = [/[1-9]/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/,'-', /\d/, /\d/]
            maskCPFCNPJ_placeholder = '99.999.999/9999-99';
            titleCPFCNPJ =  'CNPJ';
        }
        
        this.setState({
            maskCPFCNPJ, maskCPFCNPJ_placeholder, titleCPFCNPJ
        });
        this.handleChangeAddress(name,value);
    }

    componentWillReceiveProps(props) {
        // console.log('componentWillReceiveProps - CustomerForm');
        // console.log(props);

        // this.setState(() => ({
        //     adresses: props.adresses
        // }));
    }


    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
        if (!err) {
            console.log('Received values of form: ', values);
        }
        });
        alert('handleSubmit');
    }
        
    render () {
        return (
            <div className="main">
                <Row>
                    <Col span={24}>
                        <Form layout="horizontal" size="small">
                            <Card type="inner" title={<IntlMessages id="commondata.customers"/>}>
                            
                                <Row>
                                    <Col lg={6} md={6} sm={12} xs={24}>
                                        <div className="gx-form-row0">
                                            <Form.Item 
                                                label="Fantasia"
                                                required={true}
                                            >
                                                <Input 
                                                    type="text" 
                                                    name="name"
                                                    value={this.props.model.name}
                                                    onChange={this.handleChange}
                                                />
                                                {this.props.validator.message('name', this.props.model.name, 'required|string',{ className: 'text-danger' })}
                                            </Form.Item>
                                        </div>
                                    </Col>
                                    {/* <Col lg={6} md={6} sm={12} xs={24}>
                                        <div className="gx-form-row0">
                                            <Form.Item label={<IntlMessages id="commondata.customers.lastname"/>}>
                                                <Input 
                                                    type="text" 
                                                    name="lastname"
                                                    value={this.props.model.lastname}
                                                    onChange={this.handleChange}/>
                                            </Form.Item>
                                        </div>
                                    </Col> */}
                                    <Col lg={6} md={6} sm={12} xs={24}>
                                        <div className="gx-form-row0">
                                            <Form.Item label="Razão social">
                                                <Input 
                                                    type="text" 
                                                    name="razaosocial"
                                                    onChange={this.handleChange}
                                                    value={this.props.model.razaosocial}
                                                />
                                            </Form.Item>
                                        </div>
                                     </Col>
                                    <Col lg={6} md={6} sm={12} xs={24}>
                                        <div className="gx-form-row0" >
                                            <Form.Item label="Tipo">
                                                <Select 
                                                    className="gx-mr-3 gx-mb-3"  
                                                    name="type"
                                                    value={this.props.model.tipo}
                                                    style={{width: 150}} 
                                                    onChange={this.handleChange}>
                                                    <Option value="cliente">Cliente</Option>
                                                    <Option value="fornecedor">Fornecedor</Option>
                                                    <Option value="ambos">Ambos</Option>
                                                </Select>
                                            </Form.Item>
                                        </div>
                                    </Col>
                                </Row>
                            </Card>
                            <Card type="inner" title="Dados gerais">
                                <Row>
                                <Col lg={6} md={6} sm={12} xs={24}>
                                    <div className="gx-form-row0">
                                        <Form.Item label="CNPJ">
                                            <MaskedInput
                                                mask={[/[0-9]/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/,'-', /\d/, /\d/]}
                                                className="ant-input"
                                                placeholder="99.999.999/9999-99"
                                                guide={true}
                                                id="my-input-id"
                                                value={this.props.model.cnpj}
                                                name="cnpj"
                                                onBlur={() => {}}
                                                onChange={this.handleChange}
                                                />
                                        </Form.Item>
                                    </div>                                    
                                </Col>

                                    {/* <Form.Item label="CPF">
                                        <MaskedInput
                                            mask={[/[1-9]/, /\d/,/\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/]}
                                            className="ant-input"
                                            placeholder="999.999.999-99"
                                            guide={false}
                                            name="cpf"
                                            value={this.props.model.cpf}
                                            onChange={this.handleChange}
                                            id="my-input-id"
                                            onBlur={() => {}}
                                            onChange={() => {}}
                                            />
                                    </Form.Item> */}
                                </Row>
                            </Card>
                            <Card type="inner" title="Endereços cadastrados">
                                <Table 
                                    className="gx-table-responsive"
                                    columns={this.adressesColumns}
                                    dataSource={this.props.adresses}
                                    size="small"
                                    rowKey="id"
                                    style={{margin: '-15px -24px'}}
                                />
                            </Card>
                            <Card type="inner" title="Novo/Editar Endereço">
                                <Form type="horizontal">
                                    <Row>
                                        <Col lg={4} md={6} sm={12} xs={24}>
                                            <div className="gx-form-row0">
                                                <Form.Item label="Tipo de endereço">
                                                    <Select 
                                                        className="gx-mr-3 gx-mb-3" 
                                                        defaultValue="1" 
                                                        name="e_type"
                                                        // style={{width: 120}} 
                                                        onChange={e => this.handleChangeAddress("type",e)}
                                                        value={this.state.address.type}>
                                                        <Option value="1">Retirada</Option>
                                                        <Option value="2">Entrega</Option>
                                                        <Option value="3">Cobrança</Option>
                                                    </Select>
                                                </Form.Item>
                                            </div>
                                        </Col>
                                        <Col lg={4} md={6} sm={12} xs={24}>
                                            <div className="gx-form-row0">
                                                <Form.Item label="Tipo de pessoa">
                                                    <Select 
                                                        className="gx-mr-3 gx-mb-3" 
                                                        defaultValue="1"
                                                        name="e_type_person"
                                                        value={this.state.address.personType}
                                                        // style={{width: 120}} 
                                                        onChange={e => this.handleTipoPessoa('personType',e)}
                                                        >
                                                        <Option value="1">CPF</Option>
                                                        <Option value="2">CNPJ</Option>
                                                    </Select>
                                                </Form.Item>
                                            </div>
                                        </Col>
                                        <Col lg={4} md={6} sm={12} xs={24}>
                                            <div className="gx-form-row0">
                                                <Form.Item label="Nome">
                                                    <Input 
                                                        type="text" 
                                                        name="e_name"
                                                        onChange={e => this.handleChangeAddress("name",e.target.value)}
                                                        value={this.state.address.name}
                                                        // style={{width: 220}}
                                                        />
                                                </Form.Item>
                                            </div>
                                        </Col>
                                        <Col lg={4} md={6} sm={12} xs={24}>
                                            <div className="gx-form-row0">
                                                <Form.Item label={this.state.titleCPFCNPJ}>
                                                    <MaskedInput
                                                            mask={this.state.maskCPFCNPJ}
                                                            onChange={e => this.handleChangeAddress("cpfcnpj",e.target.value)}
                                                            value={this.state.address.cpfcnpj}
                                                            className="ant-input"
                                                            placeholder={this.state.maskCPFCNPJ_placeholder}
                                                            guide={false}
                                                            id="my-input-id"
                                                    />
                                                </Form.Item>
                                            </div>
                                        </Col>
                                        <Col lg={4} md={6} sm={12} xs={24}>
                                            <div className="gx-form-row0">
                                                <Form.Item label="Inscricão estadual">
                                                    <Input 
                                                        type="text" 
                                                        name="ie"
                                                        onChange={e => this.handleChangeAddress("ie",e.target.value)}
                                                        value={this.state.address.ie}
                                                        // style={{width: 220}}
                                                        />
                                                </Form.Item>
                                            </div>
                                        </Col>
                                        <Col lg={4} md={6} sm={12} xs={24}>
                                            <div className="gx-form-row0">
                                                <Form.Item label="CEP">
                                                    <MaskedInput
                                                        mask={[/[1-9]/, /\d/,/\d/, /\d/, /\d/, '-', /\d/, /\d/,/\d/]}
                                                        className="ant-input"
                                                        placeholder="99999-99"
                                                        guide={false}
                                                        id="e_cep"
                                                        name="e_cep"
                                                        value={this.state.address.cep}
                                                        onChange={e => this.handleChangeAddress("cep",e.target.value)}
                                                        />
                                                </Form.Item>
                                            </div>
                                        </Col>
                                        <Col lg={4} md={6} sm={12} xs={24}>
                                            <div className="gx-form-row0">
                                                <Form.Item label="Endereço">
                                                    <Input 
                                                        type="text" 
                                                        name="address"
                                                        // style={{width: 500}}
                                                        value={this.state.address.address}
                                                        onChange={e => this.handleChangeAddress("address",e.target.value)}
                                                        />
                                                </Form.Item>
                                            </div>
                                        </Col>
                                        <Col lg={4} md={6} sm={12} xs={24}>
                                            <div className="gx-form-row0">
                                                <Form.Item label="Bairro">
                                                    <Input 
                                                        type="text" 
                                                        name="district"
                                                        // style={{width: 220}}
                                                        value={this.state.address.district}
                                                        onChange={e => this.handleChangeAddress("district",e.target.value)}
                                                        />
                                                </Form.Item>
                                            </div>
                                        </Col>
                                        <Col lg={4} md={6} sm={12} xs={24}>
                                            <div className="gx-form-row0">
                                                <Form.Item label="Número">
                                                    <Input 
                                                        type="text" 
                                                        name="number"
                                                        value={this.state.address.numero}
                                                            onChange={e => this.handleChangeAddress("numero",e.target.value)}
                                                        />
                                                </Form.Item>
                                            </div>
                                        </Col>
                                        <Col lg={4} md={6} sm={12} xs={24}>
                                            <div className="gx-form-row0">
                                                <Form.Item label="Complemento">
                                                    <Input 
                                                        type="text" 
                                                        name="complement"
                                                        // style={{width: 420}}
                                                        value={this.state.address.complement}
                                                        onChange={e => this.handleChangeAddress("complement",e.target.value)}
                                                        />
                                                </Form.Item>
                                            </div>
                                        </Col>
                                        <Col lg={4} md={6} sm={12} xs={24}>
                                            <div className="gx-form-row0">
                                                <Form.Item label="País">
                                                    <Input
                                                        type="text" 
                                                        name="country"
                                                        value={this.state.address.country}
                                                        onChange={e => this.handleChangeAddress("country",e.target.value)}
                                                        />
                                                </Form.Item>
                                            </div>
                                        </Col>
                                        <Col lg={4} md={6} sm={12} xs={24}>
                                            <div className="gx-form-row0">
                                                <Form.Item label="Estado">
                                                    <Input 
                                                        type="text" 
                                                        name="state"
                                                        value={this.state.address.state}
                                                        onChange={e => this.handleChangeAddress("state",e.target.value)}
                                                        />
                                                </Form.Item>
                                            </div>
                                        </Col>
                                        <Col lg={4} md={6} sm={12} xs={24}>
                                            <div className="gx-form-row0">
                                                <Form.Item label="Cidade">
                                                    <Input 
                                                        type="text" 
                                                        name="city"
                                                        value={this.state.address.city}
                                                        onChange={e => this.handleChangeAddress("city",e.target.value)}
                                                        />
                                                </Form.Item>
                                            </div>
                                        </Col>
                                        <Col lg={4} md={6} sm={12} xs={24}>
                                            <div className="gx-form-row0">
                                                <Form.Item label="Telefone">
                                                    <MaskedInput
                                                            mask={['(', /[1-9]/, /\d/,  ')', ' ', /\d/, /\d/, /\d/,/\d/,/\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                                                            className="ant-input"
                                                            placeholder="Ex:(DDD) 99999-9999"
                                                            guide={true}
                                                            id="my-input-id"
                                                            value={this.state.address.phone}
                                                            name="phone"
                                                            onBlur={() => {}}
                                                            onChange={e => this.handleChangeAddress("phone",e.target.value)}
                                                    />
                                                    {/* <Input 
                                                        type="text" 
                                                        name="phone"
                                                        value={this.state.address.phone}
                                                        onChange={e => this.handleChangeAddress("phone",e.target.value)}
                                                        /> */}
                                                </Form.Item>
                                            </div>
                                        </Col>
                                        <Col lg={4} md={6} sm={12} xs={24}>
                                            <div className="gx-form-row0">
                                                <Form.Item label="Email">
                                                    <Input 
                                                        type="text" 
                                                        name="email"
                                                        value={this.state.address.email}
                                                        onChange={e => this.handleChangeAddress("email",e.target.value)}
                                                        />
                                                </Form.Item>
                                            </div>
                                        </Col>
                                        <Col span={24}>
                                            <div className="gx-form-row0">
                                                {
                                                    this.state.canEdit === true ? 
                                                    <Button 
                                                    type="primary"
                                                    htmlType="submit"
                                                    onClick={this.handleEditAdressOntable}
                                                    >
                                                    Editar
                                                </Button>  
                                                :
                                                    <Button 
                                                    type="primary"
                                                    htmlType="submit"
                                                    disabled={false}
                                                    onClick={this.handleClickAddAddress}
                                                    >
                                                    Adicionar endereço
                                                    </Button>
                                                }
                                            </div>
                                        </Col>
                                    </Row>
                                </Form>
                            </Card>
                        </Form>
                    </Col>
                </Row>
            </div>
        )
    }
}

export default Form.create()(CustomerForm);