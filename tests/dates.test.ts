/**
 * Tests for date utilities
 */

import { describe, it, expect } from 'vitest';
import { create as createDateUtility, validTimezones } from '../src/dates';

describe('Date Utilities', () => {
    const dates = createDateUtility({ timezone: 'America/New_York' });

    describe('create', () => {
        it('should create date utility with timezone', () => {
            expect(dates).toBeDefined();
            expect(dates.now).toBeDefined();
        });
    });

    describe('now', () => {
        it('should return current date', () => {
            const now = dates.now();
            expect(now).toBeInstanceOf(Date);
        });
    });

    describe('date', () => {
        it('should create date from string', () => {
            const date = dates.date('2024-01-01');
            expect(date).toBeInstanceOf(Date);
        });

        it('should throw for invalid date', () => {
            expect(() => dates.date('invalid')).toThrow();
        });
    });

    describe('format', () => {
        it('should format date', () => {
            const date = dates.date('2024-01-15');
            const formatted = dates.format(date, 'YYYY-MM-DD');
            expect(formatted).toMatch(/\d{4}-\d{2}-\d{2}/);
        });
    });

    describe('addDays', () => {
        it('should add days to date', () => {
            const date = dates.date('2024-01-15');
            const result = dates.addDays(date, 5);
            expect(result.getTime()).toBeGreaterThan(date.getTime());
        });
    });

    describe('isBefore', () => {
        it('should compare dates', () => {
            const date1 = new Date('2024-01-01');
            const date2 = new Date('2024-01-02');
            expect(dates.isBefore(date1, date2)).toBe(true);
            expect(dates.isBefore(date2, date1)).toBe(false);
        });
    });

    describe('validTimezones', () => {
        it('should return list of valid timezones', () => {
            const timezones = validTimezones();
            expect(Array.isArray(timezones)).toBe(true);
            expect(timezones.length).toBeGreaterThan(0);
            expect(timezones).toContain('America/New_York');
        });
    });
});

