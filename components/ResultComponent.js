import SubstitutionComponent from './SubstitutionComponent.js';

export default {
    props: {
        inputs: Array,
        substitutions: Array,
        madlibContent: String,
    },
    data() {
        return {
            classes: ['d-flex', 'bg-white', 'col', 'p-4'],
            styles: {
                'font-size': 'larger',
                'line-height': 2,
            }
        };
    },
    components: {
        'substitution-component': SubstitutionComponent
    },
    computed: {
        numInputs() {
            return this.substitutions.length;
        },
        contentTexts() {
            let rightBracketPos = 0;
            let leftBracketPos = 0;

            const texts = [];
            // eslint-disable-next-line no-constant-condition
            while (true) {
                leftBracketPos = this.madlibContent.indexOf('[', rightBracketPos);
                if (leftBracketPos === -1) {
                    // no further substitution exists
                    texts.push(this.madlibContent.slice(rightBracketPos));
                    break;
                } else {
                    texts.push(this.madlibContent.slice(rightBracketPos, leftBracketPos));
                    rightBracketPos = this.madlibContent.indexOf(']', leftBracketPos);
                }
            }

            return texts.map(text => text.replace(/[[\]]/g, ''));
        },
    },
    template: `
        <div :class="classes" :style="styles">
            <p>
                <span v-for="(text, idx) of contentTexts">
                    <span>{{text}}</span>
                    <substitution-component :key="idx" :input="inputs[idx]" :substitution="substitutions[idx]" v-if="idx < numInputs"></substitution-component>
                </span>
            </p>
        </div>
    `,
};
