import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { CalendarWidget } from './src/features/dashboard/components/CalendarWidget.js';

// Mock dependencies
jest.mock('./src/features/dashboard/hooks/useDeadlines', () => ({
  useDeadlines: () => ({ deadlines: [] })
}));
jest.mock('./src/hooks/useCategories', () => ({
  useCategories: () => ({ categories: [] })
}));
jest.mock('./src/hooks/useAuth', () => ({
  useAuth: () => ({ user: { uid: '123' } })
}));

const html = renderToStaticMarkup(<CalendarWidget />);
console.log(html);
