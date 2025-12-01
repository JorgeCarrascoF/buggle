const { StateGraph, END } = require("@langchain/langgraph");
const { state } = require("./state");
const { model, octokit, getFileFromCulprit } = require("./utils");

async function parseCulpritNode(state) {
  if (!state.sentry_log?.culprit) {
    console.log("⚠️ No se encontró 'culprit' en el log de Sentry");
    return { ...state, report: "No se puede generar reporte: 'culprit' vacío" };
  }

  const file_detected = await getFileFromCulprit(
    state.owner,
    state.repo,
    state.sentry_log.culprit,
    state.branch
  );
  console.log("📂 Archivo detectado:", file_detected.path);

  return { ...state, file_detected };
}

async function getCommitsNode(state) {
  const res = await octokit.repos.listCommits({
    owner: state.owner,
    repo: state.repo,
    sha: state.branch,
    path: state.file_detected.path,
    per_page: 3,
    until: state.sentry_log.created_at || undefined,
  });

  console.log("🔍 Commits encontrados:");
  res.data.forEach((c) =>
    console.log(`${c.sha} - ${c.commit.author.date} - ${c.commit.message}`)
  );

  return { ...state, commits: res.data };
}

async function getCommitFilesNode(state) {
  const commitSha = state.commits?.[0]?.sha;
  if (!commitSha) return { ...state, commit_files: [] };

  const res = await octokit.repos.getCommit({
    owner: state.owner,
    repo: state.repo,
    ref: commitSha,
  });

  const files = res.data.files.map((file) => ({
    filename: file.filename,
    status: file.status,
    additions: file.additions,
    deletions: file.deletions,
    patch: file.patch || "(sin diff disponible)",
  }));

  console.log(
    `📌 Último commit que tocó ${state.file_detected.path}: ${commitSha}`
  );
  files.forEach((f) => {
    console.log(`\n📄 ${f.filename} (${f.status})`);
    console.log(f.patch);
  });

  return { ...state, commit_files: files };
}

async function generateReportNode(state) {
  const prompt = `
    Generate an error report based on the following data:

    - Detected file: ${state.file_detected?.path}
    - Recent commits (up to date): ${JSON.stringify(state.commits || [], null, 2)}
    - Last commit that modified the file (with diffs):
    ${state.commit_files.map(f => `File: ${f.filename}\nPatch:\n${f.patch}`).join("\n\n")}

    The report should explain:
    1. In which file the error occurred.
    2. Which code fragment is related (according to the patch).
  `;

  const res = await model.invoke(prompt);
  return { ...state, report: res.content };
}

async function generateReportSinGithubNode(state) {
  const prompt = `
      Generate an error report based on the following data:
      - log: ${state.file_detected.sentry_log}      
      The report should explain:
      1. In which file the error occurred.
      `;
}
/* ------------------ Grafo ------------------ */
const graph = new StateGraph(state)
  .addNode("parseCulprit", parseCulpritNode)
  .addNode("getCommits", getCommitsNode)
  .addNode("getCommitFiles", getCommitFilesNode)
  .addNode("generateReport", generateReportNode)
  .addNode("generateReportSinGithub", generateReportSinGithubNode)
  .addConditionalEdges("parseCulprit", (s) => {
    // Si ya tenemos report, terminamos ahí
    if (s.report) return END;
    if (s.file_detected === "Not found file") return "generateReportSinGithub";
    return "getCommits";
  })
  .addEdge("getCommits", "getCommitFiles")
  .addEdge("getCommitFiles", "generateReport")
  .addEdge("generateReport", END)
  .addEdge("generateReportSinGithub", END)
  .setEntryPoint("parseCulprit");

const app = graph.compile();

/* ------------------ Ejecución ------------------ */
async function main() {
  const sentryLog = require("./sentry_3.json");

  console.log("✅ Sentry log cargado:", sentryLog.culprit);

  const input = {
    sentry_log: sentryLog,
    owner: "JorgeCarrascoF",
    repo: "frontend",
    branch: "main",
  };

  const result = await app.invoke(input);
  console.log("\n📌 Reporte generado:\n", result.report);
}

module.exports = { app };
