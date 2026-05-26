# Script Engine

一个基于 React 的规则引擎框架,基于groovy语言实现。


## Script元数据结构

```
{"binds":[{"dataType":"GroovyBindObject","name":"$request"}],"requests":[{"dataType":"MyScriptRequest","description":"我的测试对象","name":"request"}],"returnType":"Integer","types":{"MyScriptRequest":{"dataType":"MyScriptRequest","description":"我的测试对象","fields":[{"dataType":"int","description":"总数量","name":"count"},{"dataType":"MyTest","description":"test","name":"test"}],"functions":[{"description":"是否匹配","name":"isSupport","parameters":[{"dataType":"int","description":"描述信息","name":"count"}]}]},"Integer":{"dataType":"Integer","fields":[],"functions":[]},"boolean":{"dataType":"boolean","fields":[],"functions":[]},"Long":{"dataType":"Long","fields":[],"functions":[]},"String":{"dataType":"String","fields":[],"functions":[]},"MyTest":{"dataType":"MyTest","description":"test","fields":[{"dataType":"Long","description":"id","name":"id"},{"dataType":"String","description":"name","name":"name"}],"functions":[]},"int":{"dataType":"int","fields":[],"functions":[]}}}
```

## 实例使用代码

```
def run(request){
    println($request.count);
    return request.count;
}

```




