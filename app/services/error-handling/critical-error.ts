export class CriticalError extends Error {
    constructor(m: string) {
        super(m);

        // Set the prototype explicitly.
        Object.setPrototypeOf(this, CriticalError.prototype);
    }
}
