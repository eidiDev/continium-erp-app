import React, {Component} from 'react';
import api from 'util/Api';
//import { Tag} from 'antd';
import EllipsisTooltip from 'components/EllipsisTooltip';
import LeftList from 'components/LeftList';



const columns = [
    {
        title: 'Codigo do Produto',
        dataIndex:'productObj.cod',
        key: 'product',
        width: 100,
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
    //     title: 'Estab.',
    //     dataIndex: 'establishment.name',
    //     key: 'establishment',
    //     render: text => <span className="gx-link">{text}</span>
    // },
    {
        title: 'Descrição ',
        dataIndex:'description',
        key: 'description',
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
    // }
]

const model = 'stepXprod';

class listStepXprod extends Component {
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
        api.get(`${model}`, {})
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

export default listStepXprod;