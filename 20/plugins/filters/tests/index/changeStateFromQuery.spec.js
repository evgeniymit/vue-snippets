import {filtersFeature} from '@/plugins/filters/index';
import Vue from '@/common/test-helpers/mock-vue';
import Vuex from 'vuex';
import sinon from 'sinon';
import filterGetters from '@/store/modules/filters/getters';
import commonGetters from '@/store/getters';
import {
  ADD_TO_ACTIVE_FILTERS,
  CHANGE_SEARCH_STATE,
  CHANGE_ORDERING_STATE,
  REMOVE_FROM_ACTIVE_FILTERS
} from '@/store/modules/filters/constants';


describe('filtersFeature', () => {
  let template, vm, store, actions, mutations;

  actions = {
    [ADD_TO_ACTIVE_FILTERS]: sinon.stub(),
    [CHANGE_ORDERING_STATE]: sinon.stub(),
    [CHANGE_SEARCH_STATE]: sinon.stub(),
    [REMOVE_FROM_ACTIVE_FILTERS]: sinon.stub()
  };
  mutations = {
    changeSalaryMaxState: sinon.stub(),
    changeSalaryMinState: sinon.stub(),
    changeSearchCandidatesFormState: sinon.stub(),
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

  afterAll(() => {
    store.dispatch.restore();
    commitSpy.restore();
    vm.$filters.getFetchFiltersParams.restore();
  });

  describe('changeStateFromQuery', () => {
    beforeEach(() => {
      store.state.activeFiltersState = null;
    });
    afterEach(() => {
      dispatchSpy.reset();
      commitSpy.reset();
      mutations['changeSalaryMaxState'].reset();
      mutations['changeSalaryMinState'].reset();
      actions[CHANGE_SEARCH_STATE].reset();
      actions[CHANGE_ORDERING_STATE].reset();
      actions[ADD_TO_ACTIVE_FILTERS].reset();
      actions[REMOVE_FROM_ACTIVE_FILTERS].reset();
    });

    describe('has only search', () => {
      it('should do nothing', () => {
        const search = 'test';
        const ordering = null;
        const query = {};
        vm.$filters.changeStateFromQuery({search, ordering, ...query});
        expect(dispatchSpy.callCount).toEqual(0);
        expect(commitSpy.callCount).toEqual(1);
        expect(commitSpy.getCall(0).args).toEqual(['changeSearchCandidatesFormState', 'test']);
      });
    });

    describe('has only ordering', () => {
      it('should do nothing', () => {
        const search = null;
        const ordering = 'esc';
        const query = {};
        vm.$filters.changeStateFromQuery({search, ordering, ...query});
        expect(dispatchSpy.callCount).toEqual(0);
      });
    });

    describe('has salary_min in query', () => {
      it('should commit changeSalaryMinState if value is valid', () => {
        const search = null;
        const ordering = null;
        const query = {salary_min: 100};
        vm.$filters.changeStateFromQuery({search, ordering, ...query});
        expect(commitSpy.callCount).toEqual(1);
        expect(dispatchSpy.callCount).toEqual(0);
        expect(commitSpy.getCall(0).args).toEqual(['changeSalaryMinState', 100]);
      });

      it('should not commit anything if value is invalid', () => {
        const search = null;
        const ordering = null;
        const query = {salary_min: 'some value'};
        vm.$filters.changeStateFromQuery({search, ordering, ...query});
        expect(commitSpy.callCount).toEqual(0);
        expect(dispatchSpy.callCount).toEqual(0);
      });
    });

    describe('has salary_max in query', () => {
      it('should commit changeSalaryMaxState if value is valid', () => {
        const search = null;
        const ordering = null;
        const query = {salary_max: 800000};
        vm.$filters.changeStateFromQuery({search, ordering, ...query});
        expect(commitSpy.callCount).toEqual(1);
        expect(dispatchSpy.callCount).toEqual(0);
        expect(commitSpy.getCall(0).args).toEqual(['changeSalaryMaxState', 800000]);
      });

      it('should not commit anything if value is invalid', () => {
        const search = null;
        const ordering = null;
        const query = {salary_max: 'some value'};
        vm.$filters.changeStateFromQuery({search, ordering, ...query});
        expect(commitSpy.callCount).toEqual(0);
        expect(dispatchSpy.callCount).toEqual(0);
      });
    });

    describe('has position_functions (tree) filter in query', () => {
      it('should add proper filters to active filters', () => {
        store.state.filters.all = {
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
        const search = null;
        const ordering = null;
        const query = {position_functions: 'web,python,php'};

        vm.$filters.changeStateFromQuery({search, ordering, ...query});

        const expectedArgs = [
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
          [
            'action/ADD_TO_ACTIVE_FILTERS',
            {
              position_functions: {
                web: {
                  count: 2,
                  name: 'Web',
                  value: 'web',
                  parentBranch: 'internet',
                  isActive: true,
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
            'action/ADD_TO_ACTIVE_FILTERS',
            {
              position_functions: {
                php: {
                  count: 1,
                  name: 'PHP',
                  value: 'php',
                  children: {},
                  parentBranch: 'internet.backstage',
                  isActive: true
                }
              }
            }
          ]
        ];
        expect(dispatchSpy.callCount).toEqual(4);
        expect([
          dispatchSpy.getCall(0).args,
          dispatchSpy.getCall(1).args,
          dispatchSpy.getCall(2).args,
          dispatchSpy.getCall(3).args
        ]).toEqual(expectedArgs);
        expect(actions[REMOVE_FROM_ACTIVE_FILTERS].callCount).toEqual(1);
        expect(actions[ADD_TO_ACTIVE_FILTERS].callCount).toEqual(3);
      });

      it('should add proper filters to active filters (top level)', () => {
        store.state.filters.all = {
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
        const search = null;
        const ordering = null;
        const query = {position_functions: 'web,python,php,java'};

        vm.$filters.changeStateFromQuery({search, ordering, ...query});

        const expectedArgs = [
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
          [
            'action/ADD_TO_ACTIVE_FILTERS',
            {
              position_functions: {
                web: {
                  count: 2,
                  name: 'Web',
                  value: 'web',
                  parentBranch: 'internet',
                  isActive: true,
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
            'action/ADD_TO_ACTIVE_FILTERS',
            {
              position_functions: {
                php: {
                  count: 1,
                  name: 'PHP',
                  value: 'php',
                  children: {},
                  parentBranch: 'internet.backstage',
                  isActive: true
                }
              }
            }
          ],
          [
            'action/ADD_TO_ACTIVE_FILTERS',
            {
              position_functions: {
                java: {
                  count: 1,
                  name: 'Java Engineer',
                  value: 'java',
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
                  parentBranch: 'internet.backstage',
                  isActive: true
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
                      parentBranch: 'internet.backstage',
                      isActive: true
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
                      parentBranch: 'internet.backstage',
                      isActive: true
                    }
                  }
                },
                web: {
                  count: 2,
                  name: 'Web',
                  value: 'web',
                  parentBranch: 'internet',
                  isActive: true,
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
          [
            'action/ADD_TO_ACTIVE_FILTERS',
            {
              position_functions: {
                internet: {
                  count: 8,
                  name: 'Internet',
                  isActive: true,
                  value: 'internet',
                  parentBranch: '',
                  children: {
                    backstage: {
                      count: 4,
                      name: 'Backstage',
                      isActive: true,
                      value: 'backstage',
                      parentBranch: 'internet',
                      children: {
                        java: {
                          count: 1,
                          name: 'Java Engineer',
                          value: 'java',
                          isActive: true,
                          children: {},
                          parentBranch: 'internet.backstage'
                        },
                        php: {
                          count: 1,
                          name: 'PHP',
                          value: 'php',
                          isActive: true,
                          children: {},
                          parentBranch: 'internet.backstage'
                        },
                        python: {
                          count: 2,
                          name: 'Python',
                          value: 'python',
                          isActive: true,
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
                      isActive: true,
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
          ]
        ];
        expect(dispatchSpy.callCount).toEqual(11);
        expect([
          dispatchSpy.getCall(0).args,
          dispatchSpy.getCall(1).args,
          dispatchSpy.getCall(2).args,
          dispatchSpy.getCall(3).args,
          dispatchSpy.getCall(4).args,
          dispatchSpy.getCall(5).args,
          dispatchSpy.getCall(6).args,
          dispatchSpy.getCall(7).args,
          dispatchSpy.getCall(8).args,
          dispatchSpy.getCall(9).args,
          dispatchSpy.getCall(10).args
        ]).toEqual(expectedArgs);
        expect(actions[REMOVE_FROM_ACTIVE_FILTERS].callCount).toEqual(5);
        expect(actions[ADD_TO_ACTIVE_FILTERS].callCount).toEqual(6);
      });
    });

    describe('has other filters in query', () => {
      it('should dispatch ADD_TO_ACTIVE_FILTERS action several times', () => {
        const search = null;
        const ordering = null;
        const query = {cities: 'shanghai,kyiv', industries: 'programming'};
        store.state.filters.all = {
          cities: {
            shanghai: {name: 'shanghai', value: 'shanghai'},
            kyiv: {name: 'kyiv', value: 'kyiv'},
            zp: {name: 'zp', value: 'zp'}
          },
          industries: {
            programming: {name: 'programming', value: 'programming'},
            other: {name: 'other', value: 'other'}
          }
        };
        vm.$filters.changeStateFromQuery(query);

        expect(dispatchSpy.getCall(0).args).toEqual([
          ADD_TO_ACTIVE_FILTERS,
          {
            cities: {
              shanghai: {name: 'shanghai', value: 'shanghai'},
              kyiv: {name: 'kyiv', value: 'kyiv'}
            }
          }
        ]);
        expect(dispatchSpy.getCall(1).args).toEqual([
          ADD_TO_ACTIVE_FILTERS,
          {
            industries: {
              programming: {name: 'programming', value: 'programming'}
            }
          }
        ]);
        expect(dispatchSpy.callCount).toEqual(2);
        expect(actions[ADD_TO_ACTIVE_FILTERS].calledTwice).toEqual(true);
      });
    });
  });
});
