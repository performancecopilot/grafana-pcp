import ScriptRegistry from "../script_registry";
import * as dateMock from 'jest-date-mock';
import * as Context_ from "../../lib/pmapi";

const Context = Context_.Context;
const ContextMock: { metricMetadatas: jest.Mock, metricMetadata: jest.Mock, fetch: jest.Mock, store: jest.Mock } = (Context_ as any).ContextMock;
jest.mock("../../lib/pmapi");

describe("ScriptRegistry", () => {
    const ctx: { context: any, datastore: any, poller: any, scriptRegistry: ScriptRegistry } = {} as any;

    beforeEach(() => {
        (Context as any).mockClear();
        ContextMock.metricMetadatas.mockClear();
        ContextMock.metricMetadata.mockClear();
        ContextMock.fetch.mockClear();
        ContextMock.store.mockClear();
        dateMock.clear();

        ctx.context = {
            newInstance: () => new Context(() => null, "http://localhost:44322")
        };
        ctx.datastore = {
            queryMetrics: jest.fn()
        };
        ctx.poller = {
            ensurePolling: jest.fn(),
            removeMetricsFromPolling: jest.fn()
        };
        ctx.scriptRegistry = new ScriptRegistry(ctx.context, ctx.poller, ctx.datastore, 10000);
    });

    const registerScript = async () => {
        ContextMock.fetch.mockReturnValueOnce({
            "timestamp": {
                "s": 5,
                "us": 2000
            },
            "values": [{
                "pmid": 633356298,
                "name": "bpftrace.control.register",
                "instances": [{
                    "instance": -1,
                    "value": '{"name": "script1", "vars": ["usecs"], "status": "started", "output": ""}',
                    "instanceName": null
                }]
            }]
        });
        ctx.poller.ensurePolling.mockReturnValue([
            "bpftrace.scripts.script1.status",
            "bpftrace.scripts.script1.exit_code",
            "bpftrace.scripts.script1.output"
        ]);
        ctx.datastore.queryMetrics.mockReturnValueOnce({
            metrics: []
        });

        await ctx.scriptRegistry.ensureActive("kretprobe:vfs_read { @bytes = hist(retval); }");
    };

    it("should register a script only once", async () => {
        await registerScript();

        ctx.datastore.queryMetrics.mockReturnValueOnce({
            metrics: []
        });
        await ctx.scriptRegistry.ensureActive("kretprobe:vfs_read { @bytes = hist(retval); }");

        expect(ContextMock.store).toHaveBeenCalledTimes(1);
    });

    it("should register a failed script only once", async () => {
        ContextMock.fetch.mockReturnValueOnce({
            "timestamp": {
                "s": 5,
                "us": 2000
            },
            "values": [{
                "pmid": 633356298,
                "name": "bpftrace.control.register",
                "instances": [{
                    "instance": -1,
                    "value": '{"name": "", "vars": [], "status": "stopped", "output": "no variable found"}',
                    "instanceName": null
                }]
            }]
        });

        let script = await ctx.scriptRegistry.ensureActive("kretprobe:vfs_read { bytes = hist(retval); }");
        expect(script).toMatchObject({
            "status": "stopped",
            "output": "no variable found"
        });

        script = await ctx.scriptRegistry.ensureActive("kretprobe:vfs_read { bytes = hist(retval); }");
        expect(script).toMatchObject({
            "status": "stopped",
            "output": "no variable found"
        });
        expect(ContextMock.store).toHaveBeenCalledTimes(1);
    });

    it("should handle a failed script, after the script started", async () => {
        await registerScript();

        ctx.datastore.queryMetrics.mockReturnValueOnce({
            metrics: [{
                name: "bpftrace.scripts.script1.status",
                instances: [{
                    name: "",
                    values: [["stopped"]]
                }]
            }, {
                name: "bpftrace.scripts.script1.output",
                instances: [{
                    name: "",
                    values: [["syntax error"]]
                }]
            }, {
                name: "bpftrace.scripts.script1.exit_code",
                instances: [{
                    name: "",
                    values: [[1]]
                }]
            }]
        });

        const script = await ctx.scriptRegistry.ensureActive("kretprobe:vfs_read { @bytes = hist(retval); }");
        expect(script).toMatchObject({
            "status": "stopped",
            "output": "syntax error",
            "exit_code": 1
        });
        expect(ContextMock.store).toHaveBeenCalledTimes(1);
        expect(ctx.poller.removeMetricsFromPolling).toHaveBeenCalledWith(["bpftrace.scripts.script1.status",
            "bpftrace.scripts.script1.exit_code", "bpftrace.scripts.script1.output"]);
    });

    it("should restart a stopped script", async () => {
        await registerScript();

        // sync state: set status to stopped, exit_code to 0
        ctx.datastore.queryMetrics.mockReturnValueOnce({
            metrics: [{
                name: "bpftrace.scripts.script1.status",
                instances: [{
                    name: "",
                    values: [["stopped"]]
                }]
            }, {
                name: "bpftrace.scripts.script1.output",
                instances: [{
                    name: "",
                    values: [[""]]
                }]
            }, {
                name: "bpftrace.scripts.script1.exit_code",
                instances: [{
                    name: "",
                    values: [[0]]
                }]
            }]
        });

        // ensureActive should call register again, to restart the script
        ContextMock.fetch.mockReturnValueOnce({
            "timestamp": {
                "s": 5,
                "us": 2000
            },
            "values": [{
                "pmid": 633356298,
                "name": "bpftrace.control.register",
                "instances": [{
                    "instance": -1,
                    "value": '{"name": "script1", "vars": ["usecs"], "status": "started", "output": ""}',
                    "instanceName": null
                }]
            }]
        });
        ctx.datastore.queryMetrics.mockReturnValueOnce({
            metrics: []
        });

        const script = await ctx.scriptRegistry.ensureActive("kretprobe:vfs_read { @bytes = hist(retval); }");
        expect(script).toMatchObject({
            "status": "started"
        });
        expect(ContextMock.store).toHaveBeenCalledTimes(2);
    });

    it("should re-register a script which doesn't exist on the PMDA anymore", async () => {
        await registerScript();
        expect(ContextMock.fetch).toHaveBeenCalledTimes(1);

        // metric doesn't exist anymore on the server
        ctx.poller.ensurePolling.mockReturnValue([]);


        // will register again
        ContextMock.fetch.mockReturnValueOnce({
            "timestamp": {
                "s": 5,
                "us": 2000
            },
            "values": [{
                "pmid": 633356298,
                "name": "bpftrace.control.register",
                "instances": [{
                    "instance": -1,
                    "value": '{"name": "script1", "vars": ["usecs"], "status": "started", "output": ""}',
                    "instanceName": null
                }]
            }]
        });

        const script = await ctx.scriptRegistry.ensureActive("kretprobe:vfs_read { @bytes = hist(retval); }");
        expect(script).toMatchObject({
            "status": "started"
        });
        expect(ContextMock.store).toHaveBeenCalledTimes(2);
    });

    it("should remove scripts which weren't requested in a specified time period", async () => {
        await registerScript();
        await registerScript();
        expect(ContextMock.store).toHaveBeenCalledTimes(1);

        dateMock.advanceBy(15000);
        ctx.scriptRegistry.cleanupExpiredScripts();

        await registerScript();
        expect(ContextMock.store).toHaveBeenCalledTimes(2);
    });
});
