<template>
  <section class="sol-auth-view bg-grey-4 full-height q-pr-lg q-pl-lg q-pb-md">
    <div class="sol-logo-frame">
      <solara-logo :height="50" />
    </div>
    <q-tab-panels
      v-model="activeTab"
      animated
      transition-prev="scale"
      transition-next="scale"
      class="sol-auth-panels bg-transparent"
    >
      <q-tab-panel v-for="panel in panels" :name="panel.name" :key="panel.name">
        <component :is="panel.componentName"
                   @set-tab="setActiveTab" />
      </q-tab-panel>
    </q-tab-panels>
    <preloader v-if="processing" />
  </section>
</template>

<script>
import { ref } from 'vue';
import { mapState } from 'vuex';
import Login from 'components/auth/Login';
import Signup from 'components/auth/Signup';
import Forgot from 'components/auth/Forgot';
import SolaraLogo from 'components/icons/SolaraLogo';

export default {
  name: 'AuthenticationLayout',
  components: {
    SolaraLogo,
    Login,
    Signup,
    Forgot,
  },
  setup() {
    const activeTab = ref('login');
    const panels = [
      {
        componentName: 'Login',
        name: 'login',
      },
      {
        componentName: 'Signup',
        name: 'signup',
      },
      {
        componentName: 'Forgot',
        name: 'forgot',
      },
    ];
    const setActiveTab = (aTab) => {
      activeTab.value = aTab;
    };
    return {
      activeTab,
      panels,
      setActiveTab,
    };
  },
  computed: {
    ...mapState({
      processing: (state) => state.Auth.processing,
    }),
  },
};
</script>

<style lang="scss">
@import "src/css/mixins";

.sol-auth-view {
  justify-items: center;
  @include setGrid(null, null, 100px 1fr, null, "rows");
}

.sol-auth-panels, .sol-logo-frame {
  max-width: 600px;
  width: 100%;
}

.sol-auth-form-grid {
  @include setGridAuto(auto, 10px, "rows");
}

.sol-logo-frame {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
