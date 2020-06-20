/*
 * @todo This is currently only a copy all the types needed to define the MessagePort. The type definitions are copied from TypeScripts
 * webworker library. In addition to that this file also contains the definitions of the globally available AudioWorkletProcessor class and
 * the registerProcessor function.
 */

// tslint:disable-next-line:interface-name
interface Event {
    readonly AT_TARGET: number;

    readonly bubbles: boolean;

    readonly BUBBLING_PHASE: number;

    readonly cancelable: boolean;

    cancelBubble: boolean;

    readonly CAPTURING_PHASE: number;

    readonly currentTarget: EventTarget | null;

    readonly defaultPrevented: boolean;

    readonly eventPhase: number;

    readonly isTrusted: boolean;

    readonly NONE: number;

    returnValue: boolean;

    readonly scoped: boolean;

    readonly srcElement: object | null;

    readonly target: EventTarget | null;

    readonly timeStamp: number;

    readonly type: string;

    deepPath(): EventTarget[];

    initEvent(type: string, bubbles?: boolean, cancelable?: boolean): void;

    preventDefault(): void;

    stopImmediatePropagation(): void;

    stopPropagation(): void;
}

type EventListener = (evt: Event) => void;

// tslint:disable-next-line:interface-name
interface EventListenerObject {
    handleEvent(evt: Event): void;
}

// tslint:disable-next-line:interface-name
interface EventListenerOptions {
    capture?: boolean;
}

// tslint:disable-next-line:interface-name
interface AddEventListenerOptions extends EventListenerOptions {
    once?: boolean;

    passive?: boolean;
}

type EventListenerOrEventListenerObject = EventListener | EventListenerObject;

// tslint:disable-next-line:interface-name
interface EventTarget {
    addEventListener(type: string, listener: EventListenerOrEventListenerObject | null, options?: boolean | AddEventListenerOptions): void;

    dispatchEvent(evt: Event): boolean;

    removeEventListener(type: string, listener?: EventListenerOrEventListenerObject | null, options?: EventListenerOptions | boolean): void;
}

// tslint:disable-next-line:interface-name
interface MessageEvent extends Event {
    readonly data: any;

    readonly origin: string;

    readonly ports: ReadonlyArray<MessagePort>;

    readonly source: object | null;

    initMessageEvent(
        type: string,
        bubbles: boolean,
        cancelable: boolean,
        data: any,
        origin: string,
        lastEventId: string,
        source: object
    ): void;
}

// tslint:disable-next-line:interface-name
interface MessagePortEventMap {
    message: MessageEvent;
}

// tslint:disable-next-line:interface-name
interface MessagePort extends EventTarget {
    onmessage: ((this: MessagePort, ev: MessageEvent) => any) | null;

    addEventListener<K extends keyof MessagePortEventMap>(
        type: K,
        listener: (this: MessagePort, ev: MessagePortEventMap[K]) => any,
        options?: boolean | AddEventListenerOptions
    ): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;

    close(): void;

    postMessage(message?: any, transfer?: any[]): void;

    removeEventListener<K extends keyof MessagePortEventMap>(
        type: K,
        listener: (this: MessagePort, ev: MessagePortEventMap[K]) => any,
        options?: boolean | EventListenerOptions
    ): void;
    removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;

    start(): void;
}

declare var MessagePort: {
    prototype: MessagePort;

    new (): MessagePort;
};

// tslint:disable-next-line:interface-name
interface AudioWorkletProcessor {
    port: MessagePort;
}

// tslint:disable-next-line:interface-name
interface AudioParamDescriptor {
    defaultValue?: number;

    maxValue?: number;

    minValue?: number;

    name: string;
}

// tslint:disable-next-line:interface-name
interface AudioNodeOptions {
    channelCount: number;

    channelCountMode: 'clamped-max' | 'explicit' | 'max';

    channelInterpretation: 'discrete' | 'speakers';
}

// tslint:disable-next-line:interface-name
interface AudioWorkletNodeOptions extends AudioNodeOptions {
    numberOfInputs?: number;

    numberOfOutputs?: number;

    outputChannelCount: number[];

    parameterData: { [name: string]: number };

    processorOptions?: any;
}

// tslint:disable-next-line:interface-name
interface AudioWorkletProcessorConstructor {
    parameterDescriptors: AudioParamDescriptor[];

    new (options: AudioWorkletNodeOptions): AudioWorkletProcessor;
}

declare var AudioWorkletProcessor: {
    prototype: AudioWorkletProcessor;

    new (): AudioWorkletProcessor;
};

declare const currentFrame: number;

declare const currentTime: number;

declare const sampleRate: number;

declare function registerProcessor<T extends AudioWorkletProcessorConstructor>(name: string, processorCtor: T): void;
