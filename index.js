#!/usr/bin/env node

const shell = require("shelljs")
const slugify = require("slugify")
const fs = require("fs-extra")
const { format } = require("date-fns")
const formatTitle = require("ap-style-title-case")
const cac = require("cac")
const cli = cac()

const blogPath = `/Users/johnlindquist/projects/johnlindquist.com`

cli.command("[...title]").action(([text]) => {
  const slug = slugify(text, {
    replacement: "-", // replace spaces with replacement
    remove: /[*+~.()'"!:@,]/g, // regex to remove characters
    lower: true // result in lower case
  })

  const title = formatTitle(text)

  const content = `---
slug: ${slug}
title: ${title}
date: ${format(new Date(), "YYYY-MM-DD HH:MM")}
published: false
---

# ${title}

`

  const filePath = `${blogPath}/content/blog/${slug}.md`

  fs.writeFile(filePath, content, { flag: "wx" }, function(err) {
    if (err) {
      console.log("file " + filePath + " already exists")
    } else {
      console.log("Succesfully written " + filePath)
    }
  })

  shell.exec(`code ${blogPath} -g ${filePath}`)
})

cli.parse()
