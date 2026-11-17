# 单抽屉三维档案原型

基于 `pseebat0312-gif/BETARCHIVO` 的 `dev/3d-archive`，基准提交 `889aa705915048f5bb6a249946fdfd786090de3e`。没有推送、部署、提交、修改 main 或生产配置。

## 实现与维护

首页使用 Astro 组件承载延迟加载的 Three.js 场景。原有作品索引、三种语言、详情页、导航和 SEO 模板保留。`src/data/projects.ts` 仍是项目内容来源；`src/data/archive.ts` 用稳定 slug `entre-flores` 选择本阶段唯一档案并维护三语交互文案。

`src/lib/archive/cabinet.ts` 管理程序化几何、材质、光照、射线点击、相机和动画。状态在 `state.mjs` 中定义：`idle → drawer-open → file-selected → file-unsealed → project-open`。过渡期间锁定操作，前三步可逆；Esc 返回一步。键盘通过原生按钮和链接操作。进入详情后可用“返回档案柜”，返回时重新初始化；浏览器缓存恢复时也重置状态。减少动态效果偏好会跳过过渡，但保留所有操作步骤。

抽屉行程 1.72 个场景单位，三段滑轨分别固定、半程和全程移动。文件后缘在提升前已越过柜体前面；先提升、再横移、最后放到阅览台。封面以左侧书脊为轴打开，搭扣先解开；倒序沿原路径返回。不模拟重力、手部或真实纸张弯曲，文件搬移采用引导式动画。

## 素材与许可

- Three.js 0.180.0，来源 https://github.com/mrdoob/three.js/tree/r180 ，作者 Three.js contributors，MIT；包含 RoundedBoxGeometry。许可证随 npm 包保存在 `node_modules/three/LICENSE`，分发时保留版权和许可声明。
- 几何、木纹、纸张纹理及档案标签均为本项目原创程序化生成，无外部模型、图片纹理或 HDRI。
- 现有字体与项目图片不变，沿用仓库已有许可记录。
- 本次 npm 安装使用 `--ignore-scripts`，没有执行依赖安装脚本。Playwright 仅安装在 `/tmp/betarchivo-check` 用于验证，不是项目依赖。

## 动画与预算

设计规范未给出具体毫秒值；本阶段抽屉开启 1100ms，搬移依次 650/1000/700ms，解扣 450ms、开封 1000ms。常规返回略短。使用按需渲染、最高 1.6 像素比、单个 1024 阴影贴图；无常驻空闲动画循环。

原检查脚本的 26 页计数已落后于开发分支实际 38 页。现为 38 页；基础 JS 维持 20KB 上限，延迟加载的 Three.js 场景单独限制为 550KB（未压缩），不是把 3D 库计入旧的 20KB 预算。

## 本地预览与保存

在本目录运行：

```sh
ASTRO_TELEMETRY_DISABLED=1 npm run build
npm run check
node --test tests/archive-state.test.mjs
ASTRO_TELEMETRY_DISABLED=1 npm run dev -- --host 0.0.0.0 --port 4321
```

访问 `/zh/`、`/en/`、`/es/`。云服务器的 `127.0.0.1` 不能直接从 iPad Safari 访问；需要 Codex 提供端口预览或共享桌面。本会话未提供这两种入口工具，不能保证 iPad 上有可点击的实时预览。可下载源码快照，在另一台设备本地运行；同一局域网内可从 iPad 访问该设备的开发端口。无需部署到 Cloudflare。

文件保留在任务工作区 `/workspace/BETARCHIVO`，不等于已保存到 GitHub。云环境销毁可能丢失，应下载交付的源码和补丁保存。不要为保存而自动推送。

## 限制

当前是程序化单抽屉原型，不是已完成的写实 Blender 模型。仍需在真实 iPad Safari / 手机设备验证 WebGL、触控和性能；软件渲染截图不构成真实设备性能数据。没有自动全局碰撞检测；依靠明确的间隙、行程和分阶段路径。后续若需要近距离照片级材质，可在相同状态接口下替换为优化 GLB，不必改变 Astro 架构。

## 验证记录

- `ASTRO_TELEMETRY_DISABLED=1 npm run build`：38 页构建成功。
- `npm run check`：714 个站内链接、60 处资源引用、页面标题/语言/描述、单 H1、静态脚本规则与 JS 预算通过。基础脚本合计 5871 字节。
- `node --test tests/archive-state.test.mjs`：正向、反向、边界与无效转换通过。
- Chromium + SwiftShader 自动化：1440×1000、820×1180 触控模拟、390×844 触控模拟；正常动态效果及减少动态效果；状态前进/回退、Enter/Esc 操作、详情页进入并返回、无横向页面溢出、无页面脚本异常通过。无 WebGL、禁用 JavaScript 时项目入口可用。已查看桌面与手机截图，并修正手机取景裁切。
- 未执行真实 iPad/Safari、真实手机、屏幕阅读器、帧率/耗电测试；未用物理引擎逐帧碰撞验证。
- 可复用的浏览器脚本为 `tests/archive-browser.cjs`。本环境先启动静态预览服务器，再运行 `PLAYWRIGHT_MODULE=/tmp/betarchivo-check/node_modules/playwright node tests/archive-browser.cjs`。仅测试工具位于 `/tmp`；其他环境需提供自己的 Playwright 与 Chromium 路径，不必添加到项目依赖中。
