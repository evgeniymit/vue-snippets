<template>
  <div class="board-container">
    <div v-if="order && columns" class="wrapper">
      <div
        v-for="taskStatus in columns"
        :key="taskStatus.title"
        class="column"
      >
        <div class="task-type-header pl-2" :class="taskStatus.property">
          <span class="rc-heading-2-text">{{ taskStatus.title }}</span>
          <div
            v-if="order[taskStatus.property]"
            class="task-count px-2 py-1">
            <span class="rc-system-text">
              {{ order[taskStatus.property].length }}
            </span>
          </div>
        </div>
        <TaskCard
          v-for="item in order[taskStatus.property]"
          :key="item.id"
          :task="item"
          :type='taskStatus.property'
          :is-active="isTaskActive(item.id)"
          :taskClickHandler="taskClickHandler"
        />
      </div>
      <div class="column zero-flex"></div>
    </div>
  </div>
</template>

<script>
import TaskCard from '@/components/tasks/TaskCard.vue';

export default {
  components: { TaskCard },
  props: {
    order: {
      type: Object,
      required: true,
    },
    columns: Array,
  },
  data() {
    return {
      isActive: false,
      activeTaskId: null,
    };
  },
  methods: {
    isTaskActive(id) {
      return id === this.activeTaskId;
    },
    taskClickHandler(id) {
      this.$emit('start-load');
      this.$store.dispatch('fulfillmentManager/getTask', id)
        .then(() => {
          this.$emit('end-load');
        });
      this.activeTaskId = id || null;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../../assets/styles/variables';

.board-container {
  height: calc(100vh - 172px);
}
.wrapper {
  display: flex;
  justify-content: stretch;
  min-width: 1000px;
}
.column {
  flex: 1;
  min-width: 245px;
  &:last-child {
    min-width: 18px;
  }
  + .column {
    margin-left: 30px;
  }
}
.zero-flex {
  flex: 0;
  @media (min-width: 1740px) {
    display: none;
  }
}
.task-type-header {
  border-radius: 8px;
  width: 100%;
  height: 30px;
  display: flex;
  justify-content: space-between;
  margin: 0 0 13px;
  padding: 5px;
  &.open {
    background: $zumthor;
  }
  &.inprogress {
    background: $early-dawn;
  }
  &.late {
    background: $fair-pink;
  }
  &.completed {
    background: $hint-of-green;
  }
  &.approved {
    background: $mercury;
  }
  .task-count {
    background: $cornflower-blue-15;
    border-radius: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    span {
      color: $primary;
      line-height: 11px;
    }
  }
}
</style>
