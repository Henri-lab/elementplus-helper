import { defineConfig, loadEnv } from 'vite';
// @ts-ignore
import { usePlugins } from './src/vite/plugin';
// @ts-ignore
import { cssOption } from './src/vite/css';
// @ts-ignore
import { resolveOption } from './src/vite/resolve';
// @ts-ignore
import { serverOption } from './src/vite/server';

import type { UserConfig } from 'vite';



const config = (context: UserConfig) => {
  // 获取 构建模式
  const mode = context.mode;
  const isProd = mode === 'production'; //是否是生产模式
  // 获取 环境变量
  const envDir = 'env'; // 环境变量文件的文件夹，相对于项目的路径，也可以用 nodejs 函数拼接绝对路径
  let env,base;
  if (mode) {
    env = loadEnv(mode, envDir);
    console.log(env); /* 打印环境变量设置 */
    base = env.VITE_APP_ENV === 'production' ? '/' : '/';
  }else{
    base = '/';
  }


  const plugins = usePlugins({ isProd, base});
  // 获得 解析器配置
  const resolve = resolveOption;
  // 获得 CSS处理器配置
  const css = cssOption;
  // 获得 开发服务器配置
  const server = serverOption;
  // 获得 rollup 打包配置
  const build = {
    rollupOptions: {
      input: './src/main.ts', // 确保打包时使用 main.ts
    },
  };

  return {
    mode,
    envDir,
    base,
    plugins,
    resolve,
    css,
    server,
    build,
  };
};

// https://vitejs.dev/config/
export default defineConfig(config);
