global.window = {};
window.localStorage = global.localStorage;

import testAction from 'top20common/distribution/test-helpers/testAction';
import sinon from 'sinon';
import actions from '@/store/modules/filters/actions';
import {
  FETCH_FILTERS_REQUEST,
  FETCH_FILTERS_SUCCESS,
  UPDATE_ACTIVE_FILTERS_MUTATION,
  FETCH_FILTERS_FAILURE
} from '@/store/modules/filters/constants';
import CandidatesService from 'top20common/distribution/services/candidates';

describe('fetchFiltersAction', () => {
  let fetchOptionsStub;
  let getters = {};

  afterEach(() => {
    fetchOptionsStub.restore();
  });

  describe('fetchFiltersAction action with no params', () => {
    it('when request is successful', done => {
      const response = {data: {salary_max: 100, salary_min: 50, salary_range_indexes: ['ranges'], cities: ['kyiv']}};
      const payload = {};
      const state = {};
      const expectedMutations = [
        {type: FETCH_FILTERS_REQUEST},
        {type: FETCH_FILTERS_SUCCESS, payload: {cities: ['kyiv']}},
        {type: 'markTop5GroupMutation', payload: "cities"},
        {type: 'markTop5GroupMutation', payload: "industries"},
        {type: UPDATE_ACTIVE_FILTERS_MUTATION, payload: {cities: ['kyiv']}},
        {type: 'changeOptionsState', payload: {salaryMin: 50, salaryMax: 100, salaryRanges: ['ranges']}},
      ];

      fetchOptionsStub = sinon.stub(CandidatesService, 'fetchOptions').resolves(response);
      testAction(actions.fetchFiltersAction, payload, state, getters, expectedMutations, done);
      expect(fetchOptionsStub.getCall(0).args).toEqual([{}]);
      expect(fetchOptionsStub.callCount).toEqual(1);
    });

    it('when request has failed', done => {
      const response = {response: {data: {errors: 'Some error'}}};
      const payload = {};
      const state = {};
      const expectedMutations = [{type: FETCH_FILTERS_REQUEST}, {type: FETCH_FILTERS_FAILURE, payload: 'Some error'}];

      fetchOptionsStub = sinon.stub(CandidatesService, 'fetchOptions').rejects(response);
      testAction(actions.fetchFiltersAction, payload, state, getters, expectedMutations, done);
      expect(fetchOptionsStub.getCall(0).args).toEqual([{}]);
      expect(fetchOptionsStub.callCount).toEqual(1);
    });
  });

  describe('fetchFiltersAction action with params', () => {
    it('when request is successful', done => {
      const response = {data: {salary_max: 100, salary_min: 50, salary_range_indexes: ['ranges'], cities: ['kyiv']}};
      const payload = {cities: 'kyiv'};
      const state = {};
      const expectedMutations = [
        {type: FETCH_FILTERS_REQUEST},
        {type: FETCH_FILTERS_SUCCESS, payload: {cities: ['kyiv']}},
        {type: 'markTop5GroupMutation', payload: "cities"},
        {type: 'markTop5GroupMutation', payload: "industries"},
        {type: UPDATE_ACTIVE_FILTERS_MUTATION, payload: {cities: ['kyiv']}},
        {type: 'changeOptionsState', payload: {salaryMin: 50, salaryMax: 100, salaryRanges: ['ranges']}}
      ];
      fetchOptionsStub = sinon.stub(CandidatesService, 'fetchOptions').resolves(response);
      testAction(actions.fetchFiltersAction, payload, state, getters, expectedMutations, done);
      expect(fetchOptionsStub.getCall(0).args).toEqual([{cities: 'kyiv'}]);
      expect(fetchOptionsStub.callCount).toEqual(1);
    });

    it('when request has failed', done => {
      const response = {response: {data: {errors: 'Some error'}}};
      const payload = {cities: 'kyiv'};
      const state = {};
      const expectedMutations = [{type: FETCH_FILTERS_REQUEST}, {type: FETCH_FILTERS_FAILURE, payload: 'Some error'}];

      fetchOptionsStub = sinon.stub(CandidatesService, 'fetchOptions').rejects(response);
      testAction(actions.fetchFiltersAction, payload, state, getters, expectedMutations, done);
      expect(fetchOptionsStub.getCall(0).args).toEqual([{cities: 'kyiv'}]);
      expect(fetchOptionsStub.callCount).toEqual(1);
    });
  });
});
