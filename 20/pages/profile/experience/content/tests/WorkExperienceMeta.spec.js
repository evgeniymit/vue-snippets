import Vue from '@/common/test-helpers/mock-vue';
import WorkExperienceMeta from '@/pages/profile/experience/content/WorkExperienceMeta';

describe('WorkExperienceMeta', () => {
  const Constructor = Vue.extend(WorkExperienceMeta);
  describe('computed', () => {
    describe('totalWorkTimeLabel', () => {
      it('years label returns empty string', () => {
        const component = new Constructor({propsData: {}});
        expect(component.getYearsLabel()).toEqual('');
      });
      it('years label returns months', () => {
        const component = new Constructor({propsData: {}});
        expect(component.getYearsLabel(0, 6, 'Total')).toEqual('6 months Total');
      });

      it('years label returns month', () => {
        const component = new Constructor({propsData: {}});
        expect(component.getYearsLabel(0, 1, 'Total')).toEqual('1 month Total');
      });

      it('years label returns years', () => {
        const component = new Constructor({propsData: {}});
        expect(component.getYearsLabel(2, undefined, 'Total')).toEqual('2 years Total');
      });
      it('years label returns year', () => {
        const component = new Constructor({propsData: {}});
        expect(component.getYearsLabel(1, null, 'Total')).toEqual('1 year Total');
      });

      it('years label returns years and months', () => {
        const component = new Constructor({propsData: {}});
        expect(component.getYearsLabel(3, 10, 'Total')).toEqual('3 years and 10 months Total');
      });

      it('years label returns year and month', () => {
        const component = new Constructor({propsData: {}});
        expect(component.getYearsLabel(1, 1, 'of experience')).toEqual('1 year and 1 month of experience');
      });
    });
  });
  describe('computed', () => {
    describe('totalWorkTimeLabel', () => {
      it('should return empty string if there is no years and no months', () => {
        const component = new Constructor({propsData: {}});
        expect(component.totalWorkTimeLabel).toEqual('');
      });
      it('should return correct string if there is only months', () => {
        const component = new Constructor({
          propsData: {months: 4, positionsNumber: 2}
        });
        expect(component.totalWorkTimeLabel).toEqual('4 months of total work experience (2 positions)');
      });
      it('should return correct string if there is only years', () => {
        const component = new Constructor({
          propsData: {years: 4, positionsNumber: 2}
        });
        expect(component.totalWorkTimeLabel).toEqual('4 years of total work experience (2 positions)');
      });
      it('should return correct string if there is years and months', () => {
        const component = new Constructor({
          propsData: {years: 4, months: 1, positionsNumber: 1}
        });
        expect(component.totalWorkTimeLabel).toEqual('4 years and 1 month of total work experience (1 position)');
      });
    });
  });
});
