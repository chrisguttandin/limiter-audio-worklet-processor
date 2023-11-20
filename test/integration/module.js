import { AudioBuffer, AudioBufferSourceNode, AudioWorkletNode, ConstantSourceNode, OfflineAudioContext } from 'standardized-audio-context';

describe('module', () => {
    let offlineAudioContext;

    beforeEach(async () => {
        offlineAudioContext = new OfflineAudioContext({ length: 128, sampleRate: 44100 });

        await offlineAudioContext.audioWorklet.addModule('base/src/module.js');
    });

    describe('with a constant signal', () => {
        let audioWorkletNode;
        let channelData;
        let constantSourceNode;

        beforeEach(() => {
            audioWorkletNode = new AudioWorkletNode(offlineAudioContext, 'limiter-audio-worklet-processor');
            constantSourceNode = new ConstantSourceNode(offlineAudioContext, { offset: 1 });

            constantSourceNode.connect(audioWorkletNode).connect(offlineAudioContext.destination);
            constantSourceNode.start();

            channelData = new Float32Array(128);
        });

        it('should limit the signal', async () => {
            const renderedBuffer = await offlineAudioContext.startRendering();

            renderedBuffer.copyFromChannel(channelData, 0);

            for (const sample of channelData) {
                expect(sample).to.equal(Math.fround(10 ** -0.1));
            }
        });
    });

    describe('with a spiky signal', () => {
        let audioBufferSourceNode;
        let audioWorkletNode;
        let channelData;

        beforeEach(() => {
            const audioBuffer = new AudioBuffer({ length: 128, sampleRate: 44100 });

            audioBuffer.copyToChannel(new Float32Array([1, 0, 10, 0, 100]), 0, 0);

            audioBufferSourceNode = new AudioBufferSourceNode(offlineAudioContext, { buffer: audioBuffer });
            audioWorkletNode = new AudioWorkletNode(offlineAudioContext, 'limiter-audio-worklet-processor');

            audioBufferSourceNode.connect(audioWorkletNode).connect(offlineAudioContext.destination);
            audioBufferSourceNode.start();

            channelData = new Float32Array(5);
        });

        it('should limit the signal', async () => {
            const renderedBuffer = await offlineAudioContext.startRendering();

            renderedBuffer.copyFromChannel(channelData, 0);

            expect(channelData).to.deep.equal(new Float32Array([10 ** -0.1, 0, 10 ** -0.1, 0, 10 ** -0.1]));
        });
    });
});
