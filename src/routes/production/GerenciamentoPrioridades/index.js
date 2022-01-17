import React, { Component } from 'react';
import Board from 'react-trello';
import api from 'util/ApiAdonis';
import randomColor from 'randomcolor';
import { Form, Select, Spin, message, Button, Row, Col } from 'antd';
class GerenciamentoPrioridades extends Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      loadingTip: 'Salvando, aguarde...',
      idMaquina: '',
      colors: [
        {
          id: 'MAQ-01',
          color: 'rgb(211, 242, 228)',
        },
        {
          id: 'MAQ-02',
          color: 'rgb(133, 242, 224)',
        },
        {
          id: 'MAQ-03',
          color: 'rgb(142, 255, 155)',
        },
        {
          id: 'MAQ-04',
          color: 'rgb(211, 242, 128)',
        },
        {
          id: 'MAQ-05',
          color: 'rgb(171, 252, 224)',
        },
        {
          id: 'MAQ-06',
          color: 'rgb(247, 145, 203)',
        },
        {
          id: 'MAQ-07',
          color: 'rgb(143, 118, 252)',
        },
        {
          id: 'MAQ-08',
          color: 'rgb(161, 239, 141)',
        },
        {
          id: 'MAQ-09',
          color: 'rgb(030, 239, 141)',
        },
        {
          id: 'MAQ-11',
          color: 'rgb(161, 239, 141)',
        },
        {
          id: 'MTG-MEC',
          color: 'rgb(170, 139, 141)',
        },
        {
          id: 'MTG-CIL',
          color: 'rgb(210 219 236)',
        },
        {
          id: 'MTG-CIL-ESP',
          color: 'rgb(100, 239, 141)',
        },
        {
          id: 'MTG-PAINEL',
          color: 'rgb(236 160 220)',
        },
        {
          id: 'IND-T',
          color: 'rgb(240, 130, 141)',
        },
        {
          id: 'IND-REV',
          color: 'rgb(170, 100, 141)',
        },
      ],
      listOfMaquinas: [],
      originalData: {},
      data: {
        lanes: [
          {
            id: 'planejada',
            title: 'Planejada',
            cards: [],
          },
          {
            id: 'liberada',
            title: 'Liberada',
            cards: [],
          },
          {
            id: 'execucao',
            title: 'Em execução',
            cards: [],
            cardDraggable: false,
            droppable: false,
          },
          {
            id: 'pausada',
            title: 'Pausada',
            cards: [],
            cardDraggable: false,
            droppable: false,
          },
          {
            id: 'finalizada',
            title: 'Finalizada',
            cards: [],
          },
        ],
      },
      contador: 1
    };
    this.resetData();
  }

  getMaquinas = () => {
    api
      .get(`MachineLabor/`, {})
      .then((result) => {
        let dataMaq = [];
        dataMaq = result.data.data;

        let taxMaquinas = dataMaq.filter((o) => {
          return o.type === 'maquina' || o.type === 'montagem';
        });
        this.setState({
          listOfMaquinas: taxMaquinas,
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  setEventBus = (eventBus) => {
    this.setState({ eventBus });
  };

  addCard = (laneId, card) => {
    this.state.eventBus.publish({
      type: 'ADD_CARD',
      laneId: laneId,
      card: card,
    });
  };
  removeCard = (laneId, cardId) => {
    this.state.eventBus.publish({
      type: 'REMOVE_CARD',
      laneId: laneId,
      cardId: cardId,
    });
  };

  moveCard = (fromLaneId, toLaneId, cardId, index) => {
    this.state.eventBus.publish({
      type: 'MOVE_CARD',
      fromLaneId: fromLaneId,
      toLaneId: toLaneId,
      cardId: cardId,
      index: index,
    });
    console.log('move card');
  };

  getColor = (maqOp) => {
    const { colors } = this.state;
    if (colors) {
      const color = colors.find((color) => color.id === maqOp);
      if (color) {
        // console.log(color);
        return color.color;
      } else {
        const newColor = {
          id: maqOp,
          color: randomColor({ luminosity: 'light' }),
        };
        this.setState({ colors: [...colors, newColor] });
        return newColor.color;
      }
    } else {
      console.log('entrou else');
    }
  };

  componentDidMount() {
    this.getMaquinas();
    this.getPrioridades('');
  }

  getPrioridades = async (idMaquina, offset) => {
    this.resetData();
    if (!idMaquina || idMaquina === '') {
      this.setState({ loading: false });
      return null;
    } else {
      const dataFromServer = await this.getDataFromServer(idMaquina, offset);
      await this.setState({ originalData: dataFromServer });
      this.addCardsOnBorder(dataFromServer);
      this.setState({ loading: false });
    }
  };

  getDataFromServer = async (idMaquina,offset) => {
    let dataToReturn = {};

    const params = {
      offset
    }
    await api
      .get(`/prioridade?idMaquina=${idMaquina}`, {params})
      .then((result) => {
        dataToReturn = result.data;
      })
      .then((response) => {
        // this.setState({ loading: false });
      })
      .catch(function (error) {
        console.log(error);
      });
    return dataToReturn;
  };

  handleDragEnd = (
    cardId,
    sourceLaneId,
    targetLaneId,
    position,
    cardDetails
  ) => {
    // console.log('drag ended');
    // console.log(`cardId: ${cardId}`);
    // console.log(`sourceLaneId: ${sourceLaneId}`);
    // console.log(`targetLaneId: ${targetLaneId}`);
  };

  addCardsOnBorder = (dataFromServer) => {
    dataFromServer.forEach((opm) => {
      if (opm) {
        const maqOp = opm.maquina !== '' ? opm.maquina : opm.montagem;
        const color = this.getColor(maqOp);
        const statusEtapa = opm.statusEtapa
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '');
        const draggable =
          statusEtapa === 'execucao' || statusEtapa === 'pausada'
            ? false
            : true;
        const card = {
          id: opm.id,
          title: opm.orderProduction + ` ${maqOp} `,
          description: `${opm.codEtapas}
          
Cliente: ${opm.cliente}
Ordem Prod: ${opm.orderProduction}
Ordem Principal: ${opm.ordemPrincipal}
Ped. cliente: ${opm.pedidoCliente}
Ped. venda: ${opm.orderFox}
Cod Produto: ${opm.product}
Produto: ${opm.description1}
Qtde Prevista: ${opm.qtde}
Data Entrega: ${opm.dataEntrega}`,
          metadata: { maquina: maqOp },
          draggable: draggable,
          editable: false,
          style: { backgroundColor: color },
        };
        this.addCard(statusEtapa, card);
      }
    });
  };

  handleDragStart = (cardId, laneID) => {};

  handleOnCardClick = (cardId, metadata, laneId) => {};

  /**
   *
   * Função chamada sempre que os dados mudam
   */
  handleDataChange = async (newData) => {
    const { originalData, idMaquina } = this.state;
    if (!idMaquina) {
      return null;
    }

    if (this.state.loading === true) return;

    this.setState({ loading: true });

    //Verifica se os dados foram atualizados no servidor

    const dataFromServer = await this.getDataFromServer(idMaquina);

    var s1 = JSON.stringify(originalData);
    var s2 = JSON.stringify(dataFromServer);
    console.log('dados diferentes od servidor,', s1 !== s2);
    if (s1 !== s2) {
      console.log('entrou no s1 !== s2');
      message.success(
        'Dados foram atualizados por outro usários, board será atualizado!'
      );
      this.setState({ loading: true });
      setTimeout(() => {
        this.getPrioridades(idMaquina);
      }, 1500);

      return null;
    }
    //Se nao tiver mudado, ele segue
    console.log('vai continuar');

    //Prepara os dados para enviar
    let listUpdate = [];
    let index = 0;
    newData.lanes.forEach((lane) => {
      index = 0;
      lane.cards.forEach((card) => {
        index += 1;
        const opmUpdate = {
          id: card.id,
          statusEtapa: card.laneId,
          maquina: card.metadata.maquina,
          index,
        };
        listUpdate.push(opmUpdate);
      });
    });

    //Agora via enviar e atualizar no banco
    // console.log(listUpdate);
    await api
      .patch('/prioridade', { listUpdate, idMaquina })
      .then((result) => {
        // console.log(result.data);
        // const dataFromServer = this.getDataFromServer(idMaquina);
        this.setState({ originalData: result.data });
      })
      .then((result) => {
        this.setState({ loading: false });
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  handleOnCardMove = (fromLaneId, toLaneId, cardId, index) => {
    // console.log(`cardId: ${cardId}`);
    // console.log(`fromLaneId: ${fromLaneId}`);
    // console.log(`toLaneId: ${toLaneId}`);
    // console.log(`position: ${index}`);
    // if (toLaneId === 'pausada') {
    //   this.moveCard(toLaneId, fromLaneId, cardId, index);
    // }
    // console.log(`cardDetails:`, cardDetails);
  };

  resetData = () => {
    this.setState({
      loading: true,
      data: {
        lanes: [
          {
            id: 'planejada',
            title: 'Planejada',
            cards: [],
          },
          {
            id: 'liberada',
            title: 'Liberada',
            cards: [],
          },
          {
            id: 'execucao',
            title: 'Em execução',
            cards: [],
            cardDraggable: false,
            droppable: false,
          },
          {
            id: 'pausada',
            title: 'Pausada',
            cards: [],
            cardDraggable: false,
            droppable: false,
          },
          {
            id: 'finalizada',
            title: 'Finalizada',
            cards: [],
          },
        ],
      },
    });
  };

  handleMaquina = (selected) => {
    this.resetData();
    this.setState({ idMaquina: selected });
    this.getPrioridades(selected, 10);
  };


  
  handleClearMaquina = () => {
    this.resetData();
    this.getPrioridades('',0);
  };

  laneScroll = (requestedPage, laneId) => {
    let aux
    const idmaquina = this.state.idMaquina;
    let contador = this.state.contador;
    if(contador === 1){
      aux = contador * 10
      this.setState({
        contador: contador + 1
      }) 
    }else{
      this.setState({
        contador: contador + 1
      })
      aux = contador * 10
    }
     
      return this.getPrioridades(idmaquina, requestedPage * aux)
    
  }

  render() {
    const { data, listOfMaquinas } = this.state;
    return (
      <div>
        <Spin spinning={this.state.loading} tip={this.state.loadingTip}>
          <Row>
            <Col span={10}>
              <Form.Item style={{ marginLeft: 10 }}>
                <Select
                  style={{ width: 400 }}
                  showSearch
                  allowClear
                  onClear={this.handleClearMaquina}
                  placeholder="Filtrar por maquina"
                  onChange={this.handleMaquina}
                  filterOption={(inputValue, option) =>
                    option.props.children[0]
                      .concat(
                        option.props.children[1],
                        option.props.children[2]
                      )
                      .toUpperCase()
                      .indexOf(inputValue.toUpperCase()) !== -1
                  }
                >
                  {listOfMaquinas.map((e) => {
                    return (
                      <Select.Option value={e.cod}>
                        {e.cod}-{e.name}
                      </Select.Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col span={4}>
              <Button
                block
                // disabled={this.state.tableOfKitToMade.length === 0 ? true : false}
                type="primary"
                onClick={() => this.getPrioridades(this.state.idMaquina)}
              >
                Atualizar board
              </Button>
            </Col>
          </Row>
          <Board
            
            data={data}
            hideCardDeleteIcon
            handleDragEnd={this.handleDragEnd}
            handleDragStart={this.handleDragStart}
            style={{ backgroundColor: '#9799AC' }}
            eventBusHandle={this.setEventBus}
            onDataChange={this.handleDataChange}
            onCardMoveAcrossLanes={this.handleOnCardMove}
            laneDraggable={false}
            onCardClick={this.handleOnCardClick}
            onLaneScroll={this.laneScroll}
          />
        </Spin>
      </div>
    );
  }
}
export default GerenciamentoPrioridades;

