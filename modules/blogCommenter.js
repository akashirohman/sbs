const fs = require('fs');
const axios = require('axios');
const path = require('path');

const blogListPath = path.join(__dirname, '../data/blog-list.txt');
const commentTemplatesPath = path.join(__dirname, '../data/comment-templates.txt');

function getRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function runBlogCommenter(targetUrl, anchorText, threadIndex, stat) {
  const blogs = fs.readFileSync(blogListPath, 'utf-8').split('\n').filter(Boolean);
  const comments = fs.readFileSync(commentTemplatesPath, 'utf-8').split('\n').filter(Boolean);

  for (const blog of blogs) {
    const comment = getRandom(comments).replace(/\{url\}/g, targetUrl).replace(/\{anchor\}/g, anchorText);

    try {
      stat.current = `Posting ke ${blog}`;
      // Simulasi kirim komentar (HARUS diganti sesuai form target nyata)
      const res = await axios.post(blog, {
        name: "Akashirohman",
        email: `seo${threadIndex}@mail.com`,
        website: targetUrl,
        comment: comment
      }, { timeout: 10000 });

      stat.sent++;
      if (res.status === 200) {
        stat.success++;
        fs.appendFileSync(path.join(__dirname, '../data/backlink-success.txt'), `${blog}\n`);
      } else {
        stat.failed++;
      }

    } catch (e) {
      stat.failed++;
      stat.current = `Gagal posting ke ${blog}`;
    }
  }

  stat.current = 'Selesai';
}
module.exports = { runBlogCommenter };
