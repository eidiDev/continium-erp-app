import React, {Component} from 'react'
import api from '../../../util/Api'
//import {Table} from 'antd'
import LeftList from '../../../components/LeftList';
import EllipsisTooltip from '../../../components/EllipsisTooltip';

const columns = [
    {
        title: 'Apontamento',
        dataIndex: 'apontamento',
        key: 'apontamento',
        width: 150,
        onCell: () => {
            return {
                style: {
                    whiteSpace: 'nowrap',
                    maxWidth: 150
                }
            }
        },
        render: (text) => <EllipsisTooltip title={text}>{text}</EllipsisTooltip>
    },
    {
        title: 'Ordem de Prod',
        dataIndex: 'orderProd.orderProduction',
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
        render: (text) => <EllipsisTooltip title={text}>{text}</EllipsisTooltip>
    },
    {
        title: 'Produto',
        dataIndex:'prodacabado[0].description1',
        key: 'prodacabado',
        width: 150,
        onCell: () => {
            return {
                style: {
                    whiteSpace: 'nowrap',
                    maxWidth: 150
                }
            }
        },
        render: (text) => <EllipsisTooltip title={text}>{text}</EllipsisTooltip>
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
        render: (text) => <EllipsisTooltip title={text}>{text}</EllipsisTooltip>
    },

    {
        title: 'Data',
        dataIndex:'dataProd',
        key: 'dataProd',
        width: 150,
    },
]

const model = 'noteprod';

class ListOrdemProducao extends Component {
    constructor(props) {
        super();        
        console.log('ListUSers - Constructor')
        console.log(props)

        this.state = {
            data: []
        };
    }

    componentDidMount() {
        console.log('ComponentDidMout - CustomerList');
        this.fetchLeftList();
    } 

    fetchLeftList = () => {
        console.log('fecthLeftlist');
        api.get(`${model}/`, {})
        .then((result) => {
            this.setState({
                data: result.data
            });
        },)
        .catch(function(error) {
            console.log('error', error)
        })
    }


    render() {
        return (
            <LeftList
                columns={columns} 
                data={this.state.data} 
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