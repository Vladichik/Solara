<template>
  <q-form greedy class="bg-transparent sol-auth-form-grid sol-login-form" onsubmit="login()">
        <q-input filled
                 :placeholder="$t('email')"
                 v-model="formData.username" />
        <q-input filled bottom-slots
                 :placeholder="$t('pw')"
                 type="password"
                 v-model="formData.password" >
          <template v-slot:hint>
            <q-btn flat dense no-caps
                   @click="$emit('set-tab', 'forgot')">Forgot password</q-btn>
          </template>
        </q-input>
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

export default defineComponent({
  name: 'Login',
  data() {
    return {
      formData: {
        username: '',
        password: '',
      },
    };
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

</style>
