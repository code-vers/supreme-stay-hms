export type AuthUser = {
    userId: string;
    email: string;
    roleId?: string | null;
    roleName?: string | null;
};
export declare const CurrentUser: (...dataOrPipes: (keyof AuthUser | import("@nestjs/common").PipeTransform<any, any> | import("@nestjs/common").Type<import("@nestjs/common").PipeTransform<any, any>> | undefined)[]) => ParameterDecorator;
