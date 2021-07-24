<template>
  <q-form class="sol-form-grid q-pt-md q-pb-md q-pr-lg q-pl-lg">
    <q-input square
             filled
             :label="$tm('account_info.first_name')"
             v-model="personalData.first_name" />
    <q-input square
             filled
             :label="$tm('account_info.last_name')"
             v-model="personalData.last_name" />
    <q-input square
             filled
             :label="$tm('account_info.phone_num')"
             v-model="personalData.phone" />
    <q-input square
             filled
             :label="$tm('email')"
             v-model="personalData.email" />
    <q-input square filled :label="$tm('account_info.birthday')"
             default-view="Years"
             v-model="personalData.birthday"
             mask="date" >
      <template v-slot:append>
        <q-icon name="event" class="cursor-pointer">
          <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
            <q-date v-model="personalData.birthday">
              <div class="row items-center justify-end">
                <q-btn v-close-popup label="Close" color="primary" flat />
              </div>
            </q-date>
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>
    <q-btn size="20px" color="primary" :label="$t('save')" @click="submit" />
  </q-form>
</template>

<script>
import { ref, reactive } from 'vue';

export default {
  setup() {
    const personalData = reactive({
      first_name: '',
      last_name: '',
      phone: '',
      email: '',
      birthday: null,
    });
    const submit = () => {
      console.log(personalData);
    };
    return {
      personalData,
      submit,
    };
  },
};
</script>

<style scoped>

</style>
