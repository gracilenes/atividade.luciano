const http = require('http');
const fs = require('fs');
const path = require('path');
const { url } = require('inspector');

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url,true);
    const pathname = parsedUrl.pathname;
})

