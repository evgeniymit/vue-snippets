<template>
<div v-show="show" :style="boxPositionStyle" ref="clickOut" class="wrapper rc-popup-box">
  <RcTextField
    v-if="valueType === 'text'"
    :label="label"
    v-model="value"
    :name="label"
    placeholder="New value"
    @enter-pressed="save()"
  />
  <div v-if="valueType === 'select'" class="select mt-5">
    <RcDropDownField
      title="Niche"
      label="name"
      :options="options"
      @selected="onSelect($event)"
    />
  </div>
  <button class="rc primary" :disabled="!value" @click="save()">Save</button>
</div>
</template>

<script>
import clickOut from '@/mixins/clickOut';
import RcTextField from '@/components/form-controls/RcTextField.vue';
import RcDropDownField from '@/components/form-controls/RcDropDownField.vue';

export default {
  name: 'PbnDataTableInlineEditPopup',
  components: { RcTextField, RcDropDownField },
  mixins: [clickOut],
  props: {
    label: String,
    valueType: {
      type: String,
      default: 'text',
    },
    show: Boolean,
    position: Object,
    options: Array,
  },
  data() {
    return {
      value: '',
      clickOutReferenceName: 'clickOut',
    };
  },
  computed: {
    boxPositionStyle() {
      return {
        top: `${this.position.y}px`,
        left: `${this.position.x}px`,
      };
    },
  },
  methods: {
    save() {
      this.$emit('update', this.value);
    },
    onSelect(event) {
      this.value = event.id;
    },
    onClickOut() {
      if (this.show) {
        this.$emit('dismiss');
      }
    },
  },
};
</script>

<style lang="scss" scoped>
  .wrapper {
    width: 300px;
    padding: 16px 10px;
    position: absolute;

    button {
      height: 26px;
      padding: 5px 30px;
      display: block;
      margin: auto;
    }
  }
  .select {
    margin-bottom: 130px;
  }
</style>
