import { Component, OnInit } from '@angular/core';
import { interval } from 'rxjs';
import { QuestionService } from 'src/app/services/question.service';


@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnInit {
  
  public name : String="";
  public questionList : any =[];
  public currentQuestion: number = 0;
  public points: number = 0;
  counter=60;
  correctAnswer: number =0;
  incorrectAnswer: number =0;
  interval$:any;
  progress :String ="0";
  constructor(private questionService: QuestionService) { }

  ngOnInit(): void {
    this.name =  localStorage.getItem('name')!;
    this.getAllQuestion();
    this.startCounter();
  }

  getAllQuestion(){
    this.questionService.getQuestionJson()
    .subscribe(res=>{
     this.questionList = res.questions;
    })
  }
  
  nextQuestion(){
    this.currentQuestion++;
  }

  previousQuestion(){
    this.currentQuestion--;
  }

  answer(currentQue: number, option:any){

      if(option.correct){
        this.points +=10;
        this.correctAnswer++;
        this.currentQuestion++;
        this.getProgressPercentage();
      }else{
        this.points -=10;
        this.currentQuestion++;
        this.incorrectAnswer++;
        this.getProgressPercentage();
      }
  }
  startCounter(){
    this.interval$ =interval(1000)
    .subscribe(val=>{
      this.counter--;
      if(this.counter ===0){
        this.currentQuestion ++;
        this.counter =60;
        this.points -=10;
      }
    });
    setTimeout(()=>{
      this.interval$.unsubscribe();
    },600000)
  }
  stopCounter(){
    this.interval$.unsubscribe();
    this.counter=0;
  }
  resetCounter(){
    this.stopCounter();
    this.counter=60;
    this.startCounter();

  }
  resetQuiz(){
    this.resetCounter();
    this.getAllQuestion();
    this.points=0;
    this.counter=60;
    this.currentQuestion=0;
    this.progress ="0";
  }

  getProgressPercentage(){
    this.progress =((this.currentQuestion/this.questionList.length)*100).toString();
    return this.progress;
  }
}
