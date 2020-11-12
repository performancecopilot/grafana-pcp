import { SeriesPingResponse } from 'common/services/pmseries/types';

export function ping(success = true): SeriesPingResponse {
    return { success };
}
