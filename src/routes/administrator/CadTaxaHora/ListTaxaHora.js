import React, {Component} from 'react';
import api from '../../../util/Api';
import LeftList from '../../../components/LeftList';

const columns = [
    {
        title: 'Codigo',
        dataIndex:'cod',
        key: 'cod',
        render: text => {
            return text
        }
        //sorter: (a, b) => a.cod.length - b.cod.length,
    },
    {
        title: 'Valor',
        dataIndex:'valor',
        key: 'valor',
        type: "number"
        //sorter: (a, b) => a.valor - b.valor
        
    },
    {
        title: 'Tipo',
        dataIndex:'tipo',
        key: 'tipo',
        render: text => {
            return text.toUpperCase()
        }
        //sorter: (a, b) => a.tipo.length - b.tipo.length
    }
]

const model = 'taxaHora';

class ListTaxaHora extends Component {
    constructor(props) {
        super()
        
        this.state = {
            data: []
        };
    }

    componentDidMount() {
        this.fetchLeftList();
    } 

    fetchLeftList = () => {
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
        <div>
            <LeftList 
                columns={columns} 
                data={this.state.data} 
                onRowClick={(record, rowIndex) => {
                    return {
                        onClick : event => this.props.onClickRow(record, rowIndex)
                    }
                }}
            />
       </div>
        )
    }
};

export default ListTaxaHora;