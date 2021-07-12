<template>
  <q-layout view="hhh lpR fFf">

    <q-header class="bg-primary text-white" height-hint="98">
      <q-toolbar>
<!--        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />-->
        <q-toolbar-title>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg">
          </q-avatar>
          Solara
        </q-toolbar-title>
      </q-toolbar>

      <q-tabs align="left" narrow-indicator>
        <q-route-tab no-caps
                     v-for="r in $tm('main_tabs')"
                     :to="r.route"
                     :label="r.name"
                     :icon="r.icon"
                     :key="r.route" />
      </q-tabs>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" side="left" overlay>
      sdfgsdfg
      sdfgsdfg
      sdfgsdfg
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script>
import { ref } from 'vue';

export default {
  setup() {
    const leftDrawerOpen = ref(false);

    const toggleLeftDrawer = () => {
      leftDrawerOpen.value = !leftDrawerOpen.value;
    };

    return {
      leftDrawerOpen,
      toggleLeftDrawer,
    };
  },
};
</script>
