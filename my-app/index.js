/**
 * Cloudflare 2020 General Engineering Assignment
 */

const linkedInLink =  { name: "LinkedIn", url: "https://www.linkedin.com/in/yu-ting-tsao-a68262a2/"}
const appsLink =  { name: "App Store", url: "https://apps.apple.com/us/developer/yu-ting-tsao/id1328112477"}
const githubLink =  { name: "Github", url: "https://github.com/vin20777/cloudflare-2020-general-engineering-assignment"}
const links = [linkedInLink, appsLink, githubLink]
const linksJSONResponse = links.map((link) => JSON.stringify(link))

const beginPage = "https://static-links-page.signalnerve.workers.dev"

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

/**
 * Respond with hello worker text
 * @param {Request} request
 */
async function handleRequest(request) {

  const url = new URL(request.url)
  var urlPath = url.pathname

  if (urlPath == "/links") {
    return new Response(linksJSONResponse, {
      headers: { 'content-type': 'application/json;charset=UTF-8' }
    })
  }

  const myTitle = "Yu-Ting Tsao"
  // https://tailwindcss.com/docs/customizing-colors
  const niceTheme = "bg-teal-700"

  const starter = await fetch(beginPage, { 
    headers: { 'content-type': 'text/html;charset=UTF-8' } 
  })
  return new HTMLRewriter()
  // Rewrite elements in profile and those under it.
  .on("title", new TitleTransformer(myTitle))
  .on("body", new BodyClassTransformer(niceTheme))
  .on("div#profile, div#profile > *", new ProfileTransformer())
  .on("div#links", new LinksTransformer(links))
  .on("div#social", new SocialTransformer())
  .transform(starter)
}

class LinksTransformer {
  constructor(links) {
    this.links = links
  }

  async element(element) {
    var content = this.links.map((link) => `<a href="${link.url}">${link.name}</a>`).join("\n")
    element.setInnerContent(content, { html: true })
  }
}

class ProfileTransformer {
  
  name = "Yu-Ting Tsao"
  profileURL = "https://avatars1.githubusercontent.com/u/31400661?s=400&u=a8fc69c9df97c7362cb130d153b4960b71445779&v=4"
  
  async element(element) {
    // https://developers.cloudflare.com/workers/runtime-apis/html-rewriter
    const tag = element["tagName"]
    // remove the display: none
    if (tag == "div") {
      element.setAttribute("style", "")
    } else if (tag == "img") {
      element.setAttribute("src", this.profileURL)
    } else if (tag == "h1") {
      element.setInnerContent(this.name)
    }
  }
}

// Extra credit: Provide social links
class SocialTransformer {

  mediumSource =  { url: "https://medium.com/@vin20777", svg: "https://simpleicons.org/icons/medium.svg"}
  portfolioSource =  { url: "https://vin20777.wixsite.com/helloworld", svg: "https://simpleicons.org/icons/wix.svg"}
  sources = [this.mediumSource, this.portfolioSource]
  
  async element(element) {
    element.setAttribute("style", "")
    var content = this.sources.map((source) => `<a href="${source.url}"><image src="${source.svg}"/></a>`).join("\n")
    element.setInnerContent(content, { html: true })
  }
}

// Extra credit: Change title
class TitleTransformer {
  constructor(title) {
    this.title = title
  }

  async element(element) {
    element.setInnerContent(this.title)
  }
}

// Extra credit: Change the background color
class BodyClassTransformer {
  constructor(theme) {
    this.theme = theme
  }

  async element(element) {
    element.setAttribute("class", this.theme)
  }
}
