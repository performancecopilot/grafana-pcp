export default class Transformations {

    constructor() {
        this.transforms = {};
    }

    init(metricInfo) {
        // set up empty transform list
        metricInfo.forEach(m => this.transforms[m.name] = [])

        // for counter objects, unaccumulate them
        metricInfo
            .filter(m => m.sem === 'counter')
            .forEach(m => this.transforms[m.name].push(this.unaccumulate))
    }

    applyTransforms(collected) {
        return collected.map(hmd => {
            const fns = this.transforms[hmd.metric] || []
            let out = hmd.datas
            fns.forEach(fn => out = fn(out))
            return {
                endpoint: hmd.endpoint,
                metric: hmd.metric,
                datas: out,
            }
        })
    }

    unaccumulate(datas) {
        // sort by timestamp, just to be sure
        datas = datas.sort((a, b) => a[0] - b[0])

        const output = []
        // start at 1, not zero, so we will always have a previous
        for(let i = 1; i < datas.length; i++) {
            const previousTs = datas[i - 1][0]
            const previousIvs = datas[i - 1][1]
            const currentTs = datas[i][0]
            const currentIvs = datas[i][1]

            // the accumulated value will include increments from
            // some period of time, which may or may not be exactly
            // matching the poll interval
            // TODO really, the rate should be divided by the interval
            const deltaSec = (currentTs - previousTs) / 1000

            const newIvs = currentIvs.map(iv => {
                const prevIv = previousIvs.find(piv => piv.instance === iv.instance)
                return prevIv
                    ? { ...iv, value: (iv.value - prevIv.value) / deltaSec }
                    : null
            }).filter(iv => !!iv)

            output.push([ datas[i][0], newIvs ])
        }
        return output
    }
}
