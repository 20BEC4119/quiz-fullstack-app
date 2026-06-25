let questions = []
const questionElement = document.getElementById("question");
const answerButtons = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");

async function loadQuestions() {
    try {
        const response =
            await fetch("http://localhost:5000/questions");

        questions = await response.json();

        startQuiz();
    }
    catch(error) {
        console.error(error);
    }
}


let currentQuestionIndex = 0;
let score = 0; 

function startQuiz(){
    currentQuestionIndex = 0;
    score = 0;
    nextButton.innerHTML = "Next";
    showQuestion();
}
function showQuestion() {
    resetstate();

    let currentQuestion = questions[currentQuestionIndex];
    let questionNo = currentQuestionIndex + 1;

    questionElement.innerHTML =
        questionNo + ". " + currentQuestion.question;

    const options = [
        currentQuestion.option1,
        currentQuestion.option2,
        currentQuestion.option3,
        currentQuestion.option4
    ];

    options.forEach(option => {
        const button = document.createElement("button");

        button.textContent = option;
        button.classList.add("btn");

        if (option === currentQuestion.answer) {
            button.dataset.correct = "true";
        }

        button.addEventListener("click", selectAnswer);

        answerButtons.appendChild(button);
    });
}
function resetstate(){
    nextButton.style.display="none";
    while (answerButtons.firstChild){
        answerButtons.removeChild(answerButtons.firstChild); 
    }

}
function selectAnswer(e) {
    const selectedBtn = e.target;
    const isCorrect = selectedBtn.dataset.correct === "true";
    if(isCorrect) {
        selectedBtn.classList.add("correct");
        score++
    }else{
        selectedBtn.classList.add("incorrect");
    }
    Array.from(answerButtons.children).forEach(button => {
        if(button.dataset.correct === "true"){
            button.classList.add("correct");
        }
        button.disabled = true;
    });
    nextButton.style.display = "block";
}
function showScore() {
    resetstate();

    const previousScore = localStorage.getItem("lastScore");

    questionElement.innerHTML =
        `You scored ${score} out of ${questions.length}!`;

    if (previousScore !== null) {
        questionElement.innerHTML +=
            `<br><br>Previous Score: ${previousScore}`;
    }

    localStorage.setItem("lastScore", score);

    nextButton.innerHTML = "Play Again";
    nextButton.style.display = "block";
}
function handleNextButton(){
    currentQuestionIndex++;
    if(currentQuestionIndex < questions.length){
        showQuestion()
    }else{
        showScore();
    }
    }
nextButton.addEventListener("click", ()=>{
    if(currentQuestionIndex < questions.length){
        handleNextButton();
    }else{
        startQuiz()
    }
});
loadQuestions();
