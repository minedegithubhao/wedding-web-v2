import { axios } from '@/utils/request'

const api = {
  tSysSerialNumber: '/pts/sys/TSysSerialNumber'
}

export function getTSysSerialNumberList (parameter) {
  return axios({
    url: api.tSysSerialNumber + '/list',
    method: 'get',
    params: parameter
  })
}

export function saveTSysSerialNumber (parameter) {
  return axios({
    url: api.tSysSerialNumber + (parameter.id !== 0 ? '/update' : '/save'),
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function delTSysSerialNumber (parameter) {
  return axios({
    url: api.tSysSerialNumber + '/remove',
    method: 'post',
    params: parameter
  })
}

export function UUIDTSysSerialNumber (parameter) {
  return axios({
    url: api.tSysSerialNumber + '/UUID',
    method: 'post',
    params: parameter
  })
}
export function uniqueTSysSerialNumber (parameter) {
  return axios({
    url: api.tSysSerialNumber + '/unique',
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
export const tSysSerialNumberExport = api.tSysSerialNumber + '/export'
