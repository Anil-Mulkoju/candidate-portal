import candidateReducer, {
  candidateUpdateFormData,
  candidateSetInitialData,
} from "./candidateSlice";

describe("candidate slice form data", () => {
  it("updates a named section in form data", () => {
    const state = candidateReducer(undefined, { type: "@@INIT" });

    const nextState = candidateReducer(
      state,
      candidateUpdateFormData({ section: "basicDetails", updates: { first_name: "Asha" } })
    );

    expect(nextState.formData.basicDetails).toEqual({ first_name: "Asha" });
  });

  it("stores initial candidate details in the form state", () => {
    const state = candidateReducer(undefined, { type: "@@INIT" });

    const nextState = candidateReducer(
      state,
      candidateSetInitialData({ first_name: "Ravi", last_name: "Kumar" })
    );

    expect(nextState.formData.candidateDetails).toEqual({
      first_name: "Ravi",
      last_name: "Kumar",
    });
  });
});
