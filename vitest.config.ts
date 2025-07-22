import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
    plugins: [tsconfigPaths()],
    test: {
        browser: {
            enabled: true,
            provider: "playwright",
            headless: true,
            screenshotFailures: false,
            // https://vitest.dev/guide/browser/playwright
            instances: [
                {
                    browser: "chromium",
                    launch: {
                        executablePath:
                            import.meta.dirname +
                            "/.devbox/nix/profile/default/bin/chromium",
                    },
                },
                {
                    browser: "firefox",
                    launch: {
                        executablePath:
                            import.meta.dirname +
                            "/" +
                            "result/firefox-1482/firefox/firefox",
                    },
                },
                {
                    browser: "webkit",
                    launch: {
                        executablePath:
                            import.meta.dirname +
                            "/" +
                            "result/webkit-2158/pw_run.sh",
                    },
                },
            ],
        },
        alias: {
            "@/": new URL("./src/", import.meta.url).pathname,
        },
    },
});
