import { cssClasses, strings, datasetAttributes, states } from "./constants";

const { MDCFoundation } = mdc.base;

class MDCStepFoundation extends MDCFoundation {
  static get cssClasses() {
    return cssClasses;
  }

  static get strings () {
    return strings;
  }

  static get datasetAttributes () {
    return datasetAttributes;
  }

  static get states () {
    return states;
  }

  static get defaultAdapter () {
    return /** @type {!MDCStepAdapter} */ ({
      hasClass: (className) => {},
      addClass: (className) => {},
      removeClass: (className) => {}
    });
  }

  setActive (isActive) {
    if (isActive) {
      this.adapter_.removeClass (MDCStepFoundation.cssClasses.TRANSIENT);
      this.adapter_.addClass (MDCStepFoundation.cssClasses.IS_ACTIVE);
    }
    else {
      this.adapter_.removeClass (MDCStepFoundation.cssClasses.IS_ACTIVE);
    }
  }

  isOptional () {
    return this.adapter_.hasClass (MDCStepFoundation.cssClasses.OPTIONAL);
  }

  isEditable () {
    return this.adapter_.hasClass (MDCStepFoundation.cssClasses.EDITABLE);
  }

  isActive () {
    return this.adapter_.hasClass (MDCStepFoundation.cssClasses.IS_ACTIVE);
  }

  isCompleted () {
    return this.adapter_.hasClass (MDCStepFoundation.cssClasses.COMPLETED);
  }

  isError () {
    return this.adapter_.hasClass (MDCStepFoundation.cssClasses.ERROR);
  }

  isNormal () {
    return !this.adapter_.isCompleted () && !this.isError ();
  }

  removeTransientEffect () {
    return this.adapter_.removeTransientEffect ();
  }

  handleInteraction (evt) {
    const isClick = evt.type === 'click';
    const isEnter = evt.key === 'Enter' || evt.keyCode === 13;

    if (isClick || isEnter) {
      const action = this.adapter_.getActionFromEvent (evt);

      if (action === 'next') {
        this.next ();
      }
      else if (action === 'cancel') {
        this.cancel ();
      }
      else if (action === 'skip') {
        this.skip ();
      }
      else if (action === 'back') {
        this.back ();
      }
    }
  }

  /**
   * Defines current step state to "completed" and move active to the next.
   * This operation can returns false if it does not advance the step.
   *
   * @return {boolean}
   */
  next () {
    // The step is not active. There is no need to continue.
    if (!this.isActive ())
      return false;

    // Let's prepare this step before moving to the next step. First, we need to
    // remove the (feedback) transient effect. Afterwards, we need to reset the
    // label message text based on the error state.

    if (this.adapter_.hasFeedback ())
      this.adapter_.removeTransientEffect ()

    if (this.isError ()) {
      // Case the current state of step is "error", update the error message
      // to the original title message or just remove it.
      let labelTitleMessageText = this.adapter_.getLabelTitleMessageText ();

      if (!!labelTitleMessageText) {
        this.updateTitleMessage (labelTitleMessageText);
      }
      else {
        this.adapter_.removeTitleMessage ();
      }
    }

    // We can now notify the listeners that the next button was pressed. The
    // stepper will handle the reset of the transition for us.
    this.adapter_.notifyNext ();

    return true;
  }

  back () {
    if (!this.isActive ())
      return false;

    // Let's prepare this step before moving to the next step. First, we need to
    // remove the (feedback) transient effect. Afterwards, we need to reset the
    // label message text based on the error state.

    if (this.adapter_.hasFeedback ())
      this.adapter_.removeTransientEffect ();

    this.adapter_.notifyBack ();
  }

  cancel () {
    // The step is not active. There is no need to continue.
    if (!this.isActive ())
      return false;

    this.adapter_.notifyCancel ();
  }

  /**
   * Move "active" to the next if the current step is optional. This operation can returns false
   * if it does not advances the step.
   *
   * @return {boolean}
   */
  skip () {
    if (!this.isActive ())
      return false;

    if (!this.isOptional ())
      return false;

    if (this.adapter_.hasFeedback ()) {
      this.adapter_.removeTransientEffect ()
    }

    this.adapter_.notifySkip ()
    return true;
  }

  updateTitleMessage (message) {
    this.adapter_.updateTitleMessage (message);
  }

  removeTitleMessage () {
    this.adapter_.removeTitleMessage ();
  }

  setStepCompleted () {
    return !this.adapter_.hasClass (MDCStepFoundation.states.COMPLETED) ? this.updateState_ (MDCStepFoundation.states.COMPLETED) : false;
  }

  setStepError () {
    return !this.adapter_.hasClass (MDCStepFoundation.states.ERROR) ? this.updateState_ (MDCStepFoundation.states.ERROR) : false;
  }

  updateState_ (state) {
    // Case the current step state to change is "completed",
    // we can decrement the total number of completed.

    //if (step.state === this.StepState_.COMPLETED) {
    //  this.Steps_.completed -= 1;
    //}

    switch (state) {
      case MDCStepFoundation.states.COMPLETED:
        // Case changing the current step state to "completed",
        // we can increment the total number of completed.
        //this.Steps_.completed += 1;

        this.adapter_.removeClass (MDCStepFoundation.cssClasses.ERROR);
        this.adapter_.addClass (MDCStepFoundation.cssClasses.COMPLETED);
        break;

      case MDCStepFoundation.states.ERROR:
        this.adapter_.removeClass (MDCStepFoundation.cssClasses.COMPLETED);
        this.adapter_.addClass (MDCStepFoundation.cssClasses.ERROR);
        break;

      case MDCStepFoundation.states.NORMAL:
        this.adapter_.removeClass (MDCStepFoundation.cssClasses.COMPLETED);
        this.adapter_.removeClass (MDCStepFoundation.cssClasses.ERROR);
        break;

      default:
        return false;
    }

    const isEditable = this.adapter_.hasClass (MDCStepFoundation.cssClasses.EDITABLE);
    this.adapter_.setLabelIndicator (state, isEditable);

    return true;
  }


  /**
   * Create (feedback) transient effect and apply to the current step.
   * @param {MaterialStepper.Steps_.collection<step>} step The step to add effect.
   * @return {boolean}
   */
  addTransientEffect_ (step) {
    /** @type {HTMLElement} */
    let transient;
    /** @type {HTMLElement} */
    let overlay;
    /** @type {HTMLElement} */
    let loader;
    /** @type {HTMLElement} */
    let spinner;

    if (step.content.querySelector('.' + this.CssClasses_.TRANSIENT)) return false;

    transient = document.createElement('div');
    overlay = document.createElement('div');
    loader = document.createElement('div');
    spinner = document.createElement('div');
    transient.classList.add(this.CssClasses_.TRANSIENT);
    overlay.classList.add(this.CssClasses_.TRANSIENT_OVERLAY);
    loader.classList.add(this.CssClasses_.TRANSIENT_LOADER);
    spinner.classList.add(this.CssClasses_.SPINNER);
    spinner.classList.add(this.CssClasses_.SPINNER_JS);
    spinner.classList.add(this.CssClasses_.SPINNER_IS_ACTIVE);
    loader.appendChild(spinner);
    transient.appendChild(overlay);
    transient.appendChild(loader);
    step.container.classList.add(this.CssClasses_.STEP_TRANSIENT);
    step.content.appendChild(transient);
    // Assume componentHandler is available in the global scope.
    componentHandler.upgradeDom();
    return true;
  }
}

export { MDCStepFoundation };