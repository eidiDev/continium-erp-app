import React, {Component} from 'react'
import api from '../../../util/Api'
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
        title: 'Tipo',
        dataIndex:'role',
        key: 'role',
        render: (text) => {
            return text.toUpperCase()
        }
    },
    {
        title: 'Email',
        dataIndex:'email',
        key: 'email'
    },
]

const model = 'users';

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

export default ListUsers;