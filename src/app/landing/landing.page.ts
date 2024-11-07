import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router'; // Importa Router para la navegación
import Swiper from 'swiper';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.page.html',
  styleUrls: ['./landing.page.scss'],
})
export class LandingPage implements OnInit {
  isButtonEnabled = false; // Variable para habilitar el botón

  @ViewChild('swiperContainer', { static: false }) swiperContainer!: Swiper;

  constructor(private router: Router) {} // Inyecta el Router

  ngOnInit() {}

  // Método que se llama cada vez que cambia el slide
  onSlideChange(event: any) {
    const totalSlides = event.swiper.slides.length; // Total de slides
    const currentIndex = event.swiper.activeIndex; // Índice del slide activo
  
    console.log(`Current Index: ${currentIndex}, Total Slides: ${totalSlides}`);
  
    // Habilitar el botón solo si está en el tercer slide (índice 2)
    this.isButtonEnabled = currentIndex === totalSlides - 1;
  }

  // Método que se llama cuando se hace clic en el botón "Seguir"
  onNext() {
    console.log('Botón "Seguir" presionado');
    this.router.navigate(['/login']); // Navega a la página de inicio de sesión
  }
}
