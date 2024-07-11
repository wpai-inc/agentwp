// vite.config.ts
import { v4wp } from "file:///Users/agus/repo/wpai/awp/agent-wp/node_modules/vite-for-wp/src/exports/index.js";
import react from "file:///Users/agus/repo/wpai/awp/agent-wp/node_modules/@vitejs/plugin-react/dist/index.mjs";
import path from "path";
import { defineConfig } from "file:///Users/agus/repo/wpai/awp/agent-wp/node_modules/vite/dist/node/index.js";
import svgr from "file:///Users/agus/repo/wpai/awp/agent-wp/node_modules/vite-plugin-svgr/dist/index.js";
var __vite_injected_original_dirname = "/Users/agus/repo/wpai/awp/agent-wp";
var vite_config_default = defineConfig({
  root: "client",
  plugins: [
    v4wp({
      input: {
        styles: "/assets/styles/app.css",
        settings: "/Page/Admin/Settings/Index.tsx",
        chat: "/Page/Admin/Chat/Index.tsx",
        testBlocksStreaming: "/Tests/test-blocks-streaming.ts"
      },
      outDir: "../build"
    }),
    react(),
    svgr()
  ],
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "client")
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvYWd1cy9yZXBvL3dwYWkvYXdwL2FnZW50LXdwXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvYWd1cy9yZXBvL3dwYWkvYXdwL2FnZW50LXdwL3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9hZ3VzL3JlcG8vd3BhaS9hd3AvYWdlbnQtd3Avdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyB2NHdwIH0gZnJvbSAndml0ZS1mb3Itd3AnO1xuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0JztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XG5pbXBvcnQgc3ZnciBmcm9tICd2aXRlLXBsdWdpbi1zdmdyJztcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKCB7XG4gIHJvb3Q6ICdjbGllbnQnLFxuICBwbHVnaW5zOiBbXG4gICAgdjR3cCgge1xuICAgICAgaW5wdXQ6IHtcbiAgICAgICAgc3R5bGVzOiAnL2Fzc2V0cy9zdHlsZXMvYXBwLmNzcycsXG4gICAgICAgIHNldHRpbmdzOiAnL1BhZ2UvQWRtaW4vU2V0dGluZ3MvSW5kZXgudHN4JyxcbiAgICAgICAgY2hhdDogJy9QYWdlL0FkbWluL0NoYXQvSW5kZXgudHN4JyxcbiAgICAgICAgdGVzdEJsb2Nrc1N0cmVhbWluZzogJy9UZXN0cy90ZXN0LWJsb2Nrcy1zdHJlYW1pbmcudHMnLFxuICAgICAgfSxcbiAgICAgIG91dERpcjogJy4uL2J1aWxkJyxcbiAgICB9ICksXG4gICAgcmVhY3QoKSxcbiAgICBzdmdyKCksXG4gIF0sXG4gIHJlc29sdmU6IHtcbiAgICBhbGlhczoge1xuICAgICAgJ0AnOiBwYXRoLnJlc29sdmUoIF9fZGlybmFtZSwgJ2NsaWVudCcgKSxcbiAgICB9LFxuICB9LFxufSApO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUF3UixTQUFTLFlBQVk7QUFDN1MsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sVUFBVTtBQUNqQixTQUFTLG9CQUFvQjtBQUM3QixPQUFPLFVBQVU7QUFKakIsSUFBTSxtQ0FBbUM7QUFNekMsSUFBTyxzQkFBUSxhQUFjO0FBQUEsRUFDM0IsTUFBTTtBQUFBLEVBQ04sU0FBUztBQUFBLElBQ1AsS0FBTTtBQUFBLE1BQ0osT0FBTztBQUFBLFFBQ0wsUUFBUTtBQUFBLFFBQ1IsVUFBVTtBQUFBLFFBQ1YsTUFBTTtBQUFBLFFBQ04scUJBQXFCO0FBQUEsTUFDdkI7QUFBQSxNQUNBLFFBQVE7QUFBQSxJQUNWLENBQUU7QUFBQSxJQUNGLE1BQU07QUFBQSxJQUNOLEtBQUs7QUFBQSxFQUNQO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxLQUFLLEtBQUssUUFBUyxrQ0FBVyxRQUFTO0FBQUEsSUFDekM7QUFBQSxFQUNGO0FBQ0YsQ0FBRTsiLAogICJuYW1lcyI6IFtdCn0K
