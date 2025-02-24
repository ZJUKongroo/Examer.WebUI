<div align="center">
<h1 align="center">ACEE 试题提交系统</h1>
<hr>
[English](./README.md) / 简体中文
</div>

## 概述

ACEE 试题提交系统是一款基于 Vue 3、TypeScript 和 Vite 构建的现代化 Web 应用。该系统为试题提交、分组管理以及试题结果审核提供了简洁高效的界面。应用采用了先进的 UI 库和现代化开发方法，致力于为开发者和最终用户提供流畅的使用体验。

## 前置条件

在构建和运行项目之前，请确保已安装以下依赖：

- [Node.js (v14 或更高版本)](https://nodejs.org)
- [pnpm](https://www.pnpm.io/)

## 安装步骤

1. **克隆仓库**将项目仓库克隆到本地：

   ```bash
   git clone https://github.com/ZJUKongroo/Examer.WebUI
   cd Examer.WebUI
   ```
2. **安装依赖**
   使用 pnpm 安装项目依赖：

   ```bash
   pnpm install
   ```

## 运行应用

### 开发模式

在开发模式下启动应用（支持热模块替换）：

```bash
pnpm dev
```

该命令启动本地开发服务器，你可以在终端提供的 URL（通常为 http://localhost:3000）中访问该应用。

### 生产构建

构建适用于生产环境的应用：

```bash
pnpm build
```

该命令将应用打包成静态文件，可部署到任意 Web 服务器上。

### 预览生产构建

构建完成后，你可以本地预览生产构建，以验证一切功能是否正常：

```bash
pnpm preview
```

该命令将启动一个服务器，用以提供构建后的静态文件进行测试。

## 使用方法

- **导航与路由：**应用采用 Vue Router 来实现各页面之间的导航（如 LicenseView、GroupView、ReviewView、CandidateView）。每个页面均设计用于处理特定功能，例如许可证信息、考生管理、试题分组以及试题提交的复核。
- **状态管理：**通过 Pinia 来管理全局状态。各个 store 用于管理诸如试题提交记录、用户详情及应用配置等状态信息。
- **HTTP 请求：**本项目使用 Axios 处理 HTTP 请求，其在开发环境下通过 Vite 的代理配置与后端 API 接口无缝对接。
- **UI 组件：**
  项目集成了来自 Vuetify 的 UI 组件，保证了响应式与一致的界面设计。同时，Anime.js 提供的动画效果提升了用户交互体验。

## 构建流程与部署

- **构建流程：**应用使用 Vite 构建，这不仅能够实现快速的开发启动，还能高效打包生成生产环境代码。构建流程涵盖了 TypeScript、Vue 单文件组件以及静态资源的处理。
- **部署：**
  生产构建将输出静态文件，这些文件可以部署在任何标准 Web 服务器或托管服务中。在部署到生产环境时，请确保正确设置相关环境变量。
