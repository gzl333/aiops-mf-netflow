<!--<script setup lang="ts">-->
<!--import * as echarts from 'echarts'-->
<!--import { onMounted } from 'vue'-->

<!--type EChartsOption = echarts.EChartsOption-->
<!--let base = +new Date(2023, 6, 27, 0, 0)-->
<!--// const oneDay = 24 * 3600 * 1000-->
<!--// const oneHour = 3600 * 1000-->
<!--const oneMinute = 60 * 1000-->
<!--const data = [[base, Math.random() * 300]]-->
<!--// const date = ref(new Date())-->

<!--for (let i = 1; i < 24 * 60; i++) {-->
<!--  const now = new Date((base += oneMinute))-->
<!--  data.push([+now, Math.round(Math.random() * 200)])-->
<!--}-->

<!--const option: EChartsOption = {-->
<!--  tooltip: {-->
<!--    trigger: 'axis',-->
<!--    position: function (pt) {-->
<!--      return [pt[0], '10%']-->
<!--    }-->
<!--  },-->
<!--  title: {-->
<!--    left: 'center',-->
<!--    text: '汇聚折线图'-->
<!--  },-->
<!--  toolbox: {-->
<!--    feature: {-->
<!--      dataZoom: {-->
<!--        yAxisIndex: 'none'-->
<!--      },-->
<!--      restore: {},-->
<!--      saveAsImage: {}-->
<!--    }-->
<!--  },-->
<!--  xAxis: {-->
<!--    type: 'time',-->
<!--    boundaryGap: false-->
<!--  },-->
<!--  yAxis: {-->
<!--    type: 'value',-->
<!--    boundaryGap: [0, '100%']-->
<!--  },-->
<!--  dataZoom: [-->
<!--    {-->
<!--      type: 'inside',-->
<!--      start: 0,-->
<!--      end: 20-->
<!--    },-->
<!--    {-->
<!--      start: 0,-->
<!--      end: 20-->
<!--    }-->
<!--  ],-->
<!--  series: [-->
<!--    {-->
<!--      name: 'Fake Data',-->
<!--      type: 'line',-->
<!--      smooth: true,-->
<!--      symbol: 'none',-->
<!--      areaStyle: {},-->
<!--      data-->
<!--    }-->
<!--  ]-->
<!--}-->

<!--onMounted(async () => {-->
<!--  const chartDom = document.getElementById('main')!-->
<!--  const myChart = echarts.init(chartDom)-->
<!--  await myChart.setOption(option)-->
<!--  option && myChart.setOption(option)-->
<!--  myChart.resize({-->
<!--    width: 1200,-->
<!--    height: 500-->
<!--  })-->
<!--  // watch(date, (newVal) => {-->
<!--  //   myChart.setOption({-->
<!--  //     xAxis: {-->
<!--  //       data: [newVal.toISOString().slice(0, 10)] // 更新横坐标数据为选定的日期-->
<!--  //     }-->
<!--  //   })-->
<!--  // })-->
<!--})-->
<!--</script>-->

<!--<template>-->
<!--  <div class="chart-container">-->
<!--    <div id="main" class="chart"></div>-->
<!--  </div>-->
<!--</template>-->

<!--<style scoped>-->
<!--.chart-container {-->
<!--  width: 100%;-->
<!--  max-width: 1200px;-->
<!--  margin: 50px;-->
<!--  padding: 0px;-->
<!--}-->

<!--.chart {-->
<!--  height: 600px;-->
<!--}-->
<!--</style>-->
<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
const activeItem = ref()
const activeItem2 = ref<string|undefined>('')
const detail = ref('')
import * as echarts from 'echarts'
import api from 'src/api'
// 调数据接口
interface HttpCategroyQueryInterface {
  page?: number;
  page_size?: number;
}

interface getLogInfoTabListInterface {
  start: number | undefined;
  end: number;
  direction?: string;
  limit?: string;
  app_id: string;
}
const dnsQuery = ref<HttpCategroyQueryInterface>({
})
const bigTabList = ref<any[]>([])
const smallTabList = ref<any[]>([])
const test1 = ref()
// const getHttpCategroyList = async () => {
//   await aiops.log.http.getlogcategory({ query: dnsQuery.value }).then((res) => {
//     bigTabList.value = res.data.results
//     test1.value = bigTabList.value[0].desc_name
//     activeItem.value = bigTabList?.value[0]?.desc_name
//     activeItem2.value = bigTabList?.value[0]?.website[0].desc_name
//   })
// }
const bigTabList1 = ref<any[]>([])
const logTab = async () => {
  const logRes = await api.aiops.netflow.getNetflowLog(
    {
      query: {
        instance: '159.226.8.145',
        start: 1688112700,
        end: 1688112766
      }
    })
  bigTabList1.value = logRes.data.results
  detail.value = JSON.parse(logRes.data.result[0][1])
  // Time.value = logRes.data.result[0][0]
  // srcIP.value = JSON.parse(logRes.data.result[0][1]).srcIP
  // scrTransportPort.value = JSON.parse(logRes.data.result[0][1]).scrTransportPort
  // transport.value = JSON.parse(logRes.data.result[0][1]).network.transport//
  // dstIP.value = JSON.parse(logRes.data.result[0][1]).dstIP
  // dstTransportPort.value = JSON.parse(logRes.data.result[0][1]).dstTransportPort
  // bytes.value = JSON.parse(logRes.data.result[0][1]).network.bytes//
  // direction.value = JSON.parse(logRes.data.result[0][1]).network.direction//
  // ingressInterface.value = JSON.parse(logRes.data.result[0][1]).ingressInterface
  // egressInterface.value = JSON.parse(logRes.data.result[0][1]).egressInterface
  // bgpSrcAsNumber.value = JSON.parse(logRes.data.result[0][1]).bgpSrcAsNumber
  // bgpDstAsNumber.value = JSON.parse(logRes.data.result[0][1]).bgpDstAsNumber
  // bgpNextHopAddress.value = JSON.parse(logRes.data.result[0][1]).bgpNextHopAddress
  console.log('data:', logRes.data)
  console.log('dataJSON:', JSON.parse(logRes.data.result[0][1]))
  // console.log('time:', Time.value)
  // console.log('srcIP:', srcIP.value)
  // console.log('transport:', transport.value)
}

// 时间处理
const date = new Date()
date.setMonth(date.getMonth())
date.setMinutes(date.getMinutes() - 10)
const date2 = new Date()
function formatDateTime (date:Date): string {
  const year = date?.getFullYear().toString().padStart(4, '0')
  const month = (date?.getMonth() + 1).toString().padStart(2, '0')
  const day = date?.getDate().toString().padStart(2, '0')
  return `${year}-${month}-${day}`
}
function formatMinuteTime (date:Date): string {
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  const second = date.getSeconds().toString().padStart(2, '0')
  const millisecond = date.getMilliseconds().toString().padStart(3, '0')
  return `${hours}:${minutes}:${second}:${millisecond}`
}
const startDate = formatDateTime(date)
const startTime = formatMinuteTime(date)
const currentDate = formatDateTime(date2)
const dateFrom = ref(startDate)
const timeFrom = ref(startTime)
const toggleSort = ref('forward')
const getLogInfoQuery = ref<getLogInfoTabListInterface>({
  direction: toggleSort.value,
  start: Math.floor(new Date(dateFrom.value + ' ' + timeFrom.value).getTime() * 1000000 - 1000000000),
  end: Math.floor(new Date(dateFrom.value + ' ' + timeFrom.value).getTime() * 1000000),
  app_id: '825fbe0a-e2b9-4f38-82ae-632b222da560'
})
// nginx 解析
class LogInfoInterface {
  creation_time: string | undefined
  user_ip: string | undefined
  real_ip: string | undefined
  request_info: string | undefined
  upload_stream: number | undefined
  down_stream: number | undefined
  status: number | undefined
  constructor (creationTime: string, remoteIp: string, localIp: string, requestInfo: string, uploadStream: number, downStream: number, status: number) {
    this.creation_time = creationTime
    this.user_ip = remoteIp
    this.real_ip = localIp
    this.request_info = requestInfo
    this.upload_stream = uploadStream
    this.down_stream = downStream
    this.status = status
  }
}

class DetailsInforInterface {
  time: string | undefined
  srcIP: string | undefined
  scrTransportPort: string | undefined
  transport: string | undefined
  dstIP: string | undefined
  dstTransportPort: string | undefined
  bytes: string | undefined
  direction: string | undefined
  ingressInterface: string | undefined
  egressInterface: string | undefined
  bgpSrcAsNumber: string | undefined
  bgpDstAsNumber: string | undefined
  bgpNextHopAddress: string | undefined
  constructor (time: string, srcIP:string, scrTransportPort:string, transport:string, dstIP:string, dstTransportPort:string, bytes: string, direction: string, ingressInterface: string, egressInterface: string, bgpSrcAsNumber: string, bgpDstAsNumber: string, bgpNextHopAddress: string) {
    this.time = time
    this.srcIP = srcIP
    this.scrTransportPort = scrTransportPort
    this.transport = transport
    this.dstIP = dstIP
    this.dstTransportPort = dstTransportPort
    this.bytes = bytes
    this.direction = direction
    this.ingressInterface = ingressInterface
    this.egressInterface = egressInterface
    this.bgpSrcAsNumber = bgpSrcAsNumber
    this.bgpDstAsNumber = bgpDstAsNumber
    this.bgpNextHopAddress = bgpDstAsNumber
  }
}
const arrDetail = ref<DetailsInforInterface[]>([])

const arrObsLog = ref<LogInfoInterface[]>([])
// eslint-disable-next-line @typescript-eslint/no-empty-function
function loadEachInfo (logInfo: string) {
  // eslint-disable-next-line camelcase
  const infoArray = logInfo.split(' ')
  const infor: DetailsInforInterface = {
    time: '1',
    srcIP: '1',
    scrTransportPort: '1',
    transport: '1',
    dstIP: '2',
    dstTransportPort: '2',
    bytes: '2',
    direction: '2',
    ingressInterface: '2',
    egressInterface: '2',
    bgpSrcAsNumber: '2',
    bgpDstAsNumber: '2',
    bgpNextHopAddress: '2'
  }
  const info: LogInfoInterface = {
    creation_time: infoArray[1] + infoArray[2],
    real_ip: infoArray[0],
    user_ip: infoArray[3],
    request_info: infoArray[9],
    upload_stream: Number(infoArray[5]),
    down_stream: Number(infoArray[6]),
    status: Number(infoArray[4])
  }
  arrDetail.value.push(infor)
}
function loadObsInfo (res:any): void {
  for (let i = 0; i < res.value.results.length; i++) {
    const logInfo = res.value.results[i][1]
    loadEachInfo(logInfo)
  }
}
const result = ref()
// 数据表字段设计
const nginxLogColumns = computed(() => [
  { name: '源IP地址', label: '源IP地址', field: 'scrIP' },
  { name: '源端口', label: '源端口', field: 'srcTransportPort' },
  { name: '协议', label: '协议', field: 'transport' },
  { name: '目的IP地址', label: '目的IP地址', field: 'dstIP' },
  { name: '目的端口', label: '目的端口', field: 'dstTransportPort' },
  { name: '数据包大小', label: '数据包大小', field: 'bytes' },
  { name: '方向', label: '方向', field: 'direction' },
  { name: '路由器入口', label: '路由器入口', field: 'ingressInterface' },
  { name: '路由器出口', label: '路由器入口', field: 'egressInterface' },
  { name: 'BGP源自治域（AS)号', label: 'BGP源自治域（AS)号', field: 'bgpSrcAsNumber' },
  { name: 'BGP目的自治域（AS)号', label: 'BGP目的自治域（AS)号', field: 'bgpDstAsNumber' },
  { name: 'BGP下一跳地址', label: 'BGP下一跳地址', field: 'bgpNextHopAddress' }
])
// 获取日志数据
const paginationTable = ref({
  page: 1,
  count: 0,
  rowsPerPage: 100
})
interface resultInterface {
  real_ip: string,
  datetime: number,
  user_ip: string,
  // bucket: string,
  status: number,
  req_bytes: number,
  res_bytes: number,
  type: string,
  http_referer: string
}
interface resultInterface1 {
  time: string
  srcIP: string
  scrTransportPort: string
  transport: string
  dstIP: string
  dstTransportPort: string
  bytes: string
  direction: string
  ingressInterface: string
  egressInterface: string
  bgpSrcAsNumber: string
  bgpDstAsNumber: string
  bgpNextHopAddress: string
}

// const nginxLogTableRow = ref<resultInterface[]>()
const nginxLogTableRow = ref<resultInterface1[]>()
const getObsloginfo = async () => {
  await api.aiops.netflow.getNetflowLog(
    {
      query: {
        instance: '159.226.8.145',
        start: 1688112700,
        end: 1688112766
      }
    }).then((res) => {
    result.value = res.data
    paginationTable.value.count = res.data.count
    loadObsInfo(result)
  })
}
// 表单筛选
const timeNumber = ref(10)
const modelTimeUnit = ref({
  label: 'ms',
  value: 'millisecond'
})
const checkdate = async (date: string) => {
  if (new Date(date) > new Date(currentDate)) {
    alert('时间选择无效')
  }
  console.log('dateFromchange', date)
}
const changeSort = async () => {
  getLogInfoQuery.value.direction = toggleSort.value
  arrObsLog.value = []
  await getObsloginfo()
}
const changeSmallTab = async (name: string, id: string) => {
  console.log('changeSmallTabid', id)
  activeItem2.value = name
  getLogInfoQuery.value.app_id = id
  arrObsLog.value = []
  await getObsloginfo()
}
const search = async () => {
  const startString = ref<number>(0)
  const endString = ref(new Date(dateFrom.value + ' ' + timeFrom.value))
  if (modelTimeUnit.value.value === 'millisecond') {
    startString.value = Math.floor(endString.value.getTime()) - timeNumber.value
  } else if (modelTimeUnit.value.value === 'second') {
    startString.value = Math.floor(endString.value.getTime()) - timeNumber.value * 1000
  } else if (modelTimeUnit.value.value === 'minute') {
    startString.value = Math.floor(endString.value.getTime()) - timeNumber.value * 60 * 1000
  } else if (modelTimeUnit.value.value === 'hour') {
    startString.value = Math.floor(endString.value.getTime()) - timeNumber.value * 60 * 60 * 1000
  }
  console.log('startString', startString)
  getLogInfoQuery.value.start = startString.value * 1000000
  getLogInfoQuery.value.end = Math.floor(endString.value.getTime() * 1000000)
  arrObsLog.value = []
  await api.aiops.netflow.getNetflowLog(
    {
      query: {
        instance: '159.226.8.145',
        start: 1688112700,
        end: 1688112766
      }
    }).then((res) => {
    result.value = res.data
    loadObsInfo(result)
  })
  console.log('Echarts', nginxLogTableRow.value)
}

const timeOption = [
  {
    label: 'ms',
    value: 'millisecond'
  },
  {
    label: 's',
    value: 'second'
  }, {
    label: 'min',
    value: 'minute'
  },
  {
    label: 'h',
    value: 'hour'
  }
]

function fromatTime (timestamp:string) {
  const day = timestamp.substring(0, 2)
  const month = timestamp.substring(3, 6)
  const year = timestamp.substring(7, 11)
  const time = timestamp.substring(12, 20)
  const monthMap: { [key: string]: string } = {
    Jan: '01',
    Feb: '02',
    Mar: '03',
    Apr: '04',
    May: '05',
    Jun: '06',
    Jul: '07',
    Aug: '08',
    Sep: '09',
    Oct: '10',
    Nov: '11',
    Dec: '12'
  }
  const monthNumber = monthMap[month]
  const formattedDate = `${year}-${monthNumber}-${day} ${time}`
  return formattedDate
}
// 获取时间段间隔一分钟数组
const dates = ref<string[]>([])
const getDayAll = async (starDay: string, endDay: string) => {
  const arr = []
  // 设置两个日期UTC时间
  const db = new Date(starDay)
  const de = new Date(endDay)
  // 获取两个日期GTM时间
  const s = db.getTime() - 60 * 1000
  const d = de.getTime() - 60 * 1000
  // 获取到两个日期之间的每一天的毫秒数
  for (const i = ref<number>(s); i.value <= d;) {
    i.value = i.value + 60 * 1000
    arr.push(parseInt(i.value.toString()))
  }
  // 获取每一天的时间  YY-MM-DD
  for (const j in arr) {
    const time = new Date(arr[j])
    const year = time.getFullYear()
    const mouth = (time.getMonth() + 1) >= 10 ? (time.getMonth() + 1) : ('0' + (time.getMonth() + 1))
    const day = time.getDate() >= 10 ? time.getDate() : ('0' + time.getDate())
    const hour = time.getHours() >= 10 ? time.getHours() : ('0' + time.getHours())
    const minutes = time.getMinutes() >= 10 ? time.getMinutes() : ('0' + time.getMinutes())
    const YYMMDD = year + '-' + mouth + '-' + day + ' ' + hour + ':' + minutes
    dates.value.push(YYMMDD)
  }
  console.log('datesArray', dates)
  return dates
}
const option = {
  title: {
    text: '趋势'
  },
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    data: ['记录数']
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  toolbox: {
    feature: {
      saveAsImage: {}
    }
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: dates.value
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      name: '记录数',
      type: 'line',
      stack: 'Total',
      data: [220, 230, 222, 234, 233, 250, 290, 220, 230, 222, 234, 233, 250, 290, 220, 230, 222, 234, 233, 250, 290]
    }
  ]
}
// 动态目录
const test2 = ref<any[]>([])
const changeBigTabIndex = (index: number, descname: string) => {
  // index1.value = index
  activeItem.value = descname
  test1.value = descname
  Object.assign(test2.value, bigTabList?.value[index])
}
onMounted(async () => {
  await logTab()
  // await getHttpCategroyList()
  await getObsloginfo()
  // loadObsInfo(result)
  await getDayAll(dateFrom.value.toString() + ' ' + '00:00:00', dateFrom.value.toString() + ' ' + '23:59:59')
  const chartDom = document.getElementById('main')!
  const myChart = echarts.init(chartDom)
  await myChart.setOption(option)
  option && myChart.setOption(option)
  myChart.resize({
    width: 1230,
    height: 400
  })
})

const changePageSize = () => {
  paginationTable.value.page = 1
}

</script>

<template>
  <div class="PersonalIndex">
    <q-scroll-area style="height: calc(100vh - 60px);">
      <div class="column">
        <div class="col-auto">
          <div class="row justify-center">
            <div class="content-fixed-width">
              <div class="row justify-between q-pt-lg q-pb-sm">
                <div class="col-auto row items-end text-h6 q-px-none">
                  HTTP日志
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <q-tabs
                    v-model="activeItem"
                    inline-label
                    align="left"
                    indicator-color="primary"
                    active-color="primary"
                  >
                    <q-tab no-caps :name="item?.desc_name" v-model="test1" v-for=" (item, index) in bigTabList" class="q-px-none q-py-md q-mr-md" :ripple="false" :label="item?.desc_name"
                          :key="index"   style="width: 13%" @click="changeBigTabIndex(index,item.desc_name)">
                    </q-tab>
                  </q-tabs>
                </div>
              </div>
        <q-separator/>
              <div class="row justify-start q-mt-lg ">
                <div id="main" class="col-12">
                </div>
              </div>
              <div class="row justify-start q-mt-lg ">
                <div class="col-5 row justify-start">
                  <div class="col-4 q-ml-lg">
                  <q-input filled dense v-model="dateFrom" >
                    <template v-slot:prepend>
                      <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
                          <q-date minimal v-model="dateFrom" mask="YYYY-MM-DD">
                            <div class="row items-center justify-end">
                              <q-btn v-close-popup label="确定" color="primary" flat/>
                            </div>
                          </q-date>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                  </div>
                  <q-btn class="col-2 q-ml-md"  outline label="看趋势" @click="search(dateFrom)" dense/>
                  <div class="col-4 q-ml-lg">
                    <q-input filled dense v-model="timeFrom" >
                    <template v-slot:append>
                      <q-icon name="access_time" class="cursor-pointer">
                        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                          <q-time v-model="dateFrom" format24h @update:model-value="checkdate(dateFrom)" mask="HH:mm:ss:SSS"  with-seconds>
                            <div class="row items-center justify-end">
                              <q-btn v-close-popup label="确定" color="primary" flat/>
                            </div>
                          </q-time>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                      </q-input>
                  </div>
                </div>
                <div class="col-6 row justify-start">
                  <q-toggle
                    class="col-3"
                    v-model="toggleSort"
                    :true-value="'forward'"
                    :false-value="'backward'"
                    :label="toggleSort === 'forward' ? '时间正序':'时间倒序'"
                    @update:model-value="changeSort(toggleSort.toString())"
                 />
                <div class="col-5 q-ml-md justify-start row">
                  <q-input class="col-7  justify-start row" dense outlined v-model="timeNumber" label="时间跨度">
                  </q-input>
                  <q-select v-model="modelTimeUnit" :options="timeOption" label="单位"  class="col-4 q-ml-md"  outlined dense/>
                </div>
                  <q-btn class="col-2 q-ml-md" style="height: 40px"  outline label="看明细" @click="search()" dense/>
                </div>
              </div>
              <div class="row q-mt-md">
                <q-tabs
                  v-model="activeItem2"
                  vertical
                  align="justify"
                  active-color="primary"
                  active-bg-color="grey-3"
                  style="width: 16%"
                >
                  <q-tab :activeItem2 ="item1?.desc_name"  :name="item1?.desc_name" v-for=" (item1, index2) in  test2.website" class="q-px-none q-py-md q-mr-md" :ripple="false" :label="item1?.desc_name" @click="changeSmallTab(item1?.desc_name, item1.id)"
                         :key="index2" no-caps>
                  </q-tab>
                </q-tabs>
                <div style="width: 84%">
                  <div class="Service1Page q-ml-md">
                    <div class="row justify-center" >
                      <q-table
                        style="width: 100%"
                        flat
                        class="row col-20  justify-start  q-pl-md "
                        id="StorageMeteringTable"
                        card-class="no-padding"
                        table-header-class="bg-grey-1 text-grey"
                        :rows="arrObsLog"
                        :columns= "nginxLogColumns"
                        row-key="name"
                        color="primary"
                        :loading-label="'notifyLoading'"
                        :no-data-label="'noData'"
                        hide-pagination
                        v-model:pagination="paginationTable"
                        :pagination="{ rowsPerPage: 0 }"
                      >
                        <template v-slot:body="props">
                          <q-tr :props="props">
                            <q-td class="no-padding"  key="sort" :props="props" :label="toggleSort">
                              {{ props.row.creation_time}}
                            </q-td>
                            <q-td  :class="['my-table-cell']" class="no-padding" key="creation_time" :props="props">{{props.row.t}}</q-td>
                            <q-td  :class="['my-table-cell']" class="no-padding" key="remote_ip" :props="props" style="white-space:normal;">{{ props.row.user_ip }}</q-td>
                            <q-td  :class="['my-table-cell']" class="no-padding" key="local_ip" :props="props" >{{ props.row.real_ip}}</q-td>
                            <q-td  :class="['my-table-cell']" class="no-padding" key="upload_stream" :props="props">{{ props.row.upload_stream}}</q-td>
                            <q-td  :class="['my-table-cell']" class="no-padding" key="down_stream" :props="props">{{ props.row.down_stream}}</q-td>
                            <q-td  :class="['my-table-cell']" class="no-padding" key="status" :props="props">{{ props.row.status}}</q-td>
                            <q-td  :class="['my-table-cell1']" class="no-padding" key="request_info" :props="props" style="white-space:normal;word-break:break-all;word-wrap:break-word;">
                              {{ props.row.request_info }}
                            </q-td>
                          </q-tr>
                        </template>
                        <template v-slot:top-right>
                          <div class="col-auto row items-center q-gutter-x-xs">
                          </div>
                        </template>
                      </q-table>
                      <q-separator/>
                    </div>
                    <div class="text-grey q-mt-lg row justify-start q-mb-lg">
                      <div class="row col-12  justify-start ">
                        <div class="col-4 justify-start row ">
                          <span class="q-ml-xl q-pt-sm q-pr-md " >共{{ paginationTable.count }}条数据</span>
                          <q-select class="q-pt-none" color="grey" v-model="paginationTable.rowsPerPage" :options="[100,200,300]" dense options-dense
                                    borderless @update:model-value="changePageSize">
                          </q-select>
                          <span class="q-pt-sm ">页</span>
                        </div>
                        <q-pagination
                          v-model="paginationTable.page"
                          :max="Math.ceil(paginationTable.count/paginationTable.rowsPerPage)"
                          :max-pages="12"
                          direction-links
                          outline
                          :ripple="false"
                          @click="changePagination"
                          class="col-8 justify-end q-pr-lg"
                        />
                      </div>
                    </div>
                    <q-separator></q-separator>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </q-scroll-area>
  </div>
</template>

<style lang="scss" scoped>
.Service2Page {
}
.my-table-cell {
  width: 120px; /* 设置你想要的宽度 */
}

.my-table-cell1 {
  width: 350px; /* 设置你想要的宽度 */
}
</style>
