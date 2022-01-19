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
        },
        //sorter: (a, b) => a.cod.length - b.cod.length,
    },
    {
        title: 'Descrição',
        dataIndex:'desc',
        key: 'desc',
        //sorter: (a, b) => a.valor - b.valor
        
    }
]

const model = 'dashboards';

class ListTaxaHora extends Component {
    constructor(props) {
        super()
        // console.log('ListUSers - Constructor')
        // console.log(props)

        
        this.state = {
            data: []
        };
    }

    componentDidMount() {
        // console.log('ComponentDidMout - CustomerList');
        this.fetchLeftList();
    } 

    fetchLeftList = () => {
        // console.log('fecthLeftlist');
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