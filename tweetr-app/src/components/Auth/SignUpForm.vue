<template>
  <div class="ui stackable three column centered grid container">
    <div class="column">
      <h2 class="ui dividing header">Cadastre-se, é Grátis!</h2>

      <Notification
        :message="notification.message"
        :type="notification.type"
        v-if="notification.message"
      />

      <form class="ui form" @submit.prevent="handleSubmit">
          <div class="field">
          <label>Nome Completo</label>
          <input type="text" name="name" v-model="name" placeholder="Nome Completo">
          <span v-if="submitted && !$v.name.required"  class="is-danger">Nome completo é obrigatório</span>
          </div>
          <div class="field">
          <label>Nome de usuário</label>
          <input type="text" name="username" v-model="username" placeholder="@usuario">
           <span v-if="submitted && !$v.username.required"  class="is-danger">Nome de usuário é obrigatório</span>
          </div>
          <div class="field">
          <label>Email</label>
          <input type="email" name="email" v-model="email" placeholder="Email">
           <span v-if="submitted && !$v.email.required"  class="is-danger">Email é obrigatório</span>
           <span v-if="submitted && !$v.email.email"  class="is-danger">Email inválido</span>
          </div>
          <div class="field">
          <label>Senha</label>
          <input type="password" name="password" v-model="password" placeholder="Senha">
          <span v-if="submitted && !$v.password.required"  class="is-danger">Senha é obrigatória</span>
          </div>
        <button class="fluid ui primary button">Cadastrar</button>

        <div class="ui hidden divider"></div>
      </form>

      <div class="ui divider"></div>

      <div class="ui column grid">
        <div class="center aligned column">
          <p>
            Já tem conta? <router-link to="/login">Log In</router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { required, email } from 'vuelidate/lib/validators'

export default {

  name: 'SignUpForm',
  components: {
    Notification
  },
  data () {
    return {
      submitted: false,
      name: '',
      username: '',
      email: '',
      password: '',
      notification: {
        message: '',
        type: ''
      }
    }
  },
  validations: {
    name: {
      required
    },
    username: {
      required
    },
    password: {
      required
    },
    email: {
      required, email
    }
  },
  computed: {
    isFormValid () {
      return Object.keys(this.fields).every(key => this.fields)
    }
  },
  beforeRouteEnter (to, from, next) {
    const token = localStorage.getItem('tweetr-token')

    return token ? next('/') : next()
  },
  methods: {
    handleSubmit (e) {
      this.submitted = true

      // stop here if form is invalid
      this.$v.$touch()
      if (this.$v.$invalid) {
        return
      }
      // do request
      this.signup()
    },
    signup () {
      axios
        .post('/signup', {
          name: this.name,
          username: this.username,
          email: this.email,
          password: this.password
        })
        .then(response => {
          // save token in localstorage
          localStorage.setItem('tweetr-token', response.data.data.token)

          // redirect to user home
          this.$router.push('/')
        })
        .catch(error => {
          // display error notification
          this.notification = Object.assign({}, this.notification, {
            message: error.response.data.message,
            type: error.response.data.status
          })
        })
    }
  }
}
</script>
