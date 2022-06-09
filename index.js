import express from "express"
import ejs from "ejs"
import fs from "fs"
import { prefixes, suffixes } from "./utils/socialLinks.js"
import Client from "@replit/database"
import { nanoid } from "nanoid"

const client = new Client()

const isDev = process.env.NODE_ENV === "development"
let settings

const getSettings = () => {
  let s;
  try {
    const settingsFile = fs.readFileSync("settings.json", "utf-8")
    s = JSON.parse(settingsFile)
  } catch (e) {
    console.log(e)
    throw new Error("Error reading settings.json file and parsing as JSON")
  }
  for (const key of Object.keys(s.content.socials)) {
    let link = s.content.socials[key]
    if (link.length === 0 || (!(key in prefixes) && !(key in suffixes))) {
      delete s.content.socials[key]
      continue
    }

    if (!link.startsWith("http") && key !== "email") {
      if (key in prefixes) {
        link = "https://" + prefixes[key] + link;
      }
      else if (key in suffixes) {
        link = "https://" + link + suffixes[key];
      }
      s.content.socials[key] = link;
    }
    if (key === "email" && !link.startsWith("mailto:")) {
      link = "mailto:" + link;
      s.content.socials[key] = link;
    }
  }
  return s;
}

// get settings once when in production
if (!isDev) {
  settings = getSettings()
}

const PORT = 3000

const app = express()

app.set("view engine", "ejs")

app.use(express.static("static"))
app.use(express.json())

app.get("/", async (req, res) => {
  const userId = req.get('X-Replit-User-Id')
  const userName = req.get('X-Replit-User-Name')
  console.log(userId, userName)
  // get settings on every request in development
  if (isDev) {
    settings = getSettings()
  }
  let commentsList = [];
  if (settings?.features?.guestbook) {
    // get guestbook data
    const commentIds = (await client.get("guestbook-list")) ?? []
    // console.log(commentIds)
    for (const id of commentIds) {
      commentsList.push(client.get(id))
    }
    commentsList = await Promise.all(commentsList)
    commentsList = commentsList.map((c) => {
      const date = new Date(c.time)
      const datePart = date.toLocaleDateString("en-US", { dateStyle: "medium" })
      const timePart = date.toLocaleTimeString("en-US", { timeStyle: "short" })
      c.time = `${datePart} at ${timePart}`
      return c;
    })
    // console.log(commentsList)
  }
  res.render("index.ejs", {
    settings,
    guestBook: commentsList,
    auth: {
      userId,
      userName
    }
  })
})

app.post("/logout", (req, res) => {
  res.clearCookie("REPL_AUTH", {
    domain: req.headers.host,
    path: "/"
  })
  res.end()
})

app.post("/submit", async (req, res) => {
  console.log(req.body)
  const userId = req.get("X-Replit-User-Id")
  const userName = req.get("X-Replit-User-Name")
  if (!userId || !userName) {
    res.status(401).end()
    return
  }
  if (!req.body.comment) {
    res.status(400).send("No comment provided")
  }
  const commentsList = (await client.get("guestbook-list")) ?? []
  const id = nanoid()
  commentsList.push(id)
  await Promise.all([
    client.set("guestbook-list", commentsList),
    client.set(id, {
        userId,
        userName,
        comment: req.body.comment,
        time: Date.now()
      })
  ])
  res.end()
})

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`)
})