<template>
  <q-form class="bg-transparent sol-auth-form-grid sol-login-form" @submit="login()">
    <q-input filled
             :placeholder="$t('email')"
             v-model="formData.username"
             :rules="[ val => val && val.length > 0 || $t('mandatory_field')]" />
    <q-input filled bottom-slots
             :placeholder="$t('pw')"
             type="password"
             v-model="formData.password"
             model-value=""
             :rules="[ val => val && val.length > 5 || $t('pw_mandatory')]" />
    <q-input filled bottom-slots
             :placeholder="$t('rp_pw')"
             type="password"
             v-model="formData.rep_password"
             model-value=""
             :rules="[ val => val && val.length > 5 && val === formData.password
             || $t('rp_pw_field_warn')]" />
    <div class="sol-terms-block">
      <q-checkbox size="lg"
                  keep-color
                  v-model="formData.checked"
                  :label="$t('i_accept')"
                  color="primary" />
      <router-link
        to="/authenticate"
        class="sol-signup-text text-blue-7 text-bold">{{ $t('terms') }}
      </router-link>
    </div>
    <q-btn class="q-mt-lg" color="primary" :label="$t('signup')" type="submit" />
  </q-form>
</template>

<script>
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'Signup',
  setup() {
    const formData = ref({
      username: '',
      password: '',
      rep_password: '',
      checked: false,
    });
    const signup = () => {
      console.log(formData);
      debugger;
    };
    return {
      formData,
      signup,
    };
  },
});
</script>

<style lang="scss">
@import "src/css/mixins";
</style>
