import React, {Component} from 'react';
//import { Tag } from 'antd';
import api from '../../../util/Api';
import LeftList from '../../../components/LeftList';
import EllipsisTooltip from '../../../components/EllipsisTooltip';

const columns = [
    {
        title: 'Código da Etapa',
        dataIndex: 'cod',
        key: 'cod',
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
    // {
    //     title: 'Estabelecimento',
    //     dataIndex:'establishments.name',
    //     key: 'establishments',
    //     width: 150,
    //     onCell: () => {
    //         return {
    //             style: {
    //                 whiteSpace: 'nowrap',
    //                 maxWidth: 150
    //             }
    //         }
    //     },
    //     render: (text) => <EllipsisTooltip title={text}>{text}</EllipsisTooltip>
    // },
    {
        title: 'Descrição',
        dataIndex:'description',
        key: 'description',
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
    // {
    //     title: 'Status',
    //     dataIndex:'status',
    //     key: 'status',
    //     render: text => <span>{text.toString() === "true" ? <Tag color="green">Ativo</Tag>: <Tag color="red">Desativo</Tag>}</span>
    // },
]

const model = 'stepprocess';



class ListStep extends Component {
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
                data: result.data.data
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
                }}
            />
        )
    }
};

export default ListStep;