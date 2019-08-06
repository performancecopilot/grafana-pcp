import { PCPBPFtraceDatasource } from "./datasource";

export default class PCPBPFtraceCompleter {

    constructor(private datasource: PCPBPFtraceDatasource, private target: any) {
    }

    getCompletions(editor: any, session: any, pos: any, prefix: any, callback: any) {
        if (editor.completers.length === 4) {
            // the ace editor comes with [snippetCompleter, textCompleter, keywordCompleter]
            // our completor is the last of the array
            // let's remove the textCompleter (index 1)
            editor.completers.splice(1, 1);
        }

        this.findCompletions(editor, session, pos, prefix).then((value) => {
            callback(null, value);
        }, (reason: any) => {
            callback(reason, []);
        });
    }


    async findCompletions(editor: any, session: any, pos: any, prefix: any) {
        const token = session.getTokenAt(pos.row, pos.column);
        if (token.type === "entity.name.tag.metric") {
            return [];
        }
        else {
            return [];
        }
    }
}
