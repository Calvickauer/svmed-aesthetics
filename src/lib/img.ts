import data from '../data/images.json';
import { u } from './site';

export type Variant = [string, number];
export type ImgEntry = { w: number; h: number; alpha?: boolean; svg?: boolean; src?: string; avif: Variant[]; webp: Variant[] };

const DB = data as unknown as Record<string, ImgEntry>;

export function getImg(rel: string): ImgEntry {
  const e = DB[rel];
  if (!e) throw new Error(`[img] Unknown image "${rel}". Run "npm run images" or check the path.`);
  return e;
}

export const srcset = (vs: Variant[]) => vs.map(([p, w]) => `${u('/' + p)} ${w}w`).join(', ');

/** A sensible single-URL fallback (e.g. for CSS backgrounds or og:image). */
export function pick(rel: string, target = 1280, fmt: 'webp' | 'avif' = 'webp'): string {
  const e = getImg(rel);
  if (e.svg) return u('/' + e.src);
  const vs = e[fmt];
  const best = vs.find(([, w]) => w >= target) ?? vs[vs.length - 1];
  return u('/' + best[0]);
}
