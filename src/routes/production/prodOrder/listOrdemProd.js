import React, {Component} from 'react'
import api from 'util/Api'
//import {Table} from 'antd'
import LeftList from 'components/LeftListOrderProd';
import EllipsisTooltip from 'components/EllipsisTooltip';

const columns = [
    {
        title: 'Codigo da ordem',
        dataIndex: 'orderProduction',
        key: 'orderProduction',
        width: 150,
        onCell: () => {
            return {
                style: {
                    whiteSpace: 'nowrap',
                    maxWidth: 150
                }
            }
        },
        render: text => <EllipsisTooltip title={text}>{text}</EllipsisTooltip>
    },
    {
        title: 'Produto',
        dataIndex:'product.cod',
        key: 'product',
        width: 150,
        onCell: () => {
            return {
                style: {
                    whiteSpace: 'nowrap',
                    maxWidth: 150
                }
            }
        },
        render: text => <EllipsisTooltip title={text}>{text}</EllipsisTooltip>
    },
    {
        title: 'Cliente',
        dataIndex:'partner.name',
        key: 'partner',
        width: 150,
        onCell: () => {
            return {
                style: {
                    whiteSpace: 'nowrap',
                    maxWidth: 150
                }
            }
        },
        render: text => <EllipsisTooltip title={text}>{text}</EllipsisTooltip>
    },

    {
        title: 'Data',
        dataIndex:'dataProd',
        key: 'dataProd',
        width: 100,
        onCell: () => {
            return {
                style: {
                    whiteSpace: 'nowrap',
                    maxWidth: 150
                }
            }
        },
        render: text => <EllipsisTooltip title={text}>{text}</EllipsisTooltip>
    },
]

const model = 'orderprod';

class ListOrdemProducao extends Component {
    constructor(props) {
        super();        
        console.log('ListUSers - Constructor')
        console.log(props)

        this.state = {
            data: [],
            skip: 1,
            limit: 20,
            total: 0
        };
    }

    componentDidMount() {
        console.log('ComponentDidMout - CustomerList');
        this.fetchLeftList();
        this.getTotal();
    }
    
    componentDidUpdate(prevProps, prevState){
        if(prevState.skip !== this.state.skip){
            this.fetchLeftList()
        }
    }

    fetchLeftList = () => {
        const {skip,limit} = this.state;
        api.get(`${model}`, {params: {
            page: skip,
            limit: limit
          }})
        .then((result) => {
            result.data.data.sort((a,b) => (a.id > b.id ? -1 : 1) );
            this.setState({
                data: result.data.data
            });
        },)
        .catch(function(error) {
            console.log('error', error)
        })
    }

    change = (pagination) => {
        // pagination.current, pagination.pageSize
        // if(pagination.current === 1){
        //     this.setState({
        //     skip: 0, 
        //   });
          
        // }else{
        //   let ax = parseInt(pagination.current) * 10
        //   this.setState({
        //     skip: ax, 
        //   });
        // }

        // this.fetchLeftList();

        
          this.setState({
            skip: pagination.current, 
          });
        

        this.fetchLeftList();
      }


    getTotal = () => {
        api
        .get(`${model}/api/getTotal`, {})
        .then((result) => {
          this.setState({
            total: result.data[0].count,
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
                data={this.state.data}
                onChange={this.change}
                totalRows={this.state.total} 
                onRowClick={(record, rowIndex) => {
                    return {
                        onClick : event => this.props.onClickRow(record, rowIndex)
                    }
                } }
            />
        )
    }
};

export default ListOrdemProducao;
