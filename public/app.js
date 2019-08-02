/* eslint-disable */
function dateFormat(timestamp) {
  return dateFns.format(
    new Date(parseInt(timestamp, 10)),
    'MM/DD/YYYY hh:mm A'
  );
}

new Vue({
  el: '#app',
  data: {
    longUrl: '',
    shortUrl: '',
    error: '',
    submitting: false,
    submitSuccess: false,
    linkCopied: false,
    gettingPreviousResults: false,
    showingPreviousResults: false,
    previousResultsError: '',
    previousResults: [],
    previousResultsColumnLayout: [
      {
        field: 'timestamp',
        label: 'Timestamp'
      },
      {
        field: 'longUrl',
        label: 'Long URL'
      },
      {
        field: 'link',
        label: 'Short URL'
      }
    ]
  },
  methods: {
    submit: async function(e) {
      e.preventDefault();
      this.submitting = true;
      this.previousResultsError = '';

      try {
        const response = await axios.post('/short-urls', {
          longUrl: this.longUrl
        });

        this.error = '';
        this.shortUrl = response.data.link;
        this.previousResults.unshift({
          longUrl: response.data.longUrl,
          link: response.data.link,
          timestamp: dateFormat(response.data.timestamp)
        });
        this.submitSuccess = true;
        this.submitting = false;
      } catch (e) {
        if (e.response.status === 400) {
          this.error = 'Invalid URL.';
        } else {
          this.error = 'Server error.';
        }
        this.submitting = false;
        console.log(e.response.status);
      }
    },
    clearUrlField: function() {
      this.error = '';
      this.submitSuccess = false;
    },
    handleCopyClick: async function(e) {
      try {
        await this.$copyText(this.shortUrl);
        this.linkCopied = true;
        setTimeout(() => {
          this.linkCopied = false;
        }, 3000);
      } catch (e) {}
    },
    togglePreviousresults: async function() {
      if (!this.showingPreviousResults) {
        this.gettingPreviousResults = true;
        try {
          const response = await axios.get('/short-urls');
          this.previousResults = response.data
            .sort((cur, next) => {
              return parseInt(cur, 10) > parseInt(next, 10) ? 1 : -1;
            })
            .map(({ timestamp, link, longUrl }) => ({
              timestamp: dateFormat(timestamp),
              link,
              longUrl
            }));
          this.previousResultsError = '';
          this.gettingPreviousResults = false;
          this.showingPreviousResults = true;
        } catch (e) {
          this.previousResultsError = 'Could not retrieve previous results.';
          this.gettingPreviousResults = false;
        }
      } else {
        this.showingPreviousResults = false;
      }
    }
  }
});
