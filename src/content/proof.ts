import { proofCollectionsSchema } from "./schemas";

export const proof = proofCollectionsSchema.parse({
  testimonials: [],
  certifications: [],
  metrics: [],
});
