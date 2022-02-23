import * as Monaco from 'monaco-editor/esm/vs/editor/editor.api';
import React, { PureComponent } from 'react';
import MonacoEditor, { MonacoEditorProps } from 'react-monaco-editor';
import { Themeable, withTheme } from '@grafana/ui';

export interface MonacoLanguageDefinition {
    /** unique language ID.
     * Note: there can be multiple Monaco Editors on the same page
     * where each of them needs a different auto-completion
     * (each query can use a different datasource or overriden URL)
     * so we need to make every language definition ID unique */
    languageId: string;
    register: () => void;
    deregister: () => void;
}

export interface MonacoEditorWrapperProps extends Omit<MonacoEditorProps, 'theme'> {
    languageDefinition: MonacoLanguageDefinition;
    alwaysShowHelpText?: boolean;
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

    editorWillMount = (monaco: typeof Monaco) => {
        this.props.languageDefinition.register();
        this.props.editorWillMount?.(monaco);
    };

    editorDidMount = (editor: Monaco.editor.IStandaloneCodeEditor, monaco: typeof Monaco) => {
        this.editor = editor;

        if (this.props.onSave) {
            editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S, () => {
                this.props.onSave?.(editor.getValue());
            });
        }

        this.props.editorDidMount?.(editor, monaco);
    };

    componentWillUnmount() {
        this.props.languageDefinition.deregister();
    }

    render() {
        const props: MonacoEditorProps = {
            ...this.props,
            language: this.props.languageDefinition.languageId,
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

        if (this.props.alwaysShowHelpText) {
            props.overrideServices = {
                ...props.overrideServices,
                storageService: {
                    get() {},
                    getBoolean(key: string) {
                        if (key === 'expandSuggestionDocs') {
                            return true;
                        }

                        return false;
                    },
                    store() {},
                    onWillSaveState() {},
                    onDidChangeStorage() {},
                },
            };
        }

        return (
            <div onBlur={this.onBlur}>
                <MonacoEditor editorWillMount={this.editorWillMount} editorDidMount={this.editorDidMount} {...props} />
            </div>
        );
    }
}

export default withTheme(MonacoEditorWrapper);
