const path = require('path');
const fs = require('fs');
const http = require('http');
const PORT = process.env.PORT ||5000;

const server = http.createServer((req, res) => {
    // Build the path to the requested file:
    let filePath = path.join(
        __dirname, 
        'public', 
        req.url === '/' ? 'index.html' : req.url,
    );
    let extension = path.extname(filePath);

    let contentType = '';
    switch (extension) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.jpg':
            contentType = 'image/png';
            break;
        default:
            contentType = 'text/html'
            break;
    }

    // Read the requested file:
    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                fs.readFile(path.join(__dirname, 'public', '404.html'), (errOf404, contentOf404) => {
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end(contentOf404, 'utf-8');
                });
            } else {
                // If it's not a 404 error then it must some server side error:
                res.writeHead(500, { 'Content-Type': 'text/html' });
                res.end(`Server Error: ${err.code} ${err.message}`);
            }
        } else {
            // Successful request:
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8'); 
        }
    });
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));