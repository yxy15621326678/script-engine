import { ScriptCodeEditor } from '@coding-script/script-engine';
import sampleMetadata from './meta.json';
import { message } from 'antd';


const sampleCode = `def run(request){
    println($request.count);
    return request.test.name;
}
`;

const HomePage = () => {

  return (
    <div
      style={{
        padding: 24,
        minHeight: '100vh',
        transition: 'background 0.3s',
      }}
    >
      <ScriptCodeEditor
        value={sampleCode}
        title="Groovy 脚本编辑器"
        defaultTheme="light"
        metadata={sampleMetadata}
        enableThemeToggle
        enableFormat
        enableCompile
        enableFullscreen
        onCompile={(code:string) => {
          console.log('编译脚本:', code);
          message.success('脚本编译测试已提交');
        }}
        onChange={(value: string) => {
          console.log('Code changed:', value);
        }}
        options={{ minHeight: 400, maxHeight: 500 }}
        toolbar={[
          {
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
