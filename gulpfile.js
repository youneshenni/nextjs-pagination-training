const { spawn } = require("child_process");
const { stdout, stderr, stdin } = require("process");
/**
 * Run dev server
 * Run tests
 * Log output to console
 * cross-env NODE_ENV=test jest --watch
 */
function test() {
  const process = spawn(
    "ts-node --project tsconfig.server.json server/index.ts",
    { shell: true }
  );
  process.stdout.on("data", (data) => {
    console.log("Server:", data.toString());
    if (data.toString() === "event - compiled successfully\n") {
      spawn("yarn jest", { shell: true, stdio: [stdin, stdout, stderr] });
    }
  });
}

module.exports = { default: test };
