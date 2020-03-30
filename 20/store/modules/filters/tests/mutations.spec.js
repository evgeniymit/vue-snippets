import {mapKeys, forEach} from 'lodash';
import * as mutations from '@/store/modules/filters/mutations';
import * as constants from '@/store/modules/filters/constants';

describe('filters mutations', () => {
  describe('checking "FETCH_FILTERS_REQUEST" mutation', () => {
    test('should set "loading" true status', () => {
      const state = {
        filters: {
          loading: false
        }
      };
      mutations.default[constants.FETCH_FILTERS_REQUEST](state);
      expect(state.filters.loading).toEqual(true);
    });
  });

  describe('checking "FETCH_FILTERS_FAILURE" mutation', () => {
    test('should set "error" field  if throw error', () => {
      const state = {
        filters: {
          error: null
        }
      };
      mutations.default[constants.FETCH_FILTERS_FAILURE](state, new Error());
      expect(state.filters.error).toEqual(new Error());
      expect(state.filters.error).toBeInstanceOf(Error);
    });
  });

  describe('checking "FETCH_FILTERS_SUCCESS" mutation', () => {
    test('should set ...', () => {
      const state = {
        filters: {
          loading: false,
          error: null,
          all: null
        }
      };
      const filtersList = {
        cities: [
          {
            count: 8,
            name: 'Jacquelineshire',
            value: 'jacquelineshire'
          }
        ],
        industries: [
          {
            name: 'Fitzgerald, Pope and Medina',
            value: 'fitzgerald-pope-and-medina',
            count: 3
          }
        ],
        salaries: [
          {
            name: '¥1-1.3M',
            value: '1_1d3_m',
            count: 7
          }
        ],
        tags: [
          {
            name: 'Companies of interest',
            value: 'coi',
            count: 3,
            need_activation: false,
            min_coi_number: 5,
            tag_type: 'coi'
          }
        ]
      };
      const expectedResult = {};
      forEach(filtersList, (filterType, key) => {
        expectedResult[key] = mapKeys(filterType, 'value');
      });
      mutations.default[constants.FETCH_FILTERS_SUCCESS](state, filtersList);
      expect(state.filters.all).toEqual(expectedResult);
    });
    test('should recursively map arrays to dict and set parents for children', () => {
      const state = {
        filters: {
          loading: false,
          error: null,
          all: null
        }
      };
      const filtersList = {
        cities: [
          {
            count: 8,
            name: 'Jacquelineshire',
            value: 'jacquelineshire'
          }
        ],
        position_functions: [
          {
            count: 8,
            name: 'Internet',
            value: 'internet',
            children: [
              {
                count: 4,
                name: 'Backstage',
                value: 'backstage',
                children: [
                  {
                    count: 1,
                    name: 'Java Engineer',
                    value: 'java',
                    children: []
                  },
                  {count: 1, name: 'PHP', value: 'php', children: []},
                  {count: 2, name: 'Python', value: 'python', children: []}
                ]
              },
              {
                count: 2,
                name: 'Web',
                value: 'web',
                children: [{count: 2, name: 'HTML5', value: 'html5', children: []}]
              }
            ]
          },
          {
            count: 8,
            name: 'PMO',
            value: 'pmo',
            children: []
          }
        ]
      };
      const expectedResult = {
        cities: {
          jacquelineshire: {
            count: 8,
            name: 'Jacquelineshire',
            value: 'jacquelineshire'
          }
        },
        position_functions: {
          internet: {
            count: 8,
            name: 'Internet',
            value: 'internet',
            parentBranch: '',
            children: {
              backstage: {
                count: 4,
                name: 'Backstage',
                value: 'backstage',
                parentBranch: 'internet',
                children: {
                  java: {
                    count: 1,
                    name: 'Java Engineer',
                    value: 'java',
                    children: {},
                    parentBranch: 'internet.backstage'
                  },
                  php: {
                    count: 1,
                    name: 'PHP',
                    value: 'php',
                    children: {},
                    parentBranch: 'internet.backstage'
                  },
                  python: {
                    count: 2,
                    name: 'Python',
                    value: 'python',
                    children: {},
                    parentBranch: 'internet.backstage'
                  }
                }
              },
              web: {
                count: 2,
                name: 'Web',
                value: 'web',
                parentBranch: 'internet',
                children: {
                  html5: {
                    count: 2,
                    name: 'HTML5',
                    value: 'html5',
                    children: {},
                    parentBranch: 'internet.web'
                  }
                }
              }
            }
          },
          pmo: {
            count: 8,
            name: 'PMO',
            value: 'pmo',
            children: {},
            parentBranch: ''
          }
        }
      };

      mutations.default[constants.FETCH_FILTERS_SUCCESS](state, filtersList);
      expect(state.filters.all).toEqual(expectedResult);
    });
  });


  describe('checking "markTop5GroupMutation" mutation', () => {
    test('should set ...', () => {
      const state = {
        filters: {
          all: {
            cities: {
              beijing: {
                count: 10,
                name: 'Beijing',
                value: 'beijing'
              },
              changchun: {
                count: 100,
                name: 'Changchun',
                value: 'changchun'
              },
              dalian: {
                count: 200,
                name: 'Dalian',
                value: 'dalian'
              },
              europe: {
                count: 1000,
                name: 'Europe',
                value: 'europe'
              },
              france: {
                count: 300,
                name: 'France',
                value: 'france'
              },
              germany: {
                count: 400,
                name: 'Germany',
                value: 'germany'
              }

            }
          }
        }
      };

      const expectedResult = {
       cities: {
         europe: {
           count: 1000,
           name: "Europe",
           type: "countOrderGroup",
           value: "europe"
         },
         germany: {
           count: 400,
           name: "Germany",
           type: "countOrderGroup",
           value: "germany"
         },
         france: {
           count: 300,
           name: "France",
           type: "countOrderGroup",
           value: "france",
         },
         dalian: {
           count: 200,
           name: "Dalian",
           type: "countOrderGroup",
           value: "dalian",
         },
         changchun: {
           count: 100,
           name: "Changchun",
           type: "countOrderGroup",
           value: "changchun",
         },
         beijing: {
           count: 10,
           name: "Beijing",
           type: "alphabeticalOrderGroup",
           value: "beijing",
         },
       }
     };

      mutations.default['markTop5GroupMutation'](state, 'cities');
      expect(state.filters.all).toEqual(expectedResult);
    });
  });

  describe('checking "CHANGE_SEARCH_STATE_MUTATION" mutation', () => {
    test('should set input value to "searchState"', () => {
      const state = {
        searchState: null
      };
      const searchValue = 'lorem';
      mutations.default[constants.CHANGE_SEARCH_STATE_MUTATION](state, searchValue);
      expect(state.searchState).toBe('lorem');
    });
  });

  describe('checking "ADD_TO_ACTIVE_FILTERS_MUTATION" mutation', () => {
    test('should adding every selected filter to active (selected only one filter)', () => {
      const state = {
        activeFiltersState: {},
        filters: {
          all: {
            salaries: {
              bellow_400k: {
                count: 20,
                name: 'Below ¥400k',
                relevance: 0,
                value: 'bellow_400k'
              }
            }
          },
          error: null,
          loading: false
        }
      };
      const filters = {
        salaries: {
          bellow_400k: {
            count: 20,
            name: 'Below ¥400k',
            relevance: 0,
            value: 'bellow_400k'
          }
        }
      };
      const expectedActiveFilters = {
        salaries: {
          bellow_400k: {
            count: 20,
            name: 'Below ¥400k',
            relevance: 0,
            value: 'bellow_400k'
          }
        }
      };
      mutations.default[constants.ADD_TO_ACTIVE_FILTERS_MUTATION](state, filters);
      expect(state.activeFiltersState).toEqual(expectedActiveFilters);
    });

    test('should adding every selected filter to active (selected two filters)', () => {
      const state = {
        activeFiltersState: {
          salaries: {
            bellow_400k: {
              count: 20,
              name: 'Below ¥400k',
              relevance: 0,
              value: 'bellow_400k'
            }
          }
        },
        filters: {
          all: {
            salaries: {
              bellow_400k: {
                count: 20,
                name: 'Below ¥400k',
                relevance: 0,
                value: 'bellow_400k'
              }
            },
            cities: {
              angelaberg: {
                count: 4,
                name: 'Angelaberg',
                value: 'angelaberg'
              }
            }
          },
          error: null,
          loading: false
        }
      };
      const filters = {
        cities: {
          angelaberg: {
            count: 4,
            name: 'Angelaberg',
            value: 'angelaberg'
          }
        }
      };
      const expectedActiveFilters = {
        salaries: {
          bellow_400k: {
            count: 20,
            name: 'Below ¥400k',
            relevance: 0,
            value: 'bellow_400k'
          }
        },
        cities: {
          angelaberg: {
            count: 4,
            name: 'Angelaberg',
            value: 'angelaberg'
          }
        }
      };
      mutations.default[constants.ADD_TO_ACTIVE_FILTERS_MUTATION](state, filters);
      expect(state.activeFiltersState).toEqual(expectedActiveFilters);
    });
  });

  describe('checking "UPDATE_ACTIVE_FILTERS_MUTATION" mutation', () => {
    test('should set "activeFiltersState" to null if none active filter don\'t select', () => {
      const state = {
        activeFiltersState: null,
        filters: {
          all: {
            salaries: {
              bellow_400k: {
                count: 20,
                name: 'Below ¥400k',
                relevance: 0,
                value: 'bellow_400k'
              }
            }
          },
          error: null,
          loading: false
        }
      };
      const updatedList = {
        salaries: [
          {
            count: 12,
            name: 'Below ¥400k',
            relevance: 0,
            value: 'bellow_400k'
          }
        ]
      };
      mutations.default[constants.UPDATE_ACTIVE_FILTERS_MUTATION](state, updatedList);
      expect(state.activeFiltersState).toEqual({});
    });

    test('should update count for active filters', () => {
      const state = {
        activeFiltersState: {
          cities: {
            'lake-amandamouth': {
              count: 7,
              name: 'Lake Amandamouth',
              value: 'lake-amandamouth'
            }
          },
          salaries: {
            bellow_400k: {
              count: 1,
              name: 'Below ¥400k',
              value: 'bellow_400k'
            }
          }
        }
      };
      const updatedList = {
        cities: [
          {
            count: 2,
            name: 'Lake Amandamouth',
            value: 'lake-amandamouth'
          }
        ],
        salaries: [
          {
            count: 12,
            name: 'Below ¥400k',
            value: 'bellow_400k'
          }
        ]
      };
      const expectedActiveState = {
        cities: {
          'lake-amandamouth': {
            count: 2,
            name: 'Lake Amandamouth',
            value: 'lake-amandamouth'
          }
        },
        salaries: {
          bellow_400k: {
            count: 12,
            name: 'Below ¥400k',
            value: 'bellow_400k'
          }
        }
      };
      mutations.default[constants.UPDATE_ACTIVE_FILTERS_MUTATION](state, updatedList);
      expect(state.activeFiltersState).toEqual(expectedActiveState);
    });
  });

  describe('checking "REMOVE_FROM_ACTIVE_FILTERS_MUTATION" mutation', () => {
    test('should clear object for specific filter type', () => {
      const state = {
        activeFiltersState: {
          cities: {
            'lake-amandamouth': {
              count: 7,
              name: 'Lake Amandamouth',
              value: 'lake-amandamouth'
            }
          },
          salaries: {
            bellow_400k: {
              count: 1,
              name: 'Below ¥400k',
              value: 'bellow_400k'
            }
          }
        }
      };

      const expectedNewActiveFilters = {
        cities: {
          'lake-amandamouth': {
            count: 7,
            name: 'Lake Amandamouth',
            value: 'lake-amandamouth'
          }
        },
        salaries: {}
      };

      const deletedFilter = {
        salaries: {
          bellow_400k: {
            count: 1,
            name: 'Below ¥400k',
            value: 'bellow_400k'
          }
        }
      };
      mutations.default[constants.REMOVE_FROM_ACTIVE_FILTERS_MUTATION](state, deletedFilter);
      expect(state.activeFiltersState).toEqual(expectedNewActiveFilters);
    });

    test('should delete specific filter from filter type', () => {
      const state = {
        activeFiltersState: {
          cities: {
            jacquelineshire: {
              name: 'Jacquelineshire',
              count: 12,
              value: 'jacquelineshire'
            },
            'lake-amandamouth': {
              count: 7,
              name: 'Lake Amandamouth',
              value: 'lake-amandamouth'
            }
          },
          salaries: {
            bellow_400k: {
              count: 1,
              name: 'Below ¥400k',
              value: 'bellow_400k'
            }
          }
        }
      };

      const expectedNewActiveFilters = {
        cities: {
          'lake-amandamouth': {
            count: 7,
            name: 'Lake Amandamouth',
            value: 'lake-amandamouth'
          }
        },
        salaries: {
          bellow_400k: {
            count: 1,
            name: 'Below ¥400k',
            value: 'bellow_400k'
          }
        }
      };

      const deletedFilter = {
        cities: {
          jacquelineshire: {
            name: 'Jacquelineshire',
            count: 12,
            value: 'jacquelineshire'
          }
        }
      };
      mutations.default[constants.REMOVE_FROM_ACTIVE_FILTERS_MUTATION](state, deletedFilter);
      expect(state.activeFiltersState).toEqual(expectedNewActiveFilters);
    });
  });

  describe('checking "CLEAR_ACTIVE_FILTERS_MUTATION" mutation', () => {
    test('clear all fields that binded with active filters state', () => {
      const state = {
        activeFiltersState: {
          salaries: {
            bellow_400k: {
              count: 1,
              name: 'Below ¥400k',
              value: 'bellow_400k'
            }
          }
        },
        searchState: 'lorem',
        orderingState: 'salary'
      };
      mutations.default[constants.CLEAR_ACTIVE_FILTERS_MUTATION](state);
      expect(state.activeFiltersState).toBeNull();
      expect(state.searchState).toBeNull();
      expect(state.orderingState).toBeNull();
    });
  });
});
