/**
 * FinancialAssistanceContent.jsx
 * Created by David Trinh 10/9/2018
 **/

import React from 'react';
import PropTypes from 'prop-types';
import { startCase } from "lodash";

import { Glossary } from 'components/sharedComponents/icons/Icons';
import { glossaryLinks } from 'dataMapping/search/awardType';
import AwardAmountsSectionContainer from '../../../containers/awardV2/shared/AwardAmountsSectionContainer';
import AwardRecipient from '../shared/overview/AgencyRecipient';
import AwardDates from '../shared/overview/AwardDates';
import { AwardSection } from '../shared';
import ComingSoonSection from "../shared/ComingSoonSection";

const propTypes = {
    awardId: PropTypes.string,
    overview: PropTypes.object,
    jumpToSection: PropTypes.func
};

const defaultTooltipProps = {
    controlledProps: {
        isControlled: true,
        isVisible: false,
        closeCurrentTooltip: () => console.log("close tooltip"),
        showTooltip: () => console.log("open tooltip")
    }
};

export default class FinancialAssistanceContent extends React.Component {
    render() {
        const glossarySlug = glossaryLinks[this.props.overview.type];
        let glossaryLink = null;
        if (glossarySlug) {
            glossaryLink = (
                <a href={`/#/award_v2/${this.props.awardId}?glossary=${glossarySlug}`}>
                    <Glossary />
                </a>
            );
        }
        // TODO: Determine if we should label with FAIN/ URI instead of ID
        return (
            <div className="award award-financial-assistance">
                <div className="award__heading">
                    <div className="award__heading-text">{startCase(this.props.overview.typeDescription)}</div>
                    <div className="award__heading-icon">
                        {glossaryLink}
                    </div>
                    <div className="award__heading-id">
                        <div className="award__heading-label">{this.props.overview.id ? 'ID' : ''}</div>
                        <div>{this.props.overview.id}</div>
                    </div>
                </div>
                <hr className="award__divider" />
                <div className="award__row award-overview" id="award-overview">
                    <AwardRecipient
                        jumpToSection={this.props.jumpToSection}
                        awardingAgency={this.props.overview.awardingAgency}
                        category={this.props.overview.category}
                        recipient={this.props.overview.recipient} />
                    <div className="award__col award-amountdates">
                        <AwardDates
                            overview={this.props.overview} />
                    </div>
                </div>
                <AwardSection type="row">
                    <AwardSection type="column">
                        <AwardAmountsSectionContainer
                            tooltipProps={defaultTooltipProps}
                            jumptoSection={this.props.jumpToSection} />
                    </AwardSection>
                    <ComingSoonSection title="Description" includeHeader />
                </AwardSection>
            </div>
        );
    }
}
FinancialAssistanceContent.propTypes = propTypes;
