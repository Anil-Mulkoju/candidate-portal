import { describe, expect, it } from "vitest";
import { actionRequestApi } from "./actionRequestApi";
import { jobApi } from "./jobApi";

describe("API contract updates", () => {
  it("uses the unified action-request review endpoint", () => {
    expect(actionRequestApi.endpoints.reviewActionRequest).toBeDefined();
    expect(actionRequestApi.endpoints.approveActionRequest).toBeUndefined();
    expect(actionRequestApi.endpoints.rejectActionRequest).toBeUndefined();
  });

  it("uses the unified job hold-status endpoint", () => {
    expect(jobApi.endpoints.updateJobHoldStatus).toBeDefined();
    expect(jobApi.endpoints.holdJob).toBeUndefined();
    expect(jobApi.endpoints.reopenJob).toBeUndefined();
  });
});
