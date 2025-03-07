const generateId = () =>
  Date.now().toString(36) + Math.random().toString(36).substr(2, 5);

var logger_addToList = (message: any, variant: string) => {
  const styles: { [key: string]: string } = {
    net: "bg-green",
    log: "bg-white",
    info: "bg-blue",
    warn: "bg-yellow",
    error: "bg-red",
  };
  let display = "block";
  if (
    document
      .getElementById(`logger_${variant}`)
      ?.classList.contains("logger_inactive")
  ) {
    display = "none";
  }
  const id = generateId();

  document.getElementById("debugList")?.insertAdjacentHTML(
    "beforeend",
    `<li class="${styles[variant]} ${variant} message_bubble" style="display:${display};" id="${id}">
        <div style="display:flex;width:100%;">
            <div style="width:100%;">
              <p>${message}</p>
            </div>
            <div style="margin-left:auto;width:25px;">
              <button id="${id}_button" class="logger_x_button">✕</button>
            </div>
        </div>
    </li>`,
  );
  const button = document.getElementById(`${id}_button`);

  if (button !== null) {
    button.onclick = () => document.getElementById(`${id}`)?.remove();
  }
  return;
};

if (typeof console !== "undefined") {
  if (typeof console.log !== "undefined") {
    console.olog = console.log;
  } else {
    console.olog = () => {};
  }
  if (typeof console.error !== "undefined") {
    console.oerror = console.error;
  } else {
    console.oerror = () => {};
  }
  if (typeof console.warn !== "undefined") {
    console.owarn = console.warn;
  } else {
    console.owarn = () => {};
  }
  if (typeof console.info !== "undefined") {
    console.oinfo = console.info;
  } else {
    console.oinfo = () => {};
  }
}

console.log = (message: unknown) => {
  console.olog(message);
  logger_addToList(message, "log");
};

console.error = (message: unknown) => {
  console.oerror({ message });
  logger_addToList(message, "error");
};

console.warn = (message: unknown) => {
  console.owarn(message);
  logger_addToList(message, "warn");
};

console.info = (message: unknown) => {
  console.oinfo(message);
  logger_addToList(message, "info");
};

window.ofetch = window.fetch;
window.fetch = async (...args: Parameters<typeof fetch>) => {
  try {
    const res = await window.ofetch(...args);
    const [url, options] = args;
    let body = options?.body;
    try {
      if (typeof body === "string") {
        body = JSON.parse(body);
      }
    } catch (e) {}

    logger_addToList(
      `
      <div>
        <div>
          <b>${options?.method ?? "GET"}:</b> <a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>
        </div>
        ${
          options?.headers
            ? `<details>
            <summary><b>Headers: </b></summary>
            <pre>${JSON.stringify(options.headers, null, 2)}</pre>
          </details>
        `
            : ""
        }
        ${
          body
            ? `<details>
            <summary><b>Body: </b></summary>
              <pre>${JSON.stringify(body, null, 2)}</pre>
          </details>
        `
            : ""
        }
      </div>`,
      "net",
    );
    return res;
  } catch (e) {
    if (e instanceof Error) {
      logger_addToList("Error: " + JSON.stringify(e.message), "net");
    }
    throw e;
  }
};

var logger_hideByClass = (logger_class: string) => {
  const elements = document.getElementsByClassName(
    logger_class,
  ) as HTMLCollectionOf<HTMLElement>;
  if (elements === null && elements[0] == undefined) {
    return;
  }
  const button = document.getElementById(`logger_${logger_class}`);
  if (button === null) {
    return;
  }

  let changeTo = "none";
  if (button.classList.contains("logger_inactive")) {
    changeTo = "block";
  }
  for (const elem of elements) {
    (elem as HTMLElement).style.display = changeTo;
  }

  if (changeTo === "none") {
    button.classList.add("logger_inactive");
  } else {
    button.classList.remove("logger_inactive");
  }
};

["net", "log", "error", "warn", "info"].forEach((element: string) => {
  if (document.getElementById(`logger_${element}`) !== null) {
    document.getElementById(`logger_${element}`)!.onclick = () => {
      logger_hideByClass(element);
    };
  }
});

var logger_hideAll = (action?: string) => {
  const bubbles = document.getElementsByClassName(
    "logger_bubbles",
  )[0] as HTMLElement;
  const list = document.getElementsByClassName("logger_list")[0] as HTMLElement;
  if (action !== "hide" && bubbles.style.display === "none") {
    bubbles.style.display = "flex";
    list.style.display = "block";
    localStorage.setItem("logger_is_hidden", "false");
    if (document.getElementById("logger_hide")) {
      document.getElementById("logger_hide")!.innerHTML = "<span>✖️</span>";
    }
  } else {
    localStorage.setItem("logger_is_hidden", "true");
    bubbles.style.display = "none";
    list.style.display = "none";
    if (document.getElementById("logger_hide")) {
      document.getElementById("logger_hide")!.innerHTML = "<span>⬅️</span>";
    }
  }
};

var logger_clearAll = () => {
  const list = document.getElementsByClassName("logger_list")[0];
  while (list.firstChild) {
    list.removeChild(list.firstChild);
  }
};

if (document.getElementById("logger_hide") !== null) {
  document.getElementById("logger_hide")!.onclick = () => logger_hideAll();
}
if (document.getElementById("logger_clear") !== null) {
  document.getElementById("logger_clear")!.onclick = () => logger_clearAll();
}

if (localStorage.getItem("logger_is_hidden") !== "false") {
  logger_hideAll("hide");
}

const logger_filterLogs = () => {
  const filterText = (
    document.getElementById("logger_filter") as HTMLInputElement
  )?.value.toLowerCase();
  const logs = document.getElementById("debugList")?.getElementsByTagName("li");

  if (!logs) return;

  for (const log of logs) {
    const logText = log.textContent?.toLowerCase() || "";
    log.style.display = logText.includes(filterText) ? "block" : "none";
  }
};

document
  .getElementById("logger_filter")
  ?.addEventListener("input", logger_filterLogs);
