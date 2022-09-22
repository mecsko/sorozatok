import { HmrContext, Plugin } from "vite";

export default (fileEnding: string): Plugin => ({
  name: "custom-hmr",
  enforce: "post",
  // HMR
  handleHotUpdate({ file, server }: HmrContext) {
    if (file.endsWith(`.${fileEnding}`)) {
      return server.ws.send({
        type: "full-reload",
        path: "*",
      });
    }
  },
});
