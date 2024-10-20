import { currentTime, currentDate } from './test/utilities/helpers.timeGenerators.js';
import path from 'path';
import fs from 'fs'
import environments from "./environments.js";
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

let appBaseURL;
let screenshotsDir;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.env.USE_LOCAL) { appBaseURL = environments.loc, screenshotsDir = 'Screenshots_local' }
else if (process.env.USE_DEV) { appBaseURL = environments.dev, screenshotsDir = 'Screenshots_dev' }
else if (process.env.USE_PROD) { appBaseURL = environments.prod, screenshotsDir = 'Screenshots_prod' }
else { console.log('Wrong environment variable. \n Please use one of set USE_LOCAL=1 | set USE_DEV=1 | set USE_PROD=1' | process.exit()); }

let timeout = process.env.DEBUG
    ? 99999999
    : 50000

const deleteOldScreenshots = (directory, ageInMs) => {
    const now = new Date().getTime();

    if (fs.existsSync(directory)) {
        const files = fs.readdirSync(directory);

        files.forEach(file => {
            const filePath = path.join(directory, file);
            const fileStats = fs.statSync(filePath);
            const fileAge = now - new Date(fileStats.mtime).getTime();

            if (fileAge > ageInMs) {
                fs.unlinkSync(filePath);
            }
        });
    }
};

const deleteScreenshotsOlderThan7Days = (directory) => {
    const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;
    deleteOldScreenshots(directory, sevenDaysInMs);
};

const deleteScreenshotsOlderThan5Minutes = (directory) => {
    const fiveMinutesInMs = 5 * 60 * 1000;
    deleteOldScreenshots(directory, fiveMinutesInMs);
};

export const config = {

    // ====================
    // Runner Configuration
    // ====================

    runner: 'local',

    // ==================
    // Specify Test Files
    // ==================

    specs: [
        './test/specs/*.js'
    ],

    suites:
    {
        e2e: [
            'test/specs/negativeLoginTest.js',
            'test/specs/positiveLoginTest.js',
            'test/specs/positiveNewUserTest.js',
        ],
        new: [
            'test/specs/positiveNewUserTest.js',
        ]
    },
    exclude: [
        // 'path/to/excluded/files'
    ],

    // ============
    // Capabilities
    // ===========

    maxInstances: 1,
    capabilities: [{
        maxInstances: 1,
        browserName: 'chrome',
        'goog:chromeOptions': {
            args: ["--start-maximized", "--force-device-scale-factor=0.8", "--disable-gpu"]
        },
        acceptInsecureCerts: true
    }],


    // ===================
    // Test Configurations
    // ===================

    // Level of logging verbosity: trace | debug | info | warn | error | silent
    logLevel: 'error',
    bail: 1,
    baseUrl: appBaseURL,

    // Default timeout for all waitFor* commands.
    waitforTimeout: 30000,

    // Default timeout in milliseconds for request
    // if browser driver or grid doesn't send response
    connectionRetryTimeout: 150000,

    // Default request retries count
    connectionRetryCount: 3,
    services: ['chromedriver'],
    framework: 'mocha',


    // The number of times to retry the entire specfile when it fails as a whole
    // specFileRetries: 1,
    // Delay in seconds between the spec file retry attempts
    // specFileRetriesDelay: 0,
    // Whether or not retried spec files should be retried immediately or deferred to the end of the queue
    // specFileRetriesDeferred: false,
    // Test reporter for stdout.
    // The only one supported by default is 'dot'
    // see also: https://webdriver.io/docs/dot-reporter
    reporters: [
        ['spec',
            {
                addConsoleLogs: true,
                onlyFailures: false,
                symbols: {
                    passed: '[PASS]',
                    FAILED: '[FAIL]',
                    skipped: '[SKIPPED]'
                },
            },
        ],
        ['junit', {
            outputDir: 'junit-results',
            suiteNameFormat: /[^a-zA-Z0-9@]+/,
            outputFileFormat: function (options) { // optional
                return `results-${options.cid}.xml`
            },
            errorOptions: {
                error: 'message',
                failure: 'message',
                stacktrace: 'stack'
            }
        }]
    ],
    mochaOpts: {
        ui: 'bdd',
        timeout: timeout
    },

    //===================
    // Hooks
    //===================


    afterTest: async function (test, context, { error, passed }) {
        const failedScreenshotDir = path.join(__dirname, `./error_${screenshotsDir}`);
        const successScreenshotDir = path.join(__dirname, `./success_${screenshotsDir}`);

        if (!fs.existsSync(failedScreenshotDir)) {
            fs.mkdirSync(failedScreenshotDir, { recursive: true });
        }
        if (!fs.existsSync(successScreenshotDir)) {
            fs.mkdirSync(successScreenshotDir, { recursive: true });
        }

        const sanitizeString = (str) => {
            return str.replace(/[^a-zA-Z0-9 ]/g, '').replace(/\s+/g, '_');
        };

        const sanitizedTestTitle = sanitizeString(test.title);
        const sanitizedSuiteTitle = sanitizeString(test.parent || 'suite');

        const fileName = `Suite_${sanitizedSuiteTitle}__TC_${sanitizedTestTitle}__${currentDate()}_${currentTime()}.png`;

        if (error) {
            const failedFilePath = path.join(failedScreenshotDir, fileName);
            try {
                await browser.saveScreenshot(failedFilePath);
            } catch (e) {
                console.error('Error saving failed screenshot:', e);
            }
        }

        if (passed) {
            const successFilePath = path.join(successScreenshotDir, fileName);
            try {
                await browser.saveScreenshot(successFilePath);
            } catch (e) {
                console.error('Error saving success screenshot:', e);
            }
        }

        deleteScreenshotsOlderThan7Days(failedScreenshotDir);
        deleteScreenshotsOlderThan7Days(successScreenshotDir);
    },


    beforeTest: async function () {
        if (!browser.sessionId) {
            throw new Error("No valid session. Session ID is missing.");
        }
        await browser.url(appBaseURL);
    },

    beforeEach: (async function () {
        console.log(`Starting test: ${this.currentTest.title}`);
    }),

    afterEach: (async function () {
        if (this.currentTest.state === 'failed') {
            console.log(`[FAIL] ${this.currentTest.title}`);
        } else {
            console.log(`[PASS] ${this.currentTest.title}`);
        }
    }),


    // afterTest: async function () {
    //     if (browser.sessionId) {
    //         console.log('Session is still valid');
    //     } else {
    //         console.error('Session has expired');
    //     }
    // },


}
