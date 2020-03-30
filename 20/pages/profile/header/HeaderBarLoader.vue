<template>
  <vue-content-loading v-if="$mq.desktop" :width="1181" :height="77" class="content-loader" primary="#ddd" secondary="#f5f5f5">
    <rect width="401" height="22" fill="#DDD" rx="11"/>
    <rect width="132" height="22" x="780" fill="#DDD" rx="11"/>
    <rect width="132" height="22" x="941" fill="#DDD" rx="11"/>
    <rect width="83" height="22" x="1098" fill="#DDD" rx="11"/>
    <rect width="52" height="10" x="39" y="59" fill="#DDD" rx="5"/>
    <rect width="69" height="10" x="178" y="59" fill="#DDD" rx="5"/>
    <rect width="157" height="10" x="331" y="59" fill="#DDD" rx="5"/>
    <rect width="98" height="10" x="571" y="59" fill="#DDD" rx="5"/>
    <rect width="148" height="10" x="1033" y="59" fill="#DDD" rx="5"/>
    <circle cx="546.5" cy="63.5" r="13.5" fill="#DDD"/>
    <circle cx="306.5" cy="63.5" r="13.5" fill="#DDD"/>
    <circle cx="152.5" cy="63.5" r="13.5" fill="#DDD"/>
    <circle cx="13.5" cy="63.5" r="13.5" fill="#DDD"/>
    <rect width="52" height="10" x="426" y="6" fill="#DDD" rx="5"/>
    <rect width="52" height="10" x="489" y="6" fill="#DDD" rx="5"/>
  </vue-content-loading>
  <vue-content-loading v-else :width="280" :height="269" class="content-loader" primary="#ddd" secondary="#f5f5f5">
    <rect width="280" height="22" fill="#DDD" rx="11"/>
    <rect width="156" height="10" x="39" y="87" fill="#DDD" rx="5"/>
    <rect width="156" height="10" x="39" y="130" fill="#DDD" rx="5"/>
    <rect width="156" height="10" x="38" y="173" fill="#DDD" rx="5"/>
    <rect width="156" height="10" x="38" y="216" fill="#DDD" rx="5"/>
    <circle cx="13.5" cy="220.5" r="13.5" fill="#DDD"/>
    <circle cx="13.5" cy="177.5" r="13.5" fill="#DDD"/>
    <circle cx="13.5" cy="134.5" r="13.5" fill="#DDD"/>
    <circle cx="13.5" cy="91.5" r="13.5" fill="#DDD"/>
    <rect width="52" height="10" y="36" fill="#DDD" rx="5"/>
    <rect width="52" height="10" x="63" y="36" fill="#DDD" rx="5"/>
    <rect width="148" height="10" y="259" fill="#DDD" rx="5"/>
  </vue-content-loading>
</template>

<script>

import VueContentLoading from 'vue-content-loading';

export default {
  components: {VueContentLoading}
};
</script>

<style scoped lang="scss">
@import '~VariablesStyles';

.content-loader {
  width: 1181px;
  height: 77px;
}
@media (max-width: $desktop) {
  .content-loader {
    width: 280px;
    height: 269px;
  }
}
</style>
