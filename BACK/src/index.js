const app = require('./app')

//have added a dev.env file which is ignored by GIT so the port is decided by the file if local, or by heroku if up online. SMART
const port = process.env.PORT

app.listen(port, ()=>{
    console.log('server is up on port '+port)
})
