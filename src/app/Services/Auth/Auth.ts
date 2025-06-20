import { Usuario } from "../usuario/usuario";

export interface Auth {
    id_auth: number;
    username: string;
    password: string;
    usuario: Usuario;
    authorities:string[]
}