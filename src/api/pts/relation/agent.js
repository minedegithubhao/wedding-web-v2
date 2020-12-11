import { axios } from '@/utils/request'

const api = {
  hunAgent: '/pts/relation/hunAgent'
}

export function getHunAgentList (parameter) {
  return axios({
    url: api.hunAgent + '/list',
    method: 'get',
    params: parameter
  })
}

export function saveHunAgent (parameter) {
  return axios({
    url: api.hunAgent + (parameter.id !== 0 ? '/update' : '/save'),
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function delHunAgent (parameter) {
  return axios({
    url: api.hunAgent + '/remove',
    method: 'post',
    params: parameter
  })
}

export const hunAgentExport = api.hunAgent + '/export'
