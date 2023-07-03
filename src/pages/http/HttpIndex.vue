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

const dnsQuery = ref<HttpCategroyQueryInterface>({})
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
const toggleSort = ref('forward')
const getLogInfoQuery = ref<getLogInfoTabListInterface>({
  direction: 'forward',
  // start: Math.floor(new Date(dateFrom.value + ' ' + timeFrom.value).getTime() * 1000000 - 1000000000),
  // end: Math.floor(new Date(dateFrom.value + ' ' + timeFrom.value).getTime()),
  start: 1688295600,
  end: 1688295600,
  instance: ''
})
// 动态目录
const test2: any = ref([])
let data1 = []
const getHttpCategroyList = async () => {
  const res1 = await aiops.log.http.getNetFlowType()
  const res = await aiops.log.http.getNetFlowList()
  bigTabList.value = res1.data.results
  const data = res.data.results.filter((item) => item.host_type === 1)
  data1 = res.data.results
  test2.value = data
  activeItem.value = bigTabList.value[0].name
  activeItem2.value = data1[0].name
  console.log(activeItem2.value)
  // getLogInfoQuery.value.instance = res.data.results[0].source_ip
  getLogInfoQuery.value.instance = '159.226.8.138'

  // await aiops.log.http.getlogcategory({ query: dnsQuery.value }).then((res) => {
  // bigTabList.value = res.data.results
  // test1.value = bigTabList.value[0].desc_name

  // })
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

// nginx 解析
// class LogInfoInterface {
//   creation_time: string | undefined
//   user_ip: string | undefined
//   real_ip: string | undefined
//   request_info: string | undefined
//   upload_stream: number | undefined
//   down_stream: number | undefined
//   status: number | undefined
//
//   constructor (creationTime: string, remoteIp: string, localIp: string, requestInfo: string, uploadStream: number, downStream: number, status: number) {
//     this.creation_time = creationTime
//     this.user_ip = remoteIp
//     this.real_ip = localIp
//     this.request_info = requestInfo
//     this.upload_stream = uploadStream
//     this.down_stream = downStream
//     this.status = status
//   }
// }

const arrObsLog: any = ref([])

// eslint-disable-next-line @typescript-eslint/no-empty-function
const result = ref()
// function loadEachInfo (logInfo: string) {
//   console.log('wqeqweqw', logInfo)
// eslint-disable-next-line camelcase
// const infoArray = logInfo.split(' ')
// const info: LogInfoInterface = {
//   creation_time: infoArray[1] + infoArray[2],
//   real_ip: infoArray[0],
//   user_ip: infoArray[3],
//   request_info: infoArray[9],
//   upload_stream: Number(infoArray[5]),
//   down_stream: Number(infoArray[6]),
//   status: Number(infoArray[4])
// }
// arrObsLog.value.push(info)
// }

// 数据表字段设计
const nginxLogColumns = computed(() => [
  { name: 'netflow', label: '网络流信息', align: 'center' }
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

const nginxLogTableRow = ref<resultInterface[]>()
const chartData = ref([])
const dateStampStr = Number(new Date(new Date().toLocaleDateString()).getTime()) / 1000
let smallIndex = 0
let startTimeFormatter = dateStampStr
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
const changeSort = async (type: string) => {
  getLogInfoQuery.value.direction = toggleSort.value
  // getLogInfoQuery.value.app_id = test2.value.website[smallIndex].idx
  arrObsLog.value = []
  await getObsloginfo()
}
const getObsloginfo = async () => {
  const tableRes = await aiops.log.http.getNetFlowLog({ query: getLogInfoQuery.value })
  console.log('ssssssssss', tableRes)
  // result.value = tableRes.data
  paginationTable.value.count = tableRes.data.count
  // arrObsLog.value = tableRes.data.result
  tableRes.data.result.forEach((item) => {
    arrObsLog.value.push({ netflow: item[1] })
  })
  console.log('22222', arrObsLog.value)
  // loadObsInfo(result.value.results)
}
// function loadObsInfo (res: any): void {
//   console.log('321312312', res)
// }
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
  getLogInfoQuery.value.start = startString.value * 1000000
  getLogInfoQuery.value.end = Math.floor(endString.value.getTime() * 1000000)
  arrObsLog.value = []
  await aiops.log.http.getlogappinfo({ query: getLogInfoQuery.value }).then((res) => {
    // result.value = res.data
    // loadObsInfo(result.value)
  })
}
const changeData = () => {
  const formattedString = date.formatDate(dateFrom.value, 'X')
  startTimeFormatter = Number(formattedString) - 28800
}
const getTrendChartData = async (start: number, hostId: string) => {
  mapRef.value.chartStartLoading()
  const trendRes = await aiops.log.http.getNetFlowStatistics({ query: { start, host: hostId } })
  trendRes.data.results.forEach((item) => {
    chartData.value.unshift(item.count)
  })
  mapRef.value.chartStopLoading()
}
const search1 = () => {
  chartData.value = []
  getTrendChartData(startTimeFormatter, test2.value.website[smallIndex].id)
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
      symbol: 'none',
      data: chartData.value
    }
  ]
}))
const changeBigTabIndex = (index: number, descname: string) => {
  console.log(index)
  chartData.value = []
  // index1.value = index
  // activeItem.value = descname
  test1.value = descname
  // Object.assign(test2.value, bigTabList?.value[index])
  test2.value = data1.filter((item) => item.host_type === index + 1)
  // test2.value = bigTabList.value[index]
  console.log(test2.value)
  activeItem2.value = test2.value[0].name
  getTrendChartData(dateStampStr, test2.value[smallIndex].id)
}
const changeSmallTab = async (name: string, id: string, index: number) => {
  chartData.value = []
  smallIndex = index
  activeItem2.value = name
  getLogInfoQuery.value.app_id = id
  arrObsLog.value = []
  await getObsloginfo()
  await getTrendChartData(startTimeFormatter, id)
}
onMounted(async () => {
  chartData.value = []
  await getHttpCategroyList()
  await getObsloginfo()
  // loadObsInfo(result)
  await getDayAll(dateFrom.value.toString() + ' ' + '00:00:00', dateFrom.value.toString() + ' ' + '23:59:59')
  await getTrendChartData(dateStampStr, test2.value[smallIndex].id)
  // const chartDom = document.getElementById('main')!
  // const myChart = echarts.init(chartDom)
  // await myChart.setOption(option)
  // option && myChart.setOption(option)
  // myChart.resize({
  //   width: 1230,
  //   height: 400
  // })
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
                    <q-tab no-caps v-for=" (item, index) in bigTabList" :key="index" :label="item.name"
                           :name="item.name" class="q-px-none q-py-md q-mr-md" :ripple="false"
                           @click="changeBigTabIndex(index,item.name)" style="width: 13%">
                    </q-tab>
                  </q-tabs>
                </div>
              </div>
              <q-separator/>
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
                            <q-time v-model="dateFrom" format24h @update:model-value="checkdate(dateFrom)"
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
                  style="width: 16%"
                >
                  <q-tab :activeItem2="item1.name" :name="item1.name" v-for=" (item1, index2) in  test2"
                         class="q-px-none q-py-md q-mr-md" :ripple="false" :label="item1.name"
                         @click="changeSmallTab(item1.name, item1.id, index2)"
                         :key="index2" no-caps>
                  </q-tab>
                </q-tabs>
                <div style="width: 84%">
                  <div class="Service1Page q-ml-md">
                    <div class="row justify-center">
                      <q-card flat bordered class="my-card col">
                        <q-card-section class="text-center">
                          网络流信息
                        </q-card-section>
                        <q-separator/>
                        <q-card-section v-for="(item, index) in arrObsLog" :key="index" class="">
                            <div class="" style=" word-wrap: break-word;">
                              {{ item.netflow }}
                            </div>
                          <q-separator class="col q-mt-md"/>
                        </q-card-section>
                      </q-card>
<!--                      <q-table-->
<!--                        style="width: 100%"-->
<!--                        flat-->
<!--                        class="row col-20  justify-start  q-pl-md "-->
<!--                        id="StorageMeteringTable"-->
<!--                        card-class="no-padding"-->
<!--                        table-header-class="bg-grey-1 text-grey"-->
<!--                        :rows="arrObsLog"-->
<!--                        :columns="nginxLogColumns"-->
<!--                        row-key="name"-->
<!--                        color="primary"-->
<!--                        :loading-label="'notifyLoading'"-->
<!--                        :no-data-label="'noData'"-->
<!--                        hide-pagination-->
<!--                        v-model:pagination="paginationTable"-->
<!--                        :pagination="{ rowsPerPage: 0 }"-->
<!--                      >-->
<!--                        <template v-slot:body="props">-->
<!--                          <q-tr :props="props">-->
<!--&lt;!&ndash;                            <q-td class="no-padding" key="netflow" :props="props">&ndash;&gt;-->
<!--&lt;!&ndash;                              {{ props }}1111111111111111&ndash;&gt;-->
<!--&lt;!&ndash;                            </q-td>&ndash;&gt;-->
<!--                            <q-td class="no-padding" key="netflow" :props="props">-->
<!--                              {{ props.row.netfolw }}-->
<!--                            </q-td>-->
<!--&lt;!&ndash;                            <q-td :class="['my-table-cell']" class="no-padding" key="creation_time" :props="props">&ndash;&gt;-->
<!--&lt;!&ndash;                              {{ fromatTime(props.row.creation_time.slice(1, -1)) }}&ndash;&gt;-->
<!--&lt;!&ndash;                            </q-td>&ndash;&gt;-->
<!--&lt;!&ndash;                            <q-td :class="['my-table-cell']" class="no-padding" key="remote_ip" :props="props"&ndash;&gt;-->
<!--&lt;!&ndash;                                  style="white-space:normal;">{{ props.row.user_ip }}&ndash;&gt;-->
<!--&lt;!&ndash;                            </q-td>&ndash;&gt;-->
<!--&lt;!&ndash;                            <q-td :class="['my-table-cell']" class="no-padding" key="local_ip" :props="props">&ndash;&gt;-->
<!--&lt;!&ndash;                              {{ props.row.real_ip }}&ndash;&gt;-->
<!--&lt;!&ndash;                            </q-td>&ndash;&gt;-->
<!--&lt;!&ndash;                            <q-td :class="['my-table-cell']" class="no-padding" key="upload_stream" :props="props">&ndash;&gt;-->
<!--&lt;!&ndash;                              {{ props.row.upload_stream }}&ndash;&gt;-->
<!--&lt;!&ndash;                            </q-td>&ndash;&gt;-->
<!--&lt;!&ndash;                            <q-td :class="['my-table-cell']" class="no-padding" key="down_stream" :props="props">&ndash;&gt;-->
<!--&lt;!&ndash;                              {{ props.row.down_stream }}&ndash;&gt;-->
<!--&lt;!&ndash;                            </q-td>&ndash;&gt;-->
<!--&lt;!&ndash;                            <q-td :class="['my-table-cell']" class="no-padding" key="status" :props="props">&ndash;&gt;-->
<!--&lt;!&ndash;                              {{ props.row.status }}&ndash;&gt;-->
<!--&lt;!&ndash;                            </q-td>&ndash;&gt;-->
<!--&lt;!&ndash;                            <q-td :class="['my-table-cell1']" class="no-padding" key="request_info" :props="props"&ndash;&gt;-->
<!--&lt;!&ndash;                                  style="white-space:normal;word-break:break-all;word-wrap:break-word;">&ndash;&gt;-->
<!--&lt;!&ndash;                              {{ props.row.request_info }}&ndash;&gt;-->
<!--&lt;!&ndash;                            </q-td>&ndash;&gt;-->
<!--                          </q-tr>-->
<!--                        </template>-->
<!--                        <template v-slot:top-right>-->
<!--                          <div class="col-auto row items-center q-gutter-x-xs">-->
<!--                          </div>-->
<!--                        </template>-->
<!--                      </q-table>-->
                    </div>
                    <div class="text-grey q-mt-lg row justify-start q-mb-lg">
                      <div class="row col-12  justify-start ">
                        <div class="col-4 row items-center">
                          <div>
                            <span>共</span>
                            <span class="text-subtitle1 q-px-xs text-weight-bold">{{ paginationTable.count }}</span>
                            <span>条数据</span>
                          </div>
                          <div class="row q-ml-md items-center">
                            <span>每页</span>
                            <q-select color="grey" v-model="paginationTable.rowsPerPage" :options="[100,200,300]" dense
                                      options-dense
                                      borderless @update:model-value="changePageSize">
                            </q-select>
                            <span>条</span>
                          </div>
                        </div>
                        <q-pagination
                          v-model="paginationTable.page"
                          :max="Math.ceil(paginationTable.count/paginationTable.rowsPerPage)"
                          :max-pages="12"
                          direction-links
                          outline
                          :ripple="false"
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
