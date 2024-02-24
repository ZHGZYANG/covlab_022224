import { trigger, state, style, transition, animate } from '@angular/animations';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router, Routes } from '@angular/router';
import axios from 'axios';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
  animations: [trigger('slideInOut', [
    transition(':enter', [
      style({ 
        transform: 'translateY(140%)', 
        opacity:1 
      }),
      animate('200ms ease-in', style({ 
        transform: 'translateY(0%)', 
        opacity: 0
      }))
    ]),
    transition(':leave', [
      animate('200ms ease-in', style({ transform: 'translateY(100%)',  opacity:1}))
    ])
    ]),
    trigger('slideOut', [
      transition(':leave', [
        animate('200ms ease-in', style({ 
          transform: 'translateY(-100%)',
          zIndex:-5,
          opacity: 1
        }))
      ])
    ])
  ]
})

export class LandingPageComponent implements OnInit {

  updatedString: string = ""

  totalTweets: number = 0;
  modelPosTweets: number = 0;
  cases14Change: number = 0;

  isLoading: boolean = true;

  animationState = ""

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.getLatestData();
    this.animationState = 'hidden';
    window.addEventListener('scroll', this.onScroll.bind(this));

  }
  goToApp(){
    this.router.navigate(['graphs']);
    window.scrollTo(0,0);
  }
  goToMap(){
    this.router.navigate(['map']);
    window.scrollTo(0,0);

  }
  onScroll() {
    const descriptions = document.querySelectorAll('.description');
    for (let i = 0; i < descriptions.length; i++) {

      const description = descriptions[i];
      const top = description.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
  
      if (top < windowHeight) {
        if (!description.hasAttribute('data-visible')) {
          description.setAttribute('data-visible', 'true');
          description.animate([
            { opacity: 0, transform: 'translateY(-50px)' },
            { opacity: 1, transform: 'translateY(0px)' }
          ], {
            duration: 1000,
            fill: 'forwards'
          });
        }
      }
    }
  }
  
  
  getLatestData() {
    const latestDataPromise = axios.get('https://covlab-backend-production.up.railway.app/latest');
    const statisticsPromise = axios.post('https://labelling.covlab.tech/statistics');
  
    Promise.all([latestDataPromise, statisticsPromise]).then((responses) => {
      const latestDataResponse = responses[0];
      const statisticsResponse = responses[1];
  
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);

        let month = '' + (yesterday.getMonth() + 1),
            day = '' + yesterday.getDate(),
            year = yesterday.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

      // this.updatedString = 'Last updated: ' + latestDataResponse.data.date;
      this.updatedString = 'Last updated: ' + [month, day, year].join('/');
      this.cases14Change = latestDataResponse.data.cases_14_average;
      this.modelPosTweets = statisticsResponse.data.model_positive_count;
      this.totalTweets = statisticsResponse.data.total_related_tweets_count;
      this.isLoading = false;
    });
  }
}
