import { PluginMeta } from '@grafana/data';
import { getBackendSrv } from '@grafana/runtime';
import './css/config.css';
import appPluginConfig from '../../plugin.json';

export class PCPAppConfigCtrl {
    static templateUrl = 'components/appconfig/config.html';
    appEditCtrl: any;
    appModel?: PluginMeta;

    constructor() {
        this.appEditCtrl.setPostUpdateHook(this.postUpdate.bind(this));
    }

    async createPcpFolder(): Promise<number> {
        try {
            const folder = await getBackendSrv()
                .fetch<any>({
                    method: 'GET',
                    url: '/api/folders/performancecopilot-pcp-app',
                    showErrorAlert: false,
                })
                .toPromise();
            return folder.data.id;
        } catch (error) {
            // folder does not exist
            const folder = await getBackendSrv().post('/api/folders', {
                uid: 'performancecopilot-pcp-app',
                title: 'Performance Co-Pilot',
            });
            return folder.id;
        }
    }

    async moveDashboardToFolder(dashboardUid: string, folderId: number) {
        const getDashboardResponse = await getBackendSrv().get(`/api/dashboards/uid/${dashboardUid}`);
        if (getDashboardResponse.meta.folderId !== folderId) {
            await getBackendSrv().post('/api/dashboards/db', {
                dashboard: getDashboardResponse.dashboard,
                folderId,
                overwrite: true,
            });
        }
    }

    async moveDashboardsToPcpFolder() {
        const pcpFolderId = await this.createPcpFolder();
        const dashboardUids = appPluginConfig.includes
            .filter(i => i.type === 'dashboard')
            .map(d => d.path?.match(/\/([^/]*)\.json/)![1]);

        await Promise.all(dashboardUids.map(dashboardUid => this.moveDashboardToFolder(dashboardUid!, pcpFolderId)));
    }

    async deletePcpFolderIfEmpty() {
        let folder;
        try {
            folder = await getBackendSrv().get('/api/folders/performancecopilot-pcp-app');
        } catch (error) {
            // folder does not exist
            return;
        }

        const searchResponse = await getBackendSrv().get('/api/search', { folderIds: folder.id });
        if (searchResponse.length === 0) {
            // delete folder only if empty
            await getBackendSrv().delete('/api/folders/performancecopilot-pcp-app');
        }
    }

    async postUpdate() {
        if (this.appModel?.enabled) {
            await this.moveDashboardsToPcpFolder();
        } else {
            await this.deletePcpFolderIfEmpty();
        }
    }
}
