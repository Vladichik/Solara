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
    <div class="sol-forgot-pw-block">
      <q-btn flat dense no-caps @click="$emit('set-tab', 'forgot')">{{ $t('forgot_pw') }}</q-btn>
    </div>
    <q-btn class="q-mt-lg" color="primary" :label="$t('login')" type="submit" />
    <div class="sol-signup-block">
      <span class="text-grey-9">{{ $t('dont_have') }}</span>
      <span class="sol-signup-text text-blue-7 text-bold"
            @click="$emit('set-tab', 'signup')">{{ $t('sign_up_now') }}</span>
    </div>
  </q-form>
</template>

<script>
import { defineComponent } from 'vue';
import AuthAPI from 'src/api/authentication';

export default defineComponent({
  name: 'Login',
  data() {
    return {
      formData: {
        username: '',
        password: '',
        checked: false,
      },
    };
  },
  methods: {
    async login() {
      const logged = await AuthAPI.signIn({
        username: this.formData.username,
        password: this.formData.password,
      });
      debugger;
      console.log(logged);
    },
  },
});
</script>

<style lang="scss">
@import "src/css/mixins";

.sol-login-form {
  .q-field__bottom {
    padding: 5px 0 0 0 !important;
    cursor: pointer;
  }

  .sol-signup-block {
    font-size: 13px;
    justify-content: center;
    @include setGridAuto("auto", 7px, "columns");
  }

  .sol-signup-text {
    text-decoration: underline;
    cursor: pointer;
  }
}

.sol-forgot-pw-block {
  position: relative;

  button {
    position: absolute;
    padding: 0 5px;
    right: 0;
    bottom: 0;
  }
}

</style>
