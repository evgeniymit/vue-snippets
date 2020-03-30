<template>
  <ValidationProvider name="non_field_errors" v-slot="{ errors }">
    <div v-if="errors && errors.length" class="errors mt-2">
      <p v-for="e in errors" :key="e" class="rc-message-text rc-error">
        {{ e }}
      </p>
    </div>
  </ValidationProvider>
</template>

<script>
import { ValidationProvider } from 'vee-validate';

export default {
  name: 'NonFieldErrors',
  components: { ValidationProvider },
};
</script>
