<template>
<div class="dialog-cross" @click="$emit('dismiss')">
  <v-icon color="#bcbcbc" size="18px">mdi-close</v-icon>
</div>
</template>

<style lang="scss" scoped>
@import '../../assets/styles/variables';

.dialog-cross {
  width: 30px;
  height: 21px;
  border-radius: 8px;
  background: $gallery;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 20px;
  right: 20px;
  cursor: pointer;
  z-index: 1;
}
</style>
