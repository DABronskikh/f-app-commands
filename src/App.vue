<template>
    <v-app>
        <v-navigation-drawer
                app
                temporary
                v-model="drawer"
        >
            <v-list>
                <v-list-tile
                        v-for="(link, idx) in links"
                        :key="idx"
                        :to="link.url"
                        @click="link.action"

                >
                    <v-list-tile-action>
                        <v-icon>{{link.icon}}</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title v-text="link.title"></v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>


            </v-list>
        </v-navigation-drawer>

        <v-toolbar app dark color="primary">
            <v-toolbar-side-icon
                    @click="drawer =! drawer"
                    class="hidden-md-and-up"
            >
            </v-toolbar-side-icon>
            <v-toolbar-title>
                <router-link to="/" tag="span" class="pointer">
                    Твоя вторая память
                </router-link>
            </v-toolbar-title>
            <v-spacer></v-spacer>

            <v-toolbar-items class="hidden-sm-and-down">
                <v-btn
                        v-for="(link, idx) of toolbarLinks"
                        :key="idx"
                        :to="link.url"
                        @click="link.action"
                        flat
                >
                    <v-icon left>{{link.icon}}</v-icon>
                    {{link.title}}
                </v-btn>


                <v-menu bottom left v-if="isUserLoggedIn">
                    <template v-slot:activator="{ on }">
                        <v-btn
                                dark
                                icon
                                v-on="on"
                        >
                            <v-icon>account_circle
                            </v-icon>
                        </v-btn>
                    </template>

                    <v-list>
                        <v-list-tile
                                v-for="(link, idx) of toolbarLeftLinks"
                                :key="idx"
                                :to="link.url"
                                @click="link.action"
                        >
                            <v-icon left>{{link.icon}}</v-icon>
                            {{ link.title }}
                        </v-list-tile>
                    </v-list>

                </v-menu>
            </v-toolbar-items>
        </v-toolbar>

        <v-content>

            <router-view></router-view>

            <template
                    v-if=snackbarMsg
            >
                <v-snackbar
                        :multi-line="true"
                        :timeout="7000"
                        :color=snackbarType
                        @input="closeSnackbar"
                        right
                        :value="true"
                >
                    {{snackbarMsg}}
                    <v-btn
                            dark
                            flat
                            icon
                            @click.native="closeSnackbar"
                    >
                        <v-icon>close</v-icon>
                    </v-btn>
                </v-snackbar>
            </template>

            <v-dialog persistent
                      v-model="loginDialog"
                      max-width="500"
            >
                <login-form></login-form>
            </v-dialog>

            <v-dialog persistent
                      v-model="registerDialog"
                      max-width="500"
            >
                <v-card>
                    <registr-form></registr-form>
                </v-card>
            </v-dialog>

            <v-dialog persistent
                      v-model="resetPasswordDialog"
                      max-width="500"
            >
                <v-card>
                    <reset-password-form></reset-password-form>
                </v-card>
            </v-dialog>
        </v-content>

    </v-app>
</template>

<script>
  import LoginForm from './components/Auth/Login'
  import RegistrForm from './components/Auth/Registration'
  import ResetPasswordForm from './components/Auth/ResetPassword'

  export default {
    components: {
      ResetPasswordForm,
      RegistrForm,
      LoginForm,
    },
    data () {
      return {
        drawer: false,
        toolbarLeftLinks: [
          {title: 'Профиль', icon: 'account_circle', url: '/user', action: this.actionDefault},
          {title: 'Выйти', icon: 'exit_to_app', url: '', action: this.onLogout},
        ],
      }
    },
    methods: {
      togleLoginDialog () {
        this.$store.dispatch('togleLoginDialog')
      },
      togleRegisterDialog () {
        this.$store.dispatch('togleRegisterDialog')
      },
      togleResetPasswordDialog () {
        this.$store.dispatch('togleResetPasswordDialog')
      },
      onLogout () {
        this.$store.dispatch('logoutUser')
        this.$router.push('/')
      },
      closeSnackbar () {
        this.$store.dispatch('clearSnackbar')
      },
      actionDefault () {
        return true
      }
    },
    computed: {
      loginDialog () {
        return this.$store.getters.loginDialog
      },
      registerDialog () {
        return this.$store.getters.registerDialog
      },
      resetPasswordDialog () {
        return this.$store.getters.resetPasswordDialog
      },
      isUserLoggedIn () {
        return this.$store.getters.isUserLoggedIn
      },
      snackbarType () {
        return this.$store.getters.snackbarType
      },
      snackbarMsg () {
        return this.$store.getters.snackbarMsg
      },
      links () {
        if (this.isUserLoggedIn) {
          return [
            {title: 'Главная', icon: 'home', url: '/', action: this.actionDefault},
            {title: 'Доски', icon: 'bookmark_border', url: '/boards', action: this.actionDefault},
            {title: 'Профиль', icon: 'account_circle', url: '/user', action: this.actionDefault},
            {title: 'Выйти', icon: 'exit_to_app', url: '', action: this.onLogout},
          ]
        } else {
          return [
            {title: 'Главная', icon: 'home', url: '/', action: this.actionDefault},
            {title: 'Войти', icon: 'lock', url: '', action: this.togleLoginDialog},
            {title: 'Регистрация', icon: 'face', url: '', action: this.togleRegisterDialog},
          ]
        }
      },
      toolbarLinks () {
        if (this.isUserLoggedIn) {
          return [
            {title: 'Главная', icon: 'home', url: '/', action: this.actionDefault},
            {title: 'Доски', icon: 'bookmark_border', url: '/boards', action: this.actionDefault},
          ]
        } else {
          return [
            {title: 'Главная', icon: 'home', url: '/', action: this.actionDefault},
            {title: 'Войти', icon: 'lock', url: '', action: this.togleLoginDialog},
            {title: 'Регистрация', icon: 'face', url: '', action: this.togleRegisterDialog},
          ]
        }
      }
    },
  }
</script>

<style scoped>
    .pointer {
        cursor: pointer;
    }
</style>
