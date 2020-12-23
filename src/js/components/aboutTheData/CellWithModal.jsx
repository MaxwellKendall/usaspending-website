/**
 * CellWithModal.jsx
 * Created by Lizzie Salita 11/23/20
 */

import React from 'react';
import PropTypes, { oneOfType, oneOf } from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const propTypes = {
    data: oneOfType([PropTypes.string, PropTypes.object]),
    openModal: PropTypes.func.isRequired,
    modalType: oneOf(['publicationDates', 'missingAccountBalance', 'reportingDifferences']).isRequired,
    agencyData: PropTypes.object
};

const CellWithModal = ({
    data, openModal, modalType, agencyData
}) => {
    const modalClick = () => openModal(modalType, agencyData);
    return (
        <div className="action-cell">
            <span className="action-cell__text">
                {data}
            </span>
            <button className="action-cell__button" onClick={modalClick} title="Open modal">
                <FontAwesomeIcon icon="expand-alt" />
            </button>
        </div>
    );
};

CellWithModal.propTypes = propTypes;
export default CellWithModal;
