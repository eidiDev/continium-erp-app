(window.webpackJsonp=window.webpackJsonp||[]).push([[13],{1417:function(e,t,a){"use strict";a.r(t);var n=a(23),r=a.n(n),o=a(37),s=a(11),i=a(12),l=a(14),c=a(13),d=a(15),u=a(3),m=a(0),h=a.n(m),g=a(1297),p=a(601),f=a(188),O=a(107),E=a(278),w=a(60),y=a(1302),b=a(1301),C=a(212),x=function(e){function t(){return Object(s.a)(this,t),Object(l.a)(this,Object(c.a)(t).apply(this,arguments))}return Object(d.a)(t,e),Object(i.a)(t,[{key:"render",value:function(){return h.a.createElement(f.a,null,h.a.createElement(O.a,{span:24},h.a.createElement(E.a,{type:"inner",title:"Gerar Ordem de Produ\xe7\xe3o de Pedido de  Venda"},h.a.createElement(y.a,{layout:"horizontal",size:"small"},h.a.createElement(f.a,null,h.a.createElement(O.a,{lg:4,md:6,sm:12,xs:24},h.a.createElement("div",{className:"gx-form-row0"},h.a.createElement(y.a.Item,{label:"Data inicio"},h.a.createElement(b.a,{format:"DD-MM-YYYY",onChange:this.props.handleChange("dataInicio")})))),h.a.createElement(O.a,{lg:4,md:6,sm:12,xs:24},h.a.createElement("div",{className:"gx-form-row0"},h.a.createElement(y.a.Item,{label:"Data Fim"},h.a.createElement(b.a,{format:"DD-MM-YYYY",onChange:this.props.handleChange("dataFim")})))),h.a.createElement(O.a,{lg:4,md:6,sm:12,xs:24},h.a.createElement("div",{className:"gx-form-row0"},h.a.createElement(y.a.Item,{label:"Pedido Cliente"},h.a.createElement(C.a,{type:"number",value:this.props.filtros.id_PedidoVenda,name:"id_PedidoVenda",onChange:this.props.handleChange("id_PedidoVenda"),onKeyDown:this.props.onKeyDown})))),h.a.createElement(O.a,{lg:4,md:6,sm:12,xs:24},h.a.createElement("div",{className:"gx-form-row0"},h.a.createElement(y.a.Item,{label:"Pedido Fox"},h.a.createElement(C.a,{type:"text",value:this.props.filtros.pedido_fox,name:"pedido_fox",onChange:this.props.handleChange("pedido_fox"),onKeyDown:this.props.onKeyDown})))),h.a.createElement(O.a,{lg:4,md:6,sm:12,xs:24},h.a.createElement("div",{className:"gx-form-row0"},h.a.createElement(y.a.Item,{label:"Status"},h.a.createElement(C.a,{type:"text",value:this.props.filtros.status,name:"status",onChange:this.props.handleChange("status"),onKeyDown:this.props.onKeyDown})))))))))}}]),t}(m.Component),k=a(619),v=a(387),D=a(17),S=a.n(D),P=(a(35),[{title:"Pedido de Venda",dataIndex:"id",width:100,key:"id",align:"center"},{title:"Data do Pedido",dataIndex:"orddat",align:"center",render:function(e){return S()(e).format("DD-MM-YYYY")}},{title:"Status",dataIndex:"status",align:"center"},{title:"Cliente",dataIndex:"isClienteOk",align:"center",render:function(e,t){return 0===e?h.a.createElement(k.a,{color:"gold"},"Pendente"):h.a.createElement(k.a,{color:"green"},"Ok")}}]),j=function(e){function t(e){return Object(s.a)(this,t),Object(l.a)(this,Object(c.a)(t).call(this))}return Object(d.a)(t,e),Object(i.a)(t,[{key:"render",value:function(){var e=[{title:"Linha do Pedido",dataIndex:"id",width:100},{title:"Pedido Cliente",dataIndex:"lin_pedido_cliente",width:100},{title:"Pedido Fox",dataIndex:"lin_pedido_fox",width:100},{title:"Data Entrega",dataIndex:"data_entrega",width:100,render:function(e){return S()(e).format("DD-MM-YYYY")}},{title:"Data Prevista",dataIndex:"data_prevista",width:100,render:function(e){return S()(e).format("DD-MM-YYYY")}},{title:"CFOP",dataIndex:"cfop",width:75},{title:"Cod Produto",dataIndex:"productObj.cod",width:75},{title:"Status Produto",dataIndex:"isProdutoOk",width:150,align:"center",render:function(e,t){return 0===e?h.a.createElement(k.a,{color:"gold"},"Pendente"):h.a.createElement(k.a,{color:"green"},"Ok")}},{title:"Arvore Kit",dataIndex:"isKitOk",width:150,align:"center",render:function(e){return 0===e?h.a.createElement(k.a,{color:"gold"},"Pendente"):h.a.createElement(k.a,{color:"green"},"Ok")}},{title:"Etapa",dataIndex:"isEtapaOk",align:"center",width:150,render:function(e,t){return 0===e?h.a.createElement(k.a,{color:"red"},"Sem Etapa"):h.a.createElement(k.a,{color:"green"},"Ok")}},{title:"Dados basicos",dataIndex:"isDadosBaseOk",align:"center",width:150,render:function(e,t){return 0===e?h.a.createElement(k.a,{color:"red"},"Pend. dados b\xe1sicos"):h.a.createElement(k.a,{color:"green"},"Ok")}},{title:"OP Gerada",dataIndex:"isOrdemOk",width:150,align:"center",render:function(e,t){return 0===e?h.a.createElement(k.a,{color:"red"},"Sem Ordem"):h.a.createElement(k.a,{color:"green"},"Ok")}}];return h.a.createElement(p.a,{spinning:!1},h.a.createElement(E.a,{type:"inner",title:"Ordens Filtras a gerar"},h.a.createElement(v.a,{expandedRowRender:function(t){return h.a.createElement(v.a,{columns:e,pagination:{hideOnSinglePage:!0},size:"small",dataSource:t.linhas})},scroll:{x:2500,y:2e3},rowSelection:{selectedRowKeys:this.props.selectedRowKeys,onChange:this.props.onSelectChange},columns:P,onChange:this.props.onChangePage,sorter:!0,bordered:!0,size:"small",dataSource:this.props.resultData,style:{margin:"-15px -24px"},loading:this.props.loading,rowKey:function(e){return e.id}})))}}]),t}(m.Component),I=a(7),L=a(59),Y=a(1304),K=a(1306),R=function(e){function t(){return Object(s.a)(this,t),Object(l.a)(this,Object(c.a)(t).apply(this,arguments))}return Object(d.a)(t,e),Object(i.a)(t,[{key:"render",value:function(){return h.a.createElement(Y.a,{title:"Logs",visible:this.props.showLog,onOk:this.props.onOkLog,onCancel:this.props.onOkLog,bodyStyle:{padding:0},footer:[h.a.createElement(w.a,{key:"submit",type:"primary",onClick:this.props.onOkLog},"Ok")]},h.a.createElement(E.a,{title:"",className:"gx-card"},h.a.createElement(K.a,null,this.props.logs.map(function(e){var t=e.toString();return h.a.createElement(K.a.Item,{color:t.includes("n\xe3o tem")?"red":"green"},e)}))))}}]),t}(h.a.Component);I.a.defaults.timeout=6e7;var M=function(e){function t(){var e;return Object(s.a)(this,t),(e=Object(l.a)(this,Object(c.a)(t).call(this))).handleChange=function(t){return function(a){var n=e.state.filtros;"object"===typeof a?"dataInicio"===t||"dataFim"===t?a&&(n[t]=a.format("YYYY-MM-DD")):n[t]=a.target.value:n[t]=a,e.setState({filtros:n})}},e.onChangePage=function(e,t){console.log(e,t)},e.onHandleClickSearch=function(){e.setState({resultsLoading:!0});var t=Object(u.a)(Object(u.a)(e));e.setState({resultData:[],selectedRowKeys:[]}),L.a.get("filterPdfVenda/",{params:e.state.filtros}).then(function(e){t.setState({resultData:e.data}),g.a.success("Registros carregados.")}).catch(function(e){g.a.error("Erro ao buscar registro, tente novamente mais tarde!:"+e.message),console.log("error",e)}).then(function(){t.setState({resultsLoading:!1})})},e.onSelectChange=function(t,a){e.setState({selectedRowKeys:t.slice(0,5),selectedRows:a.slice(0,5)}),e.checkIfAllstatusIsOk(a)},e.onKeyDown=function(t){"Enter"===t.key&&e.onHandleClickSearch()},e.onCreateBasicData=Object(o.a)(r.a.mark(function t(){var a,n;return r.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return e.setState({resultsLoading:!0}),a=e.state.selectedRows,n=Object(u.a)(Object(u.a)(e)),"POST",console.log(a),t.next=7,Object(L.a)({method:"POST",url:"foxControllerPd/onCreateBasicData",data:{rows:a}}).then(function(e){n.setState({resultData:[],showLog:!0,logs:e.data,resultsLoading:!1}),g.a.success("Registros Criados Ou Alterados.")}).catch(function(e){g.a.error("Erro interno, tente novamente mais tarde!:"+e.message),console.log("error",e)}).then(function(e){n.setState({resultsLoading:!1})});case 7:case"end":return t.stop()}},t)})),e.onCreateOrders=Object(o.a)(r.a.mark(function t(){var a,n;return r.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return console.log("onCreateOrders...."),e.setState({resultsLoading:!0}),a=e.state.selectedRows,n=Object(u.a)(Object(u.a)(e)),"POST",t.prev=5,t.next=8,Object(L.a)({method:"POST",url:"foxControllerPd/onCreateOrders",data:{rows:a}}).then(function(e){n.setState({resultData:[],showLog:!0,logs:void 0!==e.data?e.data:[],array:[]}),e.data.find(function(e){return e.includes("n\xe3o tem")})?g.a.error("Kits filhos nao tem Etapas !"):g.a.success("Ordens criadas !")}).catch(function(e){g.a.error("Erro interno, tente novamente mais tarde!:"+e.message),console.log("error",e)}).then(function(e){n.setState({resultsLoading:!1})});case 8:t.next=14;break;case 10:t.prev=10,t.t0=t.catch(5),g.a.error("Erro interno, tente novamente mais tarde!:"+t.t0.message),console.log("error",t.t0);case 14:case"end":return t.stop()}},t,null,[[5,10]])})),e.onOkLog=function(){e.setState({showLog:!1})},e.checkIfAllstatusIsOk=function(t){var a=t;if(0===a.length)e.setState({array:[]});else{var n=[],r=!0,o=!1,s=void 0;try{for(var i,l=a[Symbol.iterator]();!(r=(i=l.next()).done);r=!0){var c=i.value;void 0===c.linhas.find(function(e){return 0===e.isDadosBaseOk})&&(n.push(c),e.setState({array:n}))}}catch(d){o=!0,s=d}finally{try{r||null==l.return||l.return()}finally{if(o)throw s}}n.length===a.length||e.setState({array:[]})}},e.state={loading:!1,loadingTip:"",canGenerate:!1,resultsLoading:!1,showLog:!1,resultData:[],array:[],array2:[],selectedRowKeys:[],selectedRows:[],filtros:{pedido:"",pedidoCliente:"",cfop:"",produto:"",empresa:"",dataInicio:"",dataFim:"",dataInicioM:"",dataFimM:""},logs:[]},e}return Object(d.a)(t,e),Object(i.a)(t,[{key:"render",value:function(){return h.a.createElement(p.a,{spinning:this.state.loading,tip:this.state.loadingTip},h.a.createElement(R,{showLog:this.state.showLog,onOkLog:this.onOkLog,logs:this.state.logs}),h.a.createElement(f.a,null,h.a.createElement(O.a,{lg:20,md:20,sm:24,xs:24},h.a.createElement(x,{handleChange:this.handleChange,filtros:this.state.filtros,onKeyDown:this.onKeyDown}),h.a.createElement(j,{resultData:this.state.resultData,loading:this.state.resultsLoading,selectedRowKeys:this.state.selectedRowKeys,onSelectChange:this.onSelectChange,onChangePage:this.onChangePage})),h.a.createElement(O.a,{lg:4,md:4,sm:24,xs:24},h.a.createElement(E.a,{type:"inner",title:"A\xe7oes"},h.a.createElement(w.a,{block:!0,type:"primary",onClick:this.onHandleClickSearch},"Pesquisar"),h.a.createElement(w.a,{block:!0,type:"primary",className:"gx-btn-secondary",disabled:!this.state.selectedRows.length>0,onClick:this.onCreateBasicData},"Gerar Dados Basicos"),h.a.createElement(w.a,{block:!0,type:"primary",className:"gx-btn-red",disabled:0===this.state.array.length,onClick:this.onCreateOrders},"Gerar OP")))))}}]),t}(m.Component);t.default=M}}]);
//# sourceMappingURL=13.47d70e83.chunk.js.map