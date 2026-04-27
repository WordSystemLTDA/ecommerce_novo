import { useSyncExternalStore } from "react";

let now = Date.now();
let intervalId: ReturnType<typeof setInterval> | null = null;
const listeners = new Set<() => void>();

function emit() {
    now = Date.now();
    listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
    listeners.add(listener);

    if (intervalId === null) {
        intervalId = setInterval(emit, 1000);
    }

    return () => {
        listeners.delete(listener);

        if (listeners.size === 0 && intervalId !== null) {
            clearInterval(intervalId);
            intervalId = null;
        }
    };
}

function getSnapshot() {
    return now;
}

function getServerSnapshot() {
    return Date.now();
}

export function useSecondTicker() {
    return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
