import React from 'react';
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
      dataIndex: 'orderprod.productObj.cod',
      key: 'produto'
    },
    {
      title: 'Produto Cliente',
      dataIndex: 'produto_cliente',
      key: 'produto_cliente'
    },
    {
      title: 'CFOP',
      dataIndex: 'cfop',
      key: 'cfop'
    },
    {
      title: 'Data Entrega',
      dataIndex: 'data_entrega',
      key: 'data_entrega'
    },
    {
      title: 'Data Prevista',
      dataIndex: 'data_prevista',
      key: 'data_prevista'
    },
    {
        title: 'Quantidade Produzida',
        dataIndex: 'qty_produzida',
        key: 'qty_produzida'
    },
    {
      title: 'Ações',
      key: 'action',
      render: (text, record) => (
        <div>
          <i
            className="icon icon-trash"
            style={{ marginRight: '10px' }}
            // onClick={(e) => {
            //   Modal.confirm({
            //     title: 'Tem certeza que deseja remover esta etapa ?',
            //     onOk() {
            //       auxthis.handleDeleteAddressRow(record.key, e);
            //       message.success('Etapa removida');
            //     },
            //     onCancel() {},
            //   });
            // }}
          />

          <i
            className="icon icon-edit"
            style={{ marginRight: '10px' }}
            // onClick={(e) => {
            //   Modal.confirm({
            //     title: 'Tem certeza que deseja remover esta etapa ?',
            //     onOk() {
            //       auxthis.handleDeleteAddressRow(record.key, e);
            //       message.success('Etapa removida');
            //     },
            //     onCancel() {},
            //   });
            // }}
          />
        </div>
      ),
    }
  ]

  export default columnsLinhaPedido;
 