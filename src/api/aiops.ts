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
        host ?:string
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
  },
  log: {
    // 科技云通行证登录接口
    dns: {
      getdnslogtype (payload?: {
        query?: {
          limit?: number;
          offset?: number;
        }
      }) {
        const config = {
          params: payload?.query
        }
        return axiosAiops.get('v1/dns/host/type', config)
      },
      getDnsLog (payload?: {
        query?: {
          direction?: string;
          host_id?: number;
          limit?: number;
          start?: number;
          end?: number;
        }
      }) {
        const config = {
          params: payload?.query
        }
        return axiosAiops.get('v1/dns/host/log/', config)
      },
      getlogdnsinfo (payload?: {
        query?: {
          start?: number;
          end?: number;
          direction?: string;
          limit?: string;
          host_id?: number;
        }
      }) {
        const config = {
          params: payload?.query
        }
        return axiosAiops.get('v1/dns/host/log/', config)
      }
    },
    http: {
      getNetFlowType (payload?: {
        query?: {
          limit?: number;
          offset?: number;
        }
      }) {
        const config = {
          params: payload?.query
        }
        return axiosAiops.get('v1/netflow/node/type/', config)
      },
      getNetFlowList (payload?: {
        query?: {
          limit?: number;
          offset?: number;
        }
      }) {
        const config = {
          params: payload?.query
        }
        return axiosAiops.get('v1/netflow/node/list/', config)
      },
      getNetFlowLog (payload: {
        query: {
          start?: number;
          end?: number;
          direction?: string;
          instance?: string;
          limit?: number
        }
      }) {
        const config = {
          params: payload?.query
        }
        return axiosAiops.get('v1/netflow/log/', config)
      },
      getNetFlowStatistics (payload: {
        query: {
          start?: number;
          end?: number;
          host?: string;
          offset?: number;
          limit?: number
        }
      }) {
        const config = {
          params: payload?.query
        }
        return axiosAiops.get('v1/netflow/statistics/', config)
      },
      getlogcategory (payload?: {
        query?: {
          page?: number;
          page_size?: number;
        }
      }) {
        const config = {
          params: payload?.query
        }
        return axiosAiops.get('v1/log/http-log/category/', config)
      },
      getlogapp (payload?: {
        query?: {
          page?: number;
          page_size?: number;
          status?: string;
          category?: string;
        }
      }) {
        const config = {
          params: payload?.query
        }
        return axiosAiops.get('v1/log/http-log/app/', config)
      },
      getlogappinfo (payload?: {
        query?: {
          start?: number;
          end?: number;
          direction?: string;
          limit?: string;
          app_id?: string;
        }
      }) {
        const config = {
          params: payload?.query
        }
        return axiosAiops.get('v1/log/http-log/log/', config)
      },
      getLogStatistics (payload: {
        query: {
          start?: number;
          end?: number;
          host?: string;
          limit?: number;
          offset?: number;
        }
      }) {
        const config = {
          params: payload?.query
        }
        return axiosAiops.get('v1/log/http-log/statistics/', config)
      },
      getDnsStatistics (payload: {
        query: {
          start?: number;
          end?: number;
          host?: string | number;
          limit?: number;
          offset?: number;
        }
      }) {
        const config = {
          params: payload?.query
        }
        return axiosAiops.get('v1/dns/host/statistics/', config)
      }
    }
  }
}
