const { chromium } = require('@playwright/test');

module.exports = {
  defaults: {
    standard: 'WCAG2AA',
    timeout: 30000,
    chromeLaunchConfig: { executablePath: chromium.executablePath() },
    runners: ['axe', 'htmlcs'],
  },
  urls: ['http://localhost:4173/'],
};
