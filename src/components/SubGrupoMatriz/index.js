import React, { Component } from 'react';
import { Form, Select } from 'antd';
import api from 'util/Api';

export default class SubGrupoMatriz extends Component {
  state = {
    itens: [],
    loading: true,
  };
  componentDidMount() {
    // const { tipo } = this.props;
    api
      .get(`subgrupomatriz/?sort=id ASC`)
      .then((result) => {
        this.setState({ itens: result.data });
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
      <Form.Item label={label}>
        <Select
          loading={loading}
          placeholder="Selecione um registro"
          value={value}
          name={name}
          onChange={onChange}
        >
          {itens.map((b) => {
            return (
              <Select.Option key={b.id} value={b.id}>
                {b.cod} - {b.description}
              </Select.Option>
            );
          })}
        </Select>
      </Form.Item>
    );
  }
}
