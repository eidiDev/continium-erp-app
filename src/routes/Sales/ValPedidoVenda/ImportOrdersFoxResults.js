import React, { Component } from 'react';
import { Card, Table, Tag, Spin,Input } from 'antd';
import moment from 'moment';
import EllipsisTooltip from 'components/EllipsisTooltip';

//const idAutoIncrement = require("id-auto-increment");
// var _ = require('lodash');
// import api from '../../../util/Api';
//let count = 0

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
    this.columns = [
      {
        title: 'Pedido de Venda',
        dataIndex: 'num_salesorder',
        width: 100,
        key: 'num_salesorder',
        align: 'center'
      },
      {
        title: 'Linha do Pedido',
        dataIndex: 'id',
        // key:'Pedido do Cliente',
        align: 'center'
      },
      {
        title: 'Pedido Cliente',
        dataIndex: 'lin_pedido_cliente',
        // key:'Pedido do Cliente',
        align: 'center'
      },
      {
        title: 'Pedido Fox',
        dataIndex: 'lin_pedido_fox',
        // key:'Pedido do Cliente'
        align: 'center'
      },
      {
        title: 'Data Entrega',
        dataIndex: 'data_entrega',
        align: 'center',
        //  key:'Emissão',
        render: (text) => moment(text).format('DD-MM-YYYY'),
      },
      {
        title: 'Data Prevista',
        dataIndex: 'data_prevista',
        align: 'center',
        //  key:'Emissão',
        render: (text) => moment(text).format('DD-MM-YYYY'),
      },
      {
        title: 'CFOP',
        align: 'center',
        dataIndex: 'cfop',
        width: 75,
        // key:'cfop',
      },
      {
        title: 'Código Produto Cliente',
        dataIndex: 'produto_cliente',
        align: 'center',
        //  key:'Produto'
        // render: (text,record) =>{
        //     return (
        //     <span>
        //         <Input
        //             defaultValue={record.produto_cliente}
        //             type="text"
        //             min={1}
        //             name="produto_cliente"
        //             onChange={(e) => this.changeInputPr(e,record)}
        //         >
        //         </Input>
        //     </span>
        //     )
        // },
      },
      {
        title: 'Descrição Fornecedor',
        dataIndex: 'descricao_fornecedor',
        align: 'center',
        //  key:'Produto'
        render: (text,record) =>{
            return (
            <span>
                <Input
                    defaultValue={record.descricao_fornecedor}
                    type="text"
                    min={1}
                    name="descricao_fornecedor"
                    onChange={(e) => this.changeInputPr(e,record)}
                >
                </Input>
            </span>
            )
        },
      },
      {
        title: 'Código Produto Iconnect',
        align: 'center',
        dataIndex: 'productObj.cod',
      },
      // {
      //   title: 'Descrição',
      //   dataIndex: 'LINHA01',
      //   //   key:'LINHA01',
    
      //   onCell: () => {
      //     return {
      //       style: {
      //         whiteSpace: 'nowrap',
      //         maxWidth: 150,
      //       },
      //     };
      //   },
      //   render: (text, obj) => (
      //     <EllipsisTooltip title={obj.LINHA01 + ' ' + obj.LINHA02}>
      //       {obj.LINHA01 + ' ' + obj.LINHA02}
      //     </EllipsisTooltip>
      //   ),
      // },
      {
        title: 'Status Produto Iconnect',
        dataIndex: 'product_id',
        //  key:'isProdutoOk',
        align: 'center',
        render: (text) => {
          if (text === null) {
            return <Tag color="gold">Pendente</Tag>;
          } else {
            return <Tag color="green">Ok</Tag>;
          }
        },
      }
    ];
  }

  changeInputPr = (event, record) => {
    record.descricao_fornecedor = event.target.value;
  };
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
            //rowKey={(record) => record.key = 999}
            rowSelection={{
              selectedRowKeys: this.props.selectedRowKeys,
              onChange: this.props.onSelectChange,
              fixed: true,
            }}
            columns={this.columns}
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
