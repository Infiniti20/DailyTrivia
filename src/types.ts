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

interface GameState{
  name:string,
  question:string,
  questionIndex:number,
  answers:Answer[],
  countdown:number,
  hasAnswered:boolean,
  hasStarted:boolean
  totalPoints: number
}

  export { type Question, type Answer, type QuestionDatabase, type AnswerDatabase, type GameState }
