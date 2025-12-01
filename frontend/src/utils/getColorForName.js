import { hashString } from "./hashString";

const colores = [
  "#F3F6FC", 
  "#E6EDF8", 
  "#96B7E3", 
  "#5E92D2", 
  "#3974BE", 
  "#295BA2", 
  "#224882",
  "#203F6C", 
  "#1F365B"  
];


export const getColorForName = (name) => {
  const hash = hashString(name);
  const index = Math.abs(hash) % colores.length;
  return colores[index];
}