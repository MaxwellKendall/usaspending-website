/**
 * SummaryBar.jsx
 * Created by Emily Gullo 01/20/2017
 **/

import React from 'react';
import moment from 'moment';
import _ from 'lodash';
import * as SummaryPageHelper from 'helpers/summaryPageHelper';
import InfoSnippet from './InfoSnippet';
import MoreHeaderOptions from './MoreHeaderOptions';

const propTypes = {
    selectedAward: React.PropTypes.object
};

export default class SummaryBar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            status: ""
        };

        this.getStatus = this.getStatus.bind(this);
    }

    componentWillMount() {
        this.getStatus(this.props.selectedAward);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.selectedAward.id !== this.props.selectedAward.id) {
            this.getStatus(nextProps.selectedAward);
        }
    }

    getStatus(award) {
        const awardStart = moment(award.period_of_performance_start_date, 'MM-DD-YYYY');
        const awardEnd = moment(award.period_of_performance_current_end_date, 'MM-DD-YYYY');
        const current = moment();
        let progress = "";
        const awardType = _.capitalize(SummaryPageHelper.awardType(award.award_type));
        let parentId = null;

        if (current.isSameOrBefore(awardStart, 'day')) {
            progress = "Awarded";
        }
        else if (current.isSameOrAfter(awardEnd, 'day')) {
            progress = "Complete";
        }
        else {
            progress = "In Progress";
        }

        if (award.parent_id) {
            parentId = award.parent_id;
        }
        else if (!award.parent_award && award.type !== "D") {
            parentId = "Not Available";
        }
        else {
            parentId = null;
        }

        this.setState({
            status: progress,
            type: awardType,
            parent: parentId
        });
    }

    render() {
        let parentAwardId = null;
        if (this.props.selectedAward.type !== "D" && this.state.parent !== null) {
            parentAwardId = (
                <InfoSnippet
                    label="Parent Award ID"
                    value={this.state.parent} />);
        }
        return (
            <div className="page-title-bar">
                <div className="page-title-bar-wrap">
                    <h1 className="page-title">{this.state.type}
                        &nbsp;Summary</h1>
                    <div className="summary-status">
                        <ul className="summary-status-items">
                            <InfoSnippet
                                label="Award ID"
                                value={this.props.selectedAward.award_id} />
                            { parentAwardId }
                            <InfoSnippet
                                label="Status"
                                value={this.state.status} />
                        </ul>
                        <MoreHeaderOptions />
                    </div>
                </div>
            </div>
        );
    }
}
SummaryBar.propTypes = propTypes;