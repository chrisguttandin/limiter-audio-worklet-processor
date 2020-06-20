export const readFromRingBuffer = (target: Float32Array, source: Float32Array, offset: number): number => {
    const theoreticalNextOffset = offset + source.length;
    if (theoreticalNextOffset <= target.length) {
        source.set(new Float32Array(target.buffer, target.byteOffset + offset * source.BYTES_PER_ELEMENT, source.length));

        return theoreticalNextOffset === target.length ? 0 : theoreticalNextOffset;
    }

    const nextOffset = theoreticalNextOffset - target.length;
    const lengthOfFirstChunk = target.length - offset;

    source.set(new Float32Array(target.buffer, target.byteOffset + offset * source.BYTES_PER_ELEMENT, lengthOfFirstChunk));
    source.set(new Float32Array(target.buffer, target.byteOffset, nextOffset), lengthOfFirstChunk);

    return nextOffset;
};
