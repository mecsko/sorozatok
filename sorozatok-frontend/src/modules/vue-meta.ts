import { createMetaManager } from "vue-meta";

export const install = (app: any) => {
  const metaManager = createMetaManager();
  app.use(metaManager);
};
