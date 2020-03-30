<template>
  <section>
    <div class="summary-section">
      <p class="paragraph-m" v-html="data"></p>
    </div>
  </section>
</template>

<script>
export default {
  props: {
    data: String
  }
};
</script>

<style lang="scss" scoped>
@import '~VariablesStyles';

div.summary-section {
  margin: 0 25px 25px 0;
  border-left: 2px solid $secondary;
  padding-left: 10px;
  /deep/ ul {
    list-style: disc outside;
  }
  /deep/ ol {
    list-style-position: outside;
  }
  /deep/ ul,
  /deep/ ol {
    margin-left: 40px;
  }
  /deep/ p {
    padding: 10px;
    &.paragraph-m {
      padding: 0;
    }
  }
}
</style>
