const { env } = require('process');
const { DefinePlugin } = require('webpack');
const webpack = require('webpack');
const MemoryFileSystem = require('memory-fs');

module.exports = (config) => {
    config.set({
        basePath: '../../',

        browserDisconnectTimeout: 100000,

        browserNoActivityTimeout: 100000,

        client: {
            mocha: {
                bail: true,
                timeout: 20000
            }
        },

        concurrency: 1,

        files: [
            {
                included: false,
                pattern: 'src/**',
                served: true,
                watched: true
            },
            'test/integration/**/*.js'
        ],

        frameworks: ['mocha', 'sinon-chai', 'webpack'],

        middleware: ['webpack'],

        plugins: [
            {
                'middleware:webpack': [
                    'factory',
                    function () {
                        return (req, res, next) => {
                            if (req.url.startsWith('/base/') && req.url.endsWith('.js')) {
                                const parts = req.url.split(/\//);
                                const name = parts.pop().slice(0, -3);
                                const path = parts
                                    .slice(2)
                                    .map((part) => `/${part}`)
                                    .join('');
                                const memoryFileSystem = new MemoryFileSystem();
                                const compiler = webpack({
                                    entry: {
                                        [name]: `.${path}/${name}`
                                    },
                                    mode: 'development',
                                    module: {
                                        rules: [
                                            {
                                                test: /\.ts?$/,
                                                use: {
                                                    loader: 'ts-loader',
                                                    options: {
                                                        compilerOptions: {
                                                            declaration: false,
                                                            declarationMap: false
                                                        }
                                                    }
                                                }
                                            }
                                        ]
                                    },
                                    output: {
                                        filename: '[name].js',
                                        path: '/'
                                    },
                                    resolve: {
                                        extensions: ['.js', '.ts'],
                                        fallback: { util: false }
                                    }
                                });

                                compiler.outputFileSystem = memoryFileSystem;
                                compiler.run((err, stats) => {
                                    if (err !== null) {
                                        next(err);
                                    } else if (stats.hasErrors() || stats.hasWarnings()) {
                                        next(new Error(stats.toString({ errorDetails: true, warnings: true })));
                                    } else {
                                        res.setHeader('content-type', 'application/javascript');

                                        memoryFileSystem.createReadStream(`/${name}.js`).pipe(res);
                                    }
                                });
                            } else {
                                next();
                            }
                        };
                    }
                ]
            },
            'karma-*'
        ],

        preprocessors: {
            'src/**/!(*.d).ts': 'webpack',
            'test/integration/**/*.js': 'webpack'
        },

        reporters: ['dots'],

        webpack: {
            mode: 'development',
            module: {
                rules: [
                    {
                        test: /\.ts?$/,
                        use: {
                            loader: 'ts-loader',
                            options: {
                                compilerOptions: {
                                    declaration: false,
                                    declarationMap: false
                                }
                            }
                        }
                    }
                ]
            },
            plugins: [
                new DefinePlugin({
                    'process.env': {
                        CI: JSON.stringify(env.CI)
                    }
                })
            ],
            resolve: {
                extensions: ['.js', '.ts'],
                fallback: { util: false }
            }
        },

        webpackMiddleware: {
            noInfo: true
        }
    });

    if (env.CI) {
        config.set({
            browsers:
                env.TARGET === 'chrome'
                    ? ['ChromeSauceLabs']
                    : env.TARGET === 'firefox'
                    ? ['FirefoxSauceLabs']
                    : env.TARGET === 'safari'
                    ? ['SafariSauceLabs']
                    : ['ChromeSauceLabs', 'FirefoxSauceLabs', 'SafariSauceLabs'],

            captureTimeout: 300000,

            customLaunchers: {
                ChromeSauceLabs: {
                    base: 'SauceLabs',
                    browserName: 'chrome',
                    captureTimeout: 300,
                    platform: 'macOS 12'
                },
                FirefoxSauceLabs: {
                    base: 'SauceLabs',
                    browserName: 'firefox',
                    captureTimeout: 300,
                    geckodriverVersion: '0.30.0',
                    platform: 'macOS 12'
                },
                SafariSauceLabs: {
                    base: 'SauceLabs',
                    browserName: 'safari',
                    captureTimeout: 300,
                    platform: 'macOS 12'
                }
            },

            sauceLabs: {
                recordVideo: false
            }
        });
    } else {
        config.set({
            browsers: ['ChromeCanaryHeadless', 'ChromeHeadless', 'FirefoxDeveloperHeadless', 'FirefoxHeadless', 'Safari']
        });
    }
};
