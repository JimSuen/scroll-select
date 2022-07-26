import { createApp } from "vue";
import { ElSelect } from "element-plus";
import App from "./App.vue";
import "element-plus/dist/index.css";

const app = createApp(App);
app.use(ElSelect);
app.mount("#app");
