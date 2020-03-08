export default {
    props: {
        substitution: String,
        input: String,
    },
    computed: {
        filled() {
            return !!this.input;
        },
        text() {
            return this.filled? this.input: this.substitution;
        },
        classes() {
            if (this.filled) {
                return ['font-weight-bold'];
            } else {
                return [
                    'border-bottom',
                    'px-2',
                    'text-muted'
                ];
            }
            
        }
    },
    template: `
        <span :class="classes">{{text}}</span>
    `,
};
