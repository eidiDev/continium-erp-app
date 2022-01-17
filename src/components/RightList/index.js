import React, {Component} from 'react'
import {Card, Button} from 'antd'
import PropTypes from "prop-types";

class RightList extends Component {
    
    render() {
        return (
            // <Card className="gx-card" title={this.props.title}>
            <Card type="inner" title={this.props.title}>
                <Button 
                    block
                    type="primary"
                    className="gx-btn-secondary"
                    disabled={!this.props.canNew}
                    onClick={this.props.onHandleClickNew}
                    >
                    Novo
                </Button>
                <Button 
                    block
                    type="primary"
                    disabled={!this.props.canSave}
                    onClick={this.props.onHandleClickSave}
                    >
                    Salvar
                </Button>
                <br/>
                <Button 
                    block
                    type="primary"
                    className="gx-btn-red"
                    disabled={!this.props.canDelete} 
                    onClick={this.props.onHandleClickDelete}
                    >
                    Excluir
                </Button>
                {/* <Dropdown>
                    <Button block>
                        Outras <Icon type="down"/>
                    </Button>
                    </Dropdown> */}
            </Card>
        )
}
}

export default RightList

RightList.propTypes = {
    onHandleClickNew: PropTypes.func.isRequired,
    onHandleClickSave: PropTypes.func.isRequired,
    onHandleClickDelete: PropTypes.func.isRequired
};
  