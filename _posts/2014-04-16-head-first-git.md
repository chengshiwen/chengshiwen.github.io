---
layout: post
title: 深入浅出Git
description: Git是一款自由和开源的分布式版本控制工具，用于软件项目的管理和开发。本篇文章从Git基本概念和原理出发，深入浅出地介绍Git的基本命令和使用技巧，及博主在使用Git和GitHub过程中的一些心得体会，借以温故知新。
category: blog
---

[Git][]是一款自由和开源的分布式版本控制工具，用于软件项目的管理和开发。本篇文章从Git基本概念和原理出发，深入浅出地介绍Git的基本命令和使用技巧，及博主在使用Git和[GitHub][]过程中的一些心得体会，借以温故知新。

## Git简介

Git是[Linus Torvalds][]为了帮助管理Linux内核开发而开发的一个开放源码的版本控制工具。

Torvalds开始着手开发Git是为了作为一种过渡方案来替代BitKeeper，后者之前一直是Linux内核开发人员在全球使用的主要源代码工具。开放源码社区中的有些人觉得BitKeeper的许可证并不适合开放源码社区的工作，因此Torvalds决定着手研究许可证更为灵活的版本控制系统。尽管最初Git的开发是为了辅助Linux内核开发的过程，但是现在越来越多的公司、开源项目使用Git，包括Ruby On Rails，jQuery，Perl，Debian，Linux Kernel等等。

Git和其它版本控制系统的主要差别在于，Git只关心文件数据的整体是否发生变化，性能因此大大提高，而大多数其它系统则只关心文件内容的具体差异。相比其它版本控制工具，Git具有如下优点：

- 快速
- 设计简单
- 完全分布式
- 离线工作
- 支持回退
- 保持工作独立
- 不会丢失版本库
- 更少的仓库污染
- 随时随地自由提交
- 出色的合并追踪能力
- 对非线性开发模式的强力支持
- 超大规模项目的高效管理能力

### Git基础

#### SHA-1哈希值

所有保存在Git数据库中的历史提交（一次提交对应项目文件的一次修改）都是用类似于如下40位十六进制字符组成的字符串来作索引的，而不是靠文件名，它是由[SHA-1][1]算法计算文件的内容或目录的结构得出的一个SHA-1哈希值，也叫commit字符串。一般情况下，每个提交都能被前7位字符组成的字符串唯一索引到，如`24b9da6`能索引到如下commit字符串对应的提交。

	24b9da6552252987aa493b52f8696cd6d3b00373

#### 文件的三种状态

对于任何一个文件，在Git内都只有三种状态：已提交（committed），已修改（modified）和已暂存（staged）。**已提交**表示该文件已经被安全地保存在本地仓库中了；**已修改**表示修改了某个文件，但还没有提交保存；**已暂存**表示把已修改的文件放在下次提交到本地仓库时要保存的清单中。

![](/assets/images/head-first-git/01.png)

由此可见Git管理项目时，文件流转的三个工作区域：Git的工作目录，暂存区域，以及本地仓库（Git目录）。

每个项目都有一个**Git目录**（git directory），它是Git用来保存所有历史提交、记录所有数据信息的地方（即本地仓库）。该目录非常重要，每次克隆镜像仓库的时候，实际拷贝的就是这个目录里面的数据。每一个项目只能有一个Git目录，一般对应项目根目录下的`.git`目录。

**工作目录**（working directory）是保存当前正在编辑的文件所在的临时目录，这些文件都是从Git目录中取出的，可以修改直到下次提交保存。

**暂存区域**（staging area）是一个简单的文件，也叫索引（index）文件，一般都对应Git目录下的index文件（`.git/index`），其存放了与当前暂存内容相关的信息，包括暂存的文件名、文件内容的SHA1哈希值和文件访问权限，整个索引文件的内容以暂存的文件名进行排序保存的。

基本的Git工作流程如下：

1. 在工作目录中修改某些文件。
2. 对修改后的文件进行快照，保存到暂存区域。
3. 提交更新，将保存在暂存区域的文件快照永久转储到Git目录中。

所以，可以从文件所处的位置来判断状态：如果是Git目录中保存着的特定版本文件，就属于已提交状态；如果作了修改并已放入暂存区域，就属于已暂存状态；如果自上次取出后，作了修改但还没有放到暂存区域，就是已修改状态。

## Git安装和配置

### Git安装

#### 1、Linux

在Fedora上用yum安装：

	$ yum install git-core

在Ubuntu这类Debian体系的系统上，可以用apt-get安装：

	$ apt-get install git

其它Linux和Unix系统请参考[这里][2]。

#### 2、Mac

下载[Git for OS X][3]安装包

	http://code.google.com/p/git-osx-installer

#### 3、Windows

下载[msysGit][4]安装包

	http://msysgit.github.io

#### 4、Git图形化工具

- [GitX](http://gitx.frim.nl)（Mac，开源免费）
- [GitX (L)](http://gitx.laullon.com)（Mac，开源免费）
- [SourceTree](http://www.sourcetreeapp.com)（Windows / Mac，免费）
- [TortoiseGit](https://code.google.com/p/tortoisegit/)（Windows，免费）
- [GitHub for Mac](https://mac.github.com)，[GitHub for Windows](https://windows.github.com)（Mac / Windows，免费）
- [GitEye](http://www.collab.net/giteyeapp)（Windows / Linux / Mac，免费）
- [git-cola](https://code.google.com/p/gitextensions)（Windows / Linux / Mac，开源免费）
- [Git Extensions](http://git-cola.github.io)（Windows / Linux / Mac，免费）

### Git配置

Git提供`git config`命令来配置或读取相应的工作环境变量，这些变量可以存放在以下三个不同的地方（下文不做特殊说明均以Linux为例）：

- `/etc/gitconfig`文件：系统配置文件，使用`git config --system`进行读写。
- `~/.gitconfig`文件：用户目录下的配置文件，使用`git config --global`进行读写。
- `{项目目录}/.git/config`文件：当前项目的配置文件，使用`git config --local`或`git config`进行读写。

每一个级别的配置都会覆盖上层的相同配置。

#### 1、用户信息

首次使用Git需要配置你个人的**用户名**和**电子邮箱**，每次Git提交时都会引用这两条信息，说明是谁提交了更新：

	$ git config --global user.name "cheng-shiwen"
	$ git config --global user.email chengshiwen0103@gmail.com

#### 2、文本编辑器

Git编辑文件、查看差异、需要输入额外消息时，会自动调用外部文本编辑器，默认是Vi或者Vim。如果你偏好Emacs，可以重新设置：

	$ git config --global core.editor emacs

#### 3、配置颜色

Git能够为输出到你终端的内容着色，以便你可以凭直观进行快速、简单地分析

	$ git config --global color.ui true

上述命令开启默认终端配色，若想配置自定义颜色，可以参考`git config --help`。

#### 4、查看配置信息

要查看已有的配置信息，可以使用 `git config --list` 命令：

	$ git config --list
	user.name=cheng-shiwen
	user.email=chengshiwen0103@gmail.com
	color.ui=true
	core.repositoryformatversion=0
	core.filemode=true
	core.bare=false
	core.logallrefupdates=true
	...

查看某个变量的配置，只需把这个变量放在`git config [--system/--global/--local]`后面即可，例如：

	$ git config --global user.name


## Git基本命令


## Git文件忽略


## GitHub配置和使用



[Git]:	http://git-scm.com "Git"
[Github]:   http://github.com "Github"
[Linus Torvalds]:	http://zh.wikipedia.org/wiki/Linus_Torvalds "Linus Torvalds"
[1]:	http://zh.wikipedia.org/wiki/SHA1
[2]:	http://git-scm.com/download/linux
[3]:	http://code.google.com/p/git-osx-installer
[4]:	http://msysgit.github.io
