import fs from 'fs';
import { parse } from 'csv-parse';


const filePath = 'teste.csv'

const fileContent = fs.createReadStream(filePath)


const parser = parse({
    delimiter: ',',
    from_line: 2
})


async function insertData(){
    const contentParse = fileContent.pipe(parser)
    
    for await (const row of contentParse){
        var task = {
            title: row[0],
            description: row[1]
        }
        
        await fetch('http://localhost:3334/tasks', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(task)
          })
    }


}

insertData()
