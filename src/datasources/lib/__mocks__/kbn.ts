function interval_to_ms(interval) {
    if (interval.substring(interval.length - 1) === 's') {
        return interval.substring(0, interval.length - 1) * 1000;
    }
    else if (interval.substring(interval.length - 1) === 'm') {
        return interval.substring(0, interval.length - 1) * 1000 * 60;
    }
    return undefined;
}

export default { interval_to_ms }
