const { spawn } = require("child_process");
const path = require("path");

const ls = spawn(
    process.platform === "win32" ? "npm.cmd" : "npm",
    ["run", "start"],
    { cwd: path.join(__dirname), shell: true }
  );

ls.stdout.on("data", (data) => {
  console.log(`stdout: ${data}`);
});

ls.stderr.on("data", (data) => {
  console.error(`stderr: ${data}`);
});

ls.on("close", (code) => {
  console.log(`child process exited with code ${code}`);
});
