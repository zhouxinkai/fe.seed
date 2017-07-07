import Vue from 'vue';

import Component from 'vue-class-component';
require('./index.css');

@require('./index.html')
@Component
export default class Loading extends Vue {
  showFlag: number = 1;
}
