import { assert, describe, it } from "vite-plus/test";

import { makeDevelopmentBootstrapScript, resolveElectronBinaryPath } from "./electron-launcher.mjs";

describe("electron development launcher", () => {
  it("uses captured values only as fallbacks for a live runner environment", () => {
    const script = makeDevelopmentBootstrapScript({
      mainEntryPath: "/repo/apps/desktop/dist-electron/main.cjs",
      desktopRoot: "/repo/apps/desktop",
      environment: {
        VITE_DEV_SERVER_URL: "http://127.0.0.1:8526",
        T3CODE_PORT: "16566",
        T3CODE_HOME: "/tmp/t3",
      },
    });

    assert.include(
      script,
      'if (!process.env["VITE_DEV_SERVER_URL"]?.trim()) process.env["VITE_DEV_SERVER_URL"] = "http://127.0.0.1:8526";',
    );
    assert.include(script, 'process.argv.push("--t3code-dev-root=/repo/apps/desktop");');
    assert.include(script, 'require("/repo/apps/desktop/dist-electron/main.cjs");');
  });

  it("repairs Electron before loading the package entrypoint", () => {
    const calls = [];
    const electronPath = resolveElectronBinaryPath({
      ensureRuntime: () => {
        calls.push("ensure");
      },
      createRequire: () => (specifier) => {
        calls.push(`require:${specifier}`);
        return "/repo/node_modules/electron/dist/Electron.app/Contents/MacOS/Electron";
      },
      moduleUrl: import.meta.url,
    });

    assert.equal(
      electronPath,
      "/repo/node_modules/electron/dist/Electron.app/Contents/MacOS/Electron",
    );
    assert.deepEqual(calls, ["ensure", "require:electron"]);
  });
});
