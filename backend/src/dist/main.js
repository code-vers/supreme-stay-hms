"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const response_interceptor_1 = require("./common/interceptor/response.interceptor");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new common_1.ValidationPipe());
    app.useGlobalInterceptors(new response_interceptor_1.ResponseTransformerInterceptor());
    app.enableCors();
    await app.listen(process.env.PORT ?? 5000);
}
bootstrap().catch((err) => console.error(err));
//# sourceMappingURL=main.js.map