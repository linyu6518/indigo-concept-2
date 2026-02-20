# TBSM Indigo 设计规范

> 后续所有界面与组件设计均需遵照本文档，以保持产品视觉与交互一致。

---

## 1. 品牌与色彩

### 1.1 主色
- **Primary 主色**：`#5BBD72`（绿色），用于主要按钮、链接、选中态、焦点环。
- **Primary 前景**：`#ffffff`，主色上的文字与图标。

### 1.2 全局背景与文字
- **Light**
  - 背景：`#f8faf9`（`bg-background`）
  - 正文：`#1a1a1a`（`text-foreground`）
  - 弱化文字：`#6b7280`（`text-muted-foreground`）
- **Dark**
  - 背景：`#0f172a`
  - 正文：`#f8fafc`

### 1.3 侧栏（Sidebar）专用
- 侧栏背景渐变：`from-sidebar via-sidebar to-sidebar-accent`（深绿渐变）
- 侧栏主色：`#2c5f4e`（sidebar）
- 侧栏强调：`#3a6b5a`（sidebar-accent）
- 侧栏高亮/主操作：`#7bdc93`（sidebar-primary）
- 侧栏文字：白色 `#ffffff`（sidebar-foreground）
- 侧栏高亮上文字：深绿 `#2c5f4e`（sidebar-primary-foreground）
- 侧栏描述类文字：默认 **50% 白色**（`text-white opacity-50`），hover/选中时与主标题同色（`text-sidebar-primary-foreground`）。

### 1.4 边框与分割
- 通用边框：`#e5e7eb`（`border-border`）
- 弹窗/表单内输入框：白底上使用 **可见边框**，如 `border border-gray-300`，避免“无框”输入框。
- 侧栏内分隔线：**1px、黑色 20% 透明度**（`rgba(0,0,0,0.2)`），左右与内容对齐（如 `px-4`），不铺满整宽时可适当缩短。

### 1.5 语义色
-  destructive：`#ef4444`
- 成功/通过：绿色系（如 `green-500`、`bg-green-50`）
- 警告/待处理：琥珀/橙（如 `amber-400`、`bg-amber-50`）
- 错误/拒绝：红色系（如 `red-400`、`bg-red-50`）

---

## 2. 字体与层级

- **基础字号**：14px（`--font-size: 14px`），正文使用 `text-sm` 或 `text-base`。
- **页面标题**：`text-2xl font-semibold text-foreground`。
- **区块标题**：`text-xl font-semibold`。
- **卡片/列表标题**：`font-medium text-sm` 或 `font-semibold text-base`。
- **辅助说明**：`text-sm text-muted-foreground`。
- **小字/标签**：`text-xs text-muted-foreground`，表单项 label 使用 `text-xs text-muted-foreground mb-1 block`。

---

## 3. 圆角与阴影

- **基础圆角**：`0.625rem`（`--radius`），按钮、输入框多用 `rounded-md`。
- **侧栏**：容器 `rounded-3xl`，导航项展开态 `rounded-xl`，收起态图标 `rounded-full`。
- **卡片**：默认 `rounded-lg`，可与 `shadow-sm`、`border` 搭配。
- **阴影**：侧栏 `shadow-2xl`；卡片 `shadow-sm`，hover 可 `hover:shadow-md`；避免大面积强阴影。

---

## 4. 布局与间距

- **整页**：`flex h-screen bg-background`，左侧固定侧栏，右侧 `flex-1 overflow-auto` 主内容。
- **主内容区**：使用 `p-6 space-y-6` 或 `p-6` + 内部 `gap-6` 作为页面级内边距与区块间距。
- **栅格**：卡片/统计常用 `grid grid-cols-1 md:grid-cols-3 gap-6` 等，保持 `gap-4` / `gap-6` 一致。
- **表单项**：label 与输入框间距 `mb-1`；表单项之间 `gap-4` 或 `space-y-4`；弹窗内可用 `grid grid-cols-3 gap-4` 做多列表单。

---

## 5. 侧栏（Sidebar）

- **结构**：Logo 左对齐，右侧为标题 + 描述（如「TBSM Indigo」「Document Management」）；导航项仅展示名称，需描述时仅对指定项（如 Dashboard、Configuration）在名称下加一行描述；Configuration 区块上方加一条 1px、黑色 20% 的分隔线，与内容左右对齐（如 `px-4`）。
- **导航项**：展开态 `min-h-[2.75rem]`、`px-4 py-3`、`rounded-xl`；收起态 `w-12 h-12`、`rounded-full`；hover `hover:scale-110`，选中态 `scale-105`；选中用 `sidebar-primary` 背景，未选中用 `sidebar-accent`，hover 向 primary 过渡。
- **文字**：导航标题与 Configuration 标题随状态变色；描述默认 50% 白色，hover/选中与主标题同色。
- **无关闭按钮**：侧栏展开时不提供关闭按钮，通过鼠标移出或点击其他区域收起。

---

## 6. 按钮

- **主操作**：绿色背景，如 `bg-[#5BBD72] hover:bg-[#4da862] text-white`，或使用 `primary` 语义。
- **次要**：`variant="outline"` 或 `border border-border`，与主按钮区分。
- **尺寸**：默认高度与 `Input` 协调（如 `h-9`），重要操作可略大；保持内边距一致（如 `px-4`）。

---

## 7. 表单与输入

- **输入框**：使用设计系统 `Input`；在弹窗或白底卡片内时，必须带**可见边框**（如 `border border-gray-300`），避免仅背景无框。
- **Label**：`text-xs text-muted-foreground mb-1 block`，必填可用 `*` 标注。
- **复选框**：与 label 水平排列时使用 `flex items-center gap-2`。
- **弹窗**：Edit Row 等编辑弹窗使用 `Card` 或 `bg-white p-6`，底部操作区可用 `border-t border-gray-200` + `pt-4` 分隔。

---

## 8. 卡片与表面

- **内容卡片**：`bg-white shadow-sm border-0` 或 `border border-border`，hover 可 `hover:shadow-md transition-shadow`。
- **内边距**：卡片内容区统一 `p-6`，小卡片可用 `p-4`。
- **图标/数字容器**：小图标区可用 `w-12 h-12 rounded-lg` 或 `w-8 h-8 rounded-lg`，配合 `bg-primary/10`、`bg-green-100` 等语义背景。

---

## 9. 动效

- **过渡**：颜色、透明度用 `transition-colors duration-300`；布局/缩放用 `transition-all duration-300`。
- **侧栏**：展开/收起 `transition-all duration-300 ease-in-out`；导航项 hover scale 保持统一，不引起整列位移。
- **避免**：hover 时整块布局大幅跳动；无必要的长时动画。

---

## 10. 通用原则

- **一致性**：同类型元素（如所有导航项、所有主按钮、所有输入框）样式与交互一致。
- **层级清晰**：通过字号、字重、颜色区分标题、正文、辅助信息。
- **可访问**：保证对比度；焦点态使用 `ring` 或 `focus-visible:ring`；重要交互有 hover 反馈。
- **响应式**：主内容区使用 `overflow-auto`；栅格使用 `grid-cols-1 md:grid-cols-*` 等断点。
- **Token 优先**：颜色、圆角、阴影优先使用 `globals.css` 与 Tailwind 中已定义的 token（如 `bg-background`、`text-foreground`、`border-border`、`rounded-md`），避免随意写死色值（必要时可补 token 再引用）。

---

## 11. 文件与实现

- 全局样式与 CSS 变量：`src/styles/globals.css`。
- 主题色与侧栏色：在 `:root` 与 `.dark` 中维护，新增语义色时同步两处并加入 `@theme inline` 映射。
- 组件：优先使用 `src/components/ui/` 下已有组件；新组件遵循上述间距、圆角、色彩与动效规范。
- 设计规范文档：`src/guidelines/DESIGN_GUIDELINES.md`（本文档），新增或修改规范时更新此处并确保实现一致。
