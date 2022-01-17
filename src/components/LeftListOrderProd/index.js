/* eslint-disable */
import React, { Component } from 'react';
import api from '../../util/Api';
import { Card, Table, Input, Button, Icon } from 'antd';
const model = 'orderprod';

class LeftList extends Component {
  constructor(props) {
    super();
    var columnsV = [];

    props.columns.forEach((item) => {
      let sorter = '';
      if (item.type === 'number') {
        sorter = (a, b) =>
          eval('a.' + item.dataIndex) - eval('b.' + item.dataIndex);
      } else {
        sorter = (a, b) => {
          try {
            return (
              eval('a.' + item.dataIndex + '.toString()') >=
              eval('b.' + item.dataIndex + '.toString()')
            );
          } catch (err) {
            return -1;
          }
        };
      }
      let it = {
        ...item,
        sorter,
        ...this.getColumnsSearchProps(item.dataIndex, item.title),
      };
      columnsV.push(it);
    });
    this.state = {
      columns: columnsV,
      searchText: '',
      searchedColumn: '',
      aux: false,
      data: []
    };
    // this.setState({columns: columnsV});
  }

  getColumnsSearchProps = (dataIndex, title) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={(node) => {
            this.searchInput = node;
          }}
          placeholder={`Produrar por ${title}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            this.handleSearch(selectedKeys, confirm, dataIndex)
          }
          syle={{ width: 100, marginBottom: 6, display: 'block' }}
        />
        <div style={{ marginTop: 10 }}>
          <Button
            type="primary"
            onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<Icon type="search" />}
            size="small"
            style={{ width: 90 }}
          >
            Filtrar
          </Button>
          <Button
            onClick={() => this.handleReset(clearFilters)}
            size="small"
            className="gx-btn-secondary"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </div>
      </div>
    ),
    filterIcon: (filtered) => (
      <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) => {
      let verifHasDot = dataIndex.includes('.');
      if (verifHasDot === true) {
        try {
          let string = `record.${dataIndex}.toString().toLowerCase().includes(value.toLowerCase())`;
          return eval(string);
        } catch (err) {
          return '';
        }
      } else {
        return record[dataIndex]
          .toString()
          .toLowerCase()
          .includes(value.toLowerCase());
      }
    },

    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => this.searchInput.select());
      }
    },
    // render: text =>
    //     this.state.searchedColumn === dataIndex ? (
    //         text
    //     ) : (
    //         text
    //     ),
  });

  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    this.getSearch(selectedKeys[0],dataIndex);
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
   
  };

  handleReset = (clearFilters) => {
    clearFilters();
    this.setState({ searchText: '' });

    this.setState({
        aux: false,
    });
  };

  
  getSearch = (aux1,aux2) => {
    let a =  aux1;
    let b = aux2;

    console.log(a,b);

    api
    .get(`${model}/getSearch`, {params: {searchText: a ,searchedColumn: b }})
    .then((result) => {
      this.setState({
        data: result.data,
        aux: true
      });
    })
    .catch(function (error) {
      console.log('error', error);
    });
}

  render() {
    return (
      <Card>
        <div style={{ margin: '-24px' }}>
          <Table
            key="leftList"
            tableLayout="fixed"
            className="gx-table-responsive"
            columns={this.state.columns}
            dataSource={this.state.aux === false? this.props.data : this.state.data}
            onChange={this.props.onChange}
            pagination={{ pageSize: 20, total: this.state.aux === false ? this.props.totalRows :  false }}
            rowKey="id"
            onRow={this.props.onRowClick}
            loading={this.props.loading}
          />
        </div>
      </Card>
    );
  }
}

export default LeftList;
