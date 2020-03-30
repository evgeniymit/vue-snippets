import localVue from '@/common/test-helpers/mock-vue';
import { mount } from '@vue/test-utils'
import SaveCandidateButtonContainer from '@/pages/profile/header/SaveCandidateButtonContainer'
import Vuex from "vuex";


describe('SaveCandidateButtonContainer', () => {

  const oldMath = Object.create(global.Math);
  const mockMath = Object.create(global.Math);
  mockMath.random = () => 1;

  beforeAll(() => {
    global.Math = mockMath;
  });
  afterAll(() => {
    global.Math = oldMath;
  });

  describe('candidate is not saved or contacted by anyone', () => {
    it('the save button should be enabled', () => {
      const candidate = {id: 'PGT-888', categories: [] };
      const propsData = {candidate};
      const stubs = ['new-project-popup-container', 'modal'];
      const store = new Vuex.Store({
        getters: {
          unavailableSavedState() {return {}},
          savedToAccountActiveProjectsByCandidateIdState() {return {}},
          contactedToAccountActiveProjectsByCandidateIdState() {return {}},
          eachSavedLoadingState() {return {}},
          userValidIndustriesState() {return {}},
          userValidCitiesState() {return {}},
          userDetailsState() {return {pk: 'user_pk'}},
          accountUsersNameByIdState() {return {}},
          projectFormState() {return {}},
          allFiltersState() {return {}},
        }
      });
      const $archive = {getUnarchivedProjects: jest.fn()};
      const $filters = {getItemCollectionSeparatedByGroup: jest.fn()};
      const mocks = {$archive, $filters};
      const wrapper = mount(SaveCandidateButtonContainer, {localVue, propsData, stubs, store, mocks});

      expect(wrapper.vm.savedButtonText).toBe('Save');
      expect(wrapper.find('span.is-primary.is-top.is-medium').attributes()['data-label']).toBe('Save this candidate');
      const button = wrapper.find('a.button');
      expect(button.isVisible()).toBe(true);
      expect(button.attributes().disabled).toBeFalsy();
      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  describe('candidate is saved by current user', () => {
    it('the save button should be enabled', () => {
      const candidate = {id: 'PGT-888', categories: [] };
      const allSaved = {'PGT-888': {candidate}};
      const propsData = {candidate};
      const stubs = ['new-project-popup-container', 'modal'];
      const store = new Vuex.Store({
        getters: {
          unavailableSavedState() {return {}},
          savedToAccountActiveProjectsByCandidateIdState() {return allSaved},
          contactedToAccountActiveProjectsByCandidateIdState() {return {}},
          eachSavedLoadingState() {return {}},
          userValidIndustriesState() {return {}},
          userValidCitiesState() {return {}},
          userDetailsState() {return {pk: 'user_pk'}},
          accountUsersNameByIdState() {return {'user_pk': 'John Doe'}},
          projectFormState() {return {}},
          allFiltersState() {return {}},
        }
      });
      const $archive = {getUnarchivedProjects: jest.fn()};
      const $filters = {getItemCollectionSeparatedByGroup: jest.fn()};
      const mocks = {$archive, $filters};
      const wrapper = mount(SaveCandidateButtonContainer, {localVue, propsData, stubs, store, mocks});

      expect(wrapper.vm.savedButtonText).toBe('Saved');
      expect(wrapper.find('span.is-primary.is-top.is-medium').attributes()['data-label']).toBe('Save this candidate');
      const button = wrapper.find('a.button');
      expect(button.isVisible()).toBe(true);
      expect(button.attributes().disabled).toBeFalsy();
      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  describe('candidate is contacted by current user', () => {
    it('the save button should be disabled', () => {
      const candidate = {id: 'PGT-888', categories: [] };
      const allContacted = {'PGT-888': {candidate, author_id: 'user_pk'}};
      const propsData = {candidate};
      const stubs = ['new-project-popup-container', 'modal'];
      const store = new Vuex.Store({
        getters: {
          unavailableSavedState() {return {}},
          savedToAccountActiveProjectsByCandidateIdState() {return {}},
          contactedToAccountActiveProjectsByCandidateIdState() {return allContacted},
          eachSavedLoadingState() {return {}},
          userValidIndustriesState() {return {}},
          userValidCitiesState() {return {}},
          userDetailsState() {return {pk: 'user_pk'}},
          accountUsersNameByIdState() {return {'user_pk': 'John Doe'}},
          projectFormState() {return {}},
          allFiltersState() {return {}},
        }
      });
      const $archive = {getUnarchivedProjects: jest.fn()};
      const $filters = {getItemCollectionSeparatedByGroup: jest.fn()};
      const mocks = {$archive, $filters};
      const wrapper = mount(SaveCandidateButtonContainer, {localVue, propsData, stubs, store, mocks});

      expect(wrapper.vm.savedButtonText).toBe('Save');
      expect(wrapper.find('span.is-primary.is-top.is-medium').attributes()['data-label']).toBe('You\'ve already added this candidate to a project');
      const button = wrapper.find('a.button');
      expect(button.isVisible()).toBe(true);
      expect(button.attributes().disabled).toBeTruthy();
      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  describe('candidate is in unavailableSavedState (saved by other user)', () => {
    it('the save button should be disabled', () => {
      const candidate = {id: 'PGT-888', categories: [] };
      const unavailableSavedState = {'PGT-888': {candidate, author_id: 'other_user_pk'}};
      const propsData = {candidate};
      const stubs = ['new-project-popup-container', 'modal'];
      const store = new Vuex.Store({
        getters: {
          unavailableSavedState() {return unavailableSavedState},
          savedToAccountActiveProjectsByCandidateIdState() {return {}},
          contactedToAccountActiveProjectsByCandidateIdState() {return {}},
          eachSavedLoadingState() {return {}},
          userValidIndustriesState() {return {}},
          userValidCitiesState() {return {}},
          userDetailsState() {return {pk: 'user_pk'}},
          accountUsersNameByIdState() {return {'user_pk': 'John Doe', 'other_user_pk': 'Maymay'}},
          projectFormState() {return {}},
          allFiltersState() {return {}},
        }
      });
      const $archive = {getUnarchivedProjects: jest.fn()};
      const $filters = {getItemCollectionSeparatedByGroup: jest.fn()};
      const mocks = {$archive, $filters};
      const wrapper = mount(SaveCandidateButtonContainer, {localVue, propsData, stubs, store, mocks});

      expect(wrapper.vm.savedButtonText).toBe('Save');
      expect(wrapper.find('span.is-primary.is-top.is-medium').attributes()['data-label']).toBe('Already added to a project by Maymay');
      const button = wrapper.find('a.button');
      expect(button.isVisible()).toBe(true);
      expect(button.attributes().disabled).toBeTruthy();
      expect(wrapper.html()).toMatchSnapshot();
    });
  });
  describe('candidate is in contactedToAccountActiveProjectsByCandidateIdState (contacted by any user)', () => {
    it('the save button should be disabled', () => {
      const candidate = {id: 'PGT-888', categories: [] };
      const allContacted = {'PGT-888': {candidate, author_id: 'other_user_pk'}};
      const propsData = {candidate};
      const stubs = ['new-project-popup-container', 'modal'];
      const store = new Vuex.Store({
        getters: {
          unavailableSavedState() {return {}},
          savedToAccountActiveProjectsByCandidateIdState() {return {}},
          contactedToAccountActiveProjectsByCandidateIdState() {return allContacted},
          eachSavedLoadingState() {return {}},
          userValidIndustriesState() {return {}},
          userValidCitiesState() {return {}},
          userDetailsState() {return {pk: 'user_pk'}},
          accountUsersNameByIdState() {return {'user_pk': 'John Doe', 'other_user_pk': 'Maymay'}},
          projectFormState() {return {}},
          allFiltersState() {return {}},
        }
      });
      const $archive = {getUnarchivedProjects: jest.fn()};
      const $filters = {getItemCollectionSeparatedByGroup: jest.fn()};
      const mocks = {$archive, $filters};
      const wrapper = mount(SaveCandidateButtonContainer, {localVue, propsData, stubs, store, mocks});

      expect(wrapper.vm.savedButtonText).toBe('Save');
      expect(wrapper.find('span.is-primary.is-top.is-medium').attributes()['data-label']).toBe('Already added to a project by Maymay');
      const button = wrapper.find('a.button');
      expect(button.isVisible()).toBe(true);
      expect(button.attributes().disabled).toBeTruthy();
      expect(wrapper.html()).toMatchSnapshot();
    });
  });
});
