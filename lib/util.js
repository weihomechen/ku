const fs = require('fs-extra')
const path = require('path')
const semver = require('semver')
const chalk = require('chalk')
const inquirer = require('inquirer')
const { exec } = require('child_process')

const consoleLogConfigPath = path.resolve(__dirname, '../config/console.json')
const consoleLog = require(consoleLogConfigPath)

// 打印信息的配置
const { log } = console
const getLogConfig = () => {
  const logger = {}
  const { color } = consoleLog

  Object.keys(color).map(key => {
    logger[key] = (msg, val = '') => log(chalk.hex(color[key])(msg, val))
  })

  return logger
}

const { error, info, success, warn } = getLogConfig()

const uniqueDirname = (dir, prefix) => {
  let rnd = `${(prefix || '')}${parseInt(Math.random() * 10000).toString()}`

  try {
    const files = fs.readdirSync(dir)

    while (files.indexOf(rnd) !== -1) {
      rnd = `${(prefix || '')}${parseInt(Math.random() * 10000).toString()}`
    }
  } catch (e) {
    console.error(e)
  }

  return path.join(dir, rnd)
}

const camelize = (str) => {
  return str.replace(/-(\w)/g, (_, c) => c ? c.toUpperCase() : '')
}

// commander passes the Command object itself as options,
// extract only actual options into a fresh object.
const cleanArgs = (cmd) => {
  const args = {}

  cmd.options.forEach(o => {
    const key = camelize(o.long.replace(/^--/, ''))
    // if an option is not present and Command has a method with the same name
    // it should not be copied
    if (typeof cmd[key] !== 'function' && typeof cmd[key] !== 'undefined') {
      args[key] = cmd[key]
    }
  })

  return args
}

const checkNodeVersion = (wanted, id) => {
  if (!semver.satisfies(process.version, wanted)) {
    console.error(
      `You are using Node ${process.version}, but this version of ${id} requires Node ${wanted}.
      \nPlease upgrade your Node version.\n`
    )

    process.exit(1)
  }
}

const shell = (order, option = {}) => {
  return new Promise((resolve, reject) => {
    exec(order, option, (err, stdout) => {
      if (err) {
        reject(err)
      } else {
        resolve(stdout)
      }
    })
  })
}

module.exports = {
  cleanArgs,
  checkNodeVersion,
  uniqueDirname,
  error,
  info,
  success,
  warn,
  shell,
}
