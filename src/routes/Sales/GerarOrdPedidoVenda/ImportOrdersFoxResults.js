import React, { Component } from 'react';
import { Card, Table, Tag, Spin } from 'antd';
import moment from 'moment';
import EllipsisTooltip from 'components/EllipsisTooltip';

//const idAutoIncrement = require("id-auto-increment");
// var _ = require('lodash');
// import api from '../../../util/Api';
//let count = 0

const columns = [
  {
    title: 'Pedido de Venda',
    dataIndex: 'id',
    width: 100,
    key: 'id',
    align: 'center'
  },
  {
    title: 'Data do Pedido',
    dataIndex: 'orddat',
    align: 'center',
    //  key:'Emissão',
    render: (text) => moment(text).format('DD-MM-YYYY'),
  },
  {
    title: 'Status',
    dataIndex: 'status',
    align: 'center',
    // key:'Pedido do Cliente'
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
    let columnsSub = [
      {
        title: 'Linha do Pedido',
        dataIndex: 'id',
        // key:'Pedido do Cliente'
        width: 100
      },
      {
        title: 'Pedido Cliente',
        dataIndex: 'lin_pedido_cliente',
        // key:'Pedido do Cliente'
        width: 100
      },
      {
        title: 'Pedido Fox',
        dataIndex: 'lin_pedido_fox',
        // key:'Pedido do Cliente'
        width: 100
      },
      {
        title: 'Data Entrega',
        dataIndex: 'data_entrega',
        width: 100,
        //  key:'Emissão',
        render: (text) => moment(text).format('DD-MM-YYYY'),
      },
      {
        title: 'Data Prevista',
        dataIndex: 'data_prevista',
        width: 100,
        //  key:'Emissão',
        render: (text) => moment(text).format('DD-MM-YYYY'),
      },
      {
        title: 'CFOP',
        dataIndex: 'cfop',
        width: 75,
        // key:'cfop',
      },
      {
        title: 'Cod Produto',
        dataIndex: 'productObj.cod',
        width: 75,
        // key:'cfop',
      },
      {
        title: 'Status Produto',
        dataIndex: 'isProdutoOk',
        //  key:'isProdutoOk',
        width: 150,
        align: 'center',
        render: (text,record) => {
          if (text === 0) {
            return <Tag color="gold">Pendente</Tag>;
          } else {
            return <Tag color="green">Ok</Tag>;
          }
        }
      },
       {
        title: 'Arvore Kit',
        dataIndex: 'isKitOk',
        //  key:'isKitOk',
        width: 150,
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
        title: 'Etapa',
        dataIndex: 'isEtapaOk',
        //  key:'isEtapaOk',
        align: 'center',
        width: 150,
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
        width: 150,
        align: 'center',
        render: (text, record) => {
          if (text === 0) {
            return <Tag color="red">Sem Ordem</Tag>;
          } else {
            return <Tag color="green">Ok</Tag>;
          }
        },
      }
    ]
    return (
      <Spin spinning={false}>
        <Card type="inner" title="Ordens Filtras a gerar">
          <Table
            expandedRowRender={record => <Table columns={columnsSub} pagination={{hideOnSinglePage: true}} size={'small'} dataSource={record.linhas}/> }
            scroll={{ x: 2500, y: 2000 }}
            //rowKey={(record) => record.key = 999}
            rowSelection={{
              selectedRowKeys: this.props.selectedRowKeys,
              onChange: this.props.onSelectChange,
            }}
            columns={columns}
            onChange={this.props.onChangePage}
            sorter={true}
            bordered
            size="small"
            dataSource={this.props.resultData}
            style={{ margin: '-15px -24px' }}
            loading={this.props.loading}
            rowKey={(record) => record.id }
          />
        </Card>
      </Spin>
    );
  }
}
