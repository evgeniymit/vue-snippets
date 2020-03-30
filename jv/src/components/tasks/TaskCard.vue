<template>
  <div :class="cardClasses"
       @click="taskClickHandler(task.id)"
       class="task-card">
    <div class="main">
      <div class="info-block">
        <span class="link-id rc-system-text" title="Order Item ID / Task ID">
          Link ID: {{ task.order_item.formatted_id }}
        </span>
        <span class="link-url rc-basic-text mt-1 mb-2">{{ task.order_item.link }}</span>
        <div class="assign">
          <div v-if="!isNew && task.assignee">
            <p class="assignee rc-system-text ma-0">Assignee:</p>
            <p class="name rc-basic-text ma-0">
              {{ task.assignee.first_name }} {{ task.assignee.last_name }}
            </p>
          </div>
          <div v-else class="rc-system-text not-assigned my-2">Not Assigned</div>
        </div>
      </div>
      <div class="time-block">
        <span class="date rc-system-text">{{ formatDate(task.deadline) }}</span>
        <span class="time mt-1">
          <v-icon :size="12" class="mr-1">mdi-clock-outline</v-icon>
          <span class="rc-basic-text">{{ task.elapsed_time ? task.elapsed_time : '--:--' }}</span>
        </span>
      </div>
    </div>
    <footer>
      <div class="task-type rc-system-text mt-2">
        Task type: {{ task.task_type.name }}
      </div>
      <div class="task-type rc-system-text mt-2">
        PBN: {{ task.pbn ? task.pbn : 'N/A' }}
      </div>
    </footer>
  </div>
</template>

<script>
import DateFormat from '../../mixins/DateFormat';

export default {
  props: {
    task: {
      type: Object,
      required: true,
    },
    type: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    taskClickHandler: {
      type: Function,
    },
  },
  mixins: [DateFormat],
  computed: {
    cardClasses() {
      const STATUS_CLASS = this.type === 'inprogress' ? 'in-progress' : this.type;
      const ACTIVE_CLASS = this.isActive ? 'active' : '';
      return [STATUS_CLASS, ACTIVE_CLASS];
    },
    isNew() {
      return this.type === 'new';
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../../assets/styles/variables';

.task-card {
  width: 100%;
  max-height: 120px;
  border: 1px solid $hawkes-blue;
  box-shadow: 2px 2px 7px $polo-blue-25;
  border-radius: 4px;
  margin-bottom: 12px;
  padding: 16px;
  border-left-width: 8px;
  min-height: 140px;
}
.info-block {
  display: flex;
  flex: 1;
  max-width: 65%;
  flex-direction: column;
  .link-url {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-weight: 500;
    color: $primary;
  }
}
.time-block {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  white-space: nowrap;
  max-width: 35%;
  .date {
    color: $grey;
  }
  .time {
    display: flex;
    align-items: center;
    span {
      font-weight: 500;
    }
  }
}

.main {
  display: flex;
}
.open {
  border-left-color: $malibu;
  &.active {
    background: $zumthor;
  }
}
.in-progress {
  border-left-color: $macaroni-and-cheese;
  &.active {
    background: $early-dawn;
  }
}
.late {
  border-left-color: $geraldine;
  &.active {
    background: $fair-pink;
  }
}
.completed {
  border-left-color: $algae-green;
  &.active {
    background: $hint-of-green;
  }
}
.approved {
  border-left-color: $grey;
  &.active {
    background: $mercury;
  }
}
.not-assigned {
  color: $grey;
}
</style>
