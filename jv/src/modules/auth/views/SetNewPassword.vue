<template>
  <v-content>
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="6">
          <v-card class="elevation-12">
            <v-toolbar
              color="primary"
              dark
              flat
            >
              <v-toolbar-title>
                Set a new password for your account
              </v-toolbar-title>
              <div class="flex-grow-1"></div>
            </v-toolbar>
            <v-card-text>
              <v-form v-model="isFormValid" ref="form">
                <v-text-field
                  :append-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                  label="Password"
                  v-model="password"
                  :rules="passwordRules"
                  name="password"
                  prepend-icon="mdi-lock"
                  :type="showPassword ? 'text' : 'password'"
                  @click:append="showPassword = !showPassword"
                  @change="removeServerError()"
                  validate-on-blur
                ></v-text-field>
                <v-text-field
                  label="Confirm password"
                  v-model="confirmPassword"
                  :rules="confirmPasswordRules"
                  name="confirm-password"
                  prepend-icon="mdi-lock"
                  :type="showPassword ? 'text' : 'password'"
                  @click:append="showPassword = !showPassword"
                  validate-on-blur
                ></v-text-field>
                <p v-if="serverError" class="red--text mb-1">{{ serverError }}</p>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <div class="flex-grow-1"></div>
              <v-btn color="primary"
                     class="ma-3"
                     :disabled="!isFormValid"
                     @click="setNewPassword()">
                Set New Password
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-content>
</template>

<script>
export default {
  name: 'SetNewPassword',
  computed: {
    passwordConfirmationMatch() {
      return this.password === this.confirmPassword || 'Password and it\'s confirmation doesn\'t match';
    },
  },
  data() {
    return {
      showPassword: false,
      isFormValid: false,
      serverError: null,
      password: '',
      confirmPassword: '',
      passwordRules: [
        v => !!v || 'This field is required',
        v => v.length > 7 || 'At least 8 characters required',
      ],
      confirmPasswordRules: [
        v => !!v || 'This field is required',
        () => this.passwordConfirmationMatch,
        v => v.length > 7 || 'At least 8 characters required',
      ],
    };
  },
  methods: {
    setNewPassword() {
      if (!this.$refs.form.validate()) {
        return;
      }
      const newPasswordSetData = Object.assign(
        {},
        this.$route.params,
        {
          password: this.password,
          confirm_password: this.confirmPassword,
        },
      );
      this.$store.dispatch('auth/setNewPassword', newPasswordSetData)
        .then(() => {
          this.$router.replace({ name: 'sign-in' });
        })
        .catch((error) => {
          this.serverError = error.error;
        });
    },
    removeServerError() {
      this.serverError = null;
    },
  },
};
</script>
