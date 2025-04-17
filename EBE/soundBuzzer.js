const { spawn } = require("child_process");
const readline = require("readline");
const path = require("path");
const os = require("os");

const alertFilePath = path.join(__dirname, "assets", "alert.mp3");

let vlcProcess = null;

// Function to start buzzer
function startBuzzer() {
  if (vlcProcess) return; // already buzzing

  // 🚨 Launch VLC in headless (no GUI) loop mode
  vlcProcess = spawn("vlc", [alertFilePath, "--intf", "dummy", "--loop", "--no-video"], {
    stdio: "ignore",
    shell: true
  });

  console.log("🔴 Red alert! Buzzer is playing...\nPress ENTER to stop.");
}

// Function to stop buzzer
function stopBuzzer() {
  if (vlcProcess) {
    // ✅ This works on Windows too
    vlcProcess.kill("SIGTERM");
    vlcProcess = null;
    console.log("✅ Buzzer stopped.");
    process.exit(0);
  }
}

// Start the buzzer
startBuzzer();

// Wait for ENTER key
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on("line", stopBuzzer);
