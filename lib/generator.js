#!/usr/bin/env node

const path = require('path')
const fs = require('fs')
const inquirer = require('inquirer')

const {
  error,
  info,
  success,
  shell,
  warn,
} = require('./util')

const generator = async options => {
  const {
    type,
    name,
    dir,
    globalConfig,
    scheme,
  } = options

  info('\n🚥 生成类型为:', `${type}`)

  info('\n🚥 生成方案为:', `${scheme || 'default'}`)

  info('\n🚥 生成路径为:', `${dir}`)

  info('\n🚗  🚕  🚙  🚌  🚓  🚑  🚔  🚀  ----- 开始发车 -----  🚗  🚕  🚙  🚌  🚓  🚑  🚔  🚀\n')

  const { template } = globalConfig

  const presetTemplatePath = template[type]
  const presetName = presetTemplatePath.split('/').pop()

  if (!presetTemplatePath) {
    error('\nERROR: 生成类型未配置\n')
    return
  }

  const index = dir.indexOf('/src/')
  const templatePath = `${dir.slice(0, index)}${presetTemplatePath}`
  console.log('templatePath', templatePath)

  const targetPath = `${dir}/${name}`

  const copy = async () => {
    try {
      await shell(`cp -r ${templatePath} ${dir}`)

      success('复制成功~ 🍻\n')

      await shell(`rm -rf ${targetPath}`)

      await shell(`mv ${presetName} ${name}`)

      success('改名成功~ 🍻 🍻\n')

      const targetFiles = []

      const fileDisplay = filePath => {
        // 根据文件路径读取文件，返回文件列表
        const files = fs.readdirSync(filePath)

        // 遍历读取到的文件列表
        files.forEach(filename => {
          // 获取当前文件的绝对路径
          const filedir = path.join(filePath, filename)
          // 根据文件路径获取文件信息，返回一个fs.Stats对象
          const stats = fs.statSync(filedir)
          const isFile = stats.isFile()
          const isDir = stats.isDirectory()
          if (isDir) {
            fileDisplay(filedir)
          }

          if (isFile) {
            targetFiles.push(filedir)
          }
        })
      }

      fileDisplay(targetPath)

      console.log('targetFiles:\n', targetFiles)

      info('\n开始替换~ 🚗 🚗 🚗\n')
      targetFiles.forEach(file => {
        const originCode = fs.readFileSync(file, 'utf-8')

        const reg = new RegExp(presetName, 'g')
        // 文件内容里面的模板变量替换
        if (reg.test(originCode)) {
          const newCode = originCode.replace(reg, name)
          fs.writeFileSync(file, newCode)
        }
      })

      success('替换成功~ 🍻 🍻 🍻\n')

      success('🍺 🍺 🍺  ~~~~~生成成功~~~~~  🍺 🍺 🍺\n')
    } catch (e) {
      error('\nERROR:', e)
    }
  }

  if (fs.existsSync(`${dir}/${name}`)) {
    const promptList = [{
      type: "confirm",
      message: "该目录下已存在同名文件，是否覆盖",
      name: "isCover",
    }]

    const { isCover } = await inquirer.prompt(promptList)

    if (isCover) {
      copy()
    } else {
      warn('\n❕❕❕存在同名文件，已退出\n')
    }
  } else {
    copy()
  }

}

module.exports = (options) => generator(options)
