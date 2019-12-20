function interval_to_ms(interval: string) {
    if (interval.substring(interval.length - 1) === 's') {
        return parseInt(interval.substring(0, interval.length - 1), 10) * 1000;
    }
    else if (interval.substring(interval.length - 1) === 'm') {
        return parseInt(interval.substring(0, interval.length - 1), 10) * 1000 * 60;
    }
    return undefined;
}

export default { interval_to_ms };
