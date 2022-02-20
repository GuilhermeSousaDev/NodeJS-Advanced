import { pipeline, Readable, Writable, Transform } from 'stream';
import { promisify } from 'util';
import { createWriteStream } from 'fs';

const pipelineAsync = promisify(pipeline);

const readableStream = Readable({
    read () {
        for (let i = 0; i < 1e5; i++) {
            const person = {
                id: Date.now() + i,
                name: `Guilherme-${i}`,
            }

            const data = JSON.stringify(person)
            this.push(data)
        }

        this.push(null);
    }
});

const writableMapToCsv = Transform({
    transform (chunk, encoding, cb) {
        const data = JSON.parse(chunk)

        const result = `${data.id}, ${data.name.toUpperCase()}\n`

        cb(null, result);
    }
});

const setHeader = Transform({
    transform (chunk, encoding, cb) {
        this.counter = this.counter ?? 0

        if(this.counter > 0) {
            return cb(null, chunk);
        }

        this.counter += 1

        cb(null, "id,name\n".concat(chunk));
    }
});

await pipelineAsync(
    readableStream,
    writableMapToCsv,
    setHeader,
    createWriteStream('my.csv'),
);
