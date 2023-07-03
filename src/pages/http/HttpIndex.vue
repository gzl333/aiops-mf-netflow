<script setup lang="ts">
/* eslint-disable */
import { ref, onMounted, computed } from 'vue'
import LineChart from 'components/chart/LineChart.vue'

const activeItem = ref()
const activeItem2 = ref<string | undefined>('')
import { date } from 'quasar'
import aiops from '../../api/aiops'

// 调数据接口
interface HttpCategroyQueryInterface {
  page?: number;
  page_size?: number;
}

interface getLogInfoTabListInterface {
  start?: number;
  end?: number;
  direction?: string;
  limit?: number;
  instance?: string;
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

const mapRef = ref()
const bigTabList = ref<any[]>([])
const test1 = ref()
// 时间处理
const date1 = new Date()
date1.setMonth(date1.getMonth())
date1.setMinutes(date1.getMinutes() - 10)
const date2 = new Date()
const startDate = formatDateTime(date1)
const startTime = formatMinuteTime(date1)
const currentDate = formatDateTime(date2)
const dateFrom = ref(startDate)
const timeFrom = ref(startTime)
const forTime = Number(date.formatDate(dateFrom.value + ' ' + timeFrom.value, 'X'))
// 表单筛选
const timeNumber = ref(10)
console.log(forTime)
const toggleSort = ref('forward')
const getLogInfoQuery = ref<getLogInfoTabListInterface>({
  direction: 'forward',
  start: forTime * 1000000000,
  end: (forTime * 1000 + timeNumber.value) * 1000000,
  // start: 1688295600,
  // end: 1688295600,
  instance: ''
})
// 动态目录
const test2: any = ref([])
const isLoading = ref(false)
let data1 = []
const chartData = ref<Array<string | number>>([])
const dateStampStr = Number(new Date(new Date().toLocaleDateString()).getTime()) / 1000
let smallIndex = 0
let startTimeFormatter = dateStampStr
const modelTimeUnit = ref({
  label: 'ms',
  value: 'millisecond'
})
const arrDetail = ref<DetailsInforInterface[]>([])
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
const nginxLogColumns = computed(() => [
  { name: 'time', label: '时间', align: 'center', field: 'time' },
  { name: 'scrIP', label: '源IP地址', field: 'scrIP', align: 'center' },
  { name: 'srcTransportPort', label: '源端口', field: 'srcTransportPort', align: 'center' },
  { name: 'transport', label: '协议', field: 'transport', align: 'center' },
  { name: 'dstIP', label: '目的IP地址', field: 'dstIP', align: 'center' },
  { name: 'dstTransportPort', label: '目的端口', field: 'dstTransportPort', align: 'center' },
  { name: 'bytes', label: '数据包大小', field: 'bytes', align: 'center' },
  { name: 'direction', label: '方向', field: 'direction', align: 'center' },
  { name: 'ingressInterface', label: '路由器入口', field: 'ingressInterface', align: 'center' },
  { name: 'egressInterface', label: '路由器入口', field: 'egressInterface', align: 'center' },
  { name: 'bgpSrcAsNumber', label: 'BGP源自治域（AS)号', field: 'bgpSrcAsNumber', align: 'center' },
  { name: 'bgpDstAsNumber', label: 'BGP目的自治域（AS)号', field: 'bgpDstAsNumber', align: 'center' },
  { name: 'bgpNextHopAddress', label: 'BGP下一跳地址', field: 'bgpNextHopAddress', align: 'center' }
])
const checkdate = async (date: string) => {
  if (new Date(date) > new Date(currentDate)) {
    alert('时间选择无效')
  }
}
const getHttpCategroyList = async () => {
  const res1 = await aiops.log.http.getNetFlowType()
  const res = await aiops.log.http.getNetFlowList()
  bigTabList.value = res1.data.results
  const data = res.data.results.filter((item) => item.host_type === 1)
  data1 = res.data.results
  test2.value = data
  activeItem.value = bigTabList.value[0].name
  activeItem2.value = data1[0].name
  getLogInfoQuery.value.instance = data1[0].source_ip
}
function formatDateTime (date: Date): string {
  const year = date?.getFullYear().toString().padStart(4, '0')
  const month = (date?.getMonth() + 1).toString().padStart(2, '0')
  const day = date?.getDate().toString().padStart(2, '0')
  return `${year}-${month}-${day}`
}

function formatMinuteTime (date: Date): string {
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  const second = date.getSeconds().toString().padStart(2, '0')
  const millisecond = date.getMilliseconds().toString().padStart(3, '0')
  return `${hours}:${minutes}:${second}:${millisecond}`
}
const changeSort = async (type: string) => {
  getLogInfoQuery.value.direction = toggleSort.value
  arrDetail.value = []
  await getObsloginfo()
}
function loadEachInfo (logInfo: any, time: any) {
  // eslint-disable-next-line camelcase
  // const infoArray = logInfo.split(' ')
  const infor: DetailsInforInterface = {
    time,
    srcIP: logInfo.srcIP,
    scrTransportPort: logInfo.scrTransportPort,
    transport: logInfo.network.transport,
    dstIP: logInfo.dstIP,
    dstTransportPort: logInfo.dstTransportPort,
    bytes: logInfo.network.bytes,
    direction: logInfo.network.direction,
    ingressInterface: logInfo.ingressInterface,
    egressInterface: logInfo.egressInterface,
    bgpSrcAsNumber: logInfo.bgpSrcAsNumber,
    bgpDstAsNumber: logInfo.bgpDstAsNumber,
    bgpNextHopAddress: logInfo.bgpNextHopAddress
  }
  arrDetail.value.push(infor)
}
function loadObsInfo (res:any): void {
  for (let i = 0; i < res.length; i++) {
    const logInfo = JSON.parse(res[i][1])
    const logInfo1 = ref()
    const time = res[i][0]
    logInfo1.value = JSON.parse(res[i][1]).srcIP
    loadEachInfo(logInfo, time)
  }
  console.log(arrDetail.value)
}
const getObsloginfo = async () => {
  isLoading.value = true
  const tableRes = await aiops.log.http.getNetFlowLog({ query: getLogInfoQuery.value })
  loadObsInfo(tableRes.data.result)
  isLoading.value = false
}
const search = () => {
  arrDetail.value = []
  let startString = Number(date.formatDate(dateFrom.value + ' ' + timeFrom.value, 'X'))
  let endString = 0
  if (modelTimeUnit.value.value === 'millisecond') {
    endString = (startString * 1000 + timeNumber.value) * 1000000
    startString = startString * 1000000000
  } else if (modelTimeUnit.value.value === 'second') {
    endString = startString + timeNumber.value
  } else if (modelTimeUnit.value.value === 'minute') {
    endString = startString + timeNumber.value * 60
  } else if (modelTimeUnit.value.value === 'hour') {
    endString = startString + timeNumber.value * 60 * 60
  }
  // if (modelTimeUnit.value.value === 'millisecond') {
  //   startString = Math.floor(endString.getTime()) - timeNumber.value
  // } else if (modelTimeUnit.value.value === 'second') {
  //   startString = Math.floor(endString.getTime()) - timeNumber.value * 1000
  // } else if (modelTimeUnit.value.value === 'minute') {
  //   startString = Math.floor(endString.getTime()) - timeNumber.value * 60 * 1000
  // } else if (modelTimeUnit.value.value === 'hour') {
  //   startString = Math.floor(endString.getTime()) - timeNumber.value * 60 * 60 * 1000
  // }
  getLogInfoQuery.value.start = startString
  getLogInfoQuery.value.end = endString
  getObsloginfo()
}
const changeData = () => {
  const formattedString = date.formatDate(dateFrom.value, 'X')
  startTimeFormatter = Number(formattedString) - 28800
}
const getTrendChartData = async (start: number, hostId: string) => {
  mapRef.value.chartStartLoading()
  const trendRes = await aiops.log.http.getNetFlowStatistics({ query: { start, host: hostId } })
  dates.value.forEach((dateItm, index) => {
    const hourMin = Number(date.formatDate(dateFrom.value + ' ' + dateItm, 'X'))
    const trend = trendRes.data.results.find((trendItem) => trendItem.timestamp === hourMin)
    if (trend) {
      chartData.value[index] = trend.count
    } else {
      chartData.value[index] = ''
    }
  })
  mapRef.value.chartStopLoading()
}
const search1 = () => {
  chartData.value = []
  getTrendChartData(startTimeFormatter, test2.value[smallIndex].id)
}

function fromatTime (timestamp: string) {
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
    // const YYMMDD = year + '-' + mouth + '-' + day + ' ' + hour + ':' + minutes
    const YYMMDD = hour + ':' + minutes
    dates.value.push(YYMMDD)
  }
  return dates
}
const option = computed(() => ({
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
    data: dates.value,
    axisLabel: {
      interval: 59
    }
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      name: '记录数',
      type: 'line',
      stack: 'Total',
      symbol: 'none',
      data: chartData.value
    }
  ]
}))
const changeBigTabIndex = (index: number, descname: string) => {
  chartData.value = []
  test1.value = descname
  if (index === 0) {
    test2.value = data1.filter((item) => item.host_type === index + 1)
  } else {
    test2.value = data1.filter((item) => item.host_type === 30001 )
  }
  getLogInfoQuery.value.instance = test2.value[0].source_ip
  activeItem2.value = test2.value[0].name
  getObsloginfo()
  getTrendChartData(dateStampStr, test2.value[smallIndex].id)
}
const changeSmallTab = async (name: string, ip: string, id: string, index: number) => {
  chartData.value = []
  smallIndex = index
  activeItem2.value = name
  getLogInfoQuery.value.instance = ip
  arrDetail.value = []
  await getObsloginfo()
  await getTrendChartData(startTimeFormatter, id)
}
onMounted(async () => {
  chartData.value = []
  await getHttpCategroyList()
  await getObsloginfo()
  await getDayAll(dateFrom.value.toString() + ' ' + '00:00:00', dateFrom.value.toString() + ' ' + '23:59:59')
  await getTrendChartData(dateStampStr, test2.value[smallIndex].id)
})

</script>

<template>
  <div class="PersonalIndex">
    <q-scroll-area style="height: calc(100vh - 60px);">
      <div class="column">
        <div class="col-auto">
          <div class="row justify-center">
            <div class="content-fixed-width">
              <div class="row justify-between q-pt-lg q-pb-sm">
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
                    <q-tab no-caps v-for=" (item, index) in bigTabList" :key="index" :label="item.name"
                           :name="item.name" class="q-px-none q-py-md q-mr-md" :ripple="false"
                           @click="changeBigTabIndex(index,item.name)" style="width: 13%">
                    </q-tab>
                  </q-tabs>
                </div>
              </div>
              <div class="row q-mt-lg ">
                <div class="col">
                  <line-chart :option="option" ref="mapRef"/>
                </div>
              </div>
              <div class="row justify-start q-mt-lg ">
                <div class="col-5 row justify-start">
                  <div class="col-4 q-ml-lg">
                    <q-input filled dense v-model="dateFrom">
                      <template v-slot:prepend>
                        <q-icon name="event" class="cursor-pointer">
                          <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
                            <q-date minimal v-model="dateFrom" mask="YYYY-MM-DD" @update:model-value="changeData">
                              <div class="row items-center justify-end">
                                <q-btn v-close-popup label="确定" color="primary" flat/>
                              </div>
                            </q-date>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                  </div>
                  <q-btn class="col-2 q-ml-md" outline label="看趋势" @click="search1" dense/>
                  <div class="col-4 q-ml-lg">
                    <q-input filled dense v-model="timeFrom">
                      <template v-slot:append>
                        <q-icon name="access_time" class="cursor-pointer">
                          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                            <q-time v-model="timeFrom" format24h @update:model-value="checkdate(timeFrom)"
                                    mask="HH:mm:ss:SSS" with-seconds>
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
                    <q-select v-model="modelTimeUnit" :options="timeOption" label="单位" class="col-4 q-ml-md" outlined
                              dense/>
                  </div>
                  <q-btn class="col-2 q-ml-md" style="height: 40px" outline label="看明细" @click="search()" dense/>
                </div>
              </div>
              <div class="row q-mt-md">
                <q-tabs
                  v-model="activeItem2"
                  vertical
                  align="justify"
                  active-color="primary"
                  active-bg-color="grey-3"
                  style="width: 12%"
                >
                  <q-tab v-for=" (item1, index2) in  test2" :activeItem2="item1.name" :name="item1.name" :ripple="false" :label="item1.name"
                         @click="changeSmallTab(item1.name, item1.source_ip, item1.id, index2)"
                         :key="index2" no-caps>
                  </q-tab>
                </q-tabs>
                <div style="width: 88%">
                  <div class="Service1Page q-ml-md">
                    <div class="row justify-center">
                      <q-table
                        style="width: 100%"
                        flat
                        id="StorageMeteringTable"
                        table-header-class="bg-grey-1 text-grey"
                        :rows="arrDetail"
                        :columns= "nginxLogColumns"
                        row-key="name"
                        color="primary"
                        :loading="isLoading"
                        :loading-label="'notifyLoading'"
                        :no-data-label="'noData'"
                        :rows-per-page-options="[15, 30, 50, 100, 150, 200, 0]"
                      >
                        <template v-slot:body="props">
                          <q-tr :props="props">
                            <q-td class="no-padding" key="time" :props="props">{{ date.formatDate(Number(props.row.time) / 1000000, 'YYYY-MM-DD HH:mm:ss') }}</q-td>
                            <q-td class="no-padding" key="scrIP" :props="props">{{ props.row.srcIP ? props.row.srcIP : '---' }}</q-td>
                            <q-td class="no-padding" key="srcTransportPort" :props="props" >{{ props.row.srcTransportPort ? props.row.srcTransportPort : '---'}}</q-td>
                            <q-td class="no-padding" key="transport" :props="props">{{ props.row.transport ? props.row. transport : '---'}}</q-td>
                            <q-td class="no-padding" key="dstIP" :props="props">{{ props.row.dstIP ? props.row. dstIP : '---' }}</q-td>
                            <q-td class="no-padding" key="dstTransportPort" :props="props">{{ props.row.dstTransportPort ? props.row. dstTransportPort : '---' }}</q-td>
                            <q-td class="no-padding" key="bytes" :props="props">{{ props.row.bytes ? props.row. bytes : '---'}}</q-td>
                            <q-td class="no-padding" key="direction" :props="props">{{ props.row.direction ? props.row.direction : '---' }}</q-td>
                            <q-td class="no-padding" key="ingressInterface" :props="props" >{{ props.row.ingressInterface ? props.row. ingressInterface : '---' }}</q-td>
                            <q-td class="no-padding" key="egressInterface" :props="props">{{ props.row.egressInterface ? props.row. egressInterface : '---' }}</q-td>
                            <q-td class="no-padding" key="bgpSrcAsNumber" :props="props">{{ props.row.bgpSrcAsNumber ? props.row. bgpSrcAsNumber : '---' }}</q-td>
                            <q-td class="no-padding" key="bgpDstAsNumber" :props="props">
                              {{ props.row.bgpSrcAsNumber ? props.row.bgpDstAsNumber : '---' }}
                            </q-td>
                            <q-td class="no-padding"  key="bgpNextHopAddress" :props="props">{{ props.row.bgpNextHopAddress ? props.row.bgpNextHopAddress : '---' }}</q-td>
                          </q-tr>
                        </template>
                        <template v-slot:top-right>
                          <div class="col-auto row items-center q-gutter-x-xs">
                          </div>
                        </template>
                      </q-table>
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
