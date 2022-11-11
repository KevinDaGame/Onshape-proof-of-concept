import { occurrence, transform } from "../types";

export function combineTransform(occurrence: transform, transform?: transform) {
      if (transform?.length === occurrence.length) {
        occurrence.forEach((e: number, i: number) => {
            occurrence[i] = e + transform[i];
        });
      }
        
    return occurrence;
  }
