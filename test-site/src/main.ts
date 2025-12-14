import "./style.css";
import { enableChaos, disableChaos } from "bedlam";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
    <h1>🌪️ Bedlam - Chaos Engineering Test</h1>
    <p class="description">
      Test your site's resilience by randomly failing API requests
    </p>

    <div class="controls">
      <div class="control-group">
        <label for="failRate">Fail Rate: <span id="failRateValue">20%</span></label>
        <input type="range" id="failRate" min="0" max="100" value="20" />
      </div>

      <div class="control-group">
        <label for="delayMs">Delay (ms): <span id="delayMsValue">0</span></label>
        <input type="range" id="delayMs" min="0" max="5000" value="0" step="100" />
      </div>

      <div class="control-group">
        <label for="mode">Error Mode:</label>
        <select id="mode">
          <option value="reject">Reject Promise</option>
          <option value="http-500">HTTP 500</option>
        </select>
      </div>

      <div class="button-group">
        <button id="enableChaos" class="btn btn-danger">Enable Chaos</button>
        <button id="disableChaos" class="btn btn-success" disabled>Disable Chaos</button>
      </div>
    </div>

    <div class="test-section">
      <h2>Test API Requests</h2>
      <button id="testFetch" class="btn btn-primary">Make Test Request</button>
      <div id="results"></div>
    </div>
  </div>
`;

// Get elements
const failRateSlider = document.querySelector<HTMLInputElement>("#failRate")!;
const failRateValue =
  document.querySelector<HTMLSpanElement>("#failRateValue")!;
const delayMsSlider = document.querySelector<HTMLInputElement>("#delayMs")!;
const delayMsValue = document.querySelector<HTMLSpanElement>("#delayMsValue")!;
const modeSelect = document.querySelector<HTMLSelectElement>("#mode")!;
const enableBtn = document.querySelector<HTMLButtonElement>("#enableChaos")!;
const disableBtn = document.querySelector<HTMLButtonElement>("#disableChaos")!;
const testBtn = document.querySelector<HTMLButtonElement>("#testFetch")!;
const resultsDiv = document.querySelector<HTMLDivElement>("#results")!;

// Update slider values
failRateSlider.addEventListener("input", () => {
  failRateValue.textContent = `${failRateSlider.value}%`;
});

delayMsSlider.addEventListener("input", () => {
  delayMsValue.textContent = delayMsSlider.value;
});

// Enable chaos
enableBtn.addEventListener("click", () => {
  enableChaos({
    failRate: parseInt(failRateSlider.value) / 100,
    delayMs: parseInt(delayMsSlider.value),
    mode: modeSelect.value as "reject" | "http-500",
  });

  enableBtn.disabled = true;
  disableBtn.disabled = false;
  addResult("✅ Chaos mode enabled!", "success");
});

// Disable chaos
disableBtn.addEventListener("click", () => {
  disableChaos();

  enableBtn.disabled = false;
  disableBtn.disabled = true;
  addResult("✅ Chaos mode disabled!", "success");
});

// Test fetch
testBtn.addEventListener("click", async () => {
  const startTime = performance.now();
  addResult("🔄 Making request to JSONPlaceholder API...", "info");

  try {
    const response = await fetch(
      "https://jsonplaceholder.typicode.com/todos/1"
    );
    const duration = Math.round(performance.now() - startTime);

    if (response.ok) {
      const data = await response.json();
      addResult(`✅ Success (${duration}ms): ${data.title}`, "success");
    } else {
      // Handle error responses (like HTTP 500 from chaos mode)
      addResult(
        `⚠️ HTTP ${response.status} ${response.statusText} (${duration}ms)`,
        "error"
      );
    }
  } catch (error) {
    const duration = Math.round(performance.now() - startTime);
    addResult(
      `❌ Failed (${duration}ms): ${
        error instanceof Error ? error.message : String(error)
      }`,
      "error"
    );
  }
});

function addResult(message: string, type: "success" | "error" | "info") {
  const resultItem = document.createElement("div");
  resultItem.className = `result-item result-${type}`;
  resultItem.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
  resultsDiv.insertBefore(resultItem, resultsDiv.firstChild);

  // Keep only last 10 results
  while (resultsDiv.children.length > 10) {
    resultsDiv.removeChild(resultsDiv.lastChild!);
  }
}

// Initial info
addResult(
  "👋 Ready to test! Enable chaos mode and make some requests.",
  "info"
);
