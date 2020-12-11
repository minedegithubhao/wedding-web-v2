import { axios } from '@/utils/request'

const api = {
  hunCustom: '/pts/custom/custom'
}

export function getHunCustomById(parameter) {
  return axios({
    url: api.hunCustom + '/get/' + parameter,
    method: 'get'
  })
}

export function getHunCustomList(parameter) {
  return axios({
    url: api.hunCustom + '/list',
    method: 'get',
    params: parameter
  })
}

export function saveHunCustom(parameter) {
  return axios({
    url: api.hunCustom + (parameter.id !== 0 ? '/update' : '/save'),
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function delHunCustom(parameter) {
  return axios({
    url: api.hunCustom + '/remove',
    method: 'post',
    params: parameter
  })
}

export const hunCustomExport = api.hunCustom + '/export'
