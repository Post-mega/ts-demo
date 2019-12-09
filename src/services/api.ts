import request from '@/utils/request';

export function getAllBusinessLine() {
  return request(`/business-lines`, {
    method: 'GET'
  })
}