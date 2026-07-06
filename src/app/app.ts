import { Component } from '@angular/core';
import { Scene3d } from './components/scene3d/scene3d';
import { SocialSidebar } from './components/social-sidebar/social-sidebar';
import { Header } from './components/header/header';
import { Hero } from './components/hero/hero';
import { About } from './components/about/about';
import { Skills } from './components/skills/skills';
import { Experience } from './components/experience/experience';
import { Projects } from './components/projects/projects';
import { Education } from './components/education/education';
import { ResumeSection } from './components/resume-section/resume-section';
import { ResumeModal } from './components/resume-modal/resume-modal';
import { Contact } from './components/contact/contact';

@Component({
  selector: 'app-root',
  imports: [
    Scene3d,
    SocialSidebar,
    Header,
    Hero,
    About,
    Skills,
    Experience,
    Projects,
    Education,
    ResumeSection,
    ResumeModal,
    Contact,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
