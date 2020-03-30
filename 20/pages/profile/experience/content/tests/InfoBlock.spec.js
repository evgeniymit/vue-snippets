import Vue from '@/common/test-helpers/mock-vue';
import InfoBlockPeriod from '@/pages/profile/experience/content/InfoBlockPeriod';

describe('InfoBlockPeriod', () => {
  const Constructor = Vue.extend(InfoBlockPeriod);

  describe('computed', () => {
    describe('workingYearsLabel', () => {
      it('should return string in plural', () => {
        const component = new Constructor({propsData: {workingYears: 5}});
        expect(component.workingYearsLabel).toEqual('5 years');
      });
      it('should return string in singular', () => {
        const component = new Constructor({propsData: {workingYears: 1}});
        expect(component.workingYearsLabel).toEqual('1 year');
      });
      it('should return empty string', () => {
        const component = new Constructor({propsData: {}});
        expect(component.workingYearsLabel).toEqual('');
      });

      describe('workingMonthsLabel', () => {
        it('should return string in plural', () => {
          const component = new Constructor({
            propsData: {workingMonths: 5}
          });
          expect(component.workingMonthsLabel).toEqual('5 months');
        });
        it('should return string in singular', () => {
          const component = new Constructor({
            propsData: {workingMonths: 1}
          });
          expect(component.workingMonthsLabel).toEqual('1 month');
        });
        it('should return empty string', () => {
          const component = new Constructor({propsData: {}});
          expect(component.workingMonthsLabel).toEqual('');
        });
      });
    });
  });
});
