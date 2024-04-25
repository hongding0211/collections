type F = (...args: any) => any;
declare function macroTask(fn: F, timeOut?: number, ...fnArgs: any): {
    next: (fn: F, timeOut?: number, ...fnArgs: any) => any;
    stop: () => void;
};
export { macroTask };
