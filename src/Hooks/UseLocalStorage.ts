import { useEffect, useState } from "react";
import { generateUniqueHash } from "../Utilities/GenerateUniqueHash";

const eventListeners = new Map<string, {
    id: string,
    fn: (newValue: any) => void
}[]>();

function addEvent(key: string, fn: (newValue: any) => void) {
    const listener = {
        id: generateUniqueHash(),
        fn: fn
    }

    if (!eventListeners.has(key)) {
        eventListeners.set(key, []);
    }

    eventListeners.get(key)?.push(listener);

    return listener.id;
}

function removeEvent(key: string, id: string) {

}

function updateKey(key: string, newValue: any): void {
    let listeners = eventListeners.get(key);

    if (!listeners) {
        return;
    } else {
        listeners.forEach((listener) => {
            listener.fn(newValue);
        });
    }
}

/**
 * @param key the key used;
 * @param defaultValue the value to use if the value does not already exist in local storage
 */
function UseLocalStorage<T>(key: string, defaultValue?: T) {
    const [ state, setState ] = useState<T>(getKeyValue());

    //mounts and unmounts an event listener for when the local storage value changes
    useEffect(() => {
        if (!eventListeners.get(key)) {
            eventListeners.set(key, []);
        }

        const listener = eventListeners.get(key);

        listener?.push()

        return () => {

        }
    }, [])

    function getKeyValue(): T {
        const value = localStorage.getItem(key);

        if (value) {
            return JSON.parse(value) as T;
        } else {
            localStorage.setItem(key, JSON.stringify(defaultValue as string));
            return value as T;          
        }
    }

    function _setState(value: T) {
        localStorage.setItem(key, value as string);
        setState(value);
    }

    return [ state, _setState ] as const;
}

export default UseLocalStorage;

