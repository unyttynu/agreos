// agreos - Agentic Real Estate Operating System
// main.js - Application Entry Point

const config = {
  settings: {
    appearance: {
      layout: "desktop",
      backgroundType: "stock",
      stockImage: "abstract/skyline-dusk"
    }
  },
  layoutConfig: {
    desktop: {
      family: "agreos",
      desktops: [
        {
          family: "escrow",
          icons: [
            {
              type: "app",
              key: "principals",
              version: "v0.01",
              iconName: "users-gear",
              theme: "#0F766E",
              category: "platform",
              row: 0,
              column: 0,
              agentNode: ["developer", "buyer", "broker", "agent"]
            },
            {
              type: "app",
              key: "disclosures",
              version: "v0.01",
              iconName: "file-contract",
              theme: "#64748b",
              category: "utility",
              row: 2,
              column: 0,
              agentNode: ["attorney", "escrow"]
            },
            {
              type: "app",
              key: "parcelNav",
              version: "v0.02",
              iconName: "folder-tree",
              theme: "#475569",
              category: "utility",
              row: 1,
              column: 0,
              agentNode: ["title", "escrow"]
            }
          ]
        },
        {
          family: "title",
          icons: [
            {
              type: "app",
              key: "principals",
              version: "v0.01",
              iconName: "users-gear",
              theme: "#0F766E",
              category: "platform",
              row: 0,
              column: 0,
              agentNode: ["developer", "buyer", "broker", "agent"]
            },
            {
              type: "app",
              key: "disclosures",
              version: "v0.01",
              iconName: "file-contract",
              theme: "#64748b",
              category: "utility",
              row: 2,
              column: 0,
              agentNode: ["attorney", "escrow"]
            },
            {
              type: "app",
              key: "parcelNav",
              version: "v0.02",
              iconName: "folder-tree",
              theme: "#475569",
              category: "utility",
              row: 1,
              column: 0,
              agentNode: ["title", "escrow"]
            }
          ]
        },
        {
          family: "equity",
          icons: [
            {
              type: "app",
              key: "principals",
              version: "v0.01",
              iconName: "users-gear",
              theme: "#0F766E",
              category: "platform",
              row: 0,
              column: 0,
              agentNode: ["developer", "buyer", "broker", "agent"]
            },
            {
              type: "app",
              key: "disclosures",
              version: "v0.01",
              iconName: "file-contract",
              theme: "#64748b",
              category: "utility",
              row: 2,
              column: 0,
              agentNode: ["attorney", "escrow"]
            },
            {
              type: "app",
              key: "parcelNav",
              version: "v0.02",
              iconName: "folder-tree",
              theme: "#475569",
              category: "utility",
              row: 1,
              column: 0,
              agentNode: ["title", "escrow"]
            }
          ]
        }
      ],
      windows: [
        {
          key: "parcelNav",
          x: 2,
          y: 19,
          width: 1414,
          height: 883,
          zIndex: 2,
          activeContext: "due_diligence_review"
        }
      ]
    }
  }
};

// ─── Desktop Manager ─────────────────────────────────────────────────────────

class DesktopManager {
  constructor(config) {
    this.config = config;
    this.settings = config.settings;
    this.layoutConfig = config.layoutConfig;
    this.activeLayout = this.settings.appearance.layout;
    this.desktops = this.layoutConfig[this.activeLayout].desktops;
    this.windows = this.layoutConfig[this.activeLayout].windows;
    this.activeDesktopIndex = 0;
  }

  get activeDesktop() {
    return this.desktops[this.activeDesktopIndex];
  }

  switchDesktop(familyOrIndex) {
    if (typeof familyOrIndex === "number") {
      this.activeDesktopIndex = familyOrIndex;
    } else {
      const idx = this.desktops.findIndex(d => d.family === familyOrIndex);
      if (idx !== -1) this.activeDesktopIndex = idx;
    }
    this.render();
  }

  getIconsForAgent(agentRole) {
    return this.activeDesktop.icons.filter(icon =>
      icon.agentNode.includes(agentRole)
    );
  }

  getWindowByKey(key) {
    return this.windows.find(w => w.key === key) || null;
  }

  // ─── Rendering ─────────────────────────────────────────────────────────────

  applyBackground() {
    const { backgroundType, stockImage } = this.settings.appearance;
    if (backgroundType === "stock") {
      document.body.dataset.background = stockImage;
      document.body.classList.add("bg-stock");
    }
  }

  renderIcon(icon, container) {
    const el = document.createElement("div");
    el.className = "agreos-icon";
    el.dataset.key = icon.key;
    el.dataset.version = icon.version;
    el.dataset.category = icon.category;
    el.style.gridRow = icon.row + 1;
    el.style.gridColumn = icon.column + 1;

    const iconEl = document.createElement("i");
    iconEl.className = `fa-solid fa-${icon.iconName}`;
    iconEl.style.color = icon.theme;

    const label = document.createElement("span");
    label.textContent = icon.key;

    el.appendChild(iconEl);
    el.appendChild(label);
    el.addEventListener("click", () => this.launchApp(icon));

    container.appendChild(el);
  }

  renderDesktop() {
    const desktopEl = document.getElementById("agreos-desktop");
    if (!desktopEl) return;

    desktopEl.innerHTML = "";
    desktopEl.dataset.family = this.activeDesktop.family;

    const grid = document.createElement("div");
    grid.className = "agreos-icon-grid";

    this.activeDesktop.icons.forEach(icon => this.renderIcon(icon, grid));
    desktopEl.appendChild(grid);
  }

  renderWindows() {
    this.windows.forEach(win => this.renderWindow(win));
  }

  renderWindow(win) {
    let winEl = document.getElementById(`win-${win.key}`);
    if (!winEl) {
      winEl = document.createElement("div");
      winEl.id = `win-${win.key}`;
      winEl.className = "agreos-window";
      document.getElementById("agreos-desktop")?.appendChild(winEl);
    }

    Object.assign(winEl.style, {
      left: `${win.x}px`,
      top: `${win.y}px`,
      width: `${win.width}px`,
      height: `${win.height}px`,
      zIndex: win.zIndex
    });

    winEl.dataset.activeContext = win.activeContext;
    winEl.dataset.key = win.key;
    this.makeDraggable(winEl, win);
    this.makeResizable(winEl, win);
  }

  // ─── Window Interactions ───────────────────────────────────────────────────

  makeDraggable(el, win) {
    let startX, startY, origX, origY;

    const header = el.querySelector(".agreos-window-header") || el;
    header.addEventListener("mousedown", e => {
      startX = e.clientX;
      startY = e.clientY;
      origX = win.x;
      origY = win.y;

      const onMove = mv => {
        win.x = origX + (mv.clientX - startX);
        win.y = origY + (mv.clientY - startY);
        el.style.left = `${win.x}px`;
        el.style.top = `${win.y}px`;
      };

      const onUp = () => {
        document.removeEventListener("mousemove", onMove);
        document.removeEventListener("mouseup", onUp);
      };

      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onUp);
    });
  }

  makeResizable(el, win) {
    const handle = document.createElement("div");
    handle.className = "agreos-resize-handle";
    el.appendChild(handle);

    handle.addEventListener("mousedown", e => {
      e.stopPropagation();
      const startX = e.clientX;
      const startY = e.clientY;
      const origW = win.width;
      const origH = win.height;

      const onMove = mv => {
        win.width = Math.max(200, origW + (mv.clientX - startX));
        win.height = Math.max(100, origH + (mv.clientY - startY));
        el.style.width = `${win.width}px`;
        el.style.height = `${win.height}px`;
      };

      const onUp = () => {
        document.removeEventListener("mousemove", onMove);
        document.removeEventListener("mouseup", onUp);
      };

      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onUp);
    });
  }

  // ─── App Launcher ──────────────────────────────────────────────────────────

  launchApp(icon) {
    console.log(`[agreos] Launching app: ${icon.key} (v${icon.version})`);

    const existingWin = this.getWindowByKey(icon.key);
    if (existingWin) {
      const el = document.getElementById(`win-${icon.key}`);
      if (el) {
        existingWin.zIndex = this.getTopZIndex() + 1;
        el.style.zIndex = existingWin.zIndex;
      }
      return;
    }

    const newWin = {
      key: icon.key,
      x: 50 + this.windows.length * 30,
      y: 50 + this.windows.length * 30,
      width: 800,
      height: 600,
      zIndex: this.getTopZIndex() + 1,
      activeContext: null
    };

    this.windows.push(newWin);
    this.renderWindow(newWin);
  }

  getTopZIndex() {
    return this.windows.reduce((max, w) => Math.max(max, w.zIndex || 0), 0);
  }

  // ─── Lifecycle ─────────────────────────────────────────────────────────────

  render() {
    this.applyBackground();
    this.renderDesktop();
    this.renderWindows();
  }

  init() {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => this.render());
    } else {
      this.render();
    }
    console.log(`[agreos] Initialized — layout: ${this.activeLayout}, family: ${this.layoutConfig[this.activeLayout].family}`);
    console.log(`[agreos] Desktops: ${this.desktops.map(d => d.family).join(", ")}`);
    console.log(`[agreos] Active desktop: ${this.activeDesktop.family} (${this.activeDesktop.icons.length} icons)`);
  }
}

// ─── Bootstrap ────────────────────────────────────────────────────────────────

const agreos = new DesktopManager(config);
agreos.init();

export { agreos, config, DesktopManager };
