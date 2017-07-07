import Vue from 'vue'
import Component from 'vue-class-component'
import {Prop} from 'utils'

require('./index.css')

@require('./index.html')
@Component
export default class Badge extends Vue {
  @Prop format: string // defalut 实心样式, hollow 使用空心样式
}
