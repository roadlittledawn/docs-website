const fs = require('fs');
const path = require('path');

const { fetchPaginatedGHResults } = require('./utils/github-api-helpers');
const checkArgs = require('./utils/check-args');
const { prop } = require('../utils/functional');
const { LOCALE_IDS } = require('./utils/constants');

const ADDITIONAL_LOCALES = Object.keys(LOCALE_IDS);

const doI18nFilesExist = (fileName, locales) => {
  const i18nPrefix = path.join(process.cwd(), 'src/i18n/content');
  const baseFileName = fileName.replace('src/content/', '');

  return locales
    .map((locale) => {
      const filePath = path.join(i18nPrefix, locale, baseFileName);
      const fileExists = fs.existsSync(filePath);
      return fileExists ? filePath : null;
    })
    .filter(Boolean);
};

/**
 * @param {string} url The API url that is used to fetch files.
 */
const checkOutdatedTranslations = async (url) => {
  const files = await fetchPaginatedGHResults(url, process.env.GITHUB_TOKEN);
  const mdxFiles = files
    ? files.filter((file) => path.extname(file.filename) === '.mdx')
    : [];

  const removedMdxFileNames = mdxFiles
    .filter((f) => f.status === 'removed')
    .map(prop('filename'));

  const renamedMdxFileNames = mdxFiles
    .filter((f) => f.status === 'renamed')
    .map(prop('previous_filename'));

  const removedFiles = removedMdxFileNames.flatMap((name) =>
    doI18nFilesExist(name, ADDITIONAL_LOCALES)
  );

  const renamedFiles = renamedMdxFileNames.flatMap((name) =>
    doI18nFilesExist(name, ADDITIONAL_LOCALES)
  );

  const orphanedI18nFiles = [...removedFiles, ...renamedFiles];

  if (orphanedI18nFiles.length > 0) {
    orphanedI18nFiles.forEach((f) =>
      console.log(
        `ACTION NEEDED: Unpaired translation found -> ${f.replace(
          `${process.cwd()}/`,
          ''
        )}`
      )
    );
    throw new Error(
      'Files without matching english counterparts were found, see logs for filenames'
    );
  }
};

/** Entrypoint. */
const main = async () => {
  try {
    checkArgs(3);
    const url = process.argv[2];

    await checkOutdatedTranslations(url);
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

if (require.main === module) {
  main();
}

module.exports = { main, checkOutdatedTranslations };
