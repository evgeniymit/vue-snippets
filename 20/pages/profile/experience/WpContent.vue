<template>
  <section>
    <div class="experience-wrapper">
      <h3 class="heading-3 experience-header" id="firstCandidate">Experience</h3>
      <div v-if="candidate && candidate.content" v-html="parseContent(candidate.content)">
      </div>
    </div>
  </section>
</template>

<script>
export default {
  methods: {
    isIE11() {
      return this.$browserDetermine.isIE11();
    },
    parseContent(content) {
      let html = document.createElement('html');
      html.innerHTML = content.replace(/\n/g, '<br>').replace(/(&nbsp;|\s)/g, ' ');
      let br = html.getElementsByTagName('br');
      for (let item of br) {
        if (item.nextSibling && item.nextSibling.nodeName.match('#text')) {
          this.isIE11() ? (item.style.cssText.display = 'none') : (item.style.display = 'none');
        }
      }
      let elems = html.getElementsByTagName('strong');
      for (let elem of elems) {
        elem.textContent = elem.textContent.replace(/\s+/g, ' ').toUpperCase();
        elem.setAttribute('class', 'secondary');
        if (elem.textContent.match(/^(Education:|Education：|Education|Educational & Qualification|教育经历)$/i)) {
          elem.setAttribute('class', 'education');
          elem.textContent = 'Education';
        }
        if (elem.textContent.match(/^(responsibilities|responsibility|(selected|main)?.?achievements).?\s?$/i)) {
          elem.setAttribute('class', 'list-header');
        }
      }
      return html.innerHTML;
    }
  },
  props: {
    candidate: Object
  }
};
</script>

<style lang="scss" scoped>
@import '~VariablesStyles';

.experience-wrapper {
  padding: 0 50px 0 0;
  h3 {
    text-align: left;
    margin: 0;
    &.experience-header {
      display: inline-block;
    }
  }
  /deep/ .list-header {
    display: block;
    margin-top: 10px;
    color: $dark-gray;
    font-size: 11px;
    font-weight: 600;
  }
  /deep/ div > ul {
    margin: 10px 0;
    padding: 15px;
  }
  /deep/ div > strong {
    font-size: $size-13;
  }
  /deep/ .education {
    display: block;
    font-size: 24px;
    font-weight: 500;
    text-align: left;
    color: black;
    margin-top: 20px;
  }
  /deep/ .secondary {
    color: $secondary;
  }
  /deep/ li {
    list-style-type: disc;
  }
  /deep/ li,
  /deep/ p {
    font-size: $size-12;
  }
  /deep/ ul br {
    display: none;
  }
}
</style>
