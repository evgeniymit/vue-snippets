import Vue from '@/common/test-helpers/mock-vue';
import sinon from 'sinon';
import Timeline from '@/pages/profile/experience/content/Timeline';

describe('Timeline', () => {
  const Constructor = Vue.extend(Timeline);
  const currentYear = new Date().getFullYear();

  describe('methods', () => {
    describe('getOffsetPercentage', () => {
      it('should return correct percentage', () => {
        const component = new Constructor({
          computed: {
            firstYear() {
              return 2008;
            },
            totalTime() {
              return 10;
            }
          }
        });
        expect(component.getOffsetPercentage(2008)).toEqual(0);
        expect(component.getOffsetPercentage(2010)).toEqual(20);
        expect(component.getOffsetPercentage(2012)).toEqual(40);
        expect(component.getOffsetPercentage(2016)).toEqual(80);
        expect(component.getOffsetPercentage(2018)).toEqual(100);
      });
    });
    describe('getTooltipLabel', () => {
      it('should return a string with overview on all experiences', () => {
        const component = new Constructor();
        const stub = sinon.stub(component, 'getOverview').returns('overview');
        const experiences = ['exp1', 'exp2'];
        expect(component.getTooltipLabel(experiences)).toEqual('overview\noverview');
        expect(stub.callCount).toEqual(2);
        stub.restore();
      });
    });
    describe('getOverview', () => {
      it('should return correct string. everything present', () => {
        const component = new Constructor();
        const experience = {
          start_month: 1,
          start_year: 2012,
          end_month: 10,
          end_year: 2018,
          job_title: 'title',
          company: 'Company',
          working_months: 10,
          working_years: 6
        };
        const expected = 'Jan 2012 - Oct 2018: title at Company (6 years 10 months)';
        expect(component.getOverview(experience)).toEqual(expected);
      });
      it('should return correct string. no start_month', () => {
        const component = new Constructor();
        const experience = {
          start_year: 2012,
          end_month: 10,
          end_year: 2018,
          job_title: 'title',
          company: 'Company',
          working_months: 10,
          working_years: 6
        };
        const expected = '2012 - Oct 2018: title at Company (6 years 10 months)';
        expect(component.getOverview(experience)).toEqual(expected);
      });
      it('should return correct string. no end_month', () => {
        const component = new Constructor();
        const experience = {
          start_month: 1,
          start_year: 2012,
          end_year: 2018,
          job_title: 'title',
          company: 'Company',
          working_months: 10,
          working_years: 6
        };
        const expected = 'Jan 2012 - 2018: title at Company (6 years 10 months)';
        expect(component.getOverview(experience)).toEqual(expected);
      });
      it('should return correct string. no end_year', () => {
        const component = new Constructor();
        const experience = {
          start_month: 1,
          start_year: 2012,
          end_month: 10,
          job_title: 'title',
          company: 'Company',
          working_months: 10,
          working_years: 6
        };
        const expected = 'Jan 2012 - Oct Present: title at Company (6 years 10 months)';
        expect(component.getOverview(experience)).toEqual(expected);
      });
      it('should return correct string. no job_title', () => {
        const component = new Constructor();
        const experience = {
          start_month: 1,
          start_year: 2012,
          end_month: 10,
          end_year: 2018,
          company: 'Company',
          working_months: 10,
          working_years: 6
        };
        const expected = 'Jan 2012 - Oct 2018: Company (6 years 10 months)';
        expect(component.getOverview(experience)).toEqual(expected);
      });
      it('should return correct string. no company', () => {
        const component = new Constructor();
        const experience = {
          start_month: 1,
          start_year: 2012,
          end_month: 10,
          end_year: 2018,
          job_title: 'title',
          working_months: 10,
          working_years: 6
        };
        const expected = 'Jan 2012 - Oct 2018: title (6 years 10 months)';
        expect(component.getOverview(experience)).toEqual(expected);
      });
    });
    describe('getWorkingRange', () => {
      it('should return correct string. all present. plural', () => {
        const component = new Constructor();
        const experience = {working_months: 10, working_years: 6};
        const expected = '(6 years 10 months)';
        expect(component.getWorkingRange(experience)).toEqual(expected);
      });
      it('should return correct string. all present. singular', () => {
        const component = new Constructor();
        const experience = {working_months: 1, working_years: 1};
        const expected = '(1 year 1 month)';
        expect(component.getWorkingRange(experience)).toEqual(expected);
      });
      it('should return correct string. only working_months present', () => {
        const component = new Constructor();
        const experience = {working_months: 10};
        const expected = '(10 months)';
        expect(component.getWorkingRange(experience)).toEqual(expected);
      });
      it('should return correct string. only working_years present', () => {
        const component = new Constructor();
        const experience = {working_years: 10};
        const expected = '(10 years)';
        expect(component.getWorkingRange(experience)).toEqual(expected);
      });
    });
    describe('getType', () => {
      it('should return "experience" if experiences list not empty', () => {
        const component = new Constructor();
        expect(component.getType(['exp1', 'exp2'])).toEqual('experience');
      });
      it('should return "circle" if experiences is empty list', () => {
        const component = new Constructor();
        expect(component.getType([])).toEqual('circle');
      });
    });
    describe('getFormattedLabel', () => {
      it('should return NOW if groupedExperiences for this year is empty', () => {
        const component = new Constructor({
          computed: {
            groupedExperiences() {
              return {'2018': [], '2016': ['exp1', 'exp2']};
            }
          }
        });
        expect(component.getFormattedLabel('2018')).toEqual('NOW');
      });
      it('should return full year if its the first year', () => {
        const component = new Constructor({
          computed: {
            firstYear() {
              return 1994;
            },
            groupedExperiences() {
              return {'1994': ['exp1']};
            }
          }
        });
        expect(component.getFormattedLabel('1994')).toEqual('1994');
      });
      it('should return full year if total time less than threshold years to trim', () => {
        const component = new Constructor({
          computed: {
            firstYear() {
              return 2000;
            },
            totalTime() {
              return 10;
            },
            groupedExperiences() {
              return {
                '2000': ['exp1'],
                '2004': ['exp2'],
                '2005': ['exp3'],
                '2006': ['exp4'],
                '2010': ['exp5']
              };
            }
          }
        });
        expect(component.getFormattedLabel('2005')).toEqual('2005');
      });
      it('should return trimmed year if total time more than threshold years to trim', () => {
        const component = new Constructor({
          computed: {
            firstYear() {
              return 2000;
            },
            totalTime() {
              return 20;
            },
            groupedExperiences() {
              return {
                '2000': ['exp1'],
                '2004': ['exp2'],
                '2005': ['exp3'],
                '2006': ['exp4'],
                '2010': ['exp5']
              };
            }
          }
        });
        expect(component.getFormattedLabel('2005')).toEqual("'05");
      });
      it('should return the same value if its not integer', () => {
        const component = new Constructor({
          computed: {
            firstYear() {
              return 1994;
            },
            lastYear() {
              return currentYear;
            }
          }
        });
        expect(component.getFormattedLabel('test')).toEqual('test');
      });
      it('should return trimmed year if there is a year near it and its not the first or current year', () => {
        const component = new Constructor({
          computed: {
            firstYear() {
              return 1994;
            },
            lastYear() {
              return currentYear;
            },
            groupedExperiences() {
              return {
                [currentYear]: ['exp1'],
                [currentYear - 1]: ['exp2'],
                '2010': ['exp3'],
                '2008': ['exp4'],
                '2007': ['exp5'],
                '2006': ['exp6'],
                '1995': ['exp7'],
                '1994': ['exp8']
              };
            }
          }
        });
        expect(component.getFormattedLabel(currentYear.toString())).toEqual(currentYear.toString());
        expect(component.getFormattedLabel((currentYear - 1).toString())).toEqual(
          "'" + (currentYear - 1).toString().slice(2)
        );
        expect(component.getFormattedLabel('2010')).toEqual('2010');
        expect(component.getFormattedLabel('2008')).toEqual("'08");
        expect(component.getFormattedLabel('2007')).toEqual("'07");
        expect(component.getFormattedLabel('2006')).toEqual("'06");
        expect(component.getFormattedLabel('1995')).toEqual("'95");
        expect(component.getFormattedLabel('1994')).toEqual('1994');
      });
    });
  });

  describe('computed', () => {
    describe('canShowTimeline', () => {
      it('should return true when first and last experience has start_year', () => {
        const experiences = [
          {start_year: 2010, start_month: 10},
          {start_year: 2012},
          {start_month: 10},
          {start_year: 2013}
        ];
        const component = new Constructor({
          propsData: {experiences}
        });
        expect(component.canShowTimeline).toBeTruthy();
      });
      it('should return false when no experience has no start_year', () => {
        const experiences = [{start_month: 10}, {end_year: 2012}, {start_month: 10}, {end_year: 2013}];
        const component = new Constructor({
          propsData: {experiences}
        });
        expect(component.canShowTimeline).toBeFalsy();
      });
    });

    describe('groupedExperiences', () => {
      it('should return experiences grouped by start year', () => {
        const experiences = [
          {start_year: currentYear, start_month: 1},
          {start_year: 2010, start_month: 5},
          {start_year: 2010, start_month: 12},
          {start_year: 2012, start_month: 8}
        ];
        const component = new Constructor({propsData: {experiences}});
        const expected = {
          [currentYear]: [{start_year: currentYear, start_month: 1}],
          '2010': [{start_year: 2010, start_month: 5}, {start_year: 2010, start_month: 12}],
          '2012': [{start_year: 2012, start_month: 8}]
        };
        expect(component.groupedExperiences).toEqual(expected);
      });
      it('should remove experiences with no start year', () => {
        const experiences = [
          {start_year: currentYear, start_month: 1},
          {start_year: 2010, start_month: 5},
          {start_month: 12},
          {start_month: 7},
          {start_year: 2013, start_month: 8}
        ];
        const component = new Constructor({propsData: {experiences}});
        const expected = {
          [currentYear]: [{start_year: currentYear, start_month: 1}],
          '2010': [{start_year: 2010, start_month: 5}],
          '2013': [{start_year: 2013, start_month: 8}]
        };
        expect(component.groupedExperiences).toEqual(expected);
      });
      it('should add a key: current year and value: [] if there is no experience starting in current year', () => {
        const experiences = [{start_year: 2010, start_month: 5}, {start_year: 2013, start_month: 8}];
        const component = new Constructor({propsData: {experiences}});
        const expected = {
          [currentYear]: [],
          '2010': [{start_year: 2010, start_month: 5}],
          '2013': [{start_year: 2013, start_month: 8}]
        };
        expect(component.groupedExperiences).toEqual(expected);
      });
    });
    describe('firstYear', () => {
      it('should return min value our of all start_year values', () => {
        const experiences = [{start_year: 2014}, {start_year: 2010}, {start_year: 2012}, {start_year: 2011}];
        const component = new Constructor({propsData: {experiences}});
        expect(component.firstYear).toEqual(2010);
      });
    });
    describe('lastYear', () => {
      it('should return current year', () => {
        const experiences = [{start_year: 2010}, {start_year: 2012}, {start_year: 2014}];
        const component = new Constructor({propsData: {experiences}});
        expect(component.lastYear).toEqual(currentYear);
      });
    });
    describe('totalTime', () => {
      it('should return end - start', () => {
        const component = new Constructor({
          computed: {
            firstYear() {
              return 2010;
            },
            lastYear() {
              return 2020;
            }
          }
        });
        expect(component.totalTime).toEqual(10);
      });
    });
  });
});
