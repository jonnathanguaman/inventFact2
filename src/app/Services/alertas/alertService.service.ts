import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

export type TipoMensaje = 'success' | 'error' | 'warning' | 'info' | 'question';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  mensajeToast(tipo: TipoMensaje, mensajeCuerpo: string, footer: string) {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      showCloseButton: true,
      customClass: {
        popup: 'small-toast' // Aplica un estilo personalizado
      },
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      },
    });

    Toast.fire({
      icon: tipo,
      title: mensajeCuerpo,
      footer: footer
    });
  }

  mensajeConfirmacion(titulo: string, texto: string, tipo:TipoMensaje) {
    return Swal.fire({
      title: titulo,
      text: texto,
      icon: tipo,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Listo'
    })
  }

  mensajeEmergente(titulo:string,texto:string,tipo:TipoMensaje){
    return Swal.fire({
      title: titulo,
      text: texto,
      icon: tipo,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí',
      cancelButtonText: 'No'
    }).then((result) => {
      return result.isConfirmed;
    });
  }
}
