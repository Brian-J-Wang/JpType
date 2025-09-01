import { generateUniqueHash } from "@src/utilities/GenerateUniqueHash";
import { useRef } from "react";

const UseEventEmitter = <T extends (...args: any[]) => void>() => {
    const subscribers = useRef<Map<string, T>>(new Map());

    const subscribe = (fn: T) => {
        const hash = generateUniqueHash();
        subscribers.current.set(hash, fn);
        return hash;
    }

    const unsubscribe = (id: string) => {
        subscribers.current.delete(id);
    }

    const emit = (args?: Parameters<T>) => {
        subscribers.current.forEach((value) => {
            value(args);
        })
    }

    return {
        subscribe,
        unsubscribe,
        emit
    }
}

export default UseEventEmitter;