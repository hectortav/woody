var s = document.createElement("script");
s.src = chrome.runtime.getURL("src/pages/background/index.js");
(document.head || document.documentElement).appendChild(s);

const body = document.getElementsByTagName("body")[0];

chrome.storage.local.get(
  ["net", "log", "error", "warn", "info"].map(
    (cls) => `woody_visible_classes_${cls}`,
  ),
  (result) => {
    const div = document.createElement("div");
    div.setAttribute("class", "logger_container");

    div.innerHTML = `
        <ul id="debugList" class="logger_list">
        </ul>
        <div style="display:flex;gap:0.5rem;">
            <button id="logger_hide" class="logger_action" style="margin-left:auto;">✕</button>
            <div class="logger_bubbles">
                <input type="text" id="logger_filter" class="logger_input" placeholder="Filter logs..." style="width:250px;">
                <div id="logger_net" class="logger_bubble bg-green ${result["woody_visible_classes_net"] ? "logger_inactive" : ""}">Network</div>
                <div id="logger_log" class="logger_bubble bg-white ${result["woody_visible_classes_log"] ? "logger_inactive" : ""}">Log</div>
                <div id="logger_info" class="logger_bubble bg-blue ${result["woody_visible_classes_info"] ? "logger_inactive" : ""}">Info</div>
                <div id="logger_warn" class="logger_bubble bg-yellow ${result["woody_visible_classes_warn"] ? "logger_inactive" : ""}">Warning</div>
                <div id="logger_error" class="logger_bubble bg-red ${result["woody_visible_classes_error"] ? "logger_inactive" : ""}">Error</div>
                <div id="logger_clear" class="logger_action">Clear</div>
            </div>
        </div>
        `;

    body.appendChild(div);
    ["net", "log", "error", "warn", "info"].forEach((cls) => {
      if (!document.getElementById(`logger_${cls}`)) return;
      document.getElementById(`logger_${cls}`)!.onclick = async () => {
        const inactive = document
          .getElementById(`logger_${cls}`)
          ?.classList.contains("logger_inactive");

        await chrome.storage.local.set({
          [`woody_visible_classes_${cls}`]: !inactive,
        });
      };
    });
  },
);
