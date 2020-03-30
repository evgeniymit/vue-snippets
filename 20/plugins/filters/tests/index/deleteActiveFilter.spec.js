import {filtersFeature} from '@/plugins/filters/index';
import Vue from '@/common/test-helpers/mock-vue';
import Vuex from 'vuex';
import sinon from 'sinon';
import filterGetters from '@/store/modules/filters/getters';
import commonGetters from '@/store/getters';
import {REMOVE_FROM_ACTIVE_FILTERS} from '@/store/modules/filters/constants';
import {FIND_CANDIDATES_AND_CHANGE_ROUTE} from '@/store/constants';
import {ADD_TO_ACTIVE_FILTERS} from '@/store/modules/filters/constants';


describe('filtersFeature', () => {
  const mockRouter = {};
  let template, vm, store, actions;

  actions = {
    [FIND_CANDIDATES_AND_CHANGE_ROUTE]: sinon.stub(),
    [REMOVE_FROM_ACTIVE_FILTERS]: sinon.stub(),
    [ADD_TO_ACTIVE_FILTERS]: sinon.stub()
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
    actions
  });

  template = `<div id="app"></div>`;
  vm = new Vue({template, store}).$mount();
  Vue.use(filtersFeature, {store});

  let dispatchSpy = sinon.spy(store, 'dispatch');
  let commitStub = sinon.stub(store, 'commit');
  let fetchFiltersStub = sinon.stub(vm.$filters, 'getFetchFiltersParams');

  afterAll(() => {
    store.dispatch.restore();
    commitStub.restore();
    vm.$filters.getFetchFiltersParams.restore();
  });

  afterEach(() => {
    commitStub.reset();
  });

  describe('deleteActiveFilter', () => {
    beforeAll(() => {
      fetchFiltersStub.returns('fetch filters params');
    });
    afterEach(() => {
      dispatchSpy.reset();
      actions[REMOVE_FROM_ACTIVE_FILTERS].reset();
      actions[FIND_CANDIDATES_AND_CHANGE_ROUTE].reset();
    });

    it('should commit changeSalaryMaxState and changeSalaryMinState', () => {
      vm.$filters.deleteActiveFilter(null, 'salaries', mockRouter);
      expect(commitStub.callCount).toEqual(2);
      expect(commitStub.getCall(0).args).toEqual(['changeSalaryMinState', null]);
      expect(commitStub.getCall(1).args).toEqual(['changeSalaryMaxState', null]);
      expect(actions[FIND_CANDIDATES_AND_CHANGE_ROUTE].calledOnce).toEqual(true);
    })

    describe('with tags filter', () => {
      const filterType = 'tags';

      beforeEach(() => {
        store.state.filters.all = {
          tags: {
            month: {value: 'month', name: 'Month', tag_type: 'updated'},
            week: {value: 'week', name: 'Week', tag_type: 'updated'},
            day: {value: 'day', name: 'Day', tag_type: 'updated'}
          }
        };
      });

      it("should delete 'day', 'week', 'month' filters when 'day' is passed", () => {
        const filterItem = {
          day: {value: 'day', name: 'Day', tag_type: 'updated'}
        };
        const expFirstCallArgs = [
          REMOVE_FROM_ACTIVE_FILTERS,
          {
            tags: {
              month: {value: 'month', name: 'Month', tag_type: 'updated'},
              week: {value: 'week', name: 'Week', tag_type: 'updated'},
              day: {value: 'day', name: 'Day', tag_type: 'updated'}
            }
          }
        ];
        const expSecondCallArgs = [
          FIND_CANDIDATES_AND_CHANGE_ROUTE,
          {
            params: 'fetch filters params',
            $router: mockRouter
          }
        ];
        vm.$filters.deleteActiveFilter(filterItem, filterType, mockRouter);
        expect(dispatchSpy.getCall(0).args).toEqual(expFirstCallArgs);
        expect(dispatchSpy.getCall(1).args).toEqual(expSecondCallArgs);
        expect(dispatchSpy.callCount).toEqual(2);
        expect(actions[REMOVE_FROM_ACTIVE_FILTERS].calledOnce).toEqual(true);
        expect(actions[FIND_CANDIDATES_AND_CHANGE_ROUTE].calledOnce).toEqual(true);
      });

      it("should delete 'week', 'month' filters when 'week' is passed", () => {
        const filterItem = {
          week: {value: 'week', name: 'Week', tag_type: 'updated'}
        };
        const expFirstCallArgs = [
          REMOVE_FROM_ACTIVE_FILTERS,
          {
            tags: {
              month: {value: 'month', name: 'Month', tag_type: 'updated'},
              week: {value: 'week', name: 'Week', tag_type: 'updated'}
            }
          }
        ];
        const expSecondCallArgs = [
          FIND_CANDIDATES_AND_CHANGE_ROUTE,
          {
            params: 'fetch filters params',
            $router: mockRouter
          }
        ];
        vm.$filters.deleteActiveFilter(filterItem, filterType, mockRouter);
        expect(dispatchSpy.getCall(0).args).toEqual(expFirstCallArgs);
        expect(dispatchSpy.getCall(1).args).toEqual(expSecondCallArgs);
        expect(dispatchSpy.callCount).toEqual(2);
        expect(actions[REMOVE_FROM_ACTIVE_FILTERS].calledOnce).toEqual(true);
        expect(actions[FIND_CANDIDATES_AND_CHANGE_ROUTE].calledOnce).toEqual(true);
      });

      it("should delete 'month' filters when 'month' is passed", () => {
        const filterItem = {
          month: {value: 'month', name: 'Month', tag_type: 'updated'}
        };
        const expFirstCallArgs = [
          REMOVE_FROM_ACTIVE_FILTERS,
          {
            tags: {
              month: {value: 'month', name: 'Month', tag_type: 'updated'}
            }
          }
        ];
        const expSecondCallArgs = [
          FIND_CANDIDATES_AND_CHANGE_ROUTE,
          {
            params: 'fetch filters params',
            $router: mockRouter
          }
        ];
        vm.$filters.deleteActiveFilter(filterItem, filterType, mockRouter);
        expect(dispatchSpy.getCall(0).args).toEqual(expFirstCallArgs);
        expect(dispatchSpy.getCall(1).args).toEqual(expSecondCallArgs);
        expect(dispatchSpy.callCount).toEqual(2);
        expect(actions[REMOVE_FROM_ACTIVE_FILTERS].calledOnce).toEqual(true);
        expect(actions[FIND_CANDIDATES_AND_CHANGE_ROUTE].calledOnce).toEqual(true);
      });
    });

    describe('with industries filter', () => {
      const filterType = 'industries';

      it('should delete industry and job_title filters', () => {
        store.state.activeFiltersState = {
          industries: {ind: {value: 'ind', name: 'ind'}},
          job_titles: {jobs: {value: 'jobs', name: 'jobs'}}
        };
        const filterItem = {ind: {value: 'ind', name: 'ind'}};
        const expCallsArgs = [
          [REMOVE_FROM_ACTIVE_FILTERS, {industries: {ind: {value: 'ind', name: 'ind'}}}],
          [REMOVE_FROM_ACTIVE_FILTERS, {job_titles: {jobs: {value: 'jobs', name: 'jobs'}}}],
          [REMOVE_FROM_ACTIVE_FILTERS, {position_functions: undefined}],
          [FIND_CANDIDATES_AND_CHANGE_ROUTE, {params: 'fetch filters params', $router: mockRouter}]
        ];
        vm.$filters.deleteActiveFilter(filterItem, filterType, mockRouter);
        expect([
          dispatchSpy.getCall(0).args,
          dispatchSpy.getCall(1).args,
          dispatchSpy.getCall(2).args,
          dispatchSpy.getCall(3).args
        ]).toEqual(expCallsArgs);
        expect(dispatchSpy.callCount).toEqual(4);
        expect(actions[REMOVE_FROM_ACTIVE_FILTERS].callCount).toEqual(3);
        expect(actions[FIND_CANDIDATES_AND_CHANGE_ROUTE].calledOnce).toEqual(true);
      });

      it('should delete industry and position_functions filters', () => {
        store.state.activeFiltersState = {
          industries: {ind: {value: 'ind', name: 'ind'}},
          position_functions: {funcs: {value: 'funcs', name: 'FUNCS'}}
        };
        const filterItem = {ind: {value: 'ind', name: 'ind'}};
        const expCallsArgs = [
          [REMOVE_FROM_ACTIVE_FILTERS, {industries: {ind: {value: 'ind', name: 'ind'}}}],
          [REMOVE_FROM_ACTIVE_FILTERS, {job_titles: undefined}],
          [REMOVE_FROM_ACTIVE_FILTERS, {position_functions: {funcs: {value: 'funcs', name: 'FUNCS'}}}],
          [FIND_CANDIDATES_AND_CHANGE_ROUTE, {params: 'fetch filters params', $router: mockRouter}]
        ];
        vm.$filters.deleteActiveFilter(filterItem, filterType, mockRouter);
        expect([
          dispatchSpy.getCall(0).args,
          dispatchSpy.getCall(1).args,
          dispatchSpy.getCall(2).args,
          dispatchSpy.getCall(3).args
        ]).toEqual(expCallsArgs);
        expect(dispatchSpy.callCount).toEqual(4);
        expect(actions[REMOVE_FROM_ACTIVE_FILTERS].callCount).toEqual(3);
        expect(actions[FIND_CANDIDATES_AND_CHANGE_ROUTE].calledOnce).toEqual(true);
      });

      it('should delete industry filter', () => {
        store.state.activeFiltersState = {
          industries: {ind: {value: 'ind', name: 'ind'}}
        };
        const filterItem = {ind: {value: 'ind', name: 'ind'}};
        const expCallsArgs = [
          [REMOVE_FROM_ACTIVE_FILTERS, {industries: {ind: {value: 'ind', name: 'ind'}}}],
          [REMOVE_FROM_ACTIVE_FILTERS, {job_titles: undefined}],
          [REMOVE_FROM_ACTIVE_FILTERS, {position_functions: undefined}],
          [FIND_CANDIDATES_AND_CHANGE_ROUTE, {params: 'fetch filters params', $router: mockRouter}]
        ];
        vm.$filters.deleteActiveFilter(filterItem, filterType, mockRouter);
        expect([
          dispatchSpy.getCall(0).args,
          dispatchSpy.getCall(1).args,
          dispatchSpy.getCall(2).args,
          dispatchSpy.getCall(3).args
        ]).toEqual(expCallsArgs);
        expect(dispatchSpy.callCount).toEqual(4);
        expect(actions[REMOVE_FROM_ACTIVE_FILTERS].callCount).toEqual(3);
        expect(actions[FIND_CANDIDATES_AND_CHANGE_ROUTE].calledOnce).toEqual(true);
      });
    });

    describe('with position_functions (tree) filter', () => {
      const filterType = 'position_functions';

      it('should remove filter from active filters if the filter is actually in active filters', () => {
        store.state.activeFiltersState = {
          position_fields: {
            internet: {value: 'internet', name: 'internet'}
          },
          position_functions: {
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
        };
        const filterItem = {
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
        };
        vm.$filters.deleteActiveFilter(filterItem, filterType, mockRouter);
        const expCallsArgs = [
          [
            REMOVE_FROM_ACTIVE_FILTERS,
            {
              position_functions: {
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
          [FIND_CANDIDATES_AND_CHANGE_ROUTE, {params: 'fetch filters params', $router: mockRouter}]
        ];
        expect(dispatchSpy.callCount).toEqual(2);
        expect([dispatchSpy.getCall(0).args, dispatchSpy.getCall(1).args]).toEqual(expCallsArgs);
        expect(actions[REMOVE_FROM_ACTIVE_FILTERS].callCount).toEqual(1);
        expect(actions[FIND_CANDIDATES_AND_CHANGE_ROUTE].callCount).toEqual(1);
      });

      it("should add to active all filter's neighbors and all neighbors of it's parents if the filter isn't in active filters and remove top level filter from active", () => {
        const filters = {
          position_fields: {
            internet: {value: 'internet', name: 'internet'}
          },
          position_functions: {
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
        store.state.activeFiltersState = {...filters};
        store.state.filters.all = {...filters};
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
        vm.$filters.deleteActiveFilter(filterItem, filterType, mockRouter);
        const expCallsArgs = [
          [
            ADD_TO_ACTIVE_FILTERS,
            {
              position_functions: {
                java: {
                  count: 1,
                  name: 'Java Engineer',
                  value: 'java',
                  children: {},
                  parentBranch: 'internet.backstage'
                }
              }
            }
          ],
          [
            ADD_TO_ACTIVE_FILTERS,
            {
              position_functions: {
                php: {
                  count: 1,
                  name: 'PHP',
                  value: 'php',
                  children: {},
                  parentBranch: 'internet.backstage'
                }
              }
            }
          ],
          [
            ADD_TO_ACTIVE_FILTERS,
            {
              position_functions: {
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
            REMOVE_FROM_ACTIVE_FILTERS,
            {
              position_functions: {
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
            }
          ],
          [FIND_CANDIDATES_AND_CHANGE_ROUTE, {params: 'fetch filters params', $router: mockRouter}]
        ];
        expect(dispatchSpy.callCount).toEqual(5);
        expect([
          dispatchSpy.getCall(0).args,
          dispatchSpy.getCall(1).args,
          dispatchSpy.getCall(2).args,
          dispatchSpy.getCall(3).args,
          dispatchSpy.getCall(4).args
        ]).toEqual(expCallsArgs);
        expect(actions[REMOVE_FROM_ACTIVE_FILTERS].callCount).toEqual(1);
        expect(actions[ADD_TO_ACTIVE_FILTERS].callCount).toEqual(3);
        expect(actions[FIND_CANDIDATES_AND_CHANGE_ROUTE].callCount).toEqual(1);
      });
    });

    describe('with city (common) filter', () => {
      const filterType = 'cities';

      it('should delete "shanghai" filter', () => {
        store.state.activeFiltersState = {
          cities: {shanghai: {value: 'shanghai', name: 'Shanghai'}}
        };
        const filterItem = {
          shanghai: {value: 'shanghai', name: 'Shanghai'}
        };
        const expFirstCallArgs = [
          REMOVE_FROM_ACTIVE_FILTERS,
          {
            cities: {
              shanghai: {
                name: 'Shanghai',
                value: 'shanghai'
              }
            }
          }
        ];
        const expSecondCallArgs = [
          FIND_CANDIDATES_AND_CHANGE_ROUTE,
          {
            params: 'fetch filters params',
            $router: mockRouter
          }
        ];
        vm.$filters.deleteActiveFilter(filterItem, filterType, mockRouter);
        expect(dispatchSpy.getCall(0).args).toEqual(expFirstCallArgs);
        expect(dispatchSpy.getCall(1).args).toEqual(expSecondCallArgs);
        expect(dispatchSpy.callCount).toEqual(2);
        expect(actions[REMOVE_FROM_ACTIVE_FILTERS].calledOnce).toEqual(true);
        expect(actions[FIND_CANDIDATES_AND_CHANGE_ROUTE].calledOnce).toEqual(true);
      });
    });
  });
});
