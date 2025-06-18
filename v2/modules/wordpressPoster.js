// Dummy posting module (replace with real logic)
const { getComment } = require('./commentTemplate');

async function postComment(blogUrl, targetUrl, anchorText, stat) {
  stat.sent++;
  const comment = getComment(targetUrl, anchorText);
  console.log(`[${blogUrl}] -> ${comment}`);
  stat.success++;
}

module.exports = { postComment };
