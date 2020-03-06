import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { cloneDeep, compact } from 'lodash';
import { scaleLinear } from 'd3-scale';

import ActivityYAxis from 'components/award/shared/activity/ActivityYAxis';

const propTypes = {
    height: PropTypes.number,
    padding: PropTypes.object,
    visualizationWidth: PropTypes.number,
    transactions: PropTypes.array
};

const ContractGrantsActivityChart = ({
    height,
    padding,
    visualizationWidth,
    transactions
}) => {
    // x series
    const [xDomain, setXDomain] = useState([0, 0]);
    // y series
    const [yDomain, setYDomain] = useState([0, 0]);
    // x scale
    // const [xScale, setXScale] = useState(null);
    // y scale
    const [yScale, setYScale] = useState(null);
    // x ticks
    // const [xTicks, setXTicks] = useState([]);
    // y ticks
    const [yTicks, setYTicks] = useState([]);
    /**
     * createXSeries
     * - creates the x domain and updates state
     * @returns {null}
     */
    const createXDomain = useCallback(() => {
        const clonedTransactions = cloneDeep(transactions);
        clonedTransactions.sort((a, b) => a.action_date.valueOf() - b.action_date.valueOf());
        setXDomain(
            [
                clonedTransactions[0].action_date.valueOf(),
                clonedTransactions[clonedTransactions.length - 1].action_date.valueOf()
            ]
        );
    }, [transactions]);
    /**
     * createYSeries
     * - creates the y domain and updates state
     * @returns {null}
     */
    const createYDomain = useCallback(() => {
        const clonedTransactions = cloneDeep(transactions);
        clonedTransactions.sort(
            (a, b) => a.federal_action_obligation - b.federal_action_obligation);
        setYDomain(
            [
                clonedTransactions[0].federal_action_obligation,
                clonedTransactions[clonedTransactions.length - 1].federal_action_obligation
            ]
        );
    }, [transactions]);
    // hook - runs only on mount unless transactions change
    useEffect(() => {
        createXDomain();
        createYDomain();
    }, [
        transactions,
        createXDomain,
        createYDomain
    ]);
    /**
     * addLastTickForSpacing
     * - We want to add spacing to the top of the chart based off of the design.
     * To add this space we will add an additional tick to the y-axis by
     * finding the average difference between the ticks and add that to
     * the last tick.
     * @param {Number[]} - an array of numbers.
     * @returns {Number[]} - an array of numbers.
     */
    const addTicksForSpacing = (ticks, first) => {
        if (!ticks.length) return [];
        const updatedTicks = cloneDeep(ticks);
        const differences = compact(ticks.reverse().map((tick, i) => {
            // we do not use the last tick
            if (ticks.length === i + 1) return null;
            return tick - ticks[i + 1];
        }));
        // average difference
        const averageDifference = differences
            .reduce((acc, data) => acc + data, 0) / differences.length;
        // subtracts the average difference from the first tick and updates the tick array
        if (first) updatedTicks.splice(0, 0, updatedTicks[0] - averageDifference);
        // adds the average difference to the last tick and updates the tick array
        updatedTicks.push(updatedTicks[updatedTicks.length - 1] + averageDifference);
        return updatedTicks;
    };
    /**
     * createxScale
     * - creates the x scaling function and updates state
     * @returns {null}
     */
    // const createXScaleAndTicks = useCallback(() => {
    //     const scale = scaleLinear().domain(xDomain).range([0, visualizationWidth]).nice();
    //     const ticks = scale.ticks(6);
    //     // add last tick for spacing
    //     const updatedTicksWithSpacing = addTicksForSpacing(ticks, true);
    //     // create new scale since we have new data
    //     const updatedScale = scaleLinear()
    //         .domain([xDomain[0], updatedTicksWithSpacing[updatedTicksWithSpacing.length - 1]])
    //         .range([0, visualizationWidth])
    //         .nice();
    //     setXTicks(updatedTicksWithSpacing);
    //     setXScale(() => updatedScale);
    // }, [xDomain, visualizationWidth]);
    /**
     * createYScale
     * - creates the y scaling function and ticks.
     * @returns {null}
     */
    const createYScaleAndTicks = useCallback(() => {
        const scale = scaleLinear().domain(yDomain).range([0, height]).nice();
        // determine the ticks from D3
        const ticks = scale.ticks(6);
        // add last tick for spacing
        const updatedTicksWithSpacing = addTicksForSpacing(ticks);
        // create new scale since we have new data
        const updatedScale = scaleLinear()
            .domain([yDomain[0], updatedTicksWithSpacing[updatedTicksWithSpacing.length - 1]])
            .range([0, height])
            .nice();
        setYTicks(updatedTicksWithSpacing);
        setYScale(() => updatedScale);
    }, [yDomain, height]);
    // hook - runs only on mount unless transactions change
    useEffect(() => {
        if (xDomain.length && yDomain.length) {
            // createXScaleAndTicks(xDomain);
            createYScaleAndTicks(yDomain);
        }
    }, [
        transactions,
        // createXScaleAndTicks,
        createYScaleAndTicks,
        xDomain,
        yDomain
    ]);
    // Adds padding bottom and 40 extra pixels for the x-axis
    const svgHeight = height + padding.bottom + 40;
    // updates the x position of our labels
    const paddingForYAxis = Object.assign(padding, { labels: 20 });

    return (
        <svg
            className="contract-grant-activity-chart"
            width={visualizationWidth}
            height={svgHeight}>
            <g className="contract-grant-activity-chart__body" transform="translate(0,10)">
                <ActivityYAxis
                    height={height}
                    width={visualizationWidth}
                    padding={paddingForYAxis}
                    scale={yScale}
                    ticks={yTicks}
                    textAnchor="left" />
            </g>
        </svg>
    );
};

ContractGrantsActivityChart.propTypes = propTypes;

export default ContractGrantsActivityChart;
