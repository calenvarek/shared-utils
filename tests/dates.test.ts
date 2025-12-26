/**
 * Tests for date utilities
 */

import { describe, it, expect } from 'vitest';
import { create as createDateUtility, validTimezones } from '../src/dates';

describe('Date Utilities', () => {
    const dates = createDateUtility({ timezone: 'America/New_York' });
    const datesUTC = createDateUtility({ timezone: 'UTC' });

    describe('create', () => {
        it('should create date utility with timezone', () => {
            expect(dates).toBeDefined();
            expect(dates.now).toBeDefined();
        });

        it('should support multiple timezones', () => {
            const london = createDateUtility({ timezone: 'Europe/London' });
            expect(london).toBeDefined();
        });
    });

    describe('now', () => {
        it('should return current date', () => {
            const now = dates.now();
            expect(now).toBeInstanceOf(Date);
        });

        it('should return a recent date', () => {
            const now = dates.now();
            const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
            expect(now.getTime()).toBeGreaterThan(fiveMinutesAgo);
        });
    });

    describe('date', () => {
        it('should create date from string', () => {
            const date = dates.date('2024-01-01');
            expect(date).toBeInstanceOf(Date);
        });

        it('should create date from number (timestamp)', () => {
            const timestamp = 1704067200000; // 2024-01-01
            const date = dates.date(timestamp);
            expect(date).toBeInstanceOf(Date);
        });

        it('should create date from Date object', () => {
            const input = new Date('2024-01-01');
            const date = dates.date(input);
            expect(date).toBeInstanceOf(Date);
        });

        it('should create date from undefined (defaults to now)', () => {
            const date = dates.date(undefined);
            expect(date).toBeInstanceOf(Date);
        });

        it('should create date from null (defaults to now)', () => {
            const date = dates.date(null);
            expect(date).toBeInstanceOf(Date);
        });

        it('should throw for invalid date string', () => {
            expect(() => dates.date('invalid')).toThrow();
        });

        it('should throw for invalid date format', () => {
            expect(() => dates.date('not-a-date')).toThrow();
        });
    });

    describe('parse', () => {
        it('should parse date with format', () => {
            const date = dates.parse('2024-01-15', 'YYYY-MM-DD');
            expect(date).toBeInstanceOf(Date);
        });

        it('should parse date with custom format', () => {
            const date = dates.parse('01/15/2024', 'MM/DD/YYYY');
            expect(date).toBeInstanceOf(Date);
        });

        it('should throw for invalid format', () => {
            expect(() => dates.parse('invalid', 'YYYY-MM-DD')).toThrow();
        });
    });

    describe('format', () => {
        it('should format date as YYYY-MM-DD', () => {
            const date = dates.date('2024-01-15');
            const formatted = dates.format(date, 'YYYY-MM-DD');
            expect(formatted).toMatch(/\d{4}-\d{2}-\d{2}/);
        });

        it('should format date with time', () => {
            const date = dates.date('2024-01-15');
            const formatted = dates.format(date, 'YYYY-MM-DD HH:mm:ss');
            expect(formatted).toMatch(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/);
        });

        it('should format date with full day name', () => {
            const date = dates.date('2024-01-15'); // Monday
            const formatted = dates.format(date, 'dddd');
            expect(formatted).toBeDefined();
        });
    });

    describe('addDays', () => {
        it('should add positive days to date', () => {
            const date = dates.date('2024-01-15');
            const result = dates.addDays(date, 5);
            expect(result.getTime()).toBeGreaterThan(date.getTime());
        });

        it('should add negative days to date', () => {
            const date = dates.date('2024-01-15');
            const result = dates.addDays(date, -5);
            expect(result.getTime()).toBeLessThan(date.getTime());
        });

        it('should add zero days', () => {
            const date = dates.date('2024-01-15');
            const result = dates.addDays(date, 0);
            expect(result.getTime()).toBe(date.getTime());
        });
    });

    describe('addMonths', () => {
        it('should add months to date', () => {
            const date = dates.date('2024-01-15');
            const result = dates.addMonths(date, 1);
            expect(result.getTime()).toBeGreaterThan(date.getTime());
        });

        it('should add negative months', () => {
            const date = dates.date('2024-03-15');
            const result = dates.addMonths(date, -1);
            expect(result.getTime()).toBeLessThan(date.getTime());
        });
    });

    describe('addYears', () => {
        it('should add years to date', () => {
            const date = dates.date('2024-01-15');
            const result = dates.addYears(date, 1);
            expect(result.getTime()).toBeGreaterThan(date.getTime());
        });

        it('should add negative years', () => {
            const date = dates.date('2024-01-15');
            const result = dates.addYears(date, -1);
            expect(result.getTime()).toBeLessThan(date.getTime());
        });
    });

    describe('subDays', () => {
        it('should subtract days from date', () => {
            const date = dates.date('2024-01-15');
            const result = dates.subDays(date, 5);
            expect(result.getTime()).toBeLessThan(date.getTime());
        });

        it('should subtract negative days (adds days)', () => {
            const date = dates.date('2024-01-15');
            const result = dates.subDays(date, -5);
            expect(result.getTime()).toBeGreaterThan(date.getTime());
        });
    });

    describe('subMonths', () => {
        it('should subtract months from date', () => {
            const date = dates.date('2024-03-15');
            const result = dates.subMonths(date, 1);
            expect(result.getTime()).toBeLessThan(date.getTime());
        });
    });

    describe('subYears', () => {
        it('should subtract years from date', () => {
            const date = dates.date('2024-01-15');
            const result = dates.subYears(date, 1);
            expect(result.getTime()).toBeLessThan(date.getTime());
        });
    });

    describe('startOfMonth', () => {
        it('should return start of month', () => {
            const date = dates.date('2024-01-15');
            const start = dates.startOfMonth(date);
            expect(start.getDate()).toBe(1);
        });

        it('should be at 00:00:00 of the month', () => {
            const date = dates.date('2024-01-15');
            const start = dates.startOfMonth(date);
            expect(start.getHours()).toBe(0);
            expect(start.getMinutes()).toBe(0);
        });
    });

    describe('endOfMonth', () => {
        it('should return end of month', () => {
            const date = dates.date('2024-01-15');
            const end = dates.endOfMonth(date);
            expect(end.getDate()).toBe(31);
        });

        it('should handle months with fewer days', () => {
            const date = dates.date('2024-02-15');
            const end = dates.endOfMonth(date);
            expect(end.getDate()).toBe(29); // 2024 is a leap year
        });
    });

    describe('startOfYear', () => {
        it('should return start of year', () => {
            const date = dates.date('2024-06-15');
            const start = dates.startOfYear(date);
            expect(start.getMonth()).toBe(0); // January
            expect(start.getDate()).toBe(1);
        });
    });

    describe('endOfYear', () => {
        it('should return end of year', () => {
            const date = dates.date('2024-06-15');
            const end = dates.endOfYear(date);
            expect(end.getMonth()).toBe(11); // December
            expect(end.getDate()).toBe(31);
        });
    });

    describe('isBefore', () => {
        it('should return true if first date is before second', () => {
            const date1 = dates.date('2024-01-01');
            const date2 = dates.date('2024-01-02');
            expect(dates.isBefore(date1, date2)).toBe(true);
        });

        it('should return false if first date is after second', () => {
            const date1 = dates.date('2024-01-02');
            const date2 = dates.date('2024-01-01');
            expect(dates.isBefore(date1, date2)).toBe(false);
        });

        it('should return false if dates are equal', () => {
            const date1 = dates.date('2024-01-01');
            const date2 = dates.date('2024-01-01');
            expect(dates.isBefore(date1, date2)).toBe(false);
        });
    });

    describe('isAfter', () => {
        it('should return true if first date is after second', () => {
            const date1 = dates.date('2024-01-02');
            const date2 = dates.date('2024-01-01');
            expect(dates.isAfter(date1, date2)).toBe(true);
        });

        it('should return false if first date is before second', () => {
            const date1 = dates.date('2024-01-01');
            const date2 = dates.date('2024-01-02');
            expect(dates.isAfter(date1, date2)).toBe(false);
        });

        it('should return false if dates are equal', () => {
            const date1 = dates.date('2024-01-01');
            const date2 = dates.date('2024-01-01');
            expect(dates.isAfter(date1, date2)).toBe(false);
        });
    });

    describe('validTimezones', () => {
        it('should return list of valid timezones', () => {
            const timezones = validTimezones();
            expect(Array.isArray(timezones)).toBe(true);
            expect(timezones.length).toBeGreaterThan(0);
        });

        it('should include common timezones', () => {
            const timezones = validTimezones();
            expect(timezones).toContain('America/New_York');
            expect(timezones).toContain('America/Los_Angeles');
            expect(timezones).toContain('Europe/London');
            expect(timezones).toContain('UTC');
        });

        it('should return same timezones across calls', () => {
            const timezones1 = validTimezones();
            const timezones2 = validTimezones();
            expect(timezones1.length).toBe(timezones2.length);
        });
    });

    describe('timezone handling', () => {
        it('should handle timezone-aware date operations', () => {
            const date1 = dates.date('2024-01-15T12:00:00');
            const date2 = datesUTC.date('2024-01-15T12:00:00');
            expect(date1).toBeInstanceOf(Date);
            expect(date2).toBeInstanceOf(Date);
        });

        it('should preserve date across timezone conversions', () => {
            const original = dates.date('2024-01-15');
            const formatted = dates.format(original, 'YYYY-MM-DD');
            expect(formatted).toBe('2024-01-15');
        });
    });
});

