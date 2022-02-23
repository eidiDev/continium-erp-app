import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Menu } from 'antd';
import { Link } from 'react-router-dom';
import IntlMessages from '../../util/IntlMessages';
import api from '../../util/Api';
import {
  NAV_STYLE_ABOVE_HEADER,
  NAV_STYLE_BELOW_HEADER,
  NAV_STYLE_DEFAULT_HORIZONTAL,
  NAV_STYLE_INSIDE_HEADER_HORIZONTAL,
} from '../../constants/ThemeSetting';

const SubMenu = Menu.SubMenu;
// const MenuItemGroup = Menu.ItemGroup;

class HorizontalNav extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      trava: 0,
    };
  }

  getUser() {
    let token = localStorage.getItem('token');
    // { headers: {"access-token" : `Bearer ${token}`}

    api
      .post(`getUserSession`, { headers: { 'access-token': `Bearer ${token}` } })
      .then((result) => {
        let dataUser = [];
         console.log(result);
        dataUser = result.data;
        if (this.state.user)
          this.setState({
            user: dataUser,
          });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  componentWillMount() {
    this.getUser();
  }

  getNavStyleSubMenuClass = (navStyle) => {
    switch (navStyle) {
      case NAV_STYLE_DEFAULT_HORIZONTAL:
        return 'gx-menu-horizontal gx-submenu-popup-curve';
      case NAV_STYLE_INSIDE_HEADER_HORIZONTAL:
        return 'gx-menu-horizontal gx-submenu-popup-curve gx-inside-submenu-popup-curve';
      case NAV_STYLE_BELOW_HEADER:
        return 'gx-menu-horizontal gx-submenu-popup-curve gx-below-submenu-popup-curve';
      case NAV_STYLE_ABOVE_HEADER:
        return 'gx-menu-horizontal gx-submenu-popup-curve gx-above-submenu-popup-curve';
      default:
        return 'gx-menu-horizontal';
    }
  };

  render() {
    const { pathname, navStyle } = this.props;
    const selectedKeys = pathname.substr(1);
    const defaultOpenKeys = selectedKeys.split('/')[1];
    // let role = localStorage.getItem('role');
    // let myJson = JSON.parse(role);
    const usuario = this.state.user;
     console.log(usuario);
    return (
      <Menu
        defaultOpenKeys={[defaultOpenKeys]}
        selectedKeys={[selectedKeys]}
        mode="horizontal"
      >
        {usuario.role === 'admin' ? (
          <SubMenu
            key="administrator"
            className="gx-menu-horizontal"
            title={<IntlMessages id="administrator.main" />}
          >
            <Menu.Item key="users">
              <Link to="/administrator/users">
                <i className="icon icon-profile" />
                <IntlMessages id="administrator.users" />
              </Link>
            </Menu.Item>

		{/* <Menu.Item key="stockUsers">
              <Link to="/administrator/stockUsers">
                <i className="icon icon-profile" />
                Stock Usuarios
              </Link>
            </Menu.Item> */}
            <Menu.Item key="machineLab">
          <Link to="/commondata/machineLab">
            <i className="icon icon-profile" />
            <IntlMessages id="commondata.machinelabor" />
          </Link>
        </Menu.Item>

		<Menu.Item key="cadTaxaHora">
              <Link to="/administrator/cadTaxaHora">
                <i className="icon icon-profile" />
                Taxa Hora
              </Link>
            </Menu.Item>

            <Menu.Item key="cadDashboards">
              <Link to="/administrator/cadDashboards">
                <i className="icon icon-profile" />
                Cadastro Dashboards
              </Link>
            </Menu.Item>

            {/* <Menu.Item key="matrizCalculoCilindro">
              <Link to="/administrator/matrizCalculoCilindro">
                <i className="icon icon-profile" />
                Matriz de Calculo de Camisa e Haste
              </Link>
            </Menu.Item>

            <Menu.Item key="subGrupoMatriz">
              <Link to="/administrator/subGrupoMatriz">
                <i className="icon icon-profile" />
                Subgrupo de Matriz
              </Link>
            </Menu.Item> */}
          </SubMenu>
        ) : (
          ''
        )}

        <SubMenu
          key="commondata"
          className="gx-menu-horizontal"
          title={<IntlMessages id="commondata.main" />}
        >
          <Menu.Item key="customers">
            <Link to="/commondata/customers">
              <i className="icon icon-profile" />
              <IntlMessages id="commondata.customers" />
            </Link>
          </Menu.Item>

          <Menu.Item key="categoria">
            <Link to="/commondata/categoria">
              <i className="icon icon-profile" />
              <IntlMessages id="commondata.categoria" />
            </Link>
          </Menu.Item>

          <Menu.Item key="produtos">
            <Link to="/commondata/Produtos">
              <i className="icon icon-profile" />
              <IntlMessages id="commondata.produtos" />
            </Link>
          </Menu.Item>

          <Menu.Item key="estabelecimento">
            <Link to="/commondata/Estabelecimento">
              <i className="icon icon-profile" />
              <IntlMessages id="commondata.estabelecimento" />
            </Link>
          </Menu.Item>

        

          <Menu.Item key="kitprod">
            <Link to="/commondata/kitprod">
              <i className="icon icon-profile" />
              <IntlMessages id="commondata.kitprod" />
            </Link>
          </Menu.Item>

          <Menu.Item key="stepprocess">
            <Link to="/commondata/stepprocess">
              <i className="icon icon-profile" />
              <IntlMessages id="commondata.stepprocess" />
            </Link>
          </Menu.Item>

          <Menu.Item key="etapaXprodutos">
            <Link to="/commondata/etapaXprodutos">
              <i className="icon icon-profile" />
              <IntlMessages id="commondata.etapaXprodutos" />
            </Link>
          </Menu.Item>
          
         {/* <Menu.Item key="importOrdersFox">
              <Link to="/commondata/importOrdersFox">
                <i className="icon icon-profile" />
                Importar Ordens Fox
              </Link>
         </Menu.Item> */}
        </SubMenu>

        <SubMenu
          key="Produção"
          className="gx-menu-horizontal"
          title={<IntlMessages id="prod.main" />}
        >
          <Menu.Item key="OrdemDeProd">
            <Link to="/production/listordemprod">
              <i className="icon icon-orders" />
              <IntlMessages id="prod.ordemdeprod" />
            </Link>
          </Menu.Item>

          {/* <Menu.Item key="explosiveOrder">
            <Link to="/production/explosiveOrder">
              <i className="icon icon-orders" />
              Explosão Multi-Nível
            </Link>
          </Menu.Item> */}

          <Menu.Item key="gerenciamentoPrioridades">
            <Link to="/production/gerenciamentoPrioridades">
              <i className="icon icon-orders" />
              Gerenciamento de Prioridades
            </Link>
          </Menu.Item>

          {/* <Menu.Item key="gerenPrioridades">
            <Link to="/production/gerenPrioridade">
              <i className="icon icon-orders" />
              Gerenciamento de Prioridades
            </Link>
          </Menu.Item> */}
          {/* <Menu.Item key="noteProd">
            <Link to="/production/noteProd">
              <i className="icon icon-orders"/>
              <IntlMessages id="prod.noteprod"/>
            </Link>
          </Menu.Item> */}

          <Menu.Item key="management">
            <Link to="/production/management">
              <i className="icon icon-orders" />
              Gerenciamento de Ordens
            </Link>
          </Menu.Item>

          <Menu.Item key="management">
            <Link to="/production/managementMachine">
              <i className="icon icon-orders" />
              Gerenciamento de Maquinas
            </Link>
          </Menu.Item>

          {/* <Menu.Item key="Ind">
            <Link to="/production/industrialization">
              <i className="icon icon-orders"/>
              Industrialização
            </Link>
          </Menu.Item> */}
        </SubMenu>

        <SubMenu
          key="Vendas"
          className="gx-menu-horizontal"
          title={"Vendas"}
        >

          <Menu.Item key="management">
            <Link to="/Sales/PedidoVenda">
              <i className="icon icon-orders" />
              Pedido De Venda
            </Link>
          </Menu.Item>

          <Menu.Item key="management">
            <Link to="/Sales/ValidationPedidoVenda">
              <i className="icon icon-orders" />
              Validação de Pedido de Venda
            </Link>
          </Menu.Item>

          <Menu.Item key="management">
            <Link to="/Sales/GerarOrdemPedidoVenda">
              <i className="icon icon-orders" />
              Gerar Ordem de Pedido de Venda
            </Link>
          </Menu.Item>

          <Menu.Item key="management">
            <Link to="/Sales/FollowUp">
              <i className="icon icon-orders" />
              Follow Up
            </Link>
          </Menu.Item>

          <Menu.Item key="management">
            <Link to="/Sales/RelPedidoVenda">
              <i className="icon icon-orders" />
              Relatorios Pedido Venda
            </Link>
          </Menu.Item>

        </SubMenu>

        <SubMenu
          className={this.getNavStyleSubMenuClass(navStyle)}
          key="dashboard"
          title={<IntlMessages id="dashboard.main" />}
        >
          {/* <Menu.Item key="dashboard">
            <Link to="/dashboard"><i className="icon icon-widgets"/>
              <IntlMessages id="dashboard.main"/></Link>
          </Menu.Item> */}

          {/* <Menu.Item key="tablet">
            <Link to="/tablet"><i className="icon icon-widgets"/>
              <IntlMessages id="dashboard.tablet"/></Link>
          </Menu.Item> */}

          {/* <Menu.Item key="dashboardV2">
            <Link to="/dashboardV2"><i className="icon icon-widgets"/>
              <IntlMessages id="dashboard.main"/></Link>
          </Menu.Item> */}

          <Menu.Item key="dashboardV3">
            <Link to="/dashboardV3">
              <i className="icon icon-widgets" />
              <IntlMessages id="dashboard.main" />
            </Link>
          </Menu.Item>
        </SubMenu>
      </Menu>
    );
  }
}

HorizontalNav.propTypes = {};
const mapStateToProps = ({ settings }) => {
  const { themeType, navStyle, pathname, locale } = settings;
  return { themeType, navStyle, pathname, locale };
};
export default connect(mapStateToProps)(HorizontalNav);
