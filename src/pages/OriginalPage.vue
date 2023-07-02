<script setup lang="ts">
import { ref, computed, nextTick, onMounted } from 'vue'
import api from 'src/api'
import aiops from 'src/api/aiops'

const detail = ref('')
const OriginAlertResultInfo = ref()
const SwitchID = ref()
const SwitchName = ref()
// details
const Time = ref()
const srcIP = ref()
const scrTransportPort = ref()
const transport = ref()
const dstIP = ref()
const dstTransportPort = ref()
const bytes = ref()
const direction = ref()
const ingressInterface = ref()
const egressInterface = ref()
const bgpSrcAsNumber = ref()
const bgpDstAsNumber = ref()
const bgpNextHopAddress = ref()

const date = new Date()
const timestamp = date.getTime() / 1000
const onday = 60 * 60 * 24
const beforeTime = timestamp - onday
const queryInfo = ref({
  start: beforeTime,
  end: timestamp,
  instance: '2.00.3',
  direction: 'front'
})
// const getNetflow = async () => {
//   await aiops.login.alert.getNetflowLog({ query: queryInfo.value }).then((res) => {
//     OriginAlertResultInfo.value = res.data.results
//     paginationTable.value.count = res.data.count
//   })
// }

interface NetflowInterface {
  start: number
  end: number
  instance: string
  direction?: string
  limit?: number
}
const getNetflowlist = async () => {
  const resplist = await api.aiops.netflow.getNetflowNodeList()
  const results = resplist.data.results
  SwitchID.value = results[0].id
  SwitchName.value = results[0].name
  console.log('resplist:', resplist.data)
  console.log('id:', results[0].id)
  // const result = resp.data.result
  // console.log(result)
  // detail.value = resp.data.result.host_ip
  //
  // console.log('hell:', detail.value)
}
getNetflowlist()
const getNetflow = async () => {
  const resp = await api.aiops.netflow.getNetflowStatistics({ query: { host_id: SwitchID.value } })
  console.log('helloo:', resp.data)
}
// 详细信息
const logTab = async () => {
  const logRes = await api.aiops.netflow.getNetflowLog(
    {
      query: {
        instance: '159.226.8.145',
        start: 1688112700,
        end: 1688112766
      }
    })
  detail.value = JSON.parse(logRes.data.result[0][1])
  Time.value = logRes.data.result[0][0]
  srcIP.value = JSON.parse(logRes.data.result[0][1]).srcIP
  scrTransportPort.value = JSON.parse(logRes.data.result[0][1]).scrTransportPort
  transport.value = JSON.parse(logRes.data.result[0][1]).network.transport//
  dstIP.value = JSON.parse(logRes.data.result[0][1]).dstIP
  dstTransportPort.value = JSON.parse(logRes.data.result[0][1]).dstTransportPort
  bytes.value = JSON.parse(logRes.data.result[0][1]).network.bytes//
  direction.value = JSON.parse(logRes.data.result[0][1]).network.direction//
  ingressInterface.value = JSON.parse(logRes.data.result[0][1]).ingressInterface
  egressInterface.value = JSON.parse(logRes.data.result[0][1]).egressInterface
  bgpSrcAsNumber.value = JSON.parse(logRes.data.result[0][1]).bgpSrcAsNumber
  bgpDstAsNumber.value = JSON.parse(logRes.data.result[0][1]).bgpDstAsNumber
  bgpNextHopAddress.value = JSON.parse(logRes.data.result[0][1]).bgpNextHopAddress
  console.log('data:', logRes.data)
  console.log('dataJSON:', JSON.parse(logRes.data.result[0][1]))
  console.log('time:', Time.value)
  console.log('srcIP:', srcIP.value)
  console.log('transport:', transport.value)
}

// getNetflow()
logTab()

const startTime = ref('2022-02-01 12:44')
const endTime = ref('2023-06-01 12:44')

const categoryOptions = [
  {
    value: 'host',
    label: '主机',
    labelEn: 'host'
  },
  {
    value: 'switch',
    label: '交换机',
    labelEn: 'switch'
  },
  {
    value: 'firewall',
    label: '防火墙',
    labelEn: 'firewall'
  },
  {
    value: 'f5',
    label: 'F5负载均衡',
    labelEn: 'f5'
  },
  {
    value: 'vpn',
    label: 'VPN',
    labelEn: 'VPN'
  },
  {
    value: 'tomcat',
    label: 'Tomcat',
    labelEn: 'Tomcat'
  },
  {
    value: 'nginx',
    label: 'Nginx',
    labelEn: 'Nginx'
  },
  {
    value: 'mysql',
    label: 'MySQL',
    labelEn: 'MySQL'
  }
]

// 源IP地址、目标IP地址、端口号、数据包大小等
const columns = [
  {
    name: 'index',
    label: '#',
    field: 'index'
  },
  {
    name: 'name',
    required: true,
    label: '时间',
    align: 'left',
    field: (row: { name: any }) => row.name,
    format: (val: any) => val,
    sortable: true
  },
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
]

const seed = [
  {
    name: Time.value,
    scrIP: 111111111111111,
    srcTransportPort: scrTransportPort.value,
    transport: transport.value,
    dstIP: dstIP.value,
    dstTransportPort: dstTransportPort.value,
    bytes: bytes.value,
    direction: direction.value,
    ingressInterface: ingressInterface.value,
    egressInterface: egressInterface.value,
    bgpSrcAsNumber: bgpSrcAsNumber.value,
    bgpDstAsNumber: bgpDstAsNumber.value,
    bgpNextHopAddress: bgpNextHopAddress.value
  },
  {
    name: Time.value,
    scrIP: srcIP.value,
    srcTransportPort: scrTransportPort.value,
    transport: transport.value,
    dstIP: dstIP.value,
    dstTransportPort: dstTransportPort.value,
    bytes: bytes.value,
    direction: direction.value,
    ingressInterface: ingressInterface.value,
    egressInterface: egressInterface.value,
    bgpSrcAsNumber: bgpSrcAsNumber.value,
    bgpDstAsNumber: bgpDstAsNumber.value,
    bgpNextHopAddress: bgpNextHopAddress.value
  },
  {
    name: Time.value,
    scrIP: srcIP.value,
    srcTransportPort: scrTransportPort.value,
    transport: transport.value,
    dstIP: dstIP.value,
    dstTransportPort: dstTransportPort.value,
    bytes: bytes.value,
    direction: direction.value,
    ingressInterface: ingressInterface.value,
    egressInterface: egressInterface.value,
    bgpSrcAsNumber: bgpSrcAsNumber.value,
    bgpDstAsNumber: bgpDstAsNumber.value,
    bgpNextHopAddress: bgpNextHopAddress.value
  },
  {
    name: Time.value,
    scrIP: srcIP.value,
    srcTransportPort: scrTransportPort.value,
    transport: transport.value,
    dstIP: dstIP.value,
    dstTransportPort: dstTransportPort.value,
    bytes: bytes.value,
    direction: direction.value,
    ingressInterface: ingressInterface.value,
    egressInterface: egressInterface.value,
    bgpSrcAsNumber: bgpSrcAsNumber.value,
    bgpDstAsNumber: bgpDstAsNumber.value,
    bgpNextHopAddress: bgpNextHopAddress.value
  }
  // {
  //   name: '2023年6月8日21:00',
  //   scrIP: '192.168.1.1',
  //   srcTransportPort: '10.0.0.1',
  //   bytes: 37,
  //   packetSize: 4.3
  // },
  // {
  //   name: '2023年6月8日21:00',
  //   scrIP: '192.168.1.1',
  //   srcTransportPort: '10.0.0.1',
  //   bytes: 22,
  //   packetSize: 6.0
  // },
  // {
  //   name: '2023年6月8日21:10',
  //   scrIP: '192.168.1.1',
  //   srcTransportPort: '10.0.0.1',
  //   bytes: 67,
  //   packetSize: 4.3
  // },
]

// we generate lots of rows here
let allRows: any[] = []
for (let i = 0; i < 1000; i++) {
  allRows = allRows.concat(seed.slice(0).map(r => ({ ...r })))
}
allRows.forEach((row, index) => {
  row.index = index
})

const pageSize = 50
const lastPage = Math.ceil(allRows.length / pageSize)

const nextPage = ref(2)
const loading = ref(false)

const rows = computed(() => allRows.slice(0, pageSize * (nextPage.value - 1)))

const pagination = { rowsPerPage: 0 }

const onScroll = ({ to, ref }) => {
  const lastIndex = rows.value.length - 1

  if (loading.value !== true && nextPage.value < lastPage && to === lastIndex) {
    loading.value = true

    setTimeout(() => {
      nextPage.value++
      nextTick(() => {
        ref.refresh()
        loading.value = false
      })
    }, 500)
  }
}
onMounted(async () => {
  await getNetflowlist()
  await getNetflow()
})

</script>

<template>
  <div class="MailSystemList">

    {{ detail }}

    <div class="row justify-between q-mt-md">
      <div class="row col-3 items-center justify-between">
        <div class="text-subtitle1">交换机</div>
        <q-select outlined dense v-model="unitQuery" :options="categoryOptions" label="请选择" class="col-9"
                  @update:model-value="getUnitList"/>
      </div>
      <div class="row items-center">
        <div class="text-subtitle1">时间选择</div>
        <q-input filled dense v-model="startTime" class="q-ml-md">
          <template v-slot:prepend>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-date v-model="startTime" mask="YYYY-MM-DD HH:mm" @update:model-value="changeTime">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat/>
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
          <template v-slot:append>
            <q-icon name="access_time" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-time v-model="startTime" mask="YYYY-MM-DD HH:mm" format24h @update:model-value="changeTime">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat/>
                  </div>
                </q-time>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
        <div class="q-ml-md">一</div>
        <q-input filled dense v-model="endTime" class="q-ml-md">
          <template v-slot:prepend>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-date v-model="endTime" mask="YYYY-MM-DD HH:mm" @update:model-value="changeTime">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat/>
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
          <template v-slot:append>
            <q-icon name="access_time" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-time v-model="endTime" mask="YYYY-MM-DD HH:mm" format24h @update:model-value="changeTime">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat/>
                  </div>
                </q-time>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>
    </div>
    <div class="q-pa-md">
      <q-table
        class="my-sticky-dynamic"
        flat bordered
        title="原始网络流数据的相关信息"
        :rows="rows"
        :columns="columns"
        :loading="loading"
        row-key="index"
        virtual-scroll
        :virtual-scroll-item-size="48"
        :virtual-scroll-sticky-size-start="48"
        :pagination="pagination"
        :rows-per-page-options="[0]"
        @virtual-scroll="onScroll"
      />
    </div>
  </div>
</template>

<style lang="sass">
.my-sticky-dynamic
  ///* height or max-height is important */
  height: 500px

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th
    ///* bg color is important for th; just specify one */
    //   background-color: #F5DEB3

  thead tr th
    position: sticky
    z-index: 1
  ///* this will be the loading indicator */

  thead tr:last-child th
    ///* height of all previous header rows */
    top: 40px

  thead tr:first-child th
    top: 0

  ///* prevent scrolling behind sticky top row on focus */

  tbody
    ///* height of all previous header rows */
    scroll-margin-top: 48px
</style>
