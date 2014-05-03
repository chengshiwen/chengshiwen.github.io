---
layout: post
title: 深入浅出Git
description: Git是一款自由和开源的分布式版本控制系统，用于软件项目的管理和开发。本篇文章从Git基本概念和原理出发，深入浅出地介绍Git的基本命令和使用技巧，及博主在使用Git过程中的一些心得体会，借以温故知新。
category: blog
---

[Git][]是一款自由和开源的分布式版本控制系统（Version Control System），用于软件项目的管理和开发。本篇文章从Git基本概念和原理出发，深入浅出地介绍Git的基本命令和使用技巧，及博主在使用Git过程中的一些心得体会，借以温故知新。


## Git简介

Git是[Linus Torvalds][]为了帮助管理Linux内核开发而开发的一个开放源码的版本控制系统。

Torvalds开始着手开发Git是为了作为一种过渡方案来替代BitKeeper，后者之前一直是Linux内核开发人员在全球使用的主要源代码工具。开放源码社区中的有些人觉得BitKeeper的许可证并不适合开放源码社区的工作，因此Torvalds决定着手研究许可证更为灵活的版本控制系统。尽管最初Git的开发是为了辅助Linux内核开发的过程，但是现在越来越多的公司、开源项目使用Git，如 [Linux Kernel][]， [Ruby On Rails][]， [jQuery][]， [Node.js][]， [Bootstrap][]， [Django][]等。

Git和其它版本控制系统的主要差别在于，Git只关心文件数据的整体是否发生变化，每个版本存储改动过的所有文件，而大多数其它系统则只关心文件内容的变化差异，每个版本存储变化前后的差异数据。相比其它版本控制系统，Git具有如下优点：

- 完全分布式
- 设计简单，高效快速
- 出色的合并追踪能力
- 离线工作，随时随地自由提交
- 保持工作独立，更好地协作开发
- 不会丢失版本库，更少的仓库污染
- 超大规模项目的高效管理能力


## Git基础

#### 1、Git快照

直接记录快照，而非差异比较——这是Git同其它系统的重要区别。快照（Snapshot），即在某个时间点对项目中的所有文件作的一次记录保存，也就是该项目在这个时间点上的一个版本。
每次提交更新时，Git会将项目中的所有文件纵览一遍并作一快照，然后保存一个指向这次快照的指针。为提高性能，若文件没有改动，Git不会将其保存到这次快照中，而只对之前保存过的相同文件作一链接。如下图所示，Git相当于一个记录不同时间点上改动文件的快照的文件系统。

![](/assets/images/head-first-git/00.png)

#### 2、Git仓库

Git仓库用于记录保存项目的元数据和对象数据，包括所有的历史快照、提交信息、分支信息和标签信息等。

![](/assets/images/head-first-git/01.png)

如上图所示，绿色节点表示一个**提交（commit）对象**，该对象包含一个指向某次快照的指针，本次提交的作者信息，以及零个或多个指向该提交对象的父对象的指针。其中7位字符串是相应提交的SHA-1哈希值的前7位，用于索引该次提交。

**分支（branch）**用橘色节点显示，分别指向特定的提交，其实本质上仅仅是个指向提交对象的可变指针。Git会使用master作为分支的默认名字。在若干次提交后，master分支会指向最近一次提交对象，它在每次提交的时候都会自动向前移动。dev分支即是指向`a473c87`提交对象的一个分支指针。<br/>
不同分支维护的功能不同，如版本稳定、新功能开发、代码测试等。

**HEAD指针**是一个指向你当前所处的本地分支的指针（相当于当前分支的别名，指向当前分支最近的一次提交对象），在你切换分支时会指向新的分支，而当每次提交后HEAD指针也会随着分支一起向前移动。

#### 3、SHA-1哈希值

所有保存在Git仓库中的历史提交都是用类似于如下40位十六进制字符组成的字符串来作索引的，而不是靠文件名，它是由[SHA-1][1]算法计算文件的内容或目录的结构得出的一个SHA-1哈希值，简称**commit哈希值**或**commit字符串**，可以帮助我们迅速索引到某个历史版本的提交，从而进行相关操作。一般情况下，每个提交对象都能被前7位字符组成的字符串唯一索引到，如`24b9da6`能索引到如下commit哈希值对应的提交对象。

    24b9da6552252987aa493b52f8696cd6d3b00373

#### 4、^和~

除了commit哈希值能索引到提交对象，还可以通过`^`和`~`来引用具体的提交对象，而非记忆繁琐的commit哈希值。

- `^`表示父提交，`^`等同于`^1`，HEAD的父提交为`HEAD^ = HEAD^1`，HEAD的第n个父提交为`HEAD^^...^`
- `~`表示父提交，`~`等同于`~1`，HEAD的父提交为`HEAD~ = HEAD~1`，HEAD的第n个父提交为`HEAD~~...~ = HEAD~n`，等同于`HEAD^^...^`

上图中，HEAD的第3个父提交为`HEAD^^^`，即`b325c53`；`ed48905`的第4个父提交为`ed48905~4`，即`a473c87`。

**注**：当HEAD指向合并提交（其父提交有多个）时，可用`HEAD^n`表示多个父提交中的第n个，其中`HEAD^1`是合并时所在分支提交，其它则是所合并的分支提交。

#### 5、文件的状态

在Git管理项目时，文件流转三个区域：Git目录（Git仓库），工作目录，以及暂存区域。

![](/assets/images/head-first-git/02.png)

每个项目都有一个唯一的**Git目录**（git directory），亦即Git仓库，一般对应项目根目录下的`.git`目录。该目录非常重要，每次克隆镜像仓库的时候，实际拷贝的就是这个目录里面的数据。

**工作目录**（working directory）是项目某个版本的签出（_The working directory is a single checkout of one version of the project_）
，也就是本地项目目录，其包含该版本的所有文件（不包括Git目录）。这些文件都是从Git目录中取出的，我们可以在工作目录中修改它们(modify)、删除它们(remove)或添加新文件(add)——这些称之为**改动（Changes）**。

**暂存区域**（staging area）是工作目录和Git目录之间的临时中转区，存储着工作目录中部分改动文件的快照，该快照将在下次提交时被永久地保存到Git目录中。暂存区域也叫索引（index），实际是Git目录下的index文件（`.git/index`），其存放了与当前暂存内容相关的信息，包括暂存的文件名、文件内容的SHA-1哈希值和文件访问权限，使用`git ls-files --stage`命令可查看其内容。

工作目录下的所有文件分为两种状态：已跟踪（Tracked）或未跟踪（Untracked）。**已跟踪**的文件是指已被纳入版本控制管理的文件，在上次快照中有它们的记录，而所有其它文件都属于**未跟踪**文件（如新放入到工作目录下的文件）。

已跟踪的文件又分为三种状态：已提交（Committed），已修改（Changes not staged for commit，未暂存改动）和已暂存（Changes to be committed，待提交改动或已暂存改动）。**已提交**表示该文件已经被安全地保存在Git目录中；**已修改**表示该文件自上次签出后作了修改，但还没有被放到暂存区域；**已暂存**表示该文件作了修改并已放入暂存区域，准备下次提交到Git目录中。<br/>
注意 ，某个文件可能同时处于已修改和已暂存状态，这是因为该文件作了修改及暂存后，又继续作了新的修改，但暂存区域只保存了该文件新修改之前的快照。因此，工作目录中的改动（Changes in working directory）即为已暂存改动与待提交改动的并集。

要查看工作目录下的文件状态，可以用`git status`命令（详见[查看当前文件状态](#git-status)）。


## Git安装和配置

### Git安装

#### 1、Linux

在Ubuntu这类Debian体系的系统上，用apt-get安装：

    $ apt-get install git

在Fedora上用yum安装：

    $ yum install git-core

其它Linux和Unix系统请参考[这里][2]。

#### 2、Mac

下载[Git for OS X][3]安装包

    http://code.google.com/p/git-osx-installer

#### 3、Windows

下载[msysGit][4]安装包

    http://msysgit.github.io

### Git配置

Git提供`git config`命令来配置或读取相应的工作环境变量，这些变量可以存放在以下三个不同的地方（下文不做特殊说明均以Linux为例）：

- `/etc/gitconfig`文件：系统配置文件，使用`git config --system`进行读写。
- `~/.gitconfig`文件：用户目录下的配置文件，使用`git config --global`进行读写。
- `{项目目录}/.git/config`文件：当前项目的配置文件，使用`git config --local`或`git config`进行读写。

每一个级别的配置都会覆盖上层的相同配置。

#### 1、用户信息

首次使用Git需要配置你个人的**用户名**和**电子邮箱**，每次Git提交时都会引用这两条信息，说明是谁提交了改动：

    $ git config --global user.name "cheng-shiwen"
    $ git config --global user.email chengshiwen0103@gmail.com

#### 2、文本编辑器

Git编辑文件、查看差异、需要输入额外消息时，会自动调用外部文本编辑器，一般默认是Vi或者Vim。如果你偏好Emacs，可以重新设置：

    $ git config --global core.editor emacs

#### 3、配置颜色

Git能够为输出到你终端的内容着色，以便你可以凭直观进行快速、简单地分析：

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

#### 5、生成SSH公钥

大多数Git服务器都会选择使用SSH公钥来进行授权，系统中的每个用户都必须提供一个公钥用于授权，之后才能向Git服务器上的远程仓库提交改动数据。

首先确认下是否已经有一个公钥了：SSH公钥默认储存在用户主目录下的`~/.ssh`目录中

    $ cd ~/.ssh
    $ ls
    id_rsa  id_rsa.pub  known_hosts

其中`id_rsa`和`id_rsa.pub`是一对私钥、公钥文件。如果没有这对文件，可以使用`ssh-keygen`来创建

    $ ssh-keygen
    Generating public/private rsa key pair.
    Enter file in which to save the key (/home/cheng-shiwen/.ssh/id_rsa):
    Enter passphrase (empty for no passphrase):
    Enter same passphrase again:
    Your identification has been saved in /home/cheng-shiwen/.ssh/id_rsa.
    Your public key has been saved in /home/cheng-shiwen/.ssh/id_rsa.pub.
    The key fingerprint is:
    a8:34:f4:76:9e:7c:00:66:9f:fe:8b:8c:e6:9b:fb:29 cheng-shiwen@root
    The key's randomart image is:
    +--[ RSA 2048]----+
    |                 |
    |                 |
    |    . +          |
    |   . + + .       |
    |    o + S        |
    |   . + = o       |
    |    .   = .      |
    |      E+ =       |
    |     o*== o.     |
    +-----------------+

它先要求你确认保存公钥的位置（`.ssh/id_rsa`，默认回车即可）；然后它会让你重复一个密码两次，如果不想在使用公钥的时候输入密码，直接回车即可。

最后，提供你的公钥给相应Git服务器的管理员，即将`id_rsa.pub`文件的内容提供给管理员。

在GitHub上添加SSH公钥可参考：[https://help.github.com/articles/generating-ssh-keys](https://help.github.com/articles/generating-ssh-keys)。


## Git基本命令

### 获得Git仓库

有两种获得Git项目仓库的方法：第一种是在现存的目录下，通过初始化来创建新的Git仓库；第二种是从已有的Git仓库克隆出一个新的镜像仓库来。

#### 1、在工作目录中初始化新仓库 {#git-init}

要对现有的某个项目开始用Git管理，只需到此项目所在的目录下运行：

    $ git init

初始化后，在当前目录下会出现一个名为`.git`的Git目录，所有Git需要的数据都存放在这个目录中。

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

1. 改动文件：在工作目录中修改、删除或添加某些文件
2. 暂存文件：对改动后的文件进行快照，保存至暂存区域
3. 提交快照：将保存在暂存区域的文件快照永久转储到Git目录中

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
`Changes to be committed`表示已暂存， `Changes not staged for commit`表示已修改， `Untracked files`表示未跟踪。

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

`git add`可以将已修改的文件更新至暂存区域，变成已暂存状态。例如，暂存已修改的`.gitignore`文件：

    $ git add .gitignore

常用参数

- `git add`：暂存新文件和已修改文件，不包括被删除文件
- `git add -u`：暂存已修改文件和被删除文件，不包括新文件
- `git add -A`：暂存新文件、已修改文件和被删除文件

此外，建议不用使用`git add .`，除非已经非常明确所有的新文件和已修改文件都需要暂存，否则这将导致越来越多的不必要文件（如临时文件、build文件、误入文件等）被加入到版本控制中，其体积也将越来越臃肿庞大，难以进行管理和维护。

对于一些不需要纳入Git管理的文件，也不希望它们总出现在未跟踪文件列表中，可以忽略这些文件（详见[Git文件忽略](#menuIndex13)）。

#### 3、差异比较 {#git-diff}

基本命令为`git diff`，其作用是比较工作目录文件和暂存区域快照之间的差异（即修改之后还没有暂存起来的变化内容）：

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

- `git diff`：比较工作目录文件和暂存区域快照之间的差异
- `git diff --cached`：比较暂存区域快照和上次提交之间的差异
- `git diff [--] <path>...`：比较工作目录文件和暂存区域快照之间指定文件或目录的差异
- `git diff --cached [--] <path>...`：比较暂存区域快照和上次提交之间指定文件或目录的差异
- `git diff HEAD`：比较工作目录文件和上次提交的差异
- `git diff <commit>`：比较工作目录文件和commit之间的差异
- `git diff <commit> [--] <path>...`：比较工作目录文件和commit之间指定文件或目录的差异
- `git diff --cached HEAD`：比较暂存区域快照和上次提交的差异
- `git diff --cached <commit>`：比较暂存区域快照和commit之间的差异
- `git diff --cached <commit> [--] <path>...`：比较暂存区域快照与commit之间指定文件或目录的差异
- `git diff <commit1> <commit2>`：比较commit1与commit2之间的差异
- `git diff --check`：列出所有的尾随空白符（trailing whitespace，建议不要在提交更新中提交多余的尾随空白符）

#### 4、提交快照 {#git-commit}

基本命令为`git commit`，使用该命令会把**暂存区域**内的文件快照提交至Git目录中。运行该命令会启动文本编辑器以便输入本次提交的说明，另外也可以使用`-m`参数后跟提交说明的方式使得在一行命令中完成提交：

    $ git commit -m "Fix Bug #182: Fix benchmarks for speed"

若要把所有已经跟踪过的文件暂存起来一并提交（即把已修改和已暂存的文件一并提交），只需加上`-a`参数：

    $ git commit -a -m "added new benchmarks"

常用参数：

- `git commit --author <author>`：以新作者提交
- `git commit -i <file>...`：将指定文件和已暂存文件一并提交（该文件可以是已暂存的）
- `git commit -o <file>...`：只提交指定文件（该文件可以是已暂存的）
- `git commit --amend`：修改最后一次提交
    - `git commit --amend -m <message>`： 重新编辑提交说明
    - `git commit --amend --author <author>`：重新编辑提交作者

若要修改提交的文件快照，详见[撤销操作](#menuIndex11)。

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
- `git log --grep <pattern>`：搜索提交说明中匹配pattern的提交（若要得到同时满足两个搜索条件的提交，则须用`--all-match`选项；否则，满足任一条件的提交都会被匹配）
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

将当前工作（即工作目录和暂存区的当前状态）保存到**暂存栈**（和暂存区域完全无关），同时让工作目录回退至上次提交后的干净状态。

    $ git stash

常用参数：<br/>
**注**：以下`<stash>`参数形如`stash@{id}`，是对暂存栈中索引为`id`的工作的引用，`id`从栈顶到栈低依次为0，1，2，…；若不指定`<stash>`，则默认为栈顶工作的引用`stash@{0}`（即最近保存的一次工作的引用）

- `git stash [save <message>]`：附加信息并以入栈方式将当前工作保存到暂存栈中；若不加参数，则默认附加最近提交的说明信息
- `git stash pop [<stash>]`：恢复暂存栈中引用为`<stash>`的工作，并将其从暂存栈中删除
- `git stash apply [<stash>]`：恢复暂存栈中引用为`<stash>`的工作，但不从暂存栈删除它
- `git stash drop [<stash>]`：删除暂存栈中引用为`<stash>`的工作
- `git stash list`：列出暂存栈中的所有工作
- `git stash show [<stash>]`：显示暂存栈中引用为`<stash>`的工作的改动记录
- `git stash clear`：清除暂存栈中所有保留的工作
- `git stash branch <branchname> [<stash>]`：基于指定工作创建新分支，完全恢复该工作被保存前的状态（新建一个最新提交为`<stash>`创建时所在的提交、名为`<branchname>`的分支，同时切换到该分支，恢复暂存栈中引用为`<stash>`的工作，并将其从暂存栈中删除）

#### 3、移除文件 {#git-rm}

- `rm <file>...`：从工作目录中删除指定文件，但不从暂存区域移除
- `git rm <file>...`：从工作目录中删除指定文件，同时将其从暂存区域移除
- `git rm --cached <file>...`：仅仅将文件从暂存区域中移除（其状态变为未跟踪），不对该文件进行其它操作
- `git rm -f <file>...`：强制删除
- `git rm -r <file>...`：递归删除（用于删除目录）

`rm`删除文件后，该删除操作会出现在`Changes not staged for commit`中，但该文件仍在暂存区域，可执行`git ls-files --deleted`查看`rm`删除的文件；<br/>
`git rm`删除文件后，该删除操作会出现在`Changes to be committed`中，且该文件已从暂存区域中移除，可执行`git ls-files --cached`查看暂存区域文件的变化。<br/>
因此，`git rm` + `git commit -m <message>`相当于`rm` + `git commit -a -m <message>`。

**注**：上述命令均是在提交后生效。

#### 4、移动或重命名文件 {#git-mv}

要对文件进行移动或重命名，可以运行

    $ git mv <file_from> <file_to>

其等价于

    $ mv <file_from> <file_to>
    $ git rm <file_from>
    $ git add <file_to>

如果直接使用`mv`命令，会导致原文件仍在暂存区域中。

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

用`-a`（annotated）指定标签名字，`-m`参数指定了对应的标签说明，Git会将此说明一同保存在标签对象中。如果没有给出该选项，Git会启动文本编辑软件供你输入标签说明。

    $ git tag -a <tagname> [-m <msg>]

或者不加`-a`但加上`-m`，则默认加上`-a`：

    $ git tag <tagname> -m <msg>

上述命令将对当前提交创建标签，若要对历史的某个提交加注标签，使用`<commit>`指定该提交的SHA-1哈希值：

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

一个`-a`或`-m`选项都不用，直接给出标签名字即可，若不指定commit则默认最新提交：

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

### 分支操作

#### 1、分支管理 {#git-branch}

基本命令为`git branch`，其作用是列出本地所有分支：

    $ git branch
      iss53
    * master
      testing

其中`*`表示当前所在分支。若要查看各个分支最后一个提交对象的信息，运行`git branch -v`：

    $ git branch -v
      iss53   93b412c fix javascript issue
    * master  7a98805 Merge branch 'iss53'
      testing 782fd34 add scott to the author list in the readmes

常用参数：

- `git branch -a`：列出本地和远程的所有分支
- `git branch -r`：列出远程所有分支
- `git branch (-d|-D) <branch>`：删除或强制删除branch分支
- `git branch (-m|-M) [<oldbranch>] <newbranch>`：将oldbranch分支名重命名为newbranch，不指定oldbranch则默认为当前分支
- `git branch [-f] <branch> [<start-point>]`：基于当前分支新建（或强制新建）一个branch分支，该branch分支头指向start-point（可以为已有的分支、提交或标签，若不指定则默认为当前分支），命令执行后仍处于当前分支
- `git branch (--merged|--no-merged)`：从本地分支中筛选出已经（或尚未）与当前分支合并的分支

#### 2、分支签出 {#git-checkout}

基本命令为`git checkout`，其作用是签出分支到工作目录（即切换到指定分支），例如切换到testing分支：

    $ git checkout testing

上述testing分支必须为已存在的分支，若要新建分支并切换到该分支，可以使用如下命令：

    $ git checkout -b <branch>

此外，`git checkout`还可以签出指定版本的文件用以覆盖工作目录中对应的文件，即放弃工作目录中指定文件的改动（详见[取消已修改或已暂存文件](#discard-changes)）。

常用参数：

- `git checkout <branch>`：切换到指定分支
- `git checkout (-b|-B) <branch> [<start point>]`：基于当前分支新建一个branch分支（或重置已存在分支），该branch分支头指向start-point（可以为已有的分支、提交或标签，若不指定则默认为当前分支），并切换到branch分支
- `git checkout -f <branch>`：强制切换分支，并丢弃当前改动
- `git checkout [--detach] [<commit>|<tagname>]`：切换到指定的提交或标签，但此时处于**detached HEAD**状态（游离状态，亦即匿名分支状态）

#### 3、分支合并 {#git-merge}

基本命令为`git merge`，其作用是将指定分支（或指定提交）自共同祖先分叉以来的改动合并到当前分支，命令格式为：

    $ git merge <commit>

**快进合并**（Fast-forward）

当指定分支（提交）是当前分支的子孙（即后继提交），那么合并只会移动当前分支指针到指定分支（提交），不会创建新的合并提交记录。例如当前处于master分支，

              A---B---C topic
             /
        D---E master

运行

    $ git merge topic

得到

        D---E---A---B---C topic, master

快进合并是默认方式，若想每次合并都创建一个新的提交记录，使用`–-no-ff`参数，例如上述例子运行

    $ git merge –-no-ff topic

得到

              A---B---C topic
             /         \
        D---E-----------F master

**三方合并**

若指定分支（提交）与当前分支互不为祖先，Git会先找到它们最近的共同祖先（即开始分叉的提交），然后再与两个分支上的最新提交进行一次简单的三方合并计算，最后，Git对三方合并的结果作一新的快照，并自动创建一个指向它的提交对象。

              A---B---C topic
             /
        D---E---F---G master

运行

    $ git merge topic

得到

              A---B---C topic
             /         \
        D---E---F---G---H master

**合并冲突及解决**

如果在不同的分支中都修改了同一个文件的同一部分，Git就无法判断应用哪个分支的修改，从而出现合并冲突，这种冲突只能由人来解决。该冲突将显示类似下面的结果

    $ git merge topic
    Auto-merging index.html
    CONFLICT (content): Merge conflict in index.html
    Automatic merge failed; fix conflicts and then commit the result.

Git作了合并，但没有提交，它会停下来等你解决冲突。此时可以用`git status`查看哪些文件在合并时发生冲突：

    $ git status
    On branch master
    You have unmerged paths.
      (fix conflicts and run "git commit")

    Unmerged paths:
      (use "git add <file>..." to mark resolution)

            both modified:      index.html

    no changes added to commit (use "git add" and/or "git commit -a")

任何包含未解决冲突的文件都会以**未合并**（Unmerged）的状态列出。Git会在有冲突的文件里加入标准的冲突解决标记，可以通过它们来手工定位并解决这些冲突，这些冲突文件包含类似下面的部分：

    <<<<<<< HEAD
    <div id="footer">Copyright by cheng-shiwen</div>
    =======
    <div id="footer">
        Contact me: chengshiwen0103@gmail.com
    </div>
    >>>>>>> topic

其中`=======`隔开的上半部分，是`HEAD`（即在运行merge命令时所处的当前分支，这里为master分支）中的内容，下半部分是在`topic`分支中的内容，解决冲突的办法是二者选其一或将二者整合到一起。例如可以通过把这段内容替换为下面的内容来解决冲突：

    <div id="footer">
        Contact me: chengshiwen0103@gmail.com
        Copyright by cheng-shiwen
    </div>

在解决了所有文件里的所有冲突后，运行`git add`将它们的快照保存到暂存区域，再使用`git commit`来完成这次合并提交。

常用参数：

- `git merge -m <msg> <commit>`：如果产生新的合并提交，则附加msg说明
- `git merge --no-commit <commit>`：合并成功后不会自动产生新的提交，用户可以在下次提交前对这次的合并结果进行修改和调整
- `git merge --abort`：遇到合并冲突时，此命令将终止合并，并恢复未合并之前的状态

#### 4、分支挑捡 {#git-cherry-pick}

如果不需要合并某个分支的全部提交,而只需要该分支的某个或某些提交,使用`git cherry-pick`命令，它会将指定的commit重新应用到当前分支，命令格式为：

    $ git cherry-pick <commit>...

例如当前处于master分支

              A---B---C topic
             /
        D---E---F---G master

运行

    $ git cherry-pick B

得到

              A---B---C topic
             /
        D---E---F---G---B' master

其中B和B'作了相同的改动，但是不同的提交。

### 远程交互

要参与任何一个Git项目的协作，必须要了解该如何管理远程仓库。远程仓库是指托管在服务器上的项目仓库，同他人协作开发某个项目时，需要管理这些远程仓库，以便推送或拉取数据，共享各自的工作进展。管理远程仓库的工作，包括添加远程仓库，移除废弃的远程仓库，管理各式远程仓库分支等。

#### 1、管理远程仓库 {#git-remote}

**查看远程仓库**

基本命令为`git remote`，其作用是查看当前配置有哪些远程仓库，它会列出每个远程仓库的短名字。在克隆完某个项目后，至少可以看到一个名为`origin`的远程仓库，Git默认使用这个名字来标识你所克隆的原始仓库：

    $ git remote
    origin

加上`-v`选项，显示对应的克隆地址：

    $ git remote -v
    origin  git@github.com:cheng-shiwen/InputHelper.git (fetch)
    origin  git@github.com:cheng-shiwen/InputHelper.git (push)

**添加远程仓库**

要添加一个新的远程仓库，可以指定一个简短的名字，以便将来引用，命令格式为：

    $ git remote add <shortname> <url>

例如：

    $ git remote add upstream https://github.com/xgenvn/InputHelper.git
    $ git remote -v
    origin  git@github.com:cheng-shiwen/InputHelper.git (fetch)
    origin  git@github.com:cheng-shiwen/InputHelper.git (push)
    upstream    https://github.com/xgenvn/InputHelper.git (fetch)
    upstream    https://github.com/xgenvn/InputHelper.git (push)

现在要拉取所有xgenvn有的，但本地仓库没有的信息，可以运行`git fetch upstream`：

    $ git fetch upstream
    remote: Counting objects: 12, done.
    remote: Compressing objects: 100% (10/10), done.
    remote: Total 12 (delta 3), reused 9 (delta 2)
    Unpacking objects: 100% (12/12), done.
    From https://github.com/xgenvn/InputHelper
     * [new branch]      master     -> upstream/master
    From https://github.com/xgenvn/InputHelper
     * [new tag]         v1.0.1     -> v1.0.1

常用参数：

- `git remote rename <old> <new>`：重命名远程仓库
- `git remote rm <name>`：删除名为name的远程仓库
- `git remote [-v] show <name>`：查看远程仓库信息
- `git remote prune <name>`：删除不存在对应远程分支的本地分支

#### 2、推送提交到远程仓库 {#git-push}

基本命令为`git push`，其作用是将本地仓库中的提交推送到远程仓库，命令格式为：

    $ git push <remote> <branch>

其将本地branch分支推送到remote远程仓库的相同分支。只有在remote服务器上有写权限，或者同一时刻没有其他人在推送提交，这条命令才会如期完成任务。如果在你推提交前，已经有其他人推送了若干提交，那你的推送操作就会被驳回。你必须先把他们的最新提交拉取到本地，合并到自己的项目中，然后才能再次推送。

常用参数：

- `git push`：缺省推送，默认远程仓库为origin，默认推送分支信息显示在`git remote show origin`结果中的`Local ref configured for 'git push'`下
- `git push <remote> <lbranch>:[<rbranch>]`：将本地lbranch分支推送到remote远程仓库的rbranch分支。若rbranch缺省则默认为lbranch，等同于`git push <remote> <lbranch>`
- `git push <remote> :<branch>`：将空推送到remote远程仓库的branch分支，即删除remote远程仓库的branch分支
- `git push <remote> --delete <branch>`：删除remote远程仓库的branch分支
- `git push <remote> -f <lbranch>:[<rbranch>]`：将本地lbranch分支强制推送到remote远程仓库的rbranch分支

#### 3、从远程仓库拉取最新改动 {#git-fetch}

基本命令为`git fetch`，其作用是到远程仓库中拉取所有本地仓库中还没有的最新改动，但不会自动将这些改动合并到当前工作分支，例如：

    $ git fetch origin

常用参数：

- `git fetch [<remote>]`：到remote远程仓库拉取所有本地仓库中还没有的最新改动，不指定remote则默认为origin
- `git fetch <remote> <branch>`：将remote远程仓库的branch分支拉取到本地，同时用`FETCH_HEAD`指针指向它
- `git fetch --all`：拉取所有远程仓库
- `git fetch -p`：删除不存在对应远程分支的本地分支

**强制更新**

强制推送分支到远程仓库使用`git push <remote> -f <lbranch>:[<rbranch>]`，但将远程仓库的rbranch分支强制更新到本地lbranch分支，有两种方法：<br/>
第一种：首先处于lbranch分支上，运行

    $ git fetch <remote> <rbranch>
    $ git reset --hard FETCH_HEAD

第二种：首先处于非lbranch分支的其它分支上，运行

    $ git fetch <remote> -f <rbranch>:<lbranch>

如果处于lbranch分支运行上述命令，只有当本地仓库是裸仓库时才能成功，否则会出现Refusing to fetch into current branch refs/heads/<lbranch> of non-bare repository的拒绝信息，这是因为lbranch分支本身就正处于工作状态，Git机制不允许通过fetch方式再去更新它。

#### 4、从远程仓库拉取最新改动并合并 {#git-pull}

基本命令为`git pull`，其作用是从远程仓库自动拉取最新改动到本地（Fetch），然后将远程分支自动合并到本地仓库中的当前分支(Merge)，命令格式为：

    $ git pull <remote> <branch>

其将remote远程仓库的branch分支拉取到本地，然后将其合并到本地当前分支。例如当前处于master分支，

              A---B---C master on origin
             /
        D---E---F---G master

运行

    $ git pull origin master

得到

              A---B---C remotes/origin/master
             /         \
        D---E---F---G---H master

常用参数：

- `git pull [<remote>]`：到remote远程仓库拉取所有本地仓库中还没有的最新改动并进行默认合并操作，remote默认为origin，默认合并分支信息显示在`git remote show origin`结果中的`Local branch configured for 'git pull'`下
- `git pull <remote> <rbranch>:<lbranch>`：将remote远程仓库的rbranch分支拉取到本地，然后将其合并到本地lbranch分支

### 撤销操作

#### 1、重置 {#git-reset}

基本命令为`git reset`，其作用是将当前分支指针（HEAD指针）重置为指定状态，常用命令：

- `git reset [<commit>] [--] <paths>...`
    - 将暂存区域中指定路径的文件重置为指定commit（不指定则默认为HEAD）时的状态，但不会改变工作目录及当前分支，其相当于`git add <paths>`的反向操作。该命令执行后，自从commit以来指定文件的所有改动都显示在`Changes not staged for commit`中，而这些改动的反向改动会显示在`Changes to be committed`中。
- `git reset (--soft|--mixed|--hard) [<commit>]`
    - 将当前分支指针（HEAD指针）重置为指定commit（不指定则默认为HEAD），并根据第一个参数决定如何更新暂存区域（将其重置为指定commit时的状态）和工作目录
    - `--soft`：暂存区域和工作目录中的内容不作任何改变，仅仅把HEAD指向commit。该命令执行后，自从commit以来的所有改动文件都处于已暂存状态，显示在`Changes to be committed`中。
    - `--mixed`：仅重置暂存区域，但不对工作目录作任何改变（默认此参数）。该命令执行后，原已暂存文件将变成相应的已修改状态或未跟踪状态，并提示重置后未暂存的改动（Unstaged changes after reset）。
    - `--hard`：重置暂存区域和工作目录。该命令执行后，自从commit以来在工作目录中已跟踪文件的任何改动都被丢弃。常用于将当前分支完全重置为过去的某个提交状态，或完全丢弃工作目录中的所有文件改动。

#### 2、撤销 {#git-revert}

基本命令为`git revert`，其作用是撤销过去的某次提交（大多是错误或不完全的提交），并用一个新的commit来记录这个撤销操作（即那次提交的反向改动）。这个命令要求工作目录必须是干净的。

常用参数：

- `git revert <commit>`：撤销指定的commit，并启动默认编辑器编辑提交说明，完成后自动提交
- `git revert --no-edit <commit>`：撤销指定的commit，但不启动默认编辑器，以默认提交说明自动提交
- `git revert -n <commit>`：即`--no-commit`，撤销指定的commit，但不自动生成新的commit，撤销操作会被保留到暂存区域
- `git revert -n <commit1>..<commit2>`：撤销commit1（包含）至commit2（不包含）的所有提交，其它同上

`git revert`和`git reset`区别：

- `git revert`：撤销过去的某次提交后，不会对过去的提交历史进行修改，只将这个撤销操作保存为一个新的commit，故HEAD指针向前移动。
- `git reset`：重置为过去的某次提交后，当该提交不是HEAD时会对过去的提交历史进行修改（会把该提交之后的所有提交历史删除），而当该提交是HEAD时会对暂存区域或工作目录进行重置，并且都不会自动生成新的commit，HEAD指针不移动或向后移动。

#### 3、衍合 {#git-rebase}

基本命令为`git rebase`，其作用是对历史提交执行衍合操作，重新设定提交历史，可以实现将指定范围的提交“嫁接”到另外一个提交之上。常用命令：

- `git rebase <upstream> [<branch>]`
    - 将branch分支作的且不在upstream分支中的提交嫁接到upstream分支上。若不指定branch，则默认当前分支
    - 例如：

                      A---B---C topic
                     /
                D---E---F---G master
            运行
                $ git rebase master         或
                $ git rebase master topic
            得到
                              A'--B'--C' topic
                             /
                D---E---F---G master

    - 如果upstream分支已经包含branch分支所作的改动，则branch分支中的这次改动会被跳过（其中A和A'作了相同的改动，但是不同的提交）：

                      A---B---C topic
                     /
                D---E---A'---F master
            会得到
                               B'---C' topic
                              /
                D---E---A'---F master

- `git rebase --onto <newbase> <upstream> [<branch>]`
    - 将branch分支作的且不在upstream分支中的提交嫁接到newbase分支上
    - 例如：

                o---o---o---o---o  master
                     \
                      o---o---o---o---o  next
                                       \
                                        o---o---o  topic
            运行
                $ git rebase --onto master next topic
            得到
                o---o---o---o---o  master
                    |            \
                    |             o'--o'--o'  topic
                     \
                      o---o---o---o---o  next

    - 此外，还可以删除连续的一段提交：

                E---F---G---H---I---J  topic
            运行
                $ git rebase --onto topic~5 topic~3 topic
            得到
                E---H'---I'---J'  topic

- `git rebase -i <commit>`：以交互方式修改历史提交（详见[修改历史提交](#modify-history-commit)）
- `git rebase --continue|--skip|--abort`：当衍合操作遇到冲突暂停时可采用的命令——继续、跳过或终止，若选择继续，则须在运行此命令之前完成冲突解决（添加到暂存区，不提交）

#### 4、取消已修改或已暂存文件 {#discard-changes}

若误修改文件，可使用`git checkout -- <file>`命令放弃修改，其一般格式为：

    $ git checkout [<commit>] [--] <file>...

若省略commit，则会用暂存区域的指定文件覆盖工作目前中的对应文件；若指定commit，则用指定提交中的指定文件覆盖暂存区域和工作目录中的对应文件，两者都不会改变HEAD指针。其中`--`用于分隔指定文件，防止该文件与分支重名造成分支误操作。例如：

    $ git checkout -- grep.py   # 放弃grep.py文件未暂存的改动
    $ git checkout .            # 放弃所有未暂存的改动
    $ git checkout HEAD *.txt   # 放弃本次所有txt文件作的改动（包括工作目录和暂存区域）
    $ git checkout HEAD .       # 放弃所有已暂存改动和未暂存改动，即完全重置到最近的提交状态

若不小心误跟踪文件，可使用`git reset HEAD <file>`或`git rm --cached <file>`命令取消跟踪，前者是将文件重置为最近提交时的状态（即未跟踪状态），后者是从暂存区域移除文件。

#### 5、修改最后一次提交 {#modify-last-commit}

使用`git commit --amend`命令可以修改最后一次提交，如果刚才提交时忘了暂存某些修改，可以先补上暂存操作，再运行此命令：

    $ git commit -m 'initial commit'
    $ git add forgotten_file
    $ git commit --amend

上面的三条命令最终只是产生一个提交，第二个提交命令修正了第一个的提交快照。

此外，还可以使用`git reset HEAD^`命令将最后一次提交的所有改动全部放到`Changes not staged for commit`或`Untracked files`中，此时HEAD指针已经指向最近的第二次提交，最近一次提交已从历史中移除。

#### 6、修改历史提交 {#modify-history-commit}

修改历史提交则不能再使用上述方法，可以使用`git revert`命令撤销历史提交，这样能不对历史提交造成修改的同时，也能添加修正的撤销提交，更利于以后查看提交记录，积累修正经验等。

此外，还可以使用`git rebase`命令，其支持对历史提交的修改、删除、重排、压缩和拆分。

**修改**

    $ git rebase -i <commit>

其中commit是你想修改的提交的某个祖先，一般指定为父提交，该命令可以修改commit（不包含）之后的所有提交。例如，若想修改最近第三次提交，运行

    $ git rebase -i HEAD~3

运行上述命令会在文本编辑器显示一个类似如下的提交列表，提交的顺序与`git log`命令看到的是相反的，最早的提交被放置在列顶。

    pick f7f3f6d changed my name a bit
    pick 310154e updated README formatting and added blame
    pick a5f4a0d added cat-file

    # Rebase 710f0f8..a5f4a0d onto 710f0f8
    #
    # Commands:
    #  p, pick = use commit
    #  e, edit = use commit, but stop for amending
    #  s, squash = use commit, but meld into previous commit
    #
    # If you remove a line here THAT COMMIT WILL BE LOST.
    # However, if you remove everything, the rebase will be aborted.
    #

将想修改的某些提交前面的`pick`改为`edit`：

    edit f7f3f6d changed my name a bit
    pick 310154e updated README formatting and added blame
    pick a5f4a0d added cat-file

保存并退出编辑器，Git会倒回至列表中的第一个被修改为`edit`的提交（这里即为最近的第三次提交`f7f3f6d`），显示以下信息

    $ git rebase -i HEAD~3
    Stopped at f7f3f6d... changed my name a bit
    You can amend the commit now, with

           git commit --amend

    Once you’re satisfied with your changes, run

           git rebase --continue

修改并暂存后运行

    $ git commit --amend

然后，运行

    $ git rebase --continue

这个命令会自动应用其它两次提交，此时对历史提交的修改已经完成。

**删除和重排**

若想删除"added cat-file"这个提交并且修改其它两次提交的先后顺序，将

    pick f7f3f6d changed my name a bit
    pick 310154e updated README formatting and added blame
    pick a5f4a0d added cat-file

改为：

    pick 310154e updated README formatting and added blame
    pick f7f3f6d changed my name a bit

保存并退出编辑器，Git将分支倒回至原提交`f7f3f6d`的父提交，然后应用`310154e`以及`f7f3f6d`，接着停止。此时，Git已经修改了这些提交的顺序并且彻底删除了added cat-file这次提交。

**压缩**

将想压缩的某些提交前面的`pick`改为`squash`，Git会将这样的提交和它之前的提交合并为单一提交，并将提交说明归并。例如将这三个提交合并为单一提交：

    pick f7f3f6d changed my name a bit
    squash 310154e updated README formatting and added blame
    squash a5f4a0d added cat-file

保存并退出编辑器，Git会应用全部三次改动然后再启动编辑器来归并三次提交说明：

    # This is a combination of 3 commits.
    # The first commit's message is:
    changed my name a bit

    # This is the 2nd commit message:

    updated README formatting and added blame

    # This is the 3rd commit message:

    added cat-file

保存退出之后，前三次提交的全部改动已变成单一提交。

**拆分**

拆分提交就是重置一次提交，将提取到的被重置的所有改动多次部分地暂存或提交直到结束。例如，想将最近第二次提交updated README formatting and added blame拆分成两次提交：第一次为updated README formatting，第二次为added blame：

    pick f7f3f6d changed my name a bit
    edit 310154e updated README formatting and added blame
    pick a5f4a0d added cat-file

保存并退出编辑器，直到应用第二次提交`310154e`，运行：

    $ git reset HEAD^
    $ git add forgotten_file_1
    $ git commit -m 'updated README formatting'
    $ git add forgotten_file_2
    $ git commit -m 'added blame'
    $ git rebase --continue

#### 7、修改大量提交 {#git-fiter-branch}

基本命令为`git fiter-branch`，其会大量地修改历史提交。例如，从所有提交中删除一个名叫password.txt的文件：

    $ git filter-branch --tree-filter 'rm -f passwords.txt' HEAD

`--tree-filter`选项会在每次签出项目时先执行指定的命令然后重新提交结果。

### Git工具

#### 1、恢复丢失的commit

在使用Git的过程中，有时会不小心丢失commit，这一般出现在以下情况下：强制删除了一个分支而后又想重新使用这个分支，或者hard-reset了一个分支从而丢弃了分支的部分commit。

下面将master分支hard-reset到一个老版本的commit，然后恢复丢失的commit。先查看历史提交状态：

    $ git log --oneline
    e073a20 Add fadein and fadeout effects in homepage's MenuBar
    3b0528b Change the logic of loading index page
    64e7804 Fix bug: backtotop index is selected when menu index equal 0
    a8c6eaa Add duoshuo comment into post.html
    f42940e Add a part content of the article 2014-04-16-head-first-git.md

接着将master分支重置到`a8c6eaa`这个commit：

    $ git reset --hard a8c6eaa
    HEAD is now at a8c6eaa Add duoshuo comment into post.html
    $ git log --oneline
    a8c6eaa Add duoshuo comment into post.html
    f42940e Add a part content of the article 2014-04-16-head-first-git.md
    75d415f Add post.html and post.js
    ca388b6 Fix bug: weibo widget is overflow in mobile broswer

这样就丢弃了最新的三个commit。现在要找出已丢弃的最新commit的SHA-1哈希值，然后添加一个指向它的分支。

**方法一**：使用`git reflog`工具

当你 (在一个仓库下) 工作时，Git会在你每次修改了HEAD时悄悄地将改动记录下来；当你提交或修改分支时，reflog就会更新。这些改动数据都保存在`.git/logs/`目录下，运行`git reflog`命令可以查看当前的状态：

    $ git reflog
    a8c6eaa HEAD@{0}: reset: moving to a8c6eaa
    e073a20 HEAD@{1}: commit: Add fadein and fadeout effects in homepage's MenuBar
    3b0528b HEAD@{2}: commit: Change the logic of loading index page

上述记录是reflog的简要日志（运行`git log -g`会输出reflog的正常日志，可显示更多有用信息），其中`e073a20 HEAD@{1}`就是丢弃了的最新的commit，在这个commit上创建一个名为recover-branch的分支将这个commit恢复过来：

    $ git branch recover-branch e073a20
    $ git log --oneline recover-branch
    e073a20 Add fadein and fadeout effects in homepage's MenuBar
    3b0528b Change the logic of loading index page
    64e7804 Fix bug: backtotop index is selected when menu index equal 0
    a8c6eaa Add duoshuo comment into post.html
    f42940e Add a part content of the article 2014-04-16-head-first-git.md

这样即找回了丢弃了的三个commit。

**方法二**：使用`git fsck`工具

如果引起commit丢失的原因并没有记录在reflog中——可以通过删除recover-branch和reflog来模拟这种情况：

    $ git branch -D recover-branch
    $ rm -rf .git/logs/

此时，丢弃了的三个commit不会被任何东西引用到，但可以使用`git fsck`工具检查仓库的数据完整性。如果指定`--full`选项，该命令显示所有未被其他对象引用 (指向) 的所有对象：

    $ git fsck --full
    Checking object directories: 100% (256/256), done.
    dangling commit e073a207495d092b48f9fbbea543f82474655327
    dangling commit 3b0528b3f8701c35823898527e3e4d355b3838f5
    dangling blob 8919ea34dd53e33a0abf8ed6aab1c404b2c34e45
    dangling tree aea790b9a58f6cf6f2804eeac9f0abbe9631e4c9

可以从dangling commit找到丢失了的commit，用相同的方法就可以恢复它。

#### 2、显示对象信息 {#git-show}

基本命令为`git show`，用于显示指定对象的相关信息，包括对象类型、提交信息、内容改动等，该对象可以为分支、标签、提交等，参数用法和`git log`相同：

    $ git show <object>

#### 3、内容查找 {#git-grep}

基本命令为`git grep`，其作用是在Git仓库中查找指定内容。与`grep`命令相比，`git grep`不用签出历史文件，就能查找它们。

    $ git grep [options] <pattern>

常用参数：

- `git grep <pattern> <commit>`：指定版本查找
- `git grep <pattern> -- <file>`：指定文件查找
- `git grep -n <pattern>`：在结果中显示匹配项所在文件行号
- `git grep --name-only <pattern>`：在结果中只显示匹配的文件名

#### 4、文件标注 {#git-blame}

如果你在追踪代码中的Bug并且想知道这是什么时候以及为什么被引进来的，可以采用**文件标注**，命令为`git blame`。它会显示文件中对每一行进行修改的最近一次提交，包括谁以及在哪一天修改的。下面这个例子使用了-L选项来限制输出范围在第29至37行：

    $ git blame -L 29,37 linux_text_input_gui.py
    2968197b (Anh Tu Nguyen 2012-06-16 17:54:38 +0800 29)     def __init__(self):
    2968197b (Anh Tu Nguyen 2012-06-16 17:54:38 +0800 30)         # create a new window
    2968197b (Anh Tu Nguyen 2012-06-16 17:54:38 +0800 31)         self.print_text_flag = False
    2968197b (Anh Tu Nguyen 2012-06-16 17:54:38 +0800 32)         window = gtk.Window(gtk.WINDOW_TOPLEVEL)
    864c6b5d (Xender        2013-09-07 13:57:55 +0200 33)         window.set_type_hint(gtk.gdk.WINDOW_TYPE_HINT_DIALOG)
    2968197b (Anh Tu Nguyen 2012-06-16 17:54:38 +0800 34)         window.set_title("Input Helper")
    54e9bb05 (Anh Tu Nguyen 2013-07-12 00:06:20 +0700 35)         window.set_default_size(300, 60)
    68288d37 (hongruiqi     2012-08-15 08:24:01 +0800 36)         window.set_position(gtk.WIN_POS_CENTER_ALWAYS)
    47b6845b (Shiwen Cheng  2013-11-02 02:29:24 +0800 37)         window.set_icon_from_file(os.path.join("icon.png")

#### 5、二分查找 {#git-bisect}

标注文件在你知道Bug是从哪次提交引入时会有帮助，但如果不知道，并且项目已经历了很多次的提交，这时`git bisect`命令将非常有效。这个会在你的提交历史中进行二分查找来尽快地确定哪一次提交引入了Bug。

首先运行`git bisect start`启动，然后用`git bisect bad`来告诉Git当前的提交已经有Bug了，之后必须告诉Git已知的最后一次正常状态是哪次提交，使用`git bisect good <good_commit>`：

    $ git bisect start
    $ git bisect bad
    $ git bisect good v1.0
    Bisecting: 6 revisions left to test after this
    [ecb6e1bc347ccecc5f9350d878ce677feb13d3b2] error handling on repo

Git发现在你标记为正常的提交（v1.0）和当前的错误版本之间有大约12次提交，于是它检出中间的一个。在这里，你可以运行测试来检查Bug是否存在于这次提交。如果是，那么它是在这个中间提交之前的某一次引入的；如果否，那么问题是在中间提交之后引入的。假设这里是没有错误的，那么你就通过`git bisect good`来告诉Git并继续二分查找：

    $ git bisect good
    Bisecting: 3 revisions left to test after this
    [b047b02ea83310a70fd603dc8cd7a6cd13d15c04] secure this thing

如此二分下去，直至定位到引入Bug的提交为止，Git将告诉你第一个错误提交的哈希值并且显示提交说明以及哪些文件在那次提交中修改过：

    b047b02ea83310a70fd603dc8cd7a6cd13d15c04 is first bad commit
    commit b047b02ea83310a70fd603dc8cd7a6cd13d15c04
    Author: PJ Hyett <pjhyett@example.com>
    Date:   Tue Jan 27 14:48:32 2009 -0800

        secure this thing

    :040000 040000 40ee3e7821b895e52c1695092db9bdc4c61d1730
    f24d3c6ebcfc639b1a3814550e62d60b8e68a8e4 M  config

当二分查找完成之后，应运行`git bisect reset`将HEAD指针重置为查找前的状态：

    $ git bisect reset

#### 6、移除大文件

由于`git clone`会将包含每一个文件的所有历史版本的整个项目下载下来，如果有人在某个时刻往项目中添加了一个非常大的文件，那们即便他在后来的提交中将此文件删掉了，所有的签出都会将这个大文件恢复出来。因为历史记录中引用了这个文件，它会一直存在着。

为了不让整个项目的体积变得越来越臃肿，可以将这些不再使用的大文件从项目仓库中移除（警告：此方法会破坏提交历史。为了移除对一个大文件的引用，从最早包含该引用的快照开始之后的所有commit对象都会被重写）。为了演示这点，往测试仓库中加入一个大文件，然后在下次提交时将它删除，接着找到并将这个文件从仓库中永久删除。首先，加一个大文件进去：

    # git.tbz2是一个大小为2MB的文件
    $ git add git.tbz2
    $ git commit -am 'added git tarball'
    [master 6df7640] added git tarball
     1 files changed, 0 insertions(+), 0 deletions(-)
     create mode 100644 git.tbz2

现在，你并不想往项目中加进一个这么大的文件，要将其去掉：

    $ git rm git.tbz2
    rm 'git.tbz2'
    $ git commit -m 'oops - removed large tarball'
    [master da3f30d] oops - removed large tarball
     1 files changed, 0 insertions(+), 0 deletions(-)
     delete mode 100644 git.tbz2

对仓库进行`gc`（garbage collect，指垃圾回收，此命令会做很多工作：收集所有松散对象并将它们存入packfile，合并这些packfile到一个大的 packfile，然后将不被任何commit引用并且已存在一段时间的对象删除）操作，并查看占用了空间：

    $ git gc
    Counting objects: 21, done.
    Delta compression using 2 threads.
    Compressing objects: 100% (16/16), done.
    Writing objects: 100% (21/21), done.
    Total 21 (delta 3), reused 15 (delta 1)

可以运行`count-objects`快速查看使用了多少空间：

    $ git count-objects -v
    count: 4
    size: 16
    in-pack: 21
    packs: 1
    size-pack: 2016
    prune-packable: 0
    garbage: 0

`size-pack`表示packfile的大小，其单位为KB，因此已经使用了2MB。而在这次提交之前仅用了2KB左右——显然在这次提交时删除文件并没有真正将其从历史记录中删除。每当有人克隆这个仓库去取得这个小项目时，都不得不克隆所有2MB数据。

**首先要找出这个大文件**。在本例中，你知道是哪个文件。但如果你并不知道是哪个，可以通过如下方法找到占用空间最多的文件：运行`git gc`，所有对象会存入一个packfile文件；运行另一个底层命令`git verify-pack`以识别出大文件，对输出的第三列信息即文件大小进行排序；还可以将输出定向到`tail`命令，从而列出排在最后的那几个最大的文件（最底下的就是那个2MB的大文件）：

    $ git verify-pack -v .git/objects/pack/pack-3f8c0...bb.idx | sort -k 3 -n | tail -3
    e3f094f522629ae358806b17daf78246c27c007b blob   1486 734 4667
    05408d195263d853f09dca71d55116663690c27c blob   12908 3478 1189
    7a9eb2fba2b1811321254ac360970fc169ba2330 blob   2056716 2056872 5401

**其次要查看大文件的文件路径**，可以使用`rev-list`命令。若给`rev-list`命令加上`--objects`选项，它会列出所有commit SHA值，blob SHA值及相应的文件路径。运行如下命令查看该大文件的文件路径：

    $ git rev-list --objects --all | grep 7a9eb2fba2b1811321254ac360970fc169ba2330
    7a9eb2fba2b1811321254ac360970fc169ba2330 git.tbz2

**接下来找出曾引用了这个文件的所有commit**：

    $ git log --pretty=oneline --branches -- git.tbz2
    da3f30d019005479c99eb4c3406225613985a1db oops - removed large tarball
    6df764092f3e7c8f5f94cbe08ee5cf42e92a0289 added git tarball

**然后将该文件从历史提交的所有快照中移除**，因此必须重写从`6df7640`开始的所有commit才能将文件从Git历史中完全移除，这需要用到`filter-branch`命令：

    $ git filter-branch --index-filter 'git rm --cached --ignore-unmatch git.tbz2' -- 6df7640^..
    Rewrite 6df764092f3e7c8f5f94cbe08ee5cf42e92a0289 (1/2)rm 'git.tbz2'
    Rewrite da3f30d019005479c99eb4c3406225613985a1db (2/2)
    Ref 'refs/heads/master' was rewritten

`--index-filter`选项用于修改暂存区域文件，而不是去修改磁盘上签出的文件，因此用`git rm --cached`来删除它。最后，使用`filter-branch`重写自`6df7640`这个commit开始的所有历史提交。

**最后删除文件引用并repack**。现在历史记录中已经不包含对那个文件的引用了，但reflog以及运行`filter-branch`时Git往`.git/refs/original`添加的一些refs中仍有对它的引用，因此需要将这些引用删除并对仓库进行repack操作：

    $ rm -rf .git/refs/original
    $ rm -rf .git/logs/
    $ git gc
    Counting objects: 19, done.
    Delta compression using 2 threads.
    Compressing objects: 100% (14/14), done.
    Writing objects: 100% (19/19), done.
    Total 19 (delta 3), reused 16 (delta 1)

此时仓库占用空间：

    $ git count-objects -v
    count: 8
    size: 2040
    in-pack: 19
    packs: 1
    size-pack: 7
    prune-packable: 0
    garbage: 0

repack后仓库的大小减小到了7KB，远小于之前的2MB。从size值可以看出大文件对象还在松散对象中，其实并没有消失，不过这没有任何关系，在之后的推送或克隆中，这个对象不会再传送出去。如果真的要完全把这个对象删除，可以运行`git prune --expire`命令。

#### 7、获取帮助 {#git-help}

基本命令为`git help`，可以查看命令的相关帮助，有三种方法：

    $ git help <command>        # 查看command命令的详细帮助
    $ git <command> -h          # 查看command命令的简要帮助
    $ git <command> --help      # 查看command命令的详细帮助

常用参数：

- `git help -a`：列出git命令基本用法及最常用的命令
- `git help -a`：列出所有可用命令


## Git文件忽略

对于一些不需要纳入Git管理的文件，也不希望它们总出现在未跟踪文件列表中，可以忽略这些文件。这些文件通常都是自动生成的文件，比如日志文件，或者编译过程中创建的临时文件等。在项目根目录下创建一个名为`.gitignore`的文件，列出要忽略的文件的匹配模式。例如

    $ cat .gitignore
    *.[oa]
    *~
    tmp/

第一行用于忽略所有以`.o`或`.a`结尾的文件，第二行用于忽略所有以`~`结尾的文件，第三行用于忽略所有名为`tmp`的目录。

文件`.gitignore`的格式规范如下：

- 所有空行或者以注释符号`＃`开头的行都会被Git忽略
- 可以使用标准的glob模式（即shell所使用的简化正则表达式）匹配
    - 星号（`*`）匹配零个或多个任意字符
    - `[abc]`匹配任何一个列在方括号中的字符
    - 问号（`?`）只匹配一个任意字符
    - 在方括号中使用短划线（`-`）分隔两个字符，表示所有在这两个字符范围内的都可以匹配（比如`[0-9]`表示匹配所有0到9的数字）
- 匹配模式以反斜杠（`/`）结尾表示要忽略的是目录
- 匹配模式以惊叹号（`!`）开头表示要取消的忽略

一些常用的匹配模式：

    # 忽略所有以.a结尾的文件
    *.a

    # 但lib.a除外
    !lib.a

    # 忽略所有名为log的文件和目录
    log

    # 只忽略log文件，不忽略log目录
    log
    !log/

    # 只忽略log目录，不忽略log文件
    log/

    # 仅仅忽略项目根目录下的tmp文件和tmp目录
    /tmp

    # 忽略doc根目录下的所有以.txt结尾的文件（但不包括doc/server/arch.txt）
    doc/*.txt

`.gitignore`文件同样需要加入到版本控制中，运行`git add .gitignore`以及`git commit`提交即可。

**注**：`.gitignore`只适用于未跟踪文件。要忽略已跟踪文件，则需用`git rm`移除该文件后再添加至`.gitignore`中。


## Git使用技巧

#### 1、工作流程建议

如果是个人工作，建议如下：

    $ make changes              # 作出改动
    $ git status or git diff    # 查看文件状态或改动差异（建议）
    $ git add                   # 暂存文件
    $ git commit                # 提交改动
    $ git push                  # 推送提交

如果是多人协作开发，建议如下：

    $ git pull                  # 拉取最新提交并合并（建议）
    $ make changes              # 作出改动
    $ git status or git diff    # 查看文件状态或改动差异（建议）
    $ git add                   # 暂存文件
    $ git pull                  # 强烈建议提交前执行，否则可能产生一条不必要的合并提交
    $ git commit                # 提交改动
    $ git push                  # 推送提交

#### 2、自动补全

在Bash中使用Git命令自动补全，将使得工作变得更简单，更轻松，更高效。Git官方提供了[git-completion.bash][5]的自动补全脚本，将该文件保存下来，运行：

    mv git-completion.bash ~/.git-completion.bash

并把下面一行内容添加到`~/.bashrc`文件中：

    source ~/.git-completion.bash

也可以为系统上所有用户都设置默认使用此脚本。Mac上将此脚本复制到`/opt/local/etc/bash_completion.d/`目录中，Linux上则复制到`/etc/bash_completion.d/`目录中。这两处目录中的脚本，都会在Bash启动时自动加载。

如果在Windows上安装了msysGit，默认使用的Git Bash就已经配好了这个自动补全脚本，可以直接使用。

此外，推荐一个不错的Shell：[Zsh][6]，其拥有强大的自动补全（可以自动补全命令、参数、文件名、进程、用户名、变量、权限符等）、自定义配置等功能。其还有一个不错的扩展：[oh-my-zsh][7]，拥有更加方便的插件扩展、主题配置功能。

#### 3、设置命令别名

除[Git配置](#menuIndex4)中讲述了`git config`的一些基本用法，此外还可以为命令设置别名，例如：

    $ git config --global alias.co checkout
    $ git config --global alias.br branch
    $ git config --global alias.ci commit
    $ git config --global alias.st status
    $ git config --global alias.unstage 'reset HEAD --'
    $ git config --global alias.last 'log -1 HEAD'

则`git commit`可以用`git ci`代替，`git reset HEAD file`可以用`git unstage file`代替。而随着Git使用的深入，会有很多经常要用到的命令，遇到这种情况，不妨建个别名提高效率。

#### 4、Git图形化工具

一些不错的Git图形化工具可以使人从枯燥的命令行中解脱，如：

- [GitX (L)](http://gitx.laullon.com)（Mac，开源免费）
- [SourceTree](http://www.sourcetreeapp.com)（Windows / Mac，免费）
- [TortoiseGit](https://code.google.com/p/tortoisegit/)（Windows，免费）
- [GitHub for Mac](https://mac.github.com)，[GitHub for Windows](https://windows.github.com)（Mac / Windows，免费）
- [GitEye](http://www.collab.net/giteyeapp)（Windows / Linux / Mac，免费）
- [git-cola](http://git-cola.github.io)（Windows / Linux / Mac，开源免费）
- [Git Extensions](https://code.google.com/p/gitextensions)（Windows / Linux / Mac，免费）

#### 5、Git托管服务

目前比较流行的Git托管服务有：

- [GitHub](https://github.com/)（无限空间）
- [Bitbucket](https://bitbucket.org/)（无限空间）
- [Gitorious](https://gitorious.org/)（无限空间）
- [CloudHost](http://cloudhost.io/)（1000个项目）
- [Deveo](https://www.deveo.com/)（无限空间）
- [GitEnterprise](http://www.gitenterprise.com/)（1GB空间）
- [GitCafe](https://gitcafe.com/)（0.25GB空间）
- [Git OSChina](https://git.oschina.net/)（1000个项目）

对于一些想要公开的项目，可以将这些项目放到上述公共的Git服务器上，由它们进行托管。当然，如果不希望项目公开，可以设置为私有（部分Git托管服务会收取一定的费用）。

此外，可以在自己的服务器上搭建Git服务，具体方法详见[这里](http://git-scm.com/book/zh/%E6%9C%8D%E5%8A%A1%E5%99%A8%E4%B8%8A%E7%9A%84-Git-%E5%9C%A8%E6%9C%8D%E5%8A%A1%E5%99%A8%E4%B8%8A%E9%83%A8%E7%BD%B2-Git)。本文提供三种搭建Git服务的工具：

- [GitLab](https://www.gitlab.com/)（可以采用[Bitnami Gitlab](https://bitnami.com/stack/gitlab)一键安装GitLab)
- [Gitosis](http://git-scm.com/book/en/Git-on-the-Server-Gitosis)
- [Gitolite](http://git-scm.com/book/en/Git-on-the-Server-Gitolite)

如果不需要和其他人进行协作开发，也不想公开项目，甚至不想要搭建Git服务，那么可以直接使用本地路径完成Git仓库间的操作。

假设本地项目名为`example`，其路径为`~/Project/example`。我们可以在本地建立一个目录来模拟远程服务器，假设为`~/GitRemote/`，其用于存储远程仓库，即相当于Git服务器，操作如下：

    $ cd ~/Project/example
    $ git init
    $ git clone --bare ../example ~/GitRemote/example.git

然后编辑`.git/config`文件，追加以下内容（注意修改相应的`url`）：

    [remote "origin"]
            fetch = +refs/heads/*:refs/remotes/origin/*
            url = ~/GitRemote/example.git
    [branch "master"]
            remote = origin
            merge = refs/heads/master

此时，我们便能在`example`项目下进行正常的Git操作，而在`~/GitRemote/example.git`下可以查看相应的远程仓库。


## Git命令索引

- [`config`](#menuIndex4) [`init`](#git-init) [`clone`](#git-clone)
- [`status`](#git-status) [`add`](#git-add) [`diff`](#git-diff) [`commit`](#git-commit)
- [`log`](#git-log) [`stash`](#git-stash) [`rm`](#git-rm) [`mv`](#git-mv) [`clean`](#git-clean) [`tag`](#git-tag)
- [`branch`](#git-branch) [`checkout`](#git-checkout) [`merge`](#git-merge) [`cherry-pick`](#git-cherry-pick)
- [`remote`](#git-remote) [`push`](#git-push) [`fetch`](#git-fetch) [`pull`](#git-pull)
- [`reset`](#git-reset) [`revert`](#git-revert) [`rebase`](#git-rebase)
- [`show`](#git-show) [`grep`](#git-grep) [`blame`](#git-blame) [`bisect`](#git-bisect) [`help`](#git-help)

附：[Git常用命令简记图](http://pic002.cnblogs.com/img/1-2-3/201007/2010072023345292.png)


[Git]:              http://git-scm.com "Git"
[Linus Torvalds]:   http://zh.wikipedia.org/wiki/Linus_Torvalds
[Linux Kernel]:     https://github.com/torvalds/linux
[Ruby On Rails]:    https://github.com/rails/rails
[jQuery]:           https://github.com/jquery/jquery
[Node.js]:          https://github.com/joyent/node
[Bootstrap]:        https://github.com/twbs/bootstrap
[Django]:           https://github.com/django/django
[1]:    http://zh.wikipedia.org/wiki/SHA1
[2]:    http://git-scm.com/download/linux
[3]:    http://code.google.com/p/git-osx-installer
[4]:    http://msysgit.github.io
[5]:    https://github.com/git/git/blob/master/contrib/completion/git-completion.bash
[6]:    http://www.zsh.org
[7]:    http://ohmyz.sh
