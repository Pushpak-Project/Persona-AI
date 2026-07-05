import { hiteshPersona } from "./hitesh.js";
import { piyushPersona } from "./piyush.js";

const personas = [
  hiteshPersona,
  piyushPersona,
];

export function getPersona(id) {
  return personas.find((p) => p.id === id);
}

export function listPersonas() {
  return personas.map(
    ({ id, name, description, pipeline }) => ({
      id,
      name,
      description,
      pipeline,
    })
  );
}