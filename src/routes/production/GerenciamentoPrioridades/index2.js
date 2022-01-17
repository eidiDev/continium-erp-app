import React, { Component } from 'react';
import Board, { moveCard, addCard } from '@lourenci/react-kanban';
import '@lourenci/react-kanban/dist/styles.css';
import api from 'util/Api';

// import './styles.css';

const board = {
  columns: [
    {
      id: 'lane1',
      title: 'Planejada 1',
      label: '2/2',
      cards: [
        {
          id: 'Card1',
          title: 'OP-000070 MAQ-010',
          description: `Cod Produto: CRO2872
Cod Ordem: OP-000053
Ped. Venda: 15760
Qtde Prevista: 92
Qtde Produzida: 18
Operador:`,
          // label: '30 mins',
          draggable: true,
          editable: false,
        },
        {
          id: 'Card2',
          title: 'OP-000069 MAQ-03',
          description: `Cod Produto: CRO2872
Cod Ordem: OP-000053
Ped. Venda: 15760
Qtde Prevista: 92
Qtde Produzida: 18
Operador:`,
          // label: '1h:30 mins',
          draggable: true,
          cardColor: '#BD3B36',
          cardStyle: {
            backgroundColor: '#ffe',
          },
        },
      ],
    },
    {
      id: 'lane2',
      title: 'Liberada',
      label: '0/0',
      cards: [
        {
          id: 'Card3',
          title: 'OP-000069 IND',
          description: `Cod Produto: CRO2872
Cod Ordem: OP-000053
Ped. Venda: 15760
Qtde Prevista: 92
Qtde Produzida: 18
Operador:`,
          // label: '0 mins',
          draggable: true,
          editable: false,
        },
      ],
    },
    {
      id: 'lane3',
      title: 'Em execução',
      label: '0/0',
      disableCardDrag: true,
      cards: [
        {
          id: 'Card4',
          title: 'OP-000058 - MAQ-10',
          description: `Cod Produto: CRO1892
Ped. Venda: 15880
Qtde Prevista: 500
Qtde Produzida: 3
Operador: Tiago`,
          // label: '30 mins',
          draggable: true,
          editable: false,
        },
        {
          id: 'Card5',
          title: 'OP-000058 - IND',
          description: `Cod Produto: CRO1892
Ped. Venda: 158232
Qtde Prevista: 1200
Qtde Produzida: 0
Operador: Wagner`,
          // label: '30 mins',
          draggable: true,
          editable: false,
        },
        {
          id: 'Card6',
          title: 'OP-000070 MAQ-03 ',
          description: `Cod Produto: CRO2872
Cod Ordem: OP-000053
Ped. Venda: 15760
Qtde Prevista: 92
Qtde Produzida: 18
Operador:`,
          disableCardDrag: true,
        },
      ],
    },
    {
      id: 'lane4',
      title: 'Pausada',
      label: '0/0',
      cards: [],
    },
    {
      id: 'lane5',
      title: 'Finalizada',
      label: '0/0',
      cards: [
        {
          id: 'Card7',
          title: 'OP-000055 MAQ-10',
          description: `Cod Produto: CRO2872
Cod Ordem: OP-000053
Ped. Venda: 15760
Qtde Prevista: 92
Qtde Produzida: 18
Operador:`,
          // label: '30 mins',
          draggable: true,
          editable: false,
        },
        {
          id: 'Card8',
          title: 'OP-000055 MAQ-03',
          description: `Cod Produto: CRO2872
Cod Ordem: OP-000053
Ped. Venda: 15760
Qtde Prevista: 92
Qtde Produzida: 18
Operador:`,
          // label: '30 mins',
          draggable: true,
          editable: false,
        },
        {
          id: 'Card7',
          title: 'Ordem: OP-000055',
          description: 'IND',
          // label: '30 mins',
          draggable: true,
          editable: false,
        },
      ],
    },
  ],
};

class GerenciamentoPrioridades extends Component {
  constructor() {
    super();
    this.state = {
      controlledBoard: {
        columns: [
          {
            id: 'planejada',
            title: 'Planejada',
            cards: [
              {
                id: 9,
                title: 'Card title 9',
                description: 'Card content',
              },
            ],
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
          },
          {
            id: 'pausada',
            title: 'Pausada',
            cards: [],
          },
          {
            id: 'finalizada',
            title: 'Finalizada',
            cards: [],
          },
        ],
      },
    };
  }

  componentDidMount() {
    // this.handleAddCard(
    //   {
    //     id: 9,
    //     title: 'Card title 9',
    //     description: 'Card content',
    //   },
    //   'planejada'
    // );
    return;
    api
      .get('/prioridade')
      .then((result) => {
        console.log(result.data);
        result.data.lista.forEach((opm) => {
          if (opm.orderProd) {
            const maqOp = opm.maquina !== '' ? opm.maquina : opm.montagem;
            const statusEtapa = opm.statusEtapa
              .normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '');
            const draggable =
              statusEtapa === 'execucao' || statusEtapa === 'pausada'
                ? false
                : true;
            const card = {
              id: opm.id,
              title: opm.orderProd.orderProduction + ` ${maqOp}`,
              description: `Cod Produto: ${opm.orderProd.product} `,
            };

            console.log(statusEtapa);
            this.handleAddCard(card, statusEtapa);
          }
        });

        // this.setState({
        //   listofProds: dataProd,
        // });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  handleAddCard = (card, column) => {
    // const { controlledBoard } = this.state;
    // const column2 = { toColumnId: 'planejada' };
    // const updatedBoard = addCard(controlledBoard, column, card);
    // this.setState({ controlledBoard: updatedBoard });
  };

  handleCardMove = (_card, source, destination) => {
    console.log(_card);
    console.log(source);
    console.log(destination);
    if (destination.toColumnId !== 'execucao') {
      const { controlledBoard } = this.state;
      const updatedBoard = moveCard(controlledBoard, source, destination);
      this.setState({ controlledBoard: updatedBoard });
    }
  };

  render() {
    const { controlledBoard } = this.state;
    return (
      <Board disableColumnDrag onCardDragEnd={this.handleCardMove}>
        {controlledBoard}
      </Board>
    );
  }
}

export default GerenciamentoPrioridades;
