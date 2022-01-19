import React, { Component } from 'react';
import { Form, Select } from 'antd';
import api from 'util/Api';

export default class DesenhoMatriz extends Component {
  state = {
    itens: [],
    loading: true,
  };

  componentDidMount() {}

  componentDidUpdate(prevProps, prevState) {
    const { tipo, subgrupomatriz, diametro } = this.props;

    console.log(tipo, subgrupomatriz, diametro);

    if (prevProps.subgrupomatriz !== subgrupomatriz && diametro !== '0') {
      api
        .get(`subgrupomatriz/${subgrupomatriz}`)
        .then((result) => {
          console.log(result);
          if (result.data.hasteObj === null || result.data.camisaObj === null) {
            return;
          }
          const idMatriz =
            tipo === 1 ? result.data.hasteObj.id : result.data.camisaObj.id;
          api
            .get(`matrizcalculocilindro/${idMatriz}`)
            .then((result) => {
              console.log(result);
              const lista_return = result.data.items_matriz.filter((item) => {
                return item.diametro === diametro;
              });

              console.log(lista_return)
              this.setState({ itens: lista_return });
            })
            .catch(function (error) {
              console.log(error);
            })
            .then(() => {
              this.setState({ loading: false });
            });
        })
        .catch(function (error) {
          console.log(error);
        })
        .then(() => {
          // this.setState({ loading: false });
        });
    }
  }
  handleChange = (e) => {
    const { name } = this.props;
    const result = this.state.itens.filter(
      (b) => b.desenho + '_' + b.diametro + '_' + b.material === e
    );

    let obj = {
      selectedOption: e,
      material: result[0].material,
      unidade: result[0].unidade,
      lo: result[0].lo_bo,
      name: name,
    };
    this.props.onChange(obj);
  };

  render() {
    const { itens, loading } = this.state;
    const { label, value, name } = this.props;
    return (
      <Form.Item label={label}>
        <Select
          loading={loading}
          p
          laceholder="Selecione um registro"
          value={value}
          name={name}
          onChange={this.handleChange}
        >
          {itens.map((b) => {
            return (
              <Select.Option
                key={b.desenho + '_' + b.diametro + '_' + b.material}
                value={b.desenho + '_' + b.diametro + '_' + b.material}
              >
                {b.desenho}
              </Select.Option>
            );
          })}
        </Select>
      </Form.Item>
    );
  }
}

