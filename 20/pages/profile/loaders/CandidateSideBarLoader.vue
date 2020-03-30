<template>
  <vue-content-loading :width="193" :height="231" class="content-loader" primary="#ddd" secondary="#f5f5f5">
    <rect width="124" height="22" fill="#DDD" rx="11"/>
    <rect width="83" height="10" y="221" fill="#DDD" rx="5"/>
    <rect width="160" height="10" x="33" y="182" fill="#DDD" rx="5"/>
    <circle cx="8" cy="187" r="8" fill="#DDD"/>
    <rect width="160" height="10" x="33" y="150" fill="#DDD" rx="5"/>
    <circle cx="8" cy="155" r="8" fill="#DDD"/>
    <rect width="160" height="10" x="33" y="118" fill="#DDD" rx="5"/>
    <circle cx="8" cy="123" r="8" fill="#DDD"/>
    <rect width="160" height="10" x="33" y="85" fill="#DDD" rx="5"/>
    <circle cx="8" cy="90" r="8" fill="#DDD"/>
    <rect width="160" height="10" x="33" y="51" fill="#DDD" rx="5"/>
    <circle cx="8" cy="56" r="8" fill="#DDD"/>
  </vue-content-loading>
</template>

<script>

import VueContentLoading from 'vue-content-loading';

export default {
  components: {VueContentLoading}
};
</script>

<style scoped lang="scss">
.content-loader {
  width: 193px;
  height: 231px;
}
</style>
