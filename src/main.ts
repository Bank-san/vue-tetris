// main.ts
import { createApp } from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify"; // 必須
import { loadFonts } from "./plugins/webfontloader"; // 任意

loadFonts(); // フォント読み込み（なくてもOK）

createApp(App).use(vuetify).mount("#app");
