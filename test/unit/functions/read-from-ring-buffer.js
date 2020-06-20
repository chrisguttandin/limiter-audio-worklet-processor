import { readFromRingBuffer } from '../../../src/functions/read-from-ring-buffer';

describe('readFromRingBuffer()', () => {
    let source;
    let target;

    beforeEach(() => {
        source = new Float32Array([10, 11, 12, 13, 14]);
        target = new Float32Array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });

    describe('with a source that aligns with the beginning of the target', () => {
        it('should read from the target at the given offset', () => {
            readFromRingBuffer(target, source, 0);

            expect(source).to.deep.equal(new Float32Array([0, 1, 2, 3, 4]));
        });

        it('should return the new offset', () => {
            expect(readFromRingBuffer(target, source, 0)).to.equal(5);
        });
    });

    describe('with a source that aligns with the end of the target', () => {
        it('should read from the target at the given offset', () => {
            readFromRingBuffer(target, source, 5);

            expect(source).to.deep.equal(new Float32Array([5, 6, 7, 8, 9]));
        });

        it('should return the new offset', () => {
            expect(readFromRingBuffer(target, source, 5)).to.equal(0);
        });
    });

    describe('with a source that overlaps the end of the target', () => {
        it('should read from the target at the given offset', () => {
            readFromRingBuffer(target, source, 7);

            expect(source).to.deep.equal(new Float32Array([7, 8, 9, 0, 1]));
        });

        it('should return the new offset', () => {
            expect(readFromRingBuffer(target, source, 7)).to.equal(2);
        });
    });
});
