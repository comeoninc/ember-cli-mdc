class MDCStepperAdapter {
  /**
   * Returns true if the root element contains the given class name.
   * @param {string} className
   * @return {boolean}
   */
  hasClass (className) {}

  isLinear () {}
  hasFeedback () {}
  hasTransient () {}

  findNextStepToComplete (stepId) {}
  findPrevStepToComplete (stepId) {}

  getActiveId () {}
  activate (stepId, force) {}

  setStepCompleted (stepId) {}
  setStepError (stepId) {}

  updateTitleMessage (stepId, message) {}

  notifyStepComplete (stepId) {}
  notifyStepError (stepId, message) {}
}

export default MDCStepperAdapter;