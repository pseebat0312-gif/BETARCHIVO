# BETARCHIVO 云端成果交接

## 保存范围

仓库：`pseebat0312-gif/BETARCHIVO`。
分支：`dev/3d-archive`。
原始基准：`889aa705915048f5bb6a249946fdfd786090de3e`。

本次仅保存已完成的 Three.js 单抽屉原型源码、依赖锁文件、已有测试和说明，不继续开发、不重新构建。未纳入 `node_modules`、`dist`、缓存、环境变量文件、下载包或截图。

`ARCHIVE_PROTOTYPE_ZH.md` 中“尚未提交或推送”的表述是原型开发结束时的历史状态。本次交接提交用于保存该成果，实际远程状态应以 GitHub 分支及 `git ls-remote` 为准。

## 部署安全

只读检查发现：原始基准提交在 `dev/3d-archive` 上已有 Cloudflare Pages 成功部署记录，分支预览为 `dev-3d-archive.betarchivo.pages.dev`。旧 `DEPLOYMENT.md` 关于尚未连接 Cloudflare 的描述已过时，不能用于判断推送安全。

本次提交信息使用 `[skip ci]` 前缀。Cloudflare 官方文档说明该前缀（大小写不敏感）会省略本次部署，无需配置变更；跳过的构建不会产生 check run。GitHub Actions 也支持 `[skip ci]` 跳过 push 工作流。

来源：https://developers.cloudflare.com/pages/configuration/git-integration/github-integration/#skipping-a-build-via-a-commit-message
官方文档源码：https://github.com/cloudflare/cloudflare-docs/blob/production/src/content/docs/pages/configuration/git-integration/github-integration.mdx

未更改 Cloudflare、GitHub Pages 或生产配置，没有创建 PR，也没有操作 main。注意：跳过标记仅针对本次提交；今后普通推送仍可能自动部署。继续开发前，应先明确后续部署策略，不要假设开发分支天然不会部署。

## Windows 恢复

尚无本地仓库时，在 PowerShell 运行：

```powershell
git clone --single-branch --branch dev/3d-archive https://github.com/pseebat0312-gif/BETARCHIVO.git
cd BETARCHIVO
git status --short --branch
git log -1 --format="%H %s"
```

已有本地仓库时，先检查并保存自己的未提交修改，不要执行 reset 或 clean：

```powershell
cd C:\你的路径\BETARCHIVO
git status --short --branch
git remote -v
git fetch origin dev/3d-archive
git switch dev/3d-archive
git merge --ff-only origin/dev/3d-archive
git log -1 --format="%H %s"
```

若本地还没有这个分支，使用 `git switch --track -c dev/3d-archive origin/dev/3d-archive`。若快进失败，停止并在本地 Codex 中处理分叉，不要强制覆盖。

在 Windows Codex 中打开该仓库目录，先读 `AGENTS.md`、`docs/DESIGN_SPEC.md` 和 `.agents/skills/frontend-design/SKILL.md`，确认分支及最新提交后继续开发。安装与本地预览可按需要运行：

```powershell
npm ci --ignore-scripts
$env:ASTRO_TELEMETRY_DISABLED="1"
npm run dev
```

依赖目录和构建产物按需本地生成，不需要从云端拷贝。使用与项目兼容的较新 Node.js 版本。
