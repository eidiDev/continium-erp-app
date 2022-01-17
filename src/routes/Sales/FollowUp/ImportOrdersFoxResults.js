import React, { Component } from 'react';
import { Card, Table, Tag, Spin,Input,DatePicker } from 'antd';
import locale from 'moment/locale/pt-br';
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
        key: 'num_salesorder',
        align: 'center'
      },
      {
        title: 'Linha do Pedido',
        dataIndex: 'id',
        // key:'Pedido do Cliente'
      },
      {
        title: 'Pedido Cliente',
        dataIndex: 'lin_pedido_cliente',
        // key:'Pedido do Cliente'
      },
      {
        title: 'Pedido Fox',
        dataIndex: 'lin_pedido_fox',
        // key:'Pedido do Cliente'
      },
      {
        title: 'Data Entrega',
        dataIndex: 'data_entrega',
        //  key:'Emissão',
        render: (text) => moment(text).format('DD-MM-YYYY'),
      },
      {
        title: 'Data Prevista',
        dataIndex: 'data_prevista',
        render: (text, record) => (
          <span>
            <DatePicker
              defaultValue={
                record.data_prevista === '' || record.data_prevista === undefined
                  ? ''
                  : moment(record.data_prevista, 'YYYY-MM-DD')
              }
              //value={moment(record.data_prevista, 'DD-MM-YYYY')}
              format={'DD-MM-YYYY'}
              onChange={(e, dataEmTexto) =>
                this.dataChangeOrderEntrega(record, e, dataEmTexto)
              }
            />
          </span>
        ),
      },
      {
        title: 'Código Produto',
        dataIndex: 'productObj.cod',
        //  key:'Produto'
      },
      {
        title: 'Descrição',
        dataIndex: 'productObj.description1',
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
          <EllipsisTooltip title={text}>
            {text}
          </EllipsisTooltip>
        ),
      },
      {
        title: 'CFOP',
        dataIndex: 'cfop',
        // key:'cfop',
      },
      {
        title: 'Observação',
        dataIndex: 'obs',
        width: 500,
        render: (text,record) =>{
          return (
          <span>
              <Input
                  defaultValue={record.obs}
                  type="text"
                  min={1}
                  name="produto_cliente"
                  onChange={(e) => this.changeInputPr(e,record)}
              >
              </Input>
          </span>
          )
      },
        // key:'cfop',
      },
    ];
  }

  changeInputPr = (event, record) => {
    record.obs = event.target.value;
  };
  
  dataChangeOrderEntrega = (date, dataString, dataEmTexto) => {
    date.data_prevista = dataString;
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
