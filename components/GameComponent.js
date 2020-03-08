import InputsComponent from './InputsComponent.js';
import ResultComponent from './ResultComponent.js';

export default {
    props: {
        'madlib': Object,
    },
    data() {
        return {
            classes: ['container', 'w-100', 'bg-light', 'd-flex', 'flex-row', 'py-2'],
            style: {
            },
            inputs: [],
        };
    },
    created() {
    },
    components: {
        'inputs-component': InputsComponent,
        'result-component': ResultComponent
    },
    methods: {
        onInput(sid, val) {
            this.$set(this.inputs, sid, val);
        }
    },
    computed: {
        madlibContent() {
            return this.madlib.content;
        },
        
        madlibSubstitutions() {
            return this.madlibContent.match(/\[([^\])]*)\]/g).map(substitution => substitution.slice(1, -1));
        },
    },
    template: `
        <div :class="classes" :style="style">
            <inputs-component :substitutions="madlibSubstitutions" @on-input="onInput"></inputs-component>
            <result-component :inputs="inputs" :substitutions="madlibSubstitutions" :madlib-content="madlibContent"></result-component>
        </div>
    `,
};
