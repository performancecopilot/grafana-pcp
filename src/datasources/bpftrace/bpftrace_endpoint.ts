import { Endpoint } from "../lib/endpoint_registry";
import ScriptRegistry from "./script_registry";

export default interface BPFtraceEndpoint extends Endpoint {
    scriptRegistry: ScriptRegistry
}
