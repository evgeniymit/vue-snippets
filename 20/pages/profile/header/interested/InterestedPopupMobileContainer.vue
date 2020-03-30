<template>
  <modal-dialog width="100%" height="auto" name="interested-popup" @before-open="beforeOpen" @before-close="beforeClose">
    <div class="interested-popup-container mob">
      <h3 v-translate class="heading-3">Contact request sent.</h3>
      <highlighted-text-block>
        {{ description }}
      </highlighted-text-block>
      <button v-translate class="button is-accent-ghost is-pulled-right" @click="hideModal">Close</button>
    </div>
  </modal-dialog>
</template>

<script>

import ModalDialog from 'top20common/components/ModalDialog';
import HighlightedTextBlock from 'top20common/components/text-blocks/HighlightedTextBlock';

import InterestedPopupContainer from '@/pages/profile/header/interested/InterestedPopupContainer';

export default {
  extends: InterestedPopupContainer,
  components: {HighlightedTextBlock, ModalDialog}
};
</script>
