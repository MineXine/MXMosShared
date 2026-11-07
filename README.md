# MXMosShared

前后端共享的类型定义与 MDC 组件配置。

被 [`MXMosApi`](https://github.com/MineXine/MXMosApi) 与 [`MXMosPanel`](https://github.com/MineXine/MXMosPanel) 通过 Git submodule 引用。

## 内容

| 文件 | 说明 |
|---|---|
| `types.ts` | 领域类型：`Post` `User` `SavedView` `Draft` `PostQuery` 等，唯一事实来源 |
| `mdc.ts` | MDC 组件配置表 `MDC_DEFAULTS` + 解析器 `parseMdcOptions` |

## 为什么单独成仓库

前后端共用同一份类型与同一套 MDC 解析逻辑，拆出来可以：

- 避免两端实现漂移（解析器改动必须两端同时生效）
- 独立版本化，API 与界面可分别升级
- 被其他客户端（小程序、脚本、CLI）复用

## 在其他仓库中使用

```bash
git clone --recursive https://github.com/MineXine/MXMosPanel.git
# 或已 clone 后
git submodule update --init --recursive
```

导入：

```ts
import type { Post } from '@shared/types';
import { MDC_DEFAULTS, parseMdcOptions } from '@shared/mdc';
```
