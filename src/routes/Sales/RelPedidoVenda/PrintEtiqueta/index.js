import React, { Fragment, Component } from "react";
import ReactToPrint from "react-to-print";
import { Button, Col, Row, Card } from "antd";
import "./style.css";
import LogoKnap from "./knapp_logo.svg";
import Barcode from "react-barcode";
import moment from "moment";
const numero = require("numero-por-extenso");

// import { Container } from './styles';

class PrintReport extends Component {
  constructor() {
    super();

    this.componentRef = React.createRef();
  }

  render() {
    return (
      <Fragment>
        <ReactToPrint
          trigger={() => (
            <Button type="primary" style={{ width: "100%" }}>
              Imprimir Etiquetas
            </Button>
          )}
          content={() => this.componentRef.current}
        />

        <div className="page-break" style={{ display: "none" }}>
          <PrintComponent ref={this.componentRef} data={this.props.data} />
        </div>
      </Fragment>
    );
  }
}

export default PrintReport;

export class PrintComponent extends React.Component {
  getBarcode1 = data => {
    console.log(data);
    let stringFormat;

    stringFormat = `0101${("00000" + data.num_salesorder).slice(-6)}${(
      "000" + data.sequencia
    ).slice(-4)}`;

    return stringFormat;
  };

  render() {
    const { data } = this.props;
    let barcodeString;

    if (typeof data === "undefined") {
      return <Fragment />;
    } else {
      console.log(data);
    }

    return (
      <div
        ref={el => (this.componentRef = el)}
        id="divToPrint"
        className="print-container"
        style={{
          backgroundColor: "#FFF"
        }}
      >
        {/*

        <div className="date-report">
          05/01/2021
          </div>
*/}

        {data.map((pdvenda, index) => {
          console.log(pdvenda);

          return data[index].linhas.map(linha => {
            barcodeString = this.getBarcode1(linha);
            return (
              <Row
                style={{
                  height: "100%",
                  padding: "1%",
                  fontWeight: "bold",
                  color: "#000"
                }}
              >
                <Col span={24}>
                  <Row
                    style={{
                      height: "40%",

                      borderLeft: "1px solid #000"
                    }}
                  >
                    <Col
                      style={{
                        borderTop: "1px solid #000",
                        borderRight: "1px solid #000",

                        borderLeft: "1px solid #000"
                      }}
                      span={8}
                    >
                      <Row
                        style={{
                          height: "50%"
                        }}
                      >
                        <Col span={24}>
                          <Row
                            style={{
                              alignItems: "center",
                              justifyContent: "center",
                              height: "100%",
                              padding: "5px"
                            }}
                          >
                            <img
                              style={{ width: "100%", height: "100%" }}
                              src={LogoKnap}
                            ></img>
                          </Row>
                        </Col>
                      </Row>

                      <Row
                        style={{
                          height: "50%",
                          borderTop: "1px solid #000"
                        }}
                      >
                        <Col span={24}>
                          <p
                            style={{
                              fontSize: "15px",
                              paddingLeft: "1px"
                            }}
                          >
                            End:
                          </p>
                        </Col>
                      </Row>
                    </Col>
                    <Col span={16}>
                      <Row
                        style={{
                          height: "30%",
                          borderTop: "1px solid #000",
                          borderRight: "1px solid #000",

                          borderBottom: "1px solid #000",
                          borderLeft: "1px solid #000"
                        }}
                      >
                        <Col span={24}>
                          <Row
                            style={{
                              alignItems: "center",
                              height: "100%"
                            }}
                          >
                            <p
                              style={{
                                fontSize: "15px",
                                paddingLeft: "6px",
                                paddingTop: "5px"
                              }}
                            >
                              Projeto: {linha.CodProjeto} {linha.DescProjeto}
                            </p>
                          </Row>
                        </Col>
                      </Row>
                      <Row
                        style={{
                          height: "70%",
                          borderRight: "1px solid #000",

                          borderLeft: "1px solid #000"
                        }}
                      >
                        <Col span={24}>
                          <Row>
                            <Col span={10}>
                              <p
                                style={{
                                  fontSize: "15px",
                                  paddingTop: "5px"
                                }}
                              >
                                Ord. Compra:
                              </p>
                            </Col>
                            <Col span={14}>
                              <Row
                                style={{
                                  height: "30%",
                                  display: "flex",
                                  justifyContent: "space-between"
                                }}
                              >
                                <p
                                  style={{
                                    fontSize: "15px",

                                    paddingTop: "5px"
                                  }}
                                >
                                  {pdvenda.id}
                                </p>
                                <p
                                  style={{
                                    fontSize: "15px",

                                    paddingTop: "5px"
                                  }}
                                >
                                  Seq.:
                                </p>
                                <p
                                  style={{
                                    fontSize: "15px",

                                    paddingTop: "5px"
                                  }}
                                >
                                  {linha.sequencia}
                                </p>
                              </Row>
                            </Col>
                          </Row>
                          <Row
                            style={{
                              height: "70%"
                            }}
                          >
                            <Col span={24}>
                              <Barcode
                                width={3}
                                margin={0}
                                height={20}
                                displayValue={false}
                                value={barcodeString}
                              ></Barcode>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  <Row
                    style={{
                      height: "40%",
                      borderTop: "1px solid #000",
                      borderRight: "1px solid #000",
                      borderLeft: "1px solid #000"
                    }}
                  >
                    <Col span={24}>
                      <Row>
                        <p
                          style={{
                            fontSize: "15px",
                            paddingLeft: "5px",

                            paddingTop: "5px"
                          }}
                        >
                          Produto:
                        </p>
                        <p
                          style={{
                            paddingTop: "4px",
                            fontSize: "18px",
                            paddingLeft: "20px"
                          }}
                        >
                          {linha.produto_cliente}
                        </p>
                      </Row>
                      <Row>
                        <p
                          style={{
                            fontSize: "15px",
                            paddingLeft: "5px"
                          }}
                        >
                          {linha.DescProdutoCliente}
                        </p>
                      </Row>
                      <Row>
                        <p
                          style={{
                            fontSize: "15px",
                            paddingLeft: "5px"
                          }}
                        ></p>
                      </Row>
                    </Col>
                  </Row>

                  <Row
                    style={{
                      height: "20%",
                      borderTop: "1px solid #000",
                      borderRight: "1px solid #000",
                      borderBottom: "1px solid #000",
                      borderLeft: "1px solid #000"
                    }}
                  >
                    <Col
                      span={16}
                      style={{
                        borderRight: "1px solid #000"
                      }}
                    >
                      <Row
                        style={{
                          alignItems: "center",
                          height: "100%",
                          paddingLeft: "12px",
                          paddingRight: "12px"
                        }}
                      >
                        <Barcode
                          width={3}
                          margin={0}
                          displayValue={false}
                          height={30}
                          value={linha.produto_cliente}
                        ></Barcode>
                      </Row>
                    </Col>
                    <Col span={8}>
                      <Row
                        style={{
                          height: "50%",
                          paddingTop: "5px",
                          flexDirection: "row-reverse",
                          alignItems: "flex-end"
                        }}
                      >
                        <p
                          style={{
                            fontSize: "15px",
                            paddingRight: "24px"
                          }}
                        >
                          Qtd.
                        </p>
                      </Row>
                      <Row
                        style={{
                          height: "50%",
                          flexDirection: "row-reverse",
                          alignItems: "center"
                        }}
                      >
                        <p
                          style={{
                            fontSize: "15px",
                            paddingRight: "24px"
                          }}
                        >
                          {linha.qty}
                        </p>
                      </Row>
                    </Col>
                  </Row>
                </Col>
              </Row>
            );
          });
        })}
      </div>
    );
  }
}
