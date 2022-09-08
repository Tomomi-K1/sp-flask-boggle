// const $submitBtn = $('#submitBtn');
// const input = document.querySelector('input');
// const $table = $('table');
// const $startBtn = $('#start');

// let total = 0; //using this total for keeping the score
// let userAnswerList = []; //using this list to check if user is not inputing the same word twice.

// //======Sending User Answer with Axios and Checking Request ====//

// //takes res from backend and shows wether user input is valid answer or not on HTML//
// function showResult(res){
//     $('.result').text(`your answer is ${res}`)
// }

// //shows score on html
// function score(){
//     $('.score').text(total);
// }

// async function submitAnswerAndShowResult(){
//     //get user input and make it lower case
//     let userAnswer = $('input').val().toLowerCase();
//     //check if user already input the same word
//     if(userAnswerList.includes(userAnswer)){
//         $('.result').text(`You entered ${userAnswer} already. Please find other words`)
//         input.value ='';
//     //check if user input any words
//     } else if(userAnswer === ''){
//         $('.result').text('Please enter a word')
//     // sends post request to backend and get response to show result
//     } else {
//         userAnswerList.push(userAnswer)
//            // but default, axios sends Post data it passes as JSON
//         let res = await axios.post('/check-answer', {answer: userAnswer});
//         showResult(res.data.result);
//         console.log(res.data.result);
//         if (res.data.result == 'ok'){
//         total += userAnswer.length;
//         }
//     }
//     score();
// }

// //show the score 0 first
// score();

// //EVENT======submitting user ansewr======//
// $submitBtn.click(function(evt){
//     console.log('submitBtn');
//     evt.preventDefault();
//     submitAnswerAndShowResult()
//     input.value ='';
//     }
// )


// // ==== setting up count down and disable submit botton =======///
// // put count down from 60 and disable the submit button once the clock reaches the 0
// //Most of the code below is from Sample Game Timer by Tony Kay on codepen (https://codepen.io/awkay/pen/ExzGea)
// let timer;
// let timeLeft = 60;//seconds

// async function gameover(){
//     clearInterval(timer);
//     //hide the count down section
//     $('.timer-section').hide();
//     //hide user input form so user can no longer enter
//     $('#answerForm').hide();
//     //show "play again!" button
//     $('.restart-btn').show();
//     //assign empty list to the list that was made to check duplicate answers
//     userAnswerList = [];
//     //======sending user scoare and number thorugh axios =====//
//     await axios.post('/store-user-data', { score : total});

// }

// //count down from 60 until 0, when it reaches to 0, gameover function is fired.
// function updateTimer(){
//     timeLeft -= 1;
//     if(timeLeft >= 0){
//         $('.timer').html(timeLeft)
//     } else {
//         gameover();
//     }
// }

// //start the timer
// function start(){
//     timer = setInterval(updateTimer, 1000)
// }

// //EVENT======start the game======//
// $startBtn.click(function(evt){
//     evt.preventDefault();
//     console.log('startBtn');
//     //hide the star button so user cannot click it again
//     $startBtn.hide();
//     //show 60 (if I don't have this, countdown will show up from 59)
//     $('.timer').html(timeLeft);
//     //show "you have XX seconds remaining"
//     $('.timer-section').show();
//     //start the timer
//     start();
// })
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//
// remake this to Object Oriented JS

class BoggleGame {

    constructor(timeLeft = 60){
        this.timeLeft = timeLeft;//60seconds
        this.userAnswerList = new Set();
        this.totalScore = 0;
        this.showScore()
        this.showTimer();
        
               
        $('#start').on('click', this.startGame.bind(this));  
        $('#submitBtn').on('click', this.handleSubmit.bind(this));            //     console.log('submitBtn');
              
    }

    start(){
        this.timer = setInterval(this.updateTimer.bind(this), 1000)
    }

    startGame(evt){
        evt.preventDefault();
         //hide the star button so user cannot click it again
        $('#start').hide();
        //start the timer
        this.start();
        //show 60 (if I don't have this, countdown will show up from 59)
        $('.timer').html(this.timeLeft);
        //show "you have XX seconds remaining"
        $('.timer-section').show();
        

    }

    showTimer(){
        $('.timer').html(this.timeLeft);
    }   

    showMessage(msg, cls){
        $(".msg").text(msg).removeClass().addClass(`msg ${cls}`);
    }

    //shows score on html
    showScore(){
    $('.score').text(this.totalScore);
    }  
    
    async updateTimer(){
        this.timeLeft -= 1;
        if(this.timeLeft >= 0){
            $('.timer').html(this.timeLeft)
        } else {
            await this.gameover();
        }
    }

    async handleSubmit(evt){
        evt.preventDefault();

        //get user input and make it lower case
        let userAnswer = $('input').val().toLowerCase();


        if(userAnswer === ''){
            // or else if (!userAnser) という書き方もあり
            this.showMessage('Please enter a word', 'err');
            return;
        }

        //check if user already input the same word
        if(this.userAnswerList.has(userAnswer)){
            this.showMessage(`You entered ${userAnswer} already. Please find other words`, 'err')
            $('input').val('').focus();
            return;
        }
        
        
        // sends post request to backend and get response to show result
              
        // by default, axios sends Post data it passes as JSON
        const res = await axios.get('/check-answer', {params: {answer: userAnswer}});
        if(res.data.result === 'not-word'){
            this.showMessage(`${userAnswer} is not a valid English word`, 'err');
            console.log('showmessage when answer is not valid')
        } else if(res.data.result === 'not-on-board'){
            this.showMessage(`${userAnswer} is not on this board`, 'err');
            console.log('showmessage when aswer is not on this board')
        } else {
            //add to set of user answers
            this.userAnswerList.add(userAnswer);
            //update score and show
            this.totalScore += userAnswer.length;
            this.showScore();
            this.showMessage(`${userAnswer} is a valid English word`, 'ok');
            console.log('showmessage when answer is ok')
        }
           
        $('input').val('').focus();
    }

     async gameover(){
        clearInterval(this.timer);
        //hide the count down section
        $('.timer-section').hide();
        //hide user input form so user can no longer enter
        $('#answerForm').hide();
        //show "play again!" button
        $('.restart-btn').show();
        //assign empty list to the list that was made to check duplicate answers
        this.userAnswerList = [];
        //======sending user scoare and number thorugh axios =====//
        const res = await axios.post('/store-user-data', { score : this.totalScore});
        if(res.data.brokeRecord) {
            this.showMessage(`New Record: ${this.totalScore}`, 'ok')
        } else {
            this.showMessage(`Final Score: ${this.totalScore}`, 'ok')
        }
    }




}
// const $submitBtn = $('#submitBtn');
// const input = document.querySelector('input');
// const $table = $('table');
// const $startBtn = $('#start');

// let total = 0; //using this total for keeping the score
// let userAnswerList = []; //using this list to check if user is not inputing the same word twice.

// //======Sending User Answer with Axios and Checking Request ====//

// //takes res from backend and shows wether user input is valid answer or not on HTML//
// function showResult(res){
//     $('.result').text(`your answer is ${res}`)
// }

// //shows score on html
// function score(){
//     $('.score').text(total);
// }

// async function submitAnswerAndShowResult(){
//     //get user input and make it lower case
//     let userAnswer = $('input').val().toLowerCase();
//     //check if user already input the same word
//     if(userAnswerList.includes(userAnswer)){
//         $('.result').text(`You entered ${userAnswer} already. Please find other words`)
//         input.value ='';
//     //check if user input any words
//     } else if(userAnswer === ''){
//         $('.result').text('Please enter a word')
//     // sends post request to backend and get response to show result
//     } else {
//         userAnswerList.push(userAnswer)
//            // but default, axios sends Post data it passes as JSON
//         let res = await axios.post('/check-answer', {answer: userAnswer});
//         showResult(res.data.result);
//         console.log(res.data.result);
//         if (res.data.result == 'ok'){
//         totalScore += userAnswer.length;
//         }
//     }
//     score();
// }

// //show the score 0 first
// score();

// //EVENT======submitting user ansewr======//
// $submitBtn.click(function(evt){
//     console.log('submitBtn');
//     evt.preventDefault();
//     submitAnswerAndShowResult()
//     input.value ='';
//     }
// )


// // ==== setting up count down and disable submit botton =======///
// // put count down from 60 and disable the submit button once the clock reaches the 0
// //Most of the code below is from Sample Game Timer by Tony Kay on codepen (https://codepen.io/awkay/pen/ExzGea)
// let timer;
// let timeLeft = 60;//seconds

// async function gameover(){
//     clearInterval(timer);
//     //hide the count down section
//     $('.timer-section').hide();
//     //hide user input form so user can no longer enter
//     $('#answerForm').hide();
//     //show "play again!" button
//     $('.restart-btn').show();
//     //assign empty list to the list that was made to check duplicate answers
//     userAnswerList = [];
//     //======sending user scoare and number thorugh axios =====//
//     await axios.post('/store-user-data', { score : totalScore});

// }

// //count down from 60 until 0, when it reaches to 0, gameover function is fired.
// function updateTimer(){
//     timeLeft -= 1;
//     if(timeLeft >= 0){
//         $('.timer').html(timeLeft)
//     } else {
//         gameover();
//     }
// }

// //start the timer
// function start(){
//     timer = setInterval(updateTimer, 1000)
// }

// //EVENT======start the game======//
// $startBtn.click(function(evt){
//     evt.preventDefault();
//     console.log('startBtn');
//     //hide the star button so user cannot click it again
//     $startBtn.hide();
//     //show 60 (if I don't have this, countdown will show up from 59)
//     $('.timer').html(timeLeft);
//     //show "you have XX seconds remaining"
//     $('.timer-section').show();
//     //start the timer
//     start();
// })







