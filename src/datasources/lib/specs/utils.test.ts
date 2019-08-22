import { synchronized } from "../utils";

class SynchronizedClass {
    log: string[] = [];

    constructor(id: number) {
    }

    @synchronized
    synchronizedFn(msg: string) {
        this.log.push(`start ${msg}`);
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                this.log.push(`done ${msg}`);
                resolve();
            }, 200);
        });
    }
}

describe("Utils", () => {

    it("should synchronize functions", async () => {
        const x = new SynchronizedClass(0);
        x.synchronizedFn("1");
        x.synchronizedFn("2");
        await new Promise((resolve, reject) => setInterval(resolve, 500)); // wait 0.5s
        expect(x.log).toStrictEqual(["start 1", "done 1"]);
    });

    it("should handle multiple instances of synchronized functions", async () => {
        const x = new SynchronizedClass(0);
        const y = new SynchronizedClass(1);

        x.synchronizedFn("1");
        x.synchronizedFn("2");
        y.synchronizedFn("3");
        y.synchronizedFn("4");
        await new Promise((resolve, reject) => setInterval(resolve, 500)); // wait 0.5s
        expect(x.log).toStrictEqual(["start 1", "done 1"]);
        expect(y.log).toStrictEqual(["start 3", "done 3"]);

        x.synchronizedFn("5");
        x.synchronizedFn("6");
        await new Promise((resolve, reject) => setInterval(resolve, 500)); // wait 0.5s
        expect(x.log).toStrictEqual(["start 1", "done 1", "start 5", "done 5"]);
        expect(y.log).toStrictEqual(["start 3", "done 3"]);
    });

});
