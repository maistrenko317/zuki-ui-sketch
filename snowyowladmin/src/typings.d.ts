declare var module: NodeModule;
interface NodeModule {
    id: string;
}
interface Element {
    blur(): void;
}
declare module 'uuid/v4' {
    function f(): string;

    namespace f {
    }
    export = f;
}

declare module 'vanilla-text-mask/dist/vanillaTextMask.js';
