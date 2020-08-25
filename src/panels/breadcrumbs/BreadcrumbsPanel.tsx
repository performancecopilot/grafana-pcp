import React from 'react';
import { PanelProps } from '@grafana/data';
import { Options, LinkItem } from './types';
import { Themeable, withTheme, Button, Icon, Select } from '@grafana/ui';
import {
    breadcrumbsContainer,
    breadcrumbsList,
    breadcrumbsItem,
    breadcrumbsControl,
    breadcrumbsBtn,
    notUsableContainer,
} from './styles';
import { getLocationSrv, LocationSrv } from '@grafana/runtime';

export class BreadcrumbsPanel extends React.PureComponent<PanelProps<Options> & Themeable> {
    locationSrv: LocationSrv;
    constructor(props) {
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
        return (
            <li className={breadcrumbsItem(theme)}>
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
        return (
            <li className={breadcrumbsItem(theme)}>
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
