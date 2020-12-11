const PriceInput = {
  name: 'MultipleInput',
  model: {
    prop: 'value',
    event: 'change'
  },
  props: ['value', 'placeholder'],
  template: `
    <span>
      <a-input
        :value="inputOne"
        :placeholder="placeholder[0]"
        @change="handleInputOneChange"
        style="width: 38%; margin-right: 1%;padding-right: 11px"
      />
      ~
      <a-input
        :value="inputTwo"
        :placeholder="placeholder[1]"
        @change="handleInputTwoChange"
        style="width: 38%; margin-left: 1%;padding-right: 11px"
      />
    </span>
  `,
  data() {
    const value = this.value || {}
    return {
      inputOne: value.inputOne || '',
      inputTwo: value.inputTwo || ''
    }
  },
  watch: {
    value(val = {}) {
      this.inputOne = val.inputOne || ''
      this.inputTwo = val.inputTwo || ''
    }
  },
  methods: {
    handleInputOneChange(e) {
      const inputOne = e.target.value
      this.triggerChange({ inputOne })
    },
    handleInputTwoChange(e) {
      const inputTwo = e.target.value
      this.triggerChange({ inputTwo })
    },
    triggerChange(changedValue) {
      // Should provide an event to pass value to Form.
      this.$emit('change', Object.assign({}, this.$data, changedValue))
    }
  }
}
export default PriceInput
