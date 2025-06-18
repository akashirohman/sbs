// modules/wordpressPoster.js

const axios = require('axios');
const jsdom = require('jsdom');
const fs = require('fs');
const { getComment } = require('./commentTemplate');
const path = require('path');

async function postComment(blogUrl, targetUrl, anchorText, stat) {
  stat.sent++;
  stat.current = `📬 Fetching ${blogUrl}`;

  const resp = await axios.get(blogUrl, { timeout: 10000 });
  const { document } = new jsdom.JSDOM(resp.data).window;

  const form = document.querySelector('form[action*="wp-comments-post.php"]');
  if (!form) {
    stat.failed++;
    stat.current = `⛔ No WP comment form`;
    return;
  }

  const action = new URL(form.action, blogUrl).href;
  const data = {};

  form.querySelectorAll('input, textarea').forEach(el => {
    const n = el.name;
    if (!n) return;
    if (n === 'author') data[n] = 'Akashirohman';
    else if (n === 'email') data[n] = `seo${Date.now().toString().slice(-4)}@mail.com`;
    else if (n === 'url') data[n] = targetUrl;
    else if (n === 'comment') data[n] = getComment(targetUrl, anchorText);
    else data[n] = el.value || '';
  });

  await axios.post(action, new URLSearchParams(data).toString(), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    timeout: 10000
  });

  stat.success++;
  stat.current = `✅ Posted to ${blogUrl}`;
  fs.appendFileSync(path.join(__dirname, '../data/backlink-success.txt'), blogUrl + '\n');
}

module.exports = { postComment };
