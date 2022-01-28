// import React from 'react';
// import {Tag, Popconfirm} from 'antd';
// import moment from 'moment';

const apontamentoColumns = [
    {
        title: 'Id',
        dataIndex:'id',
        key: 'id'
    },
    {
        title: 'Etapa',
        dataIndex:'etapaObj.cod',
        key: 'etapa'
    },
    {
        title: 'Mão de obra',
        dataIndex:'tipo',
        key: 'tipo',
        render: (text) => {
            switch (text) {
                case 'programar':
                    return 'Programando'
                case 'pausar':
                    return 'Pausado'
                case 'operar':
                    return 'Operando'
                default:
                    return text;
            }
        }

        
    },
    {
        title: 'Colaborador',
        dataIndex:'colaboradorObj.cod',
        key: 'colaborador'
    },
    {
        title: 'Data inicio',
        dataIndex:'dataInicio',
        key: 'dataInicio',
        // render: (text) => (moment(text).format('DD-MM-YYYY HH:mm'))
        // render: (text) => (<span>{moment(text).format('DD-MM-YYYY HH:mm') === 'Invalid date' ? text : moment(text).format('DD-MM-YYYY HH:mm')}</span>)
    },
    {
        title: 'Data fim',
        dataIndex:'dataFim',
        key: 'dataFim',
        // render: (text) => (<span>{moment(text).format('DD-MM-YYYY') === 'Invalid date' ? text : moment(text).format('DD-MM-YYYY HH:mm')}</span>)
    },
    {
        title: 'Tempo realizado',
        dataIndex:'tempoRealizado',
        key: 'tempoRealizado',
        // render: (text) => (<Tag color="blue">{text}</Tag>)
    },
    {
        title: 'Qtde Apontada',
        dataIndex:'qtdeApontada',
        key: 'qtdeApontada',
        align: 'center'
    }
];

export { apontamentoColumns };