import { synchronized } from "../utils";

class SynchronizedClass {
    log: string[] = [];

    @synchronized
    synchronizedFn() {
        this.log.push("start");
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                this.log.push("done");
                resolve();
            }, 200);
        });
    }

    unsynchronizedFn() {
        this.log.push("start");
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                this.log.push("done");
                resolve();
            }, 200);
        });
    }
}

describe("Utils", () => {

    it("should synchronize functions", async () => {
        let x = new SynchronizedClass();
        x.unsynchronizedFn();
        x.unsynchronizedFn();
        await new Promise((resolve, reject) => setInterval(resolve, 500)); // wait 0.5s
        expect(x.log).toStrictEqual(["start", "start", "done", "done"]);

        x.log = [];
        x.synchronizedFn();
        x.synchronizedFn();
        await new Promise((resolve, reject) => setInterval(resolve, 500)); // wait 0.5s
        expect(x.log).toStrictEqual(["start", "done"]);

        x.log = [];
        x.synchronizedFn();
        x.synchronizedFn();
        await new Promise((resolve, reject) => setInterval(resolve, 500)); // wait 0.5s
        expect(x.log).toStrictEqual(["start", "done"]);
    });

});
