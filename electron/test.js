const { app } = require("electron");

console.log("app is:", app);

app.on("ready", () => {
  console.log("Electron is ready 🚀");
});
