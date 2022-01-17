// import axious from 'util/Api';
// import { React } from 'react';
import api from '../util/Api';

export const getAll = () => {
  return new Promise((resolve,reject) => {
    api.get(`matrizcalculocilindro/`, {})
      .then((result) => {
          resolve({data: result.data});
      })
      .catch(function(error) {
          reject({error: error.data.message});
      })
  })
}

export const get = (id) => {
  return new Promise((resolve,reject) => {
    api.get(`matrizcalculocilindro/${id}`)
      .then((result) => {
        resolve({data: result.data});
      })
      .catch(function(error) {
          reject({error: error.data.message});
      })
  })
}
export const save = (record) => {
  return new Promise((resolve, reject) => {
    let data = record.record;

    console.log(data);

    let METHOD = 'POST';
    let URL = `matrizcalculocilindro/`;
    
    if(data.id !== undefined && data.id !== ''){
      METHOD = 'PATCH'
      URL = `matrizcalculocilindro/${data.id}`
    }

    api({
        method: METHOD,
        url: URL,
        data:data
      })
      .then((result) => {
        resolve({data: result.data});
      })
      .catch(function(error) {
        reject({error: error.response.data.error});
    })
  })
}

export const destroy = (id) => {
  return new Promise((resolve,reject) => {
    api.delete(`matrizcalculocilindro/${id}`)
      .then((result) => {
        console.log(result);
        resolve({data: result.data});
      })
      .catch(function(error) {
          reject({error: error.data.message});
      })
  })
}