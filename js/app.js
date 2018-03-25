/*
 * Create a list that holds all of your cards
 */


/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

 function initApp() {

    /**
     * 0. state of the app
     */    
    
    const deck = document.querySelector('.deck');
    const cardsAll = document.querySelectorAll('.card');
    const card_arr = [];

    // shuffle
    setTimeout(function () {    
        const CARDS_NUM = document.querySelectorAll('.card').length;
        const STARS_NUM = document.querySelector('.stars').children.length;
        
        const stateObj = {
            moves   : STARS_NUM,
            count   : 0,
            found   : 0,
            hiddenStars: 0,
            symbols : {
                s1  : null,
                s2  : null,
            },
        };
            

        const fragment = document.createDocumentFragment();

        // add to the array
        for (c of cardsAll) {
            card_arr.push(c);
        }

        shuffle(card_arr);
        
        for ( item of card_arr ) {

            const newLI = document.createElement('li');
            newLI.classList.add('card');
            newLI.innerHTML = item.innerHTML;
            fragment.appendChild(newLI);
        }

        console.log(fragment)

        deck.innerHTML = '';
        deck.appendChild(fragment);




        /**
         * 1. store all the cards into a variable
         */
        const cards = document.querySelectorAll('li.card:not(.open):not(.show):not(.match)');


        /**
         * 2. set and click listener function for the cards
         */    
        function clickCard(event) {
            
            let _this = event.target;

            ++stateObj.count;
            
            if ( _this.nodeName !== "LI" ) {
                return;
            }

            _this.classList.toggle('open');
            _this.classList.toggle('show');

            switch(stateObj.count) {

                case 1 : 

                        stateObj.symbols.s1 = _this.children[0].classList[1];

                        break;


                case 2 : 
                        //0. 
                        stateObj.symbols.s2 = _this.children[0].classList[1];
                        

                        //1. dont allow other clicks
                        removeClickListenerToCards();

                        //2. check if they DONT have the same symbol
                        if ( stateObj.symbols.s1 !== stateObj.symbols.s2 ) {
                            

                            setTimeout(function () {
                                const cards = document.querySelectorAll('li.open.show');

                                for ( card of cards) {
                                    card.classList.remove('open');
                                    card.classList.remove('show');
                                }
                                console.log(stateObj)

                                reduceMoves();

                                setClickListenerToCards();

                            }, 1300);

                        }
                        else {

                            setTimeout(function () {
                                const cards = document.querySelectorAll('li.open');

                                for ( card of cards) {
                                    card.classList.add('match');
                                }

                                stateObj.found += 2;
                                console.log(stateObj);
                                
                                if( stateObj.found ===  CARDS_NUM ) {
                                    alert('You wanna!!!!!');
                                    return;
                                }

                                setClickListenerToCards();

                            }, 0);

                        }


                        //3. set count to zero
                        stateObj.count = 0;            

                    break;

            }
            

        };


        /**
         * 3. add the listener to the cards
         */    
        function setClickListenerToCards () {
            
            // for perfomance reasons
            setTimeout( function() {

                for( card of cards ) {
                    card.addEventListener('click', clickCard);
                }

            },0);

        };


        /**
         * 4. remove the listener to the cards
         */
        function removeClickListenerToCards () {
            
            // for perfomance reasons
            setTimeout( function() {
                stateObj.symbols.s1 = stateObj.symbols.s2 = null;

                for( card of cards ) {
                    card.removeEventListener('click', clickCard);
                }

            },0);

        };


        /**
         * 5. reduceMoves
         */ 
        function reduceMoves () {
            
            --stateObj.moves;

            if (!stateObj.moves) {
                setTimeout(function(){

                    alert('you lost');

                    resetFn();
                    
                }, 10);
            }

            // refactor
            let num = stateObj.moves;
            const moves = document.querySelector('.moves').textContent = `${num}`;
            const stars = document.querySelector('.stars').children[stateObj.hiddenStars].style="visibility: hidden";
            ++stateObj.hiddenStars;
        };


        /**
         * 6. restart game
         */
        function resetGame () {
            document.querySelector('.restart').addEventListener('click', resetFn);
        };


        /**
         * 7. reset values
         */
        function resetFn () {
                // reset state obj
                stateObj.moves = STARS_NUM;
                stateObj.count = 0;
                stateObj.found = 0;
                stateObj.hiddenStars = 0;
                stateObj.symbols = {
                    s1  : null,
                    s2  : null,
                }

                //refactor
                const moves = document.querySelector('.moves').textContent = `${stateObj.moves}`;
                const stars = document.querySelector('.stars').children;
                const allCards = document.querySelectorAll('.card');
                
                for(star of stars) {
                    star.style = "visibility: visible";
                }

                for(card of allCards) {
                    card.classList.remove('open');
                    card.classList.remove('show');
                    card.classList.remove('match');
                }

                initApp();
        };




        setClickListenerToCards();
        resetGame();



    }, 0);

 };

 document.addEventListener('DOMContentLoaded', initApp);
