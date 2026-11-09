BETARCHIVO 2.3 — ENTRE FLORES 图库修复

原因：之前 projects.ts 中已经有 gallery 数组，图片文件也存在，但项目详情页 Astro 模板没有渲染 project.gallery，所以只有封面。

本次仅增加项目详情页 gallery 渲染和相应 CSS，并以用户本次上传的五张 WebP 覆盖对应资源。保留 2.2 的首页、按钮、抽屉、导航及其他修改。

修改：src/pages/[lang]/[...path].astro；src/styles/global.css；public/assets/entre-flores-{cover,spring,autumn,builder,creations}.webp。

未进行 Astro 构建或线上部署。请先本地 npm install、npm run build、npm run dev 验证。
