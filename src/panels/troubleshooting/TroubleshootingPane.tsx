import { cx } from '@emotion/css';
import React from 'react';
import { DataFrame, FieldType, GrafanaTheme2, PanelData } from '@grafana/data';
import { locationService } from '@grafana/runtime';
import { Button, Icon, IconButton, Modal, Stack, useTheme2 } from '@grafana/ui';
import {
    button,
    buttons,
    infoButton,
    modalArticleIcon,
    modalChildrenLinks,
    modalParentsLinks,
    modalRelativesLinksContainer,
    modalTooltipContent,
    modalTypography,
    warningButton,
} from './styles';
import { Predicate, PredicateOperator, TroubleshootingInfo } from './types';

interface Props {
    data: PanelData;
    troubleshooting: TroubleshootingInfo;
}

function navigateDashboard(dashboardUid: string) {
    locationService.push(`/d/${dashboardUid}`);
}

function renderNavigation(troubleshooting: TroubleshootingInfo, theme: GrafanaTheme2) {
    const hasParents = troubleshooting.parents && troubleshooting.parents.length > 0;
    const hasChildren = troubleshooting.children && troubleshooting.children.length > 0;
    if (!hasChildren && !hasParents) {
        return;
    }
    return (
        <Stack direction="column" gap={2}>
            <h4>
                <Icon name="chart-line" className={modalArticleIcon(theme)} />
                Related dashboards
            </h4>
            <div className={modalRelativesLinksContainer}>
                {hasParents && (
                    <div className={modalParentsLinks}>
                        <Stack direction="column" gap={2}>
                            {troubleshooting.parents!.map(parent => (
                                <Button
                                    key={parent.uid}
                                    fill="text"
                                    title={parent.title}
                                    onClick={() => navigateDashboard(parent.uid)}
                                >
                                    <Icon name="angle-left" />
                                    {parent.name}
                                </Button>
                            ))}
                        </Stack>
                    </div>
                )}
                {hasChildren && (
                    <div className={modalChildrenLinks}>
                        <Stack direction="column" gap={2}>
                            {troubleshooting.children!.map(child => (
                                <Button
                                    key={child.uid}
                                    fill="text"
                                    title={child.title}
                                    onClick={() => navigateDashboard(child.uid)}
                                >
                                    {child.name}
                                    <Icon name="angle-right" />
                                </Button>
                            ))}
                        </Stack>
                    </div>
                )}
            </div>
        </Stack>
    );
}

function renderInfoModal(troubleshooting: TroubleshootingInfo, theme: GrafanaTheme2) {
    const hasMetrics = troubleshooting.metrics.length > 0;
    const hasDerived = troubleshooting.derivedMetrics && troubleshooting.derivedMetrics.length > 0;
    const hasUrls = troubleshooting.urls && troubleshooting.urls.length > 0;

    return (
        <div className={modalTypography(theme)}>
            <Stack direction="column" gap={3}>
                {hasMetrics && (
                    <Stack direction="column" gap={2}>
                        <h4>
                            <Icon name="database" className={modalArticleIcon(theme)} />
                            PCP metrics
                        </h4>
                        <ul>
                            {troubleshooting.metrics.map(metric => (
                                <li key={metric.name}>
                                    {metric.helptext ? (
                                        <span className={modalTooltipContent(theme)} title={metric.helptext}>
                                            {metric.name}
                                        </span>
                                    ) : (
                                        metric.name
                                    )}
                                </li>
                            ))}
                        </ul>
                    </Stack>
                )}
                {hasDerived && (
                    <Stack direction="column" gap={2}>
                        <h4>
                            <Icon name="database" className={modalArticleIcon(theme)} />
                            Derived PCP metrics
                        </h4>
                        <ul>
                            {troubleshooting.derivedMetrics!.map(metric => (
                                <li key={metric.name}>
                                    {metric.name} = {metric.expr}
                                </li>
                            ))}
                        </ul>
                    </Stack>
                )}
                {hasUrls && (
                    <Stack direction="column" gap={2}>
                        <h4>
                            <Icon name="file-alt" className={modalArticleIcon(theme)} />
                            Further reading
                        </h4>
                        <ul>
                            {troubleshooting.urls!.map(url => (
                                <li key={url}>
                                    <a href={url} target="_blank" rel="noreferrer">
                                        {url}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </Stack>
                )}
                {troubleshooting.notes && (
                    <Stack direction="column" gap={2}>
                        <h4>
                            <Icon name="question-circle" className={modalArticleIcon(theme)} />
                            Notes
                        </h4>
                        <span dangerouslySetInnerHTML={{ __html: troubleshooting.notes }} />
                    </Stack>
                )}
                {renderNavigation(troubleshooting, theme)}
            </Stack>
        </div>
    );
}

function predicateDescription(predicate: Predicate) {
    return (
        <p>
            Metric <strong>{predicate.metric}</strong> has recently had a value{' '}
            <strong>
                {predicate.operator === PredicateOperator.GreaterThan ? 'above' : 'below'} {predicate.value}
            </strong>
        </p>
    );
}

function renderWarningModal(troubleshooting: TroubleshootingInfo, theme: GrafanaTheme2) {
    const hasUrls = troubleshooting.urls && troubleshooting.urls.length > 0;

    return (
        <div className={modalTypography(theme)}>
            <Stack direction="column" gap={3}>
                <Stack direction="column" gap={2}>
                    <h2>{troubleshooting.warning}</h2>
                    {troubleshooting.description && <p>{troubleshooting.description}</p>}
                </Stack>
                {troubleshooting.predicate && (
                    <Stack direction="column" gap={2}>
                        <h4>
                            <Icon name="question-circle" className={modalArticleIcon(theme)} />
                            Why is this warning shown?
                        </h4>
                        {predicateDescription(troubleshooting.predicate)}
                    </Stack>
                )}
                {hasUrls && (
                    <Stack direction="column" gap={2}>
                        <h4>
                            <Icon name="search" className={modalArticleIcon(theme)} />
                            Troubleshooting
                        </h4>
                        <ul>
                            {troubleshooting.urls!.map(url => (
                                <li key={url}>
                                    <a href={url} target="_blank" rel="noreferrer">
                                        {url}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </Stack>
                )}
                {renderNavigation(troubleshooting, theme)}
            </Stack>
        </div>
    );
}

function evaluatePredicate(series: DataFrame[], predicate: Predicate) {
    let predicateFn;
    switch (predicate.operator) {
        case PredicateOperator.GreaterThan:
            predicateFn = (val: number) => val > predicate.value;
            break;
        case PredicateOperator.LesserThan:
            predicateFn = (val: number) => val < predicate.value;
            break;
        default:
            return false;
    }

    for (const dataFrame of series) {
        for (const field of dataFrame.fields) {
            if (field.type !== FieldType.number) {
                continue;
            }

            for (let i = 0; i < field.values.length; i++) {
                if (predicateFn(field.values[i])) {
                    return true;
                }
            }
        }
    }

    return false;
}

function modalHeader(title: string) {
    return (
        <div className="modal-header-title">
            <Icon name="exclamation-triangle" size="lg" />
            <span className="p-l-1">{title}</span>
        </div>
    );
}

export const TroubleshootingPane: React.FC<Props> = (props: Props) => {
    const { data, troubleshooting } = props;
    const theme = useTheme2();
    const [openedModal, openModal] = React.useState('');
    const showWarning = troubleshooting.predicate ? evaluatePredicate(data.series, troubleshooting.predicate) : false;

    return (
        <>
            <div className={buttons}>
                <IconButton
                    name="question-circle"
                    size="lg"
                    className={cx(button(theme), infoButton(theme))}
                    onClick={() => openModal('info')}
                />
                {showWarning && (
                    <IconButton
                        name="exclamation-triangle"
                        size="lg"
                        className={cx(button(theme), warningButton(theme))}
                        onClick={() => openModal('warning')}
                    />
                )}
            </div>
            <Modal
                title={modalHeader(`${troubleshooting.name} - Information`)}
                isOpen={openedModal === 'info'}
                onDismiss={() => openModal('')}
            >
                {renderInfoModal(troubleshooting, theme)}
            </Modal>
            {showWarning && (
                <Modal
                    title={modalHeader(`${troubleshooting.name} - Warning`)}
                    isOpen={openedModal === 'warning'}
                    onDismiss={() => openModal('')}
                >
                    {renderWarningModal(troubleshooting, theme)}
                </Modal>
            )}
        </>
    );
};
