import { useState } from 'react';
import { ScriptCodeEditor } from '@coding-script/script-engine';
import sampleMetadata from './meta.json';
import { message, Radio } from 'antd';


const groovySampleCode = `def run(request){
    println($request.count);
    return request.test.name;
}
`;

const javascriptSampleCode = `function run(request) {
    console.log(request.count);
    return request.test.name;
}
`;

const HomePage = () => {
  const [language, setLanguage] = useState<'groovy' | 'javascript'>('groovy');

  const sampleCode = language === 'groovy' ? groovySampleCode : javascriptSampleCode;
  const title = language === 'groovy' ? 'Groovy 脚本编辑器' : 'JavaScript 脚本编辑器';

  return (
    <div
      style={{
        padding: 24,
        minHeight: '100vh',
        transition: 'background 0.3s',
      }}
    >
      <div style={{ marginBottom: 16 }}>
        <Radio.Group
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          optionType="button"
          buttonStyle="solid"
        >
          <Radio.Button value="groovy">Groovy</Radio.Button>
          <Radio.Button value="javascript">JavaScript</Radio.Button>
        </Radio.Group>
      </div>

      <ScriptCodeEditor
        value={sampleCode}
        title={title}
        language={language}
        defaultTheme="light"
        metadata={sampleMetadata}
        enableThemeToggle
        enableFormat
        enableCompile
        enableFullscreen
        onCompile={(code: string) => {
          console.log('编译脚本:', code);
          message.success('脚本编译测试已提交');
        }}
        onChange={(value: string) => {
          console.log('Code changed:', value);
        }}
        options={{ minHeight: 400, maxHeight: 500 }}
        toolbar={[
          {
            key: 'customButton',
            label: '自定义按钮',
            title: '这是一个自定义工具栏按钮',
            backgroundColor: '#007bff',
            hoverBackgroundColor: '#0056b3',
            textColor: '#fff',
            borderColor: '#007bff',
            onClick: () => message.info('点击了自定义按钮'),
          },
        ]}
        toolbarExtra={<div style={{ marginLeft: 16, color: '#888' }}>这是自定义的额外的工具栏内容</div>}
      />
    </div>
  );
};

export default HomePage;
