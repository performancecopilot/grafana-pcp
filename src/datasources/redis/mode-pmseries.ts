/* tslint:disable */
export function load_mode(ace: any) {
    ace.define("ace/snippets/pmseries", ["require", "exports", "module"], function (require: any, exports: any, module: any) {
        "use strict";

        exports.snippets = [];
        exports.scope = "pmseries";
    });

    ace.define("ace/mode/pmseries_highlight_rules", ["require", "exports", "module", "ace/lib/oop", "ace/mode/text_highlight_rules"], function (require: any, exports: any, module: any) {
        "use strict";

        var oop = require("../lib/oop");
        var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

        var PmSeriesHighlightRules = function () {
            this.$rules = {
                "start": [{
                    token: "entity.name.tag.metric",
                    regex: '[a-zA-Z][a-zA-Z0-9._]*'
                }, {
                    token: "paren.lparen.qualifiers-matcher",
                    regex: "{",
                    next: "start-qualifiers-matcher"
                }],
                "start-qualifiers-matcher": [{
                    token: "entity.name.tag.qualifier-key",
                    regex: '[a-zA-Z_][a-zA-Z0-9_.]*'
                }, {
                    token: "keyword.operator",
                    regex: '==|!=|~~|=~|!~|:|<|>|<=|>='
                }, {
                    token: "string.quoted.qualifier-value",
                    regex: '".*?"'
                }, {
                    token: "punctuation.operator",
                    regex: '&&|\\|\\||,',
                }, {
                    token: "paren.rparen",
                    regex: "}",
                    next: "start"
                }]
            };
            this.normalizeRules();
        };

        oop.inherits(PmSeriesHighlightRules, TextHighlightRules);

        exports.PmSeriesHighlightRules = PmSeriesHighlightRules;
    });

    ace.define("ace/mode/pmseries", ["require", "exports", "module", "ace/lib/oop", "ace/mode/text", "ace/mode/pmseries_highlight_rules"], function (require: any, exports: any, module: any) {
        "use strict";

        var oop = require("../lib/oop");
        var TextMode = require("./text").Mode;
        var PmSeriesHighlightRules = require("./pmseries_highlight_rules").PmSeriesHighlightRules;

        var Mode = function () {
            this.HighlightRules = PmSeriesHighlightRules;
            this.$behaviour = this.$defaultBehaviour;
        };
        oop.inherits(Mode, TextMode);

        (function () {
            this.$id = "ace/mode/pmseries";
        }).call(Mode.prototype);

        exports.Mode = Mode;

    });
}
