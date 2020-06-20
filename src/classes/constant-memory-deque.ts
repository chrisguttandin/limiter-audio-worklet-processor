export class ConstantMemoryDeque {
    private _firstIndex: number;

    private _isEmpty: boolean;

    private _lastIndex: number;

    constructor(private _buffer: Uint16Array) {
        this._firstIndex = 0;
        this._isEmpty = true;
        this._lastIndex = 0;

        if (this._buffer.length === 0) {
            throw new Error('The given buffer is too small.');
        }
    }

    get size(): number {
        return this._isEmpty
            ? 0
            : this._lastIndex < this._firstIndex
            ? this._buffer.length - this._firstIndex + this._lastIndex + 1
            : this._lastIndex - this._firstIndex + 1;
    }

    public first(): number {
        this._throwIfEmpty();

        return this._buffer[this._firstIndex];
    }

    public last(): number {
        this._throwIfEmpty();

        return this._buffer[this._lastIndex];
    }

    public pop(): void {
        this._throwIfEmpty();

        if (this._firstIndex === this._lastIndex) {
            this._isEmpty = true;
        } else {
            this._lastIndex = this._decrementIndex(this._lastIndex);
        }
    }

    public shift(): void {
        this._throwIfEmpty();

        if (this._firstIndex === this._lastIndex) {
            this._isEmpty = true;
        } else {
            this._firstIndex = this._incrementIndex(this._firstIndex);
        }
    }

    public unshift(value: number): void {
        if (this._isEmpty) {
            this._buffer[this._firstIndex] = value;
            this._isEmpty = false;
        } else {
            const nextIndex = this._decrementIndex(this._firstIndex);

            if (nextIndex === this._lastIndex) {
                throw new Error('Deque is full.');
            }

            this._buffer[nextIndex] = value;
            this._firstIndex = nextIndex;
        }
    }

    private _decrementIndex(index: number): number {
        return index === 0 ? this._buffer.length - 1 : index - 1;
    }

    private _incrementIndex(index: number): number {
        return (index + 1) % this._buffer.length;
    }

    private _throwIfEmpty(): void {
        if (this._isEmpty) {
            throw new Error('Deque is empty.');
        }
    }
}
