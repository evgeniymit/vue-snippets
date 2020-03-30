import {filtersFeature} from '@/plugins/filters/index';
import Vue from '@/common/test-helpers/mock-vue';
import Vuex from 'vuex';
import sinon from 'sinon';
import {ADD_TO_ACTIVE_FILTERS, REMOVE_FROM_ACTIVE_FILTERS} from '@/store/modules/filters/constants';
import {FIND_CANDIDATES_AND_CHANGE_ROUTE} from '@/store/constants';
import filterGetters from '@/store/modules/filters/getters';
import commonGetters from '@/store/getters';

describe('filtersFeature', () => {
  const mockRouter = {};
  let template, vm, store, actions, mutations;

  actions = {
    [FIND_CANDIDATES_AND_CHANGE_ROUTE]: sinon.stub(),
    [ADD_TO_ACTIVE_FILTERS]: sinon.stub(),
    [REMOVE_FROM_ACTIVE_FILTERS]: sinon.stub()
  };
  mutations = {
    changeSalaryMinState: sinon.stub(),
    changeSalaryMaxState: sinon.stub(),
  };
  store = new Vuex.Store({
    state: {
      orderingState: null,
      searchState: null,
      activeFiltersState: null,
      filters: {
        loading: false,
        error: null,
        all: null
      },
      userState: {
        details: {currency: 'CNY'}
      }
    },
    getters: {
      ...filterGetters,
      ...commonGetters,
    },
    actions,
    mutations
  });

  template = `<div id="app"></div>`;
  vm = new Vue({template, store}).$mount();
  Vue.use(filtersFeature, {store});

  let dispatchSpy = sinon.spy(store, 'dispatch');
  let commitSpy = sinon.spy(store, 'commit');
  let fetchFiltersStub = sinon.stub(vm.$filters, 'getFetchFiltersParams');

  afterAll(() => {
    store.dispatch.restore();
    vm.$filters.getFetchFiltersParams.restore();
  });

  describe('addActiveFilter', () => {
    beforeAll(() => {
      fetchFiltersStub.returns('fetch filters params');
    });
    afterEach(() => {
      dispatchSpy.reset();
      commitSpy.reset();
      actions[ADD_TO_ACTIVE_FILTERS].reset();
      actions[REMOVE_FROM_ACTIVE_FILTERS].reset();
      actions[FIND_CANDIDATES_AND_CHANGE_ROUTE].reset();
      actions[REMOVE_FROM_ACTIVE_FILTERS].reset();
      mutations.changeSalaryMaxState.reset();
      mutations.changeSalaryMinState.reset();
    });

    describe('with salary filter', () => {

      it('should commit changeSalaryMinState mutation if only salaryMin is passed', () => {
        vm.$filters.addActiveFilter({salaryMin: 100}, 'salaries', mockRouter);
        expect(commitSpy.callCount).toEqual(1);
        expect(commitSpy.getCall(0).args).toEqual(['changeSalaryMinState', 100]);
      });

      it('should commit changeSalaryMaxState mutation if only salaryMax is passed', () => {
        vm.$filters.addActiveFilter({salaryMax: 100}, 'salaries', mockRouter);
        expect(commitSpy.callCount).toEqual(1);
        expect(commitSpy.getCall(0).args).toEqual(['changeSalaryMaxState', 100]);
      });

      it('should commit both mutations if salaryMax and salaryMin are passed', () => {
        vm.$filters.addActiveFilter({salaryMax: 100, salaryMin: 50}, 'salaries', mockRouter);
        expect(commitSpy.callCount).toEqual(2);
        expect(commitSpy.getCall(0).args).toEqual(['changeSalaryMinState', 50]);
        expect(commitSpy.getCall(1).args).toEqual(['changeSalaryMaxState', 100]);
      });

      it('should not commit any mutations if values are invalid', () => {
        vm.$filters.addActiveFilter({salaryMax: 'test', salaryMin: {'value': 100}}, 'salaries', mockRouter);
        expect(commitSpy.callCount).toEqual(0);
      });

    });

    describe('with tags filter (coi)', () => {
      it('should add coi filter', () => {
        const filterType = 'tags';
        const filterItem = {
          coi: {value: 'coi', name: 'Companies of interest', tag_type: 'coi'}
        };
        const expFirstCallArgs = [
          'action/ADD_TO_ACTIVE_FILTERS',
          {
            tags: {
              coi: {
                value: 'coi',
                name: 'Companies of interest',
                tag_type: 'coi'
              }
            }
          }
        ];
        const expSecondCallArgs = [
          'action/FIND_CANDIDATES_AND_CHANGE_ROUTE',
          {
            params: 'fetch filters params',
            $router: {}
          }
        ];
        vm.$filters.addActiveFilter(filterItem, filterType, mockRouter);
        expect(dispatchSpy.getCall(0).args).toEqual(expFirstCallArgs);
        expect(dispatchSpy.getCall(1).args).toEqual(expSecondCallArgs);
        expect(dispatchSpy.callCount).toEqual(2);
        expect(actions[ADD_TO_ACTIVE_FILTERS].calledOnce).toEqual(true);
        expect(actions[FIND_CANDIDATES_AND_CHANGE_ROUTE].calledOnce).toEqual(true);
      });
    });

    describe('with tags filter (updated)', () => {
      const filterType = 'tags';
      const expSecondCallArgs = [
        'action/FIND_CANDIDATES_AND_CHANGE_ROUTE',
        {
          params: 'fetch filters params',
          $router: mockRouter
        }
      ];

      beforeEach(() => {
        store.state.filters.all = {
          tags: {
            month: {value: 'month', name: 'Month', tag_type: 'updated'},
            week: {value: 'week', name: 'Week', tag_type: 'updated'},
            day: {value: 'day', name: 'Day', tag_type: 'updated'}
          }
        };
      });

      it("should add 'day', 'week', 'month' filters when 'month' is passed", () => {
        const filterItem = {
          month: {value: 'month', name: 'Month', tag_type: 'updated'}
        };
        const expFirstCallArgs = [
          'action/ADD_TO_ACTIVE_FILTERS',
          {
            tags: {
              month: {value: 'month', name: 'Month', tag_type: 'updated'},
              week: {value: 'week', name: 'Week', tag_type: 'updated'},
              day: {value: 'day', name: 'Day', tag_type: 'updated'}
            }
          }
        ];
        vm.$filters.addActiveFilter(filterItem, filterType, mockRouter);
        expect(dispatchSpy.getCall(0).args).toEqual(expFirstCallArgs);
        expect(dispatchSpy.getCall(1).args).toEqual(expSecondCallArgs);
        expect(dispatchSpy.callCount).toEqual(2);
        expect(actions[ADD_TO_ACTIVE_FILTERS].calledOnce).toEqual(true);
        expect(actions[FIND_CANDIDATES_AND_CHANGE_ROUTE].calledOnce).toEqual(true);
      });

      it("should add 'day', 'week' filters when 'week' is passed", () => {
        const filterItem = {
          week: {value: 'week', name: 'Week', tag_type: 'updated'}
        };
        const expFirstCallArgs = [
          'action/ADD_TO_ACTIVE_FILTERS',
          {
            tags: {
              week: {value: 'week', name: 'Week', tag_type: 'updated'},
              day: {value: 'day', name: 'Day', tag_type: 'updated'}
            }
          }
        ];
        vm.$filters.addActiveFilter(filterItem, filterType, mockRouter);
        expect(dispatchSpy.getCall(0).args).toEqual(expFirstCallArgs);
        expect(dispatchSpy.getCall(1).args).toEqual(expSecondCallArgs);
        expect(dispatchSpy.callCount).toEqual(2);
        expect(actions[ADD_TO_ACTIVE_FILTERS].calledOnce).toEqual(true);
        expect(actions[FIND_CANDIDATES_AND_CHANGE_ROUTE].calledOnce).toEqual(true);
      });

      it("should add 'day' filter when 'day' is passed", () => {
        const filterItem = {
          day: {value: 'day', name: 'Day', tag_type: 'updated'}
        };
        const expFirstCallArgs = [
          'action/ADD_TO_ACTIVE_FILTERS',
          {
            tags: {day: {value: 'day', name: 'Day', tag_type: 'updated'}}
          }
        ];
        vm.$filters.addActiveFilter(filterItem, filterType, mockRouter);
        expect(dispatchSpy.getCall(0).args).toEqual(expFirstCallArgs);
        expect(dispatchSpy.getCall(1).args).toEqual(expSecondCallArgs);
        expect(dispatchSpy.callCount).toEqual(2);
        expect(actions[ADD_TO_ACTIVE_FILTERS].calledOnce).toEqual(true);
        expect(actions[FIND_CANDIDATES_AND_CHANGE_ROUTE].calledOnce).toEqual(true);
      });
    });

    describe('with position_functions (tree) filter', () => {
      const filterType = 'position_functions';

      it('should add a filter if no filters selected', () => {
        store.state.activeFiltersState = {};
        store.state.filters.all = {
          position_fields: {
            internet: {value: 'internet', name: 'internet'}
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
            }
          }
        };

        const filterItem = {
          python: {
            count: 2,
            name: 'Python',
            value: 'python',
            children: {},
            parentBranch: 'internet.backstage',
            isActive: false
          }
        };
        vm.$filters.addActiveFilter(filterItem, filterType, mockRouter);
        const expectedArgs = [
          [
            'action/ADD_TO_ACTIVE_FILTERS',
            {
              position_functions: {
                python: {
                  count: 2,
                  name: 'Python',
                  value: 'python',
                  children: {},
                  parentBranch: 'internet.backstage',
                  isActive: true
                }
              }
            }
          ],
          ['action/FIND_CANDIDATES_AND_CHANGE_ROUTE', {params: 'fetch filters params', $router: mockRouter}]
        ];
        expect([dispatchSpy.getCall(0).args, dispatchSpy.getCall(1).args]).toEqual(expectedArgs);
        expect(dispatchSpy.callCount).toEqual(2);
        expect(actions[REMOVE_FROM_ACTIVE_FILTERS].callCount).toEqual(0);
        expect(actions[ADD_TO_ACTIVE_FILTERS].calledOnce).toEqual(true);
        expect(actions[FIND_CANDIDATES_AND_CHANGE_ROUTE].calledOnce).toEqual(true);
      });

      it('should remove all children from active filter and add a top level one', () => {
        store.state.activeFiltersState = {
          position_functions: {
            java: {
              count: 1,
              name: 'Java Engineer',
              value: 'java',
              children: {},
              parentBranch: 'internet.backstage',
              isActive: true
            },
            php: {
              count: 1,
              name: 'PHP',
              value: 'php',
              children: {},
              parentBranch: 'internet.backstage',
              isActive: true
            }
          }
        };
        store.state.filters.all = {
          position_fields: {
            internet: {value: 'internet', name: 'internet'}
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
            }
          }
        };
        const internetFilter = {
          internet: {
            count: 8,
            name: 'Internet',
            value: 'internet',
            parentBranch: '',
            isActive: true,
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
                    parentBranch: 'internet.backstage',
                    isActive: true
                  },
                  php: {
                    count: 1,
                    name: 'PHP',
                    value: 'php',
                    children: {},
                    parentBranch: 'internet.backstage',
                    isActive: true
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
          }
        };
        vm.$filters.addActiveFilter(internetFilter, filterType, mockRouter);

        const expectedArgs = [
          [
            'action/REMOVE_FROM_ACTIVE_FILTERS',
            {
              position_functions: {
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
                      parentBranch: 'internet.backstage',
                      isActive: true
                    },
                    php: {
                      count: 1,
                      name: 'PHP',
                      value: 'php',
                      children: {},
                      parentBranch: 'internet.backstage',
                      isActive: true
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
            }
          ],
          [
            'action/REMOVE_FROM_ACTIVE_FILTERS',
            {
              position_functions: {
                java: {
                  count: 1,
                  name: 'Java Engineer',
                  value: 'java',
                  children: {},
                  parentBranch: 'internet.backstage',
                  isActive: true
                },
                php: {
                  count: 1,
                  name: 'PHP',
                  value: 'php',
                  children: {},
                  parentBranch: 'internet.backstage',
                  isActive: true
                },
                python: {
                  count: 2,
                  name: 'Python',
                  value: 'python',
                  children: {},
                  parentBranch: 'internet.backstage'
                }
              }
            }
          ],
          [
            'action/REMOVE_FROM_ACTIVE_FILTERS',
            {
              position_functions: {
                html5: {
                  count: 2,
                  name: 'HTML5',
                  value: 'html5',
                  children: {},
                  parentBranch: 'internet.web'
                }
              }
            }
          ],
          ['action/ADD_TO_ACTIVE_FILTERS', {position_functions: internetFilter}],
          ['action/FIND_CANDIDATES_AND_CHANGE_ROUTE', {params: 'fetch filters params', $router: mockRouter}]
        ];
        expect(dispatchSpy.callCount).toEqual(5);
        expect([
          dispatchSpy.getCall(0).args,
          dispatchSpy.getCall(1).args,
          dispatchSpy.getCall(2).args,
          dispatchSpy.getCall(3).args,
          dispatchSpy.getCall(4).args
        ]).toEqual(expectedArgs);
        expect(actions[REMOVE_FROM_ACTIVE_FILTERS].callCount).toEqual(3);
        expect(actions[ADD_TO_ACTIVE_FILTERS].calledOnce).toEqual(true);
        expect(actions[FIND_CANDIDATES_AND_CHANGE_ROUTE].calledOnce).toEqual(true);
      });

      it('should add a top level filter if all leaf filters became selected and remove leafs from active', () => {
        store.state.activeFiltersState = {
          position_functions: {
            java: {
              count: 1,
              name: 'Java Engineer',
              value: 'java',
              children: {},
              parentBranch: 'internet.backstage',
              isActive: true
            },
            php: {
              count: 1,
              name: 'PHP',
              value: 'php',
              children: {},
              parentBranch: 'internet.backstage',
              isActive: true
            }
          }
        };
        store.state.filters.all = {
          position_fields: {
            internet: {value: 'internet', name: 'internet'}
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
                      parentBranch: 'internet.backstage',
                      isActive: true
                    },
                    php: {
                      count: 1,
                      name: 'PHP',
                      value: 'php',
                      children: {},
                      parentBranch: 'internet.backstage',
                      isActive: true
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
            }
          }
        };

        const filterItem = {
          python: {
            count: 2,
            name: 'Python',
            value: 'python',
            children: {},
            parentBranch: 'internet.backstage'
          }
        };

        vm.$filters.addActiveFilter(filterItem, filterType, mockRouter);
        const expectedArgs = [
          [
            'action/ADD_TO_ACTIVE_FILTERS',
            {
              position_functions: {
                python: {
                  count: 2,
                  name: 'Python',
                  value: 'python',
                  children: {},
                  parentBranch: 'internet.backstage',
                  isActive: true
                }
              }
            }
          ],
          [
            'action/REMOVE_FROM_ACTIVE_FILTERS',
            {
              position_functions: {
                java: {
                  count: 1,
                  name: 'Java Engineer',
                  value: 'java',
                  children: {},
                  parentBranch: 'internet.backstage',
                  isActive: true
                },
                php: {
                  count: 1,
                  name: 'PHP',
                  value: 'php',
                  children: {},
                  parentBranch: 'internet.backstage',
                  isActive: true
                },
                python: {
                  count: 2,
                  name: 'Python',
                  value: 'python',
                  children: {},
                  parentBranch: 'internet.backstage'
                }
              }
            }
          ],
          [
            'action/ADD_TO_ACTIVE_FILTERS',
            {
              position_functions: {
                backstage: {
                  count: 4,
                  name: 'Backstage',
                  value: 'backstage',
                  parentBranch: 'internet',
                  isActive: true,
                  children: {
                    java: {
                      count: 1,
                      name: 'Java Engineer',
                      value: 'java',
                      children: {},
                      parentBranch: 'internet.backstage',
                      isActive: true
                    },
                    php: {
                      count: 1,
                      name: 'PHP',
                      value: 'php',
                      children: {},
                      parentBranch: 'internet.backstage',
                      isActive: true
                    },
                    python: {
                      count: 2,
                      name: 'Python',
                      value: 'python',
                      children: {},
                      parentBranch: 'internet.backstage'
                    }
                  }
                }
              }
            }
          ],
          ['action/FIND_CANDIDATES_AND_CHANGE_ROUTE', {params: 'fetch filters params', $router: mockRouter}]
        ];
        expect(dispatchSpy.callCount).toEqual(4);
        expect([
          dispatchSpy.getCall(0).args,
          dispatchSpy.getCall(1).args,
          dispatchSpy.getCall(2).args,
          dispatchSpy.getCall(3).args
        ]).toEqual(expectedArgs);
        expect(actions[REMOVE_FROM_ACTIVE_FILTERS].callCount).toEqual(1);
        expect(actions[ADD_TO_ACTIVE_FILTERS].callCount).toEqual(2);
        expect(actions[FIND_CANDIDATES_AND_CHANGE_ROUTE].calledOnce).toEqual(true);
      });
    });

    describe('with city (common) filter', () => {
      const filterType = 'cities';

      it('should add shanghai filter', () => {
        const filterItem = {
          shanghai: {value: 'shanghai', name: 'Shanghai'}
        };
        const expFirstCallArgs = [
          'action/ADD_TO_ACTIVE_FILTERS',
          {
            cities: {shanghai: {name: 'Shanghai', value: 'shanghai'}}
          }
        ];
        const expSecondCallArgs = [
          'action/FIND_CANDIDATES_AND_CHANGE_ROUTE',
          {
            params: 'fetch filters params',
            $router: mockRouter
          }
        ];
        vm.$filters.addActiveFilter(filterItem, filterType, mockRouter);
        expect(dispatchSpy.getCall(0).args).toEqual(expFirstCallArgs);
        expect(dispatchSpy.getCall(1).args).toEqual(expSecondCallArgs);
        expect(dispatchSpy.callCount).toEqual(2);
        expect(actions[ADD_TO_ACTIVE_FILTERS].calledOnce).toEqual(true);
        expect(actions[FIND_CANDIDATES_AND_CHANGE_ROUTE].calledOnce).toEqual(true);
      });
    });
  });
});
