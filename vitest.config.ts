import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
	plugins: [tsconfigPaths()],
	test: {
		browser: {
			enabled: true,
			provider: "playwright",
			headless: true,
			// https://vitest.dev/guide/browser/playwright
			instances: [
				{ browser: "chromium" },
				{ browser: "firefox" },
				{ browser: "webkit" },
			],
		},
		alias: {
			"@/": new URL("./src/", import.meta.url).pathname,
		},
	},
});
