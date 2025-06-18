// modules/commentTemplate.js

const fs = require('fs');
const path = require('path');
const templates = fs.readFileSync(path.join(__dirname, '../data/comment-templates.txt'), 'utf-8').split('\n').filter(Boolean);

function getComment(targetUrl, anchorText) {
  const t = templates[Math.floor(Math.random() * templates.length)];
  return t.replace(/\{url\}/g, targetUrl).replace(/\{anchor\}/g, anchorText);
}

module.exports = { getComment };
