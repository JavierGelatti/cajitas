import {defineConfig} from "vitest/config";

export default defineConfig({
  test: {
    watch: true,
    browser: {
      enabled: true,
      api: {
        host: "0.0.0.0",
      },
      provider: "webdriverio",
      instances: [
        {
          browser: "chrome",
          capabilities: {
            "goog:chromeOptions": {
              args: ["--remote-debugging-port=9229"],
            },
          },
        },
      ],
    },
  },
});
