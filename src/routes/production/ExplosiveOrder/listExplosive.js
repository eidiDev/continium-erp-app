import React, {Component} from 'react';
import api from '../../../util/Api';
import {Table} from 'antd';

const columns = [
    {
        title: 'Produto',
        dataIndex:'product.description1',
        key: 'product',
        render: text => <span className="gx-link">{text}</span>
    },
    {
        title: 'Cliente',
        dataIndex:'partner.name',
        key: 'partner'
    },

    {
        title: 'Data',
        dataIndex:'dataProd',
        key: 'dataProd'
    },
]

const model = 'explosive';

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
        <div style={{margin:'-24px'}}>
            {/* <Row> */}
                {/* <Col span={4}> */}
                    <Table 
                        className="gx-table-responsive" 
                        columns={columns} 
                        dataSource={this.state.data} 
                        onRow={(record, rowIndex) => {
                            return {
                                onClick : event => this.props.onClickRow(record, rowIndex)
                            }
                        } }
                    />
                {/* </Col> */}
            {/* </Row> */}
            {/* <Card>
                <Table 
                    className="gx-table-responsive" 
                    columns={columns} 
                    dataSource={data} 
                    onRow={(record, rowIndex) => {
                        return {
                            onClick : event => this.props.onClickRow(record, rowIndex)
                        }
                    } }
                />
            </Card> */}
       </div>
        )
    }
};

export default ListOrdemProducao;