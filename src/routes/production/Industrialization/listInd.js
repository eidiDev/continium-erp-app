import React, {Component} from 'react'
import api from '../../../util/Api'
//import {Table} from 'antd';
import LeftList from '../../../components/LeftList';
import EllipsisTooltip from '../../../components/EllipsisTooltip';

const columns = [
    {
        title: 'Ordem de Ind',
        dataIndex: 'ordInd',
        key: 'ordInd',
        render: text => <span className="gx-link">{text}</span>
    },
    {
        title: 'Produto',
        dataIndex:'product.description1',
        key: 'product',
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
        dataIndex:'terceiro.name',
        key: 'terceiro',
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
        dataIndex:'data',
        key: 'data'
    },
]

const model = 'Industrialization';

class ListIndustrial extends Component {
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

export default ListIndustrial;