export enum TokenUsageStatus {
  Normal = 0,
  ThrottledTenant = 1,
  ThrottledSite = 2,
  ThrottledUser = 3,
}

export enum StreamingStatusEnum {
  OFF = 0,
  CONVO = 10,
  PENDING = 20,
  STREAMING = 30,
  SHOULD_ABORT = 40,
  ABORT = 50,
  ERROR = 60,
}
