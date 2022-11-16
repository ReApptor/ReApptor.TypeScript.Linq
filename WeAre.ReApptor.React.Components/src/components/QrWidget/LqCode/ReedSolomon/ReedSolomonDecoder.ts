import GenericGF from "./GenericGF";
import GenericGFPoly from "./GenericGFPoly";


export default class ReedSolomonDecoder {
    private readonly field: GenericGF;

    constructor(field: GenericGF) {
        this.field = field;
    }

    public decode(received: number[], twoS: number): void {
        const poly: GenericGFPoly = new GenericGFPoly(this.field, received);
        const syndromeCoefficients: number[] = new Array(twoS);
        let noError: boolean = true;

        for (let i: number = 0; i < twoS; ++i) {
            const evalNumber: number = poly.evaluateAt(this.field.exp(i + this.field.getGeneratorBase()));
            syndromeCoefficients[syndromeCoefficients.length - 1 - i] = evalNumber;
            if (evalNumber != 0) {
                noError = false;
            }
        }

        if (!noError) {
            const syndrome: GenericGFPoly = new GenericGFPoly(this.field, syndromeCoefficients);
            const sigmaOmega: GenericGFPoly[] = this.runEuclideanAlgorithm(this.field.buildMonomial(twoS, 1), syndrome, twoS);
            const sigma: GenericGFPoly = sigmaOmega[0];
            const omega: GenericGFPoly = sigmaOmega[1];
            const errorLocations: number[] = this.findErrorLocations(sigma);
            const errorMagnitudes: number[] = this.findErrorMagnitudes(omega, errorLocations);

            for (let i: number = 0; i < errorLocations.length; ++i) {
                const position: number = received.length - 1 - this.field.log(errorLocations[i]);
                if (position < 0) {
                    throw new Error("ReedSolomonException: Bad error location");
                }

                received[position] = GenericGF.addOrSubtract(received[position], errorMagnitudes[i]);
            }
        }
    }

    private runEuclideanAlgorithm(a: GenericGFPoly, b: GenericGFPoly, R: number): GenericGFPoly[] {
        let rLast: GenericGFPoly;
        if (a.getDegree() < b.getDegree()) {
            rLast = a;
            a = b;
            b = rLast;
        }

        rLast = a;
        let r: GenericGFPoly = b;
        let tLast: GenericGFPoly = this.field.getZero();
        let t: GenericGFPoly = this.field.getOne();

        do {
            let q: GenericGFPoly;
            if (r.getDegree() < R / 2) {
                const sigmaTildeAtZero: number = t.getCoefficient(0);
                if (sigmaTildeAtZero == 0) {
                    throw new Error("ReedSolomonException: sigmaTilde(0) was zero");
                }

                const inverse: number = this.field.inverse(sigmaTildeAtZero);
                q = t.multiply(inverse);
                const omega: GenericGFPoly = r.multiply(inverse);
                return [q, omega];
            }

            let rLastLast: GenericGFPoly = rLast;
            let tLastLast: GenericGFPoly = tLast;
            rLast = r;
            tLast = t;
            if (r.isZero()) {
                throw new Error("ReedSolomonException: r_${i-1} was zero");
            }

            r = rLastLast;
            q = this.field.getZero();
            const denominatorLeadingTerm: number = rLast.getCoefficient(rLast.getDegree());

            let degreeDiff: number;
            let scale: number;
            for (let dltInverse: number = this.field.inverse(denominatorLeadingTerm); r.getDegree() >= rLast.getDegree() && !r.isZero(); r = r.addOrSubtract(rLast.multiplyByMonomial(degreeDiff, scale))) {
                degreeDiff = r.getDegree() - rLast.getDegree();
                scale = this.field.multiply(r.getCoefficient(r.getDegree()), dltInverse);
                q = q.addOrSubtract(this.field.buildMonomial(degreeDiff, scale));
            }

            t = q.multiply(t).addOrSubtract(tLastLast);
        } while (r.getDegree() < rLast.getDegree());

        throw new Error("IllegalStateException: Division algorithm failed to reduce polynomial?");
    }

    private findErrorLocations(errorLocator: GenericGFPoly): number[] {
        const numErrors: number = errorLocator.getDegree();
        if (numErrors == 1) {
            return [errorLocator.getCoefficient(1)];
        } else {
            const result: number[] = new Array(numErrors);
            let e: number = 0;

            for (let i: number = 1; i < this.field.getSize() && e < numErrors; ++i) {
                if (errorLocator.evaluateAt(i) == 0) {
                    result[e] = this.field.inverse(i);
                    ++e;
                }
            }

            if (e != numErrors) {
                throw new Error("ReedSolomonException: Error locator degree does not match number of roots");
            } else {
                return result;
            }
        }
    }

    private findErrorMagnitudes(errorEvaluator: GenericGFPoly, errorLocations: number[]): number[] {
        const s: number = errorLocations.length;
        const result: number[] = new Array(s);

        for (let i: number = 0; i < s; ++i) {
            const xiInverse: number = this.field.inverse(errorLocations[i]);
            let denominator: number = 1;

            for (let j: number = 0; j < s; ++j) {
                if (i != j) {
                    const term: number = this.field.multiply(errorLocations[j], xiInverse);
                    const termPlus1: number = (term & 1) == 0 ? term | 1 : term & -2;
                    denominator = this.field.multiply(denominator, termPlus1);
                }
            }

            result[i] = this.field.multiply(errorEvaluator.evaluateAt(xiInverse), this.field.inverse(denominator));
            if (this.field.getGeneratorBase() != 0) {
                result[i] = this.field.multiply(result[i], xiInverse);
            }
        }

        return result;
    }
}