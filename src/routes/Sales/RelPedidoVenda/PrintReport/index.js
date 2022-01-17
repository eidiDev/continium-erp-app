import React, { Fragment, Component } from 'react';
import ReactToPrint from 'react-to-print';
import { Button, Col, Row, Card } from 'antd';
import "./style.css"
import imgSvg from './knapp_logo.svg'
import moment from 'moment';
const numero = require('numero-por-extenso');

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
          trigger={() => <Button type="primary" style={{ width: "100%" }}>Imprimir</Button>}
          content={() => this.componentRef.current}
        />

        <div className="page-break" style={{ display: 'none' }}>
          <PrintComponent
            ref={this.componentRef}
            data={this.props.data}
          />
        </div>
      </Fragment>

    )
  }



}

export default PrintReport;

export class PrintComponent extends React.Component {

  getTotalValue = (data) => {
    for (const pdVenda of data) {
      let resultadoTotal = 0
      for (const linha of pdVenda.linhas) {
        
         resultadoTotal += linha.valor_unitario === null ? parseFloat(0) : parseFloat( parseFloat(linha.valor_unitario) * parseFloat(linha.qty))
      }

      return parseFloat(resultadoTotal).toFixed(2)
    }
  }

  render() {
    const {
      data
    } = this.props;
    let resultado


    if (typeof data === 'undefined') {


      return <Fragment />;
    } else {
      console.log(data);
      resultado =  this.getTotalValue(data)
     

    }

    return (

      <div
        ref={(el) => (this.componentRef = el)}
        id="divToPrint"
        className="print-container"
        style={{
          backgroundColor: '#FFF',
        }}
      >

        {/*

        <div className="date-report">
          05/01/2021
          </div>
*/}

        {
          data.map(pdvenda => {
            pdvenda.linhas.sort(function(a, b) {
              return a.sequencia - b.sequencia; 
            });
            return (
              <Fragment>

                <div className="page-break">

                  <Row >
                    <Col span={24} style={{ display: "flex", justifyContent: "space-between" }}>
                      <Col span={12}>
                        <div style={{ marginLeft: "10px", }}>

                          <img src={imgSvg} style={{ width: '150px' }}></img>

                        </div>
                      </Col>

                      <Col span={12}>
                        <div style={{ marginLeft: "10px", }}>

                          Transação: 90412 - Entrada de OC p/Industriali DRAWBACK

                        </div>
                      </Col>
                    </Col>
                  </Row>

                  <Row >
                    <Col span={24} style={{ margin: "auto" }}>
                      <div style={{ marginLeft: "10px", }}>

                        <b>P.O.N {pdvenda.id}</b>

                      </div>
                    </Col>
                  </Row>


                  <Row >
                    <Col span={24} style={{ margin: "auto" }}>
                      <div style={{ marginLeft: "10px", fontSize: "10px" }}>

                        Fornecedor
                      </div>
                    </Col>
                  </Row>

                  <Row >
                    <Col span={24} style={{ display: "flex", justifyContent: "space-between" }}>
                      <Col span={12}>
                        <Card className="provider-card" bodyStyle={{ padding: "10px", border: "1px solid" }}>
                          <Row>
                            <Col span={6}>
                              <Row>
                                <p>
                                  Nome
                                </p>
                              </Row>
                              <Row>
                                <p>
                                  Endereço
                                </p>
                              </Row>
                              <Row>
                                <p>
                                  Cidade
                                </p>
                              </Row>
                              <Row>
                                <p>

                                  Telefone
                                </p>
                              </Row>
                            </Col>
                            <Col span={18}>
                              <Row>
                                <p>

                                  1.377 ITALSERVICE AUTOMAÇÃO INDUSTRIAL LTDA
                                </p>
                              </Row>
                              <Row>
                                <p>

                                  R APUCARANA
                                </p>
                              </Row>
                              <Row>
                                <Col span={12}>
                                  <p>

                                    SAO JOSE DOS PINHAIS
                                  </p>

                                </Col>
                                <Col span={12}>
                                  <p>

                                    UF: PR{" "}CEP:  83010-050
                                  </p>
                                </Col>
                              </Row>
                              <Row>
                                <Col span={12}>
                                  <p>

                                    (41) 3209-7203
                                  </p>
                                </Col>
                                <Col span={12}>
                                  <p>

                                    Cnpj: 14.445.322/0001-59
                                  </p>
                                </Col>
                              </Row>
                            </Col>

                          </Row>
                        </Card>
                      </Col>
                      <Col span={12}>
                        <Card className="provider-card" bodyStyle={{ padding: "10px", border: "1px solid" }}>
                          <Row>
                            <Col span={6}>
                              <Row>
                                <p>

                                  Nome
                                </p>
                              </Row>
                              <Row>
                                <p>

                                  Endereço
                                </p>
                              </Row>
                              <Row>
                                <p>

                                  Cidade
                                </p>
                              </Row>
                              <Row>
                                <p>

                                  Telefone
                                </p>
                              </Row>
                            </Col>
                            <Col span={18}>
                              <Row>
                                <p>

                                  KNAPP
                                </p>

                              </Row>
                              <Row>
                                <p>

                                  AV. RUI BARBOSA
                                </p>
                              </Row>
                              <Row>
                                <Col span={12}>
                                  <p>

                                    SAO JOSE DOS PINHAIS
                                  </p>

                                </Col>
                                <Col span={12}>
                                  <p>

                                    UF: PR{" "}CEP:  83065-260
                                  </p>
                                </Col>
                              </Row>
                              <Row>
                                <Col span={12}>
                                  <p>

                                    (41) 3311-4
                                  </p>
                                </Col>
                                <Col span={12}>
                                  <p>

                                    Cnpj: 02.322.789/0001-22
                                  </p>
                                </Col>
                              </Row>
                            </Col>

                          </Row>
                        </Card>
                      </Col>
                    </Col>
                  </Row>


                  <Row>
                    <Col span={24}>
                      <Row>
                        <Col span={12}>
                          <b>Condição de pagamento: 7 dias</b>
                        </Col>
                        <Col span={12}>
                          <b>Forma de pagamento: </b>
                        </Col>
                      </Row>
                      <Row>
                        <Col span={12}>
                          <b>Transportadora.....:</b>
                        </Col>
                        <Col span={12}>
                          <b>Tipo frete.....:</b>{" "}CIF-PAGO
                        </Col>
                      </Row>
                      <Row>
                        <Col span={12}>
                          <b>Local de entrega....:</b> 83085-057 SAO JOSE DOS PINHAIS
                        </Col>
                        <Col span={12}>
                          RUA AV. RUI BARBOSA 5525

                        </Col>

                      </Row>
                    </Col>
                  </Row>

                  <br />

                  <Row>
                    <Col span={24}>
                      <div style={{ border: "1px", borderStyle: "dotted", width: "100%" }}></div>
                    </Col>
                  </Row>
                  <Row style={{ marginTop: "2px" }} />

                  <Row className="advice-report">
                    <Col span={24}>
                      <div style={{ border: "1px", borderStyle: "dotted", width: "100%" }}></div>
                    </Col>
                    <Col span={24}>
                      <b>*** ATENÇÃO *** Novo horário de recebimento: 08:00 às 16:00 *** ATENÇÃO ***</b>
                    </Col>
                    <Col span={24}>
                      <p>- Reservamo-nos o direito de tornar sem efeito esta O.C. caso as mercadorias venham em desacordo ou fora do prazo estipulado para entrega.</p>
                    </Col>
                    <Col span={24}>
                      <p style={{ marginLeft: "10px" }}>- Solicitamos confirmação desta solicitação de compra.</p>
                    </Col>
                    <Col span={24}>
                      <p style={{ marginLeft: "10px" }}>- Favor indicar o número desta Ordem de Compra na Nota Fiscal.</p>
                    </Col>
                  </Row>

                  <Row>
                    <Col span={24}>
                      <div style={{ border: "1px", borderStyle: "dotted", width: "100%" }}></div>
                    </Col>
                  </Row>
                  <Row style={{ marginTop: "2px" }} />

                  <Row>
                    <Col span={24}>
                      <div style={{ border: "1px", borderStyle: "dotted", width: "100%" }}></div>
                    </Col>
                  </Row>

                  <br />

                  <Row>
                    <Col span={24}>
                      <h3>OBSERVAÇÕES:</h3>
                    </Col>
                  </Row>

                  <Row>
                    <Col span={24}>
                      <b> ATO 20200050478 - PROJETO NATURA PERU - EXISTENTES 02   </b>

                    </Col>
                  </Row>

                  <br />

                  <Row>
                    <Col span={24}>


                      <table style={{ width: '100%' }}>
                        <thead style={{ fontSize: '3.17mm' }}>
                          <tr style={{ borderBottom: '1px solid' }}>

                            <th>Qtde</th>
                            <th>Seq</th>
                            <th>U.M</th>
                            <th>Des.Form</th>
                            <th>Cód.Knapp</th>
                            <th>Descrição do produto</th>
                            <th>Classif. Fiscal</th>
                            <th>Data Entr.</th>
                            <th>Vlr Unit</th>
                            <th>Vlr Prod</th>
                            <th>% IPI</th>
                            <th>Vir IPI</th>


                          </tr>

                        </thead>

                        <tbody style={{ fontSize: '3.17mm' }} >

                          {pdvenda.linhas.map((dt, index) => (
                            <tr>
                              <td>{dt.qty}</td>
                              <td>{dt.sequencia}</td>
                              <td>{dt.productObj.unity}</td>
                              <td>{dt.productObj.cod}</td>
                              <td>{dt.produto_cliente}</td>
                              <td>{dt.productObj.description1} {dt.productObj.description2} {dt.productObj.description3}</td>
                              <td>8431.39.00</td>
                              <td>{moment(dt.data_entrega).format('DD/MM/YYYY')}</td>
                              <td>{dt.valor_unitario === null ? parseFloat(0).toFixed(2) : dt.valor_unitario }</td>
                              <td>{dt.valor_prod}</td>
                              <td>0.00</td>
                              <td>{dt.valor_ipi}</td>




                              {/*
      <td>{dt.nr_volumes}</td>
      <td>{dt.endereco_cobranca}</td>
      <td>{dt.endereco_entrega}</td>
      <td>{dt.numnfe}</td>
      <td>{dt.obs}</td>
      <td>{dt.orddat}</td>
      <td>{dt.peso_bruto}</td>
      <td>{dt.serie}</td>
      <td>{dt.vl_total}</td>
      <td>{dt.vl_total_desc}</td>
      <td>{dt.vl_total_frete}</td>
      <td>{dt.vl_total_merc}</td>
      <td>{dt.vl_total_outros}</td>

*/}
                            </tr>
                          ))}

                        </tbody>

                      </table>

                    </Col>
                  </Row>

                  <br />
                  <Row>
                    <Col span={24}>
                      <Row>
                        <Col span={8}>
                          <Row>

                            <Col span={12}>
                              <b>Valor produtos:</b>
                            </Col>
                            <Col span={12}>
                              <b>{resultado}</b>
                            </Col>
                          </Row>
                        </Col>
                        <Col span={8}>
                          <Row>

                            <Col span={12}>
                              <b>Valor serviços:</b>
                            </Col>
                            <Col span={12}>
                              <b>0,00</b>
                            </Col>
                          </Row>
                        </Col>

                        <Col span={8}>
                          <Row>
                            <Col span={12}>
                              <b>Valor desconto:</b>
                            </Col>
                            <Col span={12}>
                              <b>0,00</b>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </Col>

                  </Row>

                  <Row>
                    <Col span={24}>
                      <Row>
                        <Col span={8}>
                          <Row>

                            <Col span={12}>
                              <b>ValorIPI:</b>
                            </Col>
                            <Col span={12}>
                              <b>0,00</b>
                            </Col>
                          </Row>
                        </Col>
                        <Col span={8}>
                          <Row>

                            <Col span={12}>
                              <b>ValorISS:</b>
                            </Col>
                            <Col span={12}>
                              <b>0,00</b>
                            </Col>
                          </Row>
                        </Col>

                        <Col span={8}>
                          <Row>
                            <Col span={12}>
                              <b>ValorISS:</b>

                            </Col>
                            <Col span={12}>
                              <b>0,00</b>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </Col>

                  </Row>


                  <Row>
                    <Col span={24}>
                      <Row>
                        <Col span={8}>
                          <Row>

                            <Col span={12}>
                              <b>Valor ICMS:</b>
                            </Col>
                            <Col span={12}>
                              <b>0,00</b>
                            </Col>
                          </Row>
                        </Col>
                        <Col span={8}>
                          <Row>

                            <Col span={12}>
                              <b>ValorIRRF:</b>
                            </Col>
                            <Col span={12}>
                              <b>0,00</b>
                            </Col>
                          </Row>
                        </Col>

                        <Col span={8}>
                          <Row>
                            <Col span={12}>
                              <b>Valor Outras Ret:</b>

                            </Col>
                            <Col span={12}>
                              <b>0,00</b>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </Col>

                  </Row>

                  <Row>
                    <Col span={24}>
                      <Row>
                        <Col span={8}>
                          <Row>

                            <Col span={12}>
                              <b>Valor Líquido:</b>
                            </Col>
                            <Col span={12}>
                              <b>{resultado}</b>
                            </Col>
                          </Row>
                        </Col>
                        <Col span={8}>
                          <Row>

                            <Col span={12}>
                              <b>Valor Líquido:</b>

                            </Col>
                            <Col span={12}>
                              <b>0,00</b>
                            </Col>
                          </Row>
                        </Col>

                        <Col span={8}>
                          <Row>
                            <Col span={12}>
                              <b>Valor Original OC:</b>



                            </Col>
                            <Col span={12}>
                              <b>{resultado}</b>

                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </Col>

                  </Row>

                  <Row>
                    <Col span={24}>
                      <div style={{ border: "1px", borderStyle: "solid", width: "100%" }}></div>
                    </Col>
                  </Row>
                  <br />
                  <div>

                    <b>Valor extenso da ordem de compra: </b>
                    {numero.porExtenso(resultado)}
                    ************** **********************************************************************************
                  </div>
                  <br />

                  <Row>
                    <Col span={24}>
                      <div style={{ border: "1px", borderStyle: "solid", width: "100%" }}></div>
                    </Col>
                  </Row>

                  <Row>
                    <Col span={24}>
                      <b>Local de Apresentação da Fatura: </b>
                    </Col>
                  </Row>
                  <br />
                  <Row>
                    <Col span={24}>
                      <Row>
                        <Col span={14}>
                          <Row>
                            <Col span={12}>
                              <b>Cep: </b>
                            </Col>
                            <Col span={12}>
                              <div>83085-057 SAO JOSE DOS PINHAIS - PR </div>
                            </Col>

                          </Row>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={24}>
                      <div style={{ border: "1px", borderStyle: "solid", width: "100%" }}></div>
                    </Col>
                  </Row>



                  <Row>
                    <Col span={12} style={{ borderRight: "1px solid" }}>
                      <b>Autorizado por:</b>
                      <Row>
                        <Col span={4} style={{ borderBottom: "1px solid" }}>
                          <Row>
                            <Col span={8}>
                            </Col>
                            |
                            <Col span={8}>
                            </Col>
                            |
                            <Col span={8}>
                            </Col>
                          </Row>
                        </Col>
                        <Col span={1} />

                        <Col span={19} style={{ borderBottom: "1px solid" }}>

                        </Col>

                      </Row>
                    </Col>
                    <Col span={12}>
                      <b>Aceite pelo fornecedor:</b>
                      <Row>
                        <Col span={4} style={{ borderBottom: "1px solid" }}>
                          <Row>
                            <Col span={8}>
                            </Col>
                            |
                            <Col span={8}>
                            </Col>
                            |
                            <Col span={8}>
                            </Col>
                          </Row>
                        </Col>
                        <Col span={1} />

                        <Col span={19} style={{ borderBottom: "1px solid" }}>

                        </Col>

                      </Row>

                    </Col>
                  </Row>

                  <Row>
                    <Col span={12} >
                      <Row>
                        <Col span={5}>
                        </Col>
                        <Col span={19} style={{ textAlign: "center" }}>
                          <b>

                            Assinatura
                          </b>
                        </Col>
                      </Row>
                    </Col>
                    <Col span={12} >
                      <Row>
                        <Col span={5}>
                        </Col>
                        <Col span={19} style={{ textAlign: "center" }}>
                          <b>

                            Assinatura
                          </b>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  <br />
                  <Row>
                    <Col span={12}>
                      <Row>
                        <Col span={6}>
                          <b>Solicitado por:</b>
                        </Col>

                        <Col span={12} style={{ borderBottom: "1px solid" }}>

                        </Col>

                        <Col span={6}>
                          <b>em {moment(pdvenda.created_at).format('DD/MM/YYYY')}</b>
                        </Col>

                      </Row>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12}>
                      <Row>
                        <Col span={6}>
                        </Col>

                        <Col span={12} >
                          <b>Christian Hiroshi Cimada Novac</b>
                        </Col>

                        <Col span={6}>
                        </Col>

                      </Row>
                    </Col>
                  </Row>
                  <br />


                  <Row>
                    <Col span={24}>
                      <div style={{}}>
                        O pedido de compra obriga a Knapp exclusivamente em relação ao valor do bem ou serviço nela estipulado, com a inclusão dos respectivos impostos quando aplicável por lei e expressamente aceito neste instrumento.A Knapp
                        não aceitará cobranças de taxas bancárias de qualquer natureza em relação ao pagamento do bem ou serviço.
                      </div>
                    </Col>
                  </Row>
                </div>
              </Fragment>
            )
          })
        }

      </div>


    );
  }
}
