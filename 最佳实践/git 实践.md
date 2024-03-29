# git 实践

## git rebase

- 可以直接理解为改变基底。feature 分支是基于 master 分支的 B 拉出来的分支，feature 的基底是 B。而 master 在 B 之后有新的提交，就相当于此时要用 master 上新的提交来作为 feature 分支的新基底。
- 实际操作为把 B 之后 feature 的提交存下来，然后删掉原来这些提交，再找到 master 的最新提交位置，把存下来的提交再接上去（新节点新 commit id）
- 如此 feature 分支的基底就相当于变成了 M 而不是原来的 B 了。
- 注意，如果 master 上在 B 以后没有新提交，那么就还是用原来的 B 作为基，rebase 操作相当于无效，此时和 git merge 就基本没区别了，差异只在于 git merge 会多一条记录 Merge 操作的提交记录
- 大部分公司其实会禁用 rebase，不管是拉代码还是 push 代码统一都使用 merge，虽然会多出无意义的一条提交记录“Merge … to …”，但至少能清楚地知道主线上谁合了的代码以及他们合代码的时间先后顺序

## GitFlow

> 简单记录工作中使用 gitflow 模型管理代码版本、保证代码安全的方法。

参考：

- [A successful Git branching model](https://nvie.com/posts/a-successful-git-branching-model/)
- [Git 工作流程](http://www.ruanyifeng.com/blog/2015/12/git-workflow.html)
- [Git 分支管理策略](http://www.ruanyifeng.com/blog/2012/07/git.html)
- [git flow 的使用](https://www.cnblogs.com/lcngu/p/5770288.html)
- [GitFlow 原理浅析](https://www.cnblogs.com/diffx/p/10690632.html)

gitflow 现在被认为过于复杂，可能不适用于现代软件开发：

- [如何看待 Git flow 发明人称其不适用于持续交付？](https://www.zhihu.com/question/379545619)
- [Issues with git-flow](http://scottchacon.com/2011/08/31/github-flow.html)
- [在阿里，我们如何管理代码分支？](https://mp.weixin.qq.com/s/0N3isbSZL4fM5HjZo1aafA?)

### 分支类型

#### master

- 只有一条
- 主分支
- 只读，只能从分支 release 或 hotfix 合并进来
- 所有发生在 master 分支的修改应该打 tag 做记录，方便追溯

#### develop

- 只有一条
- 主开发分支，基于 master 分支克隆
- 包含所有要发布到下一个 release 的代码
- 只读，只能从 feature 或 release 合并进来
- feature 功能分支完成开发后，合并到 develop，合并到 develop 前，提交合并申请，与 develop 分支进行比较做代码审查，审查通过则允许合并
- 从 develop 拉取 release 分支，提测
- release 或 hotfix 分支上线完毕，合并回 develop。

#### feature

- 功能开发分支，基于 develop 分支克隆，主要用于新需求新功能的开发
- 有多条，按功能划分，如：`/feature/20200712-新增用户`、`/feature/20200801-登陆注册`
- 可以几个人一起开发一条 feature，也可以一人负责一条 feature
- 功能开发完毕后，提测前，合并到 develop 分支
- feature 类型的分支可同时存在多个，用于团队中多个功能同时开发，属于临时分支，功能完成后可选择删除

#### release

- 版本分支，用于测试与上线，基于 feature 分支合并到 develop 之后，从 develop 分支克隆
- 有多条，按版本划分，如：`/release/20200712-第一版v0.1`、`/release/20200713-第二版v0.2`
- release 类型的分支主要用于测试和修改 bug，完成上线后合并回 develop 与 master 分支

#### hotfix

- 补丁分支，基于 master 分支克隆，主要用于对线上的版本进行 BUG 修复
- 有多条，按版本划分，如：`/hotfix/20200712-修复xss漏洞`、`/hotfix/20200713-修复新增用户失败bug`
- 修复完毕后合并回 develop 与 master 分支

### 主要工作流程示例

- 初始化项目，创建 master 分支，然后从 master 拉取 develop 分支
- 根据需求划分功能，从 develop 拉取 feature 分支进行编码开发，如`/feature/20200712-新增用户`、`/feature/20200801-登陆注册`
- feature 分支完成后，合并到 develop 前，提交合并申请，与 develop 比较，进行代码审查，合并完成可以选择删除当前 feature
- 需要发布时，从 develop 拉取 release 分支进行测试，例如`/release/20200712-第一版`，测试过程中在该条 release 分支上修改 BUG，测试通过后将该条 release 分支发布
- 回归：任一 release 分支通过测试上线后，合并该 release 分支到 develop 与 master，master 分支打 tag，当前 release 不可修改，线上有问题须从 master 拉取 hotfix 分支进行修改
- 通知所有进行中的 feature、release 把 master 合进来一次
- 上线之后若发现 bug，从 master 拉取 hotfix 进行 bug 修改，如`/hotfix/20200713-修复新增用户失败bug`
- hotfix 通过测试上线后，合并 hotfix 分支到 develop 与 master，master 分支打 tag
- 版本回退：如果需进行版本回退，则选择上一版本号的 release 分支进行发布

::: tip

分支命名使用 `YYYYMMDD-功能名称` 格式，gui 工具或命令行打印时自动排序，找分支找比较方便

:::

## 参考

- <https://ourai.ws/posts/working-with-git-in-team/>
- <https://www.cnblogs.com/irving/p/5146738.html>
- <https://mp.weixin.qq.com/s/0N3isbSZL4fM5HjZo1aafA>
- https://ihower.tw/blog/archives/3843
