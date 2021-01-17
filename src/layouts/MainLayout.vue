<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar class="bg-blue-grey-10">
        <q-toolbar-title>
          Multicast Test Tool
        </q-toolbar-title>
        <q-input
          class="q-mx-sm"
          dark
          color="blue-grey-6"
          dense
          outlined
          v-model="ip"
          label="IP"
        >
        </q-input>
        <q-input
          class="q-mx-sm"
          dark
          color="blue-grey-6"
          dense
          outlined
          v-model="port"
          label="Port"
        >
        </q-input>
        <q-btn
          class="q-mx-sm"
          :loading="connect"
          color="blue-grey-6"
          @click="connectNetwork"
        >
          Connect
          <template v-slot:loading>
            <q-spinner-gears />
          </template>
        </q-btn>
        <q-btn
          class="q-mx-sm"
          color="red"
          @click="disconnectNetwork"
        >
          Stop
        </q-btn>
        <q-btn
          class="q-mx-sm"
          color="green"
          @click="clear"
        >
          Clear
        </q-btn>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { ipcRenderer } from 'electron'

export default {
  name: 'MainLayout',
  data () {
    return {
      connect: false,
      ip: '',
      port: ''
    }
  },
  methods: {
    connectNetwork () {
      this.connect = true
      const address = {
        ip: this.ip,
        port: this.port
      }
      ipcRenderer.send('onConnect', address)
    },
    disconnectNetwork () {
      this.connect = false
      ipcRenderer.send('disConnect')
    },
    clear () {
      ipcRenderer.send('clear')
    }
  }
}
</script>
