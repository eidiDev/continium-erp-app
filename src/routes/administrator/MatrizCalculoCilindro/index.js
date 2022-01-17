import React, { Component } from 'react';
import {
  Row,
  Col,
  Spin,
  message,
  Card,
  Form,
  Input,
  Select,
  Modal,
  Button,
  Table,
} from 'antd';
import List from './list';
import SimpleReactValidator from 'simple-react-validator';
import RightList from 'components/RightList';
import { save, get, destroy } from 'services/matrizCalculoCilindroService';

class MatrizCalculoCilindro extends Component {
  constructor() {
    super();
    this.state = {
      lo_bo_title: 'LO',
      isNew: true,
      loader: true,
      canNew: true,
      canSave: true,
      canDelete: false,
      loading: false,
      record: {
        codigo: '',
        description: '',
        tipo: 1,
      },
      item: {
        desenho: '',
        diametro: 0,
        lo_bo: 0,
        material: '',
        unidade: '',
      },
      tableList: [],
    };

    this.setStateNew = this.setStateNew.bind(this);

    this.leftList = React.createRef();

    this.validator = new SimpleReactValidator({
      locale: 'pt',
      messages: { default: `:attribute não pode estar vazio` },
    });
    this.handleChange = this.handleChange.bind(this);
    this.handleItemChange = this.handleItemChange.bind(this);
    this.onHandleClickSave = this.onHandleClickSave.bind(this);

    let auxthis = this;
    this.matrizColumns = [
      {
        title: 'Desenho',
        dataIndex: 'desenho',
        key: 'desenho',
      },
      {
        title: 'Diametro',
        dataIndex: 'diametro',
        key: 'diametro',
        sorter: (a, b) => a.diametro - b.diametro,
      },
      {
        title: 'LO/BO',
        dataIndex: 'lo_bo',
        key: 'lo_bo',
        sorter: (a, b) => a.lo_bo - b.lo_bo,
      },
      {
        title: 'Material',
        dataIndex: 'material',
        key: 'material',
      },
      {
        title: 'Unidade',
        dataIndex: 'unidade',
        key: 'unidade',
      },
      {
        title: 'Ações',
        key: 'action',
        render: (text, record) => (
          <div>
            <i
              className="icon icon-trash"
              style={{ marginRight: '10px' }}
              onClick={(e) => {
                Modal.confirm({
                  title: 'Tem certeza que deseja remover esta linha?',
                  onOk() {
                    auxthis.handleDeleteAddressRow(
                      record.desenho,
                      record.diametro,
                      record.lo_bo,
                      e
                    );
                    message.success('Item removido');
                  },
                  onCancel() {},
                });
              }}
            />
            <i
              className="icon icon-edit"
              style={{ marginLeft: '20px', marginRight: '10px' }}
              onClick={(e) => {
                auxthis.handleEditRow(record, e);
              }}
            />
          </div>
        ),
      },
    ];
  }

  handleChange(event) {
    let record = this.state.record;

    if (event.target === undefined) {
      record['tipo'] = event;
      if (event === 1) {
        this.setState({ lo_bo_title: 'LO' });
      } else {
        this.setState({ lo_bo_title: 'BO' });
      }
    } else {
      record[event.target.name] = event.target.value;
    }

    this.setState({ record });
  }

  handleItemChange(event) {
    let item = this.state.item;

    if (event.target === undefined) {
      item['tipo'] = event;
    } else {
      item[event.target.name] = event.target.value;
    }

    this.setState({ item });
  }

  onHandleClickSave = () => {
    if (this.validator.allValid()) {
      let tabelalista = this.state.tableList;
      var parent = this;

      this.setState({
        loading: true,
        loadingTip: 'Salvando registro, aguarde...',
      });

      let record = this.state.record;
      record.items_matriz = tabelalista;
      console.log(record);

      save({ record })
        .then((response) => {
          this.setState({
            loading: false,
            record: response.data,
          });
          message.success('Registro salva com sucesso!');
          parent.leftList.current.fetchLeftList();
        })
        .catch((err) => {
          this.setState({ loading: false });
          console.log(err);
        });
    } else {
      message.warning('Campos obrigatórios em branco!');
      this.validator.showMessages();
      this.forceUpdate();
    }
  };

  handleOnClickRow = (record, rowIndex) => {
    this.setState({ record: {}, tableList: [] });
    // var parent = this;
    //Primeria coisa ele seta loading para true
    this.setState({
      loading: true,
      loadingTip: 'Carregando registro, aguarde...',
    });

    get(record.id)
      .then((result) => {
        message.success('Registro carregada com sucesso!');
        console.log(result.data.items_matriz);
        this.setState({
          record: result.data,
          tableList:
            result.data.items_matriz === null ? [] : result.data.items_matriz,
          loading: false,
          canDelete: true,
        });
        console.log(this.state.canDelete);
        // parent.setStateEdit(result.data)
      })
      .catch(function (error) {
        message.error('Erro ao buscar registro, tente novamente mais tarde!');
        this.setState({ record: [], loading: false });
      });
  };

  onHandleClickDelete = () => {
    // console.log(this.state.model);
    console.log(this.state.record);
    let record = this.state.record;
    var parent = this;

    Modal.confirm({
      title: 'Tem certeza que deseja excluir esse registro?',
      onOk() {
        parent.setState({
          loading: true,
          loadingTip: 'Excluindo registro, aguarde...',
        });
        //Agora ele vai buscar o registro no servidor
        destroy(record.id)
          .then((result) => {
            //Caso consiga recuperar o model, ele atualiza a tela e para de carregar
            message.success('Registro excluido com sucesso!');
            parent.setState({
              record: {
                codigo: '',
                description: '',
                tipo: 1,
              },
              loading: false,
              canDelete: false,
            });
            parent.leftList.current.fetchLeftList();
          })
          .catch(function (error) {
            console.log(error);
            message.error(error.error);
          });
        parent.setStateNew();
      },
      onCancel() {
        //Nada acontece
      },
    });
  };

  handleAdd = () => {
    // let lista = this.state.tableList;
    let obj = this.state.item;
    // let last = lista[lista.length - 1];

    if (
      obj.desenho === '' ||
      obj.diametro === 0 ||
      obj.lo_bo === 0 ||
      obj.material === ''
    ) {
      message.error('Todos os campos são obrigatório');
      return;
    } else {
      let lista = this.state.tableList.filter(
        (item) =>
          item.desenho + '_' + item.diametro + '_' + item.lo_bo !==
          obj.desenho + '_' + obj.diametro + '_' + obj.lo_bo
      );

      let objLista = {
        desenho: obj.desenho,
        diametro: obj.diametro,
        lo_bo: obj.lo_bo,
        material: obj.material,
        unidade: obj.unidade,
      };

      lista.push(objLista);

      const listaOrdenada = lista.sort(function (a, b) {
        if (parseFloat(a.diametro) > parseFloat(b.diametro)) return -1;
        if (parseFloat(a.diametro) < parseFloat(b.diametro)) return 1;
        return 0;
      });

      this.setState({
        tableList: listaOrdenada,
      });

      message.success('Item adicionado!');

      this.setState({ item: {} });
    }
  };

  handleDeleteAddressRow(key, diam, lo_bo, e) {
    const adresses = this.state.tableList.filter(
      (item) =>
        item.desenho + '_' + item.diametro + '_' + item.lo_bo !==
        key + '_' + diam + '_' + lo_bo
    );
    this.setState({
      tableList: adresses,
    });
  }

  handleEditRow(record, e) {
    e.preventDefault();
    const adresses = this.state.tableList.find(
      (item) =>
        item.desenho === record.desenho && item.diametro === record.diametro
    );
    this.setState({ item: { ...adresses } });
  }

  setStateNew = () => {
    this.setState({
      isNew: true,
      loader: true,
      canNew: true,
      canSave: true,
      canDelete: false,
      loading: false,
      record: {
        codigo: '',
        description: '',
        tipo: 1,
      },
      item: {
        desenho: '',
        diametro: 0,
        lo_bo: 0,
        material: '',
        unidade: '',
      },
      tableList: [],
    });
  };

  render() {
    return (
      <Spin spinning={this.state.loading} tip={this.state.loadingTip}>
        <Row>
          <Col lg={5} md={5} sm={24} xs={24}>
            <List ref={this.leftList} onClickRow={this.handleOnClickRow} />
          </Col>
          <Col lg={15} md={15} sm={24} xs={24}>
            <div className="main">
              <Row>
                <Col span={24}>
                  <Form layout="horizontal" size="small">
                    <Card type="inner" title="Tabela de Haste / Camisa ">
                      <Row>
                        <Col lg={6} md={8} sm={12} xs={24}>
                          <div className="gx-form-row0">
                            <Form.Item label="Código" required={true}>
                              <Input
                                type="text"
                                value={this.state.record.codigo}
                                name="codigo"
                                disabled={this.state.isNew ? false : true}
                                onChange={this.handleChange}
                              />
                              {this.validator.message(
                                'codigo',
                                this.state.record.codigo,
                                'required',
                                { className: 'text-danger' }
                              )}
                            </Form.Item>
                          </div>
                        </Col>

                        <Col lg={12} md={12} sm={12} xs={24}>
                          <div className="gx-form-row0">
                            <Form.Item label="Descrição" required={true}>
                              <Input
                                type="text"
                                value={this.state.record.description}
                                name="description"
                                disabled={this.state.isNew ? false : true}
                                onChange={this.handleChange}
                              />
                              {this.validator.message(
                                'description',
                                this.state.record.description,
                                'required',
                                { className: 'text-danger' }
                              )}
                            </Form.Item>
                          </div>
                        </Col>
                        <Col lg={6} md={8} sm={12} xs={24}>
                          <div className="gx-form-row0">
                            <Form.Item label="Tipo">
                              <Select
                                // value={produtos.category === null ? "" : produtos.category }
                                onChange={this.handleChange}
                                value={this.state.record.tipo}
                                // style={{ width: 300 }}
                                defaultValue={1}
                              >
                                <Select.Option value={1}>Haste</Select.Option>
                                <Select.Option value={2}>Camisa</Select.Option>
                              </Select>
                            </Form.Item>
                          </div>
                        </Col>
                      </Row>
                    </Card>
                    <Card type="inner" title="Matriz">
                      <Row>
                        <Col lg={4} md={4} sm={12} xs={24}>
                          <div className="gx-form-row0">
                            <Form.Item label="Desenho">
                              <Input
                                value={this.state.item.desenho}
                                type="text"
                                name="desenho"
                                onChange={this.handleItemChange}
                              />
                            </Form.Item>
                          </div>
                        </Col>
                        <Col lg={3} md={3} sm={12} xs={24}>
                          <div className="gx-form-row0">
                            <Form.Item label="Diametro">
                              <Input
                                value={this.state.item.diametro}
                                type="text"
                                name="diametro"
                                onChange={this.handleItemChange}
                              />
                            </Form.Item>
                          </div>
                        </Col>
                        <Col lg={3} md={3} sm={12} xs={24}>
                          <div className="gx-form-row0">
                            <Form.Item label={this.state.lo_bo_title}>
                              <Input
                                value={this.state.item.lo_bo}
                                type="number"
                                step=".01"
                                min="0"
                                name="lo_bo"
                                onChange={this.handleItemChange}
                              />
                            </Form.Item>
                          </div>
                        </Col>
                        <Col lg={4} md={4} sm={12} xs={24}>
                          <div className="gx-form-row0">
                            <Form.Item label="Material">
                              <Input
                                value={this.state.item.material}
                                type="string"
                                name="material"
                                onChange={this.handleItemChange}
                              />
                            </Form.Item>
                          </div>
                        </Col>
                        <Col lg={4} md={4} sm={12} xs={24}>
                          <div className="gx-form-row0">
                            <Form.Item label="Unidade">
                              <Input
                                value={this.state.item.unidade}
                                type="string"
                                name="unidade"
                                onChange={this.handleItemChange}
                              />
                            </Form.Item>
                          </div>
                        </Col>
                        <Col lg={6} md={6} sm={12} xs={24}>
                          <div className="gx-form-row0">
                            <Button
                              type="primary"
                              style={{ marginTop: 40 }}
                              htmlType="submit"
                              disabled={false}
                              onClick={this.handleAdd}
                            >
                              Adicionar
                            </Button>
                          </div>
                        </Col>
                      </Row>
                      <Row>
                        <Col span={24}>
                          <Table
                            className="gx-table-responsive"
                            columns={this.matrizColumns}
                            dataSource={this.state.tableList}
                            size="small"
                            rowKey="id"
                            // style={{margin: '-15px -24px'}}
                          />
                        </Col>
                      </Row>
                    </Card>
                  </Form>
                </Col>
              </Row>
            </div>
          </Col>
          <Col lg={4} md={4} sm={24} xs={24}>
            <RightList
              title={'Ações'}
              onHandleClickNew={this.setStateNew}
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
export default MatrizCalculoCilindro;
