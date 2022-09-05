const $submitBtn = $('#submitBtn');
const input = document.querySelector('input');
const $table = $('table');
const $startBtn = $('#start');

let total = 0; //using this total for keeping the score
let userAnswerList = []; //using this list to check if user is not inputing the same word twice.

//======Sending User Answer with Axios and Checking Request ====//

//takes res from backend and shows wether user input is valid answer or not on HTML//
function showResult(res){
    $('.result').text(`your answer is ${res}`)
}

//shows score on html
function score(){
    $('.score').text(total);
}

async function submitAnswerAndShowResult(){
    //get user input and make it lower case
    let userAnswer = $('input').val().toLowerCase();
    //check if user already input the same word
    if(userAnswerList.includes(userAnswer)){
        $('.result').text(`You entered ${userAnswer} already. Please find other words`)
        input.value ='';
    //check if user input any words
    } else if(userAnswer === ''){
        $('.result').text('Please enter a word')
    // sends post request to backend and get response to show result
    } else {
        userAnswerList.push(userAnswer)
           // but default, axios sends Post data it passes as JSON
        let res = await axios.post('/check-answer', {answer: userAnswer});
        showResult(res.data.result);
        console.log(res.data.result);
        if (res.data.result == 'ok'){
        total += userAnswer.length;
        }
    }
    score();
}

//show the score 0 first
score();

//EVENT======submitting user ansewr======//
$submitBtn.click(function(evt){
    console.log('submitBtn');
    evt.preventDefault();
    submitAnswerAndShowResult()
    input.value ='';
    }
)


// ==== setting up count down and disable submit botton =======///
// put count down from 60 and disable the submit button once the clock reaches the 0
//Most of the code below is from Sample Game Timer by Tony Kay on codepen (https://codepen.io/awkay/pen/ExzGea)
let timer;
let timeLeft = 60;//seconds

async function gameover(){
    clearInterval(timer);
    //hide the count down section
    $('.timer-section').hide();
    //hide user input form so user can no longer enter
    $('#answerForm').hide();
    //show "play again!" button
    $('.restart-btn').show();
    //assign empty list to the list that was made to check duplicate answers
    userAnswerList = [];
    //======sending user scoare and number thorugh axios =====//
    await axios.post('/store-user-data', { score : total});

}

//count down from 60 until 0, when it reaches to 0, gameover function is fired.
function updateTimer(){
    timeLeft -= 1;
    if(timeLeft >= 0){
        $('.timer').html(timeLeft)
    } else {
        gameover();
    }
}

//start the timer
function start(){
    timer = setInterval(updateTimer, 1000)
}

//EVENT======start the game======//
$startBtn.click(function(evt){
    evt.preventDefault();
    console.log('startBtn');
    //hide the star button so user cannot click it again
    $startBtn.hide();
    //show 60 (if I don't have this, countdown will show up from 59)
    $('.timer').html(timeLeft);
    //show "you have XX seconds remaining"
    $('.timer-section').show();
    //start the timer
    start();
})






