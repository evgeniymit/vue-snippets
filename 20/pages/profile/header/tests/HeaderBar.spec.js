import Vuex from "vuex";


import localVue from '@/common/test-helpers/mock-vue';
import HeaderBar from '@/pages/profile/header/HeaderBar';
import sinon from 'sinon';
import { mount } from '@vue/test-utils'

describe('HeaderBar', () => {
  const Constructor = localVue.extend(HeaderBar);
  const store = new Vuex.Store({state: {}, getters: {}});

  describe('computed', () => {

    describe('categoriesJobs', () => {
      it('should return job titles', () => {
        const candidate = {
          categories: [
            {job_titles: [], industry: {name: 'industryUnknown'}},
            {job_titles: ['python'], industry: {name: 'web'}},
            {job_titles: ['manager', 'really great manager'], industry: {name: 'management'}},
          ]
        };
        const component = new Constructor({
          store, propsData: {candidate}
        });
        const expected = [
          {industry: 'industryUnknown', name: '', slug: ''},
          'python',
          'manager',
          'really great manager'
        ];

        expect(component.categoriesJobs).toEqual(expected);
      });
    });
  });

  describe('methods', () => {

    describe('cvUnlocked', () => {
      it('should call cvUnlockedCallback if isAlreadyUnlocked == false', () => {
        const stub = sinon.stub();
        const component = new Constructor({
          store, propsData: { cvUnlockedCallback: stub }, data: {isAlreadyUnlocked: false}
        });
        component.cvUnlocked();
        expect(component.isAlreadyUnlocked).toEqual(true);
        expect(stub.callCount).toEqual(1);
      });

      it('should do nothing if isCandidateUnlocked == true', () => {
        const stub = sinon.stub();
        const component = new Constructor({
          store, propsData: { cvUnlockedCallback: stub }, data: {isAlreadyUnlocked: true}
        });
        component.cvUnlocked();
        expect(component.isAlreadyUnlocked).toEqual(true);
        expect(stub.callCount).toEqual(0);
      });
    });
  });

  describe('the candidate is not contacted by current user', () => {
    it('the contact button should be enabled', () => {
      const candidate = {
        status: 'active'
      };
      const project = {};
      const propsData = {
        candidate,
        contacted: false,
        loadingForContactedCandidatesList: false,
        loadingForCandidateDetail: false,
        unlockedCandidatesLoading: false,
        isUserAccountApproved: true,
        cvUrl: 'url',
        unlockCVHandler: () => {},
        cvUnlockedCallback: () => {},
        project
      };
      const stubs = ['header-bar-loader', 'candidate-badges-container', 'save-candidate-button-container', 'interested-popup-container', 'interested-popup-mobile-container' ]
      const store = new Vuex.Store({
        getters: {
          unavailableSavedState() {return {}},
          unavailableContactedState() {return {}},
          featureSwitchesState() {return {}}
        }
      });
      const wrapper = mount(HeaderBar, {localVue, propsData, stubs, store});

      const button = wrapper.find('.contact a.button');
      expect(wrapper.vm.tooltipLabels.contact).toBe('Book an interview with this candidate');
      expect(button.isVisible()).toBe(true);
      expect(button.attributes().disabled).toBeFalsy();
      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  describe('the candidate is contacted by current user', () => {
    it('the contact button should be disabled', () => {
      const candidate = {
        status: 'active'
      };
      const project = {};
      const propsData = {
        candidate,
        contacted: true,
        loadingForContactedCandidatesList: false,
        loadingForCandidateDetail: false,
        unlockedCandidatesLoading: false,
        isUserAccountApproved: true,
        cvUrl: 'url',
        unlockCVHandler: () => {},
        cvUnlockedCallback: () => {},
        project
      };
      const stubs = ['header-bar-loader', 'candidate-badges-container', 'save-candidate-button-container', 'interested-popup-container', 'interested-popup-mobile-container' ]
      const store = new Vuex.Store({
        getters: {
          unavailableSavedState() {return {}},
          unavailableContactedState() {return {}},
          featureSwitchesState() {return {}}
        }
      });
      const wrapper = mount(HeaderBar, {localVue, propsData, stubs, store});

      expect(wrapper.vm.tooltipLabels.contact).toBe('');
      const button = wrapper.find('.contact a.button');
      expect(button.isVisible()).toBe(true);
      expect(button.attributes().disabled).toBeTruthy();
      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  describe('the candidate is in in unavailableSavedState', () => {
    it('the contact button should be disabled', () => {
      const candidate = {
        status: 'active',
        id: 'candidate_id'
      };
      const project = {};
      const propsData = {
        candidate,
        contacted: true,
        loadingForContactedCandidatesList: false,
        loadingForCandidateDetail: false,
        unlockedCandidatesLoading: false,
        isUserAccountApproved: true,
        cvUrl: 'url',
        unlockCVHandler: () => {},
        cvUnlockedCallback: () => {},
        project
      };
      const stubs = ['header-bar-loader', 'candidate-badges-container', 'save-candidate-button-container', 'interested-popup-container', 'interested-popup-mobile-container' ]
      const store = new Vuex.Store({
        getters: {
          unavailableSavedState() {return {'candidate_id': {candidate, author_id: 'author_id'}}},
          unavailableContactedState() {return {}},
          accountUsersNameByIdState() {return {author_id: 'Cool HR'}},
          featureSwitchesState() {return {}}
        }
      });
      const wrapper = mount(HeaderBar, {localVue, propsData, stubs, store});

      expect(wrapper.vm.tooltipLabels.contact).toBe('Already added to a project by Cool HR');
      const button = wrapper.find('.contact a.button');
      expect(button.isVisible()).toBe(true);
      expect(button.attributes().disabled).toBeTruthy();
      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  describe('the candidate is in in unavailableContactedState', () => {
    it('the contact button should be disabled', () => {
      const candidate = {
        status: 'active',
        id: 'candidate_id'
      };
      const project = {};
      const propsData = {
        candidate,
        contacted: true,
        loadingForContactedCandidatesList: false,
        loadingForCandidateDetail: false,
        unlockedCandidatesLoading: false,
        isUserAccountApproved: true,
        cvUrl: 'url',
        unlockCVHandler: () => {},
        cvUnlockedCallback: () => {},
        project
      };
      const stubs = ['header-bar-loader', 'candidate-badges-container', 'save-candidate-button-container', 'interested-popup-container', 'interested-popup-mobile-container' ]
      const store = new Vuex.Store({
        getters: {
          unavailableSavedState() {return {}},
          unavailableContactedState() {return {'candidate_id': {candidate, author_id: 'author_id'}}},
          accountUsersNameByIdState() {return {author_id: 'Cool HR'}},
          featureSwitchesState() {return {}}
        }
      });
      const wrapper = mount(HeaderBar, {localVue, propsData, stubs, store});

      expect(wrapper.vm.tooltipLabels.contact).toBe('Already added to a project by Cool HR');
      const button = wrapper.find('.contact a.button');
      expect(button.isVisible()).toBe(true);
      expect(button.attributes().disabled).toBeTruthy();
      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  describe('the user account is not approved', () => {
    it('the contact button should be disabled', () => {
      const candidate = {
        status: 'active',
      };
      const project = {};
      const propsData = {
        candidate,
        contacted: true,
        loadingForContactedCandidatesList: false,
        loadingForCandidateDetail: false,
        unlockedCandidatesLoading: false,
        isUserAccountApproved: false,
        cvUrl: 'url',
        unlockCVHandler: () => {},
        cvUnlockedCallback: () => {},
        project
      };
      const stubs = ['header-bar-loader', 'candidate-badges-container', 'save-candidate-button-container', 'interested-popup-container', 'interested-popup-mobile-container' ]
      const store = new Vuex.Store({
        getters: {
          unavailableSavedState() {return {}},
          unavailableContactedState() {},
          featureSwitchesState() {return {}}
        }
      });
      const wrapper = mount(HeaderBar, {localVue, propsData, stubs, store});

      expect(wrapper.vm.tooltipLabels.contact).toBe("As soon as we approve your account you'll be able to contact candidates");
      const button = wrapper.find('.contact a.button');
      expect(button.isVisible()).toBe(true);
      expect(button.attributes().disabled).toBeTruthy();
      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  describe('the candidate is pipeliner', () => {
    it('the contact button should be not visible', () => {
      const candidate = {
        is_pipeliner: true,
      };
      const project = {};
      const propsData = {
        candidate,
        contacted: false,
        loadingForContactedCandidatesList: false,
        loadingForCandidateDetail: false,
        unlockedCandidatesLoading: false,
        isUserAccountApproved: true,
        cvUrl: 'url',
        unlockCVHandler: () => {},
        cvUnlockedCallback: () => {},
        project
      };
      const stubs = ['header-bar-loader', 'candidate-badges-container', 'save-candidate-button-container', 'interested-popup-container', 'interested-popup-mobile-container' ]
      const store = new Vuex.Store({
        getters: {
          unavailableSavedState() {return {}},
          unavailableContactedState() {return {}},
          featureSwitchesState() {return {}}
        }
      });
      const wrapper = mount(HeaderBar, {localVue, propsData, stubs, store});

      expect(wrapper.find('.contact').exists()).toBe(false);
      expect(wrapper.html()).toMatchSnapshot();
    });
  });
});
