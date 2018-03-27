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
    const stars = document.querySelectorAll('.stars > li');

    // shuffle
    setTimeout(function () {  

        const stateObj = {
            moves   : 0,
            count   : 0,
            found   : 0,
            rating  : 3,
            symbols : {
                s1  : null,
                s2  : null,
            },
        };

        const timer = new Timer({
            tick : 1,
            ontick : function (millisec) {
                
                var sec = Math.round(millisec / 1000);
                timerEl.textContent = sec;
                
    
            },
            onstart : function(millisec) {
                console.log('timer started');
    
                var sec = Math.round(millisec / 1000);
                timerEl.textContent = sec;
    
            },
            onend  : function() {
                resetFn();
            }
        });

        let timeText = '';

        const modal = new tingle.modal({
            footer: true,
            stickyFooter: true,
            closeMethods: ['overlay', 'button', 'escape'],
            closeLabel: "Close",
            cssClass: ['custom-class-1', 'custom-class-2'],
            onOpen: function() {

                timer.stop();
                timeText = document.querySelector('#timer').innerText;

                modal.setContent(`<h1>Congratulations! You Won!</h1><p>With ${ stateObj.moves } Moves</p><p>and Stars: ${ stateObj.rating }<p/><p>Time: ${ timeText }</p>`);

                // add a button
                modal.addFooterBtn('Play Again', 'tingle-btn tingle-btn--primary', function() {
                    // here goes some logic
                    resetFn();
                    modal.close();
                });

                console.log('modal open', timeText);
            },
            onClose: function() {
                resetFn();
                console.log('modal closed');
            },
            beforeClose: function() {
                // here's goes some logic
                // e.g. save content before closing the modal
                return true; // close the modal
                return false; // nothing happens
            }
        });

        const timerEl = document.querySelector('#timer');
        const CARDS_NUM = document.querySelectorAll('.card').length;
        const MAX_MOVES = 3;
    
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
                        //1. start timer
                        
                        timer.start(500);


                        //2.

                        stateObj.symbols.s1 = _this.children[0].classList[1];

                        _this.classList.toggle('selected');
                        _this.classList.toggle('animated');

                        break;


                case 2 : 
                        //0. 
                        stateObj.symbols.s2 = _this.children[0].classList[1];

                        _this.classList.toggle('selected');
                        _this.classList.toggle('animated');
                        
                        // add moves
                        addMoves();

                        //1. dont allow other clicks
                        removeClickListenerToCards();

                        //2. check if they DONT have the same symbol
                        if ( stateObj.symbols.s1 !== stateObj.symbols.s2 ) {

                            const _selectedCards = document.querySelectorAll('li.selected');
                            
                            for ( sCard of _selectedCards ) {
                                sCard.classList.toggle('not-match');
                                sCard.classList.toggle('shake');
                            }

                            setTimeout(function () {

                                for ( sCard of _selectedCards ) {
                                    sCard.classList.remove('open');
                                    sCard.classList.remove('show');
                                    sCard.classList.remove('selected');
                                    sCard.classList.remove('animated');
                                    sCard.classList.remove('not-match');
                                    sCard.classList.remove('shake');
                                }                                
                                console.log(stateObj)

                                setClickListenerToCards();

                            }, 1300);



                        }
                        else {

                            

                            setTimeout(function () {
                                const cards = document.querySelectorAll('li.open');

                                for ( card of cards) {
                                    card.classList.add('match');
                                    card.classList.add('animated');
                                    card.classList.add('rubberBand');
                                    card.classList.remove('selected');
                                    
                                }

                                stateObj.found += 2;
                                console.log(stateObj);
                                
                                if( stateObj.found ===  CARDS_NUM ) {
                                    
                                    // open modal
                                    openModal();

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
         * 5. addMoves
         */ 
        function addMoves () {
        
            ++stateObj.moves;

            if (stateObj.moves === 17 ) {
                --stateObj.rating;
                document.querySelectorAll('.stars li')[2].innerHTML = `<i class="fa fa-star-o"></i>`;
            }


            if (stateObj.moves === 25 ) {
                --stateObj.rating;
                document.querySelectorAll('.stars li')[1].innerHTML = `<i class="fa fa-star-o"></i>`;
            }            

            // refactor
            let num = stateObj.moves;
            const moves = document.querySelector('.moves').textContent = `${num}`;
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

                // stop timer
                timer.stop();
                timerEl.textContent = '';

                // reset state obj
                stateObj.moves   = 0;
                stateObj.count   = 0;
                stateObj.found   = 0;
                stateObj.rating  = 3;
                stateObj.symbols = {
                    s1  : null,
                    s2  : null,
                }

                //refactor
                const moves = document.querySelector('.moves').textContent = `${stateObj.moves}`;
                const allCards = document.querySelectorAll('.card');

                for(card of allCards) {
                    card.classList.remove('open');
                    card.classList.remove('show');
                    card.classList.remove('match');
                }

                for(star of stars) {
                    star.innerHTML='<i class="fa fa-star"></i>';
                }

                initApp();
        };


        /**
         * 8. Modal
         */
        function openModal () {
            // open modal
            modal.open();
        };


        setClickListenerToCards();
        resetGame();


    }, 0);

 };

 document.addEventListener('DOMContentLoaded', initApp);
