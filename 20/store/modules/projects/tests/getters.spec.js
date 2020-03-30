import getters from '@/store/modules/projects/getters.js'

describe('projects getters', () => {
  describe('industryNamesByProjectIdState', () => {
    it('should return dict with project id as keys and industry names as values', () => {
      let mockGetters = {
        allProjectsState: {
          '1': {industry: 'some-industry,other'},
          '2': {industry: 'retail'},
          '3': {industry: null}},
        allFiltersState: {
          industries: {
            'some-industry': {name: 'Some industry'},
            'other': {name: 'Other'},
            'retail': {name: 'Retail'},
          }
        }
      };
      const actual = getters.industryNamesByProjectIdState({}, mockGetters);
      const expected = {
        '1': ['Some industry', 'Other'],
        '2': ['Retail'],
        '3': []
      };
      expect(actual).toEqual(expected);
    });
  });

  describe('cityNamesByProjectIdState', () => {
     it('should return dict with project id as keys and city names as values', () => {
       let mockGetters = {
        allProjectsState: {
          '1': {city: 'kyiv'},
          '2': {city: null}},
        allFiltersState: {
          cities: {
            'kyiv': {name: 'Kyiv'},
          }
        }
      };
      const actual = getters.cityNamesByProjectIdState({}, mockGetters);
      const expected = {
        '1': 'Kyiv',
        '2': null,
      };
      expect(actual).toEqual(expected);
     })
  });
});
