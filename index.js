import express from "express"
import ejs from "ejs"
import fs from "fs"
import { prefixes, suffixes } from "./utils/socialLinks.js"

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

app.get("/", (req, res) => {
    // get settings on every request in development
    if (isDev) {
      settings = getSettings()
    }
    for (const key of Object.keys(settings.content.socials)) {
        let link = settings.content.socials[key]
        if (link.length === 0 || (!(key in prefixes) && !(key in suffixes))) {
            delete settings.content.socials[key]
            continue
        }
        if (!link.startsWith("http")) {
            if (key in prefixes) {
                link = "https://" + prefixes[key] + link;
            }
            else if (key in suffixes) {
                link = "https://" + link + suffixes[key];
            }
            settings.content.socials[key] = link;
        }
    }
    res.render("index.ejs", { ...settings })
})

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`)
})