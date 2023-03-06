interface Question {
  questionText: string;
  answers: Answer[];
}

interface Answer {
  text: string;
  isCorrect: boolean;
}

interface QuestionDatabase {
  questionText: string;
  answers:{
    [answer:string]:boolean
  }
}

interface AnswerDatabase {
    [answer: string]: boolean;
}


  export { type Question, type Answer, type QuestionDatabase, type AnswerDatabase }
