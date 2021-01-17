<template>
  <q-page>
    <div class="q-ma-md">
      <q-table
        :data="data"
        :columns="columns"
        row-key="name"
        dense
      />
    </div>
    <q-separator />
    <div class="row q-ma-md">
      <q-input
        class="col-8 q-pr-xs"
        label="Send Address"
        outlined
        v-model="address"
        dense
      >
      </q-input>
      <q-input
        class="col-4"
        label="Port"
        outlined
        v-model="port"
        dense
      >
      </q-input>
    </div>
    <div class="q-ma-md">
      <q-input
        label="Send Text"
        outlined
        v-model="text"
        @keyup.enter="sendMsg"
        dense
      >
        <template v-slot:append>
          <q-btn round dense flat icon="send" @click="sendMsg" />
        </template>
      </q-input>
    </div>
  </q-page>
</template>

<script>
import { ipcRenderer } from 'electron'

export default {
  name: 'PageIndex',
  data () {
    return {
      columns: [
        { name: 'createAt', label: 'Time', align: 'left', field: 'createAt', sortable: true },
        { name: 'from', label: 'From', field: 'from' },
        { name: 'msg', label: 'Message', align: 'left', field: 'msg' }
      ],
      data: [],
      text: '',
      address: '',
      port: ''
    }
  },
  mounted () {
    ipcRenderer.on('data', (event, data) => {
      console.log(data)
      this.data.push(data)
      console.log(this.data)
    })
    ipcRenderer.on('clear', (e) => {
      this.data = []
    })
  },
  methods: {
    sendMsg () {
      const msg = {
        ip: this.address,
        port: this.port,
        msg: this.text
      }
      ipcRenderer.send('sendMsg', msg)
    }
  }
}
</script>
