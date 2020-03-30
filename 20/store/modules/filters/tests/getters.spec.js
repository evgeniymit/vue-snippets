import getters from '@/store/getters'

describe('filters getters', () => {
  describe('userValidCitiesState', () => {
    it('should return string with only existing values', () => {
      let mockState = {
        userState: {
          details: {
            cities: ['kyiv', 'shanghai', 'unknown']
          }
        }
      };

      let mockGetters = {
        allFiltersState: {
          cities: {
            kyiv: {},
            zp: {},
            shanghai: {},
          }
        }
      };
      expect(getters.userValidCitiesState(mockState, mockGetters)).toEqual({kyiv: {}, shanghai: {}})
    })
  });

   describe('userValidIndustriesState', () => {
    it('should return string with only existing values', () => {
      let mockState = {
        userState: {
          details: {
            industries: ['it', 'unknown']
          }
        }
      };

      let mockGetters = {
        allFiltersState: {
          industries: {
            it: {},
            retail: {},
          }
        }
      };
      expect(getters.userValidIndustriesState(mockState, mockGetters)).toEqual({it: {}})
    })
  });

  describe('userCitiesWithCountListState', () => {
    it('should return string with only existing values', () => {
      let mockState = {
        userState: {
          details: {
            cities: ['kyiv', 'zp', 'unknown']
          }
        }
      };

      let mockGetters = {
        allFiltersState: {
          cities: {
            kyiv: {name: 'Kyiv', count: 10},
            zp: {name: 'Zp', count: 0},
            shanghai: {name: 'Shanghai', count: 10}
          }
        }
      };
      expect(getters.userCitiesWithCountListState(mockState, mockGetters)).toEqual([{name: 'Kyiv', count: 10}])
    })
  });
});

