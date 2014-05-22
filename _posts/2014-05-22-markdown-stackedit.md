---
layout: post
title: 在线 Markdown 编辑器 StackEdit
description: StackEdit 是作者 Benoit Schweblin 开发的一个在线 Markdown 编辑器，基于 PageDown，不仅开源免费，完全支持 Markdown 的所有特性，而且还支持 LaTeX 数学公式编辑、实时预览、多份文档同时管理、在线同步、远端网盘和本地硬盘备份、PDF 和 HTML 文档发布等诸多强大功能。
category: blog
---

[StackEdit][] 是作者 [Benoit Schweblin][1] 开发的一个在线 [Markdown][] 编辑器，基于 [PageDown][]，不仅开源免费，完全支持 Markdown 的所有特性，而且还支持 [LaTeX][] 数学公式编辑、实时预览、多份文档同时管理、在线同步、远端网盘和本地硬盘备份、PDF 和 HTML 文档发布等诸多强大功能。

## StackEdit

StackEdit 简洁界面一览

![](/assets/images/markdown-stackedit/stackedit-welcome.png)

### 功能支持

- 实时 HTML 预览并自动滚动定位到编辑处（所见即所得）
- 支持 Markdown Extra / GitHub Flavored Markdown 扩展语法
- 支持 Prettify / Highlight.js 语法高亮
- 支持 LaTeX 数学公式（基于 MathJax）
- 在线或离线管理多份 MarkDown 文档
- 离线编辑
- 通过自定义模板导出 Markdown，HTML 或 PDF 格式文件
- Google Drive 和 Dropbox 在线同步
- 支持从 Google Drive，Dropbox，URL 和本地硬盘驱动器导入 MarkDown 文档
- 发布 MarkDown 文章到 Blogger / Blogspot，WordPress 或 Tumblr
- 发布 MarkDown 文档到 GitHub，Gist，Google Drive，Dropbox 或 SSH 服务器
- 管理已发布的文档
- 分享一个已被渲染的 MarkDown 文档链接
- 文档信息统计显示
- 支持将 HTML 转换为 MarkDown
- 支持布局和扩展配置
- 支持主题切换
- 支持所有文档导入、导出、重置、恢复

### 相关语法

- [Markdown 语法][2]
- [Markdown Extra  语法][3]
- [使用 MathJax 编写 LaTeX 数学公式][4]

## 本地部署

StackEdit 支持离线编辑，但前提是 StackEdit 所有必需数据已经加载在本地，并且应访问`https://stackedit.io`，而非`stackedit.io`。如果在浏览器中从未使用过 StackEdit 或不小心清空了浏览器的所有数据，那么 StackEdit 也将无法离线加载运行。

此外，可以将 StackEdit 部署到本地，从而避免网络因素导致的各种问题，具有更大的灵活性。

### 1、安装 Node.js

在 [Node.js][5] 官网下载相应的安装包安装即可，下载地址

    http://nodejs.org/download/

### 2、下载 StackEdit

在 [StackEdit][6] 下载 Releases 最新版本的 zip 压缩包，解压后可放置到任何目录下。下载地址

    https://github.com/benweet/stackedit/releases

此外，StackEdit 默认显示宋体，若想 HTML 预览及发布的 PDF 显示微软雅黑，本文提供[微软雅黑版本的 StackEdit][7]，下载地址

    http://pan.baidu.com/s/1pJAu7F1

### 3、启动 StackEdit

#### 命令行操作

使用 Windows 的命令提示符（CMD）、Linux 或 Mac 下的终端（Terminal），进入到 StackEdit 文件夹根目录下，执行如下命令

- 下载 StackEdit 依赖的所有库（只须初始配置时执行）

        $ npm install

- 启动 StackEdit

        $ node server.js

    显示如下信息表示启动成功，在浏览器中输入 `http://localhost:3000` 即可

        Server started: http://localhost:3000

#### 一键操作

如果不会命令行，可以使用一键操作

- Windows 用户请下载 [startup.bat.zip][8]
- Linux 和 Mac 用户请下载 [startup.sh.zip][9]

将压缩包解压后的 `startup.bat` 或 `startup.sh` 文件放置到 StackEdit 文件夹根目录下（与 `server.js` 同级），双击它即可启动 StackEdit。

同样，在浏览器中输入 `http://localhost:3000` 即可访问。若要关闭 StackEdit，则只需关闭命令框。

注：Linux 用户双击它后请选择**在终端中运行**（Run in Terminal）。


## 技巧提示

- StackEdit 将所有文档保存在浏览器本地存储中，因此重新打开浏览器将不会丢失任何曾编辑的文档，除非清空浏览器的所有数据。
- 若没有设置在线同步，跨浏览器将无法访问到原浏览器的所有文档。<br/>
  当然，也可以采取从原浏览器导出所有文档和设置（Settings - Utils - Export docs & settings）后再导入到新浏览器中（Settings - Utils - Import docs & settings）。
- 离线编辑应访问`https://stackedit.io`，而非`stackedit.io`。
- **发布 PDF**：当文档内容很长且数学公式很多时，PDF 很容易发布失败，这是因为 StackEdit 会去请求 `https://stackedit-htmltopdf.herokuapp.com/` 将 HTML 文档转换为 PDF，网络环境较差或请求的服务器负载过大都可能产生这样的问题。<br/>
  若遇到这样的问题，Chrome 浏览器可以采取如下方法生成 PDF：
    1. 在 StackEdit 实时预览界面右键点击**打印**
    2. **目标** 选择 **更改...** — **另存为 PDF**
    3. **边距** 选择 **自定义**，根据文档情况进行实际设置（建议上下各20.0mm，左右各15.0mm）
    4. **选项** 取消 **页眉和页脚** 会使文档更简洁
    5. **保存**
- **插入图片**：有时会因上下文需要而插入图片，<br/>
  对于有网址链接的图片，直接插入网址链接即可；<br/>
  对于本地图片，若在线，可以将图片上传至[Hoop8][10]，然后插入该图片生成的网址链接；<br/>
  对于本地图片，且使用本地部署的 StackEdit，则无论在线离线，均可采用如下方式：
    1. 将图片 `example.png` 放置到 `{StackEdit目录}/public/res-min/img/`目录下
    2. 插入 `/res-min/img/example.png` 链接即可使用该图片

![](/assets/images/markdown-stackedit/stackedit-image.png)
{:style="margin-top: -20px;"}


[StackEdit]:    https://stackedit.io/
[Markdown]:     http://daringfireball.net/projects/markdown/
[PageDown]:     https://code.google.com/p/pagedown/
[LaTeX]:        http://zh.wikipedia.org/wiki/LaTeX
[1]:    https://github.com/benweet
[2]:    http://wowubuntu.com/markdown/
[3]:    https://github.com/jmcmanus/pagedown-extra
[4]:    http://iori.sinaapp.com/17.html
[5]:    http://nodejs.org/download/
[6]:    https://github.com/benweet/stackedit/releases
[7]:    http://pan.baidu.com/s/1pJAu7F1
[8]:    http://pan.baidu.com/s/1jGj00i6
[9]:    http://pan.baidu.com/s/1mgjwuWK
[10]:   http://img.hoop8.com/
