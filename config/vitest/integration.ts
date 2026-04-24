import { env } from 'node:process';
import { webdriverio } from '@vitest/browser-webdriverio';
import { fs } from 'memfs';
import { defineConfig } from 'vitest/config';
import { webpack } from 'webpack';

export default defineConfig({
    plugins: [
        {
            name: 'bundle',
            transform: (code: string, id: string) => {
                if (id.endsWith('/src/module.ts')) {
                    const compiler = webpack({
                        entry: { module: id },
                        mode: 'development',
                        module: {
                            rules: [
                                {
                                    test: /\.ts?$/,
                                    use: {
                                        loader: 'ts-loader',
                                        options: { compilerOptions: { declaration: false, declarationMap: false } }
                                    }
                                }
                            ]
                        },
                        output: { filename: 'module.js', path: '/' },
                        resolve: { extensions: ['.js', '.ts'], fallback: { util: false } }
                    });
                    // @ts-expect-error
                    compiler.outputFileSystem = fs;

                    return new Promise((resolve, reject) => {
                        compiler.run((err, stats) => {
                            if (err !== null) {
                                reject(err);
                            } else if (stats?.hasErrors() || stats?.hasWarnings()) {
                                reject(new Error(stats.toString({ errorDetails: true, warnings: true })));
                            } else {
                                resolve(<string>fs.readFileSync('/module.js', { encoding: 'utf8' }));
                            }
                        });
                    });
                }

                return code;
            }
        }
    ],
    test: {
        bail: 1,
        browser: {
            enabled: true,
            instances: env.CI
                ? env.TARGET === 'chrome'
                    ? [{ browser: 'chrome', name: 'Chrome', provider: webdriverio() }]
                    : env.TARGET === 'firefox'
                      ? [{ browser: 'firefox', name: 'Firefox', provider: webdriverio() }]
                      : []
                : [
                      { browser: 'chrome', headless: true, name: 'Chrome', provider: webdriverio() },
                      {
                          browser: 'chrome',
                          headless: true,
                          name: 'Chrome Canary',
                          provider: webdriverio({
                              capabilities: {
                                  'goog:chromeOptions': {
                                      binary: '/Applications/Google\ Chrome\ Canary.app/Contents/MacOS/Google\ Chrome\ Canary'
                                  }
                              }
                          })
                      },
                      {
                          browser: 'firefox',
                          headless: true,
                          name: 'Firefox Developer',
                          provider: webdriverio({
                              capabilities: {
                                  'moz:firefoxOptions': { binary: '/Applications/Firefox\ Developer\ Edition.app/Contents/MacOS/firefox' }
                              }
                          })
                      },
                      { browser: 'firefox', headless: true, name: 'Firefox', provider: webdriverio() },
                      { browser: 'safari', headless: false, name: 'Safari', provider: webdriverio() }
                  ]
        },
        dir: 'test/integration/',
        include: ['**/*.js'],
        watch: false
    }
});
