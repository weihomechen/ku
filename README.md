# iku

## 说明

一个酷酷的命令行工具

## 功能特性

- 生成页面或组件
```sh
# ku g <type> <name>

# type: page | comp

ku g page Page1
ku g comp Comp1
```

## 安装

```sh
npm i @ifun/ku -g
```

## 目录
- `bin`作为工具的命令行入口，只负责识别命令、整合参数给具体的执行者
- `lib`聚焦于单一功能点，完成具体的功能
- `config`存储配置
- `sh`放置执行脚本
