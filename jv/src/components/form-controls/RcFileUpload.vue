<template>
  <div class="wrapper" @drop.prevent="upload($event.dataTransfer.files)" @gragover.prevent>
    <h2 class="rc-table-text">Drag and drop here</h2>
    <h2 class="rc-table-text grey--text">or</h2>
    <button class="rc malibu mt-4">
      <input type="file" @change="upload($event.target.files)"/>
      Choose file
    </button>
    <div class="borders">
      <div class="top"></div>
      <div class="bottom"></div>
      <div class="left"></div>
      <div class="right"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RcFileUpload.vue',
  props: {
    uploadFile: Function,
  },
  methods: {
    upload(e) {
      this.$emit('file-update', e);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../../assets/styles/variables';

.wrapper {
  --drop-zone-width: 580px;
  --drop-zone-height: 320px;
  height: var(--drop-zone-height);
  width: var(--drop-zone-width);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  margin-top: 60px;
}
button {
  padding: 5px 15px;
  width: 144px;
  position: relative;
  input {
    opacity: 0;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    max-width: 100%;
    height: 26px;
  }
}
.borders {
  > div {
    position: absolute;
  }
  .top, .bottom {
    width: var(--drop-zone-width);
    height: 1px;
    background: repeating-linear-gradient(0.25turn, $malibu, $malibu 4px, $white 4px, $white 8px);
  }
  .left, .right {
    height: var(--drop-zone-height);
    width: 1px;
    background: repeating-linear-gradient($malibu, $malibu 4px, $white 4px, $white 8px);
  }
  .top {
    bottom: var(--drop-zone-height);
    left: 0;
  }
  .bottom {
    bottom: 0;
    left: 0;
  }
  .left {
    left: 0;
    bottom: 0;
  }
  .right {
    right: 0;
    bottom: 0;
  }
}
</style>
