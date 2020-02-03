// All url parameters are available via the ARGS object
declare var ARGS: any;

export class ChecklistDashboard {
    async getDashboard() {
        const section = ARGS.section || "General";
        const dashboard: any = {
            title: `Checklist: ${section}`,
            time: {
                from: "now-6h",
                to: "now"
            },
            rows: [],
        };

        dashboard.rows.push({
            panels: [{
                type: "text",
                mode: "markdown",
                title: "Sections",
                content: `[CPU](/dashboard/script/checklist.js?section=CPU) [RAM](/dashboard/script/checklist.js?section=RAM)`,
                fill: 1,
                gridPos: {
                    h: 10,
                    w: 24,
                    x: 0,
                    y: 10,
                },
            }]
        });
        dashboard.rows.push({
            title: 'Chart',
            height: '300px',
            panels: [{
                title: `Metrics of ${section}`,
                type: 'graph',
                span: 12,
                fill: 1,
                linewidth: 2,
                datasource: "-- Grafana --",
                targets: [{
                    'target': "randomWalk('random walk2')"
                }],
                tooltip: {
                    shared: true
                }
            }]
        });
        return dashboard;
    }
}
