import Vue from 'https://cdn.jsdelivr.net/npm/vue@2.6.11/dist/vue.esm.browser.js';
import { madlibs } from './resources/resources.js';
import GameComponent from './components/GameComponent.js';


console.log(`${madlibs.length} madlibs loaded`);

export default {
    data() {
        return {
            madlib: null,
            appClasses: ['p-4', 'd-flex', 'h-100', 'flex-column', 'align-items-center', 'justify-content-start'],
        }
    },
    components: {
        'game-component': GameComponent,
    },

    created () {
        this.useRandomMadlib();
    },

    methods: {
        getRandomMadlibIndex() {
            return Math.floor(Math.random() * madlibs.length);
        },
        getRandomMadlib() {
            return madlibs[this.getRandomMadlibIndex()];
        },
        useRandomMadlib() {
            this.madlib = this.getRandomMadlib();            
        }
    },

    template: `
        <main id="app" :class="appClasses">
            <h1>Madlib Game</h1>
            <button @click="useRandomMadlib" class="btn btn-secondary mx-2" type="reset">Reset</button>
            <game-component :madlib="madlib"></game-component>
        </main>
    `
}
