<template>
  <v-content>
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="6">
          <v-card class="elevation-12">
            <v-toolbar color="primary" dark flat>
              <v-toolbar-title>Register</v-toolbar-title>
              <div class="flex-grow-1"></div>
            </v-toolbar>
            <v-card-text>
              <v-form ref="form" v-model="isFormValid" :lazy-validation="true">
                <v-text-field
                  label="First name"
                  v-model="firstName"
                  :rules="nameRules"
                  name="first-name"
                  type="text"
                  validate-on-blur
                ></v-text-field>
                <v-text-field
                  label="Last name"
                  v-model="lastName"
                  :rules="nameRules"
                  name="last-name"
                  type="text"
                  validate-on-blur
                ></v-text-field>
                <v-text-field
                  label="E-mail"
                  v-model="email"
                  :rules="emailRules"
                  name="email"
                  type="email"
                  @change="removeServerError()"
                  validate-on-blur
                ></v-text-field>
                <v-text-field
                  :append-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                  label="Password"
                  v-model="password"
                  :rules="passwordRules"
                  name="password"
                  prepend-icon="mdi-lock"
                  :type="showPassword ? 'text' : 'password'"
                  @click:append="showPassword = !showPassword"
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
                  @change="$refs.form.validate()"
                  validate-on-blur
                ></v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <div class="flex-grow-1"></div>
              <v-btn color="primary"
                     class="ma-3"
                     :disabled="!isFormValid"
                     @click="register()">Sign Up</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-content>
</template>

<script>
import camelCase from 'camelcase-keys';

export default {
  name: 'SignUp',
  computed: {
    emailRules() {
      return [
        v => !!v || 'E-mail is required',
        v => /.+@.+\..+/.test(v) || 'Please provide a valid email',
        () => !this.serverErrors.email || this.serverErrors.email.join(' '),
      ];
    },
    passwordRules() {
      return [
        v => !!v || 'This field is required',
        v => v === this.confirmPassword || 'Password and it\'s confirmation doesn\'t match',
        v => v.length > 7 || 'At least 8 characters required',
      ];
    },
    confirmPasswordRules() {
      return [
        v => !!v || 'This field is required',
        v => v === this.password || 'Password and it\'s confirmation doesn\'t match',
        v => v.length > 7 || 'At least 8 characters required',
      ];
    },
  },
  data() {
    return {
      showPassword: false,
      isFormValid: false,
      serverErrors: {},
      firstName: '',
      lastName: '',
      nameRules: [
        v => !!v || 'Name is required',
      ],
      email: '',
      password: '',
      confirmPassword: '',
    };
  },
  methods: {
    register() {
      if (!this.$refs.form.validate()) {
        return;
      }
      const formData = {
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        password: this.password,
        confirmPassword: this.confirmPassword,
      };
      this.$store.dispatch('auth/signUp', formData)
        .then((response) => {
          this.$router.push({
            name: 'registered',
            meta: response,
          });
        })
        .catch((errors) => {
          this.serverErrors = camelCase(errors);
          this.$refs.form.validate();
        });
    },
    removeServerError() {
      if (this.serverErrors.email) {
        delete this.serverErrors.email;
        this.$refs.form.validate();
      }
    },
  },
};
</script>
