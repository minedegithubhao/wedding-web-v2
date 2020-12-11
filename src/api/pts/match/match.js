import { axios } from '@/utils/request'

const api = {
  hunMatch: '/pts/match/hunMatch'
}

export function getHunMatchById(parameter) {
  return axios({
    url: api.hunMatch + '/get/' + parameter,
    method: 'get'
  })
}

export function getHunMatchList(parameter) {
  return axios({
    url: api.hunMatch + '/list',
    method: 'get',
    params: parameter
  })
}

export function saveHunMatch(parameter) {
  return axios({
    url: api.hunMatch + (parameter.id !== 0 ? '/update' : '/save'),
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function delHunMatch(parameter) {
  return axios({
    url: api.hunMatch + '/remove',
    method: 'post',
    params: parameter
  })
}

export const hunMatchExport = api.hunMatch + '/export'
