import express from 'express'
import connectDB from './db/db.connection.js'
import userController from './modules/user/user.controller.js'
import noteController from './modules/notes/note.controller.js'
const bootstrap = () => {
    const app = express()
    const port = 3000
    //bdConnection
    connectDB()

    app.use(express.json())
    app.get('/', (req, res) => res.send('Hello World!'))
    app.use('/user', userController)
    app.use('/note', noteController)
    app.listen(port, () => console.log(`Example app listening on port ${port}!`))
}
export default bootstrap