javascript:(function () {
  if (window.__ac_fixed) return;
  window.__ac_fixed = true;

  let enabled = false;
  let cps = 10;
  let hold = false;
  let lockTarget = false;
  let timer = null;
  let mouseX = 0, mouseY = 0;
  let targetEl = null;
  let shiftDown = false;

  document.addEventListener("mousemove", e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function fullClick(el, x, y) {
    if (!el) return;

    const opts = {
      bubbles: true,
      cancelable: true,
      composed: true,
      clientX: x,
      clientY: y,
      button: 0,
      buttons: 1,
      pointerType: "mouse",
      isPrimary: true
    };

    el.focus?.();

    el.dispatchEvent(new PointerEvent("pointerdown", opts));
    el.dispatchEvent(new MouseEvent("mousedown", opts));

    if (!hold) {
      el.dispatchEvent(new PointerEvent("pointerup", opts));
      el.dispatchEvent(new MouseEvent("mouseup", opts));
      el.dispatchEvent(new MouseEvent("click", opts));
    }
  }

  function tick() {
    if (!enabled || document.hidden) return;

    const el = lockTarget && targetEl
      ? targetEl
      : document.elementFromPoint(mouseX, mouseY);

    if (el) {
      targetEl = el;
      fullClick(el, mouseX, mouseY);
    }

    timer = setTimeout(tick, 1000 / cps);
  }

  function start() {
    stop();
    tick();
  }

  function stop() {
    if (timer) clearTimeout(timer);
    timer = null;
  }

  function toggle() {
    enabled = !enabled;
    status.textContent = enabled ? "ON" : "OFF";
    status.style.color = enabled ? "#2ecc71" : "#e74c3c";
    enabled ? start() : stop();
  }

  document.addEventListener("keydown", e => {
    if (e.key === "Shift" && !shiftDown) {
      shiftDown = true;
      toggle();
    }
  });

  document.addEventListener("keyup", e => {
    if (e.key === "Shift") shiftDown = false;
  });

  // UI
  const panel = document.createElement("div");
  panel.style.cssText = `
    position:fixed;top:40px;left:40px;width:230px;
    background:#0f0f0f;color:white;font-family:Arial;
    font-size:13px;border-radius:10px;
    z-index:2147483647;box-shadow:0 0 15px #000;
  `;

  panel.innerHTML = `
    <div id="drag" style="padding:8px;background:#1c1c1c;
      cursor:move;text-align:center;font-weight:bold;
      border-radius:10px 10px 0 0">Auto Clicker</div>

    <div style="padding:10px">
      Status: <span id="status" style="color:#e74c3c">OFF</span>

      <button id="btn" style="width:100%;margin-top:6px;
        padding:8px;background:#333;color:white;border:none;
        border-radius:6px;cursor:pointer">Toggle</button>

      <div style="margin-top:8px">
        CPS <input id="cps" type="number" min="1" max="200" value="10"
        style="width:60px;background:black;color:white;
        border:1px solid #555;border-radius:4px;text-align:center">
      </div>

      <label style="display:block;margin-top:6px">
        <input id="hold" type="checkbox"> Hold Mouse
      </label>

      <label style="display:block">
        <input id="lock" type="checkbox"> Lock Target
      </label>

      <div style="margin-top:6px;font-size:11px;color:#aaa">
        Hotkey: SHIFT
      </div>
    </div>
  `;

  document.body.appendChild(panel);

  const status = panel.querySelector("#status");
  panel.querySelector("#btn").onclick = toggle;
  panel.querySelector("#cps").oninput = e => cps = Math.max(1, +e.target.value || 1);
  panel.querySelector("#hold").onchange = e => hold = e.target.checked;
  panel.querySelector("#lock").onchange = e => lockTarget = e.target.checked;

  // Drag
  let dragging = false, dx = 0, dy = 0;
  panel.querySelector("#drag").onmousedown = e => {
    dragging = true;
    dx = e.clientX - panel.offsetLeft;
    dy = e.clientY - panel.offsetTop;
  };
  document.addEventListener("mousemove", e => {
    if (dragging) {
      panel.style.left = e.clientX - dx + "px";
      panel.style.top = e.clientY - dy + "px";
    }
  });
  document.addEventListener("mouseup", () => dragging = false);
})();
