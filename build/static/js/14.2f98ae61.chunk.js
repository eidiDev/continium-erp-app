(window.webpackJsonp=window.webpackJsonp||[]).push([[14],{1416:function(e,t,a){"use strict";a.r(t);var n=a(23),r=a.n(n),o=a(37),s=a(11),i=a(12),l=a(14),c=a(13),d=a(15),u=a(3),m=a(0),g=a.n(m),h=a(1297),p=a(601),f=a(188),E=a(107),O=a(278),y=a(60),b=a(1302),C=a(1301),w=a(212),v=function(e){function t(){return Object(s.a)(this,t),Object(l.a)(this,Object(c.a)(t).apply(this,arguments))}return Object(d.a)(t,e),Object(i.a)(t,[{key:"render",value:function(){return g.a.createElement(f.a,null,g.a.createElement(E.a,{span:24},g.a.createElement(O.a,{type:"inner",title:"Validar Pedido de  Venda"},g.a.createElement(b.a,{layout:"horizontal",size:"small"},g.a.createElement(f.a,null,g.a.createElement(E.a,{lg:3,md:6,sm:12,xs:24},g.a.createElement("div",{className:"gx-form-row0"},g.a.createElement(b.a.Item,{label:"Data Entrega inicial"},g.a.createElement(C.a,{format:"DD-MM-YYYY",onChange:this.props.handleChange("dataInicio")})))),g.a.createElement(E.a,{lg:3,md:6,sm:12,xs:24},g.a.createElement("div",{className:"gx-form-row0"},g.a.createElement(b.a.Item,{label:"Data Entrega Final"},g.a.createElement(C.a,{format:"DD-MM-YYYY",onChange:this.props.handleChange("dataFim")})))),g.a.createElement(E.a,{lg:3,md:6,sm:12,xs:24},g.a.createElement("div",{className:"gx-form-row0"},g.a.createElement(b.a.Item,{label:"Data Prevista inicial"},g.a.createElement(C.a,{format:"DD-MM-YYYY",onChange:this.props.handleChange2("dataInicioM")})))),g.a.createElement(E.a,{lg:3,md:6,sm:12,xs:24},g.a.createElement("div",{className:"gx-form-row0"},g.a.createElement(b.a.Item,{label:"Data Prevista Final"},g.a.createElement(C.a,{format:"DD-MM-YYYY",onChange:this.props.handleChange2("dataFimM")})))),g.a.createElement(E.a,{lg:3,md:6,sm:12,xs:24},g.a.createElement("div",{className:"gx-form-row0"},g.a.createElement(b.a.Item,{label:"Pedido Cliente"},g.a.createElement(w.a,{type:"number",value:this.props.filtros.id_PedidoVenda,name:"id_PedidoVenda",onChange:this.props.handleChange("id_PedidoVenda"),onKeyDown:this.props.onKeyDown})))),g.a.createElement(E.a,{lg:3,md:6,sm:12,xs:24},g.a.createElement("div",{className:"gx-form-row0"},g.a.createElement(b.a.Item,{label:"Pedido Fox"},g.a.createElement(w.a,{type:"text",value:this.props.filtros.pedido_fox,name:"pedido_fox",onChange:this.props.handleChange("pedido_fox"),onKeyDown:this.props.onKeyDown})))))))))}}]),t}(m.Component),x=a(619),D=a(387),k=a(17),S=a.n(k),j=(a(35),function(e){function t(e){var a;return Object(s.a)(this,t),(a=Object(l.a)(this,Object(c.a)(t).call(this))).changeInputPr=function(e,t){t.descricao_fornecedor=e.target.value},a.columns=[{title:"Pedido de Venda",dataIndex:"num_salesorder",width:100,key:"num_salesorder",align:"center"},{title:"Linha do Pedido",dataIndex:"id",align:"center"},{title:"Pedido Cliente",dataIndex:"lin_pedido_cliente",align:"center"},{title:"Pedido Fox",dataIndex:"lin_pedido_fox",align:"center"},{title:"Data Entrega",dataIndex:"data_entrega",align:"center",render:function(e){return S()(e).format("DD-MM-YYYY")}},{title:"Data Prevista",dataIndex:"data_prevista",align:"center",render:function(e){return S()(e).format("DD-MM-YYYY")}},{title:"CFOP",align:"center",dataIndex:"cfop",width:75},{title:"C\xf3digo Produto Cliente",dataIndex:"produto_cliente",align:"center"},{title:"Descri\xe7\xe3o Fornecedor",dataIndex:"descricao_fornecedor",align:"center",render:function(e,t){return g.a.createElement("span",null,g.a.createElement(w.a,{defaultValue:t.descricao_fornecedor,type:"text",min:1,name:"descricao_fornecedor",onChange:function(e){return a.changeInputPr(e,t)}}))}},{title:"C\xf3digo Produto Iconnect",align:"center",dataIndex:"productObj.cod"},{title:"Status Produto Iconnect",dataIndex:"product_id",align:"center",render:function(e){return null===e?g.a.createElement(x.a,{color:"gold"},"Pendente"):g.a.createElement(x.a,{color:"green"},"Ok")}}],a}return Object(d.a)(t,e),Object(i.a)(t,[{key:"render",value:function(){return g.a.createElement(p.a,{spinning:!1},g.a.createElement(O.a,{type:"inner",title:"Ordens Filtras a gerar"},g.a.createElement(D.a,{scroll:{x:2500,y:2e3},rowSelection:{selectedRowKeys:this.props.selectedRowKeys,onChange:this.props.onSelectChange,fixed:!0},columns:this.columns,onChange:this.props.onChangePage,sorter:!0,bordered:!0,size:"small",dataSource:this.props.resultData,style:{margin:"-15px -24px"},loading:this.props.loading,rowKey:function(e){return e.id}})))}}]),t}(m.Component)),P=a(7),I=a(59),Y=a(1304),L=a(1306),M=function(e){function t(){return Object(s.a)(this,t),Object(l.a)(this,Object(c.a)(t).apply(this,arguments))}return Object(d.a)(t,e),Object(i.a)(t,[{key:"render",value:function(){return g.a.createElement(Y.a,{title:"Logs",visible:this.props.showLog,onOk:this.props.onOkLog,onCancel:this.props.onOkLog,bodyStyle:{padding:0},footer:[g.a.createElement(y.a,{key:"submit",type:"primary",onClick:this.props.onOkLog},"Ok")]},g.a.createElement(O.a,{title:"",className:"gx-card"},g.a.createElement(L.a,null,this.props.logs.map(function(e){var t=e.toString();return g.a.createElement(L.a.Item,{color:t.includes("n\xe3o")?"red":"green"},e)}))))}}]),t}(g.a.Component);P.a.defaults.timeout=6e7;var _=function(e){function t(){var e;return Object(s.a)(this,t),(e=Object(l.a)(this,Object(c.a)(t).call(this))).handleChange=function(t){return function(a){var n=e.state.filtros;"object"===typeof a?"dataInicio"===t||"dataFim"===t?a&&(n[t]=a.format("YYYY-MM-DD")):n[t]=a.target.value:n[t]=a,e.setState({filtros:n})}},e.handleChange2=function(t){return function(a){var n=e.state.filtros;"object"===typeof a?"dataInicioM"===t||"dataFimM"===t?a&&(n[t]=a.format("YYYY-MM-DD")):n[t]=a.target.value:n[t]=a,e.setState({filtros:n})}},e.onChangePage=function(e,t){console.log(e,t)},e.onHandleClickSearch=function(){e.setState({resultsLoading:!0});var t=Object(u.a)(Object(u.a)(e));e.setState({resultData:[],selectedRowKeys:[]}),I.a.get("filterLinPdVenda/",{params:e.state.filtros}).then(function(e){console.log(e),t.setState({resultData:e.data}),h.a.success("Registros carregados.")}).catch(function(e){h.a.error("Erro ao buscar registro, tente novamente mais tarde!:"+e.message),console.log("error",e)}).then(function(){t.setState({resultsLoading:!1})})},e.onSelectChange=function(t,a){e.setState({selectedRowKeys:t.slice(0,5),selectedRows:a.slice(0,5)}),e.checkIfAllstatusIsOk(a)},e.onKeyDown=function(t){"Enter"===t.key&&e.onHandleClickSearch()},e.onCreateBasicData=Object(o.a)(r.a.mark(function t(){var a,n;return r.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return e.setState({resultsLoading:!0}),a=e.state.selectedRows,n=Object(u.a)(Object(u.a)(e)),"POST",t.next=6,Object(I.a)({method:"POST",url:"validateProductLinPdVenda",data:{rows:a}}).then(function(e){console.log(e),n.setState({resultData:[],showLog:!0,logs:e.data,resultsLoading:!1}),h.a.success("Registros Criados Ou Alterados.")}).catch(function(e){h.a.error("Erro interno, tente novamente mais tarde!:"+e.message),console.log("error",e)}).then(function(e){n.setState({resultsLoading:!1})});case 6:case"end":return t.stop()}},t)})),e.onCreateOrders=Object(o.a)(r.a.mark(function t(){var a,n;return r.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return console.log("onCreateOrders...."),e.setState({resultsLoading:!0}),a=e.state.selectedRows,n=Object(u.a)(Object(u.a)(e)),"POST",t.prev=5,t.next=8,Object(I.a)({method:"POST",url:"oncreateOrders",data:{rows:a}}).then(function(e){n.setState({resultData:[],showLog:!0,logs:void 0!==e.data?e.data:[],array:[]}),e.data.find(function(e){return e.includes("n\xe3o tem")})?h.a.error("Kits filhos nao tem Etapas !"):h.a.success("Ordens criadas !")}).catch(function(e){h.a.error("Erro interno, tente novamente mais tarde!:"+e.message),console.log("error",e)}).then(function(e){n.setState({resultsLoading:!1})});case 8:t.next=14;break;case 10:t.prev=10,t.t0=t.catch(5),h.a.error("Erro interno, tente novamente mais tarde!:"+t.t0.message),console.log("error",t.t0);case 14:case"end":return t.stop()}},t,null,[[5,10]])})),e.onOkLog=function(){e.setState({showLog:!1})},e.checkIfAllstatusIsOk=function(t){var a=t;if(0===a.length)e.setState({array:[]});else{var n=[],r=!0,o=!1,s=void 0;try{for(var i,l=a[Symbol.iterator]();!(r=(i=l.next()).done);r=!0){var c=i.value;1===c.isProdutoOk&&1===c.isKitOk&&1===c.isClienteOk&&1===c.isEtapaOk&&0===c.isOrdemOk&&1===c.isDadosBaseOk&&(n.push(c),e.setState({array:n}))}}catch(d){o=!0,s=d}finally{try{r||null==l.return||l.return()}finally{if(o)throw s}}n.length===a.length||e.setState({array:[]})}},e.state={loading:!1,loadingTip:"",canGenerate:!1,resultsLoading:!1,showLog:!1,resultData:[],array:[],array2:[],selectedRowKeys:[],selectedRows:[],filtros:{pedido:"",pedidoCliente:"",cfop:"",produto:"",empresa:"",dataInicio:"",dataFim:"",dataInicioM:"",dataFimM:""},logs:[]},e}return Object(d.a)(t,e),Object(i.a)(t,[{key:"render",value:function(){return g.a.createElement(p.a,{spinning:this.state.loading,tip:this.state.loadingTip},g.a.createElement(M,{showLog:this.state.showLog,onOkLog:this.onOkLog,logs:this.state.logs}),g.a.createElement(f.a,null,g.a.createElement(E.a,{lg:20,md:20,sm:24,xs:24},g.a.createElement(v,{handleChange:this.handleChange,handleChange2:this.handleChange2,filtros:this.state.filtros,onKeyDown:this.onKeyDown}),g.a.createElement(j,{resultData:this.state.resultData,loading:this.state.resultsLoading,selectedRowKeys:this.state.selectedRowKeys,onSelectChange:this.onSelectChange,onChangePage:this.onChangePage})),g.a.createElement(E.a,{lg:4,md:4,sm:24,xs:24},g.a.createElement(O.a,{type:"inner",title:"A\xe7oes"},g.a.createElement(y.a,{block:!0,type:"primary",onClick:this.onHandleClickSearch},"Pesquisar"),g.a.createElement(y.a,{block:!0,type:"primary",className:"gx-btn-secondary",disabled:!this.state.selectedRows.length>0,onClick:this.onCreateBasicData},"Validar")))))}}]),t}(m.Component);t.default=_}}]);
//# sourceMappingURL=14.2f98ae61.chunk.js.map