import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserRole } from "../../common/enum/user.role.enun";
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    constructor(config: ConfigService);
    validate(payload: {
        sub: string;
        email: string;
        role?: UserRole | null;
        roleId?: string | null;
        roleName?: UserRole | null;
    }): {
        userId: string;
        email: string;
        roleId: string | null;
        roleName: UserRole | null;
    };
}
export {};
