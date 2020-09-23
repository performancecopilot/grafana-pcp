import * as Monaco from 'monaco-editor/esm/vs/editor/editor.api';
// this prevents monaco from being included in the redis datasource
// (it it already in its own chunk in vendors~monaco-editor.js)
declare const monaco: typeof Monaco;

export interface TokenValue {
    offset: number;
    offsetEnd: number;
    type: string;
    value: string;
}
export function getTokenValues(model: Monaco.editor.ITextModel, position: Monaco.Position) {
    const currentLine = model.getLineContent(position.lineNumber);
    const tokens = monaco.editor.tokenize(currentLine, model.getModeId());
    const tokenValues: TokenValue[] = [];
    for (let i = 0; i < tokens[0].length; i++) {
        const offset = tokens[0][i].offset;
        const offsetEnd = i + 1 < tokens[0].length ? tokens[0][i + 1].offset : currentLine.length; // excluding
        if (offset >= position.column - 1) {
            break;
        }

        tokenValues.push({
            offset,
            offsetEnd,
            type: tokens[0][i].type,
            value: currentLine.substring(offset, offsetEnd),
        });
    }
    return tokenValues;
}

export function findToken(tokens: TokenValue[], type: string) {
    for (let i = tokens.length - 1; i >= 0; i--) {
        if (tokens[i].type === type) {
            return tokens[i];
        }
    }
    return;
}
