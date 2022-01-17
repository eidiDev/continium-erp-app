import React, {useState} from "react";
import {Col, Row, Button, Modal, Input, notification } from "antd";

// import {Area, AreaChart, Line, LineChart, ResponsiveContainer, Tooltip} from "recharts";
// import {increamentData, lineData} from "./Metrics/data";
//import ChartCard from "components/dashboard/Crypto/ChartCard";
import Auxiliary from "util/Auxiliary";
// import Portfolio from "components/dashboard/Crypto/Portfolio";
// import BalanceHistory from "components/dashboard/Crypto/BalanceHistory";
// import SendMoney from "components/dashboard/Crypto/SendMoney";
// import RewardCard from "components/dashboard/Crypto/RewardCard";
// import CurrencyCalculator from "components/dashboard/Crypto/CurrencyCalculator";
// import CryptoNews from "components/dashboard/Crypto/CryptoNews";
// import DownloadMobileApps from "components/dashboard/Crypto/DownloadMobileApps";
// import OrderHistory from "components/dashboard/Crypto/OrderHistory";

const {confirm } = Modal;

function showConfirm() {

  confirm({
    title: 'Voce tem certeza de LIGAR a maquina ?',
    onOk() {
        openNotificationWithIcon('success')
    },
    onCancel() {},
  });
}
function showConfirmDes() {

  confirm({
    title: 'Voce tem certeza de DESLIGAR a maquina ?',
    onOk() {
        openNotificationWithIcon2('success')
    },
    onCancel() {},
  });
}

const openNotificationWithIcon2 = type => {
  notification[type]({
    message: 'MAQUINA DESLIGADA !',
    description:
      'A maquina foi Desligada.',
  });
};


const openNotificationWithIcon = type => {
  notification[type]({
    message: 'MAQUINA LIGADA !',
    description:
      'A maquina foi acionada.',
  });
};


const Crypto = () => {

  const [modalOpen , setModalOpen] = useState({name:'',estado: false});
  return (
    <Auxiliary>

      {/* Header */}
      <Row>
        <Col lg={4} md={12} sm={12} xs={24}>
          <Button style={{padding: "60px"}} type="primary" onClick={()=> setModalOpen({name:'Cro/cliente', estado: true})}  size="large" block={true}>
          <h2 style={{color: "white"}}>CRO/Cliente</h2>
          </Button>
        </Col>
        <Col lg={4} md={12} sm={12} xs={24}    >
          <Button style={{padding: "60px"}} type="primary" onClick={()=> setModalOpen({name:'Sequencia', estado: true})} size="large" block={true}>
          <h2 style={{color: "white"}}>Sequencia</h2>
          </Button>
        </Col>
        <Col lg={4} md={12} sm={12} xs={24} >
          <Button style={{padding: "60px"}} type="primary" onClick={()=> setModalOpen({name:'Mapeamento', estado: true})} size="large" block={true}>
          <h2 style={{color: "white"}}>Mapeamento</h2>
            </Button>
        </Col>
        <Col lg={4} md={12} sm={12} xs={24} >
          <Button style={{padding: "60px"}} type="primary" onClick={()=> setModalOpen({name:'Informacoes', estado: true})} size="large" block={true}>            
            <h2 style={{color: "white"}}>Informacoes</h2>
          </Button>
        </Col>

        <Col lg={4} md={12} sm={12} xs={24} >
          <Button style={{padding: "60px"}} type="primary" onClick={()=> setModalOpen({name:'Fornecedor', estado: true})} size="large" block={true}>
            <h2 style={{color: "white"}}>Fornecedor</h2>
          </Button>
        </Col>
        <Col lg={4} md={12} sm={12} xs={24} >
          <Button style={{padding: "60px"}} type="primary" onClick={()=> setModalOpen({name:'Observacao', estado: true})} size="large" block={true}>
            
            <h2 style={{color: "white"}}>Observaçao</h2>
          </Button>
        </Col>

      </Row>
      
      {/* Details */}
      <Row>

        <Col xl={12} lg={24} md={12} sm={24} xs={24}>
        <Button style={{padding: "100px", fontSize: "29px"}} type="primary" onClick={()=> setModalOpen({name:'Login', estado: true})} size="large" block={true}>
        <h1 style={{color: "white"}}>LOGIN</h1>
          </Button>
        </Col>


        <Col xl={12} lg={24} md={12} sm={24} xs={24}>
        <Button style={{padding: "100px", fontSize: "29px"}} type="primary" onClick={()=> setModalOpen({name:'Envio', estado: true})} size="large" block={true}>
            <h1 style={{color: "white"}}>ENVIO</h1>
          </Button>
        </Col>

        <Col xl={12} lg={24} md={12} sm={24} xs={24}>
        <Button style={{padding: "100px"}} className="gx-btn-secondary"  onClick={showConfirm} size="large" block={true}>
            <h1 style={{color: "white", fontSize: "29px"}}>START</h1>
          </Button>
        </Col>

        <Col xl={12} lg={24} md={12} sm={24} xs={24}>
        <Button style={{padding: "100px", fontSize: "29px"}} className="gx-btn-red"  onClick={showConfirmDes} size="large" block={true}>
        <h1 style={{color: "white", fontSize: "29px"}}>STOP</h1>
          </Button>
        </Col>

        <Col xl={12} lg={24} md={12} sm={24} xs={24}>
        <Button type="primary" style={{padding: "100px"}} onClick={()=> setModalOpen({name:'Qualidade', estado: true})} size="large" block={true}>
            <h1 style={{color: "white", fontSize: "29px"}}>QUALIDADE</h1>
          </Button>
        </Col>

        
        <Col xl={12} lg={24} md={12} sm={24} xs={24}>
        <Button style={{padding: "100px"}} type="primary" onClick={()=> setModalOpen({name:'Recebimento', estado: true})} size="large" block={true}>
            <h1 style={{color: "white", fontSize: "29px"}}>RECEBIMENTO</h1>
          </Button>
        </Col>

        {/* <Col xl={9} lg={24} md={24} sm={24} xs={24}>
          <SendMoney/>
        </Col>
        <Col xl={6} lg={12} md={12} sm={24} xs={24}>
          <RewardCard/>
        </Col>
        <Col xl={9} lg={12} md={12} sm={24} xs={24}>
          <CurrencyCalculator/>
        </Col>

        <Col xl={15} lg={24} md={24} sm={24} xs={24}>
          <CryptoNews/>
        </Col>
        <Col xl={9} lg={24} md={24} sm={24} xs={24}>
          <DownloadMobileApps/>
          <OrderHistory/>
        </Col> */}
      </Row>

      { <Modal 
      visible={modalOpen.estado} 
      onCancel={() => setModalOpen(false)} 
      onOk={() => setModalOpen(false)} 
      >
        <h1>
        {modalOpen.name}
        </h1>

        {
          modalOpen.name === 'Login' ? 
          <div>
            <div>
              <p>Login:</p>
              <Input size="large" ></Input>
            </div>
            
            <br/>

            <div>
              <p>Senha:</p>
              <Input size="large" type="password" ></Input>
            </div>
            
          </div>
          : ""
        }
      </Modal>
      }
      

    </Auxiliary>
  );
};

export default Crypto;
