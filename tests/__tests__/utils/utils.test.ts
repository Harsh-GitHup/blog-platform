import { cn, formatDate, formatShortDate, calculateReadingTime } from "../../../lib/utils";

describe("Utils", () => {
    describe("cn", () => {
        it("should merge class names correctly", () => {
            expect(cn("p-4", "m-4")).toBe("p-4 m-4");
        });

        it("should resolve tailwind conflicts", () => {
            expect(cn("px-2 py-1", "p-4")).toBe("p-4");
        });

        it("should handle conditional classes", () => {
            expect(cn("text-sm", true && "font-bold", false && "hidden")).toBe("text-sm font-bold");
        });
    });

    describe("formatDate", () => {
        it("should format date to long format", () => {
            const date = new Date("2024-01-15T00:00:00Z");
            expect(formatDate(date)).toBe("January 15, 2024");
        });

        it("should accept string date", () => {
            expect(formatDate("2024-01-15T00:00:00Z")).toBe("January 15, 2024");
        });
    });

    describe("formatShortDate", () => {
        it("should format date to short format", () => {
            const date = new Date("2024-01-15T00:00:00Z");
            expect(formatShortDate(date)).toBe("Jan 15, 2024");
        });

        it("should accept string date for short format", () => {
            expect(formatShortDate("2024-01-15T00:00:00Z")).toBe("Jan 15, 2024");
        });
    });

    describe("calculateReadingTime", () => {
        it("should calculate reading time correctly for short text", () => {
            const text = "This is a short text.";
            expect(calculateReadingTime(text)).toBe(1);
        });

        it("should calculate reading time for longer text based on 200 wpm", () => {
            // Generate 400 words
            const text = Array(400).fill("word").join(" ");
            expect(calculateReadingTime(text)).toBe(2);
        });
        
        it("should round up for partial minutes", () => {
            // Generate 201 words, should take 2 minutes (ceiling of 201 / 200)
            const text = Array(201).fill("word").join(" ");
            expect(calculateReadingTime(text)).toBe(2);
        });
    });
});
