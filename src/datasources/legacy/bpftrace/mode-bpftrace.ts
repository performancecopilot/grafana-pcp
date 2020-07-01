/* tslint:disable */
declare var ace: any;
export default () => {
    ace.define("ace/snippets/bpftrace", ["require", "exports", "module"], function (require: any, exports: any, module: any) {
        "use strict";

        exports.snippets = [];
        exports.scope = "bpftrace";
    });

    ace.define("ace/mode/bpftrace_highlight_rules", ["require", "exports", "module", "ace/lib/oop", "ace/mode/text_highlight_rules"], function (require: any, exports: any, module: any) {
        "use strict";

        var oop = require("../lib/oop");
        var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

        var BPFtraceHighlightRules = function () {
            var keywords = (
                "if|else|unroll"
            );

            var storageType = (
                "struct|union|enum"
            );

            var builtinVariables = (
                "pid|tid|cgroup|uid|gid|nsecs|cpu|comm|kstack|stack|ustack|retval|func|probe|curtask|rand|ctx|username|args|elapsed|" +
                "arg0|arg1|arg2|arg3|arg4|arg5|arg6|arg7|arg8|arg9"
            );

            var builtinConstants = (
                "true|false"
            );

            var builtinFunctions = (
                "printf|time|join|str|ksym|usym|kaddr|uaddr|reg|system|exit|cgroupid|kstack|ustack|ntop|cat|" +
                "count|sum|avg|min|max|stats|hist|lhist|delete|print|clear|zero"
            );

            var keywordMapper = this.createKeywordMapper({
                "keyword": keywords,
                "storage.type": storageType,
                "variable.language": builtinVariables,
                "constant.language": builtinConstants,
                "support.function": builtinFunctions
            }, "identifier");

            // cannot make custom scopes for probe, filter and action block:
            // can't parse bpftrace grammar with a finite state machine
            // is } closing a previously opened { or closing the action block?
            // ==> cannot count depth, therefore do depth counting in completer
            this.$rules = {
                "start": [{
                    token: "comment",
                    regex: "//.*$"
                }, {
                    token: "comment",
                    start: "/\\*",
                    end: "\\*/"
                }, {
                    token: "keyword", // compiler directives
                    regex: "#\\s*(?:include|import|pragma|line|define|undef)\\b"
                }, {
                    token: "text", // compiler directive value
                    regex: "<.*>"
                }, {
                    token: "keyword.control.probe",
                    regex: "BEGIN|END|" + ["(k|u)(ret)?probe", "tracepoint", "usdt", "profile", "interval",
                        "software", "hardware", "watchpoint"].map(p => `${p}:[a-zA-Z0-9_\\-:./]*`).join("|")
                }, {
                    token: "string",
                    regex: '".*?"'
                }, {
                    token: "constant.numeric", // hex
                    regex: "0[xX][0-9a-fA-F]+(L|l|UL|ul|u|U|F|f|ll|LL|ull|ULL)?\\b"
                }, {
                    token: "constant.numeric", // float
                    regex: "[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?(L|l|UL|ul|u|U|F|f|ll|LL|ull|ULL)?\\b"
                }, {
                    token: "variable.other",
                    regex: "(@|\\$)[a-zA-Z_][a-zA-Z0-9_]*"
                }, {
                    token: keywordMapper,
                    regex: "[a-zA-Z_][a-zA-Z0-9_]*"
                }, {
                    token: "keyword.operator",
                    regex: /--|\+\+|<<=|>>=|>>>=|<>|&&|\|\||\?:|[*%\/+\-&\^|~!<>=]=?/
                }, {
                    token: "punctuation.operator",
                    regex: "\\?|\\:|\\,|\\;|\\."
                }, {
                    token: "paren.lparen",
                    regex: "[[(]"
                }, {
                    token: "paren.rparen",
                    regex: "[\\])]"
                }, {
                    token: "paren.lparen.brace",
                    regex: "{"
                }, {
                    token: "paren.rparen.brace",
                    regex: "}"
                }, {
                    token: "text",
                    regex: "\\s+"
                }]
            };
            this.normalizeRules();
        };

        oop.inherits(BPFtraceHighlightRules, TextHighlightRules);

        exports.BPFtraceHighlightRules = BPFtraceHighlightRules;
    });

    ace.define("ace/mode/bpftrace", ["require", "exports", "module", "ace/lib/oop", "ace/mode/text", "ace/mode/bpftrace_highlight_rules"], function (require: any, exports: any, module: any) {
        "use strict";

        var oop = require("../lib/oop");
        var TextMode = require("./text").Mode;
        var BPFtraceHighlightRules = require("./bpftrace_highlight_rules").BPFtraceHighlightRules;

        var Mode = function () {
            this.HighlightRules = BPFtraceHighlightRules;
            this.$behaviour = this.$defaultBehaviour;
            // overwrite keywordCompleter
            this.completer = {
                getCompletions: function (editor: any, session: any, pos: any, prefix: any, callback: (e: any, r: any) => void) { callback(null, []); }
            };
        };
        oop.inherits(Mode, TextMode);

        (function () {
            this.$id = "ace/mode/bpftrace";
        }).call(Mode.prototype);

        exports.Mode = Mode;

    });
}
