import fs from "node:fs/promises"

const databasePath = new URL('../db.json', import.meta.url)


export class Database {
    #database = {}

    constructor() {
        fs.readFile(databasePath, 'utf-8').then(data => {
            this.#database = JSON.parse(data)
        })
            .catch(() => {
                this.#persist()
            })
    }

    #persist() {
        fs.writeFile(databasePath, JSON.stringify(this.#database))
    }

    insert(table, data) {
        if (Array.isArray(this.#database[table])) {
            this.#database[table].push(data)
        } else {
            this.#database[table] = [data]
        }

        this.#persist()

        return data
    }

    select(table, search) {
        let data = this.#database[table] ?? []

        if (search) {
            data = data.filter(row => {
                return Object.entries(search).some(([key, value]) => {
                    return row[key].toLowerCase().includes(value)
                })
            })
        }

        return data
    }

    update(table, id, data) {
        const rowIndex = this.#database[table].findIndex(row => row.id === id)
        const { title, description } = data

        if (rowIndex > -1) {
            const updateData = {
                id,
                title: title ? title : this.#database[table][rowIndex].title,
                description: description ? description : this.#database[table][rowIndex].description,
                completed_at: this.#database[table][rowIndex].completed_at,
                created_at: this.#database[table][rowIndex].created_at,
                updated_at: new Date()
            }
            this.#database[table][rowIndex] = updateData
            this.#persist()
        }
        return this.#database[table][rowIndex]
    }

    delete(table, id) {
        const rowIndex = this.#database[table].findIndex(row => row.id === id)

        if (rowIndex > -1) {
            this.#database[table].splice(rowIndex, 1)
            this.#persist()
        }
        return rowIndex
    }

    patch(table, id) {
        const rowIndex = this.#database[table].findIndex(row => row.id === id)

        if (rowIndex > -1) {
            if (this.#database[table][rowIndex].completed_at == null) {
                this.#database[table][rowIndex].completed_at = new Date();
                this.#database[table][rowIndex].updated_at = new Date();
            }
            else{
                this.#database[table][rowIndex].completed_at = null;
            }

            this.#persist()
        }
        return this.#database[table][rowIndex]
    }
}