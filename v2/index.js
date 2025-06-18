const fs = require('fs');
const readline = require('readline');
const inquirer = require('inquirer');
const chalk = require('chalk');
const { postComment } = require('./modules/wordpressPoster');

async function main() {
  console.clear();
  console.log(chalk.greenBright.bold('SBS - SEO BACKLINKS SUBMITTER'));
  console.log(chalk.gray('By : Akashirohman and Team\n'));

  const { targetUrl, anchorText, threadCount, startNow } = await inquirer.prompt([
    { name: 'targetUrl', message: '🔗 URL Website Anda:', type: 'input' },
    { name: 'anchorText', message: '🏷  Kata Kunci (Anchor):', type: 'input' },
    { name: 'threadCount', message: '💥 Jumlah Thread (maks 50):', type: 'number', default: 10 },
    { name: 'startNow', message: '🚀 Mulai Sekarang?', type: 'confirm' },
  ]);

  if (!startNow) {
    console.log('❌ Dibatalkan.');
    return;
  }

  const blogs = fs.readFileSync('./data/blog-list.txt', 'utf-8').split('\n').filter(Boolean);
  const stats = Array.from({ length: threadCount }, () => ({ sent: 0, success: 0, failed: 0 }));

  for (let i = 0; i < threadCount; i++) {
    handleThread(i, blogs, targetUrl, anchorText, stats[i], threadCount);
  }

  setInterval(() => {
    readline.cursorTo(process.stdout, 0, 7);
    stats.forEach((s, i) => {
      console.log(chalk`[{cyan T${i + 1}}] 📨 {yellow ${s.sent}} ✅ {green ${s.success}} ❌ {red ${s.failed}}`);
    });
    readline.cursorTo(process.stdout, 0);
    console.log('\n🛑 Ketik "stop" lalu Enter untuk menghentikan.\n');
  }, 2000);

  const rl = readline.createInterface({ input: process.stdin });
  rl.on('line', (input) => {
    if (input.trim().toLowerCase() === 'stop') {
      console.log(chalk.redBright('\n🛑 Tools dihentikan oleh pengguna.'));
      process.exit();
    }
  });
}

function handleThread(index, blogs, targetUrl, anchorText, stat, totalThreads) {
  let current = index;
  (async function loop() {
    while (current < blogs.length) {
      const blogUrl = blogs[current];
      try {
        await postComment(blogUrl, targetUrl, anchorText, stat);
      } catch {
        stat.failed++;
      }
      current += totalThreads;
    }
  })();
}

main();
