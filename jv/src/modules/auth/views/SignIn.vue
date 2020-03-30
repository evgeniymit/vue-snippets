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
              <v-toolbar-title>Welcome to Rank Club!</v-toolbar-title>
              <div class="flex-grow-1"></div>
            </v-toolbar>
            <v-card-text class="pb-0">
              <v-form
                v-model="isFormValid"
                ref="form"
                :lazy-validation="true"
              >
                <v-text-field
                  label="E-mail"
                  name="email"
                  v-model="email"
                  :rules="emailRules"
                  prepend-icon="mdi-account"
                  type="text"
                  validate-on-blur
                  @change="resetServerErrors('email')"
                  @keydown.enter="signIn()"
                />
                <v-text-field
                  id="password"
                  :append-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                  label="Password"
                  name="password"
                  v-model="password"
                  :rules="rules"
                  prepend-icon="mdi-lock"
                  :type="showPassword ? 'text' : 'password'"
                  @click:append="showPassword = !showPassword"
                  validate-on-blur
                  @change="resetServerErrors('password')"
                  @keydown.enter="signIn()"
                />
                <div class="pl-3 pt-3">
                  <router-link to="reset-password">Forgot password?</router-link>
                </div>
                <div class="form-errors mt-2 pl-3">
                  <p v-for="(error, index) in serverErrors.nonFieldErrors"
                     :key="index"
                     class="red--text mb-1">
                    {{ error }}
                  </p>
                </div>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <div class="flex-grow-1"></div>
              <v-btn
                color="primary"
                class="ma-3 sign-in"
                :disabled="!isFormValid"
                @click="signIn()">Login</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-content>
</template>

<script>
import camelCase from 'camelcase-keys';
import resolveInitRouteByRole from '@/mixins/resolveInitRouteByRole';

export default {
  name: 'SignIn',
  mixins: [resolveInitRouteByRole],
  data() {
    return {
      showPassword: false,
      isFormValid: true,
      email: '',
      password: '',
      rules: [
        v => !!v || 'Password is required',
        () => {
          if (this.serverErrors.password) {
            return this.serverErrors.password || this.serverErrors.password.join(' ');
          }
          return true;
        },
      ],
      serverErrors: [],
    };
  },
  computed: {
    emailRules() {
      return [
        v => !!v || 'E-mail is required',
        v => /.+@.+\..+/.test(v) || 'Please provide a valid email',
        () => !this.serverErrors.email || this.serverErrors.email.join(' '),
      ];
    },
  },
  methods: {
    signIn() {
      if (!this.$refs.form.validate()) {
        return;
      }
      const formData = {
        email: this.email,
        password: this.password,
      };
      this.$store.dispatch('auth/signIn', formData)
        .then((response) => {
          const routeName = this.resolveInitRouteName(response.role);
          this.$router.push({ name: routeName });
        })
        .catch((errors) => {
          this.serverErrors = camelCase(errors);
          this.$refs.form.validate();
        });
    },
    resetServerErrors(key) {
      this.serverErrors[key] = null;
      this.$refs.form.validate();
    },
  },
};
</script>
