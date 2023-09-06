import {sentryVitePlugin} from "@sentry/vite-plugin";
import {fileURLToPath, URL} from 'node:url'

import {ConfigEnv, defineConfig, loadEnv, UserConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

// https://vitejs.dev/config/

export default defineConfig(({command, mode}: ConfigEnv): UserConfig => {
  // 根据当前工作目录中的 `mode` 加载 .env 文件
  // 设置第三个参数为 '' 来加载所有环境变量，而不管是否有 `VITE_` 前缀。
  const env = loadEnv(mode, process.cwd(), '')
  return {
    server: {
      port: +env.VITE_APP_PORT
    },
    plugins: [vue(), vueJsx(), sentryVitePlugin({
      org: "adui",
      project: "adui-carpool-management"
    })],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    // vite 配置
    define: {
      __APP_ENV__: JSON.stringify(env.APP_ENV),
    },
  }
})
