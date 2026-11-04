# BETARCHIVO 源码使用说明

此包包含当前已实现网站的全部源码、静态构建产物、字体许可、测试记录与 Git 历史备份。部署由你自行操作，无需连接 ChatGPT，也不依赖 ChatGPT 登录。

## 1. 解压后打开哪个文件夹

打开里面的 `betarchivo` 文件夹（能看到 package.json 的那一级）。不要直接双击 dist/index.html 作为预览：网站使用根路径资源和三语言路由，需要通过本地服务器或托管平台访问。

## 2. 在电脑上运行

安装 Node.js 22.12 或更高版本。在 betarchivo 文件夹打开终端，依次运行：

```bash
npm ci
npm run dev
```

打开终端实际显示的本地地址。按 Ctrl+C 停止运行。

## 3. 构建与检查

```bash
npm run build
npm run check
npm run preview
```

build 会重新生成 dist 文件夹。preview 用于查看构建后的版本。check 检查输出页面、内部资源与链接；它不等于真机、网络或全部可访问性测试。已执行的测试和未验证范围详见 QA.md。

## 4. 常用修改位置

| 要修改的内容 | 文件 |
| --- | --- |
| 联系邮箱和社交链接 | src/data/config.ts |
| 三语言界面文案 | src/data/ui.ts |
| 项目介绍、封面、链接、是否展示 | src/data/projects.ts |
| 服务介绍 | src/data/services.ts |
| 颜色、字号、间距、响应式布局 | src/styles/global.css |
| 页面结构与交互脚本 | src/pages/[lang]/[...path].astro |
| 图片与图标 | public/assets/、public/favicon.svg |

修改源码之后重新 build，dist 才会更新。不要只改 dist，否则下次构建会覆盖。

## 5. 自行部署的参数

- 框架：Astro 静态网站。
- 构建命令：npm run build。
- 输出目录：dist。
- 项目根目录：含 package.json 的 betarchivo 文件夹。
- SITE_URL：填写最终真实网站 origin，例如你的实际 HTTPS 域名，不带页面路径。
- DEPLOY_ENV：预览时保持 preview 或留空。你决定正式上线并希望被搜索引擎收录时，设置为 production 后重新构建。

未配置真实 SITE_URL 的构建默认 noindex，不生成虚构域名的 canonical。填写后重新构建，会生成对应 canonical、hreflang、Open Graph 地址和 sitemap。

若直接上传静态文件，上传 dist 的内容，而不是整份源码 ZIP。若通过 GitHub 构建，提交源码、package.json 和 package-lock.json，不提交 node_modules。public/_headers 与 public/_redirects 已随构建复制，具体执行效果须在目标平台上检查。

## 6. 当前真实内容边界

- 展示 ENTRE FLORES、Student Hub Spain 两个项目及三语言详情。
- ENTRE FLORES 使用真实项目截图，未提供公众体验链接，因为检查时其源站仅对作者开放。
- Student Hub 使用明确标注的文字封面，不冒充截图；已有在线链接及源码链接，不把未完成的 AI 或支付功能当作已完成。
- 手机模拟器、小游戏、数据研究保留了数据条目，但 published=false；补齐真实资料和公开许可后再展示。
- 联系邮箱为空，页面明确说明咨询尚未开放。填入真实邮箱即可显示邮件入口；当前没有服务端联系表单。
- 这份源码并不包含上述外部作品本身的源码。
- 不宣称已验证中国大陆访问、真实 iPhone/Safari、Core Web Vitals 或 Cloudflare 线上规则。

## 7. Git 历史

压缩包外层的 betarchivo.git.bundle 是先前源码提交历史备份。普通使用直接打开 betarchivo 文件夹即可，无需操作 bundle。新增的中文说明属于本次交付补充，不在此前 bundle 提交中。

## 8. 上线后检查

检查 /en/、/es/、/zh/ 及项目深层链接的直接打开和刷新；检查图片、语言切换、抽屉、筛选和邮件入口。中国大陆的实际可访问性需要在多地区、多运营商网络单独验证，不能由部署成功推断。
