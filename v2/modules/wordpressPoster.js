const axios = require('axios');
const jsdom = require('jsdom');
const fs = require('fs');
const { getComment } = require('./commentTemplate');
const path = require('path');

async function postComment(blogUrl, targetUrl, anchorText, stat) {
  stat.sent++;
  try {
    const resp = await axios.get(blogUrl, { timeout: 10000 });
    const { document } = new jsdom.JSDOM(resp.data).window;

    const form = document.querySelector('form[action*="wp-comments-post.php"]');
    if (!form) {
      stat.failed++;
      return;
    }

    const action = new URL(form.action, blogUrl).href;
    const data = {};

    form.querySelectorAll('input, textarea').forEach(el => {
      const name = el.name;
      if (!name) return;
      if (name === 'author') data[name] = 'Akashirohman';
      else if (name === 'email') data[name] = `seo${Date.now().toString().slice(-5)}@mail.com`;
      else if (name === 'url') data[name] = targetUrl;
      else if (name === 'comment') data[name] = getComment(targetUrl, anchorText);
      else data[name] = el.value || '';
    });

    await axios.post(action, new URLSearchParams(data).toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      timeout: 10000
    });

    fs.appendFileSync(path.join(__dirname, '../data/backlink-success.txt'), blogUrl + '\n');
    stat.success++;
  } catch {
    stat.failed++;
  }
}

module.exports = { postComment };
