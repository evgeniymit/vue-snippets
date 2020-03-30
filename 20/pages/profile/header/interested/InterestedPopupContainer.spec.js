import InterestedPopupContainer from '@/pages/profile/header/interested/InterestedPopupContainer';
import { mount } from '@vue/test-utils'
import Vuex from 'vuex';
import localVue from '@/common/test-helpers/mock-vue';


describe('InterestedPopupContainer', () => {

  it('initial state (purpose === interest) with preselected project', () => {
    const propsData = {candidateId: '1'};
    const $archive = {getUnarchivedProjects: jest.fn()};
    const store = new Vuex.Store({
      getters: {
        featureSwitchesState() {return {SHORTLISTED_CANDIDATES: true}},
        savedByCandidateIdState() {return {}}
      },
      mutations: {
        mutateFieldsInterestedFormState: jest.fn(),
        clearFieldsInterestedFormState: jest.fn(),
      }
    });

    store.dispatch = jest.fn(() => Promise.resolve());

    const wrapper = mount(InterestedPopupContainer, {
      localVue, store, propsData, mocks: {$archive},
      data() {
        return {
          minDate: 1,
          maxDate: 2
        }
      },
      computed: {
        projectsByCandidateIdState: () => {return {1: {title: 'test', id: '1'}}},
        userDetailsState: () => {return {phone: '111111111'}},
        interestedFormState: () => {
          return {
            loading: null,
            error: null,
            fields: {
              project_id: null,
              purpose: null,
              message: null,
              phone_number: null,
              date: null,
              time: null,
              interview_address: null
            }
          }
        }
      },
      methods: {
        getProjectWithDispalyedTitle: () => {return {title: 'test', id: '1', displayedTitle: 'test'}}
      }
    });


    expect(wrapper.html()).toMatchSnapshot();
    expect(wrapper.find('.text-highlighted').text()).toEqual('Your Relationship Manager will reach out to this candidate to verify their interest in your company.');
    expect(wrapper.vm.showAddressField).toEqual(false);
    expect(wrapper.vm.showInterviewField).toEqual(false);
    expect(wrapper.vm.showPhoneField).toEqual(false);
    expect(wrapper.vm.defaultProject).toEqual({title: 'test', displayedTitle: 'test', id: '1'});
  });

  it('purpose === info', () => {
    const propsData = {candidateId: '1'};
    const $archive = {getUnarchivedProjects: jest.fn()};
    const store = new Vuex.Store({
      getters: {
        featureSwitchesState() {return {SHORTLISTED_CANDIDATES: true}},
        savedByCandidateIdState() {return {}}
      },
      mutations: {
        mutateFieldsInterestedFormState: jest.fn()
      }
    });
    const wrapper = mount(InterestedPopupContainer, {
      localVue, store, propsData, mocks: {$archive},
      data() {
        return {
          minDate: 1,
          maxDate: 2
        }
      },
      computed: {
        projectsByCandidateIdState: () => {return {1: null}},
        userDetailsState: () => {return {phone: '111111111'}},
        interestedFormState: () => {
          return {
            loading: null,
            error: null,
            fields: {
              project_id: null,
              purpose: null,
              message: null,
              phone_number: null,
              date: null,
              time: null,
              interview_address: null
            }
          }
        }
      }
    });
    wrapper.setData({selectedPurposeType : 'info'});
    expect(wrapper.html()).toMatchSnapshot();
    expect(wrapper.find('.text-highlighted').text()).toEqual('Your Relationship Manager will reach out to this candidate to get more information.');
    expect(wrapper.vm.showAddressField).toEqual(false);
    expect(wrapper.vm.showInterviewField).toEqual(false);
    expect(wrapper.vm.showPhoneField).toEqual(false);
    expect(wrapper.vm.defaultProject).toEqual(null);
  });

  it('purpose === phone', () => {
    const propsData = {candidateId: '1'};
    const $archive = {getUnarchivedProjects: jest.fn()};
    const store = new Vuex.Store({
      getters: {
        featureSwitchesState() {return {SHORTLISTED_CANDIDATES: true}},
        savedByCandidateIdState() {return {}}
      },
      mutations: {
        mutateFieldsInterestedFormState: jest.fn()
      }
    });
    const wrapper = mount(InterestedPopupContainer, {
      localVue, store, propsData, mocks: {$archive},
      data() {
        return {
          minDate: 1,
          maxDate: 2
        }
      },
      computed: {
        projectsByCandidateIdState: () => {return {1: null}},
        userDetailsState: () => {return {phone: '111111111'}},
        interestedFormState: () => {
          return {
            loading: null,
            error: null,
            fields: {
              project_id: null,
              purpose: null,
              message: null,
              phone_number: null,
              date: null,
              time: null,
              interview_address: null
            }
          }
        }
      }
    });
    wrapper.setData({selectedPurposeType : 'phone'});
    expect(wrapper.html()).toMatchSnapshot();
    expect(wrapper.find('.text-highlighted').text()).toEqual('Your Relationship Manager will reach out to this candidate to schedule a phone screen.');
    expect(wrapper.vm.showAddressField).toEqual(false);
    expect(wrapper.vm.showInterviewField).toEqual(true);
    expect(wrapper.vm.showPhoneField).toEqual(true);
    expect(wrapper.vm.defaultProject).toEqual(null);
  });

  it('purpose === interview', () => {
    const propsData = {candidateId: '1'};
    const $archive = {getUnarchivedProjects: jest.fn()};
    const store = new Vuex.Store({
      getters: {
        featureSwitchesState() {return {SHORTLISTED_CANDIDATES: true}},
        savedByCandidateIdState() {return {}}
      },
      mutations: {
        mutateFieldsInterestedFormState: jest.fn()
      }
    });
    const wrapper = mount(InterestedPopupContainer, {
      localVue, store, propsData, mocks: {$archive},
      data() {
        return {
          minDate: 1,
          maxDate: 2
        }
      },
      computed: {
        projectsByCandidateIdState: () => {return {1: null}},
        userDetailsState: () => {return {phone: '111111111'}},
        interestedFormState: () => {
          return {
            loading: null,
            error: null,
            fields: {
              project_id: null,
              purpose: null,
              message: null,
              phone_number: null,
              date: null,
              time: null,
              interview_address: null
            }
          }
        }
      }
    });
    wrapper.setData({selectedPurposeType : 'interview'});
    expect(wrapper.html()).toMatchSnapshot();
    expect(wrapper.find('.text-highlighted').text()).toEqual('Your Relationship Manager will reach out to this candidate to schedule an interview.');
    expect(wrapper.vm.showAddressField).toEqual(true);
    expect(wrapper.vm.showInterviewField).toEqual(true);
    expect(wrapper.vm.showPhoneField).toEqual(true);
    expect(wrapper.vm.defaultProject).toEqual(null);
  });

  it('purpose === other', () => {
    const propsData = {candidateId: '1'};
    const $archive = {getUnarchivedProjects: jest.fn()};
    const store = new Vuex.Store({
      getters: {
        featureSwitchesState() {return {SHORTLISTED_CANDIDATES: true}},
        savedByCandidateIdState() {return {} }
      },
      mutations: {
        mutateFieldsInterestedFormState: jest.fn()
      }
    });
    const wrapper = mount(InterestedPopupContainer, {
      localVue, store, propsData, mocks: {$archive},
      data() {
        return {
          minDate: 1,
          maxDate: 2
        }
      },
      computed: {
        projectsByCandidateIdState: () => {return {1: null}},
        userDetailsState: () => {return {phone: '111111111'}},
        interestedFormState: () => {
          return {
            loading: null,
            error: null,
            fields: {
              project_id: null,
              purpose: null,
              message: null,
              phone_number: null,
              date: null,
              time: null,
              interview_address: null
            }
          }
        }
      }
    });
    wrapper.setData({selectedPurposeType : 'other'});
    expect(wrapper.html()).toMatchSnapshot();
    expect(wrapper.find('.text-highlighted').text()).toEqual('Your Relationship Manager will reach out to this candidate.');
    expect(wrapper.vm.showAddressField).toEqual(false);
    expect(wrapper.vm.showInterviewField).toEqual(false);
    expect(wrapper.vm.showPhoneField).toEqual(false);
    expect(wrapper.vm.defaultProject).toEqual(null);
  });
});
