import React, { Component } from 'react';
import { Form, Select } from 'antd';
import api from 'util/Api';

export default class MatrizCalculoCilindro extends Component {
  state = {
    itens: [],
    loading: true,
  };
  componentDidMount() {
    const { tipo } = this.props;
    console.log(tipo);
    api
      .get(`matrizcalculocilindro`)
      .then((result) => {
        this.setState({ itens: result.data.data });
      })
      .catch(function (error) {})
      .then(() => {
        this.setState({ loading: false });
      });
  }

  render() {
    const { itens, loading } = this.state;
    const { label, value, onChange, name } = this.props;
    return (
      <Form.Item label={label} required={true}>
        <Select
          loading={loading}
          placeholder="Selecione um registro"
          value={value}
          name={name}
          onChange={onChange}
        >
          {itens.map((b) => {
            return (
              <Select.Option key={b.id} v value={b.id}>
                {b.codigo} - {b.description}
              </Select.Option>
            );
          })}
        </Select>
      </Form.Item>
    );
  }
}
