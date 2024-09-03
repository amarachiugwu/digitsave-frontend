export const getEventSignature = (eventName, abi) => {
    const eventAbi = abi.find((entry) => entry.name === eventName);
    const types = eventAbi.inputs.map((input) => input.type);
    return `${eventName}(${types.join(',')})`;
}