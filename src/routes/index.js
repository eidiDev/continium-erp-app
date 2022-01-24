import React, { useState, useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';

import asyncComponent from 'util/asyncComponent';
import api from '../util/Api';
import Administrator from './administrator/index';
import Categ from './commonData/Categoria/index';
import Produtos from './commonData/Produtos/index';
import MachineLab from './commonData/MaquinaMaodeObra/index';
import Estabelecimento from './commonData/Estabelecimento/index';
import KitProdutos from './commonData/KitProdutos/index';
import etapaXprodutos from './commonData/etapaXprodutos/index';
import StepProcess from './commonData/EtapasProcesso/index';
import orderProd from './production/prodOrder/index';
import noteProd from './production/noteProd/index';
import Industrialization from './production/Industrialization/index';
import ExplosiveOrder from './production/ExplosiveOrder/index';
import Management from './production/ManagementOrders/index';
import ManagementMachine from './production/ManagementMachines/index';
import GerenciamentoPrioridades from './production/GerenciamentoPrioridades/index';
import PedidoDeVenda from './Sales/PedidosDeVenda/index';

import './maktorcss.less';

// let role = localStorage.getItem('role');
// let myJson = JSON.parse(role);

const App = ({ match }) => {
  const [data, setData] = useState({ user: {} });
  let token = localStorage.getItem('token');
  useEffect(() => {
    const fetchData = async () => {
      const result = await api.post('getUserSession', {
        headers: { 'access-token': `Bearer ${token}` },
      });
       console.log(result);
      setData(result.data);
    };

    fetchData();
  }, []);

   console.log(data);
  return (
    <div className="gx-main-content-wrapper">
      <Switch>
        {/* <Route path={`${match.url}dashboard`} component={asyncComponent(() => import('./dashboard'))}/> */}
        <Route
          path={`${match.url}dashboard`}
          component={asyncComponent(() => import('./dashboard/V3'))}
        />
        <Route
          path={`${match.url}dashboardV3`}
          component={asyncComponent(() => import('./dashboard/V3'))}
        />
        <Route
          path={`${match.url}tablet`}
          component={asyncComponent(() => import('./Tablet'))}
        />
        <Route path={`${match.url}commondata/categoria`} component={Categ} />
        <Route
          path={`${match.url}commondata/etapaXprodutos`}
          component={etapaXprodutos}
        />
        {/* <Route path={`${match.url}commonData/categoria`} component={asyncComponent(() => import('./commonData/categoria/'))}/> */}
        <Route path={`${match.url}commondata/produtos`} component={Produtos} />
        <Route path={`${match.url}Sales/PedidoVenda`} component={PedidoDeVenda} />

        <Route
          path={`${match.url}Sales/RelPedidoVenda`}
          component={asyncComponent(() =>
            import('../routes/Sales/RelPedidoVenda')
          )}
        />

        <Route
          path={`${match.url}Sales/ValidationPedidoVenda`}
          component={asyncComponent(() =>
            import('../routes/Sales/ValPedidoVenda/index')
          )}
        />

        <Route
          path={`${match.url}Sales/GerarOrdemPedidoVenda`}
          component={asyncComponent(() =>
            import('../routes/Sales/GerarOrdPedidoVenda/index')
          )}
        />

        <Route
          path={`${match.url}production/gerenPrioridade`}
          component={asyncComponent(() =>
            import('../routes/production/ManagementPriority/index')
          )}
        />

        <Route
          path={`${match.url}Sales/FollowUp`}
          component={asyncComponent(() =>
            import('../routes/Sales/FollowUp/index')
          )}
        />
        
        <Route
          path={`${match.url}commondata/machineLab`}
          component={MachineLab}
        />
        <Route
          path={`${match.url}production/listordemprod`}
          component={orderProd}
        />
        <Route path={`${match.url}production/noteprod`} component={noteProd} />
        <Route
          path={`${match.url}production/management`}
          component={Management}
        />
        <Route
          path={`${match.url}production/managementMachine`}
          component={ManagementMachine}
        />
        <Route
          path={`${match.url}production/explosiveOrder`}
          component={ExplosiveOrder}
        />
        <Route
        path={`${match.url}commondata/importOrdersFox`}
        component={asyncComponent(() => import('../routes/administrator/ImportOrdersFox'))}
        />
        <Route
          path={`${match.url}production/industrialization`}
          component={Industrialization}
        />
        <Route
          path={`${match.url}production/gerenciamentoPrioridades`}
          component={GerenciamentoPrioridades}
        />
        <Route
          path={`${match.url}commondata/stepprocess`}
          component={StepProcess}
        />
        <Route
          path={`${match.url}commondata/kitprod`}
          component={KitProdutos}
        />
        <Route
          path={`${match.url}commondata/estabelecimento`}
          component={Estabelecimento}
        />
        {data.role === 'admin' ? (
          <Route path={`${match.url}administrator`} component={Administrator} />
        ) : (
          // <Route path={`${match.url}administrator/matrizCalculoCilindro`} component={MatrizCalculoCilindro}/>
          // <Route path={`${match.url}administrator/importOrdersFox`} component={ImportOrdersFox}/>
          ''
        )}
        <Route
          exact
          path={`${match.url}commonData/customers`}
          component={asyncComponent(() => import('./commonData/customers/'))}
        />
      </Switch>
    </div>
  );
};

export default App;
