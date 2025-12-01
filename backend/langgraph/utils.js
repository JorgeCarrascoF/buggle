const { Octokit } = require("@octokit/rest");
const { AzureChatOpenAI } = require("@langchain/openai");
require("dotenv").config();

const model = new AzureChatOpenAI({
    model: "gpt-4o",
    temperature: 0,
    maxTokens: undefined,
    maxRetries: 2,
    azureOpenAIApiKey: process.env.AZURE_OPENAI_API_KEY,
    azureOpenAIApiInstanceName: process.env.AZURE_OPENAI_API_INSTANCE_NAME, 
    azureOpenAIApiDeploymentName: process.env.AZURE_OPENAI_API_DEPLOYMENT_NAME, 
    azureOpenAIApiVersion: process.env.AZURE_OPENAI_API_VERSION, 
  });


const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

async function getFileFromCulprit(owner, repo, culprit, branch = "main") {
  const regex = /\((.*?)\)/; 
  const match = culprit.match(regex);

  if (!match) {
    console.log('File not found')
    return { path: 'File not found'};
  }
  const basePath = match[1]; 

  const refData = await octokit.git.getRef({ owner, repo, ref: `heads/${branch}` });
  const commitSha = refData.data.object.sha;

  const commitData = await octokit.git.getCommit({
    owner,
    repo,
    commit_sha: commitSha,
  });

  const treeData = await octokit.git.getTree({
    owner,
    repo,
    tree_sha: commitData.data.tree.sha,
    recursive: "true",
  });

  const candidates = treeData.data.tree.filter(
    (item) => item.type === "blob" && item.path.startsWith(basePath)
  );

  if (candidates.length === 0) {
    console.log('File not found')
    return { path: 'File not found'};
  }

  const file = candidates[0];
  console.log(file)
  return { path: file.path };

}

hola = getFileFromCulprit('JorgeCarrascoF','frontend', '_v(assets/index-D474ht0A)')

console.log(hola);
module.exports = { 
  model,
  octokit,
  getFileFromCulprit
};