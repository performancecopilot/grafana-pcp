import { PanelProps } from '@grafana/data';
import { getLocationSrv, LocationSrv } from '@grafana/runtime';
import { Button, Icon, Select, Themeable, withTheme } from '@grafana/ui';
import React from 'react';
import {
    breadcrumbsBtn,
    breadcrumbsContainer,
    breadcrumbsControl,
    breadcrumbsCurrentItem,
    breadcrumbsItem,
    breadcrumbsList,
    notUsableContainer,
} from './styles';
import { LinkItem, Options } from './types';

export class BreadcrumbsPanel extends React.PureComponent<PanelProps<Options> & Themeable> {
    locationSrv: LocationSrv;
    constructor(props: PanelProps<Options> & Themeable) {
        super(props);
        this.navigateDashboard = this.navigateDashboard.bind(this);
        this.renderBreadcrumbLink = this.renderBreadcrumbLink.bind(this);
        this.renderBreadcrumbSelect = this.renderBreadcrumbSelect.bind(this);
        this.renderNotUsable = this.renderNotUsable.bind(this);
        this.locationSrv = getLocationSrv();
    }
    navigateDashboard(dashboardUid: string) {
        const path = `/d/${dashboardUid}`;
        this.locationSrv.update({
            path,
        });
    }
    renderBreadcrumbLink(item: LinkItem) {
        const { navigateDashboard, props } = this;
        const { theme } = props;
        const hasCurrent = item.current ?? false;
        return (
            <li className={`${breadcrumbsItem(theme)} ${hasCurrent ? breadcrumbsCurrentItem(theme) : ''}`}>
                <Button
                    size="md"
                    variant="link"
                    className={breadcrumbsBtn(theme)}
                    onClick={() => navigateDashboard(item.uid)}
                    title={item.title}
                >
                    {item.name}
                </Button>
            </li>
        );
    }
    renderBreadcrumbSelect(items: LinkItem[]) {
        const { navigateDashboard, props } = this;
        const { theme } = props;
        const selectedItem = items.find(item => item.active);
        const hasCurrent = items.some(item => item.current);
        return (
            <li className={`${breadcrumbsItem(theme)} ${hasCurrent ? breadcrumbsCurrentItem(theme) : ''}`}>
                <Select
                    className={breadcrumbsControl(theme)}
                    options={items.map(item => ({ value: item.uid, label: item.name }))}
                    value={selectedItem?.uid ?? ''}
                    onChange={({ value, label }) => navigateDashboard(value as string)}
                />
            </li>
        );
    }
    renderNotUsable(width: number, height: number) {
        return (
            <div className={notUsableContainer(width, height)}>
                <p>PCP Breadcrumbs panel is not intended for use in user defined dashboards.</p>
            </div>
        );
    }
    render() {
        const { renderBreadcrumbLink, renderBreadcrumbSelect, renderNotUsable, props } = this;
        const { theme, options, width, height } = props;

        if (!options.scripted) {
            return renderNotUsable(width, height);
        }

        const depthList = options.items;
        const itemCount = depthList.length;
        if (itemCount === 0) {
            return <p>No items specified.</p>;
        }
        return (
            <nav className={breadcrumbsContainer(theme)}>
                <ul className={breadcrumbsList(theme)}>
                    {depthList.map((depth, index) => {
                        return (
                            <>
                                {depth.length === 1 ? renderBreadcrumbLink(depth[0]) : renderBreadcrumbSelect(depth)}
                                {index !== itemCount - 1 && (
                                    <li className={breadcrumbsItem(theme)}>
                                        <Icon name="angle-right" />
                                    </li>
                                )}
                            </>
                        );
                    })}
                </ul>
            </nav>
        );
    }
}

export default withTheme(BreadcrumbsPanel);
