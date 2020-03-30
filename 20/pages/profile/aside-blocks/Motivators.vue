<template>
  <div>
    <div class="motivators-list">
      <div class="motivators-item" v-for="(reason, index) in topReasons">
        <div class="motivator-count">
          <p class="light-text">{{index + 1}}</p>
        </div>
        <div class="motivator-title">
          <p class="paragraph-m">{{reason.name}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    topReasons() {
      if (this.candidate && this.candidate.leave_reasons) {
        return this.candidate.leave_reasons.slice(0, 3);
      } else {
        return [this.$gettext('Empty')];
      }
    }
  },
  props: {
    candidate: Object
  }
};
</script>

<style lang="scss" scoped>
@import '~VariablesStyles';

.motivators-item {
  position: relative;
  min-height: 60px;
  margin-top: 33px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.motivators-item:first-child {
  margin-top: 16.5px;
}
.motivator-count {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  p {
    font-size: 80px;
    color: $secondary;
    opacity: 0.1;
  }
}
.motivator-title {
  width: 100%;
  top: 50%;
  right: 0;
  transform: translate(0, -50%);
  position: absolute;
  max-width: 100%;
  text-align: center;
  p {
    word-wrap: break-word;
  }
}

.light-text {
  font-weight: 100;
}
</style>
