const counterLogin = {
props: {
    user: null
},
data() { return {
    username: '',
    password: '',
    loginMessage: 'User will be created if not existing<br>There is <u>no</u> password recovery',
}},
mounted() {
    [this.username, this.password] =
        localStorage.getItem('credentials')?.split(':') || []
    setTimeout(this.logIn, 10)
},
methods: {
    logIn() {
        if (this.username && this.password)
            this.user.auth(this.username, this.password, at => {
                if (at.ack) 
                    this.loggedIn()
                else
                    this.user.create(this.username, this.password, this.loggedIn)
            })
    },
    loggedIn() {
        localStorage.setItem('credentials', `${this.username}:${this.password}`)
        this.username = ''
        this.password = ''
        this.$emit('logged-in')
    }
},
template:
    /*html*/
    `<div class="row">
        <div class="col m-3">
            <form @submit.prevent="logIn">
                <input class="m-1" type="text" v-model="username" placeholder="user name"><br>
                <input class="m-1" type="password" v-model="password" placeholder="password"><br>
                <div class="m-3" v-html="loginMessage"></div>
                <button type="submit" class="btn btn-primary">log in</button>
            </form>
        </div>
    </div>`
}