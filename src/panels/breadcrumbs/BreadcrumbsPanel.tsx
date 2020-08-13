import React from 'react';
import { PanelProps } from '@grafana/data';
import { Options, BreadcrumbsItem } from './types';
import { Themeable, withTheme, Button, Icon, Select } from '@grafana/ui';
import { breadcrumbsContainer, breadcrumbsList, breadcrumbsItem, breadcrumbsControl, breadcrumbsBtn } from './styles';
import { cx } from 'emotion';
import { getLocationSrv, LocationSrv } from '@grafana/runtime';

export class BreadcrumbsPanel extends React.PureComponent<PanelProps<Options> & Themeable> {
    locationSrv: LocationSrv;
    constructor(props) {
        super(props);
        this.onBreadcrumbClick = this.onBreadcrumbClick.bind(this);
        this.locationSrv = getLocationSrv();
    }
    onBreadcrumbClick(item: BreadcrumbsItem) {
        const path = `/d/${item.dashboardId}`;
        this.locationSrv.update({
            path,
        });
    }
    render() {
        const { onBreadcrumbClick, props } = this;
        const { theme, options } = props;
        const { items } = options;
        const itemCount = items.length;
        if (itemCount === 0) {
            return <p>No items specified.</p>;
        }
        return (
            <nav className={breadcrumbsContainer(theme)}>
                <ul className={breadcrumbsList(theme)}>
                    {items.map((item, index) => (
                        <>
                            <li className={breadcrumbsItem(theme)}>
                                {item.opts.length === 0 ? (
                                    <Button
                                        size="md"
                                        variant="link"
                                        className={cx(breadcrumbsBtn(theme))}
                                        onClick={() => onBreadcrumbClick(item)}
                                    >
                                        {item.title}
                                    </Button>
                                ) : (
                                    <Select
                                        className={breadcrumbsControl(theme)}
                                        options={item.opts.map(opt => ({ label: opt.title, value: opt.dashboardId }))}
                                        value={item.dashboardId}
                                        onChange={({ label, value }) =>
                                            onBreadcrumbClick({ title: label!, dashboardId: value!, opts: [] })
                                        }
                                    />
                                )}
                            </li>
                            {index !== itemCount - 1 && (
                                <li className={breadcrumbsItem(theme)}>
                                    <Icon name="angle-right" />
                                </li>
                            )}
                        </>
                    ))}
                </ul>
            </nav>
        );
    }
}

export default withTheme(BreadcrumbsPanel);
