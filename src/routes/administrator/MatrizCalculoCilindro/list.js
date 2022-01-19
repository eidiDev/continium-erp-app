import React, { Component } from 'react';
import LeftList from 'components/LeftList';
import EllipsisTooltip from 'components/EllipsisTooltip';
import { getAll } from 'services/matrizCalculoCilindroService';

const columns = [
  {
    title: 'Codigo',
    dataIndex: 'codigo',
    key: 'codigo',
    render: (text) => {
      return text;
    },
    //sorter: (a, b) => a.cod.length - b.cod.length,
  },
  {
    title: 'Descrição',
    dataIndex: 'description',
    key: 'description',
    onCell: () => {
      return {
        style: {
          whiteSpace: 'nowrap',
          maxWidth: 200,
        },
      };
    },
    render: (text) => <EllipsisTooltip title={text}>{text}</EllipsisTooltip>,
  },
];

export default class List extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: true,
      data: [],
    };
    this.fetchLeftList();
  }

  fetchLeftList = () => {
    getAll()
      .then((response) => {
        this.setState({
          isLoading: false,
          data: response.data.data,
        });
      })
      .catch((err) => {
        this.setState({ isLoading: false });
        console.log(err);
      });
  };

  render() {
    return (
      <LeftList
        loading={this.state.isLoading}
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
