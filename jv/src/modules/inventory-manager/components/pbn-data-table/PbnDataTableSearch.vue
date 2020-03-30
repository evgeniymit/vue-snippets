<template>
  <div ref="search" class="search mr-5">
    <v-icon :color="iconColor" class="mr-3">mdi-magnify</v-icon>
    <RcTextField
      v-model="search"
      placeholder="Search"
      name="search"
      @input="debounceInput($event)"
      class="input"
    />
  </div>
</template>

<script>
import debounce from 'debounce';
import RcTextField from '@/components/form-controls/RcTextField.vue';

export default {
  name: 'PbnDataTableSearch',
  components: { RcTextField },
  data() {
    return {
      search: '',
      iconColor: '',
    };
  },
  methods: {
    // eslint-disable-next-line func-names
    debounceInput: debounce(function (e) {
      this.$store.commit('inventoryManager/updateSearchQueryState', e);
      this.$store.dispatch('inventoryManager/getPbnList')
        .then((query) => {
          this.$router.push({ query }).catch(err => err);
        });
    }, 300),
  },
  mounted() {
    this.iconColor = getComputedStyle(this.$refs.search)
      .getPropertyValue('--icon-color').trim();
    this.search = this.$store.getters['inventoryManager/getPbnFiltersState'].search;
  },
};
</script>

<style lang="scss" scoped>
@import '../../../../assets/styles/variables';
.search {
  display: flex;
  width: 330px;
  --icon-color: #{$primary};
  .input {
    flex: 1;
  }
}
</style>
