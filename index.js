import Madlib from './lab3/js/madlibs.js';

Vue.component('new-tweet', {
    data() {
        return{
            text: '',
            created_at: moment(new Date(),).format('MMMM Do YYYY, HH:mm:ss'),
            
            styleForm: {
                'width': '900px',
                'height': '200px',
                'background-color': '#F8F8F8'
            },

            textareaStyle: {
                'width': '870px',
                'height': '80px',
                'margin-left': '10px'
            },

            buttonStyle:{
                'background-color': ' #4AB3F4',
                'float': 'right'
            },
            dateStyle:{
                'text-align': 'right'
            }
        };
    },

    methods: {
        getTweetText(){
            event.preventDefault();
            this.$emit('new-text', this.text);
            this.$emit('new-date', this.created_at);
        },
    },

    template: `
    <div class="container" :style="styleForm">
        <div class="row">
            <div class="col">
                <h4>Write a New Tweet</h4>
            </div>
        </div>
        <div class="row">
            <div class="col">
             <textarea v-model="text" class="form-control z-depth-1" id="exampleFormControlTextarea345" rows="3" placeholder="What's on your mind..."></textarea>
            </div>
        </div>
        <div class="row">
            <div class="col">
              <p :style="dateStyle">{{created_at}}</p>
            </div>
        </div>
        <div class="row">
            <div class="col">
              <button :style="buttonStyle" @click="getTweetText">Submit</button>
            </div>
        </div>
    </div>
  `
});

//==============================================================================
Vue.component('post-tweet', {
    data() {
        return {
            newTweet:{
                text: '',
                created_at: '',
                user: {
                    name: '',
                    profileImage: ''
                }
            },
            imageStyle:{
                'width': '55px',
                'height': '55px', 
                'justify-content': 'left',
                'border-radius': '50%',
            },
            dateStyle:{
                'text-align': 'right',
            },
            containerStyle:{
                'background-color': '#d4ebf2'
            },
            display: false,            
        };
    },   

    methods: {
        displayNewTweet(tweetText) {
            this.newTweet.text= tweetText;
            this.newTweet.user.name= 'You';
            this.display=true;
            this.newTweet.user.profileImage= './penguin.png';
        },

        displayDate(postDate){
            this.newTweet.created_at= postDate;
        },
    },

    template: `
    <div class="container">
      <new-tweet @new-text="displayNewTweet" @new-date="displayDate"></new-tweet>
        <div class="row" v-if="this.display== true" :style="containerStyle">
            <div class="col-250px">
                <img :style="imageStyle" :src="newTweet.user.profileImage">
            </div>
            <div class="col-sm">
                <h3>{{newTweet.user.name}}</h3>
                <p v-resize-text="{ratio:0.5, minFontSize: '16px', maxFontSize: '22px', delay: 200}">{{newTweet.text}}</p>
                <p :style="dateStyle">{{newTweet.created_at}}</p>
            </div>
        </div>
    </div>
   `
});

//==============================================================================
Vue.component('tweets', {
    data() {
        return {
            posts: [],
            searchWord: '', 
            busy: true,
        };
    },

    created() {
        this.fetchData();

        window.addEventListener('scroll', () => {
            this.loadMore();
        });
    },

    methods: {
        fetchData: function () {
            fetch('http://ec2-54-172-96-100.compute-1.amazonaws.com/feed/random?q=noodle')
                .then(res => res.json())
                .then(data => {
                    this.posts = data.statuses;
                }).catch(err => {
                    console.log('Error:', err);
                });
        },

        getSearchWord(word){
            this.searchWord= word;
        },

        endOfPage(){
            // let bottomOfWindow = Math.max(window.pageYOffset, document.documentElement.scrollTop, document.body.scrollTop) + window.innerHeight === document.documentElement.offsetHeight;
            let bottomOfWindow= window.innerHeight + window.scrollY >= document.body.offsetHeight;
            if (bottomOfWindow) {
                console.log('reached the bottom');
                return true;
            }else{
                return false;
            }
        }, 

        loadMore(){
            if(this.endOfPage() && this.busy){
                console.log('before fetching');
                fetch('http://ec2-54-172-96-100.compute-1.amazonaws.com/feed/random?q=noodle')
                    .then(res => res.json())
                    .then(data => {
                        this.posts.push(...data.statuses); 
                    }).catch(err => {
                        console.log('Error:', err);
                    });
            }      
        }
    },

    computed: {
        filteredPosts: function () {
            const filteredTweets= this.posts.filter((post) => {
                return post.text.match(this.searchWord);
            });

            return filteredTweets.sort((a, b) => { 
                return new Date(b.created_at) - new Date(a.created_at);
            }); 
        },
    },

    template: `
      <div>
        <search-filter @key-word="getSearchWord"></search-filter>
        <post-tweet></post-tweet>
        <single-tweet v-for="(post, idx) in filteredPosts" :post="post"></single-tweet>
      </div>
    `
});

Vue.component('single-tweet', {
    data() {
        return {
            imageStyle:{
                'width': '55px',
                'height': '55px', 
                'justify-content': 'left',
                'border-radius': '50%',
            },
            dateStyle:{
                'text-align': 'right'
            }
        };
    },
    props :{
        post: Object,
    },

    computed : {
        username(){
            return this.post.user.name;
        }, 

        profileImage(){
            return this.post.user.profile_image_url;
        }, 

        text(){
            return this.post.text;
        },

        datePosted(){
            return moment(this.post.created_at,).format("MMMM Do YYYY, HH:mm:ss");
        }
    },

    template: `
    <div class="container">
        <div class="row">
            <div class="col-250px">
                <img :style="imageStyle" :src="profileImage" alt="Img">
            </div>
            <div class="col-sm">
                <h3>{{username}}</h3>
                <p v-resize-text="{ratio:0.5, minFontSize: '16px', maxFontSize: '22px', delay: 200}">{{text}}</p>
                <p :style="dateStyle">{{datePosted}}</p>
            </div>
        </div>
    </div>
    `
});

//=============================================================================================

Vue.component('search-filter', {
    data() {
        return{
            searchInput: '',
            searchStyle:{
                'text-align': 'right',
                'padding-bottom': '10px',
                'padding-right': '10px'
            }
        };
    },

    methods: {
        getWord(){
            console.log('getword');
            this.$emit('key-word', this.searchInput);
        }
    },

    template: `
      <div v-bind:style="searchStyle">
      <label for="searchBar">Search: </label>
      <input type="search" id="searchBar" v-model="searchInput" @input.stop="getWord" placeholder="Search in tweets"><br>
      </div>
    `
});

const myRouter= new VueRouter({
    routes: [
        {path: '/Madlib', component: Madlib}
    ]
});


//==================================================================================

new Vue({
    el: '#twitterPosts',
    router: myRouter,
});
