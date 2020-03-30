<template>
  <div class="rc-pbn-links-statistics">
    <div class="main content">
      <div class="summary-table">
        <div class="tr">
          <div class="th rc-table-text">Niche</div>
          <div class="th rc-table-text">Amount</div>
        </div>
        <div class="scroll-container" v-bar>
          <div class="scroll-content">
            <div v-for="(niche, $index) in summary.niches" :key="$index" class="tr">
              <div class="td rc-basic-text">{{ niche.name }}</div>
              <div class="td rc-basic-text">{{ niche.count }}</div>
            </div>
          </div>
        </div>
      </div>
      <div ref="chart" class="distribution">
        <h2 class="rc-table-text">Summary Outbound Links Distribution</h2>
        <GChart
          type="ColumnChart"
          :data="chartData"
          :options="chartOptions" />
      </div>
    </div>
  </div>
</template>

<script>
import { GChart } from 'vue-google-charts';

import { getNicheStatisticsApi } from '../../../api/pbn/niches';

export default {
  name: 'StatisticsView',
  components: { GChart },
  data() {
    return {
      summary: {},
      distribution: {},
      chartData: [],
      chartOptions: {
        width: 490,
        height: 350,
        backgroundColor: '',
        legend: { position: 'none' },
        chartArea: { width: '80%', height: '80%' },
      },
    };
  },
  mounted() {
    getNicheStatisticsApi()
      .then((response) => {
        if (response && response.summary) {
          this.summary = response.summary;
        }
        if (response && response.distribution) {
          if (!response.distribution.length) {
            return;
          }
          this.chartData = [
            [...Object.keys(response.distribution[0])],
            ...response.distribution.map(column => [column.name, column.obl]),
          ];
        }
      })
      .catch(e => e);
    getComputedStyle(this.$refs.chart).getPropertyValue('--chart-background').trim();
  },
};
</script>

<style lang="scss" scoped>
@import '../../../assets/styles/variables';

.rc-pbn-links-statistics {
  display: flex;
  width: 100%;
  padding-left: 100px;
}
.content.main {
  width: calc(100% - 260px);
  display: flex;
  align-items: flex-start;
}
.summary-table {
  min-width: 530px;
  .tr {
    display: flex;
    justify-content: space-around;
    align-items: center;
    border-bottom: 1px solid $cornflower-blue-15;
    height: 50px;
    .th, .td {
      flex: 1;
      &:last-child {
        text-align: center;
      }
    }
  }
}
.distribution {
  margin-left: 100px;
  --chart-background: #{$mercury};
}
aside {
  width: 260px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  height: calc(100vh - 90px);
  padding: 70px 0 200px;
  border-left: 1px solid $cornflower-blue-15;
}
.scroll-container {
  height: 500px;
}
</style>
