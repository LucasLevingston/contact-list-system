import { setupApp } from './setup'

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000

const app = setupApp()

app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on port ${port}`)
})
