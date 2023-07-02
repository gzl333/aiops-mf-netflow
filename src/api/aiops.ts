/* 标准api调用函数库,严格与后端接口一致 */
// aiops backend api

/* eslint-disable camelcase */

// import { axiosAiops } from 'boot/axios'

import { axiosAiops } from 'boot/axios'

export default {
  //  apis
  netflow: {
    getNetflowLog (payload: {
      query: {
        start: number
        end: number
        instance: string
        direction?: string
        limit?: number
      },
      // path: {},
      // body: {}
    }) {
      const config = {
        params: payload?.query
      }
      return axiosAiops.get('/netflow/log/', config)
    },
    getNetflowNodeList (payload?: {
      query?: {
        offset?: number
        limit?: number
      },
      // path: {},
      // body: {}
    }) {
      const config = {
        params: payload?.query
      }
      return axiosAiops.get('/netflow/node/list/', config)
    },
    getNetflowStatistics (payload?: {
      query?: {
        start?: number
        end?: number
        host_id?:string
        offset?: number
        limit?: number
      },
      // path: {},
      // body: {}
    }) {
      const config = {
        params: payload?.query
      }
      return axiosAiops.get('/netflow/statistics', config)
    }
  }
}
