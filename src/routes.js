import { buildRoutePath } from "./utils/build-route-path.js";
import {randomUUID} from "node:crypto"
import { Database } from "./database.js";


const database = new Database()

export const routes = [
    {
        method: 'POST',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {

            const { title, description } = req.body

            const task = {
                id: randomUUID(),
                title,
                description,
                completed_at: null,
                created_at: new Date(),
                updated_at: new Date()
            }

            database.insert("tasks", task)

            return res.writeHead(201).end('Task criada')

        }
    }
]