import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Button,
  AsyncStorage,
  Alert,
} from "react-native";
// import OrdemProducao from "../components/OrdemProducao";
// import ConfirmaMatricula from "../components/ConfirmaMatricula";
// import { FontAwesome } from "@expo/vector-icons";
import pneumaxApi from "util/Api";
// import axios from 'axios';
// import useMaquina from "../hooks/useMaquina";
// import Spinner from "react-native-loading-spinner-overlay";

// import searchHeader from "../components/searchHeader";
//import filter from "lodash.filter";

const Home = ({ navigation }) => {
  // React.useLayoutEffect(() => {
  // navigation.setOptions({
  //   headerRight: () => (
  //     <TouchableOpacity onPress={() => navigation.navigate("Config")}>
  //       {/* <FontAwesome
  //         name="gear"
  //         size={32}
  //         color="black"
  //         style={{ marginRight: 25 }}
  //       /> */}
  //     </TouchableOpacity>
  //   ),
  //   headerLeft: () => (
  //     <TouchableOpacity onPress={() => onRefresh()}>
  //       {/* <FontAwesome
  //         name="refresh"
  //         size={32}
  //         color="black"
  //         style={{ marginLeft: 25 }}
  //       /> */}
  //     </TouchableOpacity>
  //   ),
  // });
  //   }, [navigation, setCount]);

  const [visible, setVisible] = useState(false);
  const [orderNum, setOrderNum] = useState(false);
  const [matricula, setMatricula] = useState("");
  const [ordersList, setOrdersList] = useState([]);
  const [isRefreshing, setIsRefeshing] = useState(false);
  const [codMaquina, setCodMaquina] = useState([]);
  const [spinner, setSpinner] = useState(false);
  const [maquinaCod, setMaquinaCod] = useState("");
  const [maquinaId, setMaquinaId] = useState("");
  const [orderProdMaqId, setOrderProdMaqId] = useState("");
  const [orderProd, setOrderProd] = useState([]);
  const [query, setQuery] = useState("");

  const getOrdemDetail = (
    item,
    order_num,
    maquina_id,
    maquina_cod,
    orderProdMaqId,
    liberada,
    etapa_anterior
  ) => {
    // if (!liberada) {
    //   Alert.alert(
    //     "Aviso",
    //     "Etapa: " +
    //       etapa_anterior +
    //       " não concluida ainda, impossivel iniciar etapa."
    //   );
    // } else {
    setMatricula("");
    setVisible(!visible);
    setOrderNum(order_num);
    setMaquinaId(maquina_id);
    setMaquinaCod(maquina_cod);
    setOrderProdMaqId(orderProdMaqId);
    setOrderProd(item);
    // }
    //Vai redirecionar para a nova janela
    // navigation.navigate('OrdemDetail', {order_num: order_num});
  };

  const onConfirmDialog = async () => {
    let apontamento = "";
    orderProd.orderProd.apontamentos.forEach((item) => {
      //Se a data fim estiver === "" entao esse apontamento estao em andamento
      if (item.dataFim === "") {
        apontamento = item;
      }
    });
    // console.log('2');
    // console.log(apontamento);
    // return;

    try {
      if (matricula === "") {
        Alert.alert("Validação", "Matricula não pode ser vazia");
        return;
      }
      // setSpinner(true);
      await pneumaxApi
        .get(`/api/machinelabor/maodeobra/${matricula}`)
        .then(function (response) {
          // console.log(response.data);
          if (
            typeof response.data !== "undefined" &&
            response.data.length > 0
          ) {
            if (apontamento) {
              pneumaxApi
                .get(`/machinelabor/${apontamento.colaborador}`)
                .then(function (machineL) {
                  console.log(
                    "machineL.data.passwordappoitment" +
                      machineL.data.passwordappoitment
                  );
                  if (machineL.data.passwordappoitment === matricula) {
                    navigateOrdem(response.data);
                  } else {
                    Alert.alert(
                      "Aviso",
                      "Ordem de produção em andamento para o operador: " +
                        machineL.data.name
                    );
                  }
                });
            } else {
              console.log("else");
              navigateOrdem(response.data);
            }
          } else {
            Alert.alert(
              "Aviso",
              "Nenhuma matricula encontrada para esse código."
            );
          }
        })
        .catch(function (err) {
          console.log(err);
        })
        .then(function () {
          // setSpinner(false);
        });
    } catch (error) {
      Alert.alert(
        "Erro",
        "Entro em contato com o suporte com o seguinte erro: " + error.message
      );
    }
  };

  const navigateOrdem = (machineLabor) => {
    setVisible(false);
    // navigation.navigate("OrdemDetail", {
    //   order_num: orderNum,
    //   matricula: matricula,
    //   machineLabor: machineLabor,
    //   maquina_cod: maquinaCod,
    //   maquina_id: maquinaId,
    //   orderProdMaqId: orderProdMaqId,
    // });
  };

  const onPressButtom = (value) => {
    if (value === "") {
      setMatricula("");
    } else {
      let mat = matricula + value;
      setMatricula(mat);
    }
  };

  // const connectAxious = async () => {
  //   const url = await AsyncStorage.getItem("@url_db");
  //   // console.log('url',JSON.parse(url));

  //   const api = axios.create({
  //     // baseURL: 'https://pneumax-api.herokuapp.com'
  //     // baseURL: 'http://localhost:1337'
  //     baseURL: url,
  //   });
  // };

  useEffect(() => {
    // console.log('Home....');
    // connectAxious();
    // const focus = navigation.addListener("focus", () => {
    //   onRefresh();
    // });
    // getMaquina();
    onRefresh();
    // //Remover após os testes
    // // navigation.navigate('OrdemDetail', {order_num: "99", matricula: "1" });
  }, []);

  const getMaquina = async () => {
    // console.log( 'getMaquina...');
    setSpinner(true);
    setOrdersList([]);
    // let codMaquinaL = await useMaquina();
    // console.log('vai buscar o código da mquina');
    let value = "";
    try {
      value = (await localStorage.getItem("@maquina_cod")) || "";
    } catch (error) {
      Alert.alert(error.message);
    }
    if (value != undefined && value !== "" && value !== null) {
      setCodMaquina(JSON.parse(value));
      // console.log('agora vai buscar as ordens');
      getOrders(value);
    } else {
      console.log("redirecitonar para configurações");
      // navigation.navigate('Config');
      Alert.alert(
        "Aviso",
        "Nenhuma maquina associada a esse tablet, você será redirecionado para a tela de configurações.",
        [
          {
            text: "Ok",
            onPress: () => navigation.navigate("Config"),
          },
        ]
      );
      setSpinner(false);
    }
    // AsyncStorage.getItem('@maquina_cod',(err,item) => {
    //     if(item) {
    //         console.log(JSON.parse(item));
    //         setCodMaquina(JSON.parse(item));
    //         // setCodMaquina(JSON.parse(item));
    //         // console.log('Codigo maquina : '+ JSON.parse(item));
    //         console.log('agora vai buscar as ordens');
    //         getOrders(item);
    //     }
    // });
    // setSpinner(false);
  };

  const getOrders = async (idMaquinas) => {
    // console.log("getOrders...");
    if (idMaquinas === undefined || idMaquinas === "") {
      return;
    }

    // console.log('idMaquinas: '+idMaquinas);
    setSpinner(true);

    try {
      var maqs = "";
      JSON.parse(idMaquinas).map((e) => {
        maqs += e.value + ",";
      });

      let url = "orderProdMaquina/maquina/" + maqs;
      // console.log(url);

      const ordersResult = await pneumaxApi
        .get(url)
        .then((result) => {
          // console.log("result", result);
          let orderArray = [];
          let maquinas_free = [
            "MAQ-10",
            "MTG-CIL",
            "MTG-CIL-ESP",
            "MTG-MEC",
            "MTG-PAINEL",
          ];

          result.data.map((order) => {
            let itemA = {};
            // console.log('Id orderProdMaquina:'+order.id+ " : "+order.maquina +" : prioridade: " + order.prioridadeEtapa);

            if (
              JSON.parse(idMaquinas).find(
                (maquinaI) =>
                  maquinaI.value == order.maquina ||
                  maquinaI.value == order.montagem
              )
            ) {
              if (order.orderProd !== null) {
                itemA = {
                  id: order.id,
                  order_num: order.orderProd.id,
                  sales_order_num: order.orderProd.pedidoCliente,
                  description_1: order.orderProd.orderProduction,
                  product: order.orderProd.product,
                  // "product": order.orderProd.product.cod +" | "+order.orderProd.product.description1,
                  req_qty: order.orderProd.qtde,
                  order_date: order.orderProd.dataProd,
                  start_date: order.orderProd.dataProd,
                  delivery_date: order.orderProd.dataEntrega,
                  liberada: order.liberada,
                  etapa_anterior: order.etapa_anterior,
                  // inactive:
                  //   order.prioridadeEtapa <= 3 ||
                  //   maquinas_free.find(
                  //     (i) => i == order.maquina || i === order.montagem
                  //   )
                  //     ? false
                  //     : true,
                  prioridade: order.prioridadeEtapa,
                  img_64: "",
                  maquina_cod:
                    order.maquina === "" ? order.montagem : order.maquina,
                  order_prod: order,
                };
                orderArray.push(itemA);
              }
            }
          });
          setOrdersList(orderArray);
          setSpinner(false);
        })
        .catch(function (error) {
          // Alert.alert("Erro ao buscar ordems 1","O seguinte erro aconteceu: ");
          // console.log("Error",error.response);
          // console.log("Error",error);
          setSpinner(false);
        });
    } catch (err) {
      Alert.alert("Erro ao buscar ordems 2", "O seguinte erro aconteceu: ");
      alert("Erro", err);
      setSpinner(false);
    }
    // setSpinner(false);
  };
  const onRefresh = () => {
    // console.log('onRefresh');
    getMaquina();
    // setIsRefeshing(true);
    // getOrders();
  };

  /**Funcao para filtro */
  function renderHeader2(listToFilter) {
    return (
      <View
        style={{
          backgroundColor: "#fff",
          paddingHorizontal: 10,
          paddingVertical: 15,
          // marginVertical: 10,
          marginHorizontal: 15,
          borderRadius: 10,
        }}
      >
        <TextInput
          autoCapitalize="none"
          autoCorrect={false}
          clearButtonMode="always"
          value={query}
          onChangeText={(queryText) => handleSearch(queryText, listToFilter)}
          placeholder="Filtrar por OP"
          style={{ backgroundColor: "#fff", paddingHorizontal: 20 }}
        />
      </View>
    );
  }
  const handleSearch = (text, listToFilter) => {
    const formattedQuery = text.toUpperCase();
    for (var item of listToFilter) {
      if (
        item.description_1.includes(formattedQuery) ||
        item.product.cod.includes(formattedQuery)
      ) {
        item.hidden = false;
      } else {
        item.hidden = true;
      }
    }
    setQuery(text);
  };
  /** Fim da funcao de filtro */

  return (
    <View>
      <View style={styles.container}>
        <Text style={styles.maquina_titulo}>Ordens de produção</Text>
      </View>
      {renderHeader2(ordersList)}
      <View style={styles.container_item}>
        {/* <Spinner
          visible={spinner}
          textContent={"Carregando..."}
          // textStyle={styles.spinnerTextStyle}
        /> */}

        {codMaquina.map((maquina) => (
          <View style={styles.column_item} key={maquina.key}>
            <View style={styles.container_maquina}>
              <Text style={styles.maquina_titulo} key={maquina.id}>
                {maquina.value}
              </Text>
            </View>
            <FlatList
              // ListHeaderComponent={}
              refreshing={isRefreshing}
              onRefresh={() => onRefresh()}
              data={ordersList}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ paddingBottom: 500 }}
              showsVerticalScrollIndicator={true}
              renderItem={({ item, index }) => {
                // console.log("Maquina_cod: ",maquina.key);
                if (
                  maquina.value === item.maquina_cod &&
                  item.hidden !== true
                ) {
                  return (
                    <TouchableOpacity
                      onPress={() =>
                        getOrdemDetail(
                          item.order_prod,
                          item.order_num,
                          maquina.key,
                          maquina.value,
                          item.id,
                          item.liberada,
                          item.etapa_anterior
                        )
                      }
                      disabled={item.inactive}
                    >
                      {/* <OrdemProducao ordem={item} /> */}
                    </TouchableOpacity>
                  );
                }
              }}
            />
          </View>
        ))}
      </View>
      {/* <ConfirmaMatricula
        visible={visible}
        onTouchOutside={() => {
          setVisible(false);
        }}
        matricula={matricula}
        onPressButtom={onPressButtom}
        onConfirmDialog={onConfirmDialog}
      /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
    width: Dimensions.get("window").width - 30,
    marginLeft: 15,
    borderRadius: 10,
    backgroundColor: "#FFF",
    elevation: 4,
    alignItems: "center",
  },
  border: {
    shadowColor: "#173143",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
  },

  container_maquina: {
    marginVertical: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: "#FFF",
    elevation: 4,
    alignItems: "center",
    backgroundColor: "#6fa8dc",
  },
  maquina_titulo: {
    fontSize: 24,
  },
  container_item: {
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: Dimensions.get("window").width - 15,
  },
  column_item: {
    flex: 1,
    marginLeft: 15,
  },
});

export default Home;
