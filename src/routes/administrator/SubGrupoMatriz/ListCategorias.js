import React, { Component } from 'react';
import api from 'util/Api';
import { Tag } from 'antd';
import LeftList from 'components/LeftList';
import EllipsisTooltip from 'components/EllipsisTooltip';
//var _ = require('lodash');

const columns = [
  {
    title: 'Código do grupo',
    dataIndex: 'cod',
    key: 'cod',
    //sortOrder: 'descend',
    render: (text) => text,
  },
  {
    title: 'Descrição',
    dataIndex: 'description',
    key: 'description',
    onCell: () => {
      return {
        style: {
          whiteSpace: 'nowrap',
          maxWidth: 150,
        },
      };
    },
    render: (text) => <EllipsisTooltip title={text}>{text}</EllipsisTooltip>,
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (text) => (
      <span>
        {text.toString() === 'true' ? (
          <Tag color="green">Ativo</Tag>
        ) : (
          <Tag color="red">Desativo</Tag>
        )}
      </span>
    ),
  },
];

const model = 'SubGrupoMatriz';

class ListUsers extends Component {
  constructor(props) {
    super();
    console.log('ListUSers - Constructor');
    console.log(props);

    this.state = {
      data: [],
    };
  }

  componentDidMount() {
    console.log('ComponentDidMout - CustomerList');
    this.fetchLeftList();
  }

  //sort=cod ASC&limit=999&populate=false
  fetchLeftList = () => {
    console.log('fecthLeftlist');
    api
      .get(`${model}/?sort=cod ASC&limit=999&populate=false`, {})
      .then((result) => {
        this.setState({
          data: result.data,
        });
      })
      .catch(function (error) {
        console.log('error', error);
      });
  };

  render() {
    return (
      <LeftList
        columns={columns}
        data={this.state.data}
        onRowClick={(record, rowIndex) => {
          return {
            onClick: (event) => this.props.onClickRow(record, rowIndex),
          };
        }}
      />
    );
  }
}

export default ListUsers;
