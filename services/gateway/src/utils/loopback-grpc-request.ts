import { firstValueFrom, Observable } from 'rxjs';

export const loopbackGrpcRequest = async <T>(
  requestFunc: Observable<T>,
  maxRetry = 2,
) => {
  let count = 1;
  while (count <= maxRetry) {
    try {
      return await firstValueFrom(requestFunc);
    } catch (error) {
      count++;
      if (error.details?.includes('RST_STREAM')) continue;
      else break;
    }
  }

  return firstValueFrom(requestFunc);
};
