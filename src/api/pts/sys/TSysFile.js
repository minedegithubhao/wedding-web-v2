import { pureAxios, axios } from '@/utils/request'
import { resolveBlob } from '@/utils/util'

const api = {
  tSysFile: '/pts/sys/TSysFile'
}

export function getTSysFileList(parameter) {
  return axios({
    url: api.tSysFile + '/list',
    method: 'get',
    params: parameter
  })
}

export function saveTSysFile(parameter) {
  return axios({
    url: api.tSysFile + (parameter.id !== 0 ? '/update' : '/save'),
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
export function delTSysFile(parameter) {
  return axios({
    url: api.tSysFile + '/remove',
    method: 'post',
    params: parameter
  })
}
export function initTSysFileList(parameter) {
  return axios({
    url: api.tSysFile + '/init',
    method: 'post',
    params: parameter
  })
}

export function downloadTSysFile(parameter) {
  pureAxios({
    url: api.tSysFile + '/download',
    method: 'post',
    params: parameter,
    responseType: 'blob'
  })
    .then(response => {
      resolveBlob(response)
    })
    .catch(error => {
      console.log(error)
    })
}
export function getTSysFile(parameter) {
  pureAxios({
    url: api.tSysFile + '/download',
    method: 'post',
    params: parameter,
    responseType: 'blob'
  })
}
