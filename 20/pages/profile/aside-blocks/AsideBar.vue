<template>
  <div>
    <div :class="{'is-collapsed' : collapsed }" class="items-list">
      <div v-for="item in items" class="items-item">
        <div class="item-title is-capitalized">{{ item.name || item }}</div>
        <progress v-if="showProgressBar" :value="Number(item.level)" max="100" class="progress">
          {{ Number(item.level) }}%
        </progress>
      </div>
    </div>
    <a v-if="isAdditionalItemsExist" class="show-wrapper" @click="collapseItems">
      <p class="paragraph-s">{{ getIconTitle }}</p>
      <svg-icon :name="getIconName" width="12" height="12"></svg-icon>
    </a>
  </div>
</template>

<script>

import 'top20common/distribution/icons/arrow-show-more';
import 'top20common/distribution/icons/arrow-show-less';

export default {
  props: {
    items: Array,
    showProgressBar: Boolean
  },
  data() {
    return {
      collapsed: true
    };
  },
  computed: {
    isAdditionalItemsExist() {
      return this.items.length > 5;
    },
    getIconName() {
      return this.collapsed ? 'arrow-show-more' : 'arrow-show-less';
    },
    getIconTitle() {
      return this.collapsed ? this.$gettext('Show more') : this.$gettext('Show less');
    }
  },
  methods: {
    collapseItems() {
      this.collapsed = !this.collapsed;
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~VariablesStyles';

.items-item {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 12px;
  .item-title {
    width: 75%;
  }
}
.items-item:first-child {
  margin-top: 11.5px;
}
.progress {
  width: 40px;
  height: 8px;
}
.show-wrapper {
  margin-top: 6px;
  display: flex;
  flex-direction: row;
  align-items: center;
  p {
    color: $dark-gray;
    opacity: 0.6;
  }
}
.is-collapsed {
  div:nth-child(n + 6) {
    display: none;
  }
}
</style>
