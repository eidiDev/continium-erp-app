import React from "react";
import {Table} from "antd";
import Widget from "components/Widget/index";
import './tableauxSpe.css'


class NextOrders extends React.Component {

  state = {
    itemProperties: {
      title:'',
      subtitle:''
    }
  }

  componentDidMount() {
    this.setState((previousState) => ({
      itemProperties: this.props.itemProperties
    }));
  }

  render() {
    const {title, subtitle,columns,data} = this.state.itemProperties;
    return (
      <Widget styleName="gx-order-history"
              title={
                <h2 style={{fontSize: "30px"}} className="h4 gx-text-capitalize gx-mb-0">
                  {title}</h2>
              } extra={
        <p style={{fontSize: "23px"}} className="gx-text-primary gx-mb-0 gx-pointer">{subtitle}</p>
      }>
        <div className="gx-table-responsive">
        {/* gx-table-no-bordered */}
          <Table className="Spe" columns={columns} dataSource={data} pagination={false} bordered={true} align="center"
                size="default"/>
        </div>
      </Widget>
    );
  }
};

export default NextOrders;
