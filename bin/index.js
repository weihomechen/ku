#!/usr/bin/env node

/**
 * 命令行 ku [action]
 * 工具入口，主要是识别命令、收集、校验、整合配置给具体的执行者
 * @param action: g | version
 * ku g 生成页面或组件
 * ku version: 查看版本号
 */

const path = require('path')
const program = require('commander')
const chalk = require('chalk')
const {
  checkNodeVersion,
  cleanArgs,
  info,
} = require('../lib/util')

// 检查node版本
const requiredVersion = require('../package.json').engines.node
checkNodeVersion(requiredVersion, '@ifun/ku')

// 获取全局配置
const globalConfigPath = path.resolve(__dirname, '../config/global.json')

delete require.cache[require.resolve(globalConfigPath)]

const globalConfig = require(globalConfigPath)

// 查看版本号
program
  .version(require('../package').version)
  .usage('<action> [options]')

// 生成页面或组件
program
  .command('g <type> <name>')
  .option('-s, --scheme [scheme]', '自定义模式')
  .action(async (type, name, cmd) => {
    const tempOptions = cleanArgs(cmd)
    const dir = process.cwd()

    const options = {
      type,
      name,
      dir,
      globalConfig,
      ...tempOptions,
    }

    require('../lib/generator')(options)
  })

// add some useful info on help
program.on('--help', () => {
  info(`\n Run ${chalk.cyan('ku <command> --help')} for detailed usage of given command.\n`)
})

program.commands.forEach(c => c.on('--help', () => console.log()))

program.parse(process.argv)

process.on('SIGINT', () => {
  process.exit(0)
})
