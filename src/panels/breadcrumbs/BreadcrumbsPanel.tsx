import React from 'react';
import { PanelProps } from '@grafana/data';
import { Options, LinkItem } from './types';
import { Themeable, withTheme, Button, Icon, Select } from '@grafana/ui';
import { breadcrumbsContainer, breadcrumbsList, breadcrumbsItem, breadcrumbsControl, breadcrumbsBtn } from './styles';
import { getLocationSrv, LocationSrv } from '@grafana/runtime';

export class BreadcrumbsPanel extends React.PureComponent<PanelProps<Options> & Themeable> {
    locationSrv: LocationSrv;
    constructor(props) {
        super(props);
        this.onBreadcrumbClick = this.onBreadcrumbClick.bind(this);
        this.renderBreadcrumbLink = this.renderBreadcrumbLink.bind(this);
        this.renderBreadcrumbSelect = this.renderBreadcrumbSelect.bind(this);
        this.locationSrv = getLocationSrv();
    }
    onBreadcrumbClick(item: LinkItem) {
        const path = `/d/${item.uid}`;
        this.locationSrv.update({
            path,
        });
    }
    renderBreadcrumbLink(item: LinkItem) {
        const { onBreadcrumbClick, props } = this;
        const { theme } = props;
        return (
            <li className={breadcrumbsItem(theme)}>
                <Button
                    size="md"
                    variant="link"
                    className={breadcrumbsBtn(theme)}
                    onClick={() => onBreadcrumbClick(item)}
                >
                    {item.title}
                </Button>
            </li>
        );
    }
    renderBreadcrumbSelect(items: LinkItem[]) {
        const { onBreadcrumbClick, props } = this;
        const { theme } = props;
        const selectedItem = items.find(item => item.active);
        return (
            <li className={breadcrumbsItem(theme)}>
                <Select
                    className={breadcrumbsControl(theme)}
                    options={items.map(item => ({ value: item.uid, label: item.title }))}
                    value={selectedItem?.uid ?? ''}
                    onChange={({ value, label }) => onBreadcrumbClick({ uid: value!, title: label! })}
                />
            </li>
        );
    }
    render() {
        const { renderBreadcrumbLink, renderBreadcrumbSelect, props } = this;
        const { theme, options } = props;
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
