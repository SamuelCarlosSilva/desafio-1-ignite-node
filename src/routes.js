import { buildRoutePath } from "./utils/build-route-path.js";
import { randomUUID } from "node:crypto"
import { Database } from "./database.js";



const database = new Database()

export const routes = [
    {
        method: 'POST',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {

            const { title, description } = req.body
            if(title == null){
                res.writeHead(400).end(` { \n  message: "propriedade title não foi enviada."\n } `)
            }

            if(description == null){
                res.writeHead(400).end(` { \n  message: "propriedade description não foi enviada."\n } `)
            }

            const task = {
                id: randomUUID(),
                title,
                description,
                completed_at: null,
                created_at: new Date(),
                updated_at: new Date()
            }

            database.insert("tasks", task)

            return res.writeHead(201).end(JSON.stringify(task))

        },

    },
    {
        method: 'GET',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const { search } = req.query

            const tasks = database.select('tasks', search ? {
                title: search,
                description: search
            } : null)

            return res.end(JSON.stringify(tasks))
        }
    },
    {
        method: 'PUT',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const { id } = req.params
            const { title, description } = req.body

        if(title || description){
            const updatedTask = database.update('tasks', id, {
                title,
                description
            })

            return updatedTask ? res.end(JSON.stringify(updatedTask)) : res.writeHead(404).end(` { \n  message: "id não encontrado"\n } `)
        }
        else{
            res.writeHead(400).end(` { \n  message: "Não foram enviados dados para alteração."\n } `)
        }
       
        }
    },
    {
        method: 'DELETE',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const { id } = req.params
            return (database.delete('tasks', id) > -1) ? res.end(` { \n  success: "task deletada"\n } `) : res.writeHead(404).end(` { \n  message: "id não encontrado"\n } `)
        }
    },
    {
        method: 'PATCH',
        path: buildRoutePath('/tasks/:id/complete'),
        handler: (req, res) => {
            const { id } = req.params
            
            const patchedTask = database.patch('tasks', id)

            return patchedTask ? res.end(JSON.stringify(patchedTask)) : res.writeHead(404).end(` { \n  message: "id não encontrado"\n } `)
        }
    }
]