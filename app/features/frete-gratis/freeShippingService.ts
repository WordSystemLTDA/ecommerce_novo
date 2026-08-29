import apiClient from '~/services/api';
import type {
  FreeShippingStatus,
  FreeShippingStatusResponse,
} from './types';

export const freeShippingService = {
  getStatus: async (): Promise<FreeShippingStatus> => {
    const response = await apiClient.get<FreeShippingStatusResponse>(
      '/frete-gratis/status',
    );

    return response.data.data;
  },
};
