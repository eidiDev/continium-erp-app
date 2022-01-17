import React, {Component} from 'react';
import api from '../../../util/Api';
import LeftList from '../../../components/LeftList';
import EllipsisTooltip from '../../../components/EllipsisTooltip';

const columns = [
    {
        title: 'Código',
        dataIndex: 'cod',
        key: 'cod',
        width: 150,
        onCell: () => {
            return {
                style: {
                    whiteSpace: 'nowrap',
                    maxWidth: 150,
                }
            }
        },
        render: (text) => <EllipsisTooltip title={text}>{text.toUpperCase()}</EllipsisTooltip>
    },
    {
        title: 'Nome',
        dataIndex:'name',
        key: 'name',
        width: 100,
        onCell: () => {
            return {
                style: {
                    whiteSpace: 'nowrap',
                    maxWidth: 100
                }
            }
        },
        render: (text) => <EllipsisTooltip title={text}>{text.toUpperCase()}</EllipsisTooltip>
    },
    {
        title: 'Tipo',
        dataIndex:'type',
        key: 'type',
        width: 150,
        onCell: () => {
            return {
                style: {
                    whiteSpace: 'nowrap',
                    maxWidth: 150
                }
            }
        },
        render: (text) => <EllipsisTooltip title={text}>{text.toUpperCase()}</EllipsisTooltip>
    }
]

const model = 'Machinelabor';



class ListMaquina extends Component {
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
        api.get(`${model}/?sort=cod ASC&limit=999`, {})
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

export default ListMaquina;