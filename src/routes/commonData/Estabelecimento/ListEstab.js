import React, {Component} from 'react';
import api from '../../../util/Api';
import LeftList from '../../../components/LeftList';
import EllipsisTooltip from '../../../components/EllipsisTooltip';

const columns = [
    {
        title: 'Código',
        dataIndex: 'cod',
        key: 'cod',
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
        title: 'Nome',
        dataIndex:'name',
        key: 'name'
    },
    // {
    //     title: 'Email',
    //     dataIndex:'email',
    //     key: 'email'
    // }
]

const model = 'establishment';

// const data = [
//     // {
//     //     key: '1',
//     //     name: 'Luiz Garcia',
//     //     username: 'luiz.garcia',
//     //     email: 'luyzgarcia@gmail.com',
//     // },
//     // {
//     //     key: '2',
//     //     name: 'Alisson Souza',
//     //     username: 'alisson.souza',
//     //     email: 'alisson.souza@corasitemas.com',
//     // },
//     // {
//     //     key: '3',
//     //     name: 'Tobias Lima',
//     //     username: 'tobias.lima',
//     //     email: 'tobias.lima@corasistemas.com',
//     // }
// ]

class ListEstab extends Component {
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

export default ListEstab;