#!/usr/bin/env node
const inquirer = require('inquirer');
const chalk = require('chalk');
const readline = require('readline');
const { runBlogCommenter } = require('./modules/blogCommenter');
const { runWeb2Submitter } = require('./modules/web2Submitter');
const { runSocialBookmark } = require('./modules/socialBookmarker');
const { runPingService } = require('./modules/pingService');

console.clear();
console.log(chalk.greenBright.bold('SBS - SEO BACKLINKS SUBMITTER'));
console.log(chalk.gray('By : Akashirohman and Team\n'));

let config = {};

(async () => {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'targetUrl',
      message: '🔗 Masukkan URL utama website Anda (untuk backlink):',
    },
    {
      type: 'input',
      name: 'anchorText',
      message: '🔍 Masukkan kata kunci (anchor text) target:',
    },
    {
      type: 'number',
      name: 'threadCount',
      message: '🚀 Jumlah pasukan (thread) yang ingin dijalankan? (max: 50)',
      default: 10,
      validate: (val) => val > 0 && val <= 50 ? true : 'Antara 1 - 50 saja!',
    },
    {
      type: 'confirm',
      name: 'startNow',
      message: 'Mulai sekarang?',
    },
  ]);

  if (!answers.startNow) {
    console.log(chalk.redBright('\n❌ Dibatalkan.\n'));
    process.exit();
  }

  config = { ...answers };
  console.clear();
  console.log(chalk.greenBright.bold('SBS - SEO BACKLINKS SUBMITTER'));
  console.log(chalk.gray('By : Akashirohman and Team\n'));

  const stats = [];

  for (let i = 0; i < config.threadCount; i++) {
    stats[i] = { sent: 0, success: 0, failed: 0, current: 'Idle' };
    runThread(i, stats[i]);
  }

  setInterval(() => {
    readline.cursorTo(process.stdout, 0, 2);
    stats.forEach((s, i) => {
      const line = chalk`[{cyan T${i + 1}}] 📨 {yellow ${s.sent}} ✅ {green ${s.success}} ❌ {red ${s.failed}} 🔍 {gray ${s.current}}`;
      readline.clearLine(process.stdout, 0);
      process.stdout.write(line + '\n');
    });
    readline.cursorTo(process.stdout, 0);
    console.log(chalk.gray('\n🛑 Ketik "stop" lalu Enter untuk menghentikan.\n'));
  }, 1000);

  const rl = readline.createInterface({ input: process.stdin });
  rl.on('line', (input) => {
    if (input.trim().toLowerCase() === 'stop') {
      console.log(chalk.redBright('\n🛑 Dihentikan oleh pengguna.'));
      process.exit();
    }
  });
})();

function runThread(index, stat) {
  const pick = Math.random();
  if (pick < 0.25) return runBlogCommenter(config.targetUrl, config.anchorText, index, stat);
  if (pick < 0.5) return runWeb2Submitter(config.targetUrl, config.anchorText, index, stat);
  if (pick < 0.75) return runSocialBookmark(config.targetUrl, config.anchorText, index, stat);
  return runPingService(config.targetUrl, config.anchorText, index, stat);
}
