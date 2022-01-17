import React from 'react';
import { Table } from 'antd';
import Widget from 'components/Widget/index';
import './tableauxSpe.css';

class NextOrders extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      page: false,
      itemProperties: {
        title: '',
        subtitle: '',
      },
    };
  }

  updateWindow = () => {
    // console.log("nextorders");
    this.setState({
      page: !this.state.page,
    });
    // window.location.reload();
  };

  componentDidMount() {
    this.setState((previousState) => ({
      itemProperties: this.props.itemProperties,
    }));
    setInterval(this.updateWindow.bind(this), 6000);
  }

  render() {
    const { title, subtitle, columns } = this.state.itemProperties;
    const data = this.props.data;
    // console.log(data)
    return (
      <>
        {this.state.page === false ? (
          <Widget
            styleName="gx-order-history"
            title={
              <h2
                style={{ fontSize: '30px' }}
                className="h4 gx-text-capitalize gx-mb-0"
              >
                {title}
              </h2>
            }
            extra={
              <p
                style={{ fontSize: '23px' }}
                className="gx-text-primary gx-mb-0 gx-pointer"
              >
                {subtitle}
              </p>
            }
          >
            <div className="gx-table-responsive">
              {/* gx-table-no-bordered */}
              <Table
                className="Spe"
                columns={columns}
                dataSource={data}
                pagination={false}
                bordered={true}
                align="center"
                size="default"
              />
            </div>
          </Widget>
        ) : (
          <Widget
            styleName="gx-order-history"
            title={
              <h2
                style={{ fontSize: '30px' }}
                className="h4 gx-text-capitalize gx-mb-0"
              >
                {title}
              </h2>
            }
            extra={
              <p
                style={{ fontSize: '23px' }}
                className="gx-text-primary gx-mb-0 gx-pointer"
              >
                {subtitle}
              </p>
            }
          >
            <div className="gx-table-responsive">
              {/* gx-table-no-bordered */}
              <Table
                className="Spe"
                columns={columns}
                dataSource={data}
                pagination={false}
                bordered={true}
                align="center"
                size="default"
              />
            </div>
          </Widget>
        )}
      </>
    );
  }
}

export default NextOrders;
