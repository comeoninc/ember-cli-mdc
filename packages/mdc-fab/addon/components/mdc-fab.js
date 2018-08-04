import Component from '@ember/component';
import layout from '../templates/components/mdc-fab';
import { Ripple } from 'ember-cli-mdc-ripple';
import { Theme } from 'ember-cli-mdc-theme';

export default Component.extend (Ripple, {
  layout,

  tagName: 'button',

  classNames: ['mdc-fab'],

  classNameBindings: ['mini:mdc-fab--mini', 'exited:mdc-fab--exited'],

  attributeBindings: ['label:aria-label'],

  /// Optional label for the component
  label: null,

  didRender () {
    this._super (...arguments);

    // Check if the component has a label element. If the component does have
    // a label element, then we can mark this fab as extended.
    const $labels = this.$('.mdc-fab__label');
    this.$().toggleClass ('mdc-fab--extended', $labels.length === 1);
  }
}).reopenClass ({
  positionalParams: ['icon']
});