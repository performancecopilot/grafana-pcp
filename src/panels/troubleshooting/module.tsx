import { FieldColorModeId, FieldConfigProperty, PanelPlugin } from '@grafana/data';
import { GraphFieldConfig, graphFieldOptions, LegendDisplayMode, PointVisibility } from '@grafana/ui';
import { TroubleshootingPanel } from './TroubleshootingPanel';
import { Options } from './types';

export const plugin = new PanelPlugin<Options, GraphFieldConfig>(TroubleshootingPanel)
    .useFieldConfig({
        standardOptions: {
            [FieldConfigProperty.Color]: {
                settings: {
                    byValueSupport: false,
                    bySeriesSupport: true,
                    preferThresholdsMode: false,
                },
                defaultValue: {
                    mode: FieldColorModeId.PaletteClassic,
                },
            },
        },
        useCustomConfig: builder => {
            builder
                .addSliderInput({
                    path: 'fillOpacity',
                    name: 'Fill opacity',
                    defaultValue: 10,
                    settings: {
                        min: 0,
                        max: 100,
                        step: 1,
                    },
                })
                .addRadio({
                    path: 'showPoints',
                    name: 'Show points',
                    defaultValue: PointVisibility.Never,
                    settings: {
                        options: graphFieldOptions.showPoints,
                    },
                })
                .addSliderInput({
                    path: 'pointSize',
                    name: 'Point size',
                    defaultValue: 5,
                    settings: {
                        min: 1,
                        max: 40,
                        step: 1,
                    },
                });
        },
    })
    .setPanelOptions(builder => {
        builder
            .addRadio({
                path: 'tooltipOptions.mode',
                name: 'Tooltip mode',
                description: '',
                defaultValue: 'single',
                settings: {
                    options: [
                        { value: 'single', label: 'Single' },
                        { value: 'multi', label: 'All' },
                        { value: 'none', label: 'Hidden' },
                    ],
                },
            })
            .addRadio({
                path: 'legend.displayMode',
                name: 'Legend mode',
                description: '',
                defaultValue: LegendDisplayMode.List,
                settings: {
                    options: [
                        { value: LegendDisplayMode.List, label: 'List' },
                        { value: LegendDisplayMode.Table, label: 'Table' },
                        { value: LegendDisplayMode.Hidden, label: 'Hidden' },
                    ],
                },
            })
            .addRadio({
                path: 'legend.placement',
                name: 'Legend placement',
                description: '',
                defaultValue: 'bottom',
                settings: {
                    options: [
                        { value: 'bottom', label: 'Bottom' },
                        { value: 'right', label: 'Right' },
                    ],
                },
            });
    });
