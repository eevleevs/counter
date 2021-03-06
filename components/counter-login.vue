const counterLogin = {
props: {
    user: null
},
data() { return {
    username: '',
    password: '',
    message: 'There is <u>no</u> password recovery',
    visible: false,
}},
mounted() {
    [this.username, this.password] =
        localStorage.getItem('credentials')?.split(':') || []
    setTimeout(() => {
        if (this.username && this.password)
            this.logIn()
        else
            this.visible = true    
    }, 10)
},
methods: {
    logIn() {
        this.spin()
        this.user.auth(this.username, this.password, at => {
            if (at.ack) 
                this.loggedIn()
            else {
                this.message = 'Invalid credentials'
                this.visible = true
            }
        })
    },
    loggedIn() {
        localStorage.setItem('credentials', `${this.username}:${this.password}`)
        this.username = ''
        this.password = ''
        this.$emit('logged-in')
    },
    newUser() {
        this.spin()
        this.user.create(this.username, this.password, ack => {
            if (ack.err)
                this.message = 'User exists'
            else
                this.user.auth(this.username, this.password, () => this.loggedIn())
        })
    },
    spin() {
        this.message = /*html*/`<i class="fas fa-spinner fa-spin"></i>`
    }
},
template:
    /*html*/
    `<form v-if="visible" @submit.prevent>
        <input class="m-1" type="text" v-model="username" placeholder="user name"><br>
        <input class="m-1" type="password" v-model="password" placeholder="password"><br>
        <div class="m-3" v-html="message"></div>
        <button @click="logIn" class="btn btn-primary m-1">log in</button>
        <button @click="newUser" class="btn btn-primary m-1">new user</button>
    </form>`
}