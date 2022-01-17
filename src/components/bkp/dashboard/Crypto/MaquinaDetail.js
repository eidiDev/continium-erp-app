import React from "react";
//import {Table} from "antd";
import Widget from "components/Widget/index";

class MaquinaDetail extends React.Component {
  

  
  state = {
    chartProperties: {
      title: '',
      status: '',
      CRO: '',
      progresso: '',
      programador: '',
      op: '',
      bgColor: ''
    }
  }

  componentDidMount() {
    this.setState((previousState) => ({
      chartProperties: this.props.chartProperties,
    }));
  }

  render() {
    const {bgColor, title,status,cro,progresso,programador,operador} = this.state.chartProperties;
    return (
    <Widget styleName={`gx-card-full gx-bg-${bgColor}`}>
      <div className="gx-actchart gx-px-3 gx-pt-3 ">
        <div className="ant-row-flex">
          <h1 className="gx-mb-0 gx-fs-xxl gx-font-weight-medium gx-text-white">
            {title}
            <span className={`gx-mb-0 gx-ml-2 gx-pt-xl-2 gx-fs-lg gx-chart-$`}> <i
              className="icon icon-menu-up gx-fs-sm"/>
            </span>
          </h1>
          <i className={`icon icon- gx-fs-xl gx-ml-auto gx-text-primary gx-fs-xxxl`}/>
        </div>
        <p className="gx-mb-0 gx-fs-sm gx-text-white"></p>
      </div>
      <div className="ant-row-flex gx-justify-content-between gx-mb-3 gx-mb-sm-4 gx-dash-search ">
        <div className="gx-mx-sm-2">
          <div className="gx-media gx-featured-item">
              <div className="gx-media-body gx-featured-content">
                <div className="gx-featured-content-left">
                  <br /><br />

                  <h1 className="gx-text-white gx-mb-1">Status: {status}</h1>

                  <div className="ant-row-flex">
                    <h1 className="gx-mr-3 gx-mb-1"><span className="gx-text-white">CRO: {cro}</span></h1>
                  </div>
                  <div className="ant-row-flex">
                    <h1 className="gx-mr-3 gx-mb-1"><span className="gx-text-white">Progresso: {progresso}</span> </h1>
                  </div>
                  <div className="ant-row-flex">
                    <h1 className="gx-mr-3 gx-mb-1"><span className="gx-text-white">Programador: {programador} </span> </h1>
                    </div>
                  <div className="ant-row-flex">
                    <h1 className="gx-mr-3 gx-mb-1"><span className="gx-text-white">Operador: {operador} </span> </h1>
                  </div> 

                  {/* <div className="ant-row-flex">
                    <p className="gx-text-white gx-mb-1">
                      <i className={`icon icon-user gx-fs-xs gx-mr-2 gx-d-inline-flex gx-vertical-align-middle`}/>name
                    </p>
                    <p className="gx-text-white gx-ml-4 gx-mb-1">
                      <i className={`icon icon-datepicker gx-fs-xs gx-mr-2 gx-d-inline-flex gx-vertical-align-middle`}/>date
                    </p>
                  </div> */}
                </div>
                
              </div>
            </div>
          </div>
          </div>
    </Widget>
    );
  }
};

export default MaquinaDetail;
