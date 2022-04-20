import React, { Component } from 'react';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Button,
  message,
  Spin,
  Modal,
  Select,
  Upload,
  Checkbox
} from 'antd';
import { Icon } from '@ant-design/compatible';
import api from 'util/Api';
import history from 'util/history';
import LeftListProd from './ListProducts';
import SimpleReactValidator from 'simple-react-validator';
import SubGrupoMatriz from 'components/SubGrupoMatriz';
import DesenhoMatriz from 'components/DesenhoMatriz';
// import FileManager from 'reactjs-file-uploader';

const model2 = 'Category';
const model = 'Product';
// const fs = require('fs');
const { TextArea } = Input;
const { Option } = Select;
//const url_api = 'http://192.168.153.130:1337/';

// function getBase64(file) {
//   return new Promise((resolve, reject) => {
//     // console.log(file);
//     const reader = new FileReader();
//     try {
//       reader.readAsDataURL(file);
//       reader.onload = () => resolve(reader.result);
//       reader.onerror = (error) => reject(error);
//     } catch (err) {
//       console.log(err);
//       // message.error('Erro ao adicionar apontamento, erro: '+err);
//     }
//   });
// }

class Produtos extends Component {
  constructor() {
    super();
    this.state = {
      isNew: true,
      loader: true,
      produtos: {
        category: 5,
        is_active: true
      },
      canNew: true,
      canSave: true,
      canDelete: false,
      loading: false,
      loadingImg: false,
      listofcateg: [],
      imagem: {},
      previewVisible: false,
      previewImage: '',
      fileList: [],
      filePrincipalList: [],
      progress: 0,
      aux: 0,
    };

    this.handleChange = this.handleChange.bind(this);
    this.leftListChild = React.createRef();
    this.validator = new SimpleReactValidator({
      locale: 'pt',
      messages: { default: `:attribute não pode estar vazio` },
    });
  }

  componentWillMount() {
    this.getCategs();
  }

  handleChangeImgList = (file, id) => {
    if (file.file.status === 'uploading') {
      this.setState({
        fileList: file.fileList,
      });
    }
    if (file.file.status === 'done') {
      api
        .get('/updateSecondList', { params: this.state.produtos })
        .then((resposta) => {
          this.setState({ fileList: resposta.data[0] });
          message.success(`${file.file.name} file uploaded successfully`);
        })
        .catch((err) => {});
    } else if (file.file.status === 'error') {
      this.setState({
        fileList: file.fileList,
      });
      message.error(`${file.file.name} file upload failed.`);
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
      await api.post(`/uploadAvatar/${this.state.produtos.id}`, fmData, config);

      onSuccess('Ok');
      // console.log('server res: ', res);
    } catch (err) {
      console.log('Error: ', err);
      // const error = new Error('Some error');
      onError({ err });
    }
  };

  customReqSecondList = async (options) => {
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

    fmData.append('arquivos', file);
    try {
      await api.post(
        `/uploadManyFiles/${this.state.produtos.id}`,
        fmData,
        config
      );

      onSuccess('Ok');
      // console.log('server res: ', res);
    } catch (err) {
      console.log('Eroor: ', err);
      // const error = new Error('Some error');
      onError({ err });
    }
  };

  handleChangeImgListPrincipal = (file, id) => {
    if (file.file.status === 'uploading') {
      this.setState({
        filePrincipalList: file.fileList,
      });
    }
    if (file.file.status === 'done') {
      api
        .get('/updateMainFileList', { params: this.state.produtos })
        .then((resposta) => {
          this.setState({ filePrincipalList: resposta.data });
          message.success(`${file.file.name} file uploaded successfully`);
        })
        .catch((err) => {});
    } else if (file.file.status === 'error') {
      this.setState({
        filePrincipalList: file.fileList,
      });
      message.error(`${file.file.name} file upload failed.`);
    }

    // const produto = {
    //     id: id
    // }
    // let formData = new FormData();

    // formData.append('avatar', file.file.originFileObj);

    // let jso = JSON.stringify(produto);
    // formData.append('produto', jso)

    // if(id === undefined){
    // }else{
    //     api.post(`/uploadAvatar`, formData , {headers: { 'Content-Type': 'multipart/form-data' } })
    //     .then((result) => {

    //         api.get('/updateMainFileList', {params: produto }).then( (resposta) => {
    //              this.setState({ filePrincipalList: resposta.data });
    //         }).catch((err)=> {

    //         });
    //     },)
    //     .catch(function(error) {
    //         console.log(error);
    //     });
    // }
  };

  handleChange(event) {
    let auxlist = this.state.listofcateg;

    // console.log(event);
    let newProd = this.state.produtos;
    if (event.target === undefined) {
      auxlist.map((b) => {
        if (b.id === event) {
          newProd['category'] = b.id;
        }
        return '';
      });
    } else {
      newProd[event.target.name] = event.target.value;
    }

    this.setState(() => ({
      produtos: newProd,
    }));
  }

  handleSubGrupo = (selectedOption) => {
    let newProd = this.state.produtos;
    newProd.subgrupomatriz = selectedOption;
    this.setState(() => ({ produtos: newProd }));
  };

  handleDesenho = (e) => {
    let newProd = this.state.produtos;

    console.log('desenhoHaste', e);
    // let newProd = this.state.produtos;
    // newProd.desenhoHaste = selectedOption;

    // //Calculo
    // const subgrupo = newProd.subgrupomatriz;
    // const desenho = e.selectedOption;
    // const diametro = newProd.cod.split('.')[1];
    const curso = newProd.cod.split('.')[2];
    const lo = e.lo;
    console.log('lo', lo);
    console.log('curso', curso);
    const valor = parseFloat(lo) + parseInt(curso);
    console.log('valor', valor);

    switch (e.name) {
      case 'desenhoHaste':
        newProd.desenhoHaste = e.selectedOption;
        newProd.tamanhoHaste = isNaN(valor) ? 0 : valor;
        newProd.materialHaste = e.material;
        newProd.unidadeHaste = e.unidade;
        break;
      case 'desenhoCamisa':
        newProd.desenhoCamisa = e.selectedOption;
        newProd.tamanhoCamisa = isNaN(valor) ? 0 : valor;
        newProd.materialCamisa = e.material;
        newProd.unidadeCamisa = e.unidade;
        break;
      default:
        break;
    }
    this.setState(() => ({ produtos: newProd }));
  };

  handleDesenhoCamisa = (selectedOption) => {
    let newProd = this.state.produtos;
    newProd.desenhoCamisa = selectedOption;
    this.setState(() => ({ produtos: newProd }));
  };

  getCategs() {
    api
      .get(`${model2}/`, {
        params: {
          params: [
            {
              field: 'status',
              value: true,
              op: '=',
            },
          ],
        },
      })
      .then((result) => {
        let dataCateg = [];
        dataCateg = result.data.data;

        this.setState({
          listofcateg: dataCateg,
        });
        //Caso consiga recuperar o model, ele atualiza a tela e para de carregar
        // console.log(result.data.adresses);
        // console.log(result.adresses);
        // message.success('Cliente carregado com sucesso!');
        // parent.setStateEdit(result.data)
      })
      .catch(function (error) {
        console.log(error);
        // message.error('Erro ao buscar registro, tente novamente mais tarde!');
        // parent.setStateNew()
      });
  }

  onHandleClickSave = () => {
    if (this.validator.allValid()) {
      let record = this.state.produtos;
      var parent = this;
      // let fileList = this.state.fileList;
      // let filePrincipal = this.state.filePrincipalList;

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

        // if(imagem === null || imagem === undefined){
        //     record.image = undefined
        // }else{
        //     record.image = imagem;
        // }

        // record = Object.assign({},record)
      }
      // console.log('onHandleSaveButton', record);
      // let data1 = new FormData();

      // let myJSON = JSON.stringify(record);
      // data1.append("image", File );
      // console.log(data1);
      // data1.append("data", myJSON);
      const {
        cod,
        description1,
        category,
        description2,
        description3,
        obs,
        price,
        unity,
        subgrupomatriz,
        desenhoHaste,
        tamanhoHaste,
        desenhoCamisa,
        tamanhoCamisa,
        materialCamisa,
        materialHaste,
        unidadeCamisa,
        unidadeHaste,
        is_active
      } = record;

      //var myJSON = JSON.stringify(fileList);

      api({
        method: METHOD,
        url: URL,
        // data: {
        //         name: record.name,
        //         lastname: record.lastname,
        //         cnpj: record.cnpj
        //     }
        data: {
          cod: cod,
          description1: description1,
          category: category,
          description2: description2,
          description3: description3,
          obs: obs,
          price: price,
          unity: unity,
          subgrupomatriz: subgrupomatriz !== '' ? subgrupomatriz : null,
          desenhoHaste: desenhoHaste,
          tamanhoHaste: tamanhoHaste,
          desenhoCamisa: desenhoCamisa,
          tamanhoCamisa: tamanhoCamisa,
          materialCamisa: materialCamisa,
          materialHaste: materialHaste,
          unidadeCamisa: unidadeCamisa,
          unidadeHaste: unidadeHaste,
          is_active
        },
      })
        .then((result) => {
          //Caso consiga recuperar o model, ele atualiza a tela e para de carregar
          message.success('Produto salvo com sucesso!');
          // if(parent.state.isNew === true){
          //     let id = result.data.category;
          //     result.data.category = {
          //         id: id
          //     }
          // }
          // console.log(result);
          parent.setStateEdit(result.data);
          parent.leftListChild.current.fetchLeftList();
        })
        .catch(function (error) {
          console.log(error);
          if (error.response.data.error.status === 500) {
            message.error('O sistema já contem um produto com este código, Tente Novamente');
          } else {
            message.error('Erro ao gravar registro, Tente Novamente');
          }
          parent.setStateNew();

        });
    } else {
      message.warning('Campos obrigatórios em branco!');
      this.validator.showMessages();
      this.forceUpdate();
    }
  };

  handleDownload = async (file) => {
    console.log('file', file);

    api
      .get(`/getFiles`, {
        params: file,
      })
      .then((result) => {
        // console.log(result);

        window.open(result.data.url_link);
      })
      .catch(function (error) {
        console.log(error);

        message.error('Erro ao buscar registro, tente novamente mais tarde!');
        //parent.setStateEdit(record)
      });
  };

  handleRemove = (file, id) => {
    // console.log(file);

    if (file.status === 'error') {
      this.setState({
        filePrincipalList: [],
      });
    } else {
      api
        .post('/removeFiles', { file: file, prod: id })
        .then((result) => {
          // console.log(result);
          this.setState({
            filePrincipalList: result.data.principalArch,
          });
        })
        .catch((error) => {});
    }
  };

  handleRemoveSecondList = (file, id) => {
    if (file.status === 'error') {
      this.setState({
        fileList: [],
      });
    } else {
      api
        .post('/removeFileOfSecondList', { file: file, prod: id })
        .then((result) => {
           console.log(result);
          this.setState({
            fileList: result.data.listadefile,
          });
        })
        .catch((error) => {});
    }
  };

  onChangeCheck = (event) => {
    let newstepXprod = this.state.produtos;
    newstepXprod['is_active'] = event.target.checked;
    this.setState({
      produtos: newstepXprod,
    });
  };

  Content = (produtos, categs) => {
    return (
      <div className="main">
        <Row>
          <Col span={24}>
            <Form layout="horizontal">
              <Card type="inner" title="Cadastro de Produtos">
                <Row>
                  <Col lg={6} md={6} sm={12} xs={24}>
                    <div className="gx-form-row0">
                      <Form.Item label="Código" required={true}>
                        <Input
                          type="text"
                          value={produtos.cod}
                          // disabled={this.state.isNew ? false : true}
                          name="cod"
                          onChange={this.handleChange}
                        />
                        {this.validator.message(
                          'cod',
                          produtos.cod,
                          'required',
                          { className: 'text-danger' }
                        )}
                      </Form.Item>
                    </div>
                  </Col>
                  <Col lg={6} md={6} sm={12} xs={24}>
                    <div className="gx-form-row0">
                      <Form.Item label="Grupo" required={true}>
                        <Select
                          showSearch
                          name="grupo"
                          value={
                            produtos.category === null ? '' : produtos.category
                          }
                          onChange={this.handleChange}
                          // style={{ width: 300 }}
                          filterOption={(inputValue, option) =>
                            option.props.children[0]
                              .concat(
                                option.props.children[1],
                                option.props.children[2]
                              )
                              .toUpperCase()
                              .indexOf(inputValue.toUpperCase()) !== -1
                          }
                        >
                          {categs.map((b) => {
                            return (
                              <Option key={b.id} value={b.id}>
                                {b.cod} - {b.description}
                              </Option>
                            );
                          })}
                        </Select>
                        {this.validator.message(
                          'grupo',
                          produtos.category,
                          'required',
                          { className: 'text-danger' }
                        )}
                      </Form.Item>
                    </div>
                  </Col>

                  {/* <Col lg={6} md={6} sm={12} xs={24}>
                    <div className="gx-form-row0">
                      <SubGrupoMatriz
                        label="Sub grupo"
                        // tipo={1}
                        value={produtos.subgrupomatriz}
                        onChange={this.handleSubGrupo}
                      />
                    </div>
                  </Col> */}

                  
                  <Col lg={12} md={12} sm={12} xs={24}>
                    <div className="gx-form-row0">
                      <Form.Item label="Descrição" required={true}>
                        <TextArea
                          type="text"
                          value={produtos.description1}
                          // style={{width: "500px"}}
                          name="description1"
                          onChange={this.handleChange}
                          // autoSize={{ minRows: 3, maxRows: 7 }}
                        />
                        {this.validator.message(
                          'description1',
                          produtos.description1,
                          'required',
                          { className: 'text-danger' }
                        )}
                      </Form.Item>
                    </div>
                  </Col>

                  <Col lg={1} md={1} sm={12} xs={24}>
                    <div className="gx-form-row0">
                      <Form.Item label="Ativo">
                        <Checkbox
                          checked={produtos.is_active}
                          onChange={this.onChangeCheck}
                        />
                      </Form.Item>
                    </div>
                  </Col>
                </Row>
              </Card>
              <Row style={{ marginRight: '-8px', paddingLeft: '7px' }}>
                <Col span={12}>
                  <Card type="inner" title="Arquivo Principal">
                    <Row>
                      <div className="clearfix">
                        <Upload
                          disabled={!this.state.canDelete}
                          customRequest={this.customReq}
                          fileList={this.state.filePrincipalList}
                          onChange={(file) =>
                            this.handleChangeImgListPrincipal(
                              file,
                              this.state.produtos.id
                            )
                          }
                          onPreview={this.handleDownload}
                          onRemove={(file) =>
                            this.handleRemove(file, this.state.produtos.id)
                          }
                        >
                          <Button disabled={!this.state.canDelete}>
                            <Icon type="upload" /> Click to Upload
                          </Button>
                        </Upload>
                        {/* {this.state.progress > 0 ? <Progress percent={this.state.progress} /> : null} */}
                        {/* <Upload
                                                showUploadList={{showDownloadIcon: true}}
                                                action={"https://www.mocky.io/v2/5cc8019d300000980a055e76"}
                                                listType="picture-card"
                                                fileList={filePrincipalList}
                                                onDownload={this.handleDownload}
                                                onPreview={this.handlePreview}
                                                onChange={this.handleChangeImgListPrincipal}
                                            >
                                                {filePrincipalList  !== null && filePrincipalList.length === 1 ? null : uploadButtonPrincipal}
                                            </Upload>
                                            <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                                                <img
                                                    alt="Imagem"
                                                    //style={{ width: '100%' }}
                                                    src={previewImage} />
                                            </Modal> */}
                      </div>
                    </Row>
                  </Card>
                </Col>
                <Col span={12}>
                  <Card type="inner" title="Outros Arquivos">
                    <Row>
                      <div className="clearfix">
                        <Upload
                          disabled={!this.state.canDelete}
                          customRequest={this.customReqSecondList}
                          fileList={this.state.fileList}
                          onChange={(file) =>
                            this.handleChangeImgList(
                              file,
                              this.state.produtos.id
                            )
                          }
                          onPreview={this.handleDownload}
                          onRemove={(file) =>
                            this.handleRemoveSecondList(
                              file,
                              this.state.produtos.id
                            )
                          }
                        >
                          <Button disabled={!this.state.canDelete}>
                            <Icon type="upload" /> Click to Upload
                          </Button>
                        </Upload>

                        {/* <Upload
                                                showUploadList={{showDownloadIcon: true}}
                                                action={"https://www.mocky.io/v2/5cc8019d300000980a055e76"}
                                                listType="picture-card"
                                                fileList={fileList}
                                                onDownload={this.handleDownload}
                                                onPreview={this.handlePreview}
                                                onChange={this.handleChangeImgList}
                                            >
                                            {fileList !== null && fileList.length >= 8 ? null : uploadButton}
                                            </Upload>
                                            <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                                                <img
                                                    alt="Imagem"
                                                    style={{ width: '100%' }}
                                                    src={previewImage}
                                                />
                                            </Modal> */}
                      </div>
                    </Row>
                  </Card>
                </Col>
              </Row>
              <Card type="inner" title="Dados gerais">
                <Row>
                  <Col lg={6} md={6} sm={12} xs={24}>
                    <div className="gx-form-row0">
                      <Form.Item label="Unidade" required={true}>
                        <Input
                          type="text"
                          value={produtos.unity}
                          name="unity"
                          placeholder="Unidade"
                          onChange={this.handleChange}
                        />
                        {this.validator.message(
                          'unity',
                          produtos.unity,
                          'required|alpha_num_dash_space',
                          { className: 'text-danger' }
                        )}
                      </Form.Item>
                    </div>
                  </Col>
                  <Col lg={6} md={6} sm={12} xs={24}>
                    <div className="gx-form-row0">
                      <Form.Item label="Descrição 2">
                        <Input
                          type="text"
                          value={produtos.description2}
                          placeholder="Descrição"
                          name="description2"
                          onChange={this.handleChange}
                        />
                      </Form.Item>
                    </div>
                  </Col>

                  <Col lg={6} md={6} sm={12} xs={24}>
                    <div className="gx-form-row0">
                      <Form.Item label="Descrição 3">
                        <Input
                          type="text"
                          value={produtos.description3}
                          placeholder="Descrição"
                          name="description3"
                          onChange={this.handleChange}
                        />
                      </Form.Item>
                    </div>
                  </Col>
                </Row>
                <Row>
                  {/* <Col lg={6} md={6} sm={12} xs={24}>
                    <div className="gx-form-row0">
                      <DesenhoMatriz
                        label="Desenho Haste"
                        tipo={1}
                        subgrupomatriz={produtos.subgrupomatriz}
                        diametro={
                          produtos.cod !== undefined
                            ? produtos.cod.split('.')[1]
                            : '0'
                        }
                        value={produtos.desenhoHaste}
                        onChange={this.handleDesenho}
                        name="desenhoHaste"
                      />
                    </div>
                  </Col>
                  <Col lg={6} md={6} sm={12} xs={24}>
                    <div className="gx-form-row0">
                      <DesenhoMatriz
                        label="Desenho Camisa"
                        tipo={2}
                        subgrupomatriz={produtos.subgrupomatriz}
                        diametro={
                          produtos.cod !== undefined
                            ? produtos.cod.split('.')[1]
                            : '0'
                        }
                        value={produtos.desenhoCamisa}
                        onChange={this.handleDesenho}
                        name="desenhoCamisa"
                      />
                    </div>
                  </Col>
                  <Col lg={4} md={4} sm={12} xs={24}>
                    <div className="gx-form-row0">
                      <Form.Item label="Comprimento Haste">
                        <Input
                          type="text"
                          disabled
                          value={produtos.tamanhoHaste}
                        />
                      </Form.Item>
                    </div>
                  </Col>
                  <Col lg={4} md={4} sm={12} xs={24}>
                    <div className="gx-form-row0">
                      <Form.Item label="Unidade Haste">
                        <Input
                          type="text"
                          disabled
                          value={produtos.unidadeHaste}
                        />
                      </Form.Item>
                    </div>
                  </Col>
                  <Col lg={4} md={4} sm={12} xs={24}>
                    <div className="gx-form-row0">
                      <Form.Item label="Comprimento Camisa">
                        <Input
                          type="text"
                          disabled
                          value={produtos.tamanhoCamisa}
                        />
                      </Form.Item>
                    </div>
                  </Col>
                  <Col lg={4} md={4} sm={12} xs={24}>
                    <div className="gx-form-row0">
                      <Form.Item label="Unidade Camisa">
                        <Input
                          type="text"
                          disabled
                          value={produtos.unidadeCamisa}
                        />
                      </Form.Item>
                    </div>
                  </Col>
                  <Col lg={4} md={4} sm={12} xs={24}>
                    <div className="gx-form-row0">
                      <Form.Item label="Material Haste">
                        <Input
                          type="text"
                          disabled
                          value={produtos.materialHaste}
                        />
                      </Form.Item>
                    </div>
                  </Col>
                  <Col lg={4} md={4} sm={12} xs={24}>
                    <div className="gx-form-row0">
                      <Form.Item label="Material Camisa">
                        <Input
                          type="text"
                          disabled
                          value={produtos.materialCamisa}
                        />
                      </Form.Item>
                    </div>
                  </Col> */}
                  <Col lg={12} md={12} sm={24} xs={24}>
                    <div className="gx-form-row0">
                      <Form.Item label="Observação">
                        <TextArea
                          type="text"
                          value={produtos.obs}
                          name="obs"
                          onChange={this.handleChange}
                          placeholder="Controlled autosize"
                          autoSize={{ minRows: 3, maxRows: 5 }}
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

  setStateEdit = (model) => {
    if (model.categoryObj !== null) {
      model.categoryObj = model.category;
    }

    if (model.subgrupomatrizObj !== null) {
      model.subgrupomatrizObj = model.subgrupomatriz;
    } else {
      model.subgrupomatriz = '';
    }

    this.setState({
      canSave: true,
      canNew: true,
      canDelete: true,
      produtos: model,
      fileList: model.listadefile,
      filePrincipalList: [],
      loading: false,
      imageUrl: null,
      isNew: false,
    });

    if (model.principalArch !== undefined && model.principalArch !== null) {
      this.setState({
        filePrincipalList:
          model.principalArch.length === 0 ? [] : [model.principalArch],
      });
    }
  };

  setStateNew = () => {
    this.setState({
      canSave: true,
      canNew: true,
      canDelete: false,
      produtos: {
        category: 5,
        is_active: true
      },
      fileList: [],
      filePrincipalList: [],
      loading: false,
      imageUrl: null,
      isNew: true,
      refreshLeftList: false,
    });
  };

  onHandleClickNew = () => {
    this.setStateNew();
  };

  handleOnClickRow1 = (record, rowIndex) => {
    // console.log(record);
    var parent = this;
    //Primeria coisa ele seta loading para true
    this.setState({
      loading: true,
      loadingTip: 'Carregando registro, aguarde...',
    });

    //Coloquei esse timeout de 1 segundo para simular o carregamento
    setTimeout(function () {
      //Agora ele vai buscar o registro no servidor
      api
        .get(`${model}/${record.id}`, {})
        .then((result) => {
          //Caso consiga recuperar o model, ele atualiza a tela e para de carregar
          // console.log(result.data);
          // console.log(result.adresses);

          message.success('Produto carregado com sucesso!');
          parent.setStateEdit(result.data);
        })
        .catch(function (error) {
          message.error('Erro ao buscar registro, tente novamente mais tarde!');
          parent.setStateEdit(record);
        });
    }, 1000);
  };

  onHandleClickDelete = () => {
    // console.log(this.state.model);
    let record = this.state.produtos;
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
              // console.log(result);
              message.success('Registro excluido com sucesso!');
              parent.setStateNew();
              parent.leftListChild.current.fetchLeftList();
            })
            .catch(function (error) {
              console.log(error.response.data.message);
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

  LeftList = () => {
    return (
      <LeftListProd
        onClickRow={this.handleOnClickRow1}
        ref={this.leftListChild}
      />
    );
  };

  onCancel = () => {
    history.replace('/dashboard');
    document.location.reload(true);
  };

  render() {
    // console.log(this.state.produtos);
    return (
      <Spin spinning={this.state.loading} tip={this.state.loadingTip}>
        <Row>
          <Col lg={5} md={5} sm={24} xs={24}>
            {this.LeftList()}
          </Col>
          <Col lg={15} md={15} sm={24} xs={24}>
            {this.Content(this.state.produtos, this.state.listofcateg)}
          </Col>
          <Col lg={4} md={4} sm={24} xs={24}>
            <Card type="inner" title="Produtos">
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
                disabled={!this.state.canSave}
                onClick={this.onHandleClickSave}
              >
                Salvar
              </Button>
              <br />
              <Button
                block
                disabled={!this.state.canDelete}
                type="primary"
                className="gx-btn-red"
                onClick={this.onHandleClickDelete}
              >
                Excluir
              </Button>

              {/* <Button block type="default" onClick={this.onCancel}>
                Cancelar
              </Button> */}
            </Card>
          </Col>
        </Row>
      </Spin>
    );
  }
}

export default Produtos;
