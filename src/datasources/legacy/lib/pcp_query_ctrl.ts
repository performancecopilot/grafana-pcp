import _ from "lodash";
import { QueryCtrl } from 'grafana/app/plugins/sdk';
declare var ace: any;

export abstract class PCPQueryCtrl extends QueryCtrl {

    constructor($scope: any, $injector: any, private typingDebounceTime = 1000) {
        super($scope, $injector);
    }

    stopTyping() {
        // we don't want this property in the saved/exported JSON
        delete this.target.isTyping;
    }

    // this method is called 1s after the last keypress
    stopTypingDebounced = _.debounce(this.stopTyping, this.typingDebounceTime);

    startTyping() {
        this.target.isTyping = true;
        this.stopTypingDebounced();
    }

    targetChanged() {
        this.stopTyping();
        this.panelCtrl.refresh();
    }

    private tryRemoveTextCompleter(mode: string) {
        if (!ace)
            return false;

        const { textCompleter } = ace.acequire('ace/ext/language_tools');
        if (!textCompleter)
            return false;

        let removed = false;
        for (const codeEditor of Array.from<any>(document.querySelectorAll(`code-editor[data-mode=${mode}]`))) {
            if (!codeEditor.env)
                continue;

            const completers = Array.from(codeEditor.env.editor.completers);
            const idx = completers.indexOf(textCompleter);
            if (idx >= 0) {
                completers.splice(idx, 1);
                codeEditor.env.editor.completers = completers;
            }
            removed = true;
        }
        return removed;
    }

    removeTextCompleter(mode: string) {
        if (!this.tryRemoveTextCompleter(mode)) {
            // method called before code-editor is in DOM -> try again in 2s
            // quite hacky, but there's no proper way to access the codeEditor without
            // editing the directive (code_editor.ts) in Grafana's source code
            setTimeout(this.tryRemoveTextCompleter.bind(this, mode), 2000);
        }
    }
}
