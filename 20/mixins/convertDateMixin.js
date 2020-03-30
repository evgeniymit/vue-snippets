export default {
  methods: {
    convertDate(experienceItem, type, phase) {
      /* For correctly render we need to subtract for every month - 1 */
      const localExperienceItem = {...experienceItem};
      for (let option in localExperienceItem) {
        if (option.search(/_month/g) !== -1) {
          localExperienceItem[option] = localExperienceItem[option] - 1;
        }
      }

      /* Convert first letter to Upper */
      const format = type.replace(type[0], type[0].toUpperCase());
      /* We need to check set Month or Year */
      const funcName = `set${format}`;
      return new Date()[funcName](localExperienceItem[`${phase}_${type}`]);
    }
  }
};
