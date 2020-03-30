import tagFilter from '@/plugins/filters/tag';
import {isEmpty} from 'lodash';

describe('tag plugin', () => {
  let store = {
    getters: {
      allFiltersState: {
        tags: {
          active: {
            name: 'Active',
            tag_type: 'status',
            value: 'active'
          },
          coi: {
            min_coi_number: 5,
            name: 'Companies of interest',
            need_activation: false,
            tag_type: 'coi',
            value: 'coi'
          },
          day: {
            name: 'Day',
            tag_type: 'updated',
            value: 'day'
          },
          internal: {
            name: 'Offline',
            tag_type: 'status',
            value: 'internal'
          },
          month: {
            name: 'Month',
            tag_type: 'updated',
            value: 'month'
          },
          week: {
            name: 'Week',
            tag_type: 'updated',
            value: 'week'
          }
        }
      }
    }
  };
  const tag = tagFilter(store);

  describe('checking "getTagsForActiveFilters" method', () => {
    const filterItem = {
      month: {
        name: 'Month',
        tag_type: 'updated',
        value: 'month'
      }
    };

    const expectedResult = [
      {
        name: 'Week',
        tag_type: 'updated',
        value: 'week'
      },
      {
        name: 'Month',
        tag_type: 'updated',
        value: 'month'
      },
      {
        name: 'Day',
        tag_type: 'updated',
        value: 'day'
      }
    ];
    test('should return "month", "day" and "week" objects if user selected "month"', () => {
      const returnedTagList = tag.getTagsForActiveFilters(filterItem);
      expect(returnedTagList).toEqual(expectedResult);
    });
    test('should return array with length is 3 elements', () => {
      const returnedTagList = tag.getTagsForActiveFilters(filterItem);
      expect(returnedTagList).toHaveLength(3);
    });

    test('should return array with only one element (day) if user selected "day" tag', () => {
      const filterItem = {
        day: {
          name: 'Day',
          tag_type: 'updated',
          value: 'day'
        }
      };

      const expectedResult = [
        {
          name: 'Day',
          tag_type: 'updated',
          value: 'day'
        }
      ];
      const returnedTagList = tag.getTagsForActiveFilters(filterItem);
      expect(returnedTagList).toEqual(expectedResult);
    });

    test('should return array with length is 1 element (if selected only day)', () => {
      const filterItem = {
        day: {
          name: 'Day',
          tag_type: 'updated',
          value: 'day'
        }
      };

      const returnedTagList = tag.getTagsForActiveFilters(filterItem);
      expect(returnedTagList).toHaveLength(1);
    });

    test('should return array with "week" and "day" if selected only "week"', () => {
      const filterItem = {
        week: {
          name: 'Week',
          tag_type: 'updated',
          value: 'week'
        }
      };

      const expectedResult = [
        {
          name: 'Week',
          tag_type: 'updated',
          value: 'week'
        },
        {
          name: 'Day',
          tag_type: 'updated',
          value: 'day'
        }
      ];
      const returnedTagList = tag.getTagsForActiveFilters(filterItem);
      expect(returnedTagList).toEqual(expectedResult);
    });

    test('should return array with length is 2 if selected only "week" tag', () => {
      const filterItem = {
        week: {
          name: 'Week',
          tag_type: 'updated',
          value: 'week'
        }
      };

      const returnedTagList = tag.getTagsForActiveFilters(filterItem);
      expect(returnedTagList).toHaveLength(2);
    });
  });

  describe('checking "getTagsForDeletingActiveFilters" method', () => {
    const filterItem = {
      day: {
        name: 'Day',
        tag_type: 'updated',
        value: 'day'
      }
    };

    const expectedResult = [
      {
        name: 'Week',
        tag_type: 'updated',
        value: 'week'
      },
      {
        name: 'Day',
        tag_type: 'updated',
        value: 'day'
      },
      {
        name: 'Month',
        tag_type: 'updated',
        value: 'month'
      }
    ];
    test('should return array contains all tags for deleting if deleted "day" tag', () => {
      const returnedTagList = tag.getTagsForDeletingActiveFilters(filterItem);
      expect(returnedTagList).toEqual(expectedResult);
    });
    test('should return array with length is 3', () => {
      const returnedTagList = tag.getTagsForDeletingActiveFilters(filterItem);
      expect(returnedTagList).toHaveLength(3);
    });
    test('should return array contains "week" and "month" tags if deleted only "week" tag', () => {
      const filterItem = {
        week: {
          name: 'Week',
          tag_type: 'updated',
          value: 'week'
        }
      };

      const expectedResult = [
        {
          name: 'Month',
          tag_type: 'updated',
          value: 'month'
        },
        {
          name: 'Week',
          tag_type: 'updated',
          value: 'week'
        }
      ];

      const returnedTagList = tag.getTagsForDeletingActiveFilters(filterItem);
      expect(returnedTagList).toEqual(expectedResult);
    });

    test('should return array with length is 2 if deleted only "week" tag', () => {
      const filterItem = {
        week: {
          name: 'Week',
          tag_type: 'updated',
          value: 'week'
        }
      };
      const returnedTagList = tag.getTagsForDeletingActiveFilters(filterItem);
      expect(returnedTagList).toHaveLength(2);
    });
  });

  test('should return array with only "month" tag if deleted "month"', () => {
    const filterItem = {
      month: {
        name: 'Month',
        tag_type: 'updated',
        value: 'month'
      }
    };

    const expectedResult = [
      {
        name: 'Month',
        tag_type: 'updated',
        value: 'month'
      }
    ];
    const returnedTagList = tag.getTagsForDeletingActiveFilters(filterItem);
    expect(returnedTagList).toEqual(expectedResult);
  });

  test('should return array with length is 1 if deleted only month tag', () => {
    const filterItem = {
      month: {
        name: 'Month',
        tag_type: 'updated',
        value: 'month'
      }
    };

    const returnedTagList = tag.getTagsForDeletingActiveFilters(filterItem);
    expect(returnedTagList).toHaveLength(1);
  });
});
