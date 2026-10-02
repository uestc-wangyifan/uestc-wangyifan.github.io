# Wang Yifan — Personal engineering notebook

王一帆的静态个人主页、技术博客与工程项目档案。Astro + Tailwind CSS + TypeScript + Markdown / MDX，使用 GitHub Actions 部署到 GitHub Pages。没有常驻后端、数据库或服务器要求。

默认地址：<https://uestc-wangyifan.github.io>

准备的自定义域名：`uestcwangyifan.me`

## 本地开发

使用 Node.js 24 LTS（最低 22.12.0）与 npm。

```sh
git clone https://github.com/uestc-wangyifan/uestc-wangyifan.github.io.git
cd uestc-wangyifan.github.io
npm install
npm run dev
```

打开命令显示的本地地址，默认 `http://localhost:4321`。

```sh
npm run check    # Astro / TypeScript 类型检查
npm run build    # 生成 dist/ 纯静态产物
npm run verify   # 检查生成页面、内部链接、锚点、图片和必要部署文件
npm run preview # 预览构建产物
```

`package-lock.json` 应提交到仓库。CI 按要求执行 `npm install`；需要严格按锁文件重装时也可以运行 `npm ci`。不要提交 `node_modules/`、`.astro/` 或 `dist/`。

## 目录与页面

```text
src/
  components/         导航、页脚、项目卡片、文章列表、MDX 提示框
  content/blog/       Markdown / MDX 博客
  content/projects/   Markdown / MDX 项目档案
  content.config.ts   两个 Content Collections 的类型与校验
  data/site.ts        姓名、学校、专业、GitHub、邮箱、分类
  layouts/            公共布局、SEO、主题切换
  lib/content.ts      发布筛选、排序与日期格式
  pages/              静态页面、动态内容路由、RSS、robots
  styles/global.css   Tailwind、设计变量、响应式与文章样式
public/
  CNAME               自定义域名准备
  .nojekyll           防止静态资源经过 Jekyll 处理
  images/             博客和项目静态图片
scripts/verify-build.mjs
.github/workflows/deploy.yml
```

路由：`/`、`/projects/`、`/projects/[slug]/`、`/blog/`、`/blog/[slug]/`、`/about/`、`/resume/`、`/404.html`。

附加产物：`/rss.xml`、`/robots.txt`、`/sitemap-index.xml`。这是用户站点仓库，`base` 为根路径；不要设置为 `/uestc-wangyifan.github.io/`。

## 新增博客

在 `src/content/blog/` 新建 `.md` 或 `.mdx` 文件，使用小写英文与连字符命名。文件名会成为 slug，例如 `adc-notes.md` → `/blog/adc-notes/`。也支持子目录。

```yaml
---
title: "你的文章标题"
description: "一两句话描述文章内容。"
date: 2026-10-02
tags: [STM32, ADC]
category: Embedded
draft: true
sample: false
---
```

正文使用二级标题 `##`，需要细分时使用 `###`；页面自动生成这两级目录。一级标题由布局提供。分类可选：`Embedded`、`Control`、`Electronics`、`Signals`、`Learning Notes`。

`draft: true` 的文章不会生成页面，也不会出现在首页、博客、RSS 与 sitemap 中。完成写作后将其设为 `false`。日期只控制排序，不自动定时发布；未来日期也会发布。`sample: true` 会显示「示例」提示，正式文章设为 `false` 或省略。

````md
## 代码

```c
uint16_t sample = 0;
```

## 数学公式

行内公式：$e_k = r_k - y_k$

$$
J = \sum_{k=0}^{N} e_k^2
$$

## 图片

![准确描述图片内容](/images/your-image.png)

## 表格

| 参数 | 值 |
| --- | --- |
| 待确认项 | 待补充 |
````

图片放到 `public/images/`，页面引用 `/images/...`。代码使用 Shiki 的 GitHub Light / Dark 配色。数学公式由 remark-math + rehype-katex 渲染，KaTeX CSS 与字体随构建本地打包，无需外部 CDN。

MDX 可引入 Astro 组件：

```mdx
import Callout from '../../components/Callout.astro';

<Callout title="注意">
  在这里写说明。
</Callout>
```

修改内容后，首页自动读取最新三篇公开文章；博客支持分类筛选与标签链接，无需修改布局。

## 新增项目

在 `src/content/projects/` 新建 `.md` 或 `.mdx`。例如 `new-project.md` → `/projects/new-project/`：

```yaml
---
title: "Project English Name"
titleZh: "项目中文名称"
description: "简洁介绍项目。"
stack: [STM32, Embedded]
order: 5
selected: false
kind: robotics
status: "资料整理中"
# 仅填写真实的项目仓库；未提供时链接到 GitHub 主页并明确标注。
# repository: "https://github.com/uestc-wangyifan/REAL_REPOSITORY"
gallery: []
---
```

`selected: true` 显示在首页；`order` 控制顺序；`kind` 选择概念线稿：`robotics`、`signals`、`electronics`、`instrument`。技术栈标签是档案分类，正式资料应进一步说明具体使用情况。

正文模板：

```md
## Overview
问题与目标。

## Hardware
硬件与电路资料。

## Software
固件与工具。

## Architecture
系统结构与接口。

## Results
测试条件、测量结果与局限。
```

Gallery 与 Repository 由页面根据 frontmatter 自动显示，无需在正文重复这两个标题。图库添加示例（先放入真实图片）：

```yaml
gallery:
  - src: /images/projects/new-project/board.jpg
    alt: "电路板正面"
    caption: "实际照片与版本说明"
```

未提供仓库、图库、参数、时间或成果时保留「待补充」，不要把概念线稿、写作模板或源码构建成功当作硬件验证。

## 个人信息与主题

公共信息修改 `src/data/site.ts`。`email` 默认空字符串，展示 `Email · 待补充`，不会产生假的邮箱链接。填入真实邮箱后全站页脚激活 `mailto:`。

默认跟随系统 Light / Dark，用户点击切换后保存在 `localStorage`。不依赖 React 等客户端框架；移动导航、分类筛选、主题切换与打印使用少量浏览器脚本。禁用 JavaScript 时文章和导航仍可访问。

全站使用系统无衬线字体栈，覆盖 Windows 的 Microsoft YaHei、Apple 的 PingFang SC 和 Android 的 Noto Sans CJK；不从远端加载字体。`/resume/` 仅列出已提供的教育信息与项目目录，支持浏览器打印为 PDF。

## GitHub Pages 部署

1. 在目标仓库打开 **Settings → Pages → Build and deployment → Source → GitHub Actions**。
2. 如果 Actions 未启用，打开 **Settings → Actions → General**，允许本仓库使用 GitHub Actions 及官方 actions。
3. 将源码提交到 `main`。工作流自动安装依赖、类型检查、构建、验证内部链接、上传 `dist/` 并部署。
4. 打开仓库 **Actions → Build and deploy to GitHub Pages**，确认 build 与 deploy 都成功。
5. 访问站点并检查文章、导航、图片和 404 页面。

也可在 Actions 工作流页面点击 **Run workflow** 手动部署。PR 仅检查构建与内部链接，不发布。

工作流使用 `contents: read`；仅部署 job 使用 `pages: write` 和 `id-token: write`。不需要个人访问令牌，也不需要长期运行服务器。如果 `github-pages` environment 要求人工审批，需在部署时审批或由仓库所有者调整该 environment 的规则。

## 自定义域名 uestcwangyifan.me

当前构建默认使用 `https://uestc-wangyifan.github.io` 作为 canonical、RSS 与 sitemap 的地址，以便在 DNS 尚未准备好时直接访问 GitHub 默认域名。启用自定义域名时：

1. 建议先在 GitHub 账号 **Settings → Pages** 验证域名所有权。TXT 名称和值使用 GitHub 当时提供的实际内容，不要猜测验证码。
2. 在仓库 **Settings → Pages → Custom domain** 填入 `uestcwangyifan.me` 并保存。
3. 配置下文 DNS，等待 GitHub 的 DNS 检查和证书签发。
4. 在仓库 **Settings → Secrets and variables → Actions → Variables** 添加 `SITE_URL`，值为 `https://uestcwangyifan.me`；重新运行工作流，使 canonical、RSS 和 sitemap 同步。
5. Pages 中 **Enforce HTTPS** 可用后启用，并访问 HTTPS 地址确认。

根目录原有 `CNAME` 已保留；`public/CNAME` 确保构建产物包含相同域名。**GitHub 官方说明：通过自定义 Actions 工作流发布时，CNAME 文件并非必需且会被忽略；真正生效的是 Pages 的 Custom domain 设置。** 不要仅修改 CNAME 而遗漏 Pages 设置。

本地可复制 `.env.example` 为 `.env` 并设置 `SITE_URL`，或通过环境变量覆盖。不要在未配置 Pages 和 DNS 时假定自定义域名已经上线。

### Namecheap DNS（仅操作说明，本工程不修改 DNS）

若域名当前使用 Namecheap BasicDNS / PremiumDNS / FreeDNS，可在 **Domain List → Manage → Advanced DNS → Host Records** 设置：

| 类型 | Host | Value | TTL |
| --- | --- | --- | --- |
| A Record | @ | 185.199.108.153 | Automatic |
| A Record | @ | 185.199.109.153 | Automatic |
| A Record | @ | 185.199.110.153 | Automatic |
| A Record | @ | 185.199.111.153 | Automatic |
| CNAME Record | www | uestc-wangyifan.github.io | Automatic |

可选 IPv6：为 `@` 添加 `2606:50c0:8000::153`、`2606:50c0:8001::153`、`2606:50c0:8002::153`、`2606:50c0:8003::153` 四条 AAAA，保留 IPv4 A 记录。

先检查同名 `@` / `www` 的已有记录。**如果 Minecraft 依赖根域名 `@`，或其 SRV target 指向根域名，直接把 `@` 改为 GitHub IP 会影响 Minecraft。不要执行这个变更，应先安排独立游戏子域名，或让博客使用单独子域名。** 本任务没有检查或更改你的 Minecraft DNS，不假定根域名未使用。

保留 Minecraft 的 A/AAAA、SRV、端口与目标地址；不要删除 `_minecraft._tcp`、游戏主机子域名、MX/TXT，不要批量重置 DNS 或改 Nameservers。`www` 若也被其他用途占用，先确认再设置。已有同名冲突记录需逐条确认用途后处理，不能盲目叠加新旧网站 IP。

如果当前 Nameservers 不属于 Namecheap DNS，需在实际权威 DNS 服务商添加网站记录，不要为了博客直接换 Nameservers。DNS 更新可能需最多 24 小时传播。

官方依据：

- [Astro GitHub Pages deployment](https://docs.astro.build/en/guides/deploy/github/)
- [Astro Content Collections](https://docs.astro.build/en/guides/content-collections/)
- [GitHub custom domain configuration](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)
- [Namecheap GitHub Pages guide](https://www.namecheap.com/support/knowledgebase/article.aspx/9645/2208/how-do-i-link-my-domain-to-github-pages/)

## 发布检查

每次正式发布前运行 `npm run check`、`npm run build`、`npm run verify`，并用浏览器抽查手机、平板与 PC 宽度、Light / Dark、移动菜单、分类筛选、Markdown / MDX、公式、长代码滚动与真实未知路径的 404。

三篇初始文章全部显式标记为示例；四个初始项目只有已提供的名称和方向。个人项目细节、公开仓库、照片、日期与实测结论需由真实资料补充。
