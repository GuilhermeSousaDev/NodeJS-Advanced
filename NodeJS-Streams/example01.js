
import http from 'http';

import { createReadStream } from 'fs';

http.createServer((req, res) => {
    createReadStream('big.file')
        .pipe(res)
}).listen(8081, () => console.log('running at 8081'))


import net from 'net';

net.createServer(socket => socket.pipe(process.stdout)).listen(1338)

//node -e "process.stdin.pipe(require('net').connect(1338))"