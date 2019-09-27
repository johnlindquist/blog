#!/usr/bin/env node

const shell = require("shelljs")
const slugify = require("slugify")
const fs = require("fs-extra")
const { format } = require("date-fns")
const formatTitle = require("ap-style-title-case")
const cac = require("cac")
const cli = cac()
const detectPort = require("detect-port")

const blogPath = `/Users/johnlindquist/projects/johnlindquist.com`

cli
  .command("[...title]")
  .option("--demo <demo>", "Codesandbox slug")
  .action(([text], { demo }) => {
    const slug = slugify(text, {
      replacement: "-", // replace spaces with replacement
      remove: /[*+~.()'"!:@,]/g, // regex to remove characters
      lower: true // result in lower case
    })

    const title = formatTitle(text)

    const demoBlock = demo && `<Codesandbox slug="${demo}"/>`

    const content = `---
slug: ${slug}
title: ${title}
date: ${format(new Date(), "YYYY-MM-DD HH:MM")}
published: false
---

${demoBlock}
`

    const destination = demo ? "demo" : "blog"

    shell.cd(blogPath)

    const filePath = `${blogPath}/content/${destination}/${slug}.md`

    ;(async () => {
      try {
        await fs.writeFile(filePath, content, { flag: "wx" })
        console.log("Succesfully written " + filePath)

        shell.exec(`code . -g ${filePath}`)
        if ((await detectPort(8000)) === 8000) {
          shell.exec(`open http://localhost:8000/${slug}`)
          shell.exec(`yarn dev`)
        }
      } catch (error) {
        console.log(error)
        console.log("file " + filePath + " already exists")
      }
    })()
  })

cli.parse()
