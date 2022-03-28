<template>
  <q-layout view="hHh lpR fFf" class="sol-main-frame">
    <q-header class="bg-white text-primary shadow-1" height-hint="98">
      <q-toolbar>
        <q-toolbar-title>
          <solara-logo width="120" height="40" class="q-mt-sm" />
        </q-toolbar-title>
      </q-toolbar>

      <q-tabs align="left" narrow-indicator>
        <q-route-tab no-caps
                     v-for="r in $tm('main_tabs')"
                     :to="r.route"
                     :label="r.name"
                     :icon="r.icon"
                     :key="r.route"
                     @click='onTabPressed()' />
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
    <splash-screen />
    <preloader v-if="processing" fixed />
  </q-layout>
</template>

<script>
import { ref, onBeforeMount, computed } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import SolaraLogo from 'components/icons/SolaraLogo';
import SplashScreen from 'components/splash/SplashScreen';
import bus from 'vue3-eventbus';

export default {
  components: {
    SolaraLogo,
    SplashScreen,
  },
  setup(props, { emit }) {
    const store = useStore();
    const route = useRoute();
    const processing = computed(() => store.state.General.processing);
    const leftDrawerOpen = ref(false);

    const toggleLeftDrawer = () => {
      leftDrawerOpen.value = !leftDrawerOpen.value;
    };

    const onTabPressed = () => {
      bus.emit('closeNav');
    };

    onBeforeMount(async () => {
      store.commit('General/setMainLoaderState', true);
      await store.dispatch('User/getLoggedInUser');
      await store.dispatch('Devices/getMyDevicesFromOrvibo');
      await store.dispatch('Devices/getMyDevices');
      await store.dispatch('Addresses/getDeviceAddresses');
      store.commit('General/setMainLoaderState', false);
    });

    return {
      processing,
      leftDrawerOpen,
      toggleLeftDrawer,
      onTabPressed,
    };
  },
};
</script>
