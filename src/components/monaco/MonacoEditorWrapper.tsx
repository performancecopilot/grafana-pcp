import React, { PureComponent } from 'react';
import MonacoEditor, { MonacoEditorProps } from 'react-monaco-editor';
import * as Monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { Themeable, withTheme } from '@grafana/ui';

export interface MonacoEditorWrapperProps extends Omit<MonacoEditorProps, 'theme'> {
    initMonaco?: (monaco: typeof Monaco) => void;
    onBlur?: (value: string) => void;
    onSave?: (value: string) => void;
}

type Props = MonacoEditorWrapperProps & Themeable;

/**
 * tiny wrapper to be able to lazy load monaco and access the monaco object
 */
class MonacoEditorWrapper extends PureComponent<Props> {
    private editor?: Monaco.editor.IStandaloneCodeEditor;

    constructor(props: Props) {
        super(props);
        this.props.initMonaco?.(Monaco);
    }

    onBlur = () => {
        this.props.onBlur?.(this.editor?.getValue() || '');
    };

    editorDidMount = (editor: Monaco.editor.IStandaloneCodeEditor, monaco: typeof Monaco) => {
        this.editor = editor;

        if (this.props.onSave) {
            editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S, () => {
                this.props.onSave?.(editor.getValue());
            });
        }
    };

    render() {
        const props: MonacoEditorProps = {
            ...this.props,
            theme: this.props.theme.isDark ? 'vs-dark' : 'vs-light',
            options: {
                wordWrap: 'on',
                lineNumbers: 'off',
                minimap: {
                    enabled: false,
                },
                folding: false, // space between line number and code
                lineDecorationsWidth: 5, // space between line number and code
                overviewRulerBorder: false, // right border
                ...this.props.options,
            },
        };
        return (
            <div onBlur={this.onBlur}>
                <MonacoEditor editorDidMount={this.editorDidMount} {...props} />
            </div>
        );
    }
}

export default withTheme(MonacoEditorWrapper);
