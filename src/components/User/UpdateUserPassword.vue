<template>

    <div>
        <v-toolbar-side-icon
                @click="passwordForm = true"
                class="primary"
        ></v-toolbar-side-icon>

        <v-dialog
                v-model="passwordForm"
                max-width="500"
        >
            <v-card class="elevation-12">
                <v-toolbar dark color="primary">
                    <v-toolbar-title>Изменение пароля</v-toolbar-title>
                </v-toolbar>
                <v-card-text>
                    <v-form
                            ref="form"
                            v-model="valid"
                            lazy-validation
                    >
                        <v-text-field
                                prepend-icon="lock"
                                name="oldPassword"
                                label="Старый пароль"
                                type="password"
                                v-model="oldPassword"
                                :rules="oldPasRules"
                                required
                                @keyup.enter="onLogin"
                                :autofocus="true"
                        ></v-text-field>
                        <v-text-field
                                prepend-icon="lock"
                                name="newPassword"
                                label="Новый пароль"
                                type="password"
                                v-model="newPassword"
                                :rules="newPasRules"
                                required
                                @keyup.enter="onLogin"
                        ></v-text-field>
                        <v-text-field
                                prepend-icon="lock"
                                name="confirmNewPassword"
                                label="Повторите новый пароль"
                                type="password"
                                v-model="confirmNewPassword"
                                :rules="confirmNewPasRules"
                                required
                                @keyup.enter="onLogin"
                        ></v-text-field>
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                            color="primary"
                            @click="onLogin"
                            :loading="loading"
                            :disabled="loading"
                    >Изменить
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>


</template>

<script>
  export default {
    name: 'updatePasswordForm',
    data () {
      return {
        passwordForm: false,
        oldPassword: '',
        newPassword: '',
        confirmNewPassword: '',
        valid: false,
        oldPasRules: [
          v => !!v || 'Обязательное поле',
          v => v.length >= 6 || 'Минимум 6  символов'
        ],
        newPasRules: [
          v => !!v || 'Обязательное поле',
          v => v.trim() !== this.oldPassword.trim() || 'Новый пароль должен отличатся от старого',
          v => v.length >= 6 || 'Минимум 6  символов'
        ],
        confirmNewPasRules: [
          v => !!v || 'Обязательное поле',
          v => v === this.newPassword || 'Должно совпадать с первым паролем'
        ]
      }
    },
    computed: {
      loading () {
        return this.$store.getters.loading
      }
    },
    methods: {
      async onLogin () {
        if (this.$refs.form.validate()) {
          const updatePassword = {
            old_password: this.oldPassword.trim(),
            new_password: this.newPassword.trim(),
          }
          this.$store.commit('setLoading', true)
          const res = await this.$store.dispatch('updateUserPassword', updatePassword)
          if (res === 1) {
            this.passwordForm = false
            this.oldPassword = ''
            this.newPassword = ''
            this.confirmNewPassword = ''
          }
          this.$store.commit('setLoading', false)
        }
      }
    }
  }
</script>
