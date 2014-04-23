---
layout: post
title: 深入浅出Git
description: Git是一款自由和开源的分布式版本控制系统，用于软件项目的管理和开发。本篇文章从Git基本概念和原理出发，深入浅出地介绍Git的基本命令和使用技巧，及博主在使用Git和GitHub过程中的一些心得体会，借以温故知新。
category: blog
---

[Git][]是一款自由和开源的分布式版本控制系统（_Version Control System_），用于软件项目的管理和开发。本篇文章从Git基本概念和原理出发，深入浅出地介绍Git的基本命令和使用技巧，及博主在使用Git和[GitHub][]过程中的一些心得体会，借以温故知新。


## Git简介

Git是[Linus Torvalds][]为了帮助管理Linux内核开发而开发的一个开放源码的版本控制系统。

Torvalds开始着手开发Git是为了作为一种过渡方案来替代BitKeeper，后者之前一直是Linux内核开发人员在全球使用的主要源代码工具。开放源码社区中的有些人觉得BitKeeper的许可证并不适合开放源码社区的工作，因此Torvalds决定着手研究许可证更为灵活的版本控制系统。尽管最初Git的开发是为了辅助Linux内核开发的过程，但是现在越来越多的公司、开源项目使用Git，包括Ruby On Rails，jQuery，Perl，Debian，Linux Kernel等等。

Git和其它版本控制系统的主要差别在于，Git只关心文件数据的整体是否发生变化，每个版本存储改动过的所有文件，而大多数其它系统则只关心文件内容的变化差异，每个版本存储变化前后的差异数据。相比其它版本控制工具，Git具有如下优点：

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


## Git基础

#### 1、Git快照

直接记录快照，而非差异比较——这是Git同其它系统的重要区别。快照（_Snapshot_），即在某个时间点对项目中的所有文件作的一次记录保存，也就是该项目在这个时间点上的一个版本。
每次提交更新时，Git会将项目中的所有文件纵览一遍并作一快照，然后保存一个指向这次快照的指针。为提高性能，若文件没有变化，Git不会将其保存到这次快照中，而只对之前保存过的相同文件作一链接。因此，Git更像是记录一连串变化文件的快照的文件系统。

![](/assets/images/head-first-git/02.png)

#### 2、Git仓库

Git仓库用于记录保存项目的元数据和对象数据，包括所有的历史快照、提交信息、分支信息和标签信息等。

![](/assets/images/head-first-git/00.png)

如上图所示，绿色节点表示一个**提交（commit）对象**，该对象包含一个指向某次快照的指针，本次提交的作者信息，以及零个或多个指向该提交对象的父对象的指针。其中7位字符串是相应提交的SHA-1哈希值的前7位，用于索引该次提交。

**分支（branch）**用橘色节点显示，分别指向特定的提交，其实本质上仅仅是个指向提交对象的可变指针。Git会使用master作为分支的默认名字。在若干次提交后，master分支会指向最近一次提交对象，它在每次提交的时候都会自动向前移动。dev分支即是指向`a473c87`提交对象的一个分支指针。<br/>
不同分支维护的功能不同，如版本稳定、新功能开发、代码测试等。

**HEAD指针**是一个指向你当前所处的本地分支的指针（相当于当前分支的别名，指向当前分支最近的一次提交对象），在你切换分支时会指向新的分支，而当每次提交后HEAD指针也会随着分支一起向前移动。

#### 3、SHA-1哈希值

所有保存在Git仓库中的历史提交都是用类似于如下40位十六进制字符组成的字符串来作索引的，而不是靠文件名，它是由[SHA-1][1]算法计算文件的内容或目录的结构得出的一个SHA-1哈希值，简称**commit哈希值**或**commit字符串**。一般情况下，每个提交对象都能被前7位字符组成的字符串唯一索引到，如`24b9da6`能索引到如下commit哈希值对应的提交对象。

    24b9da6552252987aa493b52f8696cd6d3b00373

为什么要索引提交对象呢？这有助于我们迅速索引到某个历史版本的提交，从而进行相关操作。

#### 4、^和~

除了commit哈希值能索引到提交对象，还可以通过`^`和`~`来确定具体的提交对象，而非记忆繁琐的commit哈希值。

- `^`表示父提交，`^`等同于`^1`，HEAD的父提交为`HEAD^ = HEAD^1`，HEAD的第n个父提交为`HEAD^^...^`（共n个`^`）
- `~`表示父提交，`~`等同于`~1`，HEAD的父提交为`HEAD~ = HEAD~1`，HEAD的第n个父提交为`HEAD~~...~ = HEAD~n`（共n个`~`）

#### 5、文件的三种状态

在Git管理项目时，文件流转的三个工作区域：Git目录（Git仓库），工作目录，以及暂存区域。

![](/assets/images/head-first-git/01.png)

每个项目都有一个**Git目录**（git directory），亦即Git仓库。该目录非常重要，每次克隆镜像仓库的时候，实际拷贝的就是这个目录里面的数据。每一个项目只能有一个Git目录，一般对应项目根目录下的`.git`目录。

**工作目录**（working directory）是项目某个版本的签出（_The working directory is a single checkout of one version of the project._）
，也就是本地项目目录，其包含该版本的所有文件（不包括Git目录），这些文件都是从Git目录中取出的，我们可以在工作目录中对它们进行修改。

**暂存区域**（staging area）是一个简单的文件，也叫索引（index）文件，一般都对应Git目录下的index文件（`.git/index`），其存放了与当前暂存内容相关的信息，包括暂存的文件名、文件内容的SHA1哈希值和文件访问权限，整个索引文件的内容以暂存的文件名进行排序保存的。

工作目录下的所有文件分为两种状态：已跟踪（tracked）或未跟踪（untracked）。**已跟踪**的文件是指已被纳入版本控制管理的文件，而所有其它文件都属于**未跟踪**文件（新放入到工作目录下的文件或从版本控制中移除的文件）。

已跟踪的文件又分为三种状态：已提交（committed），已修改（modified）和已暂存（staged）。**已提交**表示该文件已经被安全地保存在Git仓库中了；**已修改**表示修改了某个文件，但还没有提交保存；**已暂存**表示把已修改的文件放在下次提交到Git仓库时要保存的清单中。

要查看工作目录下的文件状态，可以用`git status`命令（详见<a href="#git-status">查看当前文件状态</a>）。


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

### 获得Git仓库

有两种获得Git项目仓库的方法：第一种是在现存的目录下，通过初始化来创建新的Git仓库；第二种是从已有的Git仓库克隆出一个新的镜像仓库来。

#### 1、在工作目录中初始化新仓库 {#git-init}

要对现有的某个项目开始用Git管理，只需到此项目所在的目录，执行：

    $ git init

初始化后，在当前目录下会出现一个名为`.git`的目录，所有Git需要的数据都存放在这个目录中。

#### 2、从现有仓库克隆 {#git-clone}

从现有的项目仓库（如远程服务器上自己的项目，或者其它某个开源项目）克隆到本地，Git接收的是项目历史的所有数据（包括每一个文件的每一个版本）。克隆仓库的命令格式为

    $ git clone <repo> [<dir>]

例如，要克隆jQuery仓库，可以执行以下命令：

    $ git clone git@github.com:jquery/jquery.git

克隆时可以在上面的命令末尾指定新的名字，来定义要新建的项目目录名称（仅目录名称不同），例如：

    $ git clone git@github.com:jquery/jquery.git myjquery

Git支持`git://`，`http(s)://`，`ssh://`等多种数据传输协议。

### Git的基本工作流程

Git的基本工作流程如下：

1. 修改文件：在工作目录中修改某些文件
2. 暂存文件：对修改后的文件进行快照或跟踪新文件，保存至暂存区域
3. 提交更新：将保存在暂存区域的文件快照永久转储到Git目录中

#### 1、查看当前文件状态 {#git-status}

要查看工作目录下当前文件的状态，运行`git status`：

    $ git status
    # On branch master
    # Your branch is behind 'origin/master' by 3 commits, and can be fast-forwarded.
    #
    # Changes to be committed:
    #   (use "git reset HEAD <file>..." to unstage)
    #
    #   new file:   daemon.c
    #	modified:   grep.c
    #
    # Changes not staged for commit:
    #   (use "git add <file>..." to update what will be committed)
    #   (use "git checkout -- <file>..." to discard changes in working directory)
    #
    #   modified:   .gitignore
    #   modified:   grep.h
    #
    # Untracked files:
    #   (use "git add <file>..." to include in what will be committed)
    #
    #   README.md

其中第一行表示当前处在master分支，第二行表示当前分支与远程对应分支的比较结果；<br/>
`Changes to be committed`表示已暂存，`Changes not staged for commit`表示已修改，`Untracked files`表示未跟踪。

若该命令得到以下结果，则表明当前的工作目录相当干净。

    On branch master
    nothing to commit, working directory clean

常用参数：

- `git status -s`：查看状态的简要信息
- `git status --ignored`：查看被忽略的文件

#### 2、暂存文件 {#git-add}

基本命令为`git add`，其作用是把目标文件快照放入暂存区域（_add file into staged area_）。

##### 跟踪新文件

使用命令`git add`开始跟踪一个新文件（未跟踪文件）。例如，跟踪`README.md`文件：

    $ git add README.md

此时，运行`git status`会看到README.md文件已被跟踪，并处于暂存状态。

##### 暂存已修改文件

`git add`可以将已修改的文件更新至暂存区域，变成已暂存状态。例如，暂存`.gitignore`文件：

    git add .gitignore

常用参数

- `git add`：暂存新文件和已修改文件，不包括被删除文件
- `git add -u`：暂存已修改文件和被删除文件，不包括新文件
- `git add -A`：暂存所有文件，包括新文件、已修改文件和被删除文件

此外，建议不用使用`git add .`，除非已经非常明确所有的新文件和已修改文件都需要暂存，否则这将导致越来越多的不必要文件（如临时文件、build文件、误入文件等）被加入到版本控制中，其体积也将越来越臃肿庞大，难以进行管理和维护。

对于一些不需要纳入Git管理的文件，也不希望它们总出现在未跟踪文件列表中，可以忽略这些文件（详见<a href="#menuIndex13">Git文件忽略</a>）。

#### 3、差异比较 {#git-diff}

基本命令为`git diff`，其作用是比较工作目录中已修改文件和暂存区域快照之间的差异（即修改之后还没有暂存起来的变化内容）：

    $ git diff
    diff --git a/page.html b/page.html
    index 3cb747f..da65585 100644
    --- a/page.html
    +++ b/page.html
    @@ -8,18 +8,20 @@
          #content a { text-decoration: none; }
          .entry { float:none; width:auto; }
          hr { margin-top: 30px; margin-bottom: 20px; }
     +    iframe { float: right; margin-top: -25px; }

          @media screen and (max-width: 750px) {
     -        #content { width:95%; }
     -        .entry { float:none; width:auto; padding: 10px; }
     +        #content { width: 95%; }
     +        .entry { padding: 30px 10px; }
              h2 { font-size: 20px; }
     +        hr { margin-top: -3px; }
     +        iframe { margin-top: -30px; }
          }

其中，`+`表示新增代码，`-`表示删除代码。

常用参数：

- `git diff`：比较工作目录和暂存区域之间的差异
- `git diff --cached`：比较暂存区域和上次提交之间的差异
- `git diff [--] <path>...`：比较工作目录和暂存区域之间指定文件或目录的差异
- `git diff --cached [--] <path>...`：比较暂存区域和上次提交之间指定文件或目录的差异
- `git diff HEAD`：比较工作目录和上次提交的差异
- `git diff <commit>`：比较工作目录和commit之间的差异
- `git diff <commit> [--] <path>...`：比较工作目录和commit之间指定文件或目录的差异
- `git diff --cached HEAD`：比较暂存区域和上次提交的差异
- `git diff --cached <commit>`：比较暂存区域和commit之间的差异
- `git diff --cached <commit> [--] <path>...`：比较暂存区域与commit之间指定文件或目录的差异
- `git diff <commit1> <commit2>`：比较commit1与commit2之间的差异
- `git diff --check`：列出所有的尾随空白符（_trailing whitespace_，建议不要在提交更新中提交多余的尾随空白符）

#### 4、提交更新 {#git-commit}

基本命令为`git commit`，使用该命令会把**暂存区域**内的文件快照提交至Git目录中。运行该命令会启动文本编辑器以便输入本次提交的说明，另外也可以使用`-m`参数后跟提交说明的方式使得在一行命令中提交更新：

    git commit -m "Fix Bug #182: Fix benchmarks for speed"

若要把所有已经跟踪过的文件暂存起来一并提交（即把已修改和已暂存的文件一并提交），只需加上`-a`参数：

    git commit -a -m "added new benchmarks"

常用参数：

- `git commit --author <author>`：以新作者提交
- `git commit -i <file>...`：将指定文件或目录和已暂存文件一并提交（该文件或目录可以是已暂存的）
- `git commit -o <file>...`：只提交指定文件或目录（该文件或目录可以是已暂存的）
- `git commit --amend`：修改最后一次提交
    - `git commit --amend -m <message>`： 重新编辑提交说明
    - `git commit --amend --author <author>`：重新编辑提交作者

若要修改提交的文件快照，详见<a href="#menuIndex9">撤销操作</a>。

### Git的基本工作扩展

#### 1、查看提交历史 {#git-log}

基本命令为`git log`，运行该命令将显示

    $ git log
    commit de20ac48f5863fd9a3f2140bda9e4e27e8e286f6
    Author: chengshiwen <chengshiwen0103@gmail.com>
    Date:   Fri Apr 18 13:05:02 2014 +0800

        Hide email in MenuBar

    commit e073a207495d092b48f9fbbea543f82474655327
    Author: chengshiwen <chengshiwen0103@gmail.com>
    Date:   Thu Apr 17 20:25:30 2014 +0800

        Add fadein and fadeout effects in homepage's MenuBar

常用参数：

- `git log -p`：展开显示每次提交的内容差异
- `git log -<n>`：查看最近n次提交
- `git log --stat`：查看每个提交文件的变动, 以及这些文件简要的增改行数统计
- `git log --oneline`：将每个提交放在一行显示
- `git log --graph`：显示ASCII图形表示的分支合并历史，配合`--oneline`更为简洁
- `git log --name-status`：显示新增、修改、删除的文件清单
- `git log [--] <filepattern>`：查看文件或目录的提交记录
- `git log --grep <pattern>`：搜索提交说明中匹配pattern的提交（如果要得到同时满足这两个搜索条件的提交，就必须用`--all-match`选项；否则，满足任一条件的提交都会被匹配）
- `git log --pretty=format:<string>`：使用特定格式显示历史提交信息
    - `%H`	：提交对象（commit）的完整哈希字串
    - `%h`	：提交对象的简短哈希字串
    - `%an`：作者（author）的名字
    - `%ae`：作者的电子邮件地址
    - `%ad`：作者修订日期（可以用 -date= 选项定制格式）
    - `%ar`：作者修订日期，按多久以前的方式显示
    - `%s`：提交说明
    - 例如：`git log --pretty=format:"%h %s" --graph`
- `git log --author=<author>`：仅显示指定作者相关的提交
- `git log [--after|--since]=<yyyy-mm-ss>`：仅显示指定时间之后的提交
- `git log [--before|--until]=<yyyy-mm-ss>`：仅显示指定时间之前的提交
    - 例如：`git log --since="2014-04-01" --before="2014-04-16"`
- `git log --diff-filter=A --summary`：列出版本库中曾添加过文件的提交
- `git log --diff-filter=A --summary | grep create`：列出所有添加过的历史文件
- `git log --diff-filter=D --summary`：列出版本库中曾删除过文件的提交
- `git log --diff-filter=D --summary | grep delete`：列出所有已删除的历史文件

#### 2、保存当前工作 {#git-stash}

将当前工作（即工作目录和暂存区的当前状态）保存到**贮存栈**，同时让工作目录回退至上次提交后的干净状态。

    $ git stash

常用参数：<br/>
**注**：以下`<stash>`参数形如`stash@{id}`，是对贮存栈中索引为`id`的工作的引用，`id`从栈顶到栈低依次为0，1，2，…；若不指定`<stash>`，则默认为栈顶工作的引用`stash@{0}`（即最近保存的一次工作的引用）

- `git stash [save <message>]`：附加信息并以入栈方式将当前工作保存到贮存栈中；若不加参数，则默认附加最近提交的说明信息
- `git stash pop [<stash>]`：恢复贮存栈中引用为`<stash>`的工作，并将其从贮存栈中删除
- `git stash apply [<stash>]`：恢复贮存栈中引用为`<stash>`的工作，但不从贮存栈中删除它
- `git stash drop [<stash>]`：删除贮存栈中引用为`<stash>`的工作
- `git stash list`：列出贮存栈中的所有工作
- `git stash show [<stash>]`：显示贮存栈中引用为`<stash>`的工作的修改记录
- `git stash clear`：清除贮存栈中所有保留的工作
- `git stash branch <branchname> [<stash>]`：基于指定工作创建新分支，完全恢复该工作被保存前的状态（新建一个最新提交为`<stash>`创建时所在的提交、名为`<branchname>`的分支，同时切换到该分支，恢复贮存栈中引用为`<stash>`的工作，并将其从贮存栈中删除）

#### 3、移除文件 {#git-rm}

- `rm`：从工作目录中删除文件，但文件名仍在已跟踪文件列表中
- `git rm`：从工作目录中删除文件，并将文件名从已跟踪文件列表中移除
- `git rm --cached`：仅仅将文件名从已跟踪文件列表中移除（其状态变为未跟踪），不对该文件进行其它操作
- `git rm -f`：删除之前若文件修改过且已放到暂存区，则须强制删除
- `git rm -r`：允许递归删除

上述命令均是在提交后生效。

#### 4、移动或重命名文件 {#git-mv}

要对文件进行移动或重命名，可以执行

    $ git mv <file_from> <file_to>

其等价于

    $ mv <file_from> <file_to>
    $ git rm <file_from>
    $ git add <file_to>

如果直接使用`mv`命令，会导致原文件名仍在已跟踪文件列表中。

#### 5、清除未跟踪文件 {#git-clean}

清除未跟踪文件使用`git clean`命令：

- `git clean -n`：显示将要清除的文件和目录
- `git clean -f`：强制清除文件（不包括目录）
- `git clean -df`：强制清除所有文件和目录

若要同时再移除被忽略的文件或目录，加上`-x`参数；若只移除被忽略的文件或目录，加上`-X`参数。

#### 6、标签 {#git-tag}

Git可以对版本中的某一个提交打上标签。例如，在发布某个软件版本（比如v1.0等）时，可以使用这个命令在这个版本标注上v1.0的标签。

##### 列出所有标签

    git tag
        $ git tag
        v1.0
        v1.1.0

    git tag -n[<num>]          # 同时列出每条标签说明的<num>行
        $ git tag -n1
        v1.0            add public download tag
        v1.1.0          InputHelper Release Version 1.1.0

    git tag -l <pattern>       # 列出所有匹配pattern的标签
        $ git tag -l 'v1.4.2.*'
        v1.4.2.1
        v1.4.2.2
        v1.4.2.3
        v1.4.2.4

##### 新建标签

Git使用的标签有两种类型：轻量级的（lightweight）和含附注的（annotated）。**轻量级标签**是一个指向特定提交对象的引用，其保存着对应提交对象的校验和信息。而**含附注标签**，实际上是存储在仓库中的一个独立对象，它有自身的校验和信息，包含着标签的名字，电子邮件地址和日期，以及标签说明。一般都建议使用含附注型的标签，以便保留相关信息；当然，如果只是临时性加注标签，或者不需要旁注额外信息，则建议用轻量级标签。

**含附注标签**

用`-a`（_annotated_）指定标签名字，`-m`参数指定了对应的标签说明，Git会将此说明一同保存在标签对象中。如果没有给出该选项，Git会启动文本编辑软件供你输入标签说明。

    $ git tag -a <tagname> [-m <msg>]

或不加`-a`但加上`-m`，则默认`-a`：

    $ git tag <tagname> -m <msg>

上述命令将对当前提交创建标签，若要对历史的某个提交加注标签，使用`<commit>`指定该提交的commit哈希值：

    $ git tag -a <tagname> <commit> [-m <msg>] 或
    $ git tag <tagname> <commit> -m <msg>

**注**：新建标签名必须是仓库中还不存在的，否则将不能添加标签；当然，可以加上`-f`参数强制替换已存在的标签。同时，建议新建标签名不要和已有分支名重名，防止对分支造成误操作。

可以使用`git show`命令查看相应标签的版本信息，并连同显示打标签时的提交对象：

    $ git show v1.1.0
    tag v1.1.0
    Tagger: Shiwen Cheng <chengshiwen0103@gmail.com>
    Date:   Tue Nov 19 17:26:33 2013 +0800

    InputHelper Release Version 1.1.0

    commit 0a4ffd855cef93d7cddbb5a5f135ea3b46d0fb71
    Author: Shiwen Cheng <chengshiwen0103@gmail.com>
    Date:   Tue Nov 19 17:22:15 2013 +0800

        updated README.md

**轻量级标签**

一个`-a`或`-m`选项都不用，直接给出标签名字即可，若不指定commit哈希值则默认最新提交：

    $ git tag <tagname> [<commit>]

##### 删除标签

删除本地标签：

    $ git tag -d <tagname>

删除远程标签：

    $ git push origin --delete tag <tagname> 或
    $ git push origin :refs/tags/<tagname>

当标签名和所有分支名均不同时，命令可以简化如下：

    $ git push origin --delete <tagname> 或
    $ git push origin :<tagname>

##### 推送标签

默认情况下，`git push`并不会把标签传送到远程服务器上，只有通过显式命令才能推送标签到远程仓库。其命令格式如同推送分支，运行`git push origin <tagname>`即可：

    $ git push origin v1.5
    Counting objects: 50, done.
    Compressing objects: 100% (38/38), done.
    Writing objects: 100% (44/44), 4.56 KiB, done.
    Total 44 (delta 18), reused 8 (delta 1)
    To git@github.com:schacon/simplegit.git
    * [new tag]         v1.5 -> v1.5

如果要一次推送所有本地新增的标签上去，可以使用`--tags`选项：

    $ git push origin --tags

##### 拉取标签

拉取远程服务器上所有新增的标签：

    $ git fetch origin --tags

### 撤销操作

#### git reset

#### git revert

#### git rebase

### 远程交互

#### git remote

#### git push

#### git fetch

#### git pull

### 分支操作

#### git branch

#### git checkout

#### git merge

### Git工具

#### git config

#### git show

#### git grep

#### git bisect

#### git help


## Git文件忽略


## GitHub配置和使用



[Git]:	http://git-scm.com "Git"
[Github]:   http://github.com "Github"
[Linus Torvalds]:	http://zh.wikipedia.org/wiki/Linus_Torvalds "Linus Torvalds"
[1]:	http://zh.wikipedia.org/wiki/SHA1
[2]:	http://git-scm.com/download/linux
[3]:	http://code.google.com/p/git-osx-installer
[4]:	http://msysgit.github.io
