import Poller from "../poller";
import DataStore from "../datastore";
import ScriptRegistry, { BPFtraceScript } from "../script_registry";
import Context from "../context";
import * as dateMock from 'jest-date-mock';

const mockContextFetchMetricMetadata = jest.fn();
const mockContextFindMetricMetadata = jest.fn();
const mockContextFetch = jest.fn();
const mockContextStore = jest.fn();
jest.mock('../context', () => {
    return jest.fn().mockImplementation(() => {
        return {
            fetchMetricMetadata: mockContextFetchMetricMetadata,
            findMetricMetadata: mockContextFindMetricMetadata,
            fetch: mockContextFetch,
            store: mockContextStore
        };
    });
});

describe("ScriptRegistry", () => {
    let ctx: { context: any, datastore: DataStore, poller: Poller, scriptRegistry: ScriptRegistry } = {} as any;

    beforeEach(() => {
        (Context as any).mockClear();
        mockContextFetchMetricMetadata.mockClear();
        mockContextFetch.mockClear();
        mockContextStore.mockClear();
        dateMock.clear();

        ctx.context = new Context("http://localhost:44323");
        ctx.datastore = new DataStore(ctx.context, 25000)
        ctx.poller = new Poller(ctx.context, ctx.datastore, 10000);
        ctx.scriptRegistry = new ScriptRegistry(ctx.context, ctx.poller, 10000);
    });

    let registerScript = async () => {
        mockContextFetch.mockReturnValueOnce({
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
        expect(mockContextStore).toHaveBeenCalledTimes(1);
    });

    it("should register a failed script only once", async () => {
        mockContextFetch.mockReturnValueOnce({
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
        expect(mockContextStore).toHaveBeenCalledTimes(1);
    });

    it("should handle a failed script, after the script started", async () => {
        mockContextFetch.mockReturnValueOnce({
            "timestamp": {
                "s": 5,
                "us": 2000
            },
            "values": [{
                "pmid": 633356298,
                "name": "bpftrace.control.register",
                "instances": [{
                    "instance": -1,
                    "value": '{"name": "script1", "vars": ["usecs"], "status": "starting", "output": ""}',
                    "instanceName": null
                }]
            }]
        });

        let script: BPFtraceScript;
        script = await ctx.scriptRegistry.ensureActive("kretprobe:vfs_read { @bytes = hist(retval); }");
        expect(script).toMatchObject({
            "status": "starting"
        });

        mockContextFindMetricMetadata
            .mockReturnValueOnce({})
            .mockReturnValueOnce({});
        mockContextFetch.mockReturnValueOnce({
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
            }]
        });
        await ctx.scriptRegistry.syncState();

        script = await ctx.scriptRegistry.ensureActive("kretprobe:vfs_read { @bytes = hist(retval); }");
        expect(script).toMatchObject({
            "status": "stopped",
            "output": "syntax error"
        });
        expect(mockContextStore).toHaveBeenCalledTimes(1);
    });

    it("should restart a stopped script", async () => {
        await registerScript();

        let script: BPFtraceScript;
        script = await ctx.scriptRegistry.ensureActive("kretprobe:vfs_read { @bytes = hist(retval); }");
        expect(script).toMatchObject({
            "status": "started"
        });

        // sync state: set status to stopped, exit_code to 0
        mockContextFindMetricMetadata
            .mockReturnValueOnce({})
            .mockReturnValueOnce({})
            .mockReturnValueOnce({});
        mockContextFetch.mockReturnValueOnce({
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
        mockContextFetch.mockReturnValueOnce({
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
        script = await ctx.scriptRegistry.ensureActive("kretprobe:vfs_read { @bytes = hist(retval); }");
        expect(script).toMatchObject({
            "status": "started"
        });
        expect(mockContextStore).toHaveBeenCalledTimes(2);
    });

    it("should remove a script which doesn't exist on the PMDA anymore", async () => {
        await registerScript();
        expect(mockContextFetch).toHaveBeenCalledTimes(1);

        // metric metadata for script23.status, .exit_code, .output
        mockContextFindMetricMetadata.mockReturnValue(undefined)

        await ctx.scriptRegistry.syncState();
        // fetch wasn't called, as the script doesn't exist on the PMDA anymore
        expect(mockContextFetch).toHaveBeenCalledTimes(1);
        await ctx.scriptRegistry.syncState();

        // fetch wasn't called, as there are no scripts registered anymore
        expect(mockContextFetch).toHaveBeenCalledTimes(1);
    });

    it("should remove scripts which weren't requested in a specified time period", async () => {
        await registerScript();
        await registerScript();
        expect(mockContextStore).toHaveBeenCalledTimes(1);

        dateMock.advanceBy(15000);
        ctx.scriptRegistry.cleanupExpiredScripts();

        await registerScript();
        expect(mockContextStore).toHaveBeenCalledTimes(2);
    });
});
