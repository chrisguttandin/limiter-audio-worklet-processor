import { AudioWorkletNode, ConstantSourceNode, OfflineAudioContext } from 'standardized-audio-context';

describe('module', () => {

    let audioWorkletNode;
    let channelData;
    let constantSourceNode;
    let offlineAudioContext;

    after(function (done) {
        this.timeout(5000);

        // @todo This is an optimistic fix to prevent the famous 'Some of your tests did a full page reload!' error.
        setTimeout(done, 1000);
    });

    beforeEach(async () => {
        offlineAudioContext = new OfflineAudioContext({ length: 128, sampleRate: 44100 });

        await offlineAudioContext.audioWorklet.addModule('base/src/module.js');

        audioWorkletNode = new AudioWorkletNode(offlineAudioContext, 'limiter-audio-worklet-processor');
        constantSourceNode = new ConstantSourceNode(offlineAudioContext, { offset: 1 });

        constantSourceNode
            .connect(audioWorkletNode)
            .connect(offlineAudioContext.destination);
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
