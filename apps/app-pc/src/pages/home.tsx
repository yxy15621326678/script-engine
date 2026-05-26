import { ScriptCodeEditor } from '@coding-script/script-engine';
import type { ScriptMetadata } from '@coding-script/script-engine';
import { message } from 'antd';

const sampleMetadata: ScriptMetadata = JSON.parse(`{"binds":[{"dataType":"GroovyBindObject","name":"$request"}],"description":"这是一个run函数，返回的格式为int类型。","mainMethod":"run","requests":[{"dataType":"MyScriptRequest","description":"我的测试对象","name":"request"}],"returnType":"Integer","types":{"MyScriptRequest":{"dataType":"MyScriptRequest","description":"我的测试对象","fields":[{"dataType":"int","description":"总数量","name":"count"},{"dataType":"MyTest","description":"test","name":"test"}],"functions":[{"description":"是否匹配","name":"isSupport","parameters":[{"dataType":"int","description":"描述信息","name":"count"}]}]},"Integer":{"dataType":"Integer","fields":[],"functions":[]},"boolean":{"dataType":"boolean","fields":[],"functions":[]},"Long":{"dataType":"Long","fields":[],"functions":[]},"String":{"dataType":"String","fields":[],"functions":[]},"MyTest":{"dataType":"MyTest","description":"test","fields":[{"dataType":"Long","description":"id","name":"id"},{"dataType":"String","description":"name","name":"name"}],"functions":[]},"int":{"dataType":"int","fields":[],"functions":[]}}}`);

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
        toolbarExtra={<div style={{ marginLeft: 16, color: '#888' }}>这是额外的工具栏内容</div>}
      />
    </div>
  );
};

export default HomePage;
