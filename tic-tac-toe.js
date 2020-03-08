Vue.component('game-title', {
    template: `
        <h1>
            <a href="https://en.wikipedia.org/wiki/Tic-tac-toe">Tic Tac Toe</a>
        </h1>
    `,
});

Vue.component('welcome-message', {
    props: {
        'message': String,
        'playerNames': {
            type: Array,
            default: () => [],
        }
    },
    computed: {
        // a computed getter
        messageToPlayers() {
            // `this` points to the vm instance
            if (this.playerNames.length) {
                return `${this.message} ${this.playerNames.join(', ')}`;   
            } else {
                return this.message;
            }
        }
    },
    template: `
        <p>
          {{ messageToPlayers }}
        </p>
    `,
});

Vue.component('ready-checkbox', {
    props: {
        'name': String,
    },
    data: function() {
        const id = `ready-switch-for-${this.name}`;
        return {
            checked: false,  
            id
        };
    },
    methods: {
        onClick(event) {
            this.checked = event.target.checked;
            this.$emit('player-ready', this.name, this.checked);
        }
    },
    template: `
        <div class="custom-control custom-switch">
            <input type="checkbox" class="custom-control-input" :id="id" :checked="checked" @click="onClick">
            <label class="custom-control-label" :for="id">{{name}}, are you ready?</label>
        </div>
    `,
});

Vue.component('game-board', {
    data: function() {
        return {
            classObject: ['container', 'm-auto', 'bg-light', 'd-flex', 'flex-column'],
            styleObject: { 
                'width': '900px', 
                'height': '900px' 
            },
            boardRowClasses: ['board-row', 'row', 'flex-grow-1'],
            boardCellClasses: ['board-cell', 'col', 'p-4', 'border', 'border-primary', 'rounded-lg'],
            cells: ['', '', '' ],
            whichTurn: 0,
        };
    },
    methods: {
        boardRowKey(r) {
            return `row-${r}`;
        },
        boardCellKey(r, c) {
            return `cell-${r}-${c}`;
        },

        onClick(){

        },

        cellOnClicked(r, c) {
            const piece = this.getPiece(r, c);
            if (piece !== ''){
                // do nothing
            } else {
                if(this.whichTurn % 2 === 0){
                    console.log('first click')
                    this.setPiece(r, c, 'x');
                }else{
                    this.setPiece(r, c, 'o');
                }
                this.whichTurn++;
            }
        },
        getPiece(r, c) {
            this.cells[this.getID(r, c)];
        },

        setPiece(r, c, v) {
            this.$set(this.cells, this.getID(r, c), v);
        },
        getID(r, c) {
            return (r - 1) * 3 + c;
        }
    },
    template: `
        <div id="board" :class="classObject" :style="styleObject">
            <div v-for="r of 3" :key="boardRowKey(r)" :class="boardRowClasses">
                <div
                    @click="cellOnClicked(r, c)"
                    v-for="c of 3"
                    :key="boardCellKey(r, c)"
                    :id="getID(r, c)"
                    :class="[{'bg-white': [2, 4, 6, 8].includes((r - 1) * 3 + c)} ,boardCellClasses]">
                    {{getPiece(r, c)}}
                </div>
            </div>
        </div>
    `
});

export default {
    data() {
        return {
            message: 'Welcome to the game!',
            playerNames: [],
            appClasses: ['w-100', 'h-100', 'p-5', 'd-flex', 'flex-column', 'align-items-center'],
            playerReady: {}
        }
    },
    created() {
        const self = this;
        window.setTimeout(() => {
            self.message = 'Ready to get started?';
            self.playerNames.push('Alice', 'Bob');
        }, 1000);
    },
    methods: {
        onPlayerReady(playerName, isReady) {
            this.$set(this.playerReady, playerName, isReady);
        }
    },
    computed: {
        bothPlayerReady() {
            return this.playerNames.length && 
                this.playerNames.map(playerName => this.playerReady[playerName])
                    .reduce((prevValue, currValue) => prevValue && currValue);
        }
    },
    template: `
    <div id="app" :class="appClasses">
        <game-title></game-title>
        <welcome-message :message="message" :player-names="playerNames"></welcome-message>
        <template v-if="playerNames.length">
            <ready-checkbox :name="playerNames[0]" @player-ready="onPlayerReady"></ready-checkbox>
            <ready-checkbox :name="playerNames[1]" @player-ready="onPlayerReady"></ready-checkbox>
        </template>
        <div v-else>
            <div class="spinner-grow text-primary" role="status">
                <span class="sr-only">Loading...</span>
            </div>
        </div>
        <game-board v-if="bothPlayerReady"></game-board>
    </div>
    `
};
                