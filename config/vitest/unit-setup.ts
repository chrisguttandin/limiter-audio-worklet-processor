(<typeof globalThis & { AudioWorkletProcessor: unknown }>globalThis).AudioWorkletProcessor = class {};
(<typeof globalThis & { currentFrame: unknown }>globalThis).currentFrame = 0;
(<typeof globalThis & { currentTime: unknown }>globalThis).currentTime = 0;
// eslint-disable-next-line @typescript-eslint/no-empty-function, no-empty-function
(<typeof globalThis & { registerProcessor: unknown }>globalThis).registerProcessor = () => {};
(<typeof globalThis & { sampleRate: unknown }>globalThis).sampleRate = 44100;
