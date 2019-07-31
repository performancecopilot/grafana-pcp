import _ from "lodash";
import { QueryCtrl } from 'grafana/app/plugins/sdk';

export abstract class PCPQueryCtrl extends QueryCtrl {

    constructor($scope: any, $injector: any, private typingDebounceTime: number = 1000) {
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

}
