[![npm](https://img.shields.io/npm/v/@coding-form/form-engine.svg)](https://www.npmjs.com/package/@coding-form/form-engine)
# Form Engine

一个基于 React 的动态表单引擎，支持表单动态渲染、字段验证、事件处理和布局控制。

## 项目结构

```
coding-form/
├── packages/
│   └── form-engine/          # 核心表单视图库
│       ├── src/
│       │   ├── form/       # 表单组件
│       │   ├── factory/    # 表单项工厂
│       │   ├── register/   # 组件注册中心
│       │   ├── store/      # Redux 状态管理
│       │   ├── context/    # React Context
│       │   ├── instance/   # 表单实例控制
│       │   ├── presenters/ # 表单展示层
│       │   ├── validate/   # 表单验证
│       │   ├── event/      # 事件处理
│       │   ├── layout/     # 布局系统
│       │   ├── hooks/      # 自定义 Hooks
│       │   └── types/      # TypeScript 类型定义
│       └── dist/           # 构建输出
├── apps/                   # 示例应用
│   ├── app-pc/            # PC 端示例
│   └── app-mobile/        # 移动端示例
└── package.json           # 工作区配置
```

## 核心功能

### 1. 动态表单渲染

通过元数据（Meta）动态生成表单，支持：
- 多种数据类型：`STRING`, `INTEGER`, `LONG`, `DOUBLE`, `BOOLEAN`
- 字段属性：名称、编码、类型、默认值、提示等
- 嵌套子表单（subForms）

### 2. 表单验证

```typescript
interface FormFieldValidator {
    target: FieldKey;           // 校验目标字段
    validator: (instance: FormInstance, value: any) => boolean | string;
}
```

- 支持自定义验证规则
- 异步验证支持
- 隐藏字段自动跳过验证

### 3. 事件系统

支持表单事件绑定和处理：

```typescript
interface FormEvent {
    type: 'load' | 'change' | 'blur';  // 事件类型
    target: FieldKey;                   // 事件目标
    event: (formInstance: FormInstance, value: any) => void;
}
```

- `load`: 表单加载时触发
- `change`: 字段值变化时触发
- `blur`: 字段失去焦点时触发

### 4. 布局控制

支持卡片布局和默认布局：

```typescript
interface FormLayout {
    formCode: string;
    type: 'card';
    props: CardLayout
}

interface CardLayout {
    title: string;
    layout: 'horizontal' | 'vertical';
    fields: FieldLayout[];
    mainFields: string[];
}
```

### 5. Header 和 Footer

支持在表单头部和底部渲染自定义内容：

```typescript
interface FormViewProps {
    header?: React.ReactNode;  // 表单头部内容（表单外部）
    footer?: React.ReactNode;  // 表单底部内容（表单外部）
    children?:React.ReactNode; // 主表单自定义内容（表单内部）
}
```

- `header`: 渲染在表单外部内容上方的区域，可用于放置标题、说明文字等
- `footer`: 渲染在表单外部内容下方的区域，可用于放置提交按钮、操作栏等
- `children`: 渲染在主表单内部的区域，可用于放置固定的隐藏字段或者其他的界面内容

### 6. 表单提交（onFinish）

支持表单提交事件处理：

```typescript
interface FormViewProps {
    onFinish?: (values: any, formCode?: string) => void;
}
```

- 当表单提交时触发
- 返回表单数据和表单编码
- 支持主表单和子表单

### 7. 刷新组件

通过增加字段 `version` 版本号来触发组件的重新渲染：

```typescript
interface StateField {
    version?: number;  // 版本号，每次刷新时递增
}
```

- `refreshFields`: 刷新指定字段，触发组件重新渲染
- 支持单个字段或字段数组
- 支持主表单和子表单
- 通过递增 `version` 值实现强制刷新

```typescript
// 刷新单个字段
form.refreshFields('field_code');

// 刷新多个字段
form.refreshFields(['field1', 'field2']);

// 刷转子表单字段
form.refreshFields(['field1'], 'sub_form_code');
```

### 8. 表单实例控制

提供丰富的表单操作方法：

```typescript
// 获取/设置字段值
getFieldValue(name: string, formCode?: string)
getFieldsValue(formCode?: string)
setFieldValue(name: string, value: any, formCode?: string)
setFieldsValue(values: any, formCode?: string)

// 表单操作
resetFields(nameList?: string[], formCode?: string)
validateFields(nameList?: string[], formCode?: string)
submit(formCode?: string)

// 动态控制
hiddenFields(hidden: boolean, nameList: string[]|string, formCode?: string)
requiredFields(required: boolean, nameList: string[]|string, formCode?: string)
refreshFields(nameList: string[]|string, formCode?: string)  // 刷新字段，触发重新渲染
```

## 快速开始

### 1. 安装依赖

```bash
pnpm install
```

### 2. 注册表单组件

```tsx
import { FormRegistry } from '@coding-form/form-engine';
import YourFormComponent from './YourFormComponent';
import formInstanceFactory from './formInstanceFactory';

FormRegistry.getInstance().register(YourFormComponent, formInstanceFactory);
```

### 3. 使用表单视图

```tsx
import { FormView } from '@coding-form/form-engine';

const meta = {
    name: '用户信息',
    code: 'user_form',
    fields: [
        {
            id: '1',
            name: '姓名',
            code: 'name',
            type: 'text_input',
            dataType: 'STRING',
            hidden: false,
            required: true,
            placeholder: '请输入姓名'
        }
    ]
};

// 基础用法
<FormView meta={meta} />;

// 带 header、footer 和 onFinish 的完整用法
<FormView
    meta={meta}
    header={<div className="form-header">用户信息登记表</div>}
    footer={
        <div className="form-footer">
            <Button type="primary" htmlType="submit">提交</Button>
            <Button>取消</Button>
        </div>
    }
    onFinish={(values, formCode) => {
        console.log('表单提交数据:', values, '表单编码:', formCode);
    }}
/>;
```

### 4. 开发模式

```bash
# 监听构建 form-view
pnpm watch:form-view

# 运行 PC 示例应用
pnpm dev:app-pc

# 运行移动端示例应用
pnpm dev:app-mobile
```

### 5. 构建

```bash
pnpm build
```

## 技术栈

- **React 18** - UI 框架
- **TypeScript** - 类型系统
- **Redux Toolkit** - 状态管理
- **React Redux** - React 绑定
- **Rslib** - 构建工具

## API 参考

### FormView 组件属性

| 属性         | 类型 | 说明       |
|------------|------|----------|
| meta       | FormMeta | 表单元数据定义  |
| form       | FormInstance | 表单实例     |
| onBlur     | (formCode?: string) => void | 表单失去焦点事件 |
| onValuesChange   | (partial:any,values:any,formCode?:string)=>void | 表单值更新事件   |
| onFinish   | (values: any, formCode?: string) => void | 表单提交回调   |
| header     | React.ReactNode | 表单头部内容   |
| footer     | React.ReactNode | 表单底部内容   |
| review     | boolean | 是否预览模式   |
| validators | FormFieldValidator[] | 验证规则数组   |
| events     | FormEvent[] | 事件定义数组   |
| layouts    | FormLayout[] | 布局定义数组   |

### 数据类型

| 类型 | 说明 |
|------|------|
| STRING | 字符串 |
| INTEGER | 整数 |
| LONG | 长整数 |
| DOUBLE | 小数 |
| BOOLEAN | 布尔值 |

## 许可证

[LICENSE](./LICENSE)
