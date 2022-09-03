const $submitBtn = $('button');

async function submitAnswer(){
    
    let userAnswer = $('input').val()
    let res = await axios.post('/check-answer', {answer: userAnswer});
    return res;
}


$submitBtn.click(function(evt){
    evt.preventDefault();
    submitAnswer();
    }
)