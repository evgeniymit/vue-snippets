<template>
  <v-content>
    <v-container class="fill-height pa-0" fluid>
      <rc-sidebar>
        <template v-slot:caption>Inventory Management</template>
        <nav>
          <RcSidebarNavLink
            route-name="inventory-home"
            :active="isRouteActive('inventory-home')"
            label="Summary"
          >
            <template v-slot:icon>
              <img src="../../../assets/icons/summary.svg" alt="summary_icon">
            </template>
          </RcSidebarNavLink>
          <div v-if="showNichesList" class="scroll-container" v-bar>
            <div class="scroll-content">
              <ul class="niches">
                <li class="py-2">
                  <RcCheckbox
                    :value="nicheFilterDisabled"
                    @input="onClearNichesFilterChange($event)"
                    label="All niches" />
                </li>
                <li
                  v-for="niche in niches"
                  :key="niche.id"
                  class="py-2"
                >
                  <RcCheckbox
                    :value="niche.selected"
                    @input="onNicheFilterUpdate($event, niche)"
                    :label="niche.name"
                  />
                </li>
              </ul>
            </div>
          </div>
          <RcSidebarNavLink
            route-name="inventory-statistics"
            :active="isRouteActive('inventory-statistics')"
            label="Statistics"
          >
            <template v-slot:icon>
              <img src="../../../assets/icons/statistics.svg" alt="statistics_icon">
            </template>
          </RcSidebarNavLink>
        </nav>
      </rc-sidebar>
      <div class="main-content">
        <InventoryHeader />
        <router-view />
      </div>
    </v-container>
  </v-content>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';

import RcSidebar from '@/components/sidebar/RcSidebar.vue';
import RcSidebarNavLink from '@/components/sidebar/RcSidebarNavLink.vue';
import RcCheckbox from '@/components/form-controls/RcCheckbox.vue';
import InventoryHeader from '../components/InventoryHeader.vue';

import Route from '@/mixins/route';
import authGuard from '../../../mixins/authGuard';

const {
  mapState,
  mapActions,
  mapMutations,
} = createNamespacedHelpers('inventoryManager');

export default {
  name: 'InventoryHome',
  components: {
    RcSidebar, RcSidebarNavLink, RcCheckbox, InventoryHeader,
  },
  mixins: [Route, authGuard],
  computed: {
    ...mapState({
      niches: state => state.niches,
    }),
    nicheFilterDisabled() {
      return !this.niches.some(niche => niche.selected);
    },
    showNichesList() {
      return this.niches && this.niches.length && this.isRouteActive('inventory-home');
    },
  },
  methods: {
    ...mapActions({
      getNiches: 'getAllNiches',
      getPbnList: 'getPbnList',
    }),
    ...mapMutations(['clearNicheFilter', 'updateNicheFilterState']),
    onClearNichesFilterChange(event) {
      if (!event && this.nicheFilterDisabled) {
        return;
      }
      this.clearNicheFilter();
      this.updatePbnList();
    },
    onNicheFilterUpdate(event, niche) {
      this.updateNicheFilterState({ event, niche });
      this.updatePbnList();
    },
    updatePbnList() {
      this.getPbnList()
        .then((query) => {
          this.$router.push({ query }).catch(err => err);
        });
    },
  },
  created() {
    if (this.niches && !this.niches.length) {
      this.getNiches();
    }
  },
};
</script>

<style lang="scss" scoped>
@import "../../../assets/styles/variables";

.main-content {
  width: 100vw;
  padding: 90px 0 0 270px;
}
.niches {
  background: $cornflower-blue-7;
  padding-left: 50px;
}
.scroll-container {
  height: calc(100vh - 450px);
}
</style>
