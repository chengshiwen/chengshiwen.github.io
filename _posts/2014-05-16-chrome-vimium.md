---
layout: post
title: Chrome 浏览神器：Vimium
description: 对于不喜欢使用鼠标，只热衷使用键盘快捷键完成一切电脑操作的 Geeker，在浏览网页时，也不得不被太多的网页链接所影响，导致效率严重降低。不过如果你使用 Chrome 浏览器的话，那么 Vimium 将是帮助你浏览网页的快捷键神器。
category: blog
---

对于不喜欢使用鼠标，只热衷使用键盘快捷键完成一切电脑操作的 Geeker，在浏览网页时，也不得不被太多的网页链接所影响，导致效率严重降低。不过如果你使用 Chrome 浏览器的话，那么 [Vimium][] 将是帮助你浏览网页的快捷键神器。

### Vimium

Vimium 其实就是 [Vim][] 与 [Chromium][] 的复合词，这款扩展基于 Vim 编辑器的键位设计，使用 Vim 的用户很容易就能上手。即使你非常不习惯默认的键位映射，也可以自行通过扩展设定进行修改，甚至还可以设定链接提示所用的字符和 CSS 样式。

对于网页上的链接，Vimium 会为每个链接指定一个独立的快捷键组合，也就是说每一个页面上的每一个链接都可以通过程序自动生成的组合键打开。查看链接的组合键，只需要按 `f` 键即可，如下图所示：

![](/assets/images/chrome-vimium/shortcuts.png)

此时再按 `C+M`（大小写均可），就可以打开[奇小在的个人网站][1]{:target="_blank"}。值得一提的是，按下 `C` 之后，就会自动将其它首组合键不是 `C` 的提示过滤掉，以保证页面的整洁。

如果在某些功能操作上，不知道应该使用哪个快捷键的话，可以直接按 `?` 键调出帮助框：

![](/assets/images/chrome-vimium/vimiumhelp.png)

### 页面操作

- `j, <c-e>`：向下滚动（`<c-e>` 即 `<ctrl-e>` 或 `<control-e>`）
- `k, <c-y>`：向上滚动（`<c-y>` 即 `<ctrl-y>` 或 `<control-y>`）
- `h`：向左滚动
- `l`：向右滚动
- `gg`：跳到最顶部
- `G`：跳到最底部
- `d`：向下翻页
- `u`：向上翻页
- `r`：重新加载页面
- `gs`：查看网页源代码
- `yy`：复制当前页面网址到剪贴板
- `yf`：复制一个网页链接到剪贴板
- `p`：在当前标签页打开剪切板的网址
- `P`：在新建标签页打开剪切板的网址
- `i`：进入插入模式（禁用 Vimium 快捷键，此时可使用网站已有的快捷键）
- `gi`：将焦点定位到第一个输入框（`Ngi` 定位到第 `N` 个输入框）
- `f`：在当前标签页打开网页链接
- `F`：在新建标签页打开网页链接
- `<a-f>`：在新建标签页打开多个网页链接（`<a-f>` 即 `<alt-f>` 或 `<option-f>`）
- `o`：在当前标签页打开网址、书签或历史
- `O`：在新建标签页打开网址、书签或历史
- `T`：在已打开的标签页中搜索
- `b`：在当前标签页打开书签
- `B`：在新建标签页打开书签
- `[[`：网页有分页时打开前一页
- `]]`：网页有分页时打开后一页
- `gf`：循环到当前页面的下一个框层
- `m`：创建页面标记（先按`m`再按任意字母则设定了标记）
- `` ` ``：跳到设定标记的位置（先按`` ` ``再按之前设定字母则跳到相应位置）

### 查找操作

- `/`：进入查找模式，输入待查找内容
- `n`：循环向后查找匹配内容
- `N`：循环向前查找匹配内容

### 历史操作

- `H`：回退到前一个历史页面
- `L`：前进到后一个历史页面

### 标签操作

- `K, gt`：循环跳到右边的标签页
- `J, gT`：循环跳到左边的标签页
- `g0`：跳到最左边的标签页
- `g$`：跳到最右边的标签页
- `t`：新建标签页
- `yt`：在新建标签页中打开当前页面的副本
- `x`：关闭当前标签页
- `X`：恢复已关闭的标签页
- `W`：将当前标签页移至新窗口

### 查看帮助

- `?`：显示帮助信息


[Vimium]:   http://vimium.github.io/
[Vim]:      http://www.vim.org/
[Chromium]: http://www.chromium.org/
[1]:        http://chengshiwen.com/
