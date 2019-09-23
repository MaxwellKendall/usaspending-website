/**
  * awardHistoryHelper.js
  * Created by Max Kendall 09/18/19
  **/

/* eslint-disable import/prefer-default-export */
import Axios, { CancelToken } from 'axios';
import kGlobalConstants from 'GlobalConstants';

/**
 * @param type: oneOf(['subaward', 'transaction', 'federal_account'])
 */
export const getAwardHistoryCounts = (type, awardId) => {
    const source = CancelToken.source();
    return {
        promise: Axios.request({
            url: `v2/awards/count/${type}/${awardId}`,
            baseURL: kGlobalConstants.API,
            method: 'post',
            data: { award_id: awardId },
            cancelToken: source.token
        }),
        cancel() {
            source.cancel();
        }
    };
};
