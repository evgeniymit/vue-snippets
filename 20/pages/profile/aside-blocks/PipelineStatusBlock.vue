<template>
  <div class="pipeline-flex-row">
    <div class="pipeline-flex-item">
      <slot name="icon"></slot>
    </div>
    <div class="pipeline-flex-item word-wrap">
      <div class="pipeline-title">
        <p class="pipeline-header">{{ title }}</p>
        <p class="small">
          <slot name="content"></slot>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: String
  }
};
</script>

<style lang="scss" scoped>
.pipeline-flex-row {
  padding-top: 21px;
  display: flex;
  align-items: flex-start;
  &:first-of-type {
    padding-top: 14.5px;
  }
  .pipeline-flex-item:last-of-type {
    padding-left: 10px;
    padding-top: 2px;
  }

  .pipeline-header {
    font-weight: 500;
    line-height: 1.4;
  }
  .word-wrap {
    width: 90%;
    word-wrap: break-word;
  }
}
</style>
