const fetch = require('node-fetch');

const NOTION_API_TOKEN = process.env.NOTION_API_TOKEN;
const HASHNODE_API_TOKEN = process.env.HASHNODE_API_TOKEN;

async function fetchNotionArticles() {
  const response = await fetch('https://api.notion.com/v1/pages', {
    headers: {
      'Authorization': `Bearer ${NOTION_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
  });
  const data = await response.json();
  return data.results; // 假設這裡抓到文章
}

async function publishToHashnode(article) {
  const response = await fetch('https://api.hashnode.com', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${HASHNODE_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `
        mutation {
          createStory(input: {
            title: "${article.title}",
            contentMarkdown: "${article.content}"
          }) {
            code
            success
            message
          }
        }
      `,
    }),
  });
  const result = await response.json();
  console.log(result);
}

async function main() {
  const articles = await fetchNotionArticles();
  for (const article of articles) {
    await publishToHashnode(article);
  }
}

main().catch(console.error);