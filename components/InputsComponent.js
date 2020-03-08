import InputComponent from './InputComponent.js';

export default {
    props: {
        'substitutions': Array,
    },
    components: {
        'input-component': InputComponent,
    },
    methods: {
        onInput(sid, val) {
            this.$emit('on-input', sid, val);
        }
    },
    data() {
        return {
            classes: ['d-flex', 'flex-column', 'justify-content-around', 'bg-secondary', 'col', 'p-4'],
            inputs: [],
        };
    },
    template: `
        <div :class="classes">
            <input-component
                v-for="(substitution, index) of substitutions"
                @on-input="onInput"
                :key="index"
                :sid="index"
                :substitution-label-name="substitution"
            ></input-component>
        </div>
    `,
};
