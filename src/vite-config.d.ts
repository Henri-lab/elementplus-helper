//bug 
declare module './vite/plugin/' {
  export function usePlugins(options: {
    isProd: boolean;
    base: string;
    arg: any;
  }): any[];
}
