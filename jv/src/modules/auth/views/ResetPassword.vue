<template>
  <v-content>
    <v-alert
      v-if="showMessage"
      :type="getMessageType" class="alert-message">
      {{ messages[getMessageType] }}
    </v-alert>
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="6">
          <v-card class="elevation-12">
            <v-toolbar color="primary" dark flat>
              <v-toolbar-title>Restore password</v-toolbar-title>
              <div class="flex-grow-1"></div>
            </v-toolbar>
            <v-card-text>
              <v-form ref="form" v-model="isFormValid" :lazy-validation="true">
                <p>Please provide the e-mail which you are using for authentication:</p>
                <v-text-field
                  label="E-mail"
                  v-model="email"
                  :rules="emailRules"
                  name="email"
                  type="email"
                  validate-on-blur
                ></v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <div class="flex-grow-1"></div>
              <v-btn color="primary"
                     :disabled="!isFormValid"
                     @click="requestPasswordRestore()"
                     class="my-3">Restore Password</v-btn>
              <div class="flex-grow-1"></div>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-content>
</template>

<script>
export default {
  name: 'ResetPassword',
  computed: {
    getMessageType() {
      return this.emailExists ? 'success' : 'error';
    },
  },
  data() {
    return {
      isFormValid: false,
      showMessage: false,
      emailExists: false,
      email: '',
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+\..+/.test(v) || 'Please provide a valid email',
      ],
      messages: {
        success: 'We\'ve sent the email to you with further instructions',
        error: 'Specified email doesn\'t exist',
      },
    };
  },
  methods: {
    requestPasswordRestore() {
      if (!this.$refs.form.validate()) {
        return;
      }
      setTimeout(() => {
        this.showMessage = false;
      }, 10000);
      this.$store.dispatch('auth/requestPasswordReset', this.email)
        .then(() => {
          this.emailExists = true;
          this.showMessage = true;
          this.email = '';
        })
        .catch(() => {
          this.emailExists = false;
          this.showMessage = true;
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.alert-message {
  position: absolute;
  top: 5em;
  width: 50vw;
  left: 25vw;
}
</style>
