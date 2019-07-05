export function cleanTitusOvfsLatencyCollected(c, containerName) {
    const TO_FILTER = [
        'titusovfs.read.latency',
        'titusovfs.write.latency',
        'titusovfs.open.latency',
        'titusovfs.fsync.latency',
        // do not do anything with
        // titusovfs.read.bytes_per_sec
        // titusovfs.write.bytes_per_sec
    ]

    if (!TO_FILTER.includes(c.metric) || !containerName) {
        return c
    }

    const ivInstanceNameIsString = (iv) => (typeof (iv.instanceName)) === 'string'
    const tsivHasData = (tsiv) => tsiv[1].length > 0

    const ivContainerNameMatches = (iv) => 
        iv.instanceName.split(':').length === 2
        && iv.instanceName.split(':')[0].includes(containerName)

    const ivExtractDuration = (iv) => ({
        ...iv,
        instanceName: iv.instanceName.split(':')[1].split('-')[1]
    })

    return {
        endpoint: c.endpoint,
        metric: c.metric,
        datas: c.datas
            .map(tsiv => ([ tsiv[0], tsiv[1].filter(ivInstanceNameIsString) ]))
            .filter(tsivHasData)
            .map(tsiv => ([ tsiv[0], tsiv[1].filter(ivContainerNameMatches) ]))
            .filter(tsivHasData)
            .map(tsiv => ([ tsiv[0], tsiv[1].map(ivExtractDuration) ]))
    }
}

function removeTitusOvfsBytesCollected(c, containerName) {
    const TO_FILTER = [
        'titusovfs.read.bytes_per_sec',
        'titusovfs.write.bytes_per_sec',
    ]

    if (!TO_FILTER.includes(c.metric) || !containerName) {
        return c
    }

    const ivContainerNameMatches = (iv) => containerName
        && (typeof iv.instanceName === 'string') // has been indom'd
        && iv.instanceName.includes(containerName)

    return {
        endpoint: c.endpoint,
        metric: c.metric,
        datas: c.datas
            .map(tsiv => ([ tsiv[0], tsiv[1].filter(ivContainerNameMatches) ]))
            .filter(tsiv => tsiv[1].length > 0)
    }
}

function removeTitusTcCollected(c, containerName) {
    const TO_FILTER = [
        'titustc.network.out.requeues_packets',
        'titustc.network.out.overlimits_packets',
        'titustc.network.out.dropped_packets',
        'titustc.network.out.packets',
        'titustc.network.out.bytes',
        'titustc.network.out.ceiling',
        'titustc.network.out.rate',
        'titustc.network.in.requeues_packets',
        'titustc.network.in.overlimits_packets',
        'titustc.network.in.dropped_packets',
        'titustc.network.in.packets',
        'titustc.network.in.bytes',
        'titustc.network.in.ceiling',
        'titustc.network.in.rate',
    ]

    if (!TO_FILTER.includes(c.metric)) {
        return c
    }

    const ivContainerNameMatches = (iv) => containerName
        && (typeof iv.instanceName === 'string') // has been indom'd
        && iv.instanceName.includes(containerName)

    return {
        endpoint: c.endpoint,
        metric: c.metric,
        datas: c.datas
            .map(tsiv => ([ tsiv[0], tsiv[1].filter(ivContainerNameMatches) ]))
            .filter(tsiv => tsiv[1].length > 0)
    }
}

export function transformAfterCollected(collected, containerName) {
    return collected
        .map(c => removeTitusTcCollected(c, containerName))
        .map(c => removeTitusOvfsBytesCollected(c, containerName))
        .map(c => cleanTitusOvfsLatencyCollected(c, containerName))
        .filter(c => c.datas.length > 0)
}
