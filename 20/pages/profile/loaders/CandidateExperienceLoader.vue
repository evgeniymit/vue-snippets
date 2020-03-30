<template>
  <vue-content-loading v-if="$mq.phone" :width="281" :height="590" :speed="speed" primary="#ddd" secondary="#f5f5f5" class="content-loader">
    <rect width="280" height="10" x="1" y="212" fill="#DDD" rx="5"/>
    <rect width="220" height="10" x="1" y="523" fill="#DDD" rx="5"/>
    <rect width="280" height="10" x="1" y="290" fill="#DDD" rx="5"/>
    <rect width="280" height="10" x="1" y="368" fill="#DDD" rx="5"/>
    <rect width="280" height="10" x="1" y="238" fill="#DDD" rx="5"/>
    <rect width="280" height="10" x="1" y="316" fill="#DDD" rx="5"/>
    <rect width="130" height="10" x="1" y="394" fill="#DDD" rx="5"/>
    <rect width="280" height="10" x="1" y="264" fill="#DDD" rx="5"/>
    <rect width="280" height="10" x="1" y="342" fill="#DDD" rx="5"/>
    <rect width="250" height="22" fill="#DDD" rx="11"/>
    <rect width="204" height="10" y="59" fill="#DDD" rx="5"/>
    <rect width="186" height="10" y="85" fill="#DDD" rx="5"/>
    <rect width="124" height="22" x="1" y="154" fill="#DDD" rx="11"/>
    <circle cx="122" cy="582" r="8" fill="#DDD"/>
    <circle cx="273" cy="582" r="8" fill="#DDD"/>
    <rect width="198" height="22" x="2" y="465" fill="#DDD" rx="11"/>
    <circle cx="9" cy="582" r="8" fill="#DDD"/>
    <circle cx="187" cy="582" r="8" fill="#DDD"/>
    <rect width="276" height="4" x="1" y="580.5" fill="#DDD" rx="2"/>
    <circle cx="63" cy="582" r="8" fill="#DDD"/>
  </vue-content-loading>

  <vue-content-loading v-else :width="866" :height="1349" :speed="speed" primary="#ddd" secondary="#f5f5f5" class="content-loader">
    <rect width="124" height="22" x="1" y="160" rx="11"/>
    <rect width="198" height="22" x="1" y="443" rx="11"/>
    <rect width="250" height="22" x="1" rx="11"/>
    <rect width="720" height="10" x="1" y="218" rx="5"/>
    <rect width="204" height="10" x="1" y="59" rx="5"/>
    <rect width="720" height="10" x="1" y="244" rx="5"/>
    <rect width="186" height="10" x="1" y="85" rx="5"/>
    <rect width="861" height="4" x="1" y="527.5" rx="2"/>
    <rect width="720" height="10" x="1" y="270" rx="5"/>
    <rect width="720" height="10" x="1" y="318" rx="5"/>
    <rect width="228" height="10" x="1" y="370" rx="5"/>
    <rect width="720" height="10" x="1" y="344" rx="5"/>
    <rect width="127" height="10" x="1" y="673" rx="5"/>
    <rect width="108" height="10" x="20" y="691" rx="5"/>
    <rect width="240" height="10" x="182" y="673" rx="5"/>
    <rect width="260" height="10" x="182" y="699" rx="5"/>
    <rect width="110" height="10" x="182" y="725" rx="5"/>
    <rect width="450" height="10" x="201" y="757" rx="5"/>
    <rect width="450" height="10" x="201" y="804" rx="5"/>
    <circle cx="186" cy="762" r="5"/>
    <circle cx="155" cy="679" r="8"/>
    <circle cx="8" cy="529" r="8"/>
    <circle cx="166" cy="529" r="8"/>
    <circle cx="432" cy="529" r="8"/>
    <circle cx="704" cy="529" r="8"/>
    <circle cx="858" cy="529" r="8"/>
    <circle cx="186" cy="809" r="5"/>
    <circle cx="186" cy="786" r="5"/>
    <circle cx="186" cy="833" r="5"/>
    <rect width="450" height="10" x="201" y="781" rx="5"/>
    <rect width="450" height="10" x="201" y="828" rx="5"/>
    <rect width="127" height="10" x="1" y="927" rx="5"/>
    <rect width="108" height="10" x="20" y="945" rx="5"/>
    <rect width="240" height="10" x="182" y="927" rx="5"/>
    <rect width="260" height="10" x="182" y="953" rx="5"/>
    <rect width="110" height="10" x="182" y="979" rx="5"/>
    <rect width="450" height="10" x="201" y="1011" rx="5"/>
    <rect width="450" height="10" x="201" y="1058" rx="5"/>
    <circle cx="186" cy="1016" r="5"/>
    <circle cx="155" cy="933" r="8"/>
    <circle cx="186" cy="1063" r="5"/>
    <circle cx="186" cy="1040" r="5"/>
    <circle cx="186" cy="1087" r="5"/>
    <rect width="450" height="10" x="201" y="1035" rx="5"/>
    <rect width="450" height="10" x="201" y="1082" rx="5"/>
    <rect width="127" height="10" x="1" y="1184" rx="5"/>
    <rect width="108" height="10" x="20" y="1202" rx="5"/>
    <rect width="240" height="10" x="182" y="1184" rx="5"/>
    <rect width="260" height="10" x="182" y="1210" rx="5"/>
    <rect width="110" height="10" x="182" y="1236" rx="5"/>
    <rect width="450" height="10" x="201" y="1268" rx="5"/>
    <rect width="450" height="10" x="201" y="1315" rx="5"/>
    <circle cx="186" cy="1273" r="5"/>
    <circle cx="155" cy="1190" r="8"/>
    <circle cx="186" cy="1320" r="5"/>
    <circle cx="186" cy="1297" r="5"/>
    <circle cx="186" cy="1344" r="5"/>
    <rect width="450" height="10" x="201" y="1292" rx="5"/>
    <rect width="450" height="10" x="201" y="1339" rx="5"/>
  </vue-content-loading>
</template>

<script>

import VueContentLoading from 'vue-content-loading';

export default {
  props: {
    animate: {type: Boolean, default: true}
  },
  computed: {
    speed() {
      return this.animate ? 2 : 0;
    }
  },
  components: {VueContentLoading}
};
</script>

<style scoped lang="scss">
@import '~VariablesStyles';
.content-loader {
  width: 866px;
  height: 1349px;
}
@media (max-width: $desktop) {
  .content-loader {
    margin-left: 20px;
    overflow: hidden;
  }
}
@media (max-width: $tablet) {
  .content-loader {
    width: 281px;
    height: 590px;
  }
}
</style>
