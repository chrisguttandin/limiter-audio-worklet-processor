export const writeToRingBuffer = (target: Float32Array, source: Float32Array, offset: number): number => {
    const theoreticalNextOffset = offset + source.length;
    if (theoreticalNextOffset <= target.length) {
        target.set(source, offset);

        return theoreticalNextOffset === target.length ? 0 : theoreticalNextOffset;
    }

    const nextOffset = theoreticalNextOffset - target.length;
    const lengthOfFirstChunk = target.length - offset;

    target.set(new Float32Array(source.buffer, source.byteOffset, lengthOfFirstChunk), offset);
    target.set(new Float32Array(source.buffer, source.byteOffset + lengthOfFirstChunk * source.BYTES_PER_ELEMENT, nextOffset));

    return nextOffset;
};
