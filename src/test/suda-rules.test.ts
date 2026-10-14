import { describe, it, expect } from 'vitest';
import { initialOpportunities, categories, emptyFilters, filterOpportunities, enrollCourse, canAccessZoom, clampProgress, validateOpportunity } from '@/features/suda/mock-data';
describe('Suda report rules',()=>{
 it('contains exactly the four reported opportunity types',()=>expect([...new Set(initialOpportunities.map(o=>o.type))]).toEqual([...categories]));
 it('combines Arabic keyword, category and mode filters',()=>{expect(filterOpportunities(initialOpportunities,{...emptyFilters,query:'الباترون',type:'الدورات',mode:'عن بُعد'}).map(o=>o.id)).toEqual(['pattern']);expect(filterOpportunities(initialOpportunities,{...emptyFilters,query:'الباترون',type:'الدورات',mode:'حضوري'})).toHaveLength(0);});
 it('clearing filters restores all opportunities',()=>expect(filterOpportunities(initialOpportunities,{...emptyFilters})).toHaveLength(8));
 it('only free courses support enrollment, without duplicates',()=>{const course=initialOpportunities[0];const competition=initialOpportunities[1];expect(enrollCourse([],competition)).toEqual([]);const enrolled=enrollCourse([],course);expect(enrollCourse(enrolled,course)).toHaveLength(1);});
 it('Zoom is accessible only after local enrollment',()=>{expect(canAccessZoom([],'pattern')).toBe(false);expect(canAccessZoom(enrollCourse([],initialOpportunities[0]),'pattern')).toBe(true);});
 it('manual learning progress stays within zero to one hundred',()=>{expect(clampProgress(-10)).toBe(0);expect(clampProgress(150)).toBe(100);expect(clampProgress(63)).toBe(63);});
 it('admin opportunity forms reject each missing required field',()=>{const full=initialOpportunities[0];expect(validateOpportunity(full)).toBe(true);for(const key of ['title','organization','description','requirements'] as const)expect(validateOpportunity({...full,[key]:' '})).toBe(false);});
 it('mock opportunities never fabricate official URLs',()=>expect(initialOpportunities.every(o=>!o.externalUrl)).toBe(true));
});
