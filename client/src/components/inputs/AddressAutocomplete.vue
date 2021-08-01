<template>
  <q-select filled
            class="sc-address-autocomplete"
            color="primary"
            :disable="disable"
            use-input
            fill-input
            option-value="val"
            option-label="place_name"
            :model-value="model.address"
            @update:model-value="selectAddress"
            @input-value="getResults"
            :options="options"
            ref="addressAutocomplete"
            :loading="gettingResults"
            :placeholder="$t('address')" />
</template>

<script>
import { debounce } from 'quasar';
import MapboxAPI from 'src/api/mapbox';

export default {
  name: 'Autocomplete',
  props: {
    model: {
      type: Object,
      required: true,
    },
    disable: {
      type: Boolean,
    },
  },
  data() {
    return {
      avoidQuery: false,
      options: [],
      getResults: null,
      gettingResults: false,
    };
  },
  mounted() {
    this.avoidQuery = true;
    // eslint-disable-next-line no-return-assign
    setTimeout(() => this.avoidQuery = false, 1000);
  },
  created() {
    /**
     * Мы инициализируем данную функцию здесь, а не в methods, потому что
     * только таким образом у нас есть доступ к контексту this изза дебаунса.
     * Синтаксис methods не позволяет написать функцию так, чтобы this был доатупен.
     * Функция запрашивающая варианты адресов из API MapBox согласно вписанному пользователем
     * тексту. После чего варианты добавляются в компонент select для выбора пользователем.
     * Влад. 10/12/20
     * @type {(function(*=): void) & {cancel(): void}}
     */
    this.getResults = debounce((val) => {
      if (val && val.length > 2 && !this.avoidQuery) {
        // eslint-disable-next-line vue/no-mutating-props
        this.model.address = val;
        this.gettingResults = true;
        MapboxAPI.getSuggestions(val)
          .then((addresses) => {
            this.options = null;
            if (addresses.data && addresses.data.features) {
              this.options = addresses.data.features;
              setTimeout(() => {
                this.gettingResults = false;
                this.$refs.addressAutocomplete.showPopup();
              }, 1000);
            } else {
              this.options = [];
            }
            // eslint-disable-next-line no-return-assign
          }).catch((e) => {
            this.getResults = false;
            this.options = null;
          });
      } else if (!val || val.length < 2) {
        this.options = [];
        // eslint-disable-next-line vue/no-mutating-props
        this.model.address = '';
      }
    }, 1000);
  },
  methods: {
    selectAddress(v) {
      const self = this;
      this.avoidQuery = true;
      setTimeout(() => {
        self.avoidQuery = false;
      }, 1200);
      // eslint-disable-next-line vue/no-mutating-props
      this.model.address = v;
    },
  },
};
</script>

<style lang="scss">
.sc-address-autocomplete {
  .q-field__native span {
    display: none;
  }

  .q-select__dropdown-icon {
    display: none;
  }

  .q-field__control {
    font-size: 15px;
  }
}
</style>
