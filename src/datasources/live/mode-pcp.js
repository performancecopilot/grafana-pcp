// jshint ignore: start
ace.define("ace/snippets/pcp", ["require", "exports", "module"], function (require, exports, module) {
    "use strict";

    exports.snippets = [];
    exports.scope = "pcp";
});

ace.define("ace/mode/pcp_highlight_rules", ["require", "exports", "module", "ace/lib/oop", "ace/mode/text_highlight_rules"], function (require, exports, module) {
    "use strict";

    var oop = require("../lib/oop");
    var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

    var PcpHighlightRules = function () {
        this.$rules = {
            "start": [{
                token: "punctuation",
                regex: "\\."
            }, {
                token: "entity.name.tag",
                regex: '[a-zA-Z]\\w*'
            }]
        };
        this.normalizeRules();
    };

    oop.inherits(PcpHighlightRules, TextHighlightRules);

    exports.PcpHighlightRules = PcpHighlightRules;
});

ace.define("ace/mode/pcp", ["require", "exports", "module", "ace/lib/oop", "ace/mode/text", "ace/mode/pcp_highlight_rules"], function (require, exports, module) {
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
