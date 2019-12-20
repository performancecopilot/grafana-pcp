/* tslint:disable */
export function load_mode(ace: any) {
    ace.define("ace/snippets/pcp", ["require", "exports", "module"], function (require: any, exports: any, module: any) {
        "use strict";

        exports.snippets = [];
        exports.scope = "pcp";
    });

    ace.define("ace/mode/pcp_highlight_rules", ["require", "exports", "module", "ace/lib/oop", "ace/mode/text_highlight_rules"], function (require: any, exports: any, module: any) {
        "use strict";

        var oop = require("../lib/oop");
        var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

        var PcpHighlightRules = function () {
            this.$rules = {
                "start": [{
                    token: "entity.name.tag.metric",
                    regex: '[a-zA-Z][a-zA-Z0-9._]*'
                }]
            };
            this.normalizeRules();
        };

        oop.inherits(PcpHighlightRules, TextHighlightRules);

        exports.PcpHighlightRules = PcpHighlightRules;
    });

    ace.define("ace/mode/pcp", ["require", "exports", "module", "ace/lib/oop", "ace/mode/text", "ace/mode/pcp_highlight_rules"], function (require: any, exports: any, module: any) {
        "use strict";

        var oop = require("../lib/oop");
        var TextMode = require("./text").Mode;
        var PcpHighlightRules = require("./pcp_highlight_rules").PcpHighlightRules;

        var Mode = function () {
            this.HighlightRules = PcpHighlightRules;
            this.$behaviour = this.$defaultBehaviour;
        };
        oop.inherits(Mode, TextMode);

        (function () {
            this.$id = "ace/mode/pcp";
        }).call(Mode.prototype);

        exports.Mode = Mode;

    });
}
