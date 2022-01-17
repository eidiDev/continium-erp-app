import React, { Component } from 'react';
import { Card, Table, Tag, Spin } from 'antd';
import moment from 'moment';
import EllipsisTooltip from 'components/EllipsisTooltip';
// var _ = require('lodash');
// import api from '../../../util/Api';

const columns = [
  {
    title: 'Pedido Venda',
    dataIndex: 'Número',
    width: 100,
    key: 'key',
    align: 'center',
    // render: (text) => <text>{text}</text>
  },
  // {
  //   title: 'Fornecedor',
  //   dataIndex: 'Fornecedor',
  //   width: 100,
  //   key: 'key',
  //   align: 'center',
  //   // render: (text) => <text>{text}</text>
  // },
  {
    title: 'Pedido Cliente',
    dataIndex: 'Pedido do Cliente',
    // key:'Pedido do Cliente'
  },
  {
    title: 'Emissão',
    dataIndex: 'Emissão',
    //  key:'Emissão',
    render: (text) => moment(text).format('DD-MM-YYYY'),
  },
  {
    title: 'Cliente',
    dataIndex: 'Empresa',
    //  key:'Empresa'
  },
  {
    title: 'Código Produto',
    dataIndex: 'Produto',
    //  key:'Produto'
  },
  {
    title: 'Descrição',
    dataIndex: 'LINHA01',
    //   key:'LINHA01',

    onCell: () => {
      return {
        style: {
          whiteSpace: 'nowrap',
          maxWidth: 150,
        },
      };
    },
    render: (text, obj) => (
      <EllipsisTooltip title={obj.LINHA01 + ' ' + obj.LINHA02}>
        {obj.LINHA01 + ' ' + obj.LINHA02}
      </EllipsisTooltip>
    ),
  },
  {
    title: 'Quantidade',
    dataIndex: 'qty',
    // key:'qty',
    align: 'center',
  },
  {
    title: 'Produto',
    dataIndex: 'isProdutoOk',
    //  key:'isProdutoOk',
    align: 'center',
    render: (text) => {
      if (text === 0) {
        return <Tag color="gold">Pendente</Tag>;
      } else {
        return <Tag color="green">Ok</Tag>;
      }
    },
  },
  {
    title: 'Arvore Kit',
    dataIndex: 'isKitOk',
    //  key:'isKitOk',
    align: 'center',
    render: (text) => {
      if (text === 1) {
        return <Tag color="green">Ok</Tag>;
      } else {
        return <Tag color="gold">Pendente</Tag>;
      }
    },
  },
  {
    title: 'Cliente',
    dataIndex: 'isClienteOk',
    //  key:'isClienteOk',
    align: 'center',
    render: (text, record) => {
      if (text === 0) {
        return <Tag color="gold">Pendente</Tag>;
      } else {
        return <Tag color="green">Ok</Tag>;
      }
    },
  },
  {
    title: 'Etapa',
    dataIndex: 'isEtapaOk',
    //  key:'isEtapaOk',
    align: 'center',
    render: (text, record) => {
      if (text === 0) {
        return <Tag color="red">Sem Etapa</Tag>;
      } else {
        return <Tag color="green">Ok</Tag>;
      }
    },
  },
  {
    title: 'Dados basicos',
    dataIndex: 'isDadosBaseOk',
    //  key:'isDadosBaseOk',
    align: 'center',
    width: 150,
    render: (text, record) => {
      if (text === 0) {
        return <Tag color="red">Pend. dados básicos</Tag>;
      } else {
        return <Tag color="green">Ok</Tag>;
      }
    },
  },
  {
    title: 'OP Gerada',
    dataIndex: 'isOrdemOk',
    //   key:'isOrdemOk',
    align: 'center',
    render: (text, record) => {
      if (text === 0) {
        return <Tag color="red">Sem Ordem</Tag>;
      } else {
        return <Tag color="green">Ok</Tag>;
      }
    },
  },
  {
    title: 'Tipo Registro',
    dataIndex: 'Tipo de Registro',
    width: 100,
    key: 'key',
    align: 'center',
    // render: (text) => <text>{text}</text>
  },
  {
    title: 'Cnpj/Cpf',
    dataIndex: 'cnpj_cpf',
    //   key:'cnpj_cpf'
  },
  {
    title: 'Razao Social',
    dataIndex: 'razao',
    onCell: () => {
      return {
        style: {
          whiteSpace: 'nowrap',
          maxWidth: 150,
        },
      };
    },
    render: (text) => <EllipsisTooltip title={text}>{text}</EllipsisTooltip>,
    //   key:'razao'
  },

  {
    title: 'CFOP',
    dataIndex: 'cfop',
    width: 75,
    align: 'center' 
    // key:'cfop',
  },
];

/**
 * Esse componente ira receber uma lista de resultados do fox, e ira apresentar num table.
 * @param resultaData É o array com os dados a serem apresentados
 * @type component
 * @author luiz.garcia
 * @since 30/07/2020
 */
export default class ImportOrdersFoxResults extends Component {
  constructor(props) {
    super();
    // this.state = {
    //     selectedRowKeys: []
    // }
    // this.data = [...props.resultData];
  }

  // onSelectChange = selectedRowKeys => {
  //     this.setState({selectedRowKeys});
  // }

  render() {
    // const { selectedRowKeys } = this.props;
    return (
      <Spin spinning={false}>
        <Card type="inner" title="Ordens Filtras a gerar">
          <Table
            scroll={{ x: 2500, y: 2000 }}
            rowSelection={{
              selectedRowKeys: this.props.selectedRowKeys,
              onChange: this.props.onSelectChange,
              fixed: true
            }}
            columns={columns}
            onChange={this.props.onChangePage}
            sorter={true}
            bordered
            size="small"
            dataSource={this.props.resultData}
            style={{ margin: '-15px -24px' }}
            loading={this.props.loading}
            rowKey={(record) => record.key}
          />
        </Card>
      </Spin>
    );
  }
}

