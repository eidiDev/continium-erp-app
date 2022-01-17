import React, {Component} from 'react'
import api from '../../../util/ApiAdonisWeb'
import LeftList from '../../../components/LeftList';

const columns = [
    {
        title: 'Username',
        dataIndex:'username',
        key: 'username',
        render: text => {
            return text
        }
    },
    {
        title: 'Nome',
        dataIndex:'nome',
        key: 'nome',
        // render: (text) => {
        //     return text.toUpperCase()
        // }
    },
    {
        title: 'Sobrenome',
        dataIndex:'sobrenome',
        key: 'sobrenome'
    },
]

const model = 'consultastock';

class ListUsers extends Component {
    constructor(props) {
        super()
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
            let dataSorted = result.data.data.sort(function(a, b){
                if(a.nome < b.nome) { return -1; }
                if(a.nome > b.nome) { return 1; }
                return 0;
            });

            
            this.setState({
                data: dataSorted
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
                pageSize={6}
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

export default ListUsers;
