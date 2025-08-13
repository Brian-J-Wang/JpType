import { Dispatch, SetStateAction } from "react";

type ProxyObject = {
    id: string
}

class StateProxyArray<T extends ProxyObject> extends Array<T> {
    setStates = new Map<string, Dispatch<SetStateAction<T>>>();
    constructor(Arr: T[]) {
        if (Array.isArray(Arr)) {
            const handler: ProxyHandler<T> = {
                set: (target, prop, value) => {
                    target[prop as keyof T] = value;

                    const setState = this.setStates.get(target.id);
                    setState && setState({ ...target });

                    return true;
                }
            }

            const formatted = Arr.map((element) => {
                return new Proxy<T>(element, handler )}
            );
            super(...formatted);
        } else {
            super(Arr);
        }
    }

    register(id: string, state: Dispatch<SetStateAction<T>>) {
        const element = this.find((element) => element.id == id);
        if (element) {
            this.setStates.set(id, state);
            return element;
        }
    }
}

export default StateProxyArray;