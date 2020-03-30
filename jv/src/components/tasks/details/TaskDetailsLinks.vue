<template>
  <div>
    <div v-if="task" class="link-id mb-4 align-center">
      <div class="rc-heading-3-text">Link ID: <span>{{ task.order_item.formatted_id }}</span></div>
      <div :class="statusClass" class="pa-2 task-status">{{ task.label }}</div>
    </div>
    <TaskDetailsPbnDetails v-if="replacedPbn.id" label="Remove the link from" :pbn="replacedPbn" />
    <TaskDetailsPbnDetails v-if="pbn && pbn.id" :label="pbnLabel" :pbn="pbn" />
    <div v-if="task" class="record client-link">
      <div class="py-1">Client Link:</div>
      <div class="py-1">
        <a
          :href="task.order_item.link"
          target="_blank"
          :title="task.order_item.link"
        >{{ task.order_item.link }}</a>
      </div>
    </div>
    <div v-if="task" class="record">
      <div class="py-1">Anchor Text:</div>
      <div class="py-1">
        <span>{{ task.order_item.anchor_text }}</span>
      </div>
    </div>
    <div v-if="pbn && pbn.niche" class="record">
      <div class="py-1">Niche:</div>
      <div class="py-1">
        <span>{{ pbn.niche.name }}</span>
      </div>
    </div>
    <div v-if="allowPbnReplacement" class="record">
      <div class="py-1 d-flex align-center h-35">
        <span>Replace PBN:</span>
      </div>
      <div class="py-1">
        <button class="rc grey small" @click="$emit('update-pbn')">
          <v-icon color="black" size="16">mdi-refresh</v-icon>
        </button>
      </div>
    </div>
    <p v-if="error" class="rc-text-red rc-system-text">{{ error }}</p>
  </div>
</template>

<script>
import TaskDetailsPbnDetails from './TaskDetailsPbnDetails.vue';

export default {
  name: 'TaskDetailsLinks',
  components: { TaskDetailsPbnDetails },
  props: {
    task: {
      type: Object,
    },
    allowPbnReplacement: {
      type: Boolean,
      default: false,
    },
    error: String,
  },
  computed: {
    statusClass() {
      return this.task.label.toLowerCase().replace(/\s+/g, '');
    },
    pbn() {
      return this.task && this.task.back_link ? this.task.back_link.pbn : {};
    },
    replacedPbn() {
      const replacedBackLink = this.task && this.task.replaced && this.task.replaced.back_link;
      return replacedBackLink ? this.task.replaced.back_link.pbn : {};
    },
    pbnLabel() {
      return this.replacedPbn.id ? 'Move the link to' : 'PBN';
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../../../assets/styles/variables';

.link-id {
  display: flex;
  justify-content: space-between;
  .task-status{
    border-radius: 8px;
  }
}
.record {
  display: flex;
  align-items: flex-start;
  width: 100%;
  > div:first-child {
    flex: 1;
  }
  > div:last-child {
    flex: 2;
  }
}
.client-link > div {
  &:last-child {
    max-width: 225px;;
  }
  a {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 100%;
    max-width: 225px;
    display: block;
  }
}
.new {
  background: $zumthor;
}
.inprogress {
  background: $early-dawn;
}
.late {
  background: $fair-pink;
}
.done {
  background: $hint-of-green;
}
.approved {
  background: $mercury;
}
.h-35 {
  height: 35px;
}
</style>
