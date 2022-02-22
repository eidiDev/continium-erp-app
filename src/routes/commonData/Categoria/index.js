import React, { Component } from 'react';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  message,
  Spin,
  Modal,
  Checkbox,
} from 'antd';
import history from '../../../util/history';
import SimpleReactValidator from 'simple-react-validator';
import ListUsers from './ListCategorias';
import RightList from '../../../components/RightList';
import api from '../../../util/Api';
// import MatrizCalculoCilindro from 'components/MatrizCalculoCilindro';
//import IntlMessages from "../../../util/IntlMessages";
//import {getUser} from "../../../appRedux/actions/Auth";

const { TextArea } = Input;
const model = 'Category';
//const TabPane = Tabs.TabPane
// const FormItem = Form.item

// const menu = (
// 	<Menu>
// 	  <Menu.Item key="1">Imprimir</Menu.Item>
// 	  <Menu.Item key="2">Anexos</Menu.Item>
// 	</Menu>
// );

class Categoria extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isNew: true,
      loader: true,
      categ: {
        status: false,
        camisa: '',
        haste: '',
      },
      canNew: true,
      canSave: true,
      canDelete: false,
      loading: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.setStateNew = this.setStateNew.bind(this);
    this.onHandleClickSave = this.onHandleClickSave.bind(this);

    this.onHandleClickDelete = this.onHandleClickDelete.bind(this);
    this.onHandleClickNew = this.onHandleClickNew.bind(this);
    // this.handleSubmit = this.handleSubmit.bind(this);

    this.validator = new SimpleReactValidator({
      locale: 'pt',
      messages: { default: `:attribute não pode estar vazio` },
    });
    this.leftListChild = React.createRef();
    console.log('Constructor ----');
  }

  onHandleClickNew = () => {
    this.setStateNew();
  };

  handleOnClickRow1 = (record, rowIndex) => {
    var parent = this;
    //Primeria coisa ele seta loading para true
    this.setState({
      loading: true,
      loadingTip: 'Carregando registro, aguarde...',
    });
    //Agora ele vai buscar o registro no servidor
    api
      .get(`${model}/${record.id}`, {})
      .then((result) => {
        //Caso consiga recuperar o model, ele atualiza a tela e para de carregar
        // console.log(result.data.adresses);
        // console.log(result.adresses);
        message.success('Categoria carregada com sucesso!');
        parent.setStateEdit(result.data);
      })
      .catch(function (error) {
        // console.log(error);
        message.error('Erro ao buscar registro, tente novamente mais tarde!');
        parent.setStateNew();
      });
  };

  onHandleClickSave = () => {
    if (this.validator.allValid()) {
      let record = this.state.categ;
      var parent = this;

      this.setState({
        loading: true,
        loadingTip: 'Salvando registro, aguarde...',
      });
      //Verifica se é uma atualizacao (PUT) ou novo registro (POST)
      let METHOD = 'PATCH';
      let URL = `${model}/${record.id}`;

      if (parent.state.isNew) {
        METHOD = 'POST';
        URL = `${model}`;
        // record = Object.assign({},record)
      }
      // console.log('onHandleSaveButton', record);
      const { cod, description, obs, status, camisa, haste } = record;

      api({
        method: METHOD,
        url: URL,
        data: {
          cod: cod,
          description: description,
          obs: obs,
          status: status,
          camisa: camisa,
          haste: haste,
        },
      })
        .then((result) => {
          //Caso consiga recuperar o model, ele atualiza a tela e para de carregar
          message.success('Categoria salva com sucesso!');
          // console.log(result.data);
          parent.setStateEdit(result.data);
          parent.leftListChild.current.fetchLeftList();
        })
        .catch(function (error) {
          console.log(error);
          parent.setStateEdit(record);
          message.error('Erro ao gravar registro, tente novamente mais tarde!');
        });
    } else {
      message.warning('Campos obrigatórios em branco!');
      this.validator.showMessages();
      this.forceUpdate();
    }
  };

  onCancel = () => {
    history.replace('/dashboard');
    document.location.reload(true);
  };

  onChangeCheck = (event) => {
    let newCateg = this.state.categ;
    newCateg['status'] = event.target.checked;
    this.setState({
      categ: newCateg,
    });
  };

  onHandleClickDelete = () => {
    // console.log(this.state.model);
    let record = this.state.categ;
    var parent = this;

    Modal.confirm({
      title: 'Tem certeza que deseja excluir esse registro?',
      onOk() {
        parent.setState({
          loading: true,
          loadingTip: 'Excluindo registro, aguarde...',
        });
        setTimeout(function () {
          //Agora ele vai buscar o registro no servidor
          let METHOD = 'DELETE';
          let URL = `${model}/${record.id}`;
          api({
            method: METHOD,
            url: URL,
          })
            .then((result) => {
              //Caso consiga recuperar o model, ele atualiza a tela e para de carregar
              message.success('Registro excluido com sucesso!');
              parent.setStateNew();
              parent.leftListChild.current.fetchLeftList();
            })
            .catch(function (error) {
              // console.log(error);
              message.error(error.response.data.message);
            });
        }, 1000);
        parent.setStateNew();
      },
      onCancel() {
        //Nada acontece
      },
    });
  };

  setStateNew = () => {
    this.setState({
      canSave: true,
      canNew: true,
      canDelete: false,
      categ: {
        status: false,
      },
      loading: false,
      isNew: true,
      refreshLeftList: false,
    });
  };
  //Seta o estado para edição
  setStateEdit = (model) => {
    console.log(model);
    let newModel = model;

    newModel.camisa = model.camisa ? model.camisa.id : undefined;
    newModel.haste = model.haste ? model.haste.id : undefined;
    // console.log(model.camisa.id);
    console.log(newModel);
    // const { haste } = model.haste.id;

    // console.log(camisa,haste);

    // model.camisa = camisa;
    // model.haste = haste;
    // console.log(model);
    this.setState({
      canSave: true,
      canNew: true,
      canDelete: true,
      categ: newModel,
      loading: false,
      isNew: false,
    });
  };

  handleChange(event) {
    // alert(event.target.name,event);
    let newCateg = this.state.categ;
    newCateg[event.target.name] = event.target.value;

    this.setState(() => ({
      categ: newCateg,
    }));
  }

  handleCamisa = (selectedOption) => {
    let newCateg = this.state.categ;
    newCateg.camisa = selectedOption;
    this.setState(() => ({ categ: newCateg }));
  };

  handleHaste = (selectedOption) => {
    let newCateg = this.state.categ;
    newCateg.haste = selectedOption;
    this.setState(() => ({ categ: newCateg }));
  };

  LeftList = () => {
    return (
      <ListUsers onClickRow={this.handleOnClickRow1} ref={this.leftListChild} />
    );
  };

  Content = (categ) => {
    return (
      <div className="main">
        <Row>
          <Col span={24}>
            <Form layout="horizontal">
              <Card type="inner" title="Cadastro de grupos">
                <Row>
                  <Col lg={6} md={6} sm={12} xs={24}>
                    <div className="gx-form-row0">
                      <Form.Item label="Código" required={true}>
                        <Input
                          type="text"
                          value={categ.cod}
                          name="cod"
                          // disabled={this.state.isNew ? false : true}
                          onChange={this.handleChange}
                        />
                        {this.validator.message(
                          'cod',
                          categ.cod,
                          'required|string',
                          { className: 'text-danger' }
                        )}
                      </Form.Item>
                    </div>
                  </Col>
                  <Col lg={6} md={6} sm={12} xs={24}>
                    <div className="gx-form-row0">
                      <Form.Item label="Descrição" required={true}>
                        <Input
                          type="text"
                          value={categ.description}
                          name="description"
                          onChange={this.handleChange}
                        />
                        {this.validator.message(
                          'description',
                          categ.description,
                          'required|string',
                          { className: 'text-danger' }
                        )}
                      </Form.Item>
                    </div>
                  </Col>
                  <Col lg={2} md={2} sm={12} xs={24}>
                    <div className="gx-form-row0">
                      <Form.Item label="Ativo">
                        <Checkbox
                          checked={this.state.categ.status}
                          onChange={this.onChangeCheck}
                        ></Checkbox>
                      </Form.Item>
                    </div>
                  </Col>
                  <Col lg={12} md={12} sm={12} xs={24}>
                    <div className="gx-form-row0">
                      <Form.Item label="Observação">
                        {/* <Input
                                                    type="text"
                                                    value={categ.description}
                                                    name="description"
                                                    onChange={this.handleChange}/> */}
                        <TextArea
                          type="text"
                          value={categ.obs}
                          name="obs"
                          onChange={this.handleChange}
                          style={{ width: '500px' }}
                          autoSize={{ minRows: 3, maxRows: 7 }}
                        />
                      </Form.Item>
                    </div>
                  </Col>
                </Row>
              </Card>
            </Form>
          </Col>
        </Row>
      </div>
    );
  };

  render() {
    return (
      <Spin spinning={this.state.loading} tip={this.state.loadingTip}>
        <Row>
          <Col lg={5} md={5} sm={24} xs={24}>
            {this.LeftList()}
          </Col>
          <Col lg={15} md={15} sm={24} xs={24}>
            {this.Content(this.state.categ)}
          </Col>
          <Col lg={4} md={4} sm={24} xs={24}>
            <RightList
              title={'Grupos'}
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
    );
  }
}

export default Categoria;
