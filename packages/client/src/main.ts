import { createApp } from "vue";
import "bootstrap/scss/bootstrap-grid.scss";
import "./style.styl";
import App from "./App.vue";

import { Quasar, Notify } from "quasar";
import "quasar/src/css/index.sass";

const app = createApp(App);
app.use(Quasar, {
  plugins: {Notify},
  config: {
    dark: true,
  },
});
app.mount("#app");
