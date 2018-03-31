const {promisify} = require('util');
const i18n = require("../lib/i18n");
const i18nInit = promisify(i18n.init);
const lessProcessor = require("../lib/less-processor");
const lessProcessorInit = promisify(lessProcessor.init);
const {remove} = require("fs-extra");
const {initSitemap} = require("../lib/sitemap");
const {runServer, generateStatic} = require("../lib/server");
const {runCrowdinSync} = require("../lib/crowdin");
const argv = require("minimist")(process.argv.slice(2));

// Configurations
const {layoutsDir, partialsDir, lessDir, lessTargetDir, pageDir,
  contentDir, localesDir} = require("../config");

function prepareApp(callback)
{
  // Remove static content generation target directory
  remove(contentDir);

  // Initialize sitemap
  initSitemap();

  let i18nWatchDirs = [pageDir, partialsDir, layoutsDir];
  let launchPreparation = [
    i18nInit(localesDir, i18nWatchDirs),
    lessProcessorInit(lessDir, lessTargetDir)
  ];

  Promise.all(launchPreparation).then(() =>
  {
    if (callback)
      callback(null, true);
  });
}

prepareApp(() =>
{
  if (argv.static)
    generateStatic();
  else if (argv.crowdin)
    runCrowdinSync(argv);
  else
    runServer(argv.cache != false);
});
