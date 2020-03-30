import moment from 'moment';
import config from '@/const/config';

const PARSE_TEMPLATE = 'YYYY-MM-DDTHH:mm:ss.SSSSSSZ';

export default {
  methods: {
    formatDate(dateString) {
      if (!dateString) {
        return 'N/A';
      }
      const momentDate = moment(dateString, PARSE_TEMPLATE);
      return momentDate.format(config.dateFormat);
    },
    formatTime(dateString) {
      if (!dateString) {
        return 'N/A';
      }
      const momentDate = moment(dateString, PARSE_TEMPLATE);
      return momentDate.format(config.timeFormat);
    },
  },
};
