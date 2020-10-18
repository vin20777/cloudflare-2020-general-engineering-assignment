addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

const linkedInLink =  { name: "LinkedIn", url: "https://www.linkedin.com/in/yu-ting-tsao-a68262a2/"}
const appsLink =  { name: "App Store", url: "https://apps.apple.com/us/developer/yu-ting-tsao/id1328112477"}
const githubLink =  { name: "Github", url: "https://github.com/vin20777/cloudflare-2020-general-engineering-assignment"}
const links = [linkedInLink, appsLink, githubLink]
const linksJSONResponse = links.map((link) => JSON.stringify(link))

const beginPage = "https://static-links-page.signalnerve.workers.dev"

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

  const starter = await fetch(beginPage, { headers: { 'content-type': 'text/html;charset=UTF-8' } })
  return new HTMLRewriter()
  .on("div#links", new LinksTransformer(links))
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