import { useState } from "react";

/**
 * @param key the key used;
 * @param initialValue the value to use if the value does not already exist in local storage
 */
function UseLocalStorage<T>(key: string, initialValue: T) {
    const [ state, setState ] = useState<T>(getKeyValue());

    function getKeyValue(): T {
        const value = localStorage.getItem(key);

        if (value) {
            return value as T;
        } else {
            localStorage.setItem(key, initialValue as string);
            return value as T;          
        }
    }

    function _setState(value: T) {
        localStorage.setItem(key, value as string);
        setState(value);
    }

    return [ state, _setState ];
}

export default UseLocalStorage;

