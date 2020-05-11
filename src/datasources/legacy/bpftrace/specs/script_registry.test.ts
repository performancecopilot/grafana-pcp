import * as dateMock from 'jest-date-mock';
import ScriptRegistry from "../script_registry";
import { PmapiSrv, Context } from "../../lib/services/pmapi_srv";
import DataStore from "../../lib/datastore";
import PollSrv from "../../lib/services/poll_srv";
import fixtures from '../../lib/specs/lib/fixtures';

describe("ScriptRegistry", () => {
    const ctx: {
        context: jest.Mocked<Context>, pmapiSrv: PmapiSrv, datastore: DataStore,
        pollSrv: PollSrv, scriptRegistry: ScriptRegistry
    } = {} as any;

    beforeEach(() => {
        dateMock.clear();
        ctx.context = {
            indom: jest.fn(),
            metric: jest.fn(),
            fetch: jest.fn(),
            store: jest.fn(),
            newInstance: () => ctx.context
        } as any;
        ctx.pmapiSrv = new PmapiSrv(ctx.context);
        ctx.datastore = new DataStore(ctx.pmapiSrv, 5 * 60 * 1000);
        ctx.pollSrv = new PollSrv(ctx.pmapiSrv, ctx.datastore);
        ctx.scriptRegistry = new ScriptRegistry(ctx.pmapiSrv, ctx.pollSrv);
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
                    "value": JSON.stringify({
                        ...fixtures.bpftrace.script,
                        "state": {
                            "status": "starting",
                            "pid": -1,
                            "exit_code": 0,
                            "error": "",
                            "probes": 0
                        }
                    })
                }]
            }]
        });
        ctx.context.metric.mockResolvedValueOnce({
            metrics: [{
                ...fixtures.grafana.metricMetadataSingle,
                name: "bpftrace.info.scripts_json"
            }]
        });
        await ctx.scriptRegistry.ensureActive("1/1/A", "kretprobe:vfs_read { @bytes = hist(retval); }");
    };

    it("should register a script only once", async () => {
        await registerScript();
        await ctx.scriptRegistry.ensureActive("1/1/A", "kretprobe:vfs_read { @bytes = hist(retval); }");

        expect(ctx.context.store).toHaveBeenCalledTimes(1);
    });

    it("should handle a failed script, after the script started", async () => {
        await registerScript();
        ctx.context.fetch.mockResolvedValueOnce({
            "timestamp": 5,
            "values": [{
                "pmid": "1.0.1",
                "name": "bpftrace.info.scripts_json",
                "instances": [{
                    "instance": null,
                    "value": JSON.stringify([{
                        ...fixtures.bpftrace.script,
                        "state": {
                            "status": "error",
                            "pid": -1,
                            "exit_code": 0,
                            "error": "syntax error",
                            "probes": 0
                        }
                    }])
                }]
            }]
        });
        await ctx.pollSrv.poll();

        const script = await ctx.scriptRegistry.ensureActive("1/1/A", "kretprobe:vfs_read { @bytes = hist(retval); }");
        expect(script).toMatchObject({
            "state": {
                "status": "error",
                "error": "syntax error"
            }
        });
        expect(ctx.context.store).toHaveBeenCalledTimes(1);
    });

    it("should restart a stopped script", async () => {
        await registerScript();
        ctx.context.fetch.mockResolvedValueOnce({
            "timestamp": 5,
            "values": [{
                "pmid": "1.0.1",
                "name": "bpftrace.info.scripts_json",
                "instances": [{
                    "instance": null,
                    "value": JSON.stringify([{
                        ...fixtures.bpftrace.script,
                        "state": {
                            "status": "stopped",
                            "pid": -1,
                            "exit_code": 0,
                            "error": "",
                            "probes": 0
                        }
                    }])
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
                    "value": JSON.stringify({
                        ...fixtures.bpftrace.script,
                        "state": {
                            "status": "starting",
                            "pid": -1,
                            "exit_code": 0,
                            "error": "",
                            "probes": 0
                        }
                    })
                }]
            }]
        });

        const script = await ctx.scriptRegistry.ensureActive("1/1/A", "kretprobe:vfs_read { @bytes = hist(retval); }");
        expect(ctx.context.fetch).toHaveBeenCalledTimes(3);
        expect(ctx.context.store).toHaveBeenCalledTimes(2);
        expect(script).toMatchObject({
            "state": {
                "status": "starting"
            }
        });
    });

    it("should re-register a script which doesn't exist on the PMDA anymore", async () => {
        await registerScript();
        expect(ctx.context.fetch).toHaveBeenCalledTimes(1);

        // sync running scripts with the server
        ctx.context.fetch.mockResolvedValueOnce({
            "timestamp": 5,
            "values": [{
                "pmid": "1.0.1",
                "name": "bpftrace.info.scripts_json",
                "instances": [{
                    "instance": null,
                    "value": JSON.stringify([])
                }]
            }]
        });
        await ctx.pollSrv.poll();

        // ensureActive should call register again
        ctx.context.store.mockResolvedValueOnce({ success: true });
        ctx.context.fetch.mockResolvedValueOnce({
            "timestamp": 5,
            "values": [{
                "pmid": "1.0.1",
                "name": "bpftrace.control.register",
                "instances": [{
                    "instance": null,
                    "value": JSON.stringify({
                        ...fixtures.bpftrace.script,
                        "state": {
                            "status": "starting",
                            "pid": -1,
                            "exit_code": 0,
                            "error": "",
                            "probes": 0
                        }
                    })
                }]
            }]
        });

        const script = await ctx.scriptRegistry.ensureActive("1/1/A", "kretprobe:vfs_read { @bytes = hist(retval); }");
        expect(script).toMatchObject({
            "state": {
                "status": "starting"
            }
        });
        expect(ctx.context.store).toHaveBeenCalledTimes(2);
    });
});
