class Calculator {
    sum(a, b) {
        return a + b;
    }
}

describe('calculator add', () => {
    it('positive add positive', () => {
        let calculator = new Calculator;
        let sum = calculator.sum(1, 2);
        expect(sum).toBe(3);
    });
});