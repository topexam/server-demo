import { status } from '@grpc/grpc-js';
import { HttpStatus } from '@nestjs/common';

export const ErrorStatusMapper = {
  [status.CANCELLED]: HttpStatus.BAD_REQUEST,
  [status.UNKNOWN]: HttpStatus.BAD_GATEWAY,
  [status.INVALID_ARGUMENT]: HttpStatus.UNPROCESSABLE_ENTITY,
  [status.DEADLINE_EXCEEDED]: HttpStatus.REQUEST_TIMEOUT,
  [status.NOT_FOUND]: HttpStatus.NOT_FOUND,
  [status.ALREADY_EXISTS]: HttpStatus.CONFLICT,
  [status.PERMISSION_DENIED]: HttpStatus.FORBIDDEN,
  [status.RESOURCE_EXHAUSTED]: HttpStatus.TOO_MANY_REQUESTS,
  [status.FAILED_PRECONDITION]: HttpStatus.PRECONDITION_REQUIRED,
  [status.ABORTED]: HttpStatus.METHOD_NOT_ALLOWED,
  [status.OUT_OF_RANGE]: HttpStatus.PAYLOAD_TOO_LARGE,
  [status.UNIMPLEMENTED]: HttpStatus.NOT_IMPLEMENTED,
  [status.INTERNAL]: HttpStatus.INTERNAL_SERVER_ERROR,
  [status.UNAVAILABLE]: HttpStatus.NOT_FOUND,
  [status.DATA_LOSS]: HttpStatus.INTERNAL_SERVER_ERROR,
  [status.UNAUTHENTICATED]: HttpStatus.UNAUTHORIZED,
};
