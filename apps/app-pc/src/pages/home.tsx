import { useState } from 'react';
import { ScriptCodeEditor } from '@coding-script/script-engine';
import type { ScriptMetadata } from '@coding-script/script-engine';
import { message } from 'antd';

const sampleMetadata: ScriptMetadata = {
  binds: [{ dataType: 'GroovyBindObject', name: '$request' }],
  requests: [
    {
      dataType: 'MyScriptRequest',
      description: '我的测试对象',
      name: 'request',
    },
  ],
  returnType: 'Integer',
  types: {
    MyScriptRequest: {
      dataType: 'MyScriptRequest',
      description: '我的测试对象',
      fields: [
        { dataType: 'int', description: '总数量', name: 'count' },
        { dataType: 'MyTest', description: 'test', name: 'test' },
      ],
      functions: [
        {
          description: '是否匹配',
          name: 'isSupport',
          parameters: [
            { dataType: 'int', description: '描述信息', name: 'count' },
          ],
        },
      ],
    },
    MyTest: {
      dataType: 'MyTest',
      description: 'test',
      fields: [
        { dataType: 'Long', description: 'id', name: 'id' },
        { dataType: 'String', description: 'name', name: 'name' },
      ],
      functions: [],
    },
    GroovyBindObject: {
      dataType: 'GroovyBindObject',
      fields: [{ dataType: 'int', description: '总数量', name: 'count' }],
      functions: [],
    },
    Integer: { dataType: 'Integer', fields: [], functions: [] },
    String: { dataType: 'String', fields: [], functions: [] },
    Long: { dataType: 'Long', fields: [], functions: [] },
    int: { dataType: 'int', fields: [], functions: [] },
    boolean: { dataType: 'boolean', fields: [], functions: [] },
  },
};

const sampleCode = `def run(request){
    println($request.count);
    return request.test.name;
}
`;

const HomePage = () => {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  return (
    <div
      style={{
        padding: 24,
        minHeight: '100vh',
        background: theme === 'dark' ? '#1e1e1e' : '#f5f5f5',
        transition: 'background 0.3s',
      }}
    >
      <ScriptCodeEditor
        value={sampleCode}
        title="Groovy 脚本编辑器"
        theme={theme}
        metadata={sampleMetadata}
        onThemeChange={(nextTheme) => setTheme(nextTheme)}
        onCompile={(code) => {
          console.log('编译脚本:', code);
          message.success('脚本编译测试已提交');
        }}
        onChange={(value: string) => {
          console.log('Code changed:', value);
        }}
        options={{ minHeight: 400, maxHeight: 500 }}
      />
    </div>
  );
};

export default HomePage;
