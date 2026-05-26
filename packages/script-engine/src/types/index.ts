export interface ScriptCodeEditorProps {
    // 代码内容
    value?: string;
    // 是否只读
    readonly?: boolean;
    // 代码变化回调
    onChange?: (value: string) => void;
    // 占位符
    placeholder?: string;
    // 主题
    theme?: 'dark' | 'light';
    // 其他选项
    options?: {
        // 字体大小
        fontSize?: number;
        // 最小高度
        minHeight?: number;
        // 最大高度
        maxHeight?: number;
    };
}