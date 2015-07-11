import Ember from 'ember';
import _computed from 'ember-new-computed';

const { assert } = Ember;

export default Ember.Mixin.create({
  childComponentClassName: null,
  classNameBindings: ['_childComponentClassString'],
  _childComponentClassString: _computed('_parentComponent', 'childComponentClassName', {
    get() {
      let cccn = this.get('childComponentClassName');
      if (!cccn) {
        return '';
      } else {
        let parentComponent = this.get('_parentComponent');
        return `${parentComponent.get('_primaryClassNameString')}--${this.get('childComponentClassName')}`;
      }
    }
  }),

  init() {
    this._super(...arguments);
    assert('Must define _parentComponentTypes', this.get('_parentComponentTypes'));
    this._registerWithParent();
  },

  willDestroyElement() {
    this._super(...arguments);
    this._unregisterWithParent();
  },

  composableParent: _computed({
    get() {
      return this._componentToRegisterTo();
    }
  }),

  _componentToRegisterTo() {
    let c = null;
    let parentTypes = this.get('_parentComponentTypes');
    for (let i = 0; i < parentTypes.length && !c; i++) {
      c = this.nearestOfType(parentTypes[i]);
    }
    return c;
  },

  _registerWithParent() {
    let parentComponent = this._componentToRegisterTo();
    if (parentComponent) {
      parentComponent.registerChildComponent(this);
    }
    this.notifyPropertyChange('composableParent');
  },

  _unregisterWithParent() {
    let parentComponent = this._componentToRegisterTo();
    if (parentComponent) {
      parentComponent.unregisterChildComponent(this);
    }
    this.notifyPropertyChange('composableParent');
  }
});