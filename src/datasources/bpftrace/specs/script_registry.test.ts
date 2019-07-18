import Poller from "../../lib/poller";
import DataStore from "../../lib/datastore";
import ScriptRegistry, { BPFtraceScript } from "../script_registry";
import * as dateMock from 'jest-date-mock';
import * as Context_ from "../../lib/context";

const Context = Context_.default;
const ContextMock: { fetchMetricMetadata: jest.Mock, findMetricMetadata: jest.Mock, fetch: jest.Mock, store: jest.Mock } = Context_ as any;
jest.mock("../../lib/context");

describe("ScriptRegistry", () => {
    let ctx: { context: any, datastore: DataStore, poller: Poller, scriptRegistry: ScriptRegistry } = {} as any;

    beforeEach(() => {
        (Context as any).mockClear();
        ContextMock.fetchMetricMetadata.mockClear();
        ContextMock.findMetricMetadata.mockClear();
        ContextMock.fetch.mockClear();
        ContextMock.store.mockClear();
        dateMock.clear();

        ctx.context = new Context("http://localhost:44323");
        ctx.datastore = new DataStore(ctx.context, 25000)
        ctx.poller = new Poller(ctx.context, ctx.datastore, 10000);
        ctx.scriptRegistry = new ScriptRegistry(ctx.context, ctx.poller, 10000);
    });

    let registerScript = async () => {
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

        await ctx.scriptRegistry.ensureActive("kretprobe:vfs_read { @bytes = hist(retval); }");
    }

    it("should register a script only once", async () => {
        await registerScript();
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

        let script: BPFtraceScript;
        script = await ctx.scriptRegistry.ensureActive("kretprobe:vfs_read { bytes = hist(retval); }");
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

        ContextMock.findMetricMetadata.mockReturnValue({});
        ContextMock.fetch.mockReturnValueOnce({
            "timestamp": {
                "s": 5,
                "us": 2000
            },
            "values": [{
                "pmid": 633356298,
                "name": "bpftrace.scripts.script1.status",
                "instances": [{
                    "instance": -1,
                    "value": "stopped",
                    "instanceName": null
                }]
            }, {
                "pmid": 633356299,
                "name": "bpftrace.scripts.script1.output",
                "instances": [{
                    "instance": -1,
                    "value": "syntax error",
                    "instanceName": null
                }]
            }, {
                "pmid": 633356299,
                "name": "bpftrace.scripts.script1.exit_code",
                "instances": [{
                    "instance": -1,
                    "value": 1,
                    "instanceName": null
                }]
            }]
        });
        await ctx.scriptRegistry.syncState();

        let script = await ctx.scriptRegistry.ensureActive("kretprobe:vfs_read { @bytes = hist(retval); }");
        expect(script).toMatchObject({
            "status": "stopped",
            "output": "syntax error",
            "exit_code": 1
        });
        expect(ContextMock.store).toHaveBeenCalledTimes(1);
    });

    it("should restart a stopped script", async () => {
        await registerScript();

        // sync state: set status to stopped, exit_code to 0
        ContextMock.findMetricMetadata
            .mockReturnValueOnce({})
            .mockReturnValueOnce({})
            .mockReturnValueOnce({});
        ContextMock.fetch.mockReturnValueOnce({
            "timestamp": {
                "s": 5,
                "us": 2000
            },
            "values": [{
                "pmid": 633356298,
                "name": "bpftrace.scripts.script1.status",
                "instances": [{
                    "instance": -1,
                    "value": "stopped",
                    "instanceName": null
                }]
            }, {
                "pmid": 633356299,
                "name": "bpftrace.scripts.script1.exit_code",
                "instances": [{
                    "instance": -1,
                    "value": 0,
                    "instanceName": null
                }]
            }, {
                "pmid": 633356299,
                "name": "bpftrace.scripts.script1.output",
                "instances": [{
                    "instance": -1,
                    "value": "",
                    "instanceName": null
                }]
            }]
        });
        await ctx.scriptRegistry.syncState();

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
        let script = await ctx.scriptRegistry.ensureActive("kretprobe:vfs_read { @bytes = hist(retval); }");
        expect(script).toMatchObject({
            "status": "started"
        });
        expect(ContextMock.store).toHaveBeenCalledTimes(2);
    });

    it("should remove a script which doesn't exist on the PMDA anymore", async () => {
        await registerScript();
        expect(ContextMock.fetch).toHaveBeenCalledTimes(1);

        // metric metadata for script23.status, .exit_code, .output
        ContextMock.findMetricMetadata.mockReturnValue(undefined)

        await ctx.scriptRegistry.syncState();
        // fetch wasn't called, as the script doesn't exist on the PMDA anymore
        expect(ContextMock.fetch).toHaveBeenCalledTimes(1);
        await ctx.scriptRegistry.syncState();

        // fetch wasn't called, as there are no scripts registered anymore
        expect(ContextMock.fetch).toHaveBeenCalledTimes(1);
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
