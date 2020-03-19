/*
 * @todo This is currently only a copy all the types needed to define the MessagePort. The type definitions are copied from TypeScripts
 * webworker library. In addition to that this file also contains the definitions of the globally available AudioWorkletProcessor class and
 * the registerProcessor function.
 */

interface Event { // tslint:disable-line:interface-name

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

    deepPath (): EventTarget[];

    initEvent (type: string, bubbles?: boolean, cancelable?: boolean): void;

    preventDefault (): void;

    stopImmediatePropagation (): void;

    stopPropagation (): void;

}

type EventListener = (evt: Event) => void;

interface EventListenerObject { // tslint:disable-line:interface-name

    handleEvent (evt: Event): void;

}

interface EventListenerOptions { // tslint:disable-line:interface-name

    capture?: boolean;

}

interface AddEventListenerOptions extends EventListenerOptions { // tslint:disable-line:interface-name

    once?: boolean;

    passive?: boolean;

}

type EventListenerOrEventListenerObject = EventListener | EventListenerObject;

interface EventTarget { // tslint:disable-line:interface-name

    addEventListener (type: string, listener: EventListenerOrEventListenerObject | null, options?: boolean | AddEventListenerOptions): void;

    dispatchEvent (evt: Event): boolean;

    removeEventListener (
        type: string,
        listener?: EventListenerOrEventListenerObject | null,
        options?: EventListenerOptions | boolean
    ): void;

}

interface MessageEvent extends Event { // tslint:disable-line:interface-name

    readonly data: any;

    readonly origin: string;

    readonly ports: ReadonlyArray<MessagePort>;

    readonly source: object | null;

    initMessageEvent (
        type: string,
        bubbles: boolean,
        cancelable: boolean,
        data: any,
        origin: string,
        lastEventId: string,
        source: object
    ): void;

}

interface MessagePortEventMap { // tslint:disable-line:interface-name

    message: MessageEvent;

}

interface MessagePort extends EventTarget { // tslint:disable-line:interface-name

    onmessage: ((this: MessagePort, ev: MessageEvent) => any) | null;

    addEventListener <K extends keyof MessagePortEventMap> (
        type: K,
        listener: (this: MessagePort, ev: MessagePortEventMap[K]) => any,
        options?: boolean | AddEventListenerOptions
    ): void;
    addEventListener (type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;

    close (): void;

    postMessage (message?: any, transfer?: any[]): void;

    removeEventListener <K extends keyof MessagePortEventMap> (
        type: K,
        listener: (this: MessagePort, ev: MessagePortEventMap[K]) => any,
        options?: boolean | EventListenerOptions
    ): void;
    removeEventListener (type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;

    start (): void;

}

declare var MessagePort: {

    prototype: MessagePort;

    new (): MessagePort;

};

interface AudioWorkletProcessor { // tslint:disable-line:interface-name

    port: MessagePort;

}

interface AudioParamDescriptor { // tslint:disable-line:interface-name

    defaultValue?: number;

    maxValue?: number;

    minValue?: number;

    name: string;

}

interface AudioNodeOptions { // tslint:disable-line:interface-name

    channelCount: number;

    channelCountMode: 'clamped-max' | 'explicit' | 'max';

    channelInterpretation: 'discrete' | 'speakers';

}

interface AudioWorkletNodeOptions extends AudioNodeOptions { // tslint:disable-line:interface-name

    numberOfInputs?: number;

    numberOfOutputs?: number;

    outputChannelCount: number[];

    parameterData: { [ name: string ]: number };

    processorOptions?: any;

}

interface AudioWorkletProcessorConstructor { // tslint:disable-line:interface-name

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

declare function registerProcessor <T extends AudioWorkletProcessorConstructor> (name: string, processorCtor: T): void;
