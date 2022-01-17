import React, { Component } from 'react';
import api from 'util/Api';
import LeftList from 'components/LeftListProduct';
import EllipsisTooltip from 'components/EllipsisTooltip';

const columns = [
  {
    title: 'Cód Produto',
    dataIndex: 'cod',
    key: 'cod',
  },
  {
    title: 'Descrição',
    dataIndex: 'description1',
    key: 'description1',

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

  {
    title: 'Grupo',
    dataIndex: 'category.description',
    key: 'category',
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
];

const model = 'Product';

class ListProducts extends Component {
  constructor(props) {
    super();
    this.state = {
      data: [],
      skip: 0,
      limit: 20,
      total: 0
    };
  }

  componentDidMount() {
    this.fetchLeftList();
    this.getTotal();
  }

  componentDidUpdate (prevProps, prevState) {
    if(prevState.skip !== this.state.skip){
      this.fetchLeftList()
  }
  }

  fetchLeftList = () => {
    const {skip,limit} = this.state;
    api
      .get(`${model}/`, {params: {
        skip: skip,
        limit: limit
      }})
      .then((result) => {
        this.setState({
          data: result.data,
        });
      })
      .catch(function (error) {
        console.log('error', error);
      });
  };

  change = (pagination) => {
    // pagination.current, pagination.pageSize
    
    console.log(pagination);
    if(pagination.current === 1){
      this.setState({
        skip: 0, 
      });
    }else{
      this.setState({
        skip: parseInt(pagination.current) * 10, 
      });
    }
  }

  getTotal = () => {
      api
      .get(`${model}/getTotal`, {})
      .then((result) => {
        this.setState({
          total: result.data.count,
        });
      })
      .catch(function (error) {
        console.log('error', error);
      });
  }

  render() {
    return (
      <LeftList
        columns={columns}
        onChange={this.change}
        totalRows={this.state.total}
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

export default ListProducts;

