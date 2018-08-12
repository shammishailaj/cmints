// Directories
const srcPath = "./src";
const contentDir = "./content";
const themeDir = `${srcPath}/theme`;
const publicDir = `${srcPath}/public`;
let multiLang = true;

const dirs = 
{
  srcPath, contentDir, publicDir, themeDir,
  pageDir: `${srcPath}/pages`,
  layoutsDir: `${themeDir}/layouts`,
  lessDir: `${themeDir}/less`,
  lessTargetDir: `${publicDir}/css`,
  browserifyDir: `${themeDir}/js`,
  browserifyTargetDir: `${publicDir}/js`,
  localesDir: `${srcPath}/locales`
};

// Default port
let port = {
  https: 4000,
  http: 3000
};
let hostname = "127.0.0.1";

// i18n configuration
i18nOptions = {
  defaultLocale: "en",
  prefix: "{",
  postfix: "}",
  // crowdinProject
  crowdinId: null
};

// Supported Page extensions
const pageExtestions = [".md", ".ejs", ".html"];

// Default data passed to the template
let templateData =
{
  site: {
    title: "CMintS",
    description: "CMS created with the internationalization in mind"
  },
  page: {},
  i18n: {}
};

// Markdown configuration
const {getLanguage, highlight} = require("highlight.js");
// See https://markdown-it.github.io/markdown-it/#MarkdownIt.new
let markdownOptions =
{
  html:         true,
  xhtmlOut:     false,
  breaks:       false,
  langPrefix:   "language-",
  linkify:      false,
  typographer:  false,
  quotes: '“”‘’',
  highlight(str, lang)
  {
    let result = (lang && getLanguage(lang)) ? highlight(lang, str).value : "";
    // Replace i18n braces to use inside of code blocks
    return result.replace(/{/g, "&#123;").replace(/}/g, "&#125;");
  }
};


// Loading user configurations
try {
  const userConfig = require(`${srcPath}/config`);
  if (userConfig.templateData)
    templateData = Object.assign(templateData, userConfig.templateData);
  if (userConfig.markdownOptions)
    markdownOptions = Object.assign(markdownOptions, userConfig.markdownOptions);
  if (userConfig.i18nOptions)
    i18nOptions = Object.assign(i18nOptions, userConfig.i18nOptions);
  if (userConfig.port)
    port = userConfig.port;
  if (userConfig.hostname)
    hostname = userConfig.hostname;
}
catch (e) {
  if (e.code == "MODULE_NOT_FOUND")
    console.log("Info: No custom config setup, see: https://cmints.io/documentation/getting-started/configuration");
  else
    console.error(e)
}

// When localesDir doesn't exist make a single language website
if (!require("fs").existsSync(dirs.localesDir))
  multiLang = false;

module.exports = {dirs, templateData, markdownOptions, pageExtestions, port,
  hostname, i18nOptions, multiLang};
