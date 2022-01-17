import { Table } from 'antd';
import React, { Fragment } from 'react';
import moment from 'moment';

const column = [

  {
    title: 'Data de registro',
    dataIndex: 'orddat',
    key: 'orddat',
    width: 100,

    render: (orddat) => {

      if (orddat) {
        return (
          <Fragment >{moment(orddat).format('DD-MM-YYYY')}</Fragment>
        )
      }
      return <Fragment />

    }
  },

  {
    title: 'ID pedido venda',
    dataIndex: 'id',
    key: 'id',
    width: 100,
  },


  {
    title: 'Pedido fox',
    dataIndex: 'pedido_fox',
    key: 'pedido_fox',
    width: 100,
  },
  {
    title: 'Cliente',
    dataIndex: 'partner',
    key: 'partner',
    width: 100,
    render: (partner) => {
      if (partner) {
        return (
          <Fragment>{partner.name}</Fragment>
        )
      }
      return <Fragment />
    }
  },

  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    width: 100,
  },
]


// import { Container } from './styles';

class TabelaRelPedidoVenda extends React.Component {

  constructor() {

    super();


  }



  render() {
    return (

      <Table dataSource={this.props.data} loading={this.props.loading} columns={column} />


    );
  }


}

export default TabelaRelPedidoVenda;
