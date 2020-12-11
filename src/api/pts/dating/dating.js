import { axios } from '@/utils/request'

const api = {
  hunDating: '/pts/dating/hunDating'
}

export function getHunDatingList (parameter) {
  return axios({
    url: api.hunDating + '/list',
    method: 'get',
    params: parameter
  })
}

export function saveHunDating (parameter) {
  return axios({
    url: api.hunDating + (parameter.id !== 0 ? '/update' : '/save'),
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function delHunDating (parameter) {
  return axios({
    url: api.hunDating + '/remove',
    method: 'post',
    params: parameter
  })
}

export const hunDatingExport = api.hunDating + '/export'
