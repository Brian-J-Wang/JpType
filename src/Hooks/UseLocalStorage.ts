import { useEffect, useState } from "react";
import { generateUniqueHash } from "../utilities/GenerateUniqueHash";

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
    eventListeners.get(key)?.filter((event) => {
        return event.id != id;
    })
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

export type localStorageType<T> = {
    key: string,
    initialValue: T
}

const createLocalStorage = <T>(key: string, initialValue: T): localStorageType<T> => {
    //checks to see if the value already exists in the local storage, creates the value with the initial value if it doesn'
    if (!localStorage.getItem(key)) {
        localStorage.setItem(key, JSON.stringify(initialValue));
    }

    const localValue = JSON.parse(localStorage.getItem(key) ?? "");

    //removes properties not in initial value and adds properties not found in initialValue
    if (typeof localValue === "object") {
        console.log(initialValue);
        
        Object.keys(initialValue as Object).forEach((key) => {
            console.log(key);
            if (!localValue[key]) {
                localValue[key] = (initialValue as Record<string, any>)[key];
            }
        })

        Object.keys(localValue).forEach((key) => {
            if (!Object.keys(initialValue as Record<string, unknown>).includes(key)) {
                delete localValue[key];
            }
        })
        localStorage.setItem(key, JSON.stringify(localValue));
    }

    return {
        key: key,
        initialValue: initialValue
    }
}

/**
 * @param key the key used;
 * @param defaultValue the value to use if the value does not already exist in local storage
 */
function useLocalStorage<T>(context: localStorageType<T>) {
    const [ state, setState ] = useState<T>(getKeyValue());

    //mounts and unmounts an event listener for when the local storage value changes
    useEffect(() => {
        if (!eventListeners.has(context.key)) {
            eventListeners.set(context.key, []);
        }

        const listener = eventListeners.get(context.key)!;
        const id = addEvent(context.key, (newValue) => {
            setState(newValue);
        });

        return () => {
            removeEvent(context.key, id);
        }
    }, [])

    function getKeyValue(): T {
        const value = localStorage.getItem(context.key);

        if (value) {
            return JSON.parse(value) as T;
        } else {
            localStorage.setItem(context.key, JSON.stringify(context.initialValue as string));
            return value as T;          
        }
    }

    function _setState(value: T) {
        localStorage.setItem(context.key, JSON.stringify(value as string));
        setState(value);
        updateKey(context.key, value);
    }

    return [ state, _setState ] as const;
}

export { useLocalStorage, createLocalStorage,};

