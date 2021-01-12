import React from 'react';
import { Set } from 'immutable';
import { render, screen } from '@test-utils';

import TimeFilters from 'components/aboutTheData/TimeFilters';
import * as withLatestAccount from "containers/account/WithLatestFy";
import * as accountHelpers from 'helpers/accountHelper';
import * as glossaryHelpers from 'helpers/glossaryHelper';
import { mockGlossary, mockSubmissions } from '../../mockData';

const defaultProps = {
    urlPeriod: '12',
    urlFy: '2020',
    activeTab: 'details', // or dates
    onTimeFilterSelection: jest.fn(),
    selectedPeriod: null,
    selectedFy: null
};

const q4Fy2020 = {
    period_start_date: "2020-09-01T00:00:00Z", period_end_date: "2020-09-30T00:00:00Z", submission_start_date: "2020-10-19T00:00:00Z", submission_due_date: "2020-11-17T00:00:00Z", certification_due_date: "2020-11-17T00:00:00Z", submission_reveal_date: "2020-11-17T00:00:00Z", submission_fiscal_year: 2020, submission_fiscal_quarter: 4, submission_fiscal_month: 12, is_quarter: false
};

const periodsAsSet = new Set([...mockSubmissions, q4Fy2020]);

beforeEach(() => {
    jest.spyOn(accountHelpers, 'fetchAllSubmissionDates').mockReturnValue({
        promise: Promise.resolve({ data: { available_periods: [...mockSubmissions, q4Fy2020] } }),
        cancel: () => {
            console.log('cancel called');
        }
    });
    jest.spyOn(withLatestAccount, "useLatestAccountData").mockReturnValue([
        accountHelpers.getLatestPeriodAsMoment(periodsAsSet.toJS()),
        periodsAsSet,
        accountHelpers.getLatestPeriod(periodsAsSet.toJS())
    ]);
    jest.spyOn(glossaryHelpers, 'fetchAllTerms').mockReturnValue({
        promise: Promise.resolve(mockGlossary),
        cancel: () => {
            console.log('cancel called');
        }
    });
});

test('Submission Details table shows period picker', async () => {
    render(<TimeFilters {...defaultProps} />);
    expect(screen.queryByText('PERIOD')).toBeDefined();
});

test('Publication Dates table does not show period picker', async () => {
    render(<TimeFilters {...defaultProps} activeTab="dates" />);
    expect(screen.queryByText('PERIOD')).toBeNull();
});

test('Validates fiscal year from url', async () => {
    // bad fiscal year:
    const mockOnTimeSelection = jest.fn();
    render(<TimeFilters {...defaultProps} onTimeFilterSelection={mockOnTimeSelection} urlFy="1990" />);
    expect(mockOnTimeSelection).toHaveBeenCalledWith("2020", { className: "last-period-per-quarter", id: "12", title: "Q4 P12" });
});

test('Validates period from url', async () => {
    const mockOnTimeSelection = jest.fn();
    render(<TimeFilters {...defaultProps} onTimeFilterSelection={mockOnTimeSelection} urlFy="2020" urlPeriod="13" />);
    expect(mockOnTimeSelection).toHaveBeenCalledWith("2020", { className: "last-period-per-quarter", id: "12", title: "Q4 P12" });
});
