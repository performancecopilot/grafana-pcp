import ScriptRegistry from "../script_registry";
import * as dateMock from 'jest-date-mock';
import { PmapiSrv, Context } from "../../lib/services/pmapi_srv";
import DataStore from "../../lib/datastore";
import PollSrv from "../../lib/services/poll_srv";
import * as fixtures from '../../lib/specs/lib/fixtures';

describe("ScriptRegistry", () => {
    const ctx: {
        context: jest.Mocked<Context>, pmapiSrv: PmapiSrv, datastore: DataStore,
        pollSrv: PollSrv, scriptRegistry: ScriptRegistry
    } = {} as any;

    beforeEach(() => {
        dateMock.clear();
        ctx.context = {
            indom: jest.fn(),
            metrics: jest.fn(),
            fetch: jest.fn(),
            store: jest.fn(),
            newInstance: () => ctx.context
        } as any;
        ctx.pmapiSrv = new PmapiSrv(ctx.context);
        ctx.datastore = new DataStore(ctx.pmapiSrv, 5 * 60 * 1000);
        ctx.pollSrv = new PollSrv(ctx.pmapiSrv, ctx.datastore, 20 * 1000);
        ctx.scriptRegistry = new ScriptRegistry(ctx.pmapiSrv, ctx.pollSrv, ctx.datastore, 20 * 1000);
    });

    const registerScript = async () => {
        ctx.context.store.mockResolvedValueOnce({ success: true });
        ctx.context.fetch.mockResolvedValueOnce({
            "timestamp": 5,
            "values": [{
                "pmid": "1.0.1",
                "name": "bpftrace.control.register",
                "instances": [{
                    "instance": null,
                    "value": '{"name": "script1", "vars": ["usecs"], "status": "started", "output": ""}'
                }]
            }]
        });
        ctx.context.metrics.mockResolvedValueOnce({
            metrics: [{
                ...fixtures.metricMetadataSingle,
                name: "bpftrace.scripts.script1.status",
                labels: {
                    agent: "bpftrace",
                    metrictype: "control"
                }
            }, {
                ...fixtures.metricMetadataSingle,
                name: "bpftrace.scripts.script1.exit_code",
                labels: {
                    agent: "bpftrace",
                    metrictype: "control"
                }
            }, {
                ...fixtures.metricMetadataSingle,
                name: "bpftrace.scripts.script1.output",
                labels: {
                    agent: "bpftrace",
                    metrictype: "output"
                }
            }]
        });
        await ctx.scriptRegistry.ensureActive("kretprobe:vfs_read { @bytes = hist(retval); }");
    };

    it("should register a script only once", async () => {
        await registerScript();
        await ctx.scriptRegistry.ensureActive("kretprobe:vfs_read { @bytes = hist(retval); }");

        expect(ctx.context.store).toHaveBeenCalledTimes(1);
    });

    it("should register a failed script only once", async () => {
        ctx.context.store.mockResolvedValueOnce({ success: true });
        ctx.context.fetch.mockResolvedValueOnce({
            "timestamp": 5,
            "values": [{
                "pmid": "1.0.1",
                "name": "bpftrace.control.register",
                "instances": [{
                    "instance": null,
                    "value": '{"name": "", "vars": [], "status": "stopped", "output": "no variable found"}'
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
        expect(ctx.context.store).toHaveBeenCalledTimes(1);
    });

    it("should handle a failed script, after the script started", async () => {
        await registerScript();
        ctx.context.fetch.mockResolvedValueOnce({
            "timestamp": 5,
            "values": [{
                "pmid": "1.0.1",
                "name": "bpftrace.scripts.script1.status",
                "instances": [{
                    "instance": null,
                    "value": "stopped"
                }]
            }, {
                "pmid": "1.0.1",
                "name": "bpftrace.scripts.script1.output",
                "instances": [{
                    "instance": null,
                    "value": "syntax error"
                }]
            }, {
                "pmid": "633356298",
                "name": "bpftrace.scripts.script1.exit_code",
                "instances": [{
                    "instance": null,
                    "value": 1
                }]
            }]
        });
        await ctx.pollSrv.poll();

        const script = await ctx.scriptRegistry.ensureActive("kretprobe:vfs_read { @bytes = hist(retval); }");
        expect(script).toMatchObject({
            "status": "stopped",
            "output": "syntax error",
            "exit_code": 1
        });
        expect(ctx.context.store).toHaveBeenCalledTimes(1);
        expect(ctx.context.fetch).toHaveBeenCalledTimes(2);
        await ctx.pollSrv.poll(); // no metrics to poll
        expect(ctx.context.fetch).toHaveBeenCalledTimes(2);
    });

    it("should restart a stopped script", async () => {
        await registerScript();

        // sync state: set status to stopped, exit_code to 0
        ctx.context.fetch.mockResolvedValueOnce({
            "timestamp": 5,
            "values": [{
                "pmid": "1.0.1",
                "name": "bpftrace.scripts.script1.status",
                "instances": [{
                    "instance": null,
                    "value": "stopped"
                }]
            }, {
                "pmid": "1.0.1",
                "name": "bpftrace.scripts.script1.output",
                "instances": [{
                    "instance": null,
                    "value": ""
                }]
            }, {
                "pmid": "633356298",
                "name": "bpftrace.scripts.script1.exit_code",
                "instances": [{
                    "instance": null,
                    "value": 0
                }]
            }]
        });

        await ctx.pollSrv.poll();

        // ensureActive should call register again, to restart the script
        ctx.context.store.mockResolvedValueOnce({ success: true });
        ctx.context.fetch.mockResolvedValueOnce({
            "timestamp": 5,
            "values": [{
                "pmid": "1.0.1",
                "name": "bpftrace.control.register",
                "instances": [{
                    "instance": null,
                    "value": '{"name": "script1", "vars": ["usecs"], "status": "started", "output": ""}'
                }]
            }]
        });

        const script = await ctx.scriptRegistry.ensureActive("kretprobe:vfs_read { @bytes = hist(retval); }");
        expect(ctx.context.fetch).toHaveBeenCalledTimes(3);
        expect(ctx.context.store).toHaveBeenCalledTimes(2);
        expect(script).toMatchObject({
            "status": "started"
        });
    });

    it("should re-register a script which doesn't exist on the PMDA anymore", async () => {
        await registerScript();
        expect(ctx.context.fetch).toHaveBeenCalledTimes(1);

        // poll status metrics, but metric doesn't exist anymore on the server
        ctx.context.fetch.mockResolvedValueOnce({
            "timestamp": 5,
            "values": []
        });
        // will remove metric metadata
        await ctx.pollSrv.poll();

        // ensureActive tries to fetch metadata (not in cache anymore), but it doesn't exist
        ctx.context.metrics.mockResolvedValueOnce({
            metrics: []
        });
        // then it will register the script again
        ctx.context.fetch.mockResolvedValueOnce({
            "timestamp": 5,
            "values": [{
                "pmid": "1.0.1",
                "name": "bpftrace.control.register",
                "instances": [{
                    "instance": null,
                    "value": '{"name": "script1", "vars": ["usecs"], "status": "started", "output": ""}'
                }]
            }]
        });
        // and ensurePolling will fetch metadata
        ctx.context.metrics.mockResolvedValueOnce({
            metrics: [{
                ...fixtures.metricMetadataSingle,
                name: "bpftrace.scripts.script1.status",
                labels: {
                    agent: "bpftrace",
                    metrictype: "control"
                }
            }, {
                ...fixtures.metricMetadataSingle,
                name: "bpftrace.scripts.script1.exit_code",
                labels: {
                    agent: "bpftrace",
                    metrictype: "control"
                }
            }, {
                ...fixtures.metricMetadataSingle,
                name: "bpftrace.scripts.script1.output",
                labels: {
                    agent: "bpftrace",
                    metrictype: "output"
                }
            }]
        });

        const script = await ctx.scriptRegistry.ensureActive("kretprobe:vfs_read { @bytes = hist(retval); }");
        expect(script).toMatchObject({
            "status": "started"
        });
        expect(ctx.context.store).toHaveBeenCalledTimes(2);
    });

    it("should remove scripts which weren't requested in a specified time period", async () => {
        await registerScript();
        await registerScript();
        expect(ctx.context.store).toHaveBeenCalledTimes(1);

        dateMock.advanceBy(25000);
        ctx.scriptRegistry.cleanupExpiredScripts();

        await registerScript();
        expect(ctx.context.store).toHaveBeenCalledTimes(2);
    });
});
