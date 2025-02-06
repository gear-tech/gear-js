function convertEventParams(event) {
    const result = {};
    for (let index = 0; index < event.fragment.inputs.length; index++) {
        const input = event.fragment.inputs[index];
        result[input.name] = event.args[index];
    }
    return result;
}

export { convertEventParams };
