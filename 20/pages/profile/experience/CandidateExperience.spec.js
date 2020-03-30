import localVue from '@/common/test-helpers/mock-vue';
import CandidateExperience from '@/pages/profile/experience/CandidateExperience';
import { mount } from '@vue/test-utils'

describe('CandidateExperience', () => {
  describe('loading state', () => {
    it('should show loading animation', () => {
      const propsData = {errors: null, candidate: {}, loading: true};
      const computed = {
        featureSwitchesState: () => {
          return {OBSCURE_PROFILES: true}
        }
      };
      const wrapper = mount(CandidateExperience, {
        localVue, propsData, computed
      });

      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  describe('error state', () => {
    it('should show errors', () => {
      const propsData = {errors: {error1: ['No candidate']}, candidate: {}, loading: false};
      const computed = {
        featureSwitchesState: () => {
          return {OBSCURE_PROFILES: true}
        }
      };
      const wrapper = mount(CandidateExperience, {
        localVue, propsData, computed
      });

      expect(wrapper.html()).toMatchSnapshot();
      expect(wrapper.find('.is-danger .media-content').text()).toEqual('No candidate');
    });
  });

  describe('locked state', () => {
    it('should show locked image with info', () => {
      const propsData = {errors: null, candidate: {is_locked: true}, loading: false};
      const computed = {
        featureSwitchesState: () => {
          return {OBSCURE_PROFILES: true}
        },
        contacted() {
          return false
        }
      };
      const wrapper = mount(CandidateExperience, {
        localVue, propsData, computed
      });

      expect(wrapper.html()).toMatchSnapshot();
      expect(wrapper.find('.rotated').text()).toEqual('LOCKED');
    });
  });

  describe('normal state', () => {
    it('should show candidate summary and side bars', () => {
      const candidate = {
        summary: '<div>Cool candidate</div>',
        purpose: 'test',
        leave_reasons: [{name: 'low salary'}],
        candidate_skills: ['manager'],
        languages: ['english']
      };
      const propsData = {errors: null, candidate, loading: false};
      const computed = {
        featureSwitchesState: () => {
          return {OBSCURE_PROFILES: true}
        },
        meta: () => {
          return {statuses: {}}
        },
        contacted: () => {
          return false
        },
        breadcrumbsLinkLabel: () => {
          return null
        }
      };
      const wrapper = mount(CandidateExperience, {
        localVue, propsData, computed, stubs: ['PipilineStatus']
      });

      expect(wrapper.html()).toMatchSnapshot();
    });

    it('should show breadcrumbs', () => {
      const candidate = {
        summary: '<div>Cool candidate</div>',
        purpose: 'test',
        leave_reasons: [{name: 'low salary'}],
        candidate_skills: ['manager'],
        languages: ['english']
      };
      const propsData = {errors: null, candidate, loading: false};
      const computed = {
        featureSwitchesState: () => {
          return {OBSCURE_PROFILES: true}
        },
        meta: () => {
          return {statuses: {}}
        },
        contacted: () => {
          return false
        },
        breadcrumbsLinkLabel: () => {
          return 'Go back to projects'
        }
      };
      const wrapper = mount(CandidateExperience, {
        localVue, propsData, computed, stubs: ['PipilineStatus']
      });

      expect(wrapper.html()).toMatchSnapshot();
    })
  });
});
