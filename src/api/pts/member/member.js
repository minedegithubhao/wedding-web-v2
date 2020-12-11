import { axios } from '@/utils/request'

const api = {
  hunMember: '/pts/member/hunMember'
}

export function getHunMemberList (parameter) {
  return axios({
    url: api.hunMember + '/list',
    method: 'get',
    params: parameter
  })
}

export function saveHunMember (parameter) {
  return axios({
    url: api.hunMember + (parameter.id !== 0 ? '/update' : '/save'),
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function delHunMember (parameter) {
  return axios({
    url: api.hunMember + '/remove',
    method: 'post',
    params: parameter
  })
}

export const hunMemberExport = api.hunMember + '/export'
