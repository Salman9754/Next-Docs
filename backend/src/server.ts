import express from 'express'
import type { Request, Response } from 'express'

const app = express()
app.use(express.json())




app.get('/test', (req: Request, res: Response) => {
    res.send("App working")
})




export default app
