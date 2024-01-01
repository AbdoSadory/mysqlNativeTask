import express from 'express'
import connection from './DB/connection.js'
import userRouter from './Src/models/user/user.routes.js'
import productRouter from './Src/models/product/product.routes.js'

const app = express()

app.use(express.json())
connection

app.use(userRouter)
app.use(productRouter)

app.get('/', (req, res, next) => {
  res.json({ message: 'Hello To Assignment 4' })
})
app.all('*', (req, res, next) => {
  res.json({ message: 'Invalid URL' })
})
app.listen(3000, () => {
  console.log('Server is running on 3000 🔥🔥🔥')
})
