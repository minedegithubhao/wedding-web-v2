import { axios } from '@/utils/request'

const api = {
  hunMatchmaker: '/pts/matchmaker/hunMatchmaker'
}

export function getHunMatchmakerList (parameter) {
  return axios({
    url: api.hunMatchmaker + '/list',
    method: 'get',
    params: parameter
  })
}

export function saveHunMatchmaker (parameter) {
  return axios({
    url: api.hunMatchmaker + (parameter.id !== 0 ? '/update' : '/save'),
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function delHunMatchmaker (parameter) {
  return axios({
    url: api.hunMatchmaker + '/remove',
    method: 'post',
    params: parameter
  })
}

export const hunMatchmakerExport = api.hunMatchmaker + '/export'
