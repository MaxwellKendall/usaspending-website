/**
 * VerticalLine.jsx
 * Created by Jonathan Hill 07/05/19
 **/

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { throttle } from 'lodash';

const propTypes = {
    xScale: PropTypes.func, // function to set line position
    text: PropTypes.string, // text to display with line
    y1: PropTypes.number, // top of graph
    y2: PropTypes.number, // bottom of graph
    xMax: PropTypes.number, // max possible value of x
    xMin: PropTypes.number, // max possible value of x
    xValue: PropTypes.number, // actual value of x
    showTextPosition: PropTypes.string, // show text left, right, and top are valid
    textY: PropTypes.number, // show text at this height
    description: PropTypes.string,
    adjustmentX: PropTypes.number // adjust x for padding
};

export default class VerticalLine extends Component {
    constructor(props) {
        super(props);

        this.state = {
            textX: 0,
            textY: props.textY,
            windowWidth: null
        };
        this.handleWindowResize = throttle(this.handleWindowResize.bind(this), 50);
        this.textDiv = null;
        // React will call this function when the DOM draws it ( React Callback Refs )
        this.setTextDiv = (element) => {
            this.textDiv = element;
            this.positionText();
        };
    }

    componentDidMount() {
        this.handleWindowResize();
        window.addEventListener('resize', this.handleWindowResize);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleWindowResize);
    }
    // since we set the position of the text we need to update it on window resize
    handleWindowResize() {
        const windowWidth = window.innerWidth;
        if (this.state.windowWidth !== windowWidth) {
            this.setState({ windowWidth });
            this.positionText();
        }
    }

    positionText() {
        const {
            xScale,
            xValue,
            showTextPosition,
            textY,
            adjustmentX
        } = this.props;
        let positionX = xScale(xValue || Date.now()) + (adjustmentX || 0);
        let modifiedTextY = textY;
        // the text div starts null since React only calls the callback ref function
        // when the DOM draws the element, without this you will get an error since
        // we will be call properties on null
        if (this.textDiv) {
            const textDivDimensions = this.textDiv.getBoundingClientRect();
            const width = textDivDimensions.width;
            if (showTextPosition === 'left') positionX -= (width + 4);
            if (showTextPosition === 'right') positionX += 4;
            if (showTextPosition === 'top') {
                modifiedTextY -= 15;
                positionX -= (width / 2);
            }
        }
        this.setState({ textX: positionX, textY: modifiedTextY });
    }

    render() {
        const {
            text,
            y1,
            y2,
            xValue,
            xMax,
            xMin,
            adjustmentX,
            xScale
        } = this.props;
        // show nothing if not within x Range
        if ((xValue > xMax) && (xValue < xMin)) return null;
        const description = this.props.description || 'A vertical line representing today\'s date';
        const linePosition = xScale(xValue || Date.now()) + (adjustmentX || 0);
        return (
            <g className="vertical-line__container">
                <desc>{description}</desc>
                <text
                    id="vertical-line__text"
                    x={this.state.textX}
                    y={this.state.textY}
                    ref={this.setTextDiv}>
                    {text || 'Today'}
                </text>
                <line
                    id="vertical-line"
                    x1={linePosition}
                    x2={linePosition}
                    y1={y1}
                    y2={y2} />
            </g>
        );
    }
}

VerticalLine.propTypes = propTypes;