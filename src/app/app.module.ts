import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Módulo para trabajar con formularios
import { BrowserModule } from '@angular/platform-browser'; // Módulo base para aplicaciones Angular en el navegador
import { RouteReuseStrategy } from '@angular/router'; // Estrategia de reutilización de rutas
import { IonicModule, IonicRouteStrategy } from '@ionic/angular'; // Módulos para funcionalidades de Ionic
import { AppComponent } from './app.component'; // Componente principal de la aplicación
import { AppRoutingModule } from './app-routing.module'; // Configuración de rutas de la aplicación

@NgModule({
  declarations: [AppComponent], // Declaración del componente principal
  imports: [
    BrowserModule, // Funcionalidad base del navegador
    IonicModule.forRoot(), // Configuración inicial de Ionic
    AppRoutingModule, // Rutas de la aplicación
    FormsModule // Funcionalidad para manejar formularios
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy } // Estrategia personalizada para reutilización de rutas
  ],
  bootstrap: [AppComponent], // Punto de inicio de la aplicación
})
export class AppModule {}
