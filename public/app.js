/* eslint-disable */
Vue.component('button-counter', {
  data: function() {
    return {
      count: 0
    };
  },
  template:
    '<button v-on:click="count++">You clicked me {{ count }} times.</button>'
});

Vue.component('shortener-form', {
  template: `
    <section>
      <b-field label="Name">
        <b-input value="Kevin Garvey"></b-input>
      </b-field>

      <b-field label="Email" type="is-danger" message="This email is invalid">
        <b-input type="email" value="john@" maxlength="30">
        </b-input>
      </b-field>

      <b-field label="Username" type="is-success" message="This username is available">
        <b-input value="johnsilver" maxlength="30"></b-input>
      </b-field>

      <b-field label="Password" type="is-warning"
        :message="['Password is too short', 'Password must have at least 8 characters']">
        <b-input value="123" type="password" maxlength="30"></b-input>
      </b-field>
    </section>
  `
});

new Vue({
  el: '#app'
});
