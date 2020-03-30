<template>
  <div class="contact-description">
    <highlighted-text-block>
      {{ description }}
    </highlighted-text-block>
    <div v-translate class="description">
      If you want to schedule an interview directly, or find out more information about this candidate, use the form below.
    </div>
  </div>
</template>

<script>

import HighlightedTextBlock from 'top20common/components/text-blocks/HighlightedTextBlock';

export default {
  props: {
    description: String
  },
  components: {HighlightedTextBlock}
};
</script>

<style lang="scss" scoped>
.description {
  margin-bottom: 15px;
}
</style>
