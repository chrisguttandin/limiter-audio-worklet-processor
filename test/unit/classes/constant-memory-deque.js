import { ConstantMemoryDeque } from '../../../src/classes/constant-memory-deque';

describe('ConstantMemoryDeque', () => {
    describe('constructor()', () => {
        it('should throw an error', () => {
            expect(() => new ConstantMemoryDeque(new Uint16Array(0))).to.throw(Error, 'The given buffer is too small.');
        });
    });

    describe('size', () => {
        let constantMemoryDeque;

        beforeEach(() => {
            constantMemoryDeque = new ConstantMemoryDeque(new Uint16Array(3));
        });

        it('should be zero', () => {
            expect(constantMemoryDeque.size).to.equal(0);
        });

        it('should be equal to the number of currently stored values', () => {
            constantMemoryDeque.unshift(0);
            constantMemoryDeque.unshift(0);

            expect(constantMemoryDeque.size).to.equal(2);

            constantMemoryDeque.shift();

            expect(constantMemoryDeque.size).to.equal(1);

            constantMemoryDeque.unshift(0);
            constantMemoryDeque.unshift(0);

            expect(constantMemoryDeque.size).to.equal(3);

            constantMemoryDeque.pop();
            constantMemoryDeque.pop();
            constantMemoryDeque.pop();

            expect(constantMemoryDeque.size).to.equal(0);

            constantMemoryDeque.unshift(0);
            constantMemoryDeque.unshift(0);
            constantMemoryDeque.unshift(0);

            expect(constantMemoryDeque.size).to.equal(3);
        });
    });

    describe('first()', () => {
        let constantMemoryDeque;

        beforeEach(() => {
            constantMemoryDeque = new ConstantMemoryDeque(new Uint16Array(3));
        });

        it('should throw an error', () => {
            expect(() => constantMemoryDeque.first()).to.throw(Error, 'Deque is empty.');
        });

        it('should return the first value', () => {
            constantMemoryDeque.unshift(0);
            constantMemoryDeque.unshift(1);

            expect(constantMemoryDeque.first()).to.equal(1);

            constantMemoryDeque.shift();

            expect(constantMemoryDeque.first()).to.equal(0);

            constantMemoryDeque.unshift(2);
            constantMemoryDeque.unshift(3);

            expect(constantMemoryDeque.first()).to.equal(3);

            constantMemoryDeque.pop();
            constantMemoryDeque.pop();

            expect(constantMemoryDeque.first()).to.equal(3);

            constantMemoryDeque.unshift(4);
            constantMemoryDeque.unshift(5);

            expect(constantMemoryDeque.first()).to.equal(5);
        });
    });

    describe('last()', () => {
        let constantMemoryDeque;

        beforeEach(() => {
            constantMemoryDeque = new ConstantMemoryDeque(new Uint16Array(3));
        });

        it('should throw an error', () => {
            expect(() => constantMemoryDeque.last()).to.throw(Error, 'Deque is empty.');
        });

        it('should return the last value', () => {
            constantMemoryDeque.unshift(0);
            constantMemoryDeque.unshift(1);

            expect(constantMemoryDeque.last()).to.equal(0);

            constantMemoryDeque.shift();

            expect(constantMemoryDeque.last()).to.equal(0);

            constantMemoryDeque.shift();

            constantMemoryDeque.unshift(2);
            constantMemoryDeque.unshift(3);

            expect(constantMemoryDeque.last()).to.equal(2);

            constantMemoryDeque.pop();

            expect(constantMemoryDeque.last()).to.equal(3);

            constantMemoryDeque.unshift(4);
            constantMemoryDeque.unshift(5);

            expect(constantMemoryDeque.last()).to.equal(3);
        });
    });

    describe('pop()', () => {
        let constantMemoryDeque;

        beforeEach(() => {
            constantMemoryDeque = new ConstantMemoryDeque(new Uint16Array(3));
        });

        it('should throw an error', () => {
            expect(() => constantMemoryDeque.pop()).to.throw(Error, 'Deque is empty.');
        });

        it('should remove the last value', () => {
            constantMemoryDeque.unshift(0);
            constantMemoryDeque.unshift(1);

            expect(constantMemoryDeque.last()).to.equal(0);

            constantMemoryDeque.pop();

            expect(constantMemoryDeque.last()).to.equal(1);
        });
    });

    describe('shift()', () => {
        let constantMemoryDeque;

        beforeEach(() => {
            constantMemoryDeque = new ConstantMemoryDeque(new Uint16Array(3));
        });

        it('should throw an error', () => {
            expect(() => constantMemoryDeque.shift()).to.throw(Error, 'Deque is empty.');
        });

        it('should remove the first value', () => {
            constantMemoryDeque.unshift(0);
            constantMemoryDeque.unshift(1);

            expect(constantMemoryDeque.first()).to.equal(1);

            constantMemoryDeque.shift();

            expect(constantMemoryDeque.first()).to.equal(0);
        });
    });

    describe('unshift()', () => {
        let constantMemoryDeque;

        beforeEach(() => {
            constantMemoryDeque = new ConstantMemoryDeque(new Uint16Array(3));
        });

        it('should throw an error', () => {
            constantMemoryDeque.unshift(0);
            constantMemoryDeque.unshift(1);
            constantMemoryDeque.unshift(2);

            expect(() => constantMemoryDeque.unshift(3)).to.throw(Error, 'Deque is full.');
        });

        it('should prepend a value', () => {
            constantMemoryDeque.unshift(0);

            expect(constantMemoryDeque.first()).to.equal(0);

            constantMemoryDeque.unshift(1);

            expect(constantMemoryDeque.first()).to.equal(1);
        });
    });
});
