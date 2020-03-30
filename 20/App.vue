<template>
  <div id="app" :class="appClasses" class="app">
    <div class="content-wrapper">
      <menu-container v-if="!$mq.phone"></menu-container>
      <router-view></router-view>
      <portal-target name="interested-modal-destination" multiple></portal-target>
    </div>
    <footer-container></footer-container>

  </div>
</template>

<script>

import 'hopscotch/dist/css/hopscotch.css';

import FooterContainer from 'top20common/containers/TheFooterContainer';
import {mapActions} from 'vuex';

import MenuContainer from '@/MenuContainer';
import tourMixin from '@/mixins/tourMixin';

export default {
  mixins: [tourMixin],
  created() {
    this.fetchFeatureSwitchesAction();
    this.$mam.setUTMTags();
  },
  computed: {
    appClasses() {
      return `${this.$route.name}-page`;
    }
  },
  methods: {
    ...mapActions(['fetchFeatureSwitchesAction'])
  },
  components: {
    MenuContainer,
    FooterContainer
  }
};
</script>

<style lang="scss">
@import '~CommonStyles/main.scss';
@import '~CommonStyles/extended/dropdown.scss';
@import '~CommonStyles/extended/button.scss';
@import '~CommonStyles/extended/tooltip.scss';
@import '~CommonStyles/extended/b-radio.scss';
@import '~CommonStyles/extended/tag.scss';
@import '~CommonStyles/extended/v-popover.scss';
@import '~CommonStyles/hopscotch.scss';
@import '~CommonStyles/typography.scss';

footer {
  background: $light-light-gray;
}

.candidate-page .mobile-footer {
  padding-top: 40px;
  padding-bottom: 70px;
}

@media (max-width: $desktop) {
  .top20-footer {
    margin-bottom: 50px;
  }
}
</style>
