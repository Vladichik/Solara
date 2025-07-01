<template>
  <section class="sol-orv-auth-screen bg-primary">
    <q-card class="q-pa-md sol-orv-anim-block">
      <div class="q-pt-md q-pl-lg q-pr-lg">
        <solara-logo />
      </div>
      <div class="sol-orv-progress-container">
        <q-linear-progress indeterminate class="sol-orv-progress" />
        <q-avatar class="absolute" color="primary" text-color="white">
          <q-spinner-bars
            color="white"
            size="1em"
          />
        </q-avatar>
      </div>
      <div class="q-pl-xl q-pr-xl sol-orv-cloud-frame">
        <cloud-icon />
      </div>
      <span class="sol-orv-msg">Connecting to Cloud...</span>
    </q-card>
  </section>
</template>

<script>
import { computed, defineComponent, onBeforeMount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import SolaraLogo from 'components/icons/SolaraLogo';
import CloudIcon from 'components/icons/CloudIcon';

import AuthAPI from 'src/api/authentication';

export default defineComponent({
  name: 'OrviboAuth',
  components: {
    SolaraLogo,
    CloudIcon,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const store = useStore();
    const user = computed(() => store.state.User.user);
    onBeforeMount(() => {
      setTimeout(async () => {
        debugger;
        await store.dispatch('User/getLoggedInUser');
        const loggedIn = await AuthAPI.orviboLogin(route.query.code);
        if (loggedIn.data && loggedIn.data.access_token) {
          AuthAPI.setOrviboToken(loggedIn.data);
          // Saving orvibo token in Solara database to give server access to the
          // user devices
          const userData = {
            ...user.value,
            orvibo_id: loggedIn.data.user_id,
            orvibo_token: `Bearer ${loggedIn.data.access_token}`,
            orvibo_token_exp: loggedIn.data.expires_in,
            orvibo_refresh_token: loggedIn.data.refresh_token,
          };
          await store.dispatch('User/updateUser', userData);
          await router.push('/home');
        }
      }, 1000);
    });
  },
});
</script>

<style lang="scss">
@import "src/css/mixins";

.sol-orv-progress-container,
.sol-orv-auth-screen,
.sol-orv-cloud-frame,
.sol-orv-msg {
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    z-index: 1;
  }
}

.sol-orv-auth-screen {
  width: 100%;
  height: 100%;
  padding: 10px;
}

.sol-orv-anim-block {
  width: 100%;
  height: 100%;
  max-width: 300px;
  max-height: 500px;
  @include setGrid(null, null, auto 1fr auto auto, null, "rows");
}

.sol-orv-progress {
  transform: rotate(90deg);
  width: 80%;
}
</style>
