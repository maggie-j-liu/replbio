# replbio

Replbio is a template for making a bio page easily.
Add your name, avatar, and all your links to the page for easy sharing!

## Instructions

Creating your own replbio is easy -- just fork the [replbio repl](https://replit.com/@MaggieLiu1/replbio).
All you need to do is edit the `settings.json` file.
This file is written in [JSON format](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/JSON).
Use the `settings.json` file for simple customizations, but more advanced customizations are possible by editing the code directly.

Let's take a look at the settings in `settings.json`:

### Name, Avatar, and Bio
These are all available to edit under the `content` key.
```json
"content": {
  "name": "Your name here",
  "avatar": "The url to your avatar",
  "bio": "Add a short description of yourself here"
}
```

### Socials
These are displayed as social icons right under your name and bio.
There are predefined social icons for a lot of social sites, but feel free to comment on the [repl](https://replit.com/@MaggieLiu1/replbio) to request other social sites.
Edit these under the `content.socials` key; the key is the social site name and the value is your username on the site.
```json 
"content": {
  "socials": {
    "replit": "Your replit username",
    "discord": "Your discord ID"
  }
}
```
Note: for Discord, the value should be your Discord user ID, not your username.

### Links
The links are added as an array in the `content.links` key.
They are displayed under the social links.
Each link is an object with a `url` and `text`; the `url` is what the link links to, while the `text` is displayed on the page.
```json
"content": {
  "links": [
    {
      "url": "Where the link should go",
      "text": "Displayed text"
    }
  ]
}
```

### Styles
Customize colors and the font under the `styles` key.
The exact settings are described below.
```json
"styles": {
  "primary": "Primary color used for the avatar border and the hover effect for socials.",
  "gradient": {
    "from": "First gradient color for link hover",
    "to": "Second gradient color for link hover"
  },
  "background": "Background color",
  "text": "Text color",
  "icons": "Icons color",
  "links": "Links color",
  "font": "Font used on the page"
}
```

### Features

Replbio also offers a variety of features to easily customize your bio page.
They are described below:

#### Guestbook

To add a guestbook (a section where visitors can leave you messages) to your replbio, enable the guestbook feature:
```json
"features": {
  "guestbook": true
}
```

Visitors will be able to log in with Replit to view the messages, as well as leave their own message. 
If you configure an admin (yourself), you'll be able to delete any messages. 
To configure the admin, add your Replit username to the `guestbook.adminUsername` section of the settings.
```json
"guestbook": {
  "adminUsername": "Your Replit username"
}
```