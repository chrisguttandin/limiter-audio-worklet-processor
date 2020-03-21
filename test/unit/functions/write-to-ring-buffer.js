import { writeToRingBuffer } from '../../../src/functions/write-to-ring-buffer';

describe('writeToRingBuffer()', () => {

    let source;
    let target;

    beforeEach(() => {
        source = new Float32Array([ 10, 11, 12, 13, 14 ]);
        target = new Float32Array([ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ]);
    });

    describe('with a source that aligns with the beginning of the target', () => {

        it('should write to the target at the given offset', () => {
            writeToRingBuffer(target, source, 0);

            expect(target).to.deep.equal(new Float32Array([ 10, 11, 12, 13, 14, 5, 6, 7, 8, 9 ]));
        });

        it('should return the new offset', () => {
            expect(writeToRingBuffer(target, source, 0)).to.equal(5);
        });

    });

    describe('with a source that aligns with the end of the target', () => {

        it('should write to the target at the given offset', () => {
            writeToRingBuffer(target, source, 5);

            expect(target).to.deep.equal(new Float32Array([ 0, 1, 2, 3, 4, 10, 11, 12, 13, 14 ]));
        });

        it('should return the new offset', () => {
            expect(writeToRingBuffer(target, source, 5)).to.equal(0);
        });

    });

    describe('with a source that overlaps the end of the target', () => {

        it('should write to the target at the given offset', () => {
            writeToRingBuffer(target, source, 7);

            expect(target).to.deep.equal(new Float32Array([ 13, 14, 2, 3, 4, 5, 6, 10, 11, 12 ]));
        });

        it('should return the new offset', () => {
            expect(writeToRingBuffer(target, source, 7)).to.equal(2);
        });

    });

});
