import { useEffect } from "react";

export const useStyle = (stylesheet: string, ref: any, observed?: any) => {
    const observedList = observed ? [observed] :[]
    useEffect(() => {
        const spanRefCurrent = ref!.current;
        if(spanRefCurrent) {
            const styleFragment = document.createElement('template');
            styleFragment.innerHTML = stylesheet;
            (spanRefCurrent  as HTMLElement).appendChild(styleFragment.content);
        }
    }, [observedList]);
}

