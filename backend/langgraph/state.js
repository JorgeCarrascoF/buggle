const { Annotation } = require("@langchain/langgraph");

const state = Annotation.Root({
    sentry_log: Annotation({ reducer: (x, y) => y ?? x, default: () => null }),
    owner: Annotation({ reducer: (x, y) => y ?? x, default: () => null }),
    repo: Annotation({ reducer: (x, y) => y ?? x, default: () => null }),
    branch: Annotation({ reducer: (x, y) => y ?? x, default: () => "main" }),
    file_detected: Annotation({ reducer: (x, y) => y ?? x, default: () => null }),
    commits: Annotation({ reducer: (x, y) => y ?? x, default: () => [] }),
    commit_files: Annotation({ reducer: (x, y) => y ?? x, default: () => [] }),
    responsible: Annotation({ reducer: (x, y) => y ?? x, default: () => null }),
    report: Annotation({ reducer: (x, y) => y ?? x, default: () => null }),
  });
  
module.exports = { state };