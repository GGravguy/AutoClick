javascript:(function () {
  if (window.__ac_pro) return;
  window.__ac_pro = true;

  let enabled = false;
  let cps = 10;
  let mode = "click";
  let hold = false;
  let timer = null;
  let mouseX = 0, mouseY = 0;

  document.addEventListener("mousemove", e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function clickOnce() {
    const el = document.elementFromPoint(mouseX, mouseY);
    if (!el) return;

    if (mode === "click") {
      el.click();
    } else {
      el.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
      if (!hold)
        el.dispatchEvent(new MouseEvent("mouseup", { bubbles: true }));
    }
  }

  function start() {
    stop();
    timer = setInterval(clickOnce, 1000 / cps);
  }

  function stop() {
    if (timer) clearInterval(timer);
    timer = null;
  }

  function toggle() {
    enabled = !enabled;
    status.textContent = enabled ? "ON" : "OFF";
    status.style.color = enabled ? "#2ecc71" : "#e74c3c";
    enabled ? start() : stop();
  }

  // SHIFT TOGGLE
  document.addEventListener("keydown", e => {
    if (e.key === "Shift") toggle();
  });

  // PANEL
  const panel = document.createElement("div");
  panel.style.cssText = `
    position:fixed;
    top:40px;
    left:40px;
    width:220px;
    background:#0f0f0f;
    color:#fff;
    font-family:Arial;
    font-size:13px;
    border-radius:10px;
    z-index:2147483647;
    box-shadow:0 0 15px rgba(0,0,0,.7);
  `;

  panel.innerHTML = `
    <div id="drag" style="
      padding:8px;
      background:#1c1c1c;
      cursor:move;
      text-align:center;
      font-weight:bold;
      border-radius:10px 10px 0 0;
    ">Auto Clicker</div>

    <div style="padding:10px">
      <div>Status: <span id="status" style="color:#e74c3c">OFF</span></div>

      <button id="btn" style="
        width:100%;
        padding:8px;
        margin-top:6px;
        background:#333;
        color:white;
        border:none;
        border-radius:6px;
        cursor:pointer;
      ">Toggle</button>

      <div style="margin-top:10px">
        CPS
        <input id="cps" type="number" min="1" max="100" value="10" style="
          width:60px;
          margin-left:6px;
          background:black;
          color:white;
          border:1px solid #555;
          border-radius:4px;
          padding:3px;
          text-align:center;
        ">
      </div>

      <div style="margin-top:8px">
        Mode:
        <select id="mode" style="background:black;color:white;border:1px solid #555">
          <option value="click">element.click()</option>
          <option value="mouse">mousedown/up</option>
        </select>
      </div>

      <label style="display:block;margin-top:8px">
        <input id="hold" type="checkbox"> Hold Mouse Down
      </label>

      <div style="margin-top:8px;font-size:11px;color:#aaa">
        Hotkey: SHIFT
      </div>
    </div>
  `;

  document.body.appendChild(panel);

  const btn = panel.querySelector("#btn");
  const cpsInput = panel.querySelector("#cps");
  const modeSelect = panel.querySelector("#mode");
  const holdCheck = panel.querySelector("#hold");
  const status = panel.querySelector("#status");

  btn.onclick = toggle;

  cpsInput.oninput = () => {
    cps = Math.max(1, Number(cpsInput.value) || 1);
    if (enabled) start();
  };

  modeSelect.onchange = () => {
    mode = modeSelect.value;
    if (enabled) start();
  };

  holdCheck.onchange = () => hold = holdCheck.checked;

  // DRAGGING
  let dragging = false, dx = 0, dy = 0;
  const drag = panel.querySelector("#drag");

  drag.onmousedown = e => {
    dragging = true;
    dx = e.clientX - panel.offsetLeft;
    dy = e.clientY - panel.offsetTop;
  };

  document.onmousemove = e => {
    if (!dragging) return;
    panel.style.left = e.clientX - dx + "px";
    panel.style.top = e.clientY - dy + "px";
  };

  document.onmouseup = () => dragging = false;
})();
