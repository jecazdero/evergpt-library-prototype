import type { Person } from './types';

export const ME = 'randy';

export const PEOPLE: Person[] = [
  { id: 'randy', name: 'Randy Bell', initials: 'RB', email: 'randy.bell@foundever.com', color: '#aaefb9' },
  { id: 'ana', name: 'Ana Petrović', initials: 'AP', email: 'ana.petrovic@foundever.com', color: '#e4e4fe' },
  { id: 'mark', name: 'Mark Kelly', initials: 'MK', email: 'mark.kelly@foundever.com', color: '#fdf1d8' },
  { id: 'jovana', name: 'Jovana Stojić', initials: 'JS', email: 'jovana.stojic@foundever.com', color: '#e3f5e8' },
  { id: 'luka', name: 'Luka Marić', initials: 'LM', email: 'luka.maric@foundever.com', color: '#fdeceb' },
  { id: 'sara', name: 'Sara Novak', initials: 'SN', email: 'sara.novak@foundever.com', color: '#e0f0fb' },
];

export const personById = (id: string): Person => PEOPLE.find((p) => p.id === id) ?? PEOPLE[0];
