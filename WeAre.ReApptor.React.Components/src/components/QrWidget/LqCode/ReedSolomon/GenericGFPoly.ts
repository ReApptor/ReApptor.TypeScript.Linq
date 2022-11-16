import GenericGF from "./GenericGF";
import System from "../System";


export default class GenericGFPoly {
    private readonly field: GenericGF;
    private readonly coefficients: number[];

    constructor(field: GenericGF, coefficients: number[]) {
        if (coefficients.length == 0) {
            throw new Error("IllegalArgumentException");
        } else {
            this.field = field;
            const coefficientsLength: number = coefficients.length;
            if (coefficientsLength > 1 && coefficients[0] == 0) {
                let firstNonZero: number;
                for(firstNonZero = 1; firstNonZero < coefficientsLength && coefficients[firstNonZero] == 0; ++firstNonZero) {
                }

                if (firstNonZero == coefficientsLength) {
                    this.coefficients = [0];
                } else {
                    this.coefficients = new Array(coefficientsLength - firstNonZero);
                    System.arraycopy(coefficients, firstNonZero, this.coefficients, 0, this.coefficients.length);
                }
            } else {
                this.coefficients = coefficients;
            }

        }
    }

    public getCoefficients(): number[] {
        return this.coefficients;
    }

    public getDegree(): number {
        return this.coefficients.length - 1;
    }

    public isZero(): boolean {
        return this.coefficients[0] == 0;
    }

    public getCoefficient(degree: number): number {
        return this.coefficients[this.coefficients.length - 1 - degree];
    }

    public evaluateAt(a: number): number {
        if (a == 0) {
            return this.getCoefficient(0);
        } else {
            const size: number = this.coefficients.length;
            let result;
            if (a == 1) {
                result = 0;
                const arr$: number[] = this.coefficients;
                const len$: number = arr$.length;

                for(let i$: number = 0; i$ < len$; ++i$) {
                    const coefficient: number = arr$[i$];
                    result = GenericGF.addOrSubtract(result, coefficient);
                }

                return result;
            } else {
                result = this.coefficients[0];

                for(let i: number = 1; i < size; ++i) {
                    result = GenericGF.addOrSubtract(this.field.multiply(a, result), this.coefficients[i]);
                }

                return result;
            }
        }
    }

    public addOrSubtract(other: GenericGFPoly): GenericGFPoly {
        if (!this.field.equals(other.field)) {
            throw new Error("IllegalArgumentException: GenericGFPolys do not have same GenericGF field");
        } else if (this.isZero()) {
            return other;
        } else if (other.isZero()) {
            return this;
        } else {
            let smallerCoefficients: number[] = this.coefficients;
            let largerCoefficients: number[] = other.coefficients;
            let sumDiff: number[];
            if (smallerCoefficients.length > largerCoefficients.length) {
                sumDiff = smallerCoefficients;
                smallerCoefficients = largerCoefficients;
                largerCoefficients = sumDiff;
            }

            sumDiff = new Array(largerCoefficients.length);
            const lengthDiff: number = largerCoefficients.length - smallerCoefficients.length;
            System.arraycopy(largerCoefficients, 0, sumDiff, 0, lengthDiff);

            for(let i: number = lengthDiff; i < largerCoefficients.length; ++i) {
                sumDiff[i] = GenericGF.addOrSubtract(smallerCoefficients[i - lengthDiff], largerCoefficients[i]);
            }

            return new GenericGFPoly(this.field, sumDiff);
        }
    }

    public multiply(otherOrScalar: GenericGFPoly | number): GenericGFPoly {
        return (typeof otherOrScalar === "number")
            ? this.multiplyScalar(otherOrScalar)
            : this.multiplyPoly(otherOrScalar);
    }

    public multiplyPoly(other: GenericGFPoly): GenericGFPoly {
        if (!this.field.equals(other.field)) {
            throw new Error("IllegalArgumentException: GenericGFPolys do not have same GenericGF field");
        } else if (!this.isZero() && !other.isZero()) {
            const aCoefficients: number[] = this.coefficients;
            const aLength: number = aCoefficients.length;
            const bCoefficients: number[] = other.coefficients;
            const bLength: number = bCoefficients.length;
            const product: number[] = new Array(aLength + bLength - 1);

            for(let i: number = 0; i < aLength; ++i) {
                const aCoeff: number = aCoefficients[i];

                for(let j: number = 0; j < bLength; ++j) {
                    product[i + j] = GenericGF.addOrSubtract(product[i + j], this.field.multiply(aCoeff, bCoefficients[j]));
                }
            }

            return new GenericGFPoly(this.field, product);
        } else {
            return this.field.getZero();
        }
    }

    public multiplyScalar(scalar: number): GenericGFPoly {
        if (scalar == 0) {
            return this.field.getZero();
        } else if (scalar == 1) {
            return this;
        } else {
            const size: number = this.coefficients.length;
            const product: number[] = new Array(size);

            for(let i: number = 0; i < size; ++i) {
                product[i] = this.field.multiply(this.coefficients[i], scalar);
            }

            return new GenericGFPoly(this.field, product);
        }
    }

    public multiplyByMonomial(degree: number, coefficient: number): GenericGFPoly {
        if (degree < 0) {
            throw new Error("IllegalArgumentException");
        } else if (coefficient == 0) {
            return this.field.getZero();
        } else {
            const size: number = this.coefficients.length;
            const product: number[] = new Array(size + degree);
        
            for(let i: number = 0; i < size; ++i) {
                product[i] = this.field.multiply(this.coefficients[i], coefficient);
            }
        
            return new GenericGFPoly(this.field, product);
        }
    }

    public divide(other: GenericGFPoly): GenericGFPoly[] {
        if (!this.field.equals(other.field)) {
            throw new Error("IllegalArgumentException: GenericGFPolys do not have same GenericGF field");
        } else if (other.isZero()) {
            throw new Error("IllegalArgumentException: Divide by 0");
        } else {
            let quotient: GenericGFPoly = this.field.getZero();
            let remainder: GenericGFPoly = this;
            const denominatorLeadingTerm: number = other.getCoefficient(other.getDegree());
    
            let term: GenericGFPoly;
            for(let inverseDenominatorLeadingTerm: number = this.field.inverse(denominatorLeadingTerm); remainder.getDegree() >= other.getDegree() && !remainder.isZero(); remainder = remainder.addOrSubtract(term)) {
                const degreeDifference: number = remainder.getDegree() - other.getDegree();
                const scale: number = this.field.multiply(remainder.getCoefficient(remainder.getDegree()), inverseDenominatorLeadingTerm);
                term = other.multiplyByMonomial(degreeDifference, scale);
                const iterationQuotient: GenericGFPoly = this.field.buildMonomial(degreeDifference, scale);
                quotient = quotient.addOrSubtract(iterationQuotient);
            }
    
            return [quotient, remainder];
        }
    }

    public toString(): string {
        let result: string = "";
    
        for(let degree: number = this.getDegree(); degree >= 0; --degree) {
            let coefficient: number = this.getCoefficient(degree);
            if (coefficient != 0) {
                if (coefficient < 0) {
                    result += " - ";
                    coefficient = -coefficient;
                } else if (result.length > 0) {
                    result += " + ";
                }
    
                if (degree == 0 || coefficient != 1) {
                    const alphaPower: number = this.field.log(coefficient);
                    if (alphaPower == 0) {
                        result += '1';
                    } else if (alphaPower == 1) {
                        result += 'a';
                    } else {
                        result += "a^";
                        result += alphaPower;
                    }
                }
    
                if (degree != 0) {
                    if (degree == 1) {
                        result += 'x';
                    } else {
                        result += "x^";
                        result += degree;
                    }
                }
            }
        }
    
        return result;
    }
}