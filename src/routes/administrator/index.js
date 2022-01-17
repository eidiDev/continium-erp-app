import React from 'react';
import { Route, Switch } from 'react-router-dom';
import asyncComponent from 'util/asyncComponent';

const Administrator = ({ match }) => (
  <Switch>
    <Route
      path={`${match.url}/users`}
      component={asyncComponent(() => import('./Users'))}
    />
    <Route
      path={`${match.url}/cadTaxaHora`}
      component={asyncComponent(() => import('./CadTaxaHora'))}
    />
    <Route
      path={`${match.url}/cadDashboards`}
      component={asyncComponent(() => import('./CadDashboards'))}
    />
    <Route
      path={`${match.url}/matrizCalculoCilindro`}
      component={asyncComponent(() => import('./MatrizCalculoCilindro'))}
    />
    <Route
      path={`${match.url}/subGrupoMatriz`}
      component={asyncComponent(() => import('./SubGrupoMatriz'))}
    />
    <Route
      path={`${match.url}/stockUsers`}
      component={asyncComponent(() => import('./StockUsers'))}
    />
  </Switch>
);

export default Administrator;
